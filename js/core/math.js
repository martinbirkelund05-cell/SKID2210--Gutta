/* ---- Formel → LaTeX konverter for KaTeX-rendering ---- */
function formulaToLatex(s) {
  if (!s) return "";
  let t = String(s);

  // ------- 1) Beskytt komplekse subscripts (max-, min-, navngitte) FØR enkle bokstavkonverteringer -------
  // η_rotor, η_gir, η_gen, η_el, η_tot, η_Betz, η_tilg
  t = t.replace(/η_(rotor|gir|gen|el|tot|Betz|tilg|total|mek)/g, "\\eta_{\\mathrm{$1}}");
  // ρ_luft, ρ_sjø, ρ_w, ρ_air, ρ_sea
  t = t.replace(/ρ_(luft|sjø|w|air|sea)/g, "\\rho_{\\mathrm{$1}}");
  // P_max, P_el, P_tilg, P_tot, P_kin, P_avg
  t = t.replace(/P_(max|el|tilg|tot|kin|avg|opp)/g, "P_{\\mathrm{$1}}");
  // A_rotor, A_w, A_p
  t = t.replace(/A_(rotor|w|p|s)/g, "A_{\\mathrm{$1}}");
  // F_D, F_M, F_tot, F_tårn, F_rotor, F_påle, F_W, F_C, F_WD, F_FK, F_net, F_fr, F_vr, F_V
  t = t.replace(/F_(D|M|tot|tårn|rotor|påle|W|C|WD|FK|net|fr|vr|V|S)/g, "F_{\\mathrm{$1}}");
  // T_H, T_n, T_p, T_z
  t = t.replace(/T_(H|n|p|z|d)/g, "T_{$1}");
  // V_g
  t = t.replace(/V_(g|s)/g, "V_{$1}");
  // U_w, U_c, U_V, U_C, U_max, U_a
  t = t.replace(/U_(w|c|V|C|a|max|min)/g, "U_{\\mathrm{$1}}");
  // C_D, C_M, C_A, C_d, C_m
  t = t.replace(/C_(D|M|A|d|m|33|11|22|55)/g, "C_{$1}");
  // u_max, u_min, u_a
  t = t.replace(/u_(max|min|a)/g, "u_{\\mathrm{$1}}");
  t = t.replace(/a_(max|min)/g, "a_{\\mathrm{$1}}");
  t = t.replace(/w_(max|min)/g, "w_{\\mathrm{$1}}");
  // p_D, p_s, p_lin
  t = t.replace(/p_(D|s|lin|atm)/g, "p_{\\mathrm{$1}}");
  // ζa eller ζ_a
  t = t.replace(/ζ_a\b/g, "\\zeta_a");
  t = t.replace(/ζa\b/g, "\\zeta_a");
  // Hs eller H_s
  t = t.replace(/H_s\b/g, "H_s");
  t = t.replace(/Hs\b/g, "H_s");
  // a_x, a_z
  t = t.replace(/a_(x|z|y)\b/g, "a_{$1}");
  t = t.replace(/\bax\b/g, "a_x");
  t = t.replace(/\baz\b/g, "a_z");
  // f_M, f_D (per-meter)
  t = t.replace(/f_(D|M)\b/g, "f_{\\mathrm{$1}}");
  // Indekserte tall, eks H₁ → H_1
  t = t.replace(/H₁/g, "H_1").replace(/H₂/g, "H_2").replace(/H₃/g, "H_3");
  t = t.replace(/d₁/g, "d_1").replace(/d₂/g, "d_2").replace(/d₃/g, "d_3");
  t = t.replace(/D₁/g, "D_1").replace(/D₂/g, "D_2");
  t = t.replace(/T₁/g, "T_1").replace(/T₂/g, "T_2");
  t = t.replace(/η₁/g, "\\eta_1").replace(/η₂/g, "\\eta_2");
  t = t.replace(/ω₁/g, "\\omega_1").replace(/ω₂/g, "\\omega_2");
  t = t.replace(/k₁/g, "k_1").replace(/k₂/g, "k_2");
  t = t.replace(/λ₁/g, "\\lambda_1").replace(/λ₂/g, "\\lambda_2");
  // S_d, R_d, S_c, R_c, γ_f, γ_m
  t = t.replace(/S_(d|c)/g, "S_{$1}");
  t = t.replace(/R_(d|c|a)/g, "R_{$1}");
  t = t.replace(/γ_(f|m|d)/g, "\\gamma_{$1}");

  // Generelle uten-understrek-forkortelser (etter spesifikke)
  t = t.replace(/\bCD\b/g, "C_D");
  t = t.replace(/\bCM\b/g, "C_M");
  t = t.replace(/\bCA\b/g, "C_A");
  t = t.replace(/\bCd\b/g, "C_d");
  t = t.replace(/\bCm\b/g, "C_m");
  t = t.replace(/\bFD\b/g, "F_D");
  t = t.replace(/\bFM\b/g, "F_M");

  // ------- 2) Greske bokstaver -------
  t = t.replace(/ω/g, "\\omega");
  t = t.replace(/Ω/g, "\\Omega");
  t = t.replace(/ρ/g, "\\rho");
  t = t.replace(/π/g, "\\pi");
  t = t.replace(/γ/g, "\\gamma");
  t = t.replace(/η/g, "\\eta");
  t = t.replace(/ζ/g, "\\zeta");
  t = t.replace(/λ/g, "\\lambda");
  t = t.replace(/φ/g, "\\varphi");
  t = t.replace(/Δ/g, "\\Delta");
  t = t.replace(/ξ/g, "\\xi");
  t = t.replace(/τ/g, "\\tau");
  t = t.replace(/μ/g, "\\mu");
  t = t.replace(/σ/g, "\\sigma");
  t = t.replace(/θ/g, "\\theta");
  t = t.replace(/α/g, "\\alpha");
  t = t.replace(/β/g, "\\beta");

  // ------- 3) Brøker -------
  // Unicode-brøker
  t = t.replace(/½/g, "\\tfrac{1}{2}");
  t = t.replace(/⅓/g, "\\tfrac{1}{3}");
  t = t.replace(/¼/g, "\\tfrac{1}{4}");
  t = t.replace(/⅔/g, "\\tfrac{2}{3}");
  t = t.replace(/¾/g, "\\tfrac{3}{4}");
  t = t.replace(/⅛/g, "\\tfrac{1}{8}");

  // Brøker på form (a/b) — kun rene tall
  t = t.replace(/\((\d+)\s*\/\s*(\d+)\)/g, "\\tfrac{$1}{$2}");
  // Rene tall a/b utenfor variabel
  t = t.replace(/(?<![A-Za-z_0-9])(\d+)\s*\/\s*(\d+)(?![A-Za-z0-9])/g, "\\tfrac{$1}{$2}");

  // ------- 4) Potenser og indekser med Unicode-tegn -------
  t = t.replace(/⁰/g, "^{0}").replace(/¹/g, "^{1}").replace(/²/g, "^{2}").replace(/³/g, "^{3}").replace(/⁴/g, "^{4}").replace(/⁵/g, "^{5}").replace(/⁶/g, "^{6}").replace(/⁷/g, "^{7}").replace(/⁸/g, "^{8}").replace(/⁹/g, "^{9}");
  t = t.replace(/⁻¹/g, "^{-1}");
  t = t.replace(/⁻²/g, "^{-2}");
  t = t.replace(/⁻³/g, "^{-3}");
  t = t.replace(/⁻⁵/g, "^{-5}");
  t = t.replace(/⁻/g, "-");
  // Subscript-tegn ₁₂₃...
  t = t.replace(/₀/g, "_{0}").replace(/₁/g, "_{1}").replace(/₂/g, "_{2}").replace(/₃/g, "_{3}").replace(/₄/g, "_{4}").replace(/₅/g, "_{5}").replace(/₆/g, "_{6}").replace(/₇/g, "_{7}").replace(/₈/g, "_{8}").replace(/₉/g, "_{9}");

  // ------- 5) Operatorer -------
  t = t.replace(/·/g, " \\cdot ");
  t = t.replace(/⟹/g, "\\quad\\Rightarrow\\quad ");
  t = t.replace(/⇒/g, "\\quad\\Rightarrow\\quad ");
  t = t.replace(/→/g, "\\to ");
  t = t.replace(/≈/g, " \\approx ");
  t = t.replace(/≤/g, " \\le ");
  t = t.replace(/≥/g, " \\ge ");
  t = t.replace(/≠/g, " \\ne ");
  t = t.replace(/×/g, " \\times ");
  t = t.replace(/∞/g, "\\infty ");
  t = t.replace(/∂/g, "\\partial ");
  t = t.replace(/∫/g, "\\int ");
  t = t.replace(/∑/g, "\\sum ");
  t = t.replace(/∇/g, "\\nabla ");

  // ------- 6) Røtter, eksponensialer, tan/cos/sin osv. -------
  t = t.replace(/√\(([^)]+)\)/g, "\\sqrt{$1}");
  t = t.replace(/√([0-9,.]+)/g, "\\sqrt{$1}");
  t = t.replace(/\bexp\(([^)]+)\)/g, "e^{$1}");
  t = t.replace(/\be\^\(([^)]+)\)/g, "e^{$1}");

  // tanh, sinh, cosh — beskytt før generell sin/cos
  t = t.replace(/\btanh\(([^)]+)\)/g, "\\tanh($1)");
  t = t.replace(/\bsinh\(([^)]+)\)/g, "\\sinh($1)");
  t = t.replace(/\bcosh\(([^)]+)\)/g, "\\cosh($1)");
  t = t.replace(/\bsin\(([^)]+)\)/g, "\\sin($1)");
  t = t.replace(/\bcos\(([^)]+)\)/g, "\\cos($1)");
  t = t.replace(/\btan\(([^)]+)\)/g, "\\tan($1)");
  t = t.replace(/\bln\(([^)]+)\)/g, "\\ln($1)");

  // Generell ^(...)
  t = t.replace(/\^\(([^)]+)\)/g, "^{$1}");
  // ^enkeltbokstav/tall (a^2 → a^{2})
  t = t.replace(/\^(-?\d+)\b/g, "^{$1}");

  // |x| absoluttverdier
  t = t.replace(/\|([^|]+)\|/g, "\\left|$1\\right|");

  // ------- 7) Norske komma som desimaltegn — ikke noe spesielt, KaTeX håndterer dette -------

  return t;
}

