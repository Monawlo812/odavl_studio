declare module '@odavl/policy' {
  // Minimal stub for TypeScript
  export function enforceRbac(action: any, role: any): boolean;
  export type RbacRole = string;
}
