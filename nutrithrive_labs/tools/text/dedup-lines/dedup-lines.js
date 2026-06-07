/* global saveAs */

(function () {
  const fileInput = document.getElementById("fileInput");
  const textInput = document.getElementById("textInput");
  const downloadBtn = document.getElementById("downloadBtn");
  const copyBtn = document.getElementById("copyBtn");
  const clearBtn = document.getElementById("clearBtn");
  const toast = document.getElementById("toast");

  const statTotal = document.getElementById("statTotal");
  const statUnique = document.getElementById("statUnique");
  const statRemoved = document.getElementById("statRemoved");

  let toastTimer = null;
  function showToast(message) {
    toast.textContent = message;
    toast.dataset.show = "true";
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.dataset.show = "false";
    }, 1400);
  }

  function dedupLinesPreserveOrder(text) {
    const lines = String(text || "").replace(/\r/g, "").split("\n");
    const seen = new Set();
    const out = [];

    for (const line of lines) {
      if (seen.has(line)) continue;
      seen.add(line);
      out.push(line);
    }

    // Keep trailing newline (nice for .txt)
    return out.join("\n").trimEnd() + "\n";
  }

  function computeStats(text) {
    const lines = String(text || "").replace(/\r/g, "").split("\n");
    // Treat empty final line from trailing newline as not-a-line for stats
    const normalized = lines.length && lines[lines.length - 1] === "" ? lines.slice(0, -1) : lines;
    const total = normalized.length;
    const seen = new Set();
    let unique = 0;
    for (const l of normalized) {
      if (seen.has(l)) continue;
      seen.add(l);
      unique++;
    }
    return { total, unique, removed: Math.max(0, total - unique) };
  }

  function updateStats() {
    const txt = textInput.value || "";
    const { total, unique, removed } = computeStats(txt);
    statTotal.textContent = String(total);
    statUnique.textContent = String(unique);
    statRemoved.textContent = String(removed);
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

  async function loadFileIntoTextarea(file) {
    const text = await file.text();
    textInput.value = text;
    updateStats();
    showToast("File loaded");
  }

  fileInput.addEventListener("change", () => {
    const f = fileInput.files && fileInput.files[0];
    if (!f) return;
    loadFileIntoTextarea(f);
  });

  textInput.addEventListener("input", updateStats);

  downloadBtn.addEventListener("click", () => {
    const txt = textInput.value || "";
    if (!txt.trim()) {
      showToast("Paste or upload text first");
      return;
    }
    const out = dedupLinesPreserveOrder(txt);
    const blob = new Blob([out], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "deduplicated.txt");
    showToast("Downloaded");
  });

  copyBtn.addEventListener("click", () => {
    const txt = textInput.value || "";
    if (!txt.trim()) {
      showToast("Paste or upload text first");
      return;
    }
    const out = dedupLinesPreserveOrder(txt);
    copyToClipboard(out);
  });

  clearBtn.addEventListener("click", () => {
    textInput.value = "";
    fileInput.value = "";
    updateStats();
    showToast("Cleared");
  });

  updateStats();
})();