/* Forenkling: vis tall pent. Brukes for "given"-bokser. */
function fmtNum(v) {
  if (v == null) return "";
  if (typeof v === "number") {
    return String(v).replace(".", ",");
  }
  return String(v);
}

/* Render formel som blokk-display, eller fall tilbake til ren tekst */
function renderFormula(s) {
  if (!s) return "";
  if (typeof katex === "undefined") {
    return `<div class="formula-display"><code>${escapeHtml(s)}</code></div>`;
  }
  try {
    const latex = formulaToLatex(s);
    return `<div class="formula-display">${katex.renderToString(latex, {throwOnError: false, displayMode: true})}</div>`;
  } catch (e) {
    return `<div class="formula-display"><code>${escapeHtml(s)}</code></div>`;
  }
}

/* Render et regne-steg — kan inneholde tall, formler */
function renderStep(s) {
  if (!s) return "";
  if (typeof katex === "undefined") {
    return `<div class="calc-step">${escapeHtml(s)}</div>`;
  }
  try {
    // Steg ofte på form "x = ... = svar enhet". Render som inline math.
    const latex = formulaToLatex(s);
    return `<div class="calc-step">${katex.renderToString(latex, {throwOnError: false, displayMode: false})}</div>`;
  } catch (e) {
    return `<div class="calc-step">${escapeHtml(s)}</div>`;
  }
}

