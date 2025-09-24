// Minimal types for codemod operations
export interface Patch {
  file: string;
  diff: string;
  added: number;
  removed: number;
}

export interface PatchSet {
  patches: Patch[];
  totalChanges: number;
}
