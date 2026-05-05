/* ============================================================
   INNSKRIVNINGSPRØVE
   ============================================================ */
const WR_STATE = { active: false, finished: false, queue: [], idx: 0, drafts: {}, hintsUsed: {}, showFasit: {}, selfEval: {}, filter: "all" };

function renderWritten() {
  if (WR_STATE.finished) return renderWrittenResults();
  if (!WR_STATE.active) return renderWrittenIntro();
  renderWrittenQuestion();
}

function renderWrittenIntro() {
  $("#page-written").innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">Innskrivningsprøve</div>
      <h1 class="page-title">Skriv egne svar</h1>
      <p class="page-sub">Skriv svaret med egne ord, sammenlign mot fasit, og vurder selv hvor godt du traff. Hint er tilgjengelig om du står fast — men hvert hint logges.</p>
    </div>
    <div class="card">
      <div class="topic-picker">
        <label>Tema</label>
        ${buildTopicPicker("wr", WR_STATE.filter)}
      </div>
      <div style="margin-top: 14px;">
        <button class="btn primary" onclick="startWritten()">Start innskrivningsprøve (10 spm)</button>
      </div>
    </div>
  `;
}

function startWritten() {
  WR_STATE.filter = $("#wr-topic").value;
  let pool = filterByTopic(WRITTEN, WR_STATE.filter);
  let usedFallback = false;
  const target = Math.min(10, WRITTEN.length);
  if (pool.length < target) {
    pool = pickN(pool, target, WRITTEN);
    usedFallback = true;
  } else {
    pool = shuffle(pool).slice(0, target);
  }
  WR_STATE.queue = pool;
  WR_STATE.idx = 0;
  WR_STATE.drafts = {};
  WR_STATE.hintsUsed = {};
  WR_STATE.showFasit = {};
  WR_STATE.selfEval = {};
  WR_STATE.active = true;
  WR_STATE.finished = false;
  if (usedFallback) toast("Få spørsmål i valgt tema – fyller på fra andre temaer");
  renderWrittenQuestion();
}

function quitWritten() {
  if (!confirm("Avslutte innskrivningsprøven?")) return;
  WR_STATE.active = false;
  WR_STATE.finished = false;
  renderWrittenIntro();
}

function renderWrittenQuestion() {
  const q = WR_STATE.queue[WR_STATE.idx];
  const draft = WR_STATE.drafts[q.id] || "";
  const hintShown = WR_STATE.hintsUsed[q.id];
  const fasitShown = WR_STATE.showFasit[q.id];
  const evald = WR_STATE.selfEval[q.id];
  const progressPct = ((WR_STATE.idx + (evald ? 1 : 0)) / WR_STATE.queue.length) * 100;

  // Splitt fasit-svar i kort konklusjon (første setning) og resten
  const answerStr = q.answer || "";
  const firstSentMatch = answerStr.match(/^[^.!?]*[.!?]/);
  const conclusion = firstSentMatch ? firstSentMatch[0].trim() : answerStr;
  const restOfAnswer = firstSentMatch ? answerStr.slice(firstSentMatch[0].length).trim() : "";

  $("#page-written").innerHTML = `
    <div class="quiz-bar">
      <div class="quiz-bar-left">
        <div class="quiz-bar-progress">
          <div class="quiz-bar-title">Spørsmål ${WR_STATE.idx + 1} av ${WR_STATE.queue.length}</div>
          <div class="quiz-bar-sub">${topicName(q.undertema)}</div>
          <div class="quiz-bar-meter"><span style="width:${progressPct}%"></span></div>
        </div>
      </div>
      <button class="btn small" onclick="quitWritten()">Avslutt</button>
    </div>

    <div class="task-card">
      <div class="task-header">
        <span class="task-number">Spørsmål ${WR_STATE.idx + 1}</span>
        <span class="task-title" style="flex: 1;">${escapeHTML(q.tema || "")} / ${escapeHTML(q.undertema || "")}</span>
      </div>
      <div class="task-section">
        <span class="task-section-label">Spørsmål</span>
        <div class="written-text">${renderProseWithMath(q.text)}</div>
      </div>
      <div class="task-section">
        <span class="task-section-label">Ditt svar</span>
        <textarea id="wr-draft" placeholder="Skriv svaret ditt her..." style="width: 100%; min-height: 180px; padding: 14px; border: 1px solid var(--line); border-radius: 8px; font-family: var(--font-serif); font-size: 1em; line-height: 1.7; resize: vertical;">${escapeHTML(draft)}</textarea>
      </div>
      <div style="margin-top: 14px; display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn ghost" onclick="wrToggleHint('${q.id}')">${hintShown ? "Skjul hint" : "Vis hint"}</button>
        <button class="btn" onclick="wrShowFasit('${q.id}')">Vis fasit</button>
      </div>
      ${hintShown ? `<div class="hint-box" style="margin-top: 14px; padding: 14px 18px; background: linear-gradient(90deg, rgba(201,140,44,0.10), transparent); border-left: 3px solid var(--warn); border-radius: 0 6px 6px 0; font-family: var(--font-serif); line-height: 1.65;">💡 ${renderProseWithMath(q.hint || "")}</div>` : ""}
      ${fasitShown ? `
        <div class="fasit-box" style="margin-top: 18px;">
          <div class="fasit-section">
            <span class="fasit-label">Kort konklusjon</span>
            <div class="fasit-answer">${renderProseWithMath(conclusion)}</div>
          </div>
          ${restOfAnswer ? `
          <div class="fasit-section">
            <span class="fasit-label">Fullt svar</span>
            <div class="written-text">${renderProseWithMath(restOfAnswer)}</div>
          </div>` : ""}
          <div class="fasit-section">
            <span class="fasit-label">Kilde</span>
            <div style="font-size: 0.9em; color: var(--muted); font-style: italic;">${escapeHTML(q.source || "")}${q.lecture ? " · forelesning " + escapeHTML(q.lecture) : ""}${q.slide && q.slide !== "–" ? " · slide " + escapeHTML(q.slide) : ""}</div>
          </div>
        </div>
        <div style="margin-top: 18px;">
          <p class="muted" style="margin-bottom: 8px;">Hvor godt traff svaret ditt?</p>
          <button class="btn bad ${evald==="miss"?"primary":""}" onclick="wrSelfEval('${q.id}','miss')">Bommet</button>
          <button class="btn warn ${evald==="partial"?"primary":""}" onclick="wrSelfEval('${q.id}','partial')">Delvis</button>
          <button class="btn good ${evald==="hit"?"primary":""}" onclick="wrSelfEval('${q.id}','hit')">Fulltreffer</button>
        </div>
      ` : ""}
      <div style="margin-top: 22px; display: flex; gap: 10px; padding-top: 18px; border-top: 1px solid var(--line-2);">
        <button class="btn ghost" ${WR_STATE.idx === 0 ? "disabled" : ""} onclick="wrPrev()">← Forrige</button>
        ${WR_STATE.idx < WR_STATE.queue.length - 1
          ? `<button class="btn primary" onclick="wrNext()">Neste →</button>`
          : `<button class="btn accent" onclick="wrFinish()">Lever prøve</button>`}
      </div>
    </div>
  `;
  $("#wr-draft").addEventListener("input", e => {
    WR_STATE.drafts[q.id] = e.target.value;
  });
  setTimeout(() => refreshKatex(document.getElementById("page-written")), 0);
}

function wrToggleHint(qid) {
  WR_STATE.hintsUsed[qid] = !WR_STATE.hintsUsed[qid];
  renderWrittenQuestion();
}
function wrShowFasit(qid) {
  WR_STATE.showFasit[qid] = true;
  renderWrittenQuestion();
}
function wrSelfEval(qid, val) {
  WR_STATE.selfEval[qid] = val;
  renderWrittenQuestion();
}
function wrPrev() { if (WR_STATE.idx > 0) { WR_STATE.idx--; renderWrittenQuestion(); } }
function wrNext() { if (WR_STATE.idx < WR_STATE.queue.length - 1) { WR_STATE.idx++; renderWrittenQuestion(); } }

function wrFinish() {
  const results = WR_STATE.queue.map(q => ({
    qId: q.id, tema: q.tema, undertema: q.undertema,
    selfEval: WR_STATE.selfEval[q.id] || null,
    hintsUsed: WR_STATE.hintsUsed[q.id] ? 1 : 0
  }));
  const hits = results.filter(r => r.selfEval === "hit").length;
  const partials = results.filter(r => r.selfEval === "partial").length;
  const misses = results.filter(r => r.selfEval === "miss").length;
  const totalHints = results.reduce((s,r) => s + r.hintsUsed, 0);
  STATE.writtenAttempts.push({
    date: Date.now(), filter: WR_STATE.filter, results,
    total: results.length, hits, partials, misses, totalHints
  });
  saveState();
  logActivity("written", `Innskrivningsprøve (${hits}/${results.length} fulltreff)`, results.length ? hits/results.length*100 : 0);
  WR_STATE.finished = true;
  renderWrittenResults();
}

function renderWrittenResults() {
  const att = STATE.writtenAttempts[STATE.writtenAttempts.length - 1];
  const rows = att.results.map((r, i) => {
    const tag = r.selfEval === "hit" ? '<span class="tag good">Fulltreffer</span>'
              : r.selfEval === "partial" ? '<span class="tag warn">Delvis</span>'
              : r.selfEval === "miss" ? '<span class="tag bad">Bommet</span>'
              : '<span class="tag muted">Ikke vurdert</span>';
    return `<tr><td>${i+1}</td><td>${r.tema}/${r.undertema}</td><td>${tag}</td><td>${r.hintsUsed ? "1" : "–"}</td></tr>`;
  }).join("");
  $("#page-written").innerHTML = `
    <div class="card center">
      <h2>Innskrivningsprøve fullført</h2>
      <div class="summary-grid" style="margin: 18px 0;">
        <div class="stat"><div class="stat-label">Fulltreffer</div><div class="stat-value" style="color:var(--good)">${att.hits}</div></div>
        <div class="stat"><div class="stat-label">Delvis</div><div class="stat-value" style="color:#8c5a1a">${att.partials}</div></div>
        <div class="stat"><div class="stat-label">Bommet</div><div class="stat-value" style="color:var(--bad)">${att.misses}</div></div>
        <div class="stat"><div class="stat-label">Hint brukt</div><div class="stat-value">${att.totalHints}</div></div>
      </div>
      <div>
        <button class="btn primary" onclick="(()=>{WR_STATE.finished=false; WR_STATE.active=false; renderWrittenIntro();})()">Ny prøve</button>
        <button class="btn" onclick="router('analytics')">Se historikk</button>
      </div>
    </div>
    <div class="card">
      <h3>Per spørsmål</h3>
      <table class="data-table">
        <thead><tr><th>#</th><th>Tema</th><th>Selvevaluering</th><th>Hint</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