/* ============================================================
   STRUKTURERT OPPGAVERENDERING — parser tekstfelt og bygger
   eksamensaktig layout med kontekst, gitte data, formler og
   pen matematisk visning. Endrer ikke dataene — bare visuell
   presentasjon.
   ============================================================ */

/* Render kort matematisk symbol som inline KaTeX.
   Returnerer HTML hvor matten er pakket i $...$ slik at auto-render
   kan rendre det etter at KaTeX-biblioteket er lastet. */
function renderInlineMath(s) {
  if (!s) return "";
  // Hvis KaTeX er ferdig lastet, render direkte
  if (typeof katex !== "undefined") {
    try {
      return katex.renderToString(formulaToLatex(s), {throwOnError: false, displayMode: false});
    } catch (e) { /* fall gjennom */ }
  }
  // Ellers: pakk i delimiter slik at auto-render kan ta seg av det
  return `$${formulaToLatex(s)}$`;
}

/* Sørg for at KaTeX rendrer all innholds-matte etter en re-render */
function refreshKatex(scope) {
  if (typeof renderMathInElement === "undefined") return;
  const target = scope || document.querySelector(".page.active") || document.body;
  try {
    renderMathInElement(target, {
      delimiters: [
        {left: "$$", right: "$$", display: true},
        {left: "$",  right: "$",  display: false}
      ],
      throwOnError: false
    });
  } catch (e) {}
}

/* Render prosa som kan inneholde innebygde matematiske uttrykk. */
function renderProseWithMath(s) {
  if (!s) return "";
  const re = /([A-Za-zα-ωΑ-ΩρηζλωπφξτμσθαβγΔ][_A-Za-z0-9₀-₉]*\s*=\s*[-]?[\d][\d.,]*(?:\s*·\s*10[⁻]?[⁰-⁹]+)?(?:\s*[A-Za-z·²³⁻⁰-⁹/°]+)?)/g;
  const parts = [];
  let lastIdx = 0;
  let m;
  while ((m = re.exec(s)) !== null) {
    if (m.index > lastIdx) {
      parts.push({ text: s.slice(lastIdx, m.index), math: false });
    }
    parts.push({ text: m[1], math: true });
    lastIdx = m.index + m[1].length;
  }
  if (lastIdx < s.length) {
    parts.push({ text: s.slice(lastIdx), math: false });
  }
  return parts.map(p => p.math ? renderInlineMath(p.text) : escapeHtml(p.text)).join("");
}

/* Konverter tekst med innebygde uttrykk til HTML med pene KaTeX-rendringer
   av matematiske ledd. Lar vanlig tekst stå urørt. */
function renderProse(s) {
  if (!s) return "";
  // Beskytt allerede-rendrede ledd ved å splitte på "= verdi" og symbolledd
  // Strategi: finn "X = tall enhet" mønstre og render som inline math
  // For enklere implementasjon: render variabler, tall og enheter pent ved å
  // matche uttrykk avgrenset av komma, semikolon, punktum, parentes
  let html = escapeHtml(s);

  // Tegnerstattninger for vanlige enheter
  html = html.replace(/m³/g, "m³").replace(/m²/g, "m²"); // bruker Unicode allerede
  // Lag opphøyde tall i kg/m³ etc — finnes allerede via Unicode

  return html;
}
