/* ============================================================
   PREVIOUS_EXAM_PATTERNS — minst 5 mønstre
   ============================================================ */
const PREVIOUS_EXAM_PATTERNS = [
  { year:"Eksamen 2025 (mai)", totalPoints:100, totalTasks:5,
    composition: [
      { tema:"A", undertema:"A1", taskType:"calculation", typicalPoints:20, frequency:"high",
        testedMethods:["Vindturbin-effekt","Betz","Årsproduksjon","Vindstatistikk"],
        similarExercises:["Øving 1"] },
      { tema:"B", undertema:"B4", taskType:"multipleChoice+shortAnswer", typicalPoints:26, frequency:"high",
        testedMethods:["Coriolis","Ekman","Lineær bølgeteori","Grensebetingelser"],
        similarExercises:["Øving 3"] },
      { tema:"B", undertema:"B5", taskType:"calculation", typicalPoints:20, frequency:"high",
        testedMethods:["Bølgeparametre","Morison","Horisontalt vs vertikalt rør","Integrasjon over dybde"],
        similarExercises:["Øving 2"] },
      { tema:"C", undertema:"C5", taskType:"calculation", typicalPoints:14, frequency:"medium",
        testedMethods:["Strømkrefter på havbruksanlegg","Cd for ulike geometrier","Notdrag"],
        similarExercises:["Øving 5/6"] },
      { tema:"D", undertema:"D3", taskType:"shortAnswer", typicalPoints:20, frequency:"high",
        testedMethods:["Malingssystem","Forbehandling","Stripe-coating","Standarder"],
        similarExercises:["Øving 2 (korrosjon)"] }
    ]
  },
  { year:"Eksamen 2024 (mai)", totalPoints:100, totalTasks:5,
    composition: [
      { tema:"A", undertema:"A1", taskType:"calculation", typicalPoints:18, frequency:"high",
        testedMethods:["Tidevannskraft","Effekt fra havstrømmer"],
        similarExercises:["Øving 1"] },
      { tema:"B", undertema:"B2", taskType:"shortAnswer", typicalPoints:14, frequency:"medium",
        testedMethods:["Coriolis","Ekman","Potensialteori"],
        similarExercises:["Øving 3"] },
      { tema:"B", undertema:"B5", taskType:"calculation", typicalPoints:30, frequency:"high",
        testedMethods:["ω, k, λ","Partikkelkinematikk","Morison med Cd og Cm","Drag vs masse-dominert"],
        similarExercises:["Øving 2"] },
      { tema:"C", undertema:"C2", taskType:"calculation", typicalPoints:18, frequency:"high",
        testedMethods:["3-line forankring","Tilbakeførende kraft","Linjekarakteristikk"],
        similarExercises:["Øving 6"] },
      { tema:"D", undertema:"D2", taskType:"shortAnswer", typicalPoints:20, frequency:"high",
        testedMethods:["Korrosjonsformer","Splash-sone","Sone-ineffekter"],
        similarExercises:["Øving 2 (korrosjon)"] }
    ]
  },
  { year:"Eksamen 2023 (mai)", totalPoints:100, totalTasks:5,
    composition: [
      { tema:"A", undertema:"A1", taskType:"mixed", typicalPoints:20, frequency:"high",
        testedMethods:["Vindturbin","Betz","Rotordiameter","Vindstatistikk"],
        similarExercises:["Øving 1"] },
      { tema:"B", undertema:"B5", taskType:"calculation", typicalPoints:25, frequency:"high",
        testedMethods:["Bølgeparametre","Morison","Krefter på rør"],
        similarExercises:["Øving 2"] },
      { tema:"C", undertema:"C2", taskType:"shortAnswer", typicalPoints:15, frequency:"medium",
        testedMethods:["Frekvensområder","Forankringsdesign"],
        similarExercises:["Øving 6/7"] },
      { tema:"C", undertema:"C5", taskType:"calculation", typicalPoints:15, frequency:"medium",
        testedMethods:["Havmerd"],
        similarExercises:["Øving 5"] },
      { tema:"D", undertema:"D2", taskType:"shortAnswer", typicalPoints:25, frequency:"high",
        testedMethods:["4 korrosjonsformer","Anodisk beskyttelse","3-lags malingssystem","Stripe-coating"],
        similarExercises:["Øving 2 (korrosjon)"] }
    ]
  },
  { year:"Eksamen 2022 (kont)", totalPoints:100, totalTasks:5,
    composition: [
      { tema:"A", undertema:"A1", taskType:"calculation", typicalPoints:15, frequency:"medium",
        testedMethods:["Effekt fra vind","Antall turbiner"],
        similarExercises:["Øving 1"] },
      { tema:"B", undertema:"B3", taskType:"shortAnswer", typicalPoints:20, frequency:"medium",
        testedMethods:["Hs","Tp","Spekter"],
        similarExercises:["Øving 4"] },
      { tema:"B", undertema:"B5", taskType:"calculation", typicalPoints:25, frequency:"high",
        testedMethods:["Morison","Drag og masse"],
        similarExercises:["Øving 2"] },
      { tema:"C", undertema:"C3", taskType:"calculation", typicalPoints:20, frequency:"medium",
        testedMethods:["Catenary","Linjekraft"],
        similarExercises:["Øving 6"] },
      { tema:"D", undertema:"D4", taskType:"calculation", typicalPoints:20, frequency:"high",
        testedMethods:["Katodisk beskyttelse","Anodemasse"],
        similarExercises:["Korrosjon Del 4"] }
    ]
  },
  { year:"Eksamen 2021 (mai)", totalPoints:100, totalTasks:5,
    composition: [
      { tema:"A", undertema:"A2", taskType:"shortAnswer", typicalPoints:15, frequency:"low",
        testedMethods:["Pelagisk vs demersal","Bærekraftig fangst"],
        similarExercises:["Øving 1"] },
      { tema:"B", undertema:"B2", taskType:"calculation", typicalPoints:25, frequency:"high",
        testedMethods:["ω, k, λ","Bølgeparametre"],
        similarExercises:["Øving 2"] },
      { tema:"B", undertema:"B5", taskType:"calculation", typicalPoints:20, frequency:"high",
        testedMethods:["Morison","Krefter fra bølger"],
        similarExercises:["Øving 2"] },
      { tema:"C", undertema:"C2", taskType:"shortAnswer+calculation", typicalPoints:20, frequency:"high",
        testedMethods:["Frekvensområder","3-line forankring"],
        similarExercises:["Øving 6"] },
      { tema:"D", undertema:"D2", taskType:"shortAnswer", typicalPoints:20, frequency:"high",
        testedMethods:["Korrosjonsformer","Beskyttelse"],
        similarExercises:["Korrosjon Del 1–4"] }
    ]
  }
];

/* Komposisjons-regler for eksamensgenerering */
const EXAM_COMPOSITION_RULES = {
  totalPoints: 100,
  targetNumberOfTasks: 6,
  rules: [
    { tema:"A", minPoints:10, maxPoints:22, preferredTaskTypes:["calculation","shortAnswer","multipleChoice"] },
    { tema:"B", minPoints:28, maxPoints:42, preferredTaskTypes:["calculation","shortAnswer","multipleChoice"] },
    { tema:"C", minPoints:14, maxPoints:28, preferredTaskTypes:["calculation","shortAnswer","multipleChoice"] },
    { tema:"D", minPoints:14, maxPoints:24, preferredTaskTypes:["shortAnswer","multipleChoice","calculation"] }
  ]
};
