// CLI/extension RBAC check stub
import { enforceRbac } from '@odavl/policy/src/rbac.js';
export function checkRbac(action: string, role: string) {
  if (!enforceRbac(action as any, role as any)) {
    console.warn(`[RBAC] Action '${action}' denied for role '${role}'.`);
    // In next batch, this will throw or exit
  }
}
