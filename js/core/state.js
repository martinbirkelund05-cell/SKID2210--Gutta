/* ============================================================
   APPLIKASJONSTILSTAND OG LAGRING
   ============================================================ */
const STORAGE_KEY = "skid2210_v2";
const DEFAULT_STATE = {
  flashcardLog: [],     // {cardId, result, date}
  mcqAttempts: [],      // {date, filter, correct, total, perQ}
  calcAttempts: [],     // {date, taskId, parts:[{partId, correct}], allCorrect}
  writtenAttempts: [],  // {date, filter, results, total, hits, partials, misses, totalHints}
  examAttempts: [],     // {date, taskIds, perTask, totalPct, grade}
  activity: []          // {date, type, label, score?}
};
let STATE = JSON.parse(JSON.stringify(DEFAULT_STATE));

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const loaded = JSON.parse(raw);
      // Sjekk at alle nødvendige felt finnes
      STATE = Object.assign({}, DEFAULT_STATE, loaded);
      for (const k of Object.keys(DEFAULT_STATE)) {
        if (!Array.isArray(STATE[k])) STATE[k] = [];
      }
    }
  } catch (e) {
    console.error("Klarte ikke å laste tilstand:", e);
    STATE = JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}
function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(STATE)); }
  catch (e) { console.error("Klarte ikke å lagre tilstand:", e); }
}
function logActivity(type, label, score) {
  STATE.activity.push({ date: Date.now(), type, label, score: score ?? null });
  if (STATE.activity.length > 200) STATE.activity = STATE.activity.slice(-200);
  saveState();
}
function resetAllData() {
  if (!confirm("Vil du virkelig nullstille all historikk? Dette kan ikke angres.")) return;
  STATE = JSON.parse(JSON.stringify(DEFAULT_STATE));
  saveState();
  toast("All data nullstilt");
  router(currentPage || "home");
}
