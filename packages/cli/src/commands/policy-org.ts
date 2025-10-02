/* eslint-env node */
/* global process, console */
// CLI: odavl policy validate --org
import { validateOrgPolicy } from '@odavl/policy/src/org-policy.js';
export function runOrgPolicyValidate(repoPolicies: any[]) {
  const result = validateOrgPolicy(repoPolicies);
  if (!result.ok) {
    console.error('Org policy validation failed:', result.errors);
    process.exit(1);
  } else {
    console.log('Org policy validation passed.');
  }
}
