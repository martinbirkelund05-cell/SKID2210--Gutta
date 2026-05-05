/* ============================================================
   ANALYSE
   ============================================================ */
function renderAnalytics() {
  const mcq = STATE.mcqAttempts;
  const calc = STATE.calcAttempts;
  const wr = STATE.writtenAttempts;
  const exams = STATE.examAttempts;

  // ---- MCQ chart ----
  const mcqChart = mcq.length ? `<div class="bar-chart-blocks">
    ${mcq.slice(-15).map((a, i) => {
      const total = a.total, correct = a.correct;
      const blocks = Array.from({length: total}, (_, k) => `<div class="block ${k < correct ? "filled good" : ""}"></div>`).join("");
      return `<div class="bar-col">
        <div class="bar-blocks">${blocks}</div>
        <div class="bar-label">${correct}/${total}</div>
        <div class="bar-sublabel">${fmtDate(a.date)}</div>
      </div>`;
    }).join("")}
  </div>` : `<p class="muted">Ingen MCQ-prøver ennå.</p>`;

  // ---- Eksamen chart (med karakter-overlays) ----
  const examChart = exams.length ? `<div class="bar-chart-pct">
    ${[40,55,65,75,95].map(g => `<div class="grade-line" style="bottom:${g*2.4 + 36}px"><span class="grade-label">${gradeFromPct(g)} ≥ ${g}%</span></div>`).join("")}
    ${exams.slice(-12).map(a => {
      const h = (a.totalPct * 2.4);
      return `<div class="bar-col-pct">
        <div class="bar-fill grade-${a.grade}" style="height:${h}px"></div>
        <div class="bar-label" style="margin-top: 4px;">${a.totalPct.toFixed(0)}% (${a.grade})</div>
        <div class="bar-sublabel">${fmtDate(a.date)}</div>
      </div>`;
    }).join("")}
  </div>` : `<p class="muted">Ingen eksamensprøver ennå.</p>`;

  // ---- Innskrivning chart ----
  const wrChart = wr.length ? `<div class="bar-chart-blocks">
    ${wr.slice(-15).map(a => {
      const blocks = Array.from({length: a.total}, (_, k) => {
        const r = a.results[k];
        const filled = r && r.selfEval === "hit";
        return `<div class="block ${filled ? "filled good" : ""}"></div>`;
      }).join("");
      return `<div class="bar-col">
        <div class="bar-blocks">${blocks}</div>
        <div class="bar-label">${a.hits}/${a.total}</div>
        <div class="bar-sublabel">${fmtDate(a.date)} · ${a.totalHints} hint</div>
      </div>`;
    }).join("")}
  </div>` : `<p class="muted">Ingen innskrivningsprøver ennå.</p>`;

  // ---- Svake tema ----
  const weak = {};
  for (const a of mcq) for (const q of (a.perQ || [])) {
    const k = q.tema;
    weak[k] = weak[k] || { wrong: 0, total: 0, name: TOPICS.find(t=>t.id===k)?.name || k };
    weak[k].total++;
    if (!q.correct) weak[k].wrong++;
  }
  for (const a of calc) {
    const t = CALC_TASKS.find(x => x.id === a.taskId);
    if (!t) continue;
    const k = t.tema;
    weak[k] = weak[k] || { wrong: 0, total: 0, name: TOPICS.find(tt=>tt.id===k)?.name || k };
    for (const p of (a.parts || [])) {
      weak[k].total++;
      if (!p.correct) weak[k].wrong++;
    }
  }
  for (const a of exams) for (const p of (a.perTask || [])) {
    const k = p.tema;
    weak[k] = weak[k] || { wrong: 0, total: 0, name: TOPICS.find(t=>t.id===k)?.name || k };
    weak[k].total++;
    if (p.correct === false) weak[k].wrong++;
  }
  const weakSorted = Object.entries(weak)
    .filter(([_,v]) => v.total >= 2)
    .map(([k,v]) => ({ k, ...v, ratio: v.wrong/v.total }))
    .sort((a,b) => b.ratio - a.ratio).slice(0, 10);

  const weakHtml = weakSorted.length ? weakSorted.map(w => `
    <div style="margin: 8px 0;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <strong>${w.k} – ${escapeHTML(w.name)}</strong>
        <span class="muted">${w.wrong}/${w.total} feil (${(w.ratio*100).toFixed(0)}%)</span>
      </div>
      <div class="weak-bar"><div class="weak-bar-fill" style="width:${w.ratio*100}%"></div></div>
    </div>
  `).join("") : `<p class="muted">For lite data — gjør noen prøver for å få analyse.</p>`;

  const weakest = weakSorted[0];
  const recommendHtml = weakest ? `
    <div class="card-warn card">
      <h3>Anbefalt neste øving</h3>
      <p>Tema <strong>${weakest.k} – ${escapeHTML(weakest.name)}</strong> har høyest feilrate (${(weakest.ratio*100).toFixed(0)}%).</p>
      <p>Foreslått: gjør en runde med flashcards eller MCQ filtrert på dette temaet.</p>
      <div style="margin-top: 10px;">
        <button class="btn primary" onclick="(()=>{FC_STATE.filter='${weakest.k}'; router('flashcards');})()">Flashcards: ${weakest.k}</button>
        <button class="btn primary" onclick="(()=>{MCQ_STATE.filter='${weakest.k}'; router('mcq');})()">MCQ: ${weakest.k}</button>
      </div>
    </div>
  ` : "";

  // ---- Aktivitetshistorikk ----
  const actRows = STATE.activity.slice(-20).reverse().map(a => `
    <tr><td>${fmtDate(a.date)}</td><td>${a.type}</td><td>${escapeHTML(a.label)}</td><td>${a.score != null ? a.score.toFixed(0)+"%" : "–"}</td></tr>
  `).join("");

  $("#page-analytics").innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">Analyse</div>
      <h1 class="page-title">Læringsstatistikk</h1>
      <p class="page-sub">Visualisering av dine resultater over tid, og identifisering av svake tema å øve mer på.</p>
    </div>

    ${recommendHtml}

    <div class="card">
      <h3>MCQ – siste 15 prøver</h3>
      <p class="muted">Antall riktige (grønne blokker) av totalt antall spørsmål.</p>
      ${mcqChart}
    </div>

    <div class="card">
      <h3>Eksamensprøver – siste 12</h3>
      <p class="muted">Total prosent med karaktergrenser markert som horisontale linjer.</p>
      ${examChart}
    </div>

    <div class="card">
      <h3>Innskrivningsprøver – siste 15</h3>
      <p class="muted">Antall fulltreff (grønne) per prøve, med antall hint brukt.</p>
      ${wrChart}
    </div>

    <div class="card">
      <h3>Svake tema</h3>
      <p class="muted">Tema sortert etter feilrate på tvers av MCQ, regneoppgaver og eksamener.</p>
      ${weakHtml}
    </div>

    <div class="card">
      <h3>Aktivitetshistorikk</h3>
      ${actRows ? `<table class="data-table">
        <thead><tr><th>Tid</th><th>Type</th><th>Beskrivelse</th><th>Resultat</th></tr></thead>
        <tbody>${actRows}</tbody>
      </table>` : `<p class="muted">Ingen aktivitet ennå.</p>`}
    </div>
  `;
}

