import * as vscode from 'vscode';
import { DiagnosticWithUri } from './fixers';

export function selectDiagnostics(): DiagnosticWithUri[] {
  const all = vscode.languages.getDiagnostics();
  let diags: DiagnosticWithUri[] = [];
  for (const [uri, diagnostics] of all) {
    for (const d of diagnostics) {
      diags.push({ diagnostic: d, uri });
    }
  }
  // Prioritize: YAML CI > TS errors > warnings
  diags.sort((a, b) => {
    function pri(d: DiagnosticWithUri) {
      if (d.uri.fsPath.includes('.github')) return 0;
      if (d.diagnostic.severity === vscode.DiagnosticSeverity.Error) {
        return 1;
      }
      return 2;
    }
    return pri(a) - pri(b);
  });
  return diags;
}
