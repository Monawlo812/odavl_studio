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
    // @ts-ignore
    console.log('Org policy validation passed.');
  }
}
