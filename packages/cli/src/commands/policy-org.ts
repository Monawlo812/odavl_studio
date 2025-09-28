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
import { validateOrgPolicy } from '@odavl/policy';
export function runOrgPolicyValidate(repoPolicies: any[]) {
  const result = validateOrgPolicy(repoPolicies);
  if (!result.ok) {
    console.error('Org policy validation failed:', result.errors);
    process.exit(1);
  } else {
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
    console.log('Org policy validation passed.');
  }
}
