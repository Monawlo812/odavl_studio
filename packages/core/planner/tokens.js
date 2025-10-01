export function computeRiskTokens(i) {
    const base = Math.min(15, Math.max(5, i.base ?? 10));
    const k1 = 5, k2 = 8, k3 = 1, k4 = 3;
    const raw = base +
        k1 * (i.coveragePct || 0) -
        k2 * (i.flakeRate || 0) -
        k3 * (i.rollbacks30d || 0) -
        k4 * (i.repoSizeFactor || 0);
    const tokens = Math.min(25, Math.max(5, Math.round(raw)));
    return { tokens, base, k: { k1, k2, k3, k4 }, input: i };
}
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
// Minimal tokenize implementation for test
export function tokenize(str) {
    return str.split(/\s+/).filter(Boolean);
}
<<<<<<< HEAD
=======
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
=======
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
