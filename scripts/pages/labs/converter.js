/* global PDFLib, pdfjsLib, html2canvas, QRCode, JSZip, saveAs, jspdf */

(function () {
  const toolSelect = document.getElementById("toolSelect");
  const mainFileInput = document.getElementById("mainFile");
  const signatureFileInput = document.getElementById("signatureFile");
  const htmlTextEl = document.getElementById("htmlText");
  const indicesInput = document.getElementById("indicesInput");
  const removeInput = document.getElementById("removeInput");
  const dpiInput = document.getElementById("dpiInput");
  const jpegQualityInput = document.getElementById("jpegQualityInput");

  const metaTitle = document.getElementById("metaTitle");
  const metaAuthor = document.getElementById("metaAuthor");
  const metaSubject = document.getElementById("metaSubject");
  const metaKeywords = document.getElementById("metaKeywords");

  const watermarkText = document.getElementById("watermarkText");
  const watermarkOpacity = document.getElementById("watermarkOpacity");
  const watermarkAngle = document.getElementById("watermarkAngle");

  const qrUrl = document.getElementById("qrUrl");
  const qrX = document.getElementById("qrX");
  const qrY = document.getElementById("qrY");
  const qrSize = document.getElementById("qrSize");

  const sigX = document.getElementById("sigX");
  const sigY = document.getElementById("sigY");
  const sigW = document.getElementById("sigW");

  const regexInput = document.getElementById("regexInput");

  const toolHint = document.getElementById("toolHint");
  const securityDisabledNote = document.getElementById("securityDisabledNote");

  const extraFields = document.getElementById("extraFields");
  const convertBtn = document.getElementById("convertBtn");
  const clearBtn = document.getElementById("clearBtn");
  const statusBox = document.getElementById("statusBox");
  const downloads = document.getElementById("downloads");

  const toast = document.getElementById("toast");

  const fieldIds = [
    "fieldHtmlText",
    "fieldIndices",
    "fieldRemove",
    "fieldDpi",
    "fieldJpegQuality",
    "fieldMetadata",
    "fieldMetadataAuthor",
    "fieldMetadataSubject",
    "fieldMetadataKeywords",
    "fieldWatermark",
    "fieldWatermarkOpacity",
    "fieldWatermarkAngle",
    "fieldSignature",
    "fieldSignaturePos",
    "fieldQr",
    "fieldQrPos",
    "fieldRedactor"
  ];

  function $id(id) {
    return document.getElementById(id);
  }

  function setStatus(msg) {
    statusBox.textContent = msg;
  }

  let toastTimer = null;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.dataset.show = "true";
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.dataset.show = "false";
    }, 1400);
  }

  function getSelectedFiles() {
    const files = Array.from(mainFileInput.files || []);
    return files;
  }

  function getSignatureFile() {
    const file = signatureFileInput && signatureFileInput.files && signatureFileInput.files[0];
    return file || null;
  }

  function resetDownloads() {
    downloads.innerHTML = "";
  }

  function addDownload(name, blob, filename) {
    const div = document.createElement("div");
    div.className = "dl";
    const left = document.createElement("div");
    left.innerHTML = "<strong>" + (name || "Download") + "</strong>";
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.type = "button";
    btn.textContent = "Download";
    btn.addEventListener("click", () => {
      saveAs(blob, filename || name || "download");
    });
    div.appendChild(left);
    div.appendChild(btn);
    downloads.appendChild(div);
  }

  function parseCommaInts(str) {
    if (!str) return [];
    return str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s))
      .filter((n) => Number.isFinite(n));
  }

  function parseFloatSafe(el, fallback) {
    const v = el ? Number(el.value) : NaN;
    return Number.isFinite(v) ? v : fallback;
  }

  async function readAsArrayBuffer(file) {
    return await file.arrayBuffer();
  }

  async function readFileText(file) {
    return await file.text();
  }

  // ---- pdfjs setup ----
  // Needed for rendering. If this fails, many tools will fail.
  try {
    if (window.pdfjsLib && pdfjsLib.GlobalWorkerOptions) {
      pdfjsLib.GlobalWorkerOptions.workerSrc =
        "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/build/pdf.worker.min.js";
    }
  } catch (e) {
    // ignore; pdfjs may still work without worker in some environments
  }

  // ---- tools (client-side implementations) ----
  async function pdfToText(pdfBytes) {
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const doc = await loadingTask.promise;
    let out = "";

    // Basic line clustering by y distance
    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
      setStatus("Extracting text: page " + pageNum + "/" + doc.numPages + "...");
      const page = await doc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const items = textContent.items || [];

      // Normalize to a list of {text,x,y,w,h}
      const mapped = items.map((it) => {
        const [a, b, c, d, e, f] = it.transform; // e,f are x,y in PDF units
        return {
          text: it.str,
          x: e,
          y: f,
          w: it.width || 0,
          h: it.height || 0
        };
      });

      // Sort by y descending (top to bottom)
      mapped.sort((p1, p2) => p2.y - p1.y);

      // Cluster into lines by y proximity
      const lines = [];
      const yTol = 3; // heuristic for PDF units
      for (const item of mapped) {
        let line = lines.find((l) => Math.abs(l.y - item.y) <= yTol);
        if (!line) {
          line = { y: item.y, items: [] };
          lines.push(line);
        }
        line.items.push(item);
      }

      // Sort lines top->bottom, each line left->right
      lines.sort((l1, l2) => l2.y - l1.y);
      for (const line of lines) {
        line.items.sort((i1, i2) => i1.x - i2.x);
        const lineText = line.items.map((x) => x.text).join(" ").replace(/\s+/g, " ").trim();
        if (lineText) out += lineText + "\n";
      }

      if (pageNum < doc.numPages) out += "\n";
    }

    // Light cleanup: reduce giant spacing runs
    return out.replace(/\n{3,}/g, "\n\n").trim() + "\n";
  }

  async function imagesToPdf(imageFiles) {
    const { PDFDocument, StandardFonts } = PDFLib;
    const doc = await PDFDocument.create();

    // Sort by filename for predictable order
    const files = imageFiles.slice().sort((a, b) => a.name.localeCompare(b.name));
    if (!files.length) throw new Error("No images selected.");

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      setStatus("Embedding image " + (i + 1) + "/" + files.length + ": " + f.name);
      const bytes = new Uint8Array(await readAsArrayBuffer(f));
      const lower = f.name.toLowerCase();
      const isPng = lower.endsWith(".png");
      const isJpg = lower.endsWith(".jpg") || lower.endsWith(".jpeg");

      if (!isPng && !isJpg) continue;

      const image = isPng ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
      const page = doc.addPage([image.width, image.height]);
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height
      });
    }

    const pdfBytes = await doc.save();
    return new Blob([pdfBytes], { type: "application/pdf" });
  }

  async function pdfToImagesZip(pdfBytes, dpi) {
    const zip = new JSZip();
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const doc = await loadingTask.promise;
    const scale = dpi / 72;

    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
      setStatus("Rendering page to PNG: " + pageNum + "/" + doc.numPages);
      const page = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d", { alpha: false });
      await page.render({ canvasContext: ctx, viewport }).promise;

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      zip.file("page_" + pageNum + ".png", blob);
    }

    setStatus("Creating ZIP...");
    const zipBlob = await zip.generateAsync({ type: "blob" });
    return zipBlob;
  }

  async function htmlToPdf(htmlString) {
    // Best-effort HTML->PDF by rendering to canvas and then embedding into jsPDF.
    // Works best for simple/one-screen layouts.
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.left = "-10000px";
    container.style.top = "0";
    container.style.width = "800px";
    container.innerHTML = htmlString;
    document.body.appendChild(container);

    setStatus("Rendering HTML to canvas...");
    const canvas = await html2canvas(container, { scale: 2, useCORS: true });
    document.body.removeChild(container);

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = position - pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
      heightLeft -= pageHeight;
    }

    const blob = pdf.output("blob");
    return blob;
  }

  async function pdfTableToCsv(pdfBytes) {
    // Best-effort: cluster text items into rows/columns by position and output CSV.
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const doc = await loadingTask.promise;
    const lines = [];

    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
      setStatus("Extracting table text (best-effort): page " + pageNum + "/" + doc.numPages);
      const page = await doc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const items = textContent.items || [];

      // Map to items with x/y
      const mapped = items.map((it) => {
        const e = it.transform[4];
        const f = it.transform[5];
        return { text: it.str, x: e, y: f };
      });

      // Group into rows by y
      mapped.sort((a, b) => b.y - a.y);
      const rows = [];
      const yTol = 4;
      for (const it of mapped) {
        let row = rows.find((r) => Math.abs(r.y - it.y) <= yTol);
        if (!row) {
          row = { y: it.y, cells: [] };
          rows.push(row);
        }
        row.cells.push(it);
      }

      // For this page, create column clusters by x
      const xs = mapped.map((m) => m.x).sort((a, b) => a - b);
      const clusters = [];
      const xTol = 18;
      for (const x of xs) {
        const last = clusters[clusters.length - 1];
        if (!last || Math.abs(last - x) > xTol) clusters.push(x);
      }

      rows.sort((r1, r2) => r2.y - r1.y);
      for (const row of rows) {
        const rowCells = new Array(clusters.length).fill("");
        for (const cell of row.cells) {
          let bestIdx = 0;
          let bestDist = Infinity;
          for (let ci = 0; ci < clusters.length; ci++) {
            const d = Math.abs(clusters[ci] - cell.x);
            if (d < bestDist) {
              bestDist = d;
              bestIdx = ci;
            }
          }
          rowCells[bestIdx] = cell.text;
        }
        lines.push(rowCells);
      }
    }

    // CSV escaping
    function esc(v) {
      const s = String(v ?? "");
      if (/[,"\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
      return s;
    }

    const csv = lines.map((row) => row.map(esc).join(",")).join("\n");
    return new Blob([csv], { type: "text/csv;charset=utf-8" });
  }

  async function pdfMerge(pdfFiles) {
    const { PDFDocument } = PDFLib;
    const merged = await PDFDocument.create();
    const files = pdfFiles.slice();
    if (files.length < 2) throw new Error("Upload at least 2 PDFs to merge.");

    for (let i = 0; i < files.length; i++) {
      setStatus("Merging: " + (i + 1) + "/" + files.length);
      const bytes = new Uint8Array(await readAsArrayBuffer(files[i]));
      const src = await PDFDocument.load(bytes);
      const copiedPages = await merged.copyPages(src, src.getPageIndices());
      copiedPages.forEach((p) => merged.addPage(p));
    }

    const mergedBytes = await merged.save();
    return new Blob([mergedBytes], { type: "application/pdf" });
  }

  async function pdfSplitOnePage(pdfBytes) {
    const { PDFDocument } = PDFLib;
    const src = await PDFDocument.load(pdfBytes);
    const zip = new JSZip();

    const indices = src.getPageIndices();
    for (let i = 0; i < indices.length; i++) {
      const pageIndex = indices[i];
      setStatus("Splitting page " + (i + 1) + "/" + indices.length);
      const outDoc = await PDFDocument.create();
      const [copied] = await outDoc.copyPages(src, [pageIndex]);
      outDoc.addPage(copied);
      const outBytes = await outDoc.save();
      zip.file("page_" + (pageIndex + 1) + ".pdf", outBytes);
    }

    setStatus("Creating ZIP...");
    return await zip.generateAsync({ type: "blob" });
  }

  async function pdfReorder(pdfBytes, indices) {
    const { PDFDocument } = PDFLib;
    const src = await PDFDocument.load(pdfBytes);
    const out = await PDFDocument.create();

    for (const idx of indices) {
      if (idx < 0 || idx >= src.getPageCount()) continue;
      const [copied] = await out.copyPages(src, [idx]);
      out.addPage(copied);
    }

    const outBytes = await out.save();
    return new Blob([outBytes], { type: "application/pdf" });
  }

  async function pdfRotate90(pdfBytes) {
    const { PDFDocument } = PDFLib;
    const doc = await PDFDocument.load(pdfBytes);

    const pages = doc.getPages();
    for (let i = 0; i < pages.length; i++) {
      const gr = pages[i].getRotation();
      const rot =
        (gr && typeof gr === "object" && "angle" in gr ? gr.angle : NaN) ||
        (gr && typeof gr === "object" && "value" in gr ? gr.value : NaN) ||
        (typeof gr === "number" ? gr : 0);
      pages[i].setRotation(((rot || 0) + 90) % 360);
    }

    const outBytes = await doc.save();
    return new Blob([outBytes], { type: "application/pdf" });
  }

  async function pdfRemovePages(pdfBytes, remove1Based) {
    const { PDFDocument } = PDFLib;
    const src = await PDFDocument.load(pdfBytes);
    const out = await PDFDocument.create();
    const removeSet = new Set(remove1Based.map((n) => n)); // 1-based

    let pageNum = 1;
    for (const idx of src.getPageIndices()) {
      if (!removeSet.has(pageNum)) {
        const [copied] = await out.copyPages(src, [idx]);
        out.addPage(copied);
      }
      pageNum++;
    }

    const outBytes = await out.save();
    return new Blob([outBytes], { type: "application/pdf" });
  }

  async function pdfSetMetadata(pdfBytes, { title, author, subject, keywords }) {
    const { PDFDocument } = PDFLib;
    const doc = await PDFDocument.load(pdfBytes);
    doc.setTitle(title || "");
    doc.setAuthor(author || "");
    doc.setSubject(subject || "");
    doc.setKeywords(keywords || "");
    const outBytes = await doc.save();
    return new Blob([outBytes], { type: "application/pdf" });
  }

  async function pdfWatermark(pdfBytes, text, opacity, angleDeg) {
    const { PDFDocument, StandardFonts, rgb } = PDFLib;
    const doc = await PDFDocument.load(pdfBytes);
    const font = await doc.embedFont(StandardFonts.HelveticaBold);

    const pages = doc.getPages();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();

      // Approx center placement and rotation.
      // pdf-lib rotation is around the text origin; this is heuristic but works visually.
      const fontSize = Math.max(40, Math.min(width, height) / 6);
      page.drawText(text, {
        x: width / 2 - fontSize * (text.length * 0.26),
        y: height / 2 + fontSize * 0.2,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
        opacity: opacity,
        rotate: { type: "degrees", angle: angleDeg }
      });
    }

    const outBytes = await doc.save();
    return new Blob([outBytes], { type: "application/pdf" });
  }

  async function pdfNumberPages(pdfBytes) {
    const { PDFDocument, StandardFonts, rgb } = PDFLib;
    const doc = await PDFDocument.load(pdfBytes);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const pages = doc.getPages();
    const total = pages.length;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();
      const text = "Page " + (i + 1) + " of " + total;
      const fontSize = 10;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const x = width - 18 - textWidth;
      const y = 12;
      page.drawText(text, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
    }

    const outBytes = await doc.save();
    return new Blob([outBytes], { type: "application/pdf" });
  }

  async function pdfEmbedSignature(pdfBytes, signatureBytes, x, y, w) {
    const { PDFDocument, StandardFonts } = PDFLib;
    const doc = await PDFDocument.load(pdfBytes);
    const pages = doc.getPages();
    const last = pages[pages.length - 1];

    const sigExt = (signatureFileInput && signatureFileInput.files && signatureFileInput.files[0] && signatureFileInput.files[0].name.toLowerCase()) || "";
    const isPng = sigExt.endsWith(".png");
    const img = isPng ? await doc.embedPng(signatureBytes) : await doc.embedJpg(signatureBytes);

    const aspect = img.height / img.width;
    const h = w * aspect;
    last.drawImage(img, { x, y, width: w, height: h });

    const outBytes = await doc.save();
    return new Blob([outBytes], { type: "application/pdf" });
  }

  async function pdfEmbedQr(pdfBytes, url, x, y, size) {
    const { PDFDocument } = PDFLib;
    const doc = await PDFDocument.load(pdfBytes);
    const first = doc.getPages()[0];

    setStatus("Generating QR...");
    const dataUrl = await QRCode.toDataURL(url, { errorCorrectionLevel: "M", margin: 1, width: size, scale: 2 });
    const res = await fetch(dataUrl);
    const arrBuf = await res.arrayBuffer();
    const pngBytes = new Uint8Array(arrBuf);

    const qrImg = await doc.embedPng(pngBytes);

    // Map size approximately; image native pixel size becomes points.
    first.drawImage(qrImg, { x, y, width: size, height: size });

    const outBytes = await doc.save();
    return new Blob([outBytes], { type: "application/pdf" });
  }

  async function renderPdfToImages(pdfBytes, dpi, jpegQuality, grayscale) {
    // Render pages using pdfjs and build new PDF with embedded images.
    const { PDFDocument } = PDFLib;
    const src = await PDFDocument.load(pdfBytes);

    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const doc = await loadingTask.promise;
    const scale = dpi / 72;

    const out = await PDFDocument.create();
    const pageIndices = src.getPageIndices();

    for (let i = 0; i < pageIndices.length; i++) {
      const pageIndex = pageIndices[i];
      setStatus("Rendering page for new PDF: " + (i + 1) + "/" + pageIndices.length);
      // pdfjs uses 1-based page numbers
      const page = await doc.getPage(pageIndex + 1);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d", { alpha: false });

      await page.render({ canvasContext: ctx, viewport }).promise;

      if (grayscale) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let p = 0; p < data.length; p += 4) {
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          data[p] = lum;
          data[p + 1] = lum;
          data[p + 2] = lum;
        }
        ctx.putImageData(imageData, 0, 0);
      }

      const outPage = src.getPage(pageIndex);
      const { width, height } = outPage.getSize();
      out.addPage([width, height]);

      // Convert rendered canvas to JPEG bytes
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", jpegQuality));
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const embedded = await out.embedJpg(bytes);

      // Fit to full page (image-based compressor/grayscale)
      const newPage = out.getPages()[out.getPages().length - 1];
      newPage.drawImage(embedded, { x: 0, y: 0, width, height });
    }

    const outBytes = await out.save();
    return new Blob([outBytes], { type: "application/pdf" });
  }

  async function pdfCompress(pdfBytes, dpi, jpegQuality) {
    return await renderPdfToImages(pdfBytes, dpi, jpegQuality, false);
  }

  async function pdfGrayscale(pdfBytes, dpi, jpegQuality) {
    return await renderPdfToImages(pdfBytes, dpi, jpegQuality, true);
  }

  async function pdfRedactRegex(pdfBytes, regexText) {
    // Best-effort redaction:
    // - render each page to an image
    // - find text items that match regex exactly (by item.str)
    // - draw black rectangles over their approximate bounding boxes on the rendered canvas
    // - rebuild PDF from the redacted images (image-based)
    const { PDFDocument } = PDFLib;
    const src = await PDFDocument.load(pdfBytes);
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const doc = await loadingTask.promise;

    const out = await PDFDocument.create();
    const scale = 2.5; // reasonable for redaction accuracy/speed

    let regex = null;
    try {
      regex = new RegExp(regexText);
    } catch (e) {
      throw new Error("Invalid regex: " + e.message);
    }

    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
      setStatus("Redacting page (best-effort): " + pageNum + "/" + doc.numPages);
      const page = await doc.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext("2d", { alpha: false });

      await page.render({ canvasContext: ctx, viewport }).promise;

      const textContent = await page.getTextContent();
      const items = textContent.items || [];

      // Blackout matched items
      for (const it of items) {
        const str = it.str || "";
        if (!str) continue;
        // Avoid issues with /g regex state
        regex.lastIndex = 0;
        if (!regex.test(str)) continue;

        // pdfjs item transform: x=e, y=f in text space (PDF units)
        const xPdf = it.transform[4];
        const yPdf = it.transform[5];
        const [xV, yV] = viewport.convertToViewportPoint(xPdf, yPdf);

        const w = (it.width || 40) * viewport.scale;
        const h = (it.height || 10) * viewport.scale;

        // yV is baseline; adjust up for box
        ctx.fillStyle = "#000";
        ctx.fillRect(xV - w / 2, yV - h, w, h);
      }

      const basePage = src.getPage(pageNum - 1);
      const { width, height } = basePage.getSize();
      out.addPage([width, height]);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.9));
      const bytes = new Uint8Array(await blob.arrayBuffer());
      const embedded = await out.embedJpg(bytes);
      const newPage = out.getPages()[out.getPages().length - 1];
      newPage.drawImage(embedded, { x: 0, y: 0, width, height });
    }

    const outBytes = await out.save();
    return new Blob([outBytes], { type: "application/pdf" });
  }

  // ---- UI logic ----
  function hideAllExtra() {
    fieldIds.forEach((id) => {
      const el = $id(id);
      if (el) el.classList.add("hidden");
    });
    securityDisabledNote.classList.add("hidden");
  }

  function showExtras(ids) {
    ids.forEach((id) => {
      const el = $id(id);
      if (el) el.classList.remove("hidden");
    });
  }

  const toolConfig = {
    pdf_to_text: {
      hint: "Upload 1 PDF. Output: .txt with best-effort paragraph spacing.",
      show: []
    },
    image_to_pdf: {
      hint: "Upload multiple images (PNG/JPG). Output: multi-page PDF.",
      show: []
    },
    pdf_to_image: {
      hint: "Upload 1 PDF. Output: ZIP of 300 DPI PNG pages.",
      show: ["fieldDpi"]
    },
    html_to_pdf: {
      hint: "Upload an HTML file OR paste HTML below. Output: PDF (best-effort).",
      show: ["fieldHtmlText"]
    },
    pdf_table_csv: {
      hint: "Upload 1 PDF. Output: CSV (best-effort table detection for text PDFs).",
      show: []
    },
    pdf_merge: {
      hint: "Upload 2+ PDFs. Output: merged PDF.",
      show: []
    },
    pdf_split: {
      hint: "Upload 1 PDF. Output: ZIP of one-page PDFs.",
      show: []
    },
    pdf_reorder: {
      hint: "Upload 1 PDF. Enter page indices (zero-based). Output: reordered PDF.",
      show: ["fieldIndices"]
    },
    pdf_rotate: {
      hint: "Upload 1 PDF. Output: rotated PDF.",
      show: []
    },
    pdf_remove: {
      hint: "Upload 1 PDF. Enter pages to remove (1-based). Output: cleaned PDF.",
      show: ["fieldRemove"]
    },
    pdf_compress: {
      hint: "Upload 1 PDF. Image-based compressor (may remove text/vector).",
      show: ["fieldDpi", "fieldJpegQuality"]
    },
    pdf_encrypt: {
      hint: "Password Protector (AES-256) is NOT supported client-side.",
      show: ["fieldDpi"],
      disabled: true
    },
    pdf_unlock: {
      hint: "PDF Unlocker (password unlock) is NOT supported client-side.",
      show: [],
      disabled: true
    },
    pdf_metadata: {
      hint: "Upload 1 PDF. Set Title/Author/Subject/Keywords.",
      show: ["fieldMetadata", "fieldMetadataAuthor", "fieldMetadataSubject", "fieldMetadataKeywords"]
    },
    pdf_grayscale: {
      hint: "Upload 1 PDF. Image-based grayscale (may remove text/vector).",
      show: ["fieldDpi", "fieldJpegQuality"]
    },
    pdf_watermark: {
      hint: "Upload 1 PDF. Adds a diagonal watermark across every page.",
      show: ["fieldWatermark", "fieldWatermarkOpacity", "fieldWatermarkAngle"]
    },
    pdf_number: {
      hint: "Upload 1 PDF. Adds 'Page X of Y' bottom-right.",
      show: []
    },
    pdf_signer: {
      hint: "Upload 1 PDF + signature image and coordinates.",
      show: ["fieldSignature", "fieldSignaturePos"]
    },
    pdf_qr: {
      hint: "Upload 1 PDF + QR URL/text and placement.",
      show: ["fieldQr", "fieldQrPos"]
    },
    pdf_redactor: {
      hint: "Upload 1 PDF. Regex-based (best-effort) redaction for text items.",
      show: ["fieldRedactor"]
    }
  };

  function applyTool(toolValue) {
    const cfg = toolConfig[toolValue] || toolConfig.pdf_to_text;
    toolHint.textContent = cfg.hint || "";
    hideAllExtra();

    // Adjust defaults per tool for better out-of-the-box results
    if (toolValue === "pdf_to_image" && dpiInput) dpiInput.value = "300";
    if (toolValue === "pdf_compress" && dpiInput) dpiInput.value = "150";
    if (toolValue === "pdf_grayscale" && dpiInput) dpiInput.value = "180";

    if (cfg.disabled) {
      securityDisabledNote.classList.remove("hidden");
      securityDisabledNote.textContent =
        "This tool requires server-side AES-256 PDF processing. It is NOT supported client-side. Choose another tool.";
    }
    if (cfg.show && cfg.show.length) showExtras(cfg.show);
  }

  toolSelect.addEventListener("change", () => applyTool(toolSelect.value));

  async function handleConvert() {
    const tool = toolSelect.value;
    resetDownloads();
    setStatus("Starting...");
    convertBtn.disabled = true;

    try {
      const cfg = toolConfig[tool] || {};
      if (cfg.disabled) {
        throw new Error("Not supported in-browser for security tools. Please use a server-side backend.");
      }

      const files = getSelectedFiles();

      if (tool === "pdf_to_text") {
        const pdf = files.find((f) => f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const bytes = await readAsArrayBuffer(pdf);
        const text = await pdfToText(bytes);
        const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
        addDownload("Extracted text (.txt)", blob, "output.txt");
      } else if (tool === "image_to_pdf") {
        const images = files.filter((f) => f.type.startsWith("image/"));
        if (!images.length) throw new Error("Upload one or more images.");
        const blob = await imagesToPdf(images);
        addDownload("Images → PDF", blob, "images_to_pdf.pdf");
      } else if (tool === "pdf_to_image") {
        const pdf = files[0];
        if (!pdf || (!pdf.type.includes("pdf") && !pdf.name.toLowerCase().endsWith(".pdf"))) {
          throw new Error("Upload a PDF file.");
        }
        const dpi = parseFloatSafe(dpiInput, 300);
        const bytes = await readAsArrayBuffer(pdf);
        const zipBlob = await pdfToImagesZip(bytes, dpi);
        addDownload("PDF → Images (ZIP)", zipBlob, "conversion_pages.zip");
      } else if (tool === "html_to_pdf") {
        let htmlString = "";
        if (files.length && files[0] && files[0].type.includes("html")) {
          htmlString = await readFileText(files[0]);
        } else {
          htmlString = (htmlTextEl && htmlTextEl.value) || "";
        }
        if (!htmlString.trim()) throw new Error("Provide HTML content (paste or upload an .html file).");
        const blob = await htmlToPdf(htmlString);
        addDownload("HTML → PDF", blob, "html_to_pdf.pdf");
      } else if (tool === "pdf_table_csv") {
        const pdf = files.find((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const bytes = await readAsArrayBuffer(pdf);
        const blob = await pdfTableToCsv(bytes);
        addDownload("Table → CSV", blob, "table.csv");
      } else if (tool === "pdf_merge") {
        const pdfs = files.filter((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (pdfs.length < 2) throw new Error("Upload at least 2 PDFs.");
        const blobs = pdfs;
        // merge expects bytes per file
        const out = await (async () => {
          const { PDFDocument } = PDFLib;
          const merged = await PDFDocument.create();
          for (let i = 0; i < blobs.length; i++) {
            setStatus("Merging: " + (i + 1) + "/" + blobs.length);
            const bytes = new Uint8Array(await readAsArrayBuffer(blobs[i]));
            const src = await PDFDocument.load(bytes);
            const copiedPages = await merged.copyPages(src, src.getPageIndices());
            copiedPages.forEach((p) => merged.addPage(p));
          }
          const mergedBytes = await merged.save();
          return new Blob([mergedBytes], { type: "application/pdf" });
        })();
        addDownload("PDF Merger", out, "merged.pdf");
      } else if (tool === "pdf_split") {
        const pdf = files.find((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const bytes = await readAsArrayBuffer(pdf);
        const zipBlob = await pdfSplitOnePage(bytes);
        addDownload("PDF Splitter (ZIP)", zipBlob, "pages.zip");
      } else if (tool === "pdf_reorder") {
        const pdf = files.find((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const indices = parseCommaInts(indicesInput.value);
        if (!indices.length) throw new Error("Enter page indices (e.g. 2,0,1).");
        const bytes = await readAsArrayBuffer(pdf);
        const blob = await pdfReorder(bytes, indices);
        addDownload("Page Reorder", blob, "reordered.pdf");
      } else if (tool === "pdf_rotate") {
        const pdf = files.find((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const bytes = await readAsArrayBuffer(pdf);
        const blob = await pdfRotate90(bytes);
        addDownload("PDF Rotator", blob, "rotated.pdf");
      } else if (tool === "pdf_remove") {
        const pdf = files.find((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const remove = parseCommaInts(removeInput.value);
        if (!remove.length) throw new Error("Enter pages to remove (1-based), e.g. 1,3,5.");
        const bytes = await readAsArrayBuffer(pdf);
        const blob = await pdfRemovePages(bytes, remove);
        addDownload("Page Remover", blob, "removed-pages.pdf");
      } else if (tool === "pdf_compress") {
        const pdf = files.find((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const dpi = parseFloatSafe(dpiInput, 150);
        const q = parseFloatSafe(jpegQualityInput, 0.6);
        const bytes = await readAsArrayBuffer(pdf);
        const blob = await pdfCompress(bytes, dpi, q);
        addDownload("PDF Compressor", blob, "compressed.pdf");
      } else if (tool === "pdf_metadata") {
        const pdf = files.find((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const bytes = await readAsArrayBuffer(pdf);
        const blob = await pdfSetMetadata(bytes, {
          title: metaTitle.value,
          author: metaAuthor.value,
          subject: metaSubject.value,
          keywords: metaKeywords.value
        });
        addDownload("Metadata Editor", blob, "metadata-updated.pdf");
      } else if (tool === "pdf_grayscale") {
        const pdf = files.find((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const dpi = parseFloatSafe(dpiInput, 180);
        const q = parseFloatSafe(jpegQualityInput, 0.6);
        const bytes = await readAsArrayBuffer(pdf);
        const blob = await pdfGrayscale(bytes, dpi, q);
        addDownload("Grayscale Converter", blob, "grayscale.pdf");
      } else if (tool === "pdf_watermark") {
        const pdf = files.find((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const opacity = parseFloatSafe(watermarkOpacity, 0.18);
        const angleDeg = parseFloatSafe(watermarkAngle, 35);
        const text = watermarkText.value || "CONFIDENTIAL";
        const bytes = await readAsArrayBuffer(pdf);
        const blob = await pdfWatermark(bytes, text, opacity, angleDeg);
        addDownload("Watermark Creator", blob, "watermarked.pdf");
      } else if (tool === "pdf_number") {
        const pdf = files.find((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const bytes = await readAsArrayBuffer(pdf);
        const blob = await pdfNumberPages(bytes);
        addDownload("Page Numberer", blob, "numbered.pdf");
      } else if (tool === "pdf_signer") {
        const pdf = files.find((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const sigFile = getSignatureFile();
        if (!sigFile) throw new Error("Upload a signature image.");
        const x = parseFloatSafe(sigX, 50);
        const y = parseFloatSafe(sigY, 50);
        const w = parseFloatSafe(sigW, 120);
        const bytes = await readAsArrayBuffer(pdf);
        const sigBytes = new Uint8Array(await readAsArrayBuffer(sigFile));
        const blob = await pdfEmbedSignature(bytes, sigBytes, x, y, w);
        addDownload("PDF Signer", blob, "signed.pdf");
      } else if (tool === "pdf_qr") {
        const pdf = files.find((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const url = (qrUrl.value || "").trim();
        if (!url) throw new Error("Enter QR URL/text.");
        const x = parseFloatSafe(qrX, 50);
        const y = parseFloatSafe(qrY, 50);
        const size = parseFloatSafe(qrSize, 90);
        const bytes = await readAsArrayBuffer(pdf);
        const blob = await pdfEmbedQr(bytes, url, x, y, size);
        addDownload("QR embedded", blob, "qr-embedded.pdf");
      } else if (tool === "pdf_redactor") {
        const pdf = files.find((f) => f.type.includes("pdf") || f.name.toLowerCase().endsWith(".pdf"));
        if (!pdf) throw new Error("Upload a PDF file.");
        const regexText = (regexInput.value || "").trim();
        const bytes = await readAsArrayBuffer(pdf);
        const blob = await pdfRedactRegex(bytes, regexText);
        addDownload("Redacted PDF", blob, "redacted.pdf");
      } else {
        throw new Error("Tool not implemented: " + tool);
      }

      setStatus("Done.");
      showToast("Conversion complete");
    } catch (err) {
      console.error(err);
      setStatus("Error:\n" + (err && err.message ? err.message : String(err)));
      showToast("Conversion failed");
    } finally {
      convertBtn.disabled = false;
    }
  }

  convertBtn.addEventListener("click", handleConvert);

  clearBtn.addEventListener("click", () => {
    mainFileInput.value = "";
    if (signatureFileInput) signatureFileInput.value = "";
    if (htmlTextEl) htmlTextEl.value = "";
    resetDownloads();
    setStatus("Ready.");
    showToast("Cleared");
  });

  // Init
  applyTool(toolSelect.value);
  setStatus("Ready.");
})();

