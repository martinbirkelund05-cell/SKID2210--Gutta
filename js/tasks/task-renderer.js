/* Heuristisk parser som trekker ut "Gitt:"-data fra tekst.
   Returnerer { context, given, find } eller null. */
function parseTaskText(text) {
  if (!text) return null;

  const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);

  // VARIABEL = TALL [ENHET] – men enhet kun rene SI-tegn (m, s, kg/m³, rad/s, m/s², kN, kPa, °, A, V, Ω, %, °C)
  // Dette hindrer at neste variabel (f.eks "Cm") plukkes som "enhet" for forrige.
  const dataPointRe = /([A-Za-zα-ωΑ-ΩρηζλωπφξτμσθαβγΔ][_A-Za-z0-9₀-₉]*)\s*=\s*([-]?\d[\d.,]*(?:\s*·\s*10[⁻]?[⁰-⁹]+)?)\s*((?:k?N(?:\/m)?|m\/s²|m\/s|m³|m²|m|s|kg\/m³|kg|rad\/s|rad\/m|rad|kPa|Pa|MPa|kW|MW|GW|W|GWh|MWh|kWh|TWh|°C|°|%|A\/m²|A|V|Ω|stk|kN|–|-)?)\s*(?=[,;.\)]|\s|$)/gu;

  const givenItems = [];
  const contextParts = [];
  const findParts = [];

  for (const sent of sentences) {
    const findMatch = /^(Beregn|Finn|Bestem|Hva er|Kva er|Vurder|Forklar|Vis at|Skisser|Anslå|Avgjør)/i.test(sent.trim());
    if (findMatch) { findParts.push(sent.trim()); continue; }

    const matches = [...sent.matchAll(dataPointRe)];
    if (matches.length >= 1) {
      let ctx = sent;
      for (const m of matches) {
        const sym = m[1].trim();
        const value = (m[2] || "").trim().replace(/[,.]+$/, "");
        const unit = (m[3] || "").trim();
        givenItems.push({ sym, value, unit });
        ctx = ctx.replace(m[0], "");
      }
      // Rens kontekst
      ctx = ctx
        .replace(/\s+/g, " ")
        .replace(/[,;]\s*[,;.]/g, ".")
        .replace(/\(\s*\)/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      // Fjern halvtomme rester som "og.", "med.", "Bruk.", "Anta.", "ved.", "har og opererer ved.", "med radius."
      ctx = ctx
        .replace(/\b(og|med|der|hvor|samt|ved|har)\s*\./gi, ".")
        .replace(/\s+\./g, ".")
        .replace(/\.\s*\./g, ".")
        .replace(/[,;:]\s*\./g, ".")
        .replace(/^\s*[,.;:]\s*/, "")
        .replace(/\bog\s+(?=[.,;])/gi, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      // Strip leading function-words
      ctx = ctx.replace(/^(Bruk|Anta|med|der|hvor)\s+/i, "").trim();
      // Fjern ledende "Og " / ". Og "
      ctx = ctx.replace(/^Og\s+/i, "").replace(/\.\s+(Og|og)\s+/g, ". ").trim();
      // Hopp over hvis konteksten har færre enn 3 ord eller er bare småord
      const wordCount = ctx.split(/\s+/).filter(w => w.length > 2).length;
      if (wordCount >= 3 && /[a-zA-ZæøåÆØÅ]/.test(ctx)) {
        if (!/[.!?]$/.test(ctx)) ctx += ".";
        ctx = ctx.charAt(0).toUpperCase() + ctx.slice(1);
        contextParts.push(ctx);
      }
    } else {
      contextParts.push(sent.trim());
    }
  }

  if (givenItems.length < 2) return null;

  // Grupper heuristisk
  const constantSymRe = /^(ρ|g|η|γ|C[A-Zdma_]?|π)/i;
  const constants = givenItems.filter(it => constantSymRe.test(it.sym));
  const others = givenItems.filter(it => !constants.includes(it));
  const groups = [];
  if (others.length > 0) groups.push({ group: "Geometri og miljø", items: others });
  if (constants.length > 0) groups.push({ group: "Koeffisienter og konstanter", items: constants });

  return {
    context: contextParts.join(" "),
    given: groups,
    find: findParts.join(" ")
  };
}

/* Parse "VARIABEL = TALL ENHET" til {sym, value, unit, desc} */
function parseDataPoint(s) {
  const m = s.match(/^\s*([^=\s]+)\s*=\s*(.+?)\s*$/);
  if (!m) return null;
  const sym = m[1].trim();
  let rest = m[2].trim();
  // Skill verdi fra enhet — første del er numerisk + evt. potens, resten er enhet
  const valM = rest.match(/^(-?\d[\d.,]*(?:\s*·\s*10[⁻]?[⁰-⁹]+|\s*\^?-?\d+)?)\s*(.*)$/);
  if (!valM) return { sym, value: rest, unit: "" };
  return { sym, value: valM[1].trim(), unit: valM[2].trim() };
}

/* Render et givenItem som HTML — symbol = verdi (enhet) */
function renderGivenItem(it) {
  const symHtml = renderInlineMath(it.sym);
  const valHtml = escapeHtml(it.value || "");
  const unitHtml = it.unit ? renderInlineMath(it.unit) : "";
  const descHtml = it.desc ? `<span class="gi-desc">— ${escapeHtml(it.desc)}</span>` : "";
  return `
    <div class="given-item">
      <span class="gi-sym">${symHtml}</span>
      <span class="gi-eq">=</span>
      <span class="gi-val">${valHtml}${unitHtml ? " " + unitHtml : ""}</span>
      ${descHtml}
    </div>`;
}

/* Render strukturerte gitte data — enten fra eksplisitt 'given'-felt eller parset tekst */
function renderGivenData(given) {
  if (!given || given.length === 0) return "";
  const groupsHtml = given.map(g => {
    const itemsHtml = g.items.map(renderGivenItem).join("");
    return `
      <div class="given-group">
        ${g.group ? `<div class="given-group-title">${escapeHtml(g.group)}</div>` : ""}
        <div class="given-list">${itemsHtml}</div>
      </div>`;
  }).join("");
  return `
    <div class="task-section">
      <span class="task-section-label">Gitt</span>
      <div class="given-data">${groupsHtml}</div>
    </div>`;
}

/* Hovedrenderer for et oppgavehode med strukturert layout.
   Bruker felter task.context, task.given, task.find hvis de finnes,
   ellers parser task.text. */
function renderTaskHeader(task, opts) {
  opts = opts || {};
  const number = opts.number || "";
  const meta = opts.meta || "";
  const sourceLine = opts.source !== false
    ? `<div style="margin-top:18px; font-size:0.85em; color:var(--muted); font-style:italic;">Kilde: ${escapeHtml(task.source || "")}${task.lecture ? " · forelesning " + escapeHtml(task.lecture) : ""}${task.slide && task.slide !== "–" ? " · slide " + escapeHtml(task.slide) : ""}</div>`
    : "";

  // Strukturerte felter har høyest prioritet
  let context = task.context || "";
  let given = task.given || null;
  let find = task.find || "";

  // Fallback: parse task.text
  if (!context && !given) {
    const parsed = parseTaskText(task.text || "");
    if (parsed) {
      context = parsed.context || "";
      given = parsed.given;
      if (!find) find = parsed.find || "";
    } else if (task.text) {
      // Helt ustrukturert — vis tekst som kontekst i pen prosa
      context = task.text;
    }
  }

  const headerHtml = `
    <div class="task-header">
      ${number ? `<span class="task-number">${escapeHtml(number)}</span>` : ""}
      <span class="task-title">${escapeHtml(task.title || "")}</span>
      ${meta ? `<span class="task-meta">${meta}</span>` : ""}
    </div>`;

  const ctxHtml = context ? `
    <div class="task-section">
      <span class="task-section-label">Situasjon</span>
      <div class="task-context">${escapeHtml(context)}</div>
    </div>` : "";

  const givenHtml = renderGivenData(given);

  const findHtml = find ? `
    <div class="task-section">
      <span class="task-section-label">Det skal beregnes</span>
      <div class="find-statement">${escapeHtml(find)}</div>
    </div>` : "";

  return headerHtml + ctxHtml + givenHtml + findHtml + sourceLine;
}
