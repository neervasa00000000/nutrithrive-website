import {
  analyzePage,
  diffSnapshots,
  applyPdpVerification,
  collectPdpUrlsToVerify,
  analyzeProductDetail,
  urlSnapshotKey,
} from "./scanner.js";

const ALARM_NAME = "pokifinder-poll";
const STORAGE_KEY = "pokifinderWatches";
const notificationOpenUrls = new Map();

chrome.notifications.onClicked.addListener((notificationId) => {
  const url = notificationOpenUrls.get(notificationId);
  if (url) {
    chrome.tabs.create({ url });
    notificationOpenUrls.delete(notificationId);
  }
});

async function getWatches() {
  const { [STORAGE_KEY]: raw = [] } = await chrome.storage.local.get(STORAGE_KEY);
  return Array.isArray(raw) ? raw : [];
}

async function setWatches(list) {
  await chrome.storage.local.set({ [STORAGE_KEY]: list });
}

async function syncAlarm() {
  const watches = await getWatches();
  const hasEnabled = watches.some((w) => w.enabled);
  await chrome.alarms.clear(ALARM_NAME);
  if (hasEnabled) {
    chrome.alarms.create(ALARM_NAME, { periodInMinutes: 1 });
  }
}

function shouldDeferWatchPoll(watch, reason) {
  if (reason !== "alarm") return false;
  const intervalMs = Math.max(60_000, (Number(watch.intervalMinutes) || 15) * 60_000);
  const last = watch.lastSnapshot?.fetchedAt ?? 0;
  if (!last) return false;
  return Date.now() - last < intervalMs;
}

async function fetchPageHtml(url) {
  const res = await fetch(url, {
    credentials: "omit",
    redirect: "follow",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function verifyProductPages(listUrl, analysis, watch, listingHtml) {
  if (watch.verifyProductPages === false) return analysis;
  const cap = Math.min(40, Math.max(5, Number(watch.maxPdpFetches) || 25));
  const urls = collectPdpUrlsToVerify(listUrl, analysis.products, cap);
  const pdpMap = new Map();

  for (const u of urls) {
    let html;
    if (urlSnapshotKey(u) === urlSnapshotKey(listUrl)) {
      html = listingHtml;
    } else {
      await new Promise((r) => setTimeout(r, 320));
      try {
        html = await fetchPageHtml(u);
      } catch {
        continue;
      }
    }
    try {
      const d = analyzeProductDetail(html, u);
      pdpMap.set(urlSnapshotKey(u), d);
    } catch {
      /* ignore single PDP parse errors */
    }
  }

  const products = applyPdpVerification(analysis.products, pdpMap);
  const buySignals = products.some(
    (p) => p.availability === "in_stock" || p.availability === "preorder"
  );
  return { ...analysis, products, buySignals };
}

async function fetchAndProcessWatch(watch) {
  const listUrl = watch.url;
  const html = await fetchPageHtml(listUrl);
  let analysis = analyzePage(html, listUrl);
  analysis = await verifyProductPages(listUrl, analysis, watch, html);

  const prevProducts = watch.lastSnapshot?.products || [];
  const nextProducts = analysis.products.map((p) => ({
    key: p.key,
    canonicalUrl: p.canonicalUrl || "",
    title: p.title,
    availability: p.availability,
    priceHint: p.priceHint,
    source: p.source,
  }));

  const events = diffSnapshots(prevProducts, nextProducts);
  delete watch.lastError;
  delete watch.lastErrorAt;

  if (prevProducts.length === 0) {
    watch.lastSnapshot = {
      fetchedAt: Date.now(),
      products: nextProducts,
      relevanceScore: analysis.pageRelevanceScore,
      likelyPokemonStore: analysis.likelyPokemonStore,
      buySignals: analysis.buySignals,
    };
    return {
      watch,
      analysis,
      events: [],
      firstRun: true,
    };
  }

  watch.lastSnapshot = {
    fetchedAt: Date.now(),
    products: nextProducts,
    relevanceScore: analysis.pageRelevanceScore,
    likelyPokemonStore: analysis.likelyPokemonStore,
    buySignals: analysis.buySignals,
  };

  return { watch, analysis, events, firstRun: false };
}

function notify(title, message, url) {
  const id = `pokifinder-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const opts = {
    type: "basic",
    title,
    message,
    priority: 2,
    iconUrl: chrome.runtime.getURL("icon128.png"),
  };
  if (url) notificationOpenUrls.set(id, url);
  chrome.notifications.create(id, opts);
}

async function runAllWatches(reason) {
  const watches = await getWatches();
  let changed = false;
  for (let i = 0; i < watches.length; i++) {
    const w = watches[i];
    if (!w.enabled) continue;
    if (shouldDeferWatchPoll(w, reason)) continue;
    try {
      const { watch, analysis, events, firstRun } = await fetchAndProcessWatch({ ...w });
      watches[i] = watch;
      changed = true;

      if (firstRun) continue;

      const notifyEnabled = w.notify !== false;
      for (const ev of events) {
        if (!notifyEnabled) continue;
        const name = ev.product.title || "Item";
        if (ev.type === "new_listing") {
          notify(
            "Pokifinder — in stock / preorder",
            `${name}\n${watch.url.slice(0, 88)}`,
            ev.product.canonicalUrl || watch.url
          );
        } else if (ev.type === "restock") {
          notify(
            "Pokifinder — restock detected",
            `${name} — buy box shows it is available again\n${watch.url.slice(0, 88)}`,
            ev.product.canonicalUrl || watch.url
          );
        } else if (ev.type === "new_product") {
          if (w.notifyOosSkus !== true) continue;
          notify(
            "Pokifinder — new item (check stock)",
            `${name}\nOpen the site to confirm — grid pages are often wrong.\n${watch.url.slice(0, 88)}`,
            ev.product.canonicalUrl || watch.url
          );
        }
      }

      if (!analysis.likelyPokemonStore && events.length === 0 && reason === "manual") {
        /* popup can read last result */
      }
    } catch (e) {
      watches[i] = {
        ...watches[i],
        lastError: (e && e.message) || String(e),
        lastErrorAt: Date.now(),
      };
      changed = true;
    }
  }
  if (changed) await setWatches(watches);
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === ALARM_NAME) {
    runAllWatches("alarm");
  }
});

chrome.runtime.onInstalled.addListener(() => {
  syncAlarm();
});

chrome.runtime.onStartup.addListener(() => {
  syncAlarm();
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "SYNC_ALARM") {
    syncAlarm().then(() => sendResponse({ ok: true }));
    return true;
  }
  if (msg?.type === "SCAN_NOW") {
    runAllWatches("manual")
      .then(() => sendResponse({ ok: true }))
      .catch((e) => sendResponse({ ok: false, error: String(e) }));
    return true;
  }
  if (msg?.type === "GET_WATCHES") {
    getWatches().then((w) => sendResponse({ watches: w }));
    return true;
  }
  if (msg?.type === "SAVE_WATCHES") {
    setWatches(msg.watches)
      .then(() => syncAlarm())
      .then(() => sendResponse({ ok: true }))
      .catch((e) => sendResponse({ ok: false, error: String(e) }));
    return true;
  }
});
