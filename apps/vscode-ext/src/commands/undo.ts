import * as vscode from 'vscode';
import { runCli } from '../services/cli';
import * as fs from 'fs';

export async function undo() {
  const dir = 'reports/undo';
  if (!fs.existsSync(dir)) {
    vscode.window.showWarningMessage('No undo snapshots found.');
    return;
  }
  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
  if (!files.length) {
    vscode.window.showWarningMessage('No undo snapshots found.');
    return;
  }
  const pick = await vscode.window.showQuickPick(files, { placeHolder: 'Select snapshot to undo' });
  if (!pick) return;
  runCli(['undo', '--id', pick.replace('.json','')], (s) => {}, () => {
    vscode.window.showInformationMessage('Undo complete.');
    vscode.commands.executeCommand('odavl.openEvidence');
  });
}
