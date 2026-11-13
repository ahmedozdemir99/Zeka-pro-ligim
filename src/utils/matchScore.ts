/** Equal question weights, rounded only after computing the score out of 100. */
export function matchScore(correct: number, total: number) {
  return total > 0 ? Math.round(10000 * correct / total) / 100 : 0;
}

const scoreFormat = new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 2 });
export const formatMatchScore = (score: number) => scoreFormat.format(score);
