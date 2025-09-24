// Org-level policy enforcement for ODAVL
export function validateOrgPolicy(repoPolicies: any[]): {ok: boolean, errors: string[]} {
  const errors: string[] = [];
  // Example: enforce max PRs/day = min of all
  const prs = repoPolicies.map(p => p.governor?.prsPerDay).filter(Boolean);
  if (Math.min(...prs) !== Math.max(...prs)) {
    errors.push('Conflicting prsPerDay across repos');
  }
  // Example: enforce max CI minutes/hour
  const ci = repoPolicies.map(p => p.governor?.ciMinutesPerHour).filter(Boolean);
  if (Math.min(...ci) !== Math.max(...ci)) {
    errors.push('Conflicting ciMinutesPerHour across repos');
  }
  return { ok: errors.length === 0, errors };
}
