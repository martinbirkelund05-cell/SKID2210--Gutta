/* ============================================================
   MULTIPLE CHOICE — 20-spm prøve, intro / aktiv / resultat
   ============================================================ */
const MCQ_STATE = { active: false, finished: false, quiz: [], idx: 0, answers: {}, filter: "all" };

function renderMcq() {
  if (MCQ_STATE.finished) return renderMcqResults();
  if (!MCQ_STATE.active) return renderMcqIntro();
  renderMcqQuestion();
}

function renderMcqIntro() {
  $("#page-mcq").innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">Multiple Choice</div>
      <h1 class="page-title">Fleirvalsoppgaver</h1>
      <p class="page-sub">20 spørsmål per prøve, hentet fra øvinger og tidligere eksamener. Spørsmålene blandes tilfeldig innen valgt tema.</p>
    </div>
    <div class="card">
      <div class="topic-picker">
        <label>Tema</label>
        ${buildTopicPicker("mcq", MCQ_STATE.filter)}
      </div>
      <div style="margin-top: 14px;">
        <button class="btn primary" onclick="startMcq()">Start prøve (20 spørsmål)</button>
      </div>
    </div>
  `;
}

function startMcq() {
  MCQ_STATE.filter = $("#mcq-topic").value;
  let pool = filterByTopic(MCQ, MCQ_STATE.filter);
  let usedFallback = false;
  const target = Math.min(20, MCQ.length);
  if (pool.length < target) {
    pool = pickN(pool, target, MCQ);
    usedFallback = true;
  } else {
    pool = shuffle(pool).slice(0, target);
  }
  MCQ_STATE.quiz = pool;
  MCQ_STATE.idx = 0;
  MCQ_STATE.answers = {};
  MCQ_STATE.active = true;
  MCQ_STATE.finished = false;
  if (usedFallback) toast("Få spørsmål i valgt tema – fyller på fra andre temaer");
  renderMcqQuestion();
}

function quitMcq() {
  if (!confirm("Avslutte prøven? Resultater så langt blir ikke lagret.")) return;
  MCQ_STATE.active = false;
  MCQ_STATE.finished = false;
  renderMcqIntro();
}

function renderMcqQuestion() {
  const q = MCQ_STATE.quiz[MCQ_STATE.idx];
  const a = MCQ_STATE.answers[q.id];
  const showFeedback = a != null;
  const progressPct = ((MCQ_STATE.idx + (showFeedback ? 1 : 0)) / MCQ_STATE.quiz.length) * 100;

  let optsHtml = q.options.map((opt, i) => {
    let cls = "mcq-option";
    if (showFeedback) {
      if (i === q.correct) cls += " correct";
      else if (i === a) cls += " wrong";
    } else if (a === i) cls += " selected";
    const letter = String.fromCharCode(65+i);
    return `<div class="${cls}" onclick="${showFeedback ? "" : `mcqAnswer(${i})`}">
      <strong style="margin-right: 8px;">${letter}.</strong> ${renderProseWithMath(opt)}
    </div>`;
  }).join("");

  const feedbackHtml = showFeedback ? `
    <div class="fasit-box" style="margin-top: 18px;">
      <div class="fasit-section">
        <span class="fasit-label">${a === q.correct ? "Riktig svar" : "Forklaring"}</span>
        <div class="fasit-answer">${a === q.correct ? "✓ " : ""}${renderProseWithMath(q.explanation || "")}</div>
      </div>
      <div class="fasit-section">
        <span class="fasit-label">Kilde</span>
        <div style="font-size: 0.9em; color: var(--muted); font-style: italic;">${escapeHTML(q.source || "")}${q.lecture ? " · forelesning " + escapeHTML(q.lecture) : ""}${q.slide && q.slide !== "–" ? " · slide " + escapeHTML(q.slide) : ""}</div>
      </div>
    </div>
    <div style="margin-top: 18px; display: flex; gap: 10px;">
      ${MCQ_STATE.idx < MCQ_STATE.quiz.length - 1
        ? `<button class="btn primary" onclick="mcqNext()">Neste →</button>`
        : `<button class="btn accent" onclick="mcqFinish()">Lever prøve</button>`}
    </div>
  ` : "";

  $("#page-mcq").innerHTML = `
    <div class="quiz-bar">
      <div class="quiz-bar-left">
        <div class="quiz-bar-progress">
          <div class="quiz-bar-title">Spørsmål ${MCQ_STATE.idx + 1} av ${MCQ_STATE.quiz.length}</div>
          <div class="quiz-bar-sub">${topicName(q.undertema)}</div>
          <div class="quiz-bar-meter"><span style="width:${progressPct}%"></span></div>
        </div>
      </div>
      <button class="btn small" onclick="quitMcq()">Avslutt</button>
    </div>

    <div class="task-card">
      <div class="task-header">
        <span class="task-number">Spørsmål ${MCQ_STATE.idx + 1}</span>
        <span class="task-title" style="flex: 1;">${escapeHTML(q.tema || "")} / ${escapeHTML(q.undertema || "")}</span>
      </div>
      <div class="mcq-question-text">${renderProseWithMath(q.text)}</div>
      <div class="mcq-options">${optsHtml}</div>
      ${feedbackHtml}
    </div>
  `;
  setTimeout(() => refreshKatex(document.getElementById("page-mcq")), 0);
}

function mcqAnswer(idx) {
  const q = MCQ_STATE.quiz[MCQ_STATE.idx];
  MCQ_STATE.answers[q.id] = idx;
  renderMcqQuestion();
}

function mcqNext() {
  MCQ_STATE.idx++;
  renderMcqQuestion();
}

function mcqFinish() {
  // Bygg resultat
  const perQ = MCQ_STATE.quiz.map(q => {
    const ans = MCQ_STATE.answers[q.id];
    return {
      id: q.id, tema: q.tema, undertema: q.undertema,
      correct: ans === q.correct, userAnswer: ans, correctAnswer: q.correct
    };
  });
  const correct = perQ.filter(x => x.correct).length;
  const attempt = {
    date: Date.now(), filter: MCQ_STATE.filter,
    correct, total: MCQ_STATE.quiz.length, perQ
  };
  STATE.mcqAttempts.push(attempt);
  saveState();
  logActivity("mcq", `MCQ (${correct}/${MCQ_STATE.quiz.length})`, correct/MCQ_STATE.quiz.length*100);
  MCQ_STATE.finished = true;
  renderMcqResults();
}

function renderMcqResults() {
  const att = STATE.mcqAttempts[STATE.mcqAttempts.length - 1];
  const correct = att.correct, total = att.total;
  const pct = correct/total*100;
  const rows = att.perQ.map((p, i) => {
    const q = MCQ.find(x => x.id === p.id);
    return `<tr>
      <td>${i+1}</td>
      <td>${q ? escapeHTML(q.text.slice(0, 70)) + (q.text.length>70?"…":"") : p.id}</td>
      <td>${p.tema}/${p.undertema}</td>
      <td>${p.correct ? '<span class="tag good">Riktig</span>' : '<span class="tag bad">Feil</span>'}</td>
    </tr>`;
  }).join("");

  $("#page-mcq").innerHTML = `
    <div class="card center">
      <h2>Prøve fullført</h2>
      <div class="summary-grid" style="margin: 18px 0;">
        <div class="stat"><div class="stat-label">Riktige</div><div class="stat-value" style="color:var(--good)">${correct}</div></div>
        <div class="stat"><div class="stat-label">Feil</div><div class="stat-value" style="color:var(--bad)">${total-correct}</div></div>
        <div class="stat"><div class="stat-label">Prosent</div><div class="stat-value">${pct.toFixed(0)}%</div></div>
      </div>
      <div>
        <button class="btn primary" onclick="(()=>{MCQ_STATE.finished=false; MCQ_STATE.active=false; renderMcqIntro();})()">Ny prøve</button>
        <button class="btn" onclick="router('analytics')">Se historikk</button>
      </div>
    </div>
    <div class="card">
      <h3>Per spørsmål</h3>
      <table class="data-table">
        <thead><tr><th>#</th><th>Spørsmål</th><th>Tema</th><th>Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

