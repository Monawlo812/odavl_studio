// TypeScript bridge for @odavl/policy exports
// WORKAROUND: Inline implementation due to TS/ESM/exports bug. Remove when fixed upstream.
/**
 * Org-level policy enforcement for ODAVL (inlined from @odavl/policy)
 * @param repoPolicies Array of repo policy objects
 * @returns { ok: boolean, errors: string[] }
 */
// @ts-ignore
export function validateOrgPolicy(repoPolicies) {
	const errors = [];
	// Example: enforce max PRs/day = min of all
	// @ts-ignore
	const prs = repoPolicies.map(p => p.governor?.prsPerDay).filter(Boolean);
	if (Math.min(...prs) !== Math.max(...prs)) {
		errors.push('Conflicting prsPerDay across repos');
	}
	// Example: enforce max CI minutes/hour
	// @ts-ignore
	const ci = repoPolicies.map(p => p.governor?.ciMinutesPerHour).filter(Boolean);
	if (Math.min(...ci) !== Math.max(...ci)) {
		errors.push('Conflicting ciMinutesPerHour across repos');
	}
	return { ok: errors.length === 0, errors };
}
