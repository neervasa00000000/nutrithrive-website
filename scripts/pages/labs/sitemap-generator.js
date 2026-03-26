/* global saveAs */

(function () {
  const baseUrlEl = document.getElementById("baseUrl");
  const folderInput = document.getElementById("folderInput");
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const copyBtn = document.getElementById("copyBtn");
  const clearBtn = document.getElementById("clearBtn");
  const outputEl = document.getElementById("output");

  const statFiles = document.getElementById("statFiles");
  const statUrls = document.getElementById("statUrls");
  const statLastmod = document.getElementById("statLastmod");

  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.dataset.show = "true";
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.dataset.show = "false";
    }, 1400);
  }

  function normalizeBaseUrl(url) {
    const u = String(url || "").trim();
    if (!u) return "";
    return u.endsWith("/") ? u.slice(0, -1) : u;
  }

  function escapeXml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function pathFromRelative(rel) {
    let p = String(rel || "").replace(/\\/g, "/");
    p = p.replace(/^\.\//, "");
    if (!p.toLowerCase().endsWith(".html")) return null;

    if (p.toLowerCase() === "index.html") return "/";

    if (p.toLowerCase().endsWith("/index.html")) {
      p = p.slice(0, -"/index.html".length) + "/";
    } else {
      p = p.slice(0, -".html".length);
      p = p + (p.endsWith("/") ? "" : "/");
    }

    if (!p.startsWith("/")) p = "/" + p;
    p = p.replace(/\/{2,}/g, "/");
    return p;
  }

  function lastmodFromFile(file) {
    if (!file || !file.lastModified) return null;
    const d = new Date(file.lastModified);
    if (Number.isNaN(d.getTime())) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function computeHtmlFiles(files) {
    const list = Array.from(files || []);
    return list.filter((f) => (f.name || "").toLowerCase().endsWith(".html"));
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied");
      return;
    } catch (e) {}

    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast("Copied");
    } catch (e) {
      showToast("Copy failed");
    } finally {
      document.body.removeChild(ta);
    }
  }

  folderInput.addEventListener("change", () => {
    outputEl.value = "";
    downloadBtn.disabled = true;
    copyBtn.disabled = true;

    const htmlFiles = computeHtmlFiles(folderInput.files);
    statFiles.textContent = String(htmlFiles.length);
    statUrls.textContent = "0";
    statLastmod.textContent = htmlFiles.length ? "On" : "Off";
    showToast(htmlFiles.length ? "Folder loaded" : "No HTML files found");
  });

  generateBtn.addEventListener("click", () => {
    const base = normalizeBaseUrl(baseUrlEl.value);
    if (!base) return showToast("Enter base URL");

    const htmlFiles = computeHtmlFiles(folderInput.files);
    if (!htmlFiles.length) return showToast("Select a folder with .html files");

    const items = htmlFiles
      .map((f) => ({ file: f, rel: f.webkitRelativePath || f.name }))
      .sort((a, b) => a.rel.localeCompare(b.rel));

    const seen = new Set();
    const urlEntries = [];

    for (const it of items) {
      const path = pathFromRelative(it.rel);
      if (!path) continue;
      const loc = base + path;
      if (seen.has(loc)) continue;
      seen.add(loc);
      urlEntries.push({ loc, lastmod: lastmodFromFile(it.file) });
    }

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urlEntries
        .map((u) => {
          const locLine = `  <loc>${escapeXml(u.loc)}</loc>`;
          const lastmodLine = u.lastmod ? `\n  <lastmod>${escapeXml(u.lastmod)}</lastmod>` : "";
          return ` <url>\n${locLine}${lastmodLine}\n </url>`;
        })
        .join("\n") +
      `\n</urlset>\n`;

    outputEl.value = xml;
    downloadBtn.disabled = false;
    copyBtn.disabled = false;
    statUrls.textContent = String(urlEntries.length);
    statLastmod.textContent = "On";
    showToast("Sitemap generated");
  });

  downloadBtn.addEventListener("click", () => {
    if (!outputEl.value) return;
    const blob = new Blob([outputEl.value], { type: "application/xml;charset=utf-8" });
    saveAs(blob, "sitemap.xml");
    showToast("Downloaded");
  });

  copyBtn.addEventListener("click", () => {
    if (!outputEl.value) return;
    copyToClipboard(outputEl.value);
  });

  clearBtn.addEventListener("click", () => {
    baseUrlEl.value = "https://nutrithrive.com.au";
    folderInput.value = "";
    outputEl.value = "";
    downloadBtn.disabled = true;
    copyBtn.disabled = true;
    statFiles.textContent = "0";
    statUrls.textContent = "0";
    statLastmod.textContent = "Off";
    showToast("Cleared");
  });

  statFiles.textContent = "0";
  statUrls.textContent = "0";
  statLastmod.textContent = "Off";
})();

/* global saveAs */

