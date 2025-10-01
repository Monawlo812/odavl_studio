import { computeRiskTokens } from "./tokens";
export function sortBaseline(items) {
    return [...items].sort((a, b) => b.score -
        b.risk +
        (b.recipeTrust || 0) -
        (a.score - a.risk + (a.recipeTrust || 0)));
}
export function sortWithTokensV2(items, ctx) {
    const t = computeRiskTokens(ctx || {
        coveragePct: 0.75,
        flakeRate: 0.05,
        rollbacks30d: 0,
        repoSizeFactor: 0.3,
        base: 10,
    }).tokens;
    return [...items].sort((a, b) => {
        const sa = a.score - a.risk + (a.recipeTrust || 0) + 0.1 * t;
        const sb = b.score - b.risk + (b.recipeTrust || 0) + 0.1 * t;
        return sb - sa;
    });
}
// Minimal sort implementation for test
export function sort(arr) {
    return [...arr].sort((a, b) => a - b);
}
