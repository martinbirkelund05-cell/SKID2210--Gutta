/* ============================================================
   EKSAMENSPRØVE
   Bygger en realistisk eksamen ut fra previousExamPatterns +
   examCompositionRules. MC-oppgaver lagres uten umiddelbar
   evaluering — alt vurderes ved innlevering.
   ============================================================ */
const EXAM_STATE = {
  active: false, finished: false,
  tasks: [],          // sammensatt eksamen
  idx: 0,
  answers: {},        // taskId -> { value? choice? text? selfEval? }
};

function renderExam() {
  if (EXAM_STATE.finished) return renderExamResults();
  if (!EXAM_STATE.active) return renderExamIntro();
  renderExamTask();
}

function renderExamIntro() {
  const rulesRows = EXAM_COMPOSITION_RULES.rules.map(r => `
    <tr><td><strong>${r.tema} – ${TOPICS.find(t=>t.id===r.tema).name}</strong></td>
        <td>${r.minPoints}–${r.maxPoints} poeng</td>
        <td>${r.preferredTaskTypes.join(", ")}</td></tr>
  `).join("");

  const patternsHtml = PREVIOUS_EXAM_PATTERNS.map(p => `
    <details style="margin-bottom: 8px;">
      <summary style="cursor: pointer; font-weight: 600;">${p.year} (${p.totalPoints} p, ${p.totalTasks} oppg.)</summary>
      <table class="data-table" style="margin-top: 6px;">
        <thead><tr><th>Tema</th><th>Type</th><th>Poeng</th><th>Tema testet</th></tr></thead>
        <tbody>
          ${p.composition.map(c => `<tr>
            <td>${c.tema}/${c.undertema}</td>
            <td>${c.taskType}</td>
            <td>${c.typicalPoints}</td>
            <td><span class="muted">${c.testedMethods.join(", ")}</span></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </details>
  `).join("");

  $("#page-exam").innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">Eksamensprøve</div>
      <h1 class="page-title">Full eksamen</h1>
      <p class="page-sub">Generer en eksamensprøve som er satt sammen basert på mønstre fra tidligere eksamener og komposisjonsregler. Ca. 100 poeng totalt.</p>
    </div>

    <div class="card exam-intro">
      <h2>Slik fungerer det</h2>
      <p>Hver prøve trekkes vektet ut fra <strong>tidligere eksamensmønstre</strong> og <strong>komposisjonsregler</strong>. Alle hovedtemaer A/B/C/D er representert, med en blanding av regneoppgaver, multiple choice og kortsvar — slik som på reell eksamen.</p>
      <p style="margin-top: 8px;">Multiple choice-oppgavene evalueres <strong>først ved innlevering</strong>, ikke umiddelbart. Du kan navigere fritt mellom oppgavene før du leverer.</p>
      <div style="margin-top: 14px;">
        <button class="btn accent" onclick="startExam()">Start eksamensprøve</button>
      </div>
    </div>

    <div class="card">
      <h3>Komposisjonsregler</h3>
      <table class="data-table">
        <thead><tr><th>Tema</th><th>Poeng-intervall</th><th>Typer</th></tr></thead>
        <tbody>${rulesRows}</tbody>
      </table>
    </div>

    <div class="card">
      <h3>Tidligere eksamener</h3>
      <p class="muted">Mønstrene som ligger bak eksamensgeneratoren.</p>
      ${patternsHtml}
    </div>
  `;
}

/** Sett sammen en eksamen ut fra reglene */
function composeExam() {
  const used = new Set();
  const selected = [];
  const rules = EXAM_COMPOSITION_RULES.rules;

  for (const rule of rules) {
    const pool = EXAM_TASK_BANK.filter(t => t.tema === rule.tema && !used.has(t.id));
    const targetPoints = (rule.minPoints + rule.maxPoints) / 2;
    let acquiredPoints = 0;
    const candidates = shuffle(pool);
    // Velg oppgaver til vi er i intervallet og har minst én oppgave
    for (const c of candidates) {
      if (acquiredPoints >= targetPoints) break;
      if (acquiredPoints + c.points > rule.maxPoints && acquiredPoints >= rule.minPoints) break;
      selected.push(c);
      used.add(c.id);
      acquiredPoints += c.points;
    }
    // Hvis vi ikke har nådd minPoints, legg til mer
    if (acquiredPoints < rule.minPoints) {
      for (const c of candidates) {
        if (used.has(c.id)) continue;
        selected.push(c);
        used.add(c.id);
        acquiredPoints += c.points;
        if (acquiredPoints >= rule.minPoints) break;
      }
    }
  }

  // Sorter A/B/C/D
  selected.sort((a, b) => a.tema.localeCompare(b.tema));
  return selected;
}

function startExam() {
  EXAM_STATE.tasks = composeExam();
  EXAM_STATE.idx = 0;
  EXAM_STATE.answers = {};
  EXAM_STATE.active = true;
  EXAM_STATE.finished = false;
  renderExamTask();
}

function quitExam() {
  if (!confirm("Avslutte eksamensprøven? Resultater så langt blir ikke lagret.")) return;
  EXAM_STATE.active = false;
  EXAM_STATE.finished = false;
  renderExamIntro();
}

/** Lagrer aktivt input-felt før navigasjon */
function persistCurrentExamInput() {
  const t = EXAM_STATE.tasks[EXAM_STATE.idx];
  if (!t) return;
  if (t.taskType === "calculation") {
    const inp = $("#exam-input");
    if (inp) {
      EXAM_STATE.answers[t.id] = EXAM_STATE.answers[t.id] || {};
      EXAM_STATE.answers[t.id].value = inp.value;
    }
  } else if (t.taskType === "shortAnswer") {
    const ta = $("#exam-text");
    if (ta) {
      EXAM_STATE.answers[t.id] = EXAM_STATE.answers[t.id] || {};
      EXAM_STATE.answers[t.id].text = ta.value;
    }
  }
}

/** Render én eksamensoppgave (forgrener på taskType) */
function renderExamTask() {
  const t = EXAM_STATE.tasks[EXAM_STATE.idx];
  const totalPoints = EXAM_STATE.tasks.reduce((s,x) => s + x.points, 0);
  const progressPct = ((EXAM_STATE.idx) / EXAM_STATE.tasks.length) * 100;

  let body = "";
  if (t.taskType === "calculation") body = renderExamCalcTask(t);
  else if (t.taskType === "multipleChoice") body = renderExamMultipleChoiceTask(t, EXAM_STATE.answers[t.id]);
  else body = renderExamShortAnswerTask(t);

  const formulaHtml = (t.formulaTokens && t.formulaTokens.length)
    ? `<div class="task-section">
        <span class="task-section-label">Relevante formler</span>
        <div>${t.formulaTokens.map(tok => FB(tok)).join("")}</div>
      </div>`
    : "";

  // Bygg en pseudo-task for renderTaskHeader (eksamensoppgaver har ikke samme struktur som CALC_TASKS)
  const examTaskForHeader = {
    title: typeLabel(t.taskType),
    text: t.text,
    source: t.origin || "",
    lecture: "",
    slide: ""
  };
  const taskNumber = `Oppgave ${EXAM_STATE.idx + 1}`;
  const meta = `<span class="tag">${escapeHTML(t.tema || "")}/${escapeHTML(t.undertema || "")}</span> · <strong>${t.points} p</strong>`;

  $("#page-exam").innerHTML = `
    <div class="quiz-bar">
      <div class="quiz-bar-left">
        <div class="quiz-bar-progress">
          <div class="quiz-bar-title">Oppgave ${EXAM_STATE.idx + 1} av ${EXAM_STATE.tasks.length} · ${t.points} poeng · ${typeLabel(t.taskType)}</div>
          <div class="quiz-bar-sub">${topicName(t.undertema)} (${t.tema})</div>
          <div class="quiz-bar-meter"><span style="width:${progressPct}%"></span></div>
        </div>
      </div>
      <button class="btn small" onclick="quitExam()">Avslutt</button>
    </div>

    <div class="task-card">
      ${renderTaskHeader(examTaskForHeader, { number: taskNumber, meta: meta })}
      ${formulaHtml}
      <div class="task-section">
        <span class="task-section-label">Ditt svar</span>
        ${body}
      </div>
    </div>

    <div class="card compact" style="display:flex; align-items:center; gap:10px;">
      <button class="btn ghost" ${EXAM_STATE.idx === 0 ? "disabled" : ""} onclick="examPrev()">← Forrige</button>
      ${EXAM_STATE.idx < EXAM_STATE.tasks.length - 1
        ? `<button class="btn primary" onclick="examNext()">Neste →</button>`
        : `<button class="btn accent" onclick="examSubmit()">Lever eksamen (${totalPoints} p)</button>`}
      <span class="muted" style="margin-left:auto; font-size: 12px;">${countAnswered()}/${EXAM_STATE.tasks.length} besvart</span>
    </div>
  `;

  // Bind change listeners
  if (t.taskType === "calculation") {
    const inp = $("#exam-input");
    if (inp) inp.addEventListener("input", e => {
      EXAM_STATE.answers[t.id] = EXAM_STATE.answers[t.id] || {};
      EXAM_STATE.answers[t.id].value = e.target.value;
    });
  }
  if (t.taskType === "shortAnswer") {
    const ta = $("#exam-text");
    if (ta) ta.addEventListener("input", e => {
      EXAM_STATE.answers[t.id] = EXAM_STATE.answers[t.id] || {};
      EXAM_STATE.answers[t.id].text = e.target.value;
    });
  }
  setTimeout(() => refreshKatex(document.getElementById("page-exam")), 0);
}

function typeLabel(tt) {
  return tt === "calculation" ? "Regneoppgave"
       : tt === "multipleChoice" ? "Multiple choice"
       : "Kortsvar";
}

function countAnswered() {
  let n = 0;
  for (const t of EXAM_STATE.tasks) {
    const a = EXAM_STATE.answers[t.id];
    if (!a) continue;
    if (t.taskType === "calculation" && a.value !== undefined && a.value !== "") n++;
    else if (t.taskType === "multipleChoice" && a.choice !== undefined) n++;
    else if (t.taskType === "shortAnswer" && a.text && a.text.trim().length > 0) n++;
  }
  return n;
}

function renderExamCalcTask(t) {
  const cur = EXAM_STATE.answers[t.id] || {};
  const val = cur.value ?? "";
  return `
    <div class="task-part-input" style="margin-top: 4px;">
      <input type="number" id="exam-input" placeholder="Skriv inn svaret" step="any" value="${escapeHTML(val)}" />
      <span class="unit">${renderInlineMath(t.unit || "")}</span>
    </div>
    <p class="muted" style="font-size: 12px; margin-top: 10px;">Svar lagres automatisk. Evalueres ved innlevering.</p>
  `;
}

/** Multiple choice: lagre BARE valgt indeks, ikke evaluere før innlevering */
function renderExamMultipleChoiceTask(task, userAnswer) {
  const choice = userAnswer && typeof userAnswer.choice === "number" ? userAnswer.choice : null;
  const opts = task.options.map((o, i) => {
    const sel = (i === choice) ? " selected" : "";
    const letter = String.fromCharCode(65+i);
    return `<div class="mcq-option${sel}" onclick="examMcqSelect('${task.id}', ${i})">
      <strong style="margin-right: 8px;">${letter}.</strong> ${renderProseWithMath(o)}
    </div>`;
  }).join("");
  return `
    <div class="mcq-options" style="margin-top: 10px;">${opts}</div>
    <p class="muted" style="font-size: 12px; margin-top: 8px;">Valg lagres automatisk. Evalueres ved innlevering.</p>
  `;
}

function examMcqSelect(taskId, choice) {
  EXAM_STATE.answers[taskId] = EXAM_STATE.answers[taskId] || {};
  EXAM_STATE.answers[taskId].choice = choice;
  renderExamTask();
}

/** Eksamensvurdering for MC-oppgave */
function gradeExamMultipleChoiceTask(task, userAnswer) {
  if (!userAnswer || typeof userAnswer.choice !== "number") {
    return { correct: false, earned: 0, userChoice: null };
  }
  const correct = userAnswer.choice === task.correct;
  return {
    correct, earned: correct ? task.points : 0,
    userChoice: userAnswer.choice
  };
}

function renderExamShortAnswerTask(t) {
  const cur = EXAM_STATE.answers[t.id] || {};
  return `
    <textarea id="exam-text" placeholder="Skriv ditt svar her..." style="width: 100%; min-height: 160px; padding: 14px; border: 1px solid var(--line); border-radius: 8px; font-family: var(--font-serif); font-size: 1em; line-height: 1.7; resize: vertical;">${escapeHTML(cur.text || "")}</textarea>
    <p class="muted" style="font-size: 12px; margin-top: 10px;">Skrive- og kortsvars-oppgaver vurderes manuelt mot fasit ved innlevering.</p>
  `;
}

function examPrev() {
  persistCurrentExamInput();
  if (EXAM_STATE.idx > 0) { EXAM_STATE.idx--; renderExamTask(); }
}
function examNext() {
  persistCurrentExamInput();
  if (EXAM_STATE.idx < EXAM_STATE.tasks.length - 1) { EXAM_STATE.idx++; renderExamTask(); }
}

function examSubmit() {
  persistCurrentExamInput();
  // Vurder alt
  const perTask = EXAM_STATE.tasks.map(t => {
    const ans = EXAM_STATE.answers[t.id] || {};
    let earned = 0, correct = false, userAnswer = null;
    if (t.taskType === "calculation") {
      const v = parseFloat(ans.value);
      userAnswer = isNaN(v) ? null : v;
      if (!isNaN(v) && Math.abs(v - t.answer) <= t.tol) { earned = t.points; correct = true; }
    } else if (t.taskType === "multipleChoice") {
      const r = gradeExamMultipleChoiceTask(t, ans);
      earned = r.earned;
      correct = r.correct;
      userAnswer = r.userChoice;
    } else {
      // Kortsvar — evaluering basert på lengde + selvevaluering ved gjennomgang
      // Initielt: gi 0 hvis ikke besvart; ellers gi halvt poeng som plassholder.
      // Brukeren får full kontroll til å justere ved selvevaluering på resultatsiden.
      const txt = (ans.text || "").trim();
      userAnswer = txt;
      if (txt.length > 30) { earned = Math.round(t.points * 0.5); correct = null; }
    }
    return {
      id: t.id, tema: t.tema, undertema: t.undertema, taskType: t.taskType,
      origin: t.origin, exercise: t.exercise, exerciseTask: t.exerciseTask,
      matchesExamPattern: t.matchesExamPattern,
      earned, max: t.points, correct, userAnswer,
      selfEval: null
    };
  });

  const earnedTotal = perTask.reduce((s,p) => s + p.earned, 0);
  const maxTotal = perTask.reduce((s,p) => s + p.max, 0);
  const totalPct = maxTotal ? earnedTotal/maxTotal*100 : 0;
  const grade = gradeFromPct(totalPct);

  STATE.examAttempts.push({
    date: Date.now(),
    taskIds: EXAM_STATE.tasks.map(t => t.id),
    perTask, earnedTotal, maxTotal, totalPct, grade
  });
  saveState();
  logActivity("exam", `Eksamensprøve (${earnedTotal}/${maxTotal} p, ${grade})`, totalPct);
  EXAM_STATE.finished = true;
  renderExamResults();
}

function renderExamResults() {
  const att = STATE.examAttempts[STATE.examAttempts.length - 1];
  const grade = att.grade;
  const pct = att.totalPct;

  // Per oppgave
  const taskRows = att.perTask.map((p, i) => {
    const t = EXAM_TASK_BANK.find(x => x.id === p.id);
    let userStr = "—", correctStr = "—";
    if (p.taskType === "multipleChoice" && t) {
      userStr = (p.userAnswer != null) ? `${String.fromCharCode(65+p.userAnswer)}. ${escapeHTML(t.options[p.userAnswer])}` : "<em>Ikke besvart</em>";
      correctStr = `${String.fromCharCode(65+t.correct)}. ${escapeHTML(t.options[t.correct])}`;
    } else if (p.taskType === "calculation" && t) {
      userStr = (p.userAnswer != null) ? `${p.userAnswer} ${t.unit}` : "<em>Ikke besvart</em>";
      correctStr = `${t.answer} ${t.unit}`;
    } else if (p.taskType === "shortAnswer" && t) {
      userStr = p.userAnswer ? `<em>${escapeHTML((p.userAnswer || "").slice(0, 90))}${(p.userAnswer||"").length>90?"…":""}</em>` : "<em>Ikke besvart</em>";
      correctStr = `<em>${escapeHTML(t.answer.slice(0, 90))}…</em>`;
    }
    const status = p.correct === true ? '<span class="tag good">Rett</span>'
                 : p.correct === false ? '<span class="tag bad">Feil</span>'
                 : '<span class="tag warn">Vurderes</span>';
    return `<tr>
      <td>${i+1}</td>
      <td>${p.tema}/${p.undertema}</td>
      <td>${typeLabel(p.taskType)}</td>
      <td>${userStr}</td>
      <td>${correctStr}</td>
      <td>${p.earned} / ${p.max}</td>
      <td>${status}</td>
    </tr>`;
  }).join("");

  // Forklaringer
  const explanations = att.perTask.map((p, i) => {
    const t = EXAM_TASK_BANK.find(x => x.id === p.id);
    if (!t) return "";
    return `
      <details style="margin-bottom: 10px;">
        <summary style="cursor: pointer; font-weight: 600;">Oppgave ${i+1}: ${escapeHTML(t.text.slice(0, 80))}${t.text.length>80?"…":""}</summary>
        <div class="accordion-body" style="margin-top: 6px;">
          <h4>Kort konklusjon</h4>
          <div>${p.correct === true ? "Du svarte riktig ✓" : p.correct === false ? "Feil — se fasit nedenfor" : "Manuell vurdering — sammenlign med fasit"}</div>
          ${(t.formulaTokens && t.formulaTokens.length) ? `<h4>Formel</h4>${t.formulaTokens.map(tok => FB(tok)).join("")}` : ""}
          <h4>Stegvis løsning</h4>
          <div>${escapeHTML(t.solution)}</div>
          <h4>Kilde</h4>
          <div>${escapeHTML(t.origin)} · forelesning ${t.lecture} slide ${t.slide} · ${t.exercise} ${t.exerciseTask || ""}</div>
        </div>
      </details>
    `;
  }).join("");

  // Svake tema (per undertema, der earned/max < 0.6)
  const weakMap = {};
  for (const p of att.perTask) {
    weakMap[p.undertema] = weakMap[p.undertema] || { earned: 0, max: 0, name: topicName(p.undertema) };
    weakMap[p.undertema].earned += p.earned;
    weakMap[p.undertema].max += p.max;
  }
  const weak = Object.entries(weakMap)
    .map(([k,v]) => ({ k, ...v, ratio: v.max ? v.earned/v.max : 0 }))
    .filter(x => x.ratio < 0.6)
    .sort((a,b) => a.ratio - b.ratio);

  const weakHtml = weak.length ? `
    <div class="card">
      <h3>Svake tema i denne prøven</h3>
      <p class="muted">Disse temaene fikk du under 60% på.</p>
      ${weak.map(w => `<div style="margin: 6px 0;">
        <strong>${w.k}</strong> – ${escapeHTML(w.name)}
        <div class="weak-bar"><div class="weak-bar-fill" style="width:${(1-w.ratio)*100}%"></div></div>
        <div class="muted" style="font-size: 12px;">${w.earned}/${w.max} poeng (${(w.ratio*100).toFixed(0)}%)</div>
      </div>`).join("")}
    </div>
  ` : "";

  // Anbefalinger
  const recs = att.perTask.filter(p => p.correct === false).slice(0, 5)
    .map(p => {
      const t = EXAM_TASK_BANK.find(x => x.id === p.id);
      return t ? `<li>${escapeHTML(t.exercise)} ${escapeHTML(t.exerciseTask || "")} — for tema ${t.tema}/${t.undertema}</li>` : "";
    }).join("");

  // Mønstre dekket
  const allPatterns = [...new Set(att.perTask.flatMap(p => p.matchesExamPattern || []))];

  $("#page-exam").innerHTML = `
    <div class="card center">
      <h2>Eksamensprøve fullført</h2>
      <div style="display: flex; gap: 24px; align-items: center; justify-content: center; margin: 18px 0;">
        <div class="exam-grade-circle grade-${grade}">${grade}</div>
        <div>
          <div style="font-size: 32px; font-weight: 700; font-family: var(--font-serif);">${pct.toFixed(1)}%</div>
          <div class="muted">${att.earnedTotal} / ${att.maxTotal} poeng</div>
        </div>
      </div>
      <div>
        <button class="btn primary" onclick="(()=>{EXAM_STATE.finished=false; EXAM_STATE.active=false; renderExamIntro();})()">Ny eksamensprøve</button>
        <button class="btn" onclick="router('analytics')">Se historikk</button>
        <button class="btn ghost" onclick="router('home')">Til dashboard</button>
      </div>
    </div>

    <div class="card">
      <h3>Resultater per oppgave</h3>
      <table class="data-table">
        <thead><tr>
          <th>#</th><th>Tema</th><th>Type</th>
          <th>Ditt svar</th><th>Fasit</th><th>Poeng</th><th>Status</th>
        </tr></thead>
        <tbody>${taskRows}</tbody>
      </table>
    </div>

    ${weakHtml}

    <div class="card">
      <h3>Forklaringer og fasit</h3>
      ${explanations}
    </div>

    ${recs ? `<div class="card">
      <h3>Anbefalt videre øving</h3>
      <ul>${recs}</ul>
    </div>` : ""}

    ${allPatterns.length ? `<div class="card">
      <h3>Eksamensmønstre dekket</h3>
      <div>${allPatterns.map(m => `<span class="tag">${escapeHTML(m)}</span>`).join("")}</div>
    </div>` : ""}
  `;
}

