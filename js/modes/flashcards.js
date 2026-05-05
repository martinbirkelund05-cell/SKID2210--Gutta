/* ============================================================
   FLASHCARDS — viser velger først, så aktiv prøvemodus
   ============================================================ */
const FC_STATE = { active: false, deck: [], idx: 0, flipped: false, filter: "all" };

function renderFlashcards() {
  if (!FC_STATE.active) {
    renderFlashcardsIntro();
  } else {
    renderFlashcardsPlay();
  }
}

function renderFlashcardsIntro() {
  $("#page-flashcards").innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">Flashcards</div>
      <h1 class="page-title">Aktiv repetisjon</h1>
      <p class="page-sub">Velg tema og start. Snu kortene og vurder selv om du kunne svaret. Du finner ${FLASHCARDS.length} kort i banken, hentet fra forelesninger og øvinger.</p>
    </div>
    <div class="card">
      <div class="topic-picker">
        <label>Tema</label>
        ${buildTopicPicker("fc", FC_STATE.filter)}
      </div>
      <div style="margin-top: 14px;">
        <button class="btn primary" onclick="startFlashcards()">Start flashcards</button>
      </div>
    </div>
  `;
}

function startFlashcards() {
  FC_STATE.filter = $("#fc-topic").value;
  let pool = filterByTopic(FLASHCARDS, FC_STATE.filter);
  let usedFallback = false;
  if (pool.length < 5) {
    pool = pickN(pool, Math.max(5, pool.length), FLASHCARDS);
    usedFallback = true;
  } else {
    pool = shuffle(pool);
  }
  FC_STATE.deck = pool;
  FC_STATE.idx = 0;
  FC_STATE.flipped = false;
  FC_STATE.active = true;
  if (usedFallback) toast("Få kort i valgt tema – fyller på fra andre temaer");
  renderFlashcardsPlay();
}

function quitFlashcards() {
  FC_STATE.active = false;
  renderFlashcardsIntro();
}

function renderFlashcardsPlay() {
  if (FC_STATE.idx >= FC_STATE.deck.length) {
    $("#page-flashcards").innerHTML = `
      <div class="card center">
        <h2>Bra jobba 👏</h2>
        <p>Du gikk gjennom ${FC_STATE.deck.length} kort i tema <strong>${FC_STATE.filter === "all" ? "alle temaer" : topicName(FC_STATE.filter)}</strong>.</p>
        <div style="margin-top: 14px;">
          <button class="btn primary" onclick="(()=>{FC_STATE.active=false; startFlashcards();})()">Ny runde</button>
          <button class="btn" onclick="quitFlashcards()">Tilbake til oversikt</button>
        </div>
      </div>
    `;
    return;
  }
  const card = FC_STATE.deck[FC_STATE.idx];
  const progressPct = ((FC_STATE.idx) / FC_STATE.deck.length) * 100;
  $("#page-flashcards").innerHTML = `
    <div class="quiz-bar">
      <div class="quiz-bar-left">
        <div class="quiz-bar-progress">
          <div class="quiz-bar-title">Kort ${FC_STATE.idx + 1} av ${FC_STATE.deck.length}</div>
          <div class="quiz-bar-sub">${topicName(card.undertema)} · ${card.source}</div>
          <div class="quiz-bar-meter"><span style="width:${progressPct}%"></span></div>
        </div>
      </div>
      <button class="btn small" onclick="quitFlashcards()">Avslutt</button>
    </div>

      <div class="flashcard-wrap">
      <div class="flashcard${FC_STATE.flipped ? " flipped" : ""}" onclick="(()=>{FC_STATE.flipped=!FC_STATE.flipped; renderFlashcardsPlay();})()">
        <div class="face front">
          <div class="label">Spørsmål</div>
          <div class="content flashcard-text">${renderProseWithMath(card.front)}</div>
          <div class="src">Klikk for å snu</div>
        </div>
        <div class="face back">
          <div class="label">Svar</div>
          <div class="content flashcard-text">${renderProseWithMath(card.back)}</div>
          <div class="src" style="font-style:italic;">${escapeHTML(card.source || "")}${card.lecture ? " · forelesning " + escapeHTML(card.lecture) : ""}${card.slide && card.slide !== "–" ? " · slide " + escapeHTML(card.slide) : ""}</div>
        </div>
      </div>
    </div>

    <div class="card center">
      <p class="muted" style="margin-bottom: 10px;">Hvor godt kunne du dette?</p>
      <button class="btn bad" onclick="fcResult('noknow')">Kunne ikke</button>
      <button class="btn warn" onclick="fcResult('partial')">Delvis</button>
      <button class="btn good" onclick="fcResult('know')">Kunne</button>
    </div>
  `;
  setTimeout(() => refreshKatex(document.getElementById("page-flashcards")), 0);
}

function fcResult(r) {
  const card = FC_STATE.deck[FC_STATE.idx];
  STATE.flashcardLog.push({ cardId: card.id, result: r, date: Date.now() });
  saveState();
  FC_STATE.idx++;
  FC_STATE.flipped = false;
  if (FC_STATE.idx >= FC_STATE.deck.length) {
    logActivity("flashcards", `Flashcard-runde (${FC_STATE.deck.length} kort)`);
  }
  renderFlashcardsPlay();
}

