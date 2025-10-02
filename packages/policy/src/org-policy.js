// Org-level policy enforcement for ODAVL
export function validateOrgPolicy(repoPolicies) {
    const errors = [];
    // Example: enforce max PRs/day = min of all
    const prs = repoPolicies.map(p => { var _a; return (_a = p.governor) === null || _a === void 0 ? void 0 : _a.prsPerDay; }).filter(Boolean);
    if (Math.min(...prs) !== Math.max(...prs)) {
        errors.push('Conflicting prsPerDay across repos');
    }
    // Example: enforce max CI minutes/hour
    const ci = repoPolicies.map(p => { var _a; return (_a = p.governor) === null || _a === void 0 ? void 0 : _a.ciMinutesPerHour; }).filter(Boolean);
    if (Math.min(...ci) !== Math.max(...ci)) {
        errors.push('Conflicting ciMinutesPerHour across repos');
    }
    return { ok: errors.length === 0, errors };
}
