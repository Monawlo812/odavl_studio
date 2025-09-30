<<<<<<< HEAD
/* eslint-env node */
/* global process, console */
// CLI: odavl policy validate --org
import { validateOrgPolicy } from '@odavl/policy/src/org-policy.js';
export function runOrgPolicyValidate(repoPolicies: any[]) {
  const result = validateOrgPolicy(repoPolicies);
  if (!result.ok) {
    // @ts-ignore
    console.error('Org policy validation failed:', result.errors);
    // @ts-ignore
    process.exit(1);
  } else {
    // @ts-ignore
=======
// CLI: odavl policy validate --org
import { validateOrgPolicy } from '../policy-bridge.js';
// @ts-ignore
export function runOrgPolicyValidate(repoPolicies) {
  const result = validateOrgPolicy(repoPolicies);
  if (!result.ok) {
    // @ts-ignore
    console.error('Org policy validation failed:', result.errors);
    // @ts-ignore
    process.exit(1);
  } else {
<<<<<<< HEAD
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
=======
    // @ts-ignore
>>>>>>> 79b66b0 (fix: remove broken submodule reference for CI security jobs)
    console.log('Org policy validation passed.');
  }
}
