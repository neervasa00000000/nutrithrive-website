const $ = (sel) => document.querySelector(sel);

function setMsg(text, kind) {
  const el = $("#msg");
  el.textContent = text || "";
  el.className = "msg" + (kind ? ` ${kind}` : "");
}

async function getWatches() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "GET_WATCHES" }, (res) => {
      resolve(res?.watches || []);
    });
  });
}

async function saveWatches(watches) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "SAVE_WATCHES", watches }, (res) => {
      resolve(!!res?.ok);
    });
  });
}

async function scanNow() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type: "SCAN_NOW" }, (res) => {
      resolve(res);
    });
  });
}

function formatSnapshot(meta) {
  if (!meta) return "";
  const bits = [];
  if (typeof meta.relevanceScore === "number")
    bits.push(`Pokémon signals: ${meta.relevanceScore}`);
  if (meta.likelyPokemonStore === false) bits.push("low match — page may not be Pokémon-focused");
  if (meta.buySignals === false) bits.push("no strong “in stock” cues detected");
  return bits.join(" · ");
}

function renderList(watches) {
  const list = $("#list");
  const empty = $("#empty");
  list.innerHTML = "";
  const active = watches.filter(Boolean);
  empty.hidden = active.length > 0;

  for (const w of active) {
    const li = document.createElement("li");
    li.className = "item";

    const title = document.createElement("div");
    title.className = "item-title";
    title.textContent = w.label || w.url;

    const meta = document.createElement("div");
    meta.className = "item-meta";
    const snap = w.lastSnapshot;
    const err = w.lastError
      ? `Last error: ${w.lastError}`
      : snap
        ? `Last check: ${new Date(snap.fetchedAt).toLocaleString()} · ${formatSnapshot(snap)}`
        : "No check yet";
    meta.textContent = `${err} · every ${w.intervalMinutes} min`;

    const pill = document.createElement("span");
    pill.className = w.enabled ? "pill" : "pill warn";
    pill.textContent = w.enabled ? "On" : "Paused";

    const actions = document.createElement("div");
    actions.className = "item-actions";

    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "mini";
    toggle.textContent = w.enabled ? "Pause" : "Resume";
    toggle.addEventListener("click", async () => {
      w.enabled = !w.enabled;
      await saveWatches(watches);
      await refresh();
    });

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "mini danger";
    remove.textContent = "Remove";
    remove.addEventListener("click", async () => {
      const next = watches.filter((x) => x.id !== w.id);
      await saveWatches(next);
      await refresh();
    });

    actions.append(toggle, remove);

    li.append(title, meta, pill, actions);
    list.append(li);
  }
}

async function refresh() {
  const watches = await getWatches();
  renderList(watches);
}

$("#add").addEventListener("click", async () => {
  setMsg("");
  const urlRaw = $("#url").value.trim();
  const label = $("#label").value.trim();
  const interval = Math.min(360, Math.max(1, Number($("#interval").value) || 15));

  let parsed;
  try {
    parsed = new URL(urlRaw);
  } catch {
    setMsg("Enter a full URL (including https://).", "err");
    return;
  }
  if (!/^https?:$/i.test(parsed.protocol)) {
    setMsg("Only http and https URLs are supported.", "err");
    return;
  }

  const watches = await getWatches();
  if (watches.some((w) => w.url === parsed.href)) {
    setMsg("That URL is already on the list.", "err");
    return;
  }

  watches.push({
    id: crypto.randomUUID(),
    url: parsed.href,
    label: label || parsed.hostname,
    intervalMinutes: interval,
    enabled: true,
    notify: true,
    verifyProductPages: $("#verifyPdp").checked,
    notifyOosSkus: $("#notifyOos").checked,
  });

  await saveWatches(watches);
  $("#url").value = "";
  $("#label").value = "";
  setMsg("Watch added. First check sets baseline — no notification yet.", "ok");
  await refresh();
  await scanNow();
  await refresh();
});

$("#scan").addEventListener("click", async () => {
  setMsg("Checking…");
  const res = await scanNow();
  if (res?.ok) {
    setMsg("Finished check.", "ok");
  } else {
    setMsg(res?.error || "Check failed.", "err");
  }
  await refresh();
});

refresh();
