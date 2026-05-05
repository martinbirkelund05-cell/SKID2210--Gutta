# SKID2210 – Eksamensøving · Havromskonstruksjoner (NTNU)

Modulær statisk nettside for eksamensøving i SKID2210. Åpnes direkte i nettleseren — ingen server, ingen build-steg.

---

## Slik åpner du nettsiden

1. **Dobbeltklikk på `index.html`** — åpnes i standard nettleser.
2. Hvis nettleseren blokkerer lokale filer (CORS-feil for `<script src>`), start en enkel lokal server:
   ```bash
   # Python 3
   python3 -m http.server 8080
   # Åpne: http://localhost:8080/
   ```
   eller bruk VS Code Live Server / Homebrew `http-server`.

---

## Hvor legger man til innhold?

### Legge til en regneoppgave (calc)

Åpne `data/calc-tasks.js` og legg til et objekt i `CALC_TASKS`-arrayen:

```js
{ id:"calc-029", tema:"B", undertema:"B2",
  title:"Tittel på oppgaven",
  text:"Beskrivelse av situasjonen. D = 10 m, T = 8 s, ρ = 1025 kg/m³.",
  parts: [
    { id:"a", q:"Beregn bølgefrekvensen ω.", answer:0.785, unit:"rad/s", tol:0.01,
      formula:"ω = 2π/T",
      steps:["ω = 2π/8 = 0,785 rad/s"] },
    { id:"b", q:"Beregn bølgetallet k.", answer:0.063, unit:"rad/m", tol:0.003,
      formula:"k = ω²/g",
      steps:["k = 0,785²/9,81 = 0,063 rad/m"] }
  ],
  source:"Øving X oppg.Y", lecture:"B2", slide:"42–48" }
```

**Feltforklaring:**
- `id`: unik streng, f.eks. `"calc-029"` — inkrementer fra høyeste eksisterende
- `tema`: `"A"`, `"B"`, `"C"` eller `"D"` (brukes til tema-filter)
- `undertema`: f.eks. `"B2"`, `"C5"` osv.
- `answer`: numerisk fasit for del-oppgaven
- `tol`: toleranse (±) for godkjenning
- `formula`: formel-streng som vises i fasit (rendres med KaTeX)
- `steps`: liste med regnetrinn

---

### Legge til flashcards

Åpne `data/flashcards.js`, legg til i `FLASHCARDS`-arrayen:

```js
{ id:"fc-B2-03", tema:"B", undertema:"B2",
  front:"Hva er fasehastigheten på dypt vann?",
  back:"c = ω/k = √(g/k). På dypt vann er c uavhengig av dybden.",
  source:"Formelark s.2", lecture:"B2", slide:"42" }
```

---

### Legge til MCQ-spørsmål

Åpne `data/mcq.js`, legg til i `MCQ`-arrayen:

```js
{ id:"mc-B-016", tema:"B", undertema:"B2",
  text:"Hva er forholdet mellom gruppehastighet og fasehastighet på dypt vann?",
  options:["Vg = c","Vg = c/2","Vg = 2c","Vg = c/4"],
  correct:1,
  explanation:"På dypt vann er Vg = c/2. Energi transporteres med halve fasehastigheten.",
  source:"Formelark s.2", lecture:"B2", slide:"42" }
```

---

### Legge til innskrivningsspørsmål (written)

Åpne `data/written.js`, legg til i `WRITTEN`-arrayen:

```js
{ id:"wr-021", tema:"C", undertema:"C3",
  text:"Forklar hva en kjedelinje er og hvorfor den er relevant i forankringsdesign.",
  hint:"Form og horisontalkraft.",
  answer:"En tung, fleksibel linje...",
  source:"C3 Kjedelinjeteori", lecture:"C3", slide:"4–10" }
```

---

## Eksamensgeneratoren

Eksamensgeneratoren i `js/modes/exam.js` bruker to datakilder:

### `EXAM_TASK_BANK` (`data/exam-task-bank.js`)

26 oppgaver tagget med `matchesExamPattern`, `tema`, `undertema`, `taskType`, `points` og `difficulty`.

Generatoren plukker oppgaver basert på komposisjonsreglene:

### `EXAM_COMPOSITION_RULES` (`data/exam-patterns.js`)

```js
const EXAM_COMPOSITION_RULES = {
  totalPoints: 100,
  targetNumberOfTasks: 6,
  rules: [
    { tema:"A", minPoints:10, maxPoints:22, ... },
    { tema:"B", minPoints:28, maxPoints:42, ... },
    { tema:"C", minPoints:14, maxPoints:28, ... },
    { tema:"D", minPoints:14, maxPoints:24, ... }
  ]
};
```

Resulterende eksamen inneholder typisk 9–12 oppgaver totalt og 85–107 poeng.

---

## Oppdatere eksamensmønstre

Når et nytt eksamensett er tilgjengelig:

1. Åpne `data/exam-patterns.js`
2. Legg til et nytt objekt i `PREVIOUS_EXAM_PATTERNS`-arrayen med årstall, poengfordeling og testede metoder
3. Legg til nye oppgaver fra eksamen i `data/exam-task-bank.js` med `matchesExamPattern`-felt

---

## Mappestruktur

```
skid2210/
├── index.html              ← HTML-skjelett + <script src>-lasting
├── README.md
├── styles/
│   ├── base.css            ← Variabler, layout, sidebar
│   ├── components.css      ← Knapper, kort, tabeller, charts
│   └── tasks.css           ← Strukturerte eksamensoppgaver
├── data/
│   ├── fx-tokens.js        ← FX (formel-tokens)
│   ├── topics.js           ← TOPICS (A/B/C/D)
│   ├── flashcards.js       ← FLASHCARDS (22 kort)
│   ├── mcq.js              ← MCQ (32 spørsmål)
│   ├── calc-tasks.js       ← CALC_TASKS (28 oppgaver)
│   ├── written.js          ← WRITTEN (80 spørsmål)
│   ├── formula-bank.js     ← FORMULA_BANK
│   ├── exam-patterns.js    ← PREVIOUS_EXAM_PATTERNS + EXAM_COMPOSITION_RULES
│   └── exam-task-bank.js   ← EXAM_TASK_BANK (26 oppgaver)
├── js/
│   ├── core/
│   │   ├── state.js        ← STATE, loadState, saveState (localStorage: "skid2210_v2")
│   │   ├── utils.js        ← Hjelpefunksjoner, formel-renderer
│   │   └── math.js         ← formulaToLatex, KaTeX-rendring
│   ├── tasks/
│   │   └── task-renderer.js
│   ├── modes/
│   │   ├── home.js
│   │   ├── flashcards.js
│   │   ├── mcq.js
│   │   ├── calc.js
│   │   ├── written.js
│   │   ├── exam.js
│   │   ├── analytics.js
│   │   └── bank.js
│   └── app.js              ← Router + init (lastes sist)
└── assets/                 ← Tom (til bilder)
```

---

**localStorage-nøkkel:** `skid2210_v2` — eksisterende historikk bevares.
