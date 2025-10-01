import { computeRiskTokens } from "./tokens";

export type PlanItem = {
  id: string;
  score: number;
  risk: number;
  recipeTrust?: number;
};
export function sortBaseline(items: PlanItem[]): PlanItem[] {
  return [...items].sort(
    (a, b) =>
      b.score -
      b.risk +
      (b.recipeTrust || 0) -
      (a.score - a.risk + (a.recipeTrust || 0)),
  );
}
export function sortWithTokensV2(
  items: PlanItem[],
  ctx?: {
    coveragePct: number;
    flakeRate: number;
    rollbacks30d: number;
    repoSizeFactor: number;
    base?: number;
  },
): PlanItem[] {
  const t = computeRiskTokens(
    ctx || {
      coveragePct: 0.75,
      flakeRate: 0.05,
      rollbacks30d: 0,
      repoSizeFactor: 0.3,
      base: 10,
    },
  ).tokens;
  return [...items].sort((a, b) => {
    const sa = a.score - a.risk + (a.recipeTrust || 0) + 0.1 * t;
    const sb = b.score - b.risk + (b.recipeTrust || 0) + 0.1 * t;
    return sb - sa;
  });
}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)

// Minimal sort implementation for test
export function sort(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b);
}
<<<<<<< HEAD
=======
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
=======
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
