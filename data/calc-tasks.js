/* ============================================================
   REGNEOPPGAVER — minst 10, med deloppgaver
   ============================================================ */
const CALC_TASKS = [
  { id:"calc-001", tema:"B", undertema:"B2",
    title:"Bølgeparametre, dypt vann",
    text:"En designbølge har amplitude ζa = 5 m og periode T = 12 s. Anta uendelig dybde og ρ = 1025 kg/m³.",
    parts: [
      { id:"a", q:"Beregn vinkelfrekvensen ω.", answer:0.524, unit:"rad/s", tol:0.01,
        formula:"ω = 2π/T", steps:["ω = 2π / 12 = 0,5236 rad/s"] },
      { id:"b", q:"Beregn bølgetallet k.", answer:0.0280, unit:"rad/m", tol:0.002,
        formula:"ω² = k·g  ⟹  k = ω²/g", steps:["k = 0,5236² / 9,81 = 0,02795 rad/m"] },
      { id:"c", q:"Beregn bølgelengden λ.", answer:225, unit:"m", tol:5,
        formula:"λ = 2π/k", steps:["λ = 2π / 0,02795 ≈ 224,8 m"] }
    ],
    source:"Eksamen 2024 oppg.3a", lecture:"B2", slide:"42–48" },

  { id:"calc-002", tema:"B", undertema:"B5",
    title:"Morisons ligning på rørtunnel",
    text:"En neddykket rørtunnel: D = 15 m, L = 800 m, sentrum z = -35 m. Bølgen gir u = 0,98 m/s og ax = 0,52 m/s² på senterhøyden. Bruk Cd = 1,2, Cm = 2,0, ρ = 1025 kg/m³.",
    parts: [
      { id:"a", q:"Beregn maksimal drag-kraft FD i kN på hele tunnelen.", answer:7088, unit:"kN", tol:200,
        formula:"FD = ½·ρ·Cd·D·L·u·|u|",
        steps:["A_proj = D·L = 15·800 = 12 000 m²", "FD = 0,5·1025·1,2·12000·0,98² = 7,09·10⁶ N ≈ 7088 kN"] },
      { id:"b", q:"Beregn maksimal masse-kraft FM i kN på hele tunnelen.", answer:150702, unit:"kN", tol:3000,
        formula:"FM = ρ·Cm·V·ax",
        steps:["V = (π·D²/4)·L = 176,7·800 = 141 372 m³", "FM = 1025·2·141372·0,52 ≈ 1,507·10⁸ N ≈ 150 700 kN"] },
      { id:"c", q:"Hvilket ledd dominerer? Skriv 1 (drag) eller 2 (masse).", answer:2, unit:"", tol:0.1,
        formula:"Sammenlign |FM| vs |FD|",
        steps:["FM/FD ≈ 21. Masseleddet dominerer — typisk for store diametre i bølger."] }
    ],
    source:"Eksamen 2024 oppg.3", lecture:"B5", slide:"24–32" },

  { id:"calc-003", tema:"A", undertema:"A1",
    title:"Vindturbin – effekt og virkningsgrader",
    text:"En vindturbin har D = 70 m og opererer ved U = 12 m/s. Bruk η_rotor = 0,75, η_gir = 0,96, η_gen = 0,93. Anta ρ_luft = 1,29 kg/m³ (verdien som er brukt i kursets løsninger).",
    parts: [
      { id:"a", q:"Beregn rotorens sveipte areal A.", answer:3848, unit:"m²", tol:30,
        formula:"A = π·D²/4", steps:["A = π·70² / 4 = 3848 m²"] },
      { id:"b", q:"Beregn maksimal aerodynamisk effekt P_max (Betz-grense).", answer:2542, unit:"kW", tol:60,
        formula:"P_max = (16/27)·½·ρ·A·U³",
        steps:["P_kin = ½·1,29·3848·12³ = 4,29·10⁶ W", "P_max = (16/27)·4,29·10⁶ ≈ 2542 kW"] },
      { id:"c", q:"Beregn levert elektrisk effekt P_el.", answer:1702, unit:"kW", tol:60,
        formula:"P_el = η_rotor·η_gir·η_gen·P_max",
        steps:["η_tot = 0,75·0,96·0,93 = 0,669", "P_el = 0,669·2542 ≈ 1702 kW"] }
    ],
    source:"Øving 1 oppg.1a / Eksamen 2025 oppg.1a", lecture:"A1", slide:"15–18" },

  { id:"calc-004", tema:"B", undertema:"B5",
    title:"Bølgedrift på sirkulær sylinder",
    text:"En vertikal sirkulær sylinder med radius R = 8 m står i regulære bølger med amplitude ζa = 3 m. Bruk ρ = 1025 kg/m³ og formelen for bølgedrift på en sirkulær sylinder fra formelarket.",
    parts: [
      { id:"a", q:"Beregn drift-krafta F i kN.", answer:483, unit:"kN", tol:15,
        formula:"F = (2/3)·ρ·g·ζa²·R",
        steps:["F = (2/3)·1025·9,81·3²·8", "F = 0,667·1025·9,81·9·8 = 482 826 N ≈ 483 kN"] }
    ],
    source:"Formelark s.3 (bølgedrift på sirkulær sylinder)", lecture:"B5", slide:"–" },

  { id:"calc-005", tema:"B", undertema:"B3",
    title:"Bølgedrift i irregulær sjø — Maruos formel",
    text:"Et skip med lengde L = 200 m ligger i en irregulær sjø med signifikant bølgehøyde Hs = 6 m. Bruk ρ = 1025 kg/m³ og Maruos formel for irregulær bølge fra formelarket.",
    parts: [
      { id:"a", q:"Beregn drift-krafta F i kN.", answer:4525, unit:"kN", tol:100,
        formula:"F = (1/16)·ρ·g·Hs²·L",
        steps:["F = (1/16)·1025·9,81·6²·200", "F = 0,0625·1025·9,81·36·200 = 4 524 863 N ≈ 4 525 kN"] }
    ],
    source:"Formelark s.3 (Maruos formel, irregulær bølge)", lecture:"B6", slide:"–" },

  { id:"calc-006", tema:"B", undertema:"B5",
    title:"Bølgedrift på skip — regulær bølge",
    text:"Et skip med lengde L = 150 m ligger i en regulær bølge med amplitude ζa = 2,5 m. Bruk ρ = 1025 kg/m³ og Maruos formel for regulær bølge fra formelarket.",
    parts: [
      { id:"a", q:"Beregn drift-krafta F i kN.", answer:4713, unit:"kN", tol:100,
        formula:"F = ½·ρ·g·ζa²·L",
        steps:["F = 0,5·1025·9,81·2,5²·150", "F = 0,5·1025·9,81·6,25·150 = 4 713 398 N ≈ 4 713 kN"] }
    ],
    source:"Formelark s.3 (Maruo's formel, regulær bølge)", lecture:"B6", slide:"–" },

  { id:"calc-007", tema:"A", undertema:"A1",
    title:"Vindturbin – design rotordiameter",
    text:"En offshore vindturbin skal levere mekanisk akseleffekt P = 7 MW ved U = 12 m/s. Anta P = (16/27)·½·ρ·A·U³ med ρ = 1025 kg/m³ (NB: dette er verdien brukt i den offisielle løsningen for Eksamen 2023 oppg.1e — fysisk burde det vært luft 1,29 kg/m³, men her bruker vi samme tall som offisiell fasit).",
    parts: [
      { id:"a", q:"Beregn nødvendig sveipt areal A.", answer:13273, unit:"m²", tol:300,
        formula:"A = (27/16)·2·P / (ρ·U³)",
        steps:["A = (27/16)·2·7·10⁶ / (1,025·12³) ≈ 13 273 m²"] },
      { id:"b", q:"Beregn nødvendig rotordiameter D.", answer:130, unit:"m", tol:4,
        formula:"D = √(4·A/π)",
        steps:["D = √(4·13273 / π) ≈ 130 m"] }
    ],
    source:"Eksamen 2023 oppg.1e", lecture:"A1", slide:"16–18" },

  { id:"calc-008", tema:"C", undertema:"C5",
    title:"Strømkrefter på havmerd – vektrør",
    text:"En åpen havmerd har et nedre vektrør med diameter på sirkelringen D = 50 m og rør-diameter d = 0,7 m. Strømhastighet U = 0,5 m/s, Cd = 1,2, ρ = 1025 kg/m³.",
    parts: [
      { id:"a", q:"Beregn projisert areal av vektrøret (rektangulært snitt mot strømmen).", answer:35, unit:"m²", tol:1,
        formula:"A_proj = d · D", steps:["A_proj = 0,7 · 50 = 35 m²"] },
      { id:"b", q:"Beregn dragkraft FD på vektrøret.", answer:5.38, unit:"kN", tol:0.15,
        formula:"FD = ½·ρ·Cd·A·U²",
        steps:["FD = 0,5·1025·1,2·35·0,5² = 5381 N ≈ 5,38 kN"] }
    ],
    source:"Eksamen 2025 oppg.4a", lecture:"C5", slide:"12–18" },

  { id:"calc-009", tema:"B", undertema:"B5",
    title:"Bølgekinematikk – horisontal hastighet på dybde",
    text:"Designbølge: ζa = 5 m, T = 12 s, k = 0,028 rad/m. Beregn for z = -35 m.",
    parts: [
      { id:"a", q:"Beregn vinkelfrekvensen ω.", answer:0.524, unit:"rad/s", tol:0.01,
        formula:"ω = 2π/T", steps:["ω = 2π/12 = 0,524 rad/s"] },
      { id:"b", q:"Beregn maksimal horisontal partikkelhastighet u_max.", answer:0.98, unit:"m/s", tol:0.05,
        formula:"u_max = ζa · ω · e^(k·z)",
        steps:["e^(0,028·(-35)) = e^(-0,98) = 0,375", "u_max = 5·0,524·0,375 = 0,983 m/s"] }
    ],
    source:"Eksamen 2024 oppg.3b", lecture:"B5", slide:"24" },

  { id:"calc-010", tema:"A", undertema:"A1",
    title:"Antall turbiner for å dekke energibehov",
    text:"Et havvindprosjekt skal levere E_årlig = 2,5 TWh per år. Hver turbin har midlere levert effekt P_avg = 3,4 MW (gitt vindstatistikk og brukstid). Antall driftstimer i året = 8760.",
    parts: [
      { id:"a", q:"Beregn årsproduksjon per turbin (GWh).", answer:29.78, unit:"GWh", tol:0.5,
        formula:"E = P_avg · 8760",
        steps:["E = 3,4 MW · 8760 t = 29 784 MWh ≈ 29,78 GWh"] },
      { id:"b", q:"Beregn antall turbiner som trengs (rund opp).", answer:84, unit:"stk", tol:3,
        formula:"N = E_årlig / E_per_turbin",
        steps:["N = 2 500 GWh / 29,78 GWh ≈ 83,9 → 84 turbiner"] }
    ],
    source:"Konstruert oppgave / inspirert av Øving 1 oppg.1d", lecture:"A1", slide:"22–28" },

  // ---- Nye oppgåver henta direkte frå øvinger (alle formler frå formelarket) ----

  { id:"calc-011", tema:"A", undertema:"A1",
    title:"Vindturbin – tilgjengelig vindressurs og total virkningsgrad",
    text:"Samme vindturbin som i calc-003: D = 70 m, U = 12 m/s, ρ_luft = 1,29 kg/m³, η_rotor = 0,75, η_gir = 0,96, η_gen = 0,93. Fra formelarket: P = ½·η·ρ·A·U³ med Betz η_Betz = 16/27.",
    parts: [
      { id:"a", q:"Beregn tilgjengelig vindeffekt P_tilgjengelig (uten virkningsgrader).", answer:4289, unit:"kW", tol:80,
        formula:"P_tilg = ½·ρ·A·U³",
        steps:["A = π·70²/4 = 3848 m²", "P_tilg = 0,5·1,29·3848·12³ = 4 289 kW"] },
      { id:"b", q:"Beregn total virkningsgrad η_tot inkludert Betz.", answer:0.40, unit:"–", tol:0.01,
        formula:"η_tot = (16/27)·η_rotor·η_gir·η_gen",
        steps:["η_tot = (16/27)·0,75·0,96·0,93 = 0,40 (40 %)"] }
    ],
    source:"Øving 1 oppg.1a / Eksamen 2025", lecture:"A1", slide:"15–18" },

  { id:"calc-012", tema:"A", undertema:"A1",
    title:"Tidevannsturbin – maksimal effekt",
    text:"Tidevannsrotor i Kvalsundet: D = 20 m, maksimal strømhastighet U_max = 2,5 m/s, ρ_sjø = 1025 kg/m³. Formelarket: P = ½·η·ρ·A·U³.",
    parts: [
      { id:"a", q:"Beregn maksimal kinetisk effekt P_max (uten virkningsgrader).", answer:2516, unit:"kW", tol:50,
        formula:"P_max = ½·ρ·A·U³",
        steps:["A = π·20²/4 = 314 m²", "P_max = 0,5·1025·314·2,5³ = 2 515 kW"] },
      { id:"b", q:"Med rotorvirkningsgrad η_rotor = 0,3 (inkludert Betz), gjennomsnittseffekt = halvparten av maks. Beregn levert middeleffekt P_el.", answer:377, unit:"kW", tol:10,
        formula:"P_el = 0,5·η_rotor·P_max",
        steps:["P_el = 0,5·0,3·2515 ≈ 377 kW"] }
    ],
    source:"Forelesning A1 slide 27 (Kvalsundet eksempel)", lecture:"A1", slide:"27" },

  { id:"calc-013", tema:"B", undertema:"B2",
    title:"Bølgeparametre – endelig havdyp",
    text:"En regulær bølge har T = 8 s i havdyp h = 30 m. Fra formelarket: ω² = k·g·tanh(k·h). Bruk g = 9,81 m/s². Hint: må løses iterativt — k vil ligge mellom dypt-vann-verdien (k = ω²/g) og litt høyere fordi tanh(k·h) < 1.",
    parts: [
      { id:"a", q:"Beregn vinkelfrekvensen ω.", answer:0.785, unit:"rad/s", tol:0.01,
        formula:"ω = 2π/T",
        steps:["ω = 2π/8 = 0,785 rad/s"] },
      { id:"b", q:"Beregn bølgelengden λ ved iterasjon på dispersjonsrelasjonen ω² = k·g·tanh(k·h). Numerisk: k ≈ 0,0654 rad/m.", answer:96.0, unit:"m", tol:2,
        formula:"λ = 2π/k",
        steps:["Iterer ω² = k·g·tanh(k·h):", "k = 0,0654 → 0,0654·9,81·tanh(0,0654·30) = 0,0654·9,81·tanh(1,96) = 0,0654·9,81·0,961 = 0,617 ≈ ω² = 0,616 ✓", "λ = 2π/0,0654 ≈ 96,0 m"] }
    ],
    source:"Konstruert oppgave / Formelark s.2 (dispersjon endelig dyp)", lecture:"B2", slide:"42–48" },

  { id:"calc-014", tema:"B", undertema:"B5",
    title:"To horisontale rør – bølgelast på ulike dybder",
    text:"To horisontale rør (D = 1,5 m, L = 10 m) er plassert på z = -10 m og z = -20 m. Innkommende bølge: ζa = 1,5 m, T = 5 s, dypt vann. Bruk Cd = 1,0 (verdien brukt i HavromXX-løsningen), Cm = 2,0, ρ = 1025 kg/m³.",
    parts: [
      { id:"a", q:"Beregn bølgetallet k.", answer:0.161, unit:"rad/m", tol:0.005,
        formula:"k = ω²/g,  ω = 2π/T",
        steps:["ω = 2π/5 = 1,257 rad/s", "k = 1,257²/9,81 = 0,161 rad/m"] },
      { id:"b", q:"Beregn maksimal horisontalhastighet u på det øvre røret (z = -10 m).", answer:0.376, unit:"m/s", tol:0.02,
        formula:"u_max = ζa·ω·e^(k·z)",
        steps:["u_max = 1,5·1,257·e^(-0,161·10) = 1,886·0,2 = 0,377 m/s"] },
      { id:"c", q:"Beregn maksimal massekraft F_M på det øvre røret (totalt for L = 10 m). Akselerasjonen er ax = ζa·ω²·e^(k·z) = 0,474 m/s².", answer:16.97, unit:"kN", tol:0.5,
        formula:"F_M = ρ·Cm·V·ax,  V = (πD²/4)·L",
        steps:["V = (π·1,5²/4)·10 = 17,67 m³", "F_M = 1025·2,0·17,67·0,474 = 17 173 N ≈ 16,97 kN (HavromXX-løsning bruker ax=0,468 og får 16,97)"] }
    ],
    source:"Eksempeleksamen oppg.8 (HavromXX)", lecture:"B5", slide:"24–32" },

  { id:"calc-015", tema:"B", undertema:"B5",
    title:"Oppdrettsanlegg – bølgelast på vertikalt rør",
    text:"Oppdrettsanlegg med 4 vertikale rør (D = 0,8 m). Innkommende bølge: H = 3 m, T = 8 s, dypt vann. Bruk Cd = 1,2, Cm = 2,0 (= 1+Ca), ρ = 1025 kg/m³.",
    parts: [
      { id:"a", q:"Beregn bølgefrekvensen ω.", answer:0.785, unit:"rad/s", tol:0.01,
        formula:"ω = 2π/T",
        steps:["ω = 2π/8 = 0,785 rad/s"] },
      { id:"b", q:"Beregn bølgetallet k.", answer:0.063, unit:"rad/m", tol:0.003,
        formula:"k = ω²/g (uendelig dyp)",
        steps:["k = 0,785²/9,81 = 0,0628 rad/m"] },
      { id:"c", q:"Beregn bølgelengden λ.", answer:100, unit:"m", tol:3,
        formula:"λ = 2π/k",
        steps:["λ = 2π/0,063 = 100 m"] },
      { id:"d", q:"Beregn maksimal horisontalhastighet på det øverste røret (z = -2 m). H = 3 m gir ζa = 1,5 m.", answer:1.04, unit:"m/s", tol:0.04,
        formula:"u_max = ζa·ω·e^(k·z)",
        steps:["ζa = H/2 = 1,5 m", "u_max = 1,5·0,785·e^(-0,063·2) = 1,178·0,883 = 1,04 m/s"] }
    ],
    source:"Eksempeleksamen oppg.9 (HavromXX)", lecture:"B5", slide:"24–32" },

  { id:"calc-016", tema:"B", undertema:"B5",
    title:"Vertikal påle – integrert drag- og massekraft",
    text:"Vertikal sirkulær påle: D = 0,6 m, høyde 40 m fra z = -40 m til z = 0. Bølge: H = 8 m (ζa = 4 m), T = 14 s. Bruk Cd = 1,2, Cm = 2,0, ρ = 1025 kg/m³. Integrasjonen av e^(2k·z) fra -40 til 0 gir 19,63; integrasjonen av e^(k·z) gir 27,28.",
    parts: [
      { id:"a", q:"Beregn ω.", answer:0.449, unit:"rad/s", tol:0.01,
        formula:"ω = 2π/T",
        steps:["ω = 2π/14 = 0,449 rad/s"] },
      { id:"b", q:"Beregn maksimal totalt integrert dragkraft FD på pålen.", answer:23.36, unit:"kN", tol:0.8,
        formula:"FD = ½·ρ·Cd·D·ζa²·ω²·∫e^(2kz)dz",
        steps:["FD = 0,5·1,025·1,2·0,6·4²·0,449²·19,63 = 23,36 kN"] },
      { id:"c", q:"Beregn maksimal totalt integrert massekraft FM på pålen.", answer:12.74, unit:"kN", tol:0.5,
        formula:"FM = ρ·Cm·(πD²/4)·ζa·ω²·∫e^(kz)dz",
        steps:["FM = 1,025·2,0·(π·0,6²/4)·4·0,449²·27,28 = 12,74 kN"] }
    ],
    source:"Øving 4 oppg.3 / Eksempeleksamen oppg.11", lecture:"B5", slide:"24–32" },

  { id:"calc-017", tema:"B", undertema:"B5",
    title:"SPAR-bøye – bølgedrift",
    text:"Klassisk SPAR-bøye (sirkulær på vannlinjen) med radius R = 10 m. Bølger: ζa = 3 m, β = 0 (langs x-aksen). ρ = 1025 kg/m³. Bruk Maruo-utledet formel: F = (2/3)·ρ·g·ζa²·R (formelark s.3).",
    parts: [
      { id:"a", q:"Beregn midlere bølgedriftskraft F i x-retning.", answer:603, unit:"kN", tol:15,
        formula:"F = (2/3)·ρ·g·ζa²·R",
        steps:["F = (2/3)·1025·9,81·3²·10 = 603 405 N ≈ 603 kN"] }
    ],
    source:"Øving 6 oppg.3 / Formelark s.3", lecture:"B5/B6", slide:"–" },

  { id:"calc-018", tema:"C", undertema:"C2",
    title:"Lekter – tilbakeførende kraft fra linekarakteristikk",
    text:"Lekter forankra med 4 like ankerliner: 2 i +x og 2 i -x retning. Linjekarakteristikken (horisontal strekk T_H mot offset Δx) gir T_H(0) = 1000 kN, T_H(2) = 1400 kN, T_H(-2) = 700 kN, T_H(4) = 2000 kN, T_H(-4) = 500 kN.",
    parts: [
      { id:"a", q:"Beregn netto tilbakeførende kraft R ved offset = 2 m i +x. Hint: linene i +x retning får offset +2, linene i -x retning får offset -2.", answer:1400, unit:"kN", tol:50,
        formula:"R = 2·T_H(+2) − 2·T_H(-2)",
        steps:["R = 2·(1400 − 700) = 1400 kN"] },
      { id:"b", q:"Beregn netto tilbakeførende kraft R ved offset = 4 m.", answer:3000, unit:"kN", tol:100,
        formula:"R = 2·T_H(+4) − 2·T_H(-4)",
        steps:["R = 2·(2000 − 500) = 3000 kN"] }
    ],
    source:"Øving 7 oppg.1a", lecture:"C2", slide:"21" },

  // ---- Nye oppgåver for breiare dekking (A, C-tema) ----

  { id:"calc-019", tema:"A", undertema:"A1",
    title:"Tidevannsturbin – designdiameter for gitt effekt",
    text:"En tidevannsturbin skal levere akseleffekt P = 10 kW ved strømhastighet U = 1,0 m/s. Bruk formelarket: P = ½·η·ρ·A·U³ med ρ = 1025 kg/m³ og virkningsgrad η_total = 0,5 (inkludert Betz' grense).",
    parts: [
      { id:"a", q:"Beregn nødvendig sveipt areal A.", answer:39.0, unit:"m²", tol:1,
        formula:"A = 2·P / (η·ρ·U³)",
        steps:["A = 2·10 000 / (0,5·1025·1³) = 39,0 m²"] },
      { id:"b", q:"Beregn rotordiameter D.", answer:7.05, unit:"m", tol:0.2,
        formula:"D = √(4A/π)",
        steps:["D = √(4·39,0/π) = √49,7 = 7,05 m"] }
    ],
    source:"Eksamen 2024 oppg.1b", lecture:"A1", slide:"15–18" },

  { id:"calc-020", tema:"B", undertema:"B4",
    title:"Coriolis-akselerasjon",
    text:"Bruk formelen for Coriolis-akselerasjon: ac = 2·Ω·U·sin(φ), der Ω = 7,292·10⁻⁵ rad/s. Vindhastighet er U = 20 m/s.",
    parts: [
      { id:"a", q:"Beregn ac for Longyearbyen (78° N) i m/s².", answer:2.85e-3, unit:"m/s²", tol:0.1e-3,
        formula:"ac = 2·Ω·U·sin(φ)",
        steps:["sin(78°) = 0,978", "ac = 2·7,292·10⁻⁵·20·0,978 = 2,85·10⁻³ m/s²"] },
      { id:"b", q:"Beregn ac for San Diego (32° N) i m/s².", answer:1.55e-3, unit:"m/s²", tol:0.1e-3,
        formula:"ac = 2·Ω·U·sin(φ)",
        steps:["sin(32°) = 0,530", "ac = 2·7,292·10⁻⁵·20·0,530 = 1,55·10⁻³ m/s²"] },
      { id:"c", q:"Beregn ac for Quito ekvator (0° N) i m/s².", answer:0.0, unit:"m/s²", tol:0.05e-3,
        formula:"ac = 2·Ω·U·sin(φ)",
        steps:["sin(0°) = 0", "ac = 0 m/s² — ingen Coriolis-effekt på ekvator"] }
    ],
    source:"Øving 3 oppg.1b / Forelesning B4 slide 140", lecture:"B4", slide:"140" },

  { id:"calc-021", tema:"B", undertema:"B5",
    title:"Maksimal partikkelhastighet i overflate",
    text:"To regulære bølger på dypt vann er gitt: Bølge 1 har H₁ = 2 m, T₁ = 8 s. Bølge 2 har H₂ = 4 m, T₂ = 16 s. Fra formelarket: u_max = ζa·ω på overflate (z = 0).",
    parts: [
      { id:"a", q:"Maksimal horisontal partikkelhastighet for bølge 1 i overflaten.", answer:0.785, unit:"m/s", tol:0.02,
        formula:"u_max = ζa·ω = (H/2)·(2π/T)",
        steps:["ω₁ = 2π/8 = 0,785 rad/s", "u₁ = (2/2)·0,785 = 0,785 m/s"] },
      { id:"b", q:"Maksimal horisontal partikkelhastighet for bølge 2 i overflaten.", answer:0.785, unit:"m/s", tol:0.02,
        formula:"u_max = ζa·ω",
        steps:["ω₂ = 2π/16 = 0,393 rad/s", "u₂ = (4/2)·0,393 = 0,785 m/s — samme som bølge 1!"] },
      { id:"c", q:"Maksimal akselerasjon for bølge 1 i overflaten.", answer:0.617, unit:"m/s²", tol:0.03,
        formula:"a_max = ζa·ω²",
        steps:["a₁ = 1·0,785² = 0,617 m/s²"] }
    ],
    source:"Øving 4 oppg.2b", lecture:"B5", slide:"24" },

  { id:"calc-022", tema:"B", undertema:"B5",
    title:"Dynamisk trykk i bølge",
    text:"En regulær bølge har ζa = 2 m, T = 10 s. Bruk formelarket sitt uttrykk for dynamisk trykk på dypt vann: p_D = ρ·g·ζa·e^(k·z) (amplitude). ρ = 1025 kg/m³, g = 9,81 m/s².",
    parts: [
      { id:"a", q:"Beregn bølgetallet k.", answer:0.0403, unit:"rad/m", tol:0.002,
        formula:"k = ω²/g, ω = 2π/T",
        steps:["ω = 2π/10 = 0,628 rad/s", "k = 0,628²/9,81 = 0,0403 rad/m"] },
      { id:"b", q:"Beregn dynamisk trykkamplitude p_D på z = -10 m.", answer:13.4, unit:"kPa", tol:0.4,
        formula:"p_D = ρ·g·ζa·e^(k·z)",
        steps:["p_D = 1025·9,81·2·e^(-0,0403·10) = 20 110·0,668 = 13 433 Pa ≈ 13,4 kPa"] }
    ],
    source:"Formelark s.2", lecture:"B5", slide:"24" },

  { id:"calc-023", tema:"C", undertema:"C2",
    title:"Vindkraft på offshore vindturbintårn",
    text:"En offshore vindturbin har tårn med H = 90 m og D = 4 m, og rotorblader med D_rot = 100 m og bladarealforhold A_p/A_0 = 0,05. Dimensjonerende vindhastigheit U_w = 40 m/s, ρ_luft = 1,17 kg/m³, Cd_tårn = 1,2, Cd_blader = 1,0.",
    parts: [
      { id:"a", q:"Beregn vindkraft på tårnet F_tårn i kN.", answer:404, unit:"kN", tol:15,
        formula:"F_D = ½·ρ·Cd·A_p·U², A_p = D·H",
        steps:["A_p = 4·90 = 360 m²", "F_tårn = 0,5·1,17·1,2·360·40² = 404 000 N = 404 kN"] },
      { id:"b", q:"Beregn vindkraft på rotorblada F_rotor i kN.", answer:368, unit:"kN", tol:15,
        formula:"F_D = ½·ρ·Cd·A_p·U², A_p = 0,05·π·D_rot²/4",
        steps:["A_p = 0,05·π·100²/4 = 393 m²", "F_rotor = 0,5·1,17·1,0·393·40² = 368 kN"] },
      { id:"c", q:"Total vindkraft i kN.", answer:772, unit:"kN", tol:30,
        formula:"F_tot = F_tårn + F_rotor",
        steps:["F_tot = 404 + 368 = 772 kN"] }
    ],
    source:"Eksamen 2023 oppg.4a", lecture:"C2", slide:"60" },

  { id:"calc-024", tema:"C", undertema:"C2",
    title:"Strømkraft på sirkulær påle",
    text:"En vindturbin er montert på en påle med diameter D = 7 m og høyde 40 m (havdyp). Dimensjonerende straumprofil U_c = 2 m/s er konstant over dypet. Cd = 1,2, ρ_sjø = 1025 kg/m³.",
    parts: [
      { id:"a", q:"Beregn strømkraft på pålen i kN.", answer:689, unit:"kN", tol:25,
        formula:"F_D = ½·ρ·Cd·D·H·U²",
        steps:["A_p = D·H = 7·40 = 280 m²", "F_påle = 0,5·1025·1,2·280·2² = 688 800 N = 689 kN"] }
    ],
    source:"Eksamen 2023 oppg.4b", lecture:"C2", slide:"60" },

  { id:"calc-025", tema:"C", undertema:"C2",
    title:"Total miljøkraft på flytande vindturbin",
    text:"En flytande vindturbin (SPAR-type, Øving 7 oppg.2a). Tårn over vann: H₁ = 80 m, d₁ = 3 m. Neddykka del: H₂ = 90 m, d₂ = 7 m. Vind U_V = 30 m/s, strøm U_C = 1,5 m/s, bølger ζa = 2,5 m. ρ_luft = 1,17 kg/m³, ρ_sjø = 1025 kg/m³, Cd = 1,0 alle steder. Maruo for sirkulær sylinder: F = (2/3)·ρ·g·ζa²·R med R = d/2 = 1,5 m.",
    parts: [
      { id:"a", q:"Beregn vindkraft på tårnet F_V i kN.", answer:126.4, unit:"kN", tol:5,
        formula:"F_V = ½·ρ_luft·Cd·H₁·d₁·U_V²",
        steps:["F_V = 0,5·1,17·1,0·80·3·30² = 126 360 N = 126,4 kN"] },
      { id:"b", q:"Beregn strømkraft på neddykket del F_C i kN.", answer:726.5, unit:"kN", tol:25,
        formula:"F_C = ½·ρ_sjø·Cd·H₂·d₂·U_C²",
        steps:["F_C = 0,5·1025·1,0·90·7·1,5² = 726 469 N = 726,5 kN"] },
      { id:"c", q:"Beregn midlere bølgedriftkraft F_WD i kN. Bruk Maruo for sirkulær sylinder med R = 1,5 m.", answer:62.8, unit:"kN", tol:3,
        formula:"F_WD = (2/3)·ρ·g·ζa²·R",
        steps:["F_WD = (2/3)·1025·9,81·2,5²·1,5 = 62 845 N ≈ 62,8 kN"] },
      { id:"d", q:"Total miljøkraft i kN.", answer:915.7, unit:"kN", tol:30,
        formula:"F_D = F_V + F_C + F_WD",
        steps:["F_D = 126,4 + 726,5 + 62,8 = 915,7 kN"] }
    ],
    source:"Øving 7 oppg.2a", lecture:"C2", slide:"60" },

  { id:"calc-026", tema:"C", undertema:"C2",
    title:"Eigenperiode for forankra lekter",
    text:"Lekter med M = 100 000 t (inklusive tilleggsmasse). Forankringa har stivhet K = 750 kN/m basert på linjekarakteristikken. Bruk egenperiode-formelen Tn = 2π·√(M/K).",
    parts: [
      { id:"a", q:"Beregn egenperioden i sekund.", answer:72.5, unit:"s", tol:2,
        formula:"Tn = 2π·√(M/K)",
        steps:["M = 100 000 t = 1·10⁸ kg, K = 750·10³ N/m", "Tn = 2π·√(1·10⁸/7,5·10⁵) = 2π·√133 = 2π·11,55 = 72,5 s"] }
    ],
    source:"Øving 7 oppg.1b", lecture:"C2", slide:"–" },

  { id:"calc-027", tema:"C", undertema:"C5",
    title:"Strømkraft på havmerd – flerelement",
    text:"Havmerd: nedre vektrør D = 50 m, rørdiameter d = 0,7 m (sirkulært, Cd = 1,2). Øvre flyterør (ellipse) D₂ = 51,4 m, samme d = 0,7 m, Cd = 0,72. Nett: H = 20 m, lengde 50 m, Cd_net = 0,15. U_c = 0,5 m/s, ρ = 1025 kg/m³.",
    parts: [
      { id:"a", q:"Beregn dragkraft på vektrøret i kN.", answer:5.38, unit:"kN", tol:0.2,
        formula:"F = ½·ρ·Cd·d·D·U²",
        steps:["F_vr = 0,5·1025·1,2·0,7·50·0,5² = 5 381 N = 5,38 kN"] },
      { id:"b", q:"Beregn dragkraft på flyterøret i kN.", answer:3.32, unit:"kN", tol:0.15,
        formula:"F = ½·ρ·Cd·d·D·U²",
        steps:["F_fr = 0,5·1025·0,72·0,7·51,4·0,5² = 3 319 N = 3,32 kN"] },
      { id:"c", q:"Beregn dragkraft på nettet i kN.", answer:19.22, unit:"kN", tol:0.6,
        formula:"F = ½·ρ·Cd·H·L·U²",
        steps:["F_net = 0,5·1025·0,15·20·50·0,5² = 19 219 N = 19,22 kN"] }
    ],
    source:"Eksamen 2025 oppg.4a", lecture:"C5", slide:"12" },

  { id:"calc-028", tema:"D", undertema:"D4",
    title:"Strømbehov for katodisk beskyttelse",
    text:"Båt fra Moen Marin med 150 m² skrog under vann ved maks last (Øving 2 oppg.3). Fra DNV RP B401 tabell A-1 (arctic, 0–30 m dyp): initiell strømtetthet i_c = 0,25 A/m². Fra tabell A-2 (massekrav): middels strømtetthet i_cm = 0,12 A/m².",
    parts: [
      { id:"a", q:"Beregn initielt strømbehov I_i for hele skroget i A.", answer:37.5, unit:"A", tol:0.5,
        formula:"I_i = i_c · A",
        steps:["I_i = 0,25·150 = 37,5 A"] },
      { id:"b", q:"Beregn middels strømbehov I_cm for masseberegning i A.", answer:18.0, unit:"A", tol:0.5,
        formula:"I_cm = i_cm · A",
        steps:["I_cm = 0,12·150 = 18,0 A"] }
    ],
    source:"Øving 2 oppg.3 (Moen Marin)", lecture:"D4", slide:"–" }
];
