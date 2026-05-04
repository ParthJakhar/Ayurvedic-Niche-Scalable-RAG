/** @typedef {'vata' | 'pitta' | 'kapha'} DoshaKey */

/**
 * @typedef {{ vata: number, pitta: number, kapha: number }} DoshaScores
 * @typedef {{ version?: number, scores: DoshaScores, tied: DoshaKey[], quizTotal: number, savedAt?: string }} StoredQuizResults
 */

/** @typedef {{ id: string, label: string }} ChecklistItem */

/**
 * @typedef {{
 *   profileLabel: string,
 *   summary: string,
 *   breakfast: ChecklistItem[],
 *   lunch: ChecklistItem[],
 *   dinner: ChecklistItem[],
 *   yogaAsanas: ChecklistItem[],
 *   wellnessSuggestions: ChecklistItem[],
 * }} DailyPlan
 */

const DOSHA_ORDER = /** @type {const} */ (["vata", "pitta", "kapha"]);

const DOSHA_LABEL = /** @type {Record<DoshaKey, string>} */ ({
  vata: "Vata",
  pitta: "Pitta",
  kapha: "Kapha",
});

/** @type {Record<DoshaKey, DailyPlan>} */
const SINGLE = {
  vata: {
    profileLabel: "Vata-focused day",
    summary:
      "Keep the day warm, grounding, and regular. Favor stability in meals and gentle calming movement.",
    breakfast: [
      { id: "warm-breakfast", label: "Have a warm breakfast (oats or porridge)." },
      { id: "stewed-fruit", label: "Add stewed fruit or soaked nuts for nourishment." },
    ],
    lunch: [
      { id: "main-meal", label: "Eat your main meal at lunch (rice + dal + cooked vegetables)." },
      { id: "warm-water", label: "Sip warm water or herbal tea with/after lunch." },
    ],
    dinner: [
      { id: "light-warm-dinner", label: "Choose a light warm dinner (soup/stew) before late evening." },
      { id: "avoid-cold-night", label: "Avoid cold, dry snacks at night." },
    ],
    yogaAsanas: [
      { id: "vata-cat-cow", label: "Cat-Cow - 8 rounds with slow breathing." },
      { id: "vata-child", label: "Child's Pose - hold 60-90 seconds." },
      { id: "vata-legs-up", label: "Legs-Up-The-Wall - 5 minutes before bed." },
    ],
    wellnessSuggestions: [
      { id: "vata-routine", label: "Keep meal and sleep timings consistent today." },
      { id: "vata-breath", label: "Do 5 minutes of deep belly breathing in the evening." },
      { id: "vata-digital", label: "Reduce late-night screen stimulation." },
    ],
  },
  pitta: {
    profileLabel: "Pitta-focused day",
    summary:
      "Aim for cool-headed, moderate pacing. Favor cooling meals and avoid overheating the body-mind.",
    breakfast: [
      { id: "cool-breakfast", label: "Eat a cooling breakfast (barley/oats + sweet fruit)." },
      { id: "skip-hot-spice", label: "Skip very spicy condiments in the morning." },
    ],
    lunch: [
      { id: "balanced-lunch", label: "Build lunch with grains, vegetables, and moderate spice." },
      { id: "hydration", label: "Hydrate with room-temperature water, not sugary drinks." },
    ],
    dinner: [
      { id: "lighter-dinner", label: "Keep dinner lighter than lunch." },
      { id: "avoid-late-heavy", label: "Avoid heavy, oily late-night meals." },
    ],
    yogaAsanas: [
      { id: "pitta-moon-salute", label: "Slow Moon Salutation sequence for 5-7 minutes." },
      { id: "pitta-twist", label: "Seated spinal twist on both sides, gentle hold." },
      { id: "pitta-shavasana", label: "Savasana with relaxed breath - 7 minutes." },
    ],
    wellnessSuggestions: [
      { id: "pitta-pauses", label: "Take 2 short cooling breaks between intense work blocks." },
      { id: "pitta-breath", label: "Practice Sheetali/Sheetkari breathing for 2-3 minutes." },
      { id: "pitta-sun", label: "Avoid harsh midday sun exposure where possible." },
    ],
  },
  kapha: {
    profileLabel: "Kapha-focused day",
    summary:
      "Bring lightness and momentum. Favor warm, lighter foods and energizing movement through the day.",
    breakfast: [
      { id: "light-breakfast", label: "Keep breakfast light and warm (spiced herbal tea + light meal)." },
      { id: "no-heavy-dairy-am", label: "Avoid heavy dairy and sugary morning foods." },
    ],
    lunch: [
      { id: "spiced-lunch", label: "Have a warm, spiced lunch with legumes and vegetables." },
      { id: "portion-aware", label: "Pause before seconds; keep portions comfortable." },
    ],
    dinner: [
      { id: "early-dinner", label: "Eat an early, simple dinner (soup or stir-fry)." },
      { id: "post-dinner-walk", label: "Take a 10-15 minute walk after dinner." },
    ],
    yogaAsanas: [
      { id: "kapha-sun-salute", label: "Sun Salutations - 6 to 10 rounds at steady pace." },
      { id: "kapha-chair", label: "Chair Pose - 3 rounds with breath focus." },
      { id: "kapha-bridge", label: "Bridge Pose - 3 gentle holds." },
    ],
    wellnessSuggestions: [
      { id: "kapha-activate", label: "Start your morning with movement before long sitting." },
      { id: "kapha-tea", label: "Use warming teas (ginger/tulsi/cinnamon) during the day." },
      { id: "kapha-declutter", label: "Do one energizing task you tend to postpone." },
    ],
  },
};

