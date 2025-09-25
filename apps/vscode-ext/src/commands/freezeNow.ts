import * as vscode from 'vscode';
import { runCli } from '../services/cli';
import * as fs from 'fs';
import * as path from 'path';

export async function freezeNow() {
  const out = vscode.window.createOutputChannel('ODAVL');
  out.show();
  runCli(['freeze', '--reports', 'reports'], (s) => out.append(s), async () => {
    const reports = [
      'attestation-latest.json',
      ...fs.readdirSync('reports').filter(f => f.startsWith('attestation-')).sort().slice(-1),
      'bundle.log', 'osv.json', 'gitleaks.json'
    ];
    for (const file of reports) {
      const p = path.join('reports', file);
      if (fs.existsSync(p)) {
        const doc = await vscode.workspace.openTextDocument(p);
        vscode.window.showTextDocument(doc, { preview: false });
      }
    }
  });
}
