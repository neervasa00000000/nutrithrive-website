(() => {
  const lengthEl = document.getElementById("length");
  const upperEl = document.getElementById("upper");
  const lowerEl = document.getElementById("lower");
  const numsEl = document.getElementById("nums");
  const symbolsEl = document.getElementById("symbols");
  const output = document.getElementById("output");
  const genBtn = document.getElementById("genBtn");
  const copyBtn = document.getElementById("copyBtn");
  const strength = document.getElementById("strength");

  const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const LOWER = "abcdefghijklmnopqrstuvwxyz";
  const NUMS = "0123456789";
  const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.?";

  function secureRandomInt(max) {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return arr[0] % max;
  }

  function buildCharset() {
    let set = "";
    if (upperEl.checked) set += UPPER;
    if (lowerEl.checked) set += LOWER;
    if (numsEl.checked) set += NUMS;
    if (symbolsEl.checked) set += SYMBOLS;
    return set;
  }

  function scorePassword(text) {
    let score = 0;
    if (text.length >= 12) score++;
    if (text.length >= 16) score++;
    if (/[A-Z]/.test(text) && /[a-z]/.test(text)) score++;
    if (/\d/.test(text)) score++;
    if (/[^A-Za-z0-9]/.test(text)) score++;
    if (score <= 2) return "Weak";
    if (score <= 4) return "Good";
    return "Strong";
  }

  function generate() {
    const charset = buildCharset();
    const len = Math.max(8, Math.min(64, Number(lengthEl.value || 16)));
    if (!charset) {
      output.value = "Select at least one character type.";
      strength.textContent = "Strength: -";
      return;
    }
    let out = "";
    for (let i = 0; i < len; i++) out += charset[secureRandomInt(charset.length)];
    output.value = out;
    strength.textContent = "Strength: " + scorePassword(out);
  }

  async function copyOut() {
    const val = output.value;
    if (!val) return;
    try {
      await navigator.clipboard.writeText(val);
    } catch (e) {}
  }

  genBtn.addEventListener("click", generate);
  copyBtn.addEventListener("click", copyOut);
  generate();
})();