(function () {
  const baseUrlEl = document.getElementById("baseUrl");
  const folderInput = document.getElementById("folderInput");
  const generateBtn = document.getElementById("generateBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const copyBtn = document.getElementById("copyBtn");
  const clearBtn = document.getElementById("clearBtn");
  const outputEl = document.getElementById("output");

  const statFiles = document.getElementById("statFiles");
  const statUrls = document.getElementById("statUrls");
  const statLastmod = document.getElementById("statLastmod");

  const toast = document.getElementById("toast");
  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.dataset.show = "true";
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.dataset.show = "false";
    }, 1400);
  }

  function normalizeBaseUrl(url) {
    const u = String(url || "").trim();
    if (!u) return "";
    return u.endsWith("/") ? u.slice(0, -1) : u;
  }

  function escapeXml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function pathFromRelative(rel) {
    // Convert Windows backslashes
    let p = String(rel || "").replace(/\\/g, "/");
    // Remove leading ./ if present
    p = p.replace(/^\.\//, "");

    // Only handle .html files
    if (!p.toLowerCase().endsWith(".html")) return null;

    // Convert index.html -> /
    if (p.toLowerCase() === "index.html") return "/";

    // Remove trailing index.html within directories -> /dir/
    if (p.toLowerCase().endsWith("/index.html")) {
      p = p.slice(0, -"/index.html".length) + "/";
    } else {
      // Remove .html -> clean path without extension
      p = p.slice(0, -".html".length);
      // If it was something like pages/about, treat it like a directory path
      p = p + (p.endsWith("/") ? "" : "/");
    }

    // Ensure leading slash
    if (!p.startsWith("/")) p = "/" + p;

    // Collapse double slashes
    p = p.replace(/\/{2,}/g, "/");
    return p;
  }

  function lastmodFromFile(file) {
    // Use file.lastModified if available (milliseconds). Convert to YYYY-MM-DD.
    if (!file || !file.lastModified) return null;
    const d = new Date(file.lastModified);
    if (Number.isNaN(d.getTime())) return null;
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }

  function computeFileList(files) {
    const list = Array.from(files || []);
    const html = list.filter((f) => (f.name || "").toLowerCase().endsWith(".html"));
    return html;
  }

  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied");
      return;
    } catch (e) {}

    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showToast("Copied");
    } catch (e) {
      showToast("Copy failed");
    } finally {
      document.body.removeChild(ta);
    }
  }

  function updateStats() {
    const htmlFiles = computeFileList(folderInput.files);
    statFiles.textContent = String(htmlFiles.length);
    statUrls.textContent = outputEl.value ? String((outputEl.value.match(/<url>/g) || []).length) : "0";
  }

  folderInput.addEventListener("change", () => {
    outputEl.value = "";
    downloadBtn.disabled = true;
    copyBtn.disabled = true;
    const htmlFiles = computeFileList(folderInput.files);
    statFiles.textContent = String(htmlFiles.length);
    statUrls.textContent = "0";
    statLastmod.textContent = "On";
    showToast(htmlFiles.length ? "Folder loaded" : "No HTML files found");
  });

  generateBtn.addEventListener("click", () => {
    const base = normalizeBaseUrl(baseUrlEl.value);
    if (!base) {
      showToast("Enter base URL");
      return;
    }

    const htmlFiles = computeFileList(folderInput.files);
    if (!htmlFiles.length) {
      showToast("Select a folder with .html files");
      return;
    }

    // Deduplicate URLs by path (preserve deterministic order by sorting rel paths)
    const items = htmlFiles
      .map((f) => {
        const rel = f.webkitRelativePath || f.name;
        return { file: f, rel };
      })
      .sort((a, b) => a.rel.localeCompare(b.rel));

    const seen = new Set();
    const urlEntries = [];

    for (const it of items) {
      const path = pathFromRelative(it.rel);
      if (!path) continue;
      const full = base + path;
      if (seen.has(full)) continue;
      seen.add(full);

      const lastmod = lastmodFromFile(it.file);
      urlEntries.push({ loc: full, lastmod });
    }

    const xml =
      `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urlEntries
        .map((u) => {
          const loc = `  <loc>${escapeXml(u.loc)}</loc>`;
          const lastmod = u.lastmod ? `\n  <lastmod>${escapeXml(u.lastmod)}</lastmod>` : "";
          return ` <url>\n${loc}${lastmod}\n </url>`;
        })
        .join("\n") +
      `\n</urlset>\n`;

    outputEl.value = xml;
    downloadBtn.disabled = false;
    copyBtn.disabled = false;

    statUrls.textContent = String(urlEntries.length);
    statLastmod.textContent = "On";
    showToast("Sitemap generated");
  });

  downloadBtn.addEventListener("click", () => {
    if (!outputEl.value) return;
    const blob = new Blob([outputEl.value], { type: "application/xml;charset=utf-8" });
    saveAs(blob, "sitemap.xml");
    showToast("Downloaded sitemap.xml");
  });

  copyBtn.addEventListener("click", () => {
    if (!outputEl.value) return;
    copyToClipboard(outputEl.value);
  });

  clearBtn.addEventListener("click", () => {
    baseUrlEl.value = "https://nutrithrive.com.au";
    folderInput.value = "";
    outputEl.value = "";
    downloadBtn.disabled = true;
    copyBtn.disabled = true;
    statFiles.textContent = "0";
    statUrls.textContent = "0";
    statLastmod.textContent = "Off";
    showToast("Cleared");
  });

  statLastmod.textContent = "Off";
  updateStats();
})();

