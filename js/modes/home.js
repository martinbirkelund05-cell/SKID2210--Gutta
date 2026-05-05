/* ============================================================
   DASHBOARD
   ============================================================ */
function calcStats() {
  const fc = STATE.flashcardLog;
  const distinctFc = new Set(fc.map(x => x.cardId)).size;
  const fcKnown = fc.filter(x => x.result === "know").length;

  const mcq = STATE.mcqAttempts;
  const mcqAvg = mcq.length ? mcq.reduce((s,a) => s + a.correct/a.total*100, 0) / mcq.length : 0;

  const calc = STATE.calcAttempts;
  let cCorr = 0, cTot = 0;
  for (const a of calc) for (const p of (a.parts || [])) { cTot++; if (p.correct) cCorr++; }
  const calcAvg = cTot ? (cCorr/cTot*100) : 0;

  const exams = STATE.examAttempts;
  const examAvg = exams.length ? exams.reduce((s,a) => s + a.totalPct, 0) / exams.length : 0;

  const totalHints = STATE.writtenAttempts.reduce((s,a) => s + (a.totalHints || 0), 0);

  // Svakeste tema (hovedtema)
  const weak = {};
  for (const a of mcq) for (const q of (a.perQ || [])) {
    weak[q.tema] = weak[q.tema] || { wrong: 0, total: 0 };
    weak[q.tema].total++;
    if (!q.correct) weak[q.tema].wrong++;
  }
  for (const a of calc) {
    const t = CALC_TASKS.find(x => x.id === a.taskId);
    if (!t) continue;
    for (const p of (a.parts || [])) {
      weak[t.tema] = weak[t.tema] || { wrong: 0, total: 0 };
      weak[t.tema].total++;
      if (!p.correct) weak[t.tema].wrong++;
    }
  }
  for (const a of exams) for (const p of (a.perTask || [])) {
    weak[p.tema] = weak[p.tema] || { wrong: 0, total: 0 };
    weak[p.tema].total++;
    if (!p.correct) weak[p.tema].wrong++;
  }
  let weakest = null, worst = -1;
  for (const k of Object.keys(weak)) {
    if (weak[k].total < 2) continue;
    const r = weak[k].wrong / weak[k].total;
    if (r > worst) { worst = r; weakest = k; }
  }

  const totalContent = FLASHCARDS.length + MCQ.length + CALC_TASKS.length + WRITTEN.length;
  const touched = new Set([
    ...fc.map(x => x.cardId),
    ...mcq.flatMap(a => (a.perQ || []).map(q => q.id)),
    ...calc.map(a => a.taskId),
    ...STATE.writtenAttempts.flatMap(a => (a.results || []).map(r => r.qId))
  ]);
  const progression = totalContent ? touched.size / totalContent * 100 : 0;

  return { distinctFc, fcKnown, mcqAvg, calcAvg, examAvg, totalHints, weakest, worst, progression,
    mcqCount: mcq.length, calcCount: calc.length, examCount: exams.length };
}

function renderHome() {
  const s = calcStats();
  const last = STATE.activity.length ? STATE.activity[STATE.activity.length - 1] : null;
  $("#page-home").innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">SKID2210 · Våren 2026</div>
      <h1 class="page-title">Eksamensøving — Havromskonstruksjoner</h1>
      <p class="page-sub">Øv på flashcards, multiple choice, regneoppgaver og fullstendige eksamensprøver. Alle oppgavene er bygd på øvinger og tidligere eksamener i faget.</p>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-label">Total progresjon</div>
        <div class="stat-value">${fmtPct(s.progression)}</div>
        <div class="stat-bar"><span style="width:${s.progression}%"></span></div>
        <div class="stat-sub">av ${FLASHCARDS.length + MCQ.length + CALC_TASKS.length + WRITTEN.length} oppgaver berørt</div>
      </div>
      <div class="stat">
        <div class="stat-label">Flashcards kunne</div>
        <div class="stat-value">${s.fcKnown}</div>
        <div class="stat-sub">${s.distinctFc} distinkte kort sett</div>
      </div>
      <div class="stat">
        <div class="stat-label">MCQ – snitt</div>
        <div class="stat-value">${fmtPct(s.mcqAvg)}</div>
        <div class="stat-sub">${s.mcqCount} prøver</div>
      </div>
      <div class="stat">
        <div class="stat-label">Regneoppgaver – snitt</div>
        <div class="stat-value">${fmtPct(s.calcAvg)}</div>
        <div class="stat-sub">${s.calcCount} forsøk</div>
      </div>
      <div class="stat">
        <div class="stat-label">Eksamen – snitt</div>
        <div class="stat-value">${fmtPct(s.examAvg)}</div>
        <div class="stat-sub">${s.examCount} prøver</div>
      </div>
      <div class="stat">
        <div class="stat-label">Hint brukt</div>
        <div class="stat-value">${s.totalHints}</div>
        <div class="stat-sub">i innskrivningsprøver</div>
      </div>
      <div class="stat">
        <div class="stat-label">Svakeste tema</div>
        <div class="stat-value" style="font-size: 22px;">${s.weakest ? s.weakest : "–"}</div>
        <div class="stat-sub">${s.weakest ? `${(s.worst*100).toFixed(0)}% feilrate` : "for lite data"}</div>
      </div>
      <div class="stat">
        <div class="stat-label">Siste aktivitet</div>
        <div class="stat-value" style="font-size: 14px; line-height: 1.3;">${last ? last.label : "Ingen ennå"}</div>
        <div class="stat-sub">${last ? fmtDate(last.date) : ""}</div>
      </div>
    </div>

    <div class="card">
      <h2>Start øving</h2>
      <p class="muted">Velg en modus for å begynne. Alle resultater lagres lokalt i nettleseren.</p>
      <div style="margin-top: 12px;">
        <button class="btn primary" onclick="router('flashcards')">◉ Flashcards</button>
        <button class="btn primary" onclick="router('mcq')">⊙ Multiple Choice</button>
        <button class="btn primary" onclick="router('calc')">∑ Regneoppgaver</button>
        <button class="btn primary" onclick="router('written')">≡ Innskrivningsprøve</button>
        <button class="btn accent" onclick="router('exam')">✎ Eksamensprøve</button>
      </div>
    </div>

    <div class="card">
      <h2>Tidligere eksamensmønstre</h2>
      <p class="muted">Eksamensgeneratoren bruker disse mønstrene som utgangspunkt for å sette sammen realistiske prøver.</p>
      <table class="data-table">
        <thead><tr><th>Eksamen</th><th>Antall oppg.</th><th>Hovedtemaer dekket</th></tr></thead>
        <tbody>
          ${PREVIOUS_EXAM_PATTERNS.map(p => `
            <tr>
              <td><strong>${p.year}</strong></td>
              <td>${p.totalTasks}</td>
              <td>${[...new Set(p.composition.map(c => c.tema))].join(", ")}</td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>

    <div class="card">
      <h2>Karaktergrenser</h2>
      <table class="data-table">
        <thead><tr><th>Karakter</th><th>Prosent</th></tr></thead>
        <tbody>
          <tr><td><strong>A</strong></td><td>≥ 95 %</td></tr>
          <tr><td><strong>B</strong></td><td>≥ 75 %</td></tr>
          <tr><td><strong>C</strong></td><td>≥ 65 %</td></tr>
          <tr><td><strong>D</strong></td><td>≥ 55 %</td></tr>
          <tr><td><strong>E</strong></td><td>≥ 40 %</td></tr>
          <tr><td><strong>F</strong></td><td>&lt; 40 %</td></tr>
        </tbody>
      </table>
    </div>
  `;
}

