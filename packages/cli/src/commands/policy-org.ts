/* eslint-env node */
/* global process, console */
// CLI: odavl policy validate --org
<<<<<<< HEAD
import { validateOrgPolicy } from '@odavl/policy/src/org-policy.js';
export function runOrgPolicyValidate(repoPolicies: any[]) {
=======
import { validateOrgPolicy } from '../policy-bridge.js';
// @ts-ignore
export function runOrgPolicyValidate(repoPolicies) {
>>>>>>> 79b66b0 (fix: remove broken submodule reference for CI security jobs)
  const result = validateOrgPolicy(repoPolicies);
  if (!result.ok) {
    // @ts-ignore
    console.error('Org policy validation failed:', result.errors);
    // @ts-ignore
    process.exit(1);
  } else {
    // @ts-ignore
    console.log('Org policy validation passed.');
  }
}
