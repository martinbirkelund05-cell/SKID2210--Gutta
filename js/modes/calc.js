/* ============================================================
   REGNEOPPGAVER — flerstegs med deloppgaver
   ============================================================ */
const CALC_STATE = { active: false, finished: false, queue: [], idx: 0, partAnswers: {}, partResults: {}, showFasit: {}, filter: "all" };

// Hald oversikt over kva oppgåver som vart sist vist, for å unngå repetisjon mellom økter
function getRecentCalcIds() {
  try {
    const raw = localStorage.getItem("skid2210_recent_calc");
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) { return []; }
}
function saveRecentCalcIds(ids) {
  try { localStorage.setItem("skid2210_recent_calc", JSON.stringify(ids)); } catch(e){}
}

function renderCalc() {
  if (CALC_STATE.finished) return renderCalcResults();
  if (!CALC_STATE.active) return renderCalcIntro();
  renderCalcTask();
}

function renderCalcIntro() {
  $("#page-calc").innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">Regneoppgaver</div>
      <h1 class="page-title">Trening i numerisk regning</h1>
      <p class="page-sub">${CALC_TASKS.length} oppgaver hentet fra øvinger og tidligere eksamener. Hver oppgave har én eller flere deloppgaver med sjekk på toleranse.</p>
    </div>
    <div class="card">
      <div class="topic-picker">
        <label>Tema</label>
        ${buildTopicPicker("calc", CALC_STATE.filter)}
      </div>
      <div style="margin-top: 14px;">
        <button class="btn primary" onclick="startCalc()">Start regneprøve</button>
      </div>
    </div>
  `;
}

function startCalc() {
  CALC_STATE.filter = $("#calc-topic").value;
  let pool = filterByTopic(CALC_TASKS, CALC_STATE.filter);
  let usedFallback = false;
  if (pool.length < 3) {
    pool = pickN(pool, Math.max(3, pool.length), CALC_TASKS);
    usedFallback = true;
  } else {
    // Del i "ikkje nyleg sett" og "nyleg sett". Shuffle kvar gruppe og prioriter
    // dei som ikkje har vore vist nyleg, slik at same oppgåvene ikkje kjem ofte att.
    const recent = new Set(getRecentCalcIds());
    const fresh = pool.filter(t => !recent.has(t.id));
    const stale = pool.filter(t =>  recent.has(t.id));
    pool = shuffle(fresh).concat(shuffle(stale));
  }
  // Begrens til maks 6 oppgaver per økt for variasjon mellom økter
  const SESSION_LIMIT = 6;
  if (pool.length > SESSION_LIMIT) pool = pool.slice(0, SESSION_LIMIT);
  CALC_STATE.queue = pool;
  CALC_STATE.idx = 0;
  CALC_STATE.partAnswers = {};
  CALC_STATE.partResults = {};
  CALC_STATE.showFasit = {};
  CALC_STATE.active = true;
  CALC_STATE.finished = false;
  // Lagre dei valde oppgåvene som "nyleg sett" — held minne på siste 12 oppgåver
  const newRecent = pool.map(t => t.id).concat(getRecentCalcIds()).slice(0, 12);
  saveRecentCalcIds(newRecent);
  if (usedFallback) toast("Få oppgaver i valgt tema – fyller på fra andre temaer");
  renderCalcTask();
}

function quitCalc() {
  if (!confirm("Avslutte regneprøven?")) return;
  CALC_STATE.active = false;
  CALC_STATE.finished = false;
  renderCalcIntro();
}

function renderCalcTask() {
  const t = CALC_STATE.queue[CALC_STATE.idx];
  const progressPct = ((CALC_STATE.idx) / CALC_STATE.queue.length) * 100;

  const partsHtml = t.parts.map(p => {
    const key = `${t.id}__${p.id}`;
    const userVal = CALC_STATE.partAnswers[key] ?? "";
    const res = CALC_STATE.partResults[key];
    const inputCls = res === "good" ? "task-part-input good" : res === "bad" ? "task-part-input bad" : "task-part-input";

    // Render spørsmål med inline matte
    const qHtml = renderProseWithMath(p.q || "");
    const symHtml = p.sym ? `<span style="margin-right:6px;">${renderInlineMath(p.sym)} =</span>` : "";

    return `
      <div class="task-part">
        <div class="task-part-letter">${escapeHTML(p.id)}</div>
        <div class="task-part-body">
          <div class="task-part-q">${qHtml}</div>
          <div class="${inputCls}">
            ${symHtml}
            <input type="number" id="inp-${key}" value="${userVal}" placeholder="Svar" step="any" />
            <span class="unit">${renderInlineMath(p.unit || "")}</span>
            <button class="btn small" onclick="checkCalcPart('${t.id}','${p.id}')">Kontroller</button>
            <button class="btn small ghost" onclick="toggleCalcFasit('${t.id}','${p.id}')">${CALC_STATE.showFasit[key] ? "Skjul fasit" : "Vis fasit"}</button>
          </div>
          ${CALC_STATE.showFasit[key] ? renderCalcFasit(t, p) : ""}
        </div>
      </div>
    `;
  }).join("");

  const taskNumber = `Oppgave ${CALC_STATE.idx + 1}`;
  const meta = `<span class="tag">${escapeHTML(t.tema)}/${escapeHTML(t.undertema)}</span>`;

  $("#page-calc").innerHTML = `
    <div class="quiz-bar">
      <div class="quiz-bar-left">
        <div class="quiz-bar-progress">
          <div class="quiz-bar-title">Oppgave ${CALC_STATE.idx + 1} av ${CALC_STATE.queue.length}: ${escapeHTML(t.title)}</div>
          <div class="quiz-bar-sub">${topicName(t.undertema)}</div>
          <div class="quiz-bar-meter"><span style="width:${progressPct}%"></span></div>
        </div>
      </div>
      <button class="btn small" onclick="quitCalc()">Avslutt</button>
    </div>

    <div class="task-card">
      ${renderTaskHeader(t, { number: taskNumber, meta: meta })}
      <div class="task-section">
        <span class="task-section-label">Deloppgaver</span>
        <div class="task-parts">${partsHtml}</div>
      </div>
      <div style="margin-top: 28px; display: flex; gap: 10px; padding-top: 18px; border-top: 1px solid var(--line-2);">
        <button class="btn ghost" ${CALC_STATE.idx === 0 ? "disabled" : ""} onclick="calcPrev()">← Forrige</button>
        ${CALC_STATE.idx < CALC_STATE.queue.length - 1
          ? `<button class="btn primary" onclick="calcNext()">Neste →</button>`
          : `<button class="btn accent" onclick="calcFinish()">Lever prøve</button>`}
      </div>
    </div>
  `;
  // Restore input listeners
  for (const p of t.parts) {
    const key = `${t.id}__${p.id}`;
    const inp = document.getElementById(`inp-${key}`);
    if (inp) {
      inp.addEventListener("input", e => {
        CALC_STATE.partAnswers[key] = e.target.value;
      });
    }
  }
  setTimeout(() => refreshKatex(document.getElementById("page-calc")), 0);
}

function renderCalcFasit(task, part) {
  const isCorrect = CALC_STATE.partResults[`${task.id}__${part.id}`] === "good";
  const correctTag = isCorrect ? '<span class="tag good" style="margin-left: 8px;">Du svarte riktig</span>' : "";
  const symHtml = part.sym ? `${renderInlineMath(part.sym)} = ` : "";
  return `
    <div class="fasit-box">
      <div class="fasit-section">
        <span class="fasit-label">Riktig svar</span>
        <div class="fasit-answer">${symHtml}<strong>${escapeHTML(String(part.answer))} ${renderInlineMath(part.unit || "")}</strong>${correctTag}</div>
      </div>
      ${part.formula ? `
      <div class="fasit-section">
        <span class="fasit-label">Formel</span>
        ${renderFormula(part.formula)}
      </div>` : ""}
      ${part.steps && part.steps.length > 0 ? `
      <div class="fasit-section">
        <span class="fasit-label">Steg for steg</span>
        <div>${part.steps.map(s => renderStep(s)).join("")}</div>
      </div>` : ""}
    </div>
  `;
}

function checkCalcPart(taskId, partId) {
  const key = `${taskId}__${partId}`;
  const t = CALC_TASKS.find(x => x.id === taskId);
  const p = t.parts.find(x => x.id === partId);
  const val = parseFloat(CALC_STATE.partAnswers[key]);
  if (isNaN(val)) {
    toast("Skriv inn et tall først");
    return;
  }
  const ok = Math.abs(val - p.answer) <= p.tol;
  CALC_STATE.partResults[key] = ok ? "good" : "bad";
  toast(ok ? "Riktig ✓" : `Ikke helt — fasit er ${p.answer} ${p.unit}`);
  renderCalcTask();
}

function toggleCalcFasit(taskId, partId) {
  const key = `${taskId}__${partId}`;
  CALC_STATE.showFasit[key] = !CALC_STATE.showFasit[key];
  renderCalcTask();
}

function calcPrev() {
  if (CALC_STATE.idx > 0) { CALC_STATE.idx--; renderCalcTask(); }
}
function calcNext() {
  if (CALC_STATE.idx < CALC_STATE.queue.length - 1) { CALC_STATE.idx++; renderCalcTask(); }
}

function calcFinish() {
  // Lagre alle delresultater
  for (const t of CALC_STATE.queue) {
    const parts = t.parts.map(p => {
      const key = `${t.id}__${p.id}`;
      const ok = CALC_STATE.partResults[key] === "good";
      return { partId: p.id, correct: ok };
    });
    const allCorrect = parts.every(p => p.correct);
    STATE.calcAttempts.push({
      date: Date.now(), taskId: t.id, parts, allCorrect
    });
  }
  saveState();
  const total = CALC_STATE.queue.reduce((s,t) => s + t.parts.length, 0);
  const correct = CALC_STATE.queue.reduce((s,t) => s + t.parts.filter(p => CALC_STATE.partResults[`${t.id}__${p.id}`] === "good").length, 0);
  logActivity("calc", `Regneprøve (${correct}/${total} delspm.)`, total ? correct/total*100 : 0);
  CALC_STATE.finished = true;
  renderCalcResults();
}

function renderCalcResults() {
  const queue = CALC_STATE.queue;
  const rows = queue.map((t, i) => {
    const partResults = t.parts.map(p => {
      const ok = CALC_STATE.partResults[`${t.id}__${p.id}`] === "good";
      return ok ? '<span class="tag good">✓</span>' : '<span class="tag bad">✗</span>';
    }).join(" ");
    return `<tr><td>${i+1}</td><td>${escapeHTML(t.title)}</td><td>${t.tema}/${t.undertema}</td><td>${partResults}</td></tr>`;
  }).join("");
  const total = queue.reduce((s,t) => s + t.parts.length, 0);
  const correct = queue.reduce((s,t) => s + t.parts.filter(p => CALC_STATE.partResults[`${t.id}__${p.id}`] === "good").length, 0);

  $("#page-calc").innerHTML = `
    <div class="card center">
      <h2>Regneprøve fullført</h2>
      <div class="summary-grid" style="margin: 18px 0;">
        <div class="stat"><div class="stat-label">Riktige delspm.</div><div class="stat-value" style="color:var(--good)">${correct}</div></div>
        <div class="stat"><div class="stat-label">Totalt</div><div class="stat-value">${total}</div></div>
        <div class="stat"><div class="stat-label">Prosent</div><div class="stat-value">${total ? (correct/total*100).toFixed(0) : 0}%</div></div>
      </div>
      <div>
        <button class="btn primary" onclick="(()=>{CALC_STATE.finished=false; CALC_STATE.active=false; renderCalcIntro();})()">Ny prøve</button>
        <button class="btn" onclick="router('analytics')">Se historikk</button>
      </div>
    </div>
    <div class="card">
      <h3>Per oppgave</h3>
      <table class="data-table">
        <thead><tr><th>#</th><th>Tittel</th><th>Tema</th><th>Delspm.</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

