(() => {
  const note = document.getElementById("note");
  const copyBtn = document.getElementById("copyBtn");
  const downloadBtn = document.getElementById("downloadBtn");
  const clearBtn = document.getElementById("clearBtn");
  const savedAt = document.getElementById("savedAt");
  const KEY = "labs_quick_notes";

  function stamp() {
    savedAt.textContent = "Saved at " + new Date().toLocaleTimeString();
  }

  function save() {
    localStorage.setItem(KEY, note.value || "");
    stamp();
  }

  function load() {
    note.value = localStorage.getItem(KEY) || "";
  }

  async function copy() {
    const val = note.value || "";
    if (!val) return;
    try {
      await navigator.clipboard.writeText(val);
    } catch (e) {}
  }

  function download() {
    const val = note.value || "";
    const blob = new Blob([val], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "quick-notes.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  let timer = null;
  note.addEventListener("input", () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(save, 300);
  });
  copyBtn.addEventListener("click", copy);
  downloadBtn.addEventListener("click", download);
  clearBtn.addEventListener("click", () => {
    note.value = "";
    save();
  });

  load();
})();
