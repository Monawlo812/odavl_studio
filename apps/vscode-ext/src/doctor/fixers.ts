import * as vscode from 'vscode';

export type DiagnosticWithUri = { diagnostic: vscode.Diagnostic, uri: vscode.Uri };

export interface Fixer {
  match: (diag: DiagnosticWithUri) => boolean;
  apply: (diag: DiagnosticWithUri) => Promise<{ edit: vscode.WorkspaceEdit } | null>;
}

// Placeholder fixers (implementations in next batch)
export function getFixers(): Fixer[] {
  return [
    // yamlStepIndentFixer, tsStdoutGuardFixer, tsOpenEvidenceStrFixer, mochaTypesFixer, evidencePanelHtmlFixer
  ];
}
