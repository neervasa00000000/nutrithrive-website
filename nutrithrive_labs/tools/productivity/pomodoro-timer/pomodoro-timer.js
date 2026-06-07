(() => {
  const preset = document.getElementById("preset");
  const phasePill = document.getElementById("phasePill");
  const clock = document.getElementById("clock");
  const status = document.getElementById("status");
  const todayMinutes = document.getElementById("todayMinutes");
  const startBtn = document.getElementById("startBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const skipBtn = document.getElementById("skipBtn");

  let isWork = true;
  let remaining = 25 * 60;
  let timerId = null;
  let startedAt = null;

  function getDurations() {
    const [w, b] = (preset.value || "25-5").split("-").map(Number);
    return { work: (w || 25) * 60, brk: (b || 5) * 60 };
  }

  function format(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  function todayKey() {
    return "labs_pomo_" + new Date().toISOString().slice(0, 10);
  }

  function renderToday() {
    todayMinutes.textContent = String(Number(localStorage.getItem(todayKey()) || 0));
  }

  function addFocusedMinutes(mins) {
    const cur = Number(localStorage.getItem(todayKey()) || 0);
    localStorage.setItem(todayKey(), String(cur + mins));
    renderToday();
  }

  function render() {
    clock.textContent = format(remaining);
    phasePill.textContent = isWork ? "Work" : "Break";
  }

  function switchPhase() {
    if (isWork) addFocusedMinutes(Math.floor(getDurations().work / 60));
    isWork = !isWork;
    remaining = isWork ? getDurations().work : getDurations().brk;
    status.textContent = isWork ? "Work phase started." : "Break phase started.";
    render();
  }

  function tick() {
    remaining -= 1;
    if (remaining <= 0) {
      switchPhase();
      return;
    }
    render();
  }

  function start() {
    if (timerId) return;
    startedAt = Date.now();
    timerId = window.setInterval(tick, 1000);
    status.textContent = "Running...";
  }

  function pause() {
    if (!timerId) return;
    window.clearInterval(timerId);
    timerId = null;
    status.textContent = "Paused.";
  }

  function reset() {
    pause();
    isWork = true;
    remaining = getDurations().work;
    status.textContent = "Reset.";
    render();
  }

  startBtn.addEventListener("click", start);
  pauseBtn.addEventListener("click", pause);
  resetBtn.addEventListener("click", reset);
  skipBtn.addEventListener("click", () => {
    pause();
    switchPhase();
  });
  preset.addEventListener("change", reset);

  reset();
  renderToday();
})();
