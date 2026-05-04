export const PRAKRITI_RESULTS_KEY = "ayurai-prakriti-results";

/**
 * Persist latest Prakriti quiz outcome for planner flows.
 * @param {{ scores: Record<string, number>, tied: string[], quizTotal: number }} payload
 */
export function savePrakritiResults(payload) {
  try {
    const data = {
      version: 1,
      scores: payload.scores,
      tied: payload.tied,
      quizTotal: payload.quizTotal,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem(PRAKRITI_RESULTS_KEY, JSON.stringify(data));
  } catch {
    /* ignore quota / privacy mode */
  }
}

/** @returns {import("./dailyPlans").StoredQuizResults | null} */
export function loadPrakritiResults() {
  try {
    const raw = localStorage.getItem(PRAKRITI_RESULTS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      !parsed?.scores ||
      typeof parsed.scores !== "object" ||
      !Array.isArray(parsed.tied)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
