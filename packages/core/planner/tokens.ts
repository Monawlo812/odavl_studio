export type TokensInput = {
  coveragePct: number; // 0..1
  flakeRate: number; // 0..1
  rollbacks30d: number; // 0..10
  repoSizeFactor: number; // 0..1
  base?: number; // 5..15 (default 10)
};
export function computeRiskTokens(i: TokensInput) {
  const base = Math.min(15, Math.max(5, i.base ?? 10));
  const k1 = 5,
    k2 = 8,
    k3 = 1,
    k4 = 3;
  const raw =
    base +
    k1 * (i.coveragePct || 0) -
    k2 * (i.flakeRate || 0) -
    k3 * (i.rollbacks30d || 0) -
    k4 * (i.repoSizeFactor || 0);
  const tokens = Math.min(25, Math.max(5, Math.round(raw)));
  return { tokens, base, k: { k1, k2, k3, k4 }, input: i };
}
<<<<<<< HEAD

// Minimal tokenize implementation for test
export function tokenize(str: string): string[] {
  return str.split(/\s+/).filter(Boolean);
}
=======
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
