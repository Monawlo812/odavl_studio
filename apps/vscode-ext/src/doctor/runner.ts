import * as vscode from 'vscode';
import { getFixers, DiagnosticWithUri } from './fixers';

export async function runBatchFix(diags: DiagnosticWithUri[], opts: { batch: boolean }) {
  const config = vscode.workspace.getConfiguration('odavl.doctor');
  const maxLines = config.get('maxLines', 40);
  const maxFiles = config.get('maxFiles', 10);
  const protectedGlobs: string[] = config.get('protectedGlobs', []);
  let lines = 0, files = 0;
  const fixers = getFixers();
  const edit = new vscode.WorkspaceEdit();
  const touched = new Set<string>();
  for (const diag of diags) {
    if (files >= maxFiles || lines >= maxLines) break;
    const file = diag.uri.fsPath;
    if (protectedGlobs.some(glob => file.includes(glob.replace('**/','')))) continue;
    const fixer = fixers.find(f => f.match(diag));
    if (!fixer) continue;
    const res = await fixer.apply(diag);
  if (res?.edit) {
      for (const [uri, edits] of res.edit.entries()) {
        for (const e of edits) {
          edit.replace(uri, e.range, e.newText);
          lines += e.newText.split('\n').length;
        }
        touched.add(uri.fsPath);
      }
      files++;
    }
    if (!opts.batch) break;
  }
  await vscode.workspace.applyEdit(edit);
  await vscode.workspace.saveAll();
  return { lines, files, touched: Array.from(touched) };
}