/** @type {DailyPlan} */
const TRIDOSHIC = {
  profileLabel: "Balanced daily plan",
  summary:
    "Use a moderate, sustainable rhythm today: regular meals, mindful movement, and a calm evening routine.",
  breakfast: [
    { id: "tri-breakfast", label: "Eat a balanced breakfast with warm whole foods." },
    { id: "tri-hydrate-am", label: "Hydrate early with water or herbal tea." },
  ],
  lunch: [
    { id: "tri-lunch", label: "Make lunch the heaviest meal with grains + vegetables + protein." },
    { id: "tri-mindful", label: "Eat mindfully without screens for at least one meal." },
  ],
  dinner: [
    { id: "tri-light-dinner", label: "Keep dinner lighter and finish 2-3 hours before sleep." },
    { id: "tri-digestive", label: "Take a short post-dinner walk or gentle stretch." },
  ],
  yogaAsanas: [
    { id: "tri-flow", label: "Do 10-15 minutes of gentle full-body yoga flow." },
    { id: "tri-forward-fold", label: "Seated forward fold with relaxed breathing." },
    { id: "tri-shavasana", label: "Savasana for 5 minutes before bed." },
  ],
  wellnessSuggestions: [
    { id: "tri-work-break", label: "Take movement or breathing breaks each 90-120 minutes." },
    { id: "tri-sleep", label: "Keep a consistent sleep window tonight." },
    { id: "tri-reflect", label: "Reflect for 2 minutes on what worked well today." },
  ],
};

function uniqueItems(items) {
  const map = new Map();
  for (const item of items) {
    if (!map.has(item.id)) map.set(item.id, item);
  }
  return [...map.values()];
}

/**
 * @param {DailyPlan} a
 * @param {DailyPlan} b
 * @returns {DailyPlan}
 */
function mergeTwo(a, b) {
  const labelA = a.profileLabel.replace(/-focused day$/, "");
  const labelB = b.profileLabel.replace(/-focused day$/, "");
  return {
    profileLabel: `${labelA}-${labelB} blend day`,
    summary: `${a.summary} ${b.summary}`,
    breakfast: uniqueItems([...a.breakfast, ...b.breakfast]),
    lunch: uniqueItems([...a.lunch, ...b.lunch]),
    dinner: uniqueItems([...a.dinner, ...b.dinner]),
    yogaAsanas: uniqueItems([...a.yogaAsanas, ...b.yogaAsanas]),
    wellnessSuggestions: uniqueItems([
      ...a.wellnessSuggestions,
      ...b.wellnessSuggestions,
    ]),
  };
}

/**
 * @param {{ tied: DoshaKey[], scores: DoshaScores }} results
 * @returns {DailyPlan}
 */
export function getDailyPlanForResults(results) {
  const tied = [...results.tied].sort(
    (x, y) => DOSHA_ORDER.indexOf(x) - DOSHA_ORDER.indexOf(y),
  );

  if (tied.length === 3) return TRIDOSHIC;
  if (tied.length === 1 && SINGLE[tied[0]]) return SINGLE[tied[0]];
  if (tied.length === 2 && SINGLE[tied[0]] && SINGLE[tied[1]]) {
    return mergeTwo(SINGLE[tied[0]], SINGLE[tied[1]]);
  }
  return TRIDOSHIC;
}

/**
 * @param {DoshaKey[]} tied
 */
export function formatDominantLabel(tied) {
  return tied.map((k) => DOSHA_LABEL[k]).join(" - ");
}
