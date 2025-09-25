import * as vscode from 'vscode';
import { runCli } from '../services/cli';

const RECIPES = ['esm-hygiene', 'deps-patch', 'remove-unused'];

export async function runCodemod() {
  const recipe = await vscode.window.showQuickPick(RECIPES, { placeHolder: 'Select codemod recipe' });
  if (!recipe) return;
  const maxLines = await vscode.window.showInputBox({ prompt: 'Max lines', value: '40' });
  const maxFiles = await vscode.window.showInputBox({ prompt: 'Max files', value: '10' });
  if (!maxLines || !maxFiles) return;
  const out = vscode.window.createOutputChannel('ODAVL');
  out.show();
  let diff = '';
  runCli([
    'heal', '--recipe', recipe, '--dry-run', '--max-lines', maxLines, '--max-files', maxFiles
  ],
    (s) => { out.append(s); diff += s; },
    (code) => {
      if (code === 0) {
        const doc = vscode.workspace.openTextDocument({ content: diff, language: 'diff' });
        doc.then(d => vscode.window.showTextDocument(d));
        // Assume proceed (no confirm), run apply
        runCli([
          'heal', '--recipe', recipe, '--apply', '--max-lines', maxLines, '--max-files', maxFiles
        ], (s) => out.append(s), () => {
          vscode.window.showInformationMessage('Codemod applied.');
          vscode.commands.executeCommand('odavl.openEvidence');
        });
      } else {
        vscode.window.showErrorMessage('Codemod dry-run failed.');
      }
    }
  );
}
