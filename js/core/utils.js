/* ============================================================
   FORMEL-RENDERER — strukturert HTML/CSS, ingen ekstern lib
   F() bygger en .formula-span fra et array av tokens.
   Tokens (alle valgfrie):
     "tekst"                    -> ren tekst-bit
     ["v","x"]                  -> variabel (kursiv)
     ["g","ω"]                  -> gresk/symbol (rett)
     ["sub","x","i"]            -> x med subscript i  (mottar tekst eller formel)
     ["sup","U","3"]            -> U opphøyd 3
     ["frac", num, den]         -> visuell brøk
     ["op","="] / ["op","·"]    -> operator (med litt margin)
     ["paren", innhold]         -> ( … )
     ["sqrt", innhold]          -> √(…)
     ["integral"]               -> ∫
   ============================================================ */
function F(tokens, opts) {
  opts = opts || {};
  const cls = "formula" + (opts.large ? " large" : "");
  return `<span class="${cls}">` + tokens.map(renderToken).join("") + `</span>`;
}
function FB(tokens) { // block / display
  return `<div class="formula-block">${F(tokens, {large:true})}</div>`;
}
function renderToken(t) {
  if (typeof t === "string") return escapeHTML(t);
  if (!Array.isArray(t)) return "";
  const kind = t[0];
  switch (kind) {
    case "v": return `<span class="var">${escapeHTML(t[1])}</span>`;
    case "g": return `<span class="greek">${escapeHTML(t[1])}</span>`;
    case "op": return `<span class="op">${escapeHTML(t[1])}</span>`;
    case "sub": return renderToken(t[1]) + `<sub>${renderInline(t[2])}</sub>`;
    case "sup": return renderToken(t[1]) + `<sup>${renderInline(t[2])}</sup>`;
    case "frac": return `<span class="frac"><span class="num">${renderInline(t[1])}</span><span class="den">${renderInline(t[2])}</span></span>`;
    case "paren": return `<span class="paren">(</span>${renderInline(t[1])}<span class="paren">)</span>`;
    case "sqrt": return `<span class="sqrt">√</span><span class="paren">(</span>${renderInline(t[1])}<span class="paren">)</span>`;
    case "integral": return `<span class="integral">∫</span>`;
    default: return "";
  }
}
function renderInline(x) {
  if (typeof x === "string") return escapeHTML(x);
  if (Array.isArray(x) && Array.isArray(x[0])) return x.map(renderToken).join("");
  if (Array.isArray(x)) return renderToken(x);
  return "";
}
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));
}

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function topicName(id) {
  for (const t of TOPICS) {
    if (t.id === id) return `${t.code} – ${t.name}`;
    for (const s of t.sub) if (s.id === id) return s.name;
  }
  return id;
}
function mainTopicOf(subId) {
  if (!subId) return subId;
  if (subId.length === 1) return subId;
  return subId[0];
}

function escapeHtml(s) { return escapeHTML(s); }

function shuffle(a) {
  const arr = a.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function fmtPct(v) { return (Math.round(v * 10) / 10) + "%"; }
function fmtDate(ts) {
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}.${mm} ${hh}:${mi}`;
}
function gradeFromPct(p) {
  if (p >= 95) return "A";
  if (p >= 75) return "B";
  if (p >= 65) return "C";
  if (p >= 55) return "D";
  if (p >= 40) return "E";
  return "F";
}
function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("show"), 2200);
}

/** Filtrer en oppgave-array etter tema-velger ("all" | "A" | "B1" osv.) */
function filterByTopic(items, filter) {
  if (!filter || filter === "all") return items.slice();
  if (filter.length === 1) return items.filter(x => x.tema === filter);
  return items.filter(x => x.undertema === filter);
}

/** Bygg tema-velger-HTML. Verdien er "all", "A", "A1" osv. */
function buildTopicPicker(idPrefix, current) {
  current = current || "all";
  let html = `<select id="${idPrefix}-topic">`;
  html += `<option value="all"${current==="all"?" selected":""}>Alle temaer</option>`;
  for (const t of TOPICS) {
    html += `<option value="${t.id}"${current===t.id?" selected":""}>── ${t.code} – ${t.name} ──</option>`;
    for (const s of t.sub) {
      html += `<option value="${s.id}"${current===s.id?" selected":""}>${s.id}: ${s.name}</option>`;
    }
  }
  html += `</select>`;
  return html;
}

/** Tilfeldig utvalg n elementer fra arr, evt. fall-back ved få elementer */
function pickN(arr, n, fallbackPool) {
  if (arr.length >= n) return shuffle(arr).slice(0, n);
  // Trenger fallback
  const used = new Set(arr.map(x => x.id));
  const extras = (fallbackPool || []).filter(x => !used.has(x.id));
  return shuffle(arr).concat(shuffle(extras).slice(0, n - arr.length));
}
