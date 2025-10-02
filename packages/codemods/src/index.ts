<<<<<<< HEAD

// Codemods package exports
export { esmHygiene } from "./esmHygiene.js";
export { depsPatchMinor } from "./depsPatchMinor.js";
export type { Patch, PatchSet } from "./types.js";
=======
export * from "./esmHygiene";
export * from "./depsPatchMinor";
>>>>>>> 86b1346 (H3: Safe delete (quarantine) of LEGACY and NOISE files with full evidence. See reports/hygiene/2025-10-01/run-1/ for audit trail.)
export const codemodsReady = true;
