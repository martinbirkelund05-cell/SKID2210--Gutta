/* ============================================================
   KILDEBANK — strukturerte formler
   ============================================================ */
const BANK_STATE = { search: "" };

function renderBank() {
  const q = BANK_STATE.search.toLowerCase();
  const filtered = FORMULA_BANK.filter(f =>
    !q || f.name.toLowerCase().includes(q) ||
    f.desc.toLowerCase().includes(q) ||
    f.group.toLowerCase().includes(q) ||
    f.refs.some(r => r.toLowerCase().includes(q))
  );

  // Grupper
  const groups = {};
  for (const f of filtered) {
    groups[f.group] = groups[f.group] || [];
    groups[f.group].push(f);
  }

  const groupHtml = Object.entries(groups).map(([g, items]) => `
    <div class="card">
      <h3>${escapeHTML(g)}</h3>
      <div class="formula-grid">
        ${items.map(f => `
          <div class="formula-card">
            <div class="formula-name">${escapeHTML(f.name)}</div>
            <div class="formula-display">${F(f.tokens, {large:true})}</div>
            <div class="formula-desc">${escapeHTML(f.desc)}</div>
            <div class="formula-refs">
              ${f.refs.map(r => `<span class="tag">${escapeHTML(r)}</span>`).join("")}
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `).join("");

  $("#page-bank").innerHTML = `
    <div class="page-head">
      <div class="page-eyebrow">Kildebank</div>
      <h1 class="page-title">Formler og referanser</h1>
      <p class="page-sub">Strukturert oversikt over de viktigste formlene i SKID2210, hentet fra formelarket og forelesningene.</p>
    </div>

    <div class="card compact">
      <input type="text" id="bank-search" class="search-input" placeholder="Søk i formelbank (navn, beskrivelse, kilde)..." value="${escapeHTML(BANK_STATE.search)}" />
    </div>

    ${filtered.length ? groupHtml : `<div class="card"><p class="muted">Ingen treff.</p></div>`}
  `;
  $("#bank-search").addEventListener("input", e => {
    BANK_STATE.search = e.target.value;
    renderBank();
  });
}
