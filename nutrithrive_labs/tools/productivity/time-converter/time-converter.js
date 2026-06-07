(() => {
  const fromZone = document.getElementById("fromZone");
  const toZone = document.getElementById("toZone");
  const dt = document.getElementById("dt");
  const convertBtn = document.getElementById("convertBtn");
  const swapBtn = document.getElementById("swapBtn");
  const nowBtn = document.getElementById("nowBtn");
  const clearBtn = document.getElementById("clearBtn");
  const result = document.getElementById("result");
  const copyBtn = document.getElementById("copyBtn");
  const toast = document.getElementById("toast");

  let toastTimer = null;
  let lastResultText = "";

  function showToast(message) {
    toast.textContent = message;
    toast.dataset.show = "true";
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toast.dataset.show = "false";
    }, 1400);
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatLocalInputValue(date) {
    // datetime-local expects: YYYY-MM-DDTHH:mm
    const d = new Date(date);
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}T${pad2(d.getHours())}:${pad2(
      d.getMinutes()
    )}`;
  }

  // A curated, high-coverage list of common time zones so "any country" works in practice.
  // (Full authoritative mapping requires a geo/timezone DB.)
  const ZONES = [
    // Africa
    ["Africa — Cairo (Egypt)", "Africa/Cairo"],
    ["Africa — Johannesburg (South Africa)", "Africa/Johannesburg"],
    ["Africa — Lagos (Nigeria)", "Africa/Lagos"],
    ["Africa — Nairobi (Kenya)", "Africa/Nairobi"],
    ["Africa — Casablanca (Morocco)", "Africa/Casablanca"],
    // Americas
    ["Americas — Los Angeles (USA)", "America/Los_Angeles"],
    ["Americas — Denver (USA)", "America/Denver"],
    ["Americas — Chicago (USA)", "America/Chicago"],
    ["Americas — New York (USA)", "America/New_York"],
    ["Americas — Phoenix (USA)", "America/Phoenix"],
    ["Americas — Anchorage (USA)", "America/Anchorage"],
    ["Americas — Honolulu (USA)", "Pacific/Honolulu"],
    ["Americas — Toronto (Canada)", "America/Toronto"],
    ["Americas — Vancouver (Canada)", "America/Vancouver"],
    ["Americas — Mexico City (Mexico)", "America/Mexico_City"],
    ["Americas — São Paulo (Brazil)", "America/Sao_Paulo"],
    ["Americas — Buenos Aires (Argentina)", "America/Argentina/Buenos_Aires"],
    ["Americas — Santiago (Chile)", "America/Santiago"],
    ["Americas — Bogotá (Colombia)", "America/Bogota"],
    ["Americas — Lima (Peru)", "America/Lima"],
    // Asia
    ["Asia — Dubai (UAE)", "Asia/Dubai"],
    ["Asia — Riyadh (Saudi Arabia)", "Asia/Riyadh"],
    ["Asia — Tehran (Iran)", "Asia/Tehran"],
    ["Asia — Karachi (Pakistan)", "Asia/Karachi"],
    ["Asia — Kolkata (India)", "Asia/Kolkata"],
    ["Asia — Dhaka (Bangladesh)", "Asia/Dhaka"],
    ["Asia — Bangkok (Thailand)", "Asia/Bangkok"],
    ["Asia — Singapore", "Asia/Singapore"],
    ["Asia — Hong Kong", "Asia/Hong_Kong"],
    ["Asia — Shanghai (China)", "Asia/Shanghai"],
    ["Asia — Taipei (Taiwan)", "Asia/Taipei"],
    ["Asia — Tokyo (Japan)", "Asia/Tokyo"],
    ["Asia — Seoul (South Korea)", "Asia/Seoul"],
    ["Asia — Manila (Philippines)", "Asia/Manila"],
    ["Asia — Jakarta (Indonesia)", "Asia/Jakarta"],
    // Europe
    ["Europe — London (UK)", "Europe/London"],
    ["Europe — Dublin (Ireland)", "Europe/Dublin"],
    ["Europe — Lisbon (Portugal)", "Europe/Lisbon"],
    ["Europe — Paris (France)", "Europe/Paris"],
    ["Europe — Berlin (Germany)", "Europe/Berlin"],
    ["Europe — Rome (Italy)", "Europe/Rome"],
    ["Europe — Madrid (Spain)", "Europe/Madrid"],
    ["Europe — Amsterdam (Netherlands)", "Europe/Amsterdam"],
    ["Europe — Warsaw (Poland)", "Europe/Warsaw"],
    ["Europe — Athens (Greece)", "Europe/Athens"],
    ["Europe — Helsinki (Finland)", "Europe/Helsinki"],
    ["Europe — Kyiv (Ukraine)", "Europe/Kyiv"],
    ["Europe — Moscow (Russia)", "Europe/Moscow"],
    // Oceania
    ["Australia — Perth", "Australia/Perth"],
    ["Australia — Adelaide", "Australia/Adelaide"],
    ["Australia — Brisbane", "Australia/Brisbane"],
    ["Australia — Sydney", "Australia/Sydney"],
    ["Australia — Melbourne", "Australia/Melbourne"],
    ["Pacific — Auckland (New Zealand)", "Pacific/Auckland"],
    ["Pacific — Fiji", "Pacific/Fiji"],
    ["Pacific — Port Moresby (PNG)", "Pacific/Port_Moresby"],
    // UTC
    ["UTC", "UTC"],
  ];

  function safeTzName() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch (e) {
      return "UTC";
    }
  }

  function fmtParts(date, timeZone) {
    const f = new Intl.DateTimeFormat("en-AU", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "shortOffset",
    });
    const parts = f.formatToParts(date);
    const obj = {};
    for (const p of parts) obj[p.type] = p.value;
    return obj;
  }

  function offsetMinutesForInstant(date, timeZone) {
    // Parse "GMT+10" / "UTC+10" / "GMT+10:30"
    const p = fmtParts(date, timeZone).timeZoneName || "";
    const m = p.match(/([+-])(\d{1,2})(?::?(\d{2}))?/);
    if (!m) return 0;
    const sign = m[1] === "-" ? -1 : 1;
    const hh = Number(m[2] || 0);
    const mm = Number(m[3] || 0);
    return sign * (hh * 60 + mm);
  }

  function instantFromWallTime(yyyy, mm, dd, HH, MI, timeZone) {
    // Convert a wall-clock time in `timeZone` into a UTC instant.
    // Approach: iterative solve using the zone's offset for the guessed instant.
    const guessUtc = Date.UTC(yyyy, mm - 1, dd, HH, MI, 0);
    let instant = guessUtc;
    for (let i = 0; i < 3; i++) {
      const offMin = offsetMinutesForInstant(new Date(instant), timeZone);
      const candidate = guessUtc - offMin * 60 * 1000;
      if (Math.abs(candidate - instant) < 500) {
        instant = candidate;
        break;
      }
      instant = candidate;
    }
    return new Date(instant);
  }

  function formatFull(date, timeZone) {
    const f = new Intl.DateTimeFormat("en-AU", {
      timeZone,
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZoneName: "shortOffset",
    });
    return f.format(date);
  }

  function parseDtLocalValue(value) {
    // "YYYY-MM-DDTHH:mm"
    const v = String(value || "").trim();
    const m = v.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
    if (!m) return null;
    return {
      yyyy: Number(m[1]),
      mm: Number(m[2]),
      dd: Number(m[3]),
      HH: Number(m[4]),
      MI: Number(m[5]),
    };
  }

  function updateResult(text) {
    lastResultText = text;
    result.textContent = text;
    copyBtn.disabled = !text || text === "Ready.";
  }

  function convert() {
    const from = fromZone.value;
    const to = toZone.value;
    const parsed = parseDtLocalValue(dt.value);
    if (!from || !to) return showToast("Pick both zones");
    if (!parsed) return showToast("Pick a date/time");

    const instant = instantFromWallTime(parsed.yyyy, parsed.mm, parsed.dd, parsed.HH, parsed.MI, from);

    const fromOff = fmtParts(instant, from).timeZoneName || "";
    const toOff = fmtParts(instant, to).timeZoneName || "";

    const out =
      `From: ${formatFull(instant, from)} (${from})\n` +
      `To:   ${formatFull(instant, to)} (${to})\n\n` +
      `Offsets: ${fromOff} → ${toOff}`;

    updateResult(out);
    showToast("Converted");
  }

  function swap() {
    const a = fromZone.value;
    fromZone.value = toZone.value;
    toZone.value = a;
    showToast("Swapped");
    if (dt.value) convert();
  }

  function useNow() {
    dt.value = formatLocalInputValue(new Date());
    showToast("Using now");
    convert();
  }

  async function copyResult() {
    if (!lastResultText) return;
    try {
      await navigator.clipboard.writeText(lastResultText);
      showToast("Copied");
      return;
    } catch (e) {}

    const ta = document.createElement("textarea");
    ta.value = lastResultText;
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

  function clearAll() {
    dt.value = "";
    updateResult("Ready.");
    showToast("Cleared");
  }

  function addOptions(select, items) {
    select.innerHTML = "";
    for (const [label, value] of items) {
      const opt = document.createElement("option");
      opt.value = value;
      opt.textContent = label;
      select.appendChild(opt);
    }
  }

  // Init
  addOptions(fromZone, ZONES);
  addOptions(toZone, ZONES);

  const local = safeTzName();
  const localIdx = ZONES.findIndex((z) => z[1] === local);
  if (localIdx >= 0) {
    fromZone.value = local;
  } else {
    fromZone.value = "Australia/Sydney";
  }
  toZone.value = "UTC";

  dt.value = formatLocalInputValue(new Date());
  updateResult("Ready.");

  convertBtn.addEventListener("click", convert);
  swapBtn.addEventListener("click", swap);
  nowBtn.addEventListener("click", useNow);
  clearBtn.addEventListener("click", clearAll);
  copyBtn.addEventListener("click", copyResult);

  fromZone.addEventListener("change", () => dt.value && convert());
  toZone.addEventListener("change", () => dt.value && convert());
  dt.addEventListener("change", () => convert());
})();

