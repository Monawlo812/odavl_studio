import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

function readTelemetryMode(root: string): string {
  try {
    const content = fs.readFileSync(path.join(root, '.odavl.policy.yml'), 'utf8');
    const telemetryRegex = /telemetry:\s*(on|anonymized|off)/;
    const match = telemetryRegex.exec(content);
    return match ? match[1] : 'off';
  } catch {
    return 'off';
  }
}

function createWebviewHtml(telemetryMode: string): string {
  return `<!doctype html>
<html>
<head><title>ODAVL Studio</title></head>
<body style="font-family:sans-serif;padding:16px">
  <h1>ODAVL Studio</h1>
  <p>Enterprise Development Toolchain</p>
  <div style="margin:8px 0;padding:8px;background:#f0f0f0;border-radius:4px">
    <strong>Telemetry: ${telemetryMode}</strong>
  </div>
  <div style="display:flex;gap:8px;margin:8px 0">
    <button onclick="vscode.postMessage({type:'scan'})">Scan</button>
    <button onclick="vscode.postMessage({type:'heal'})">Heal</button>
    <button onclick="vscode.postMessage({type:'openReports'})">Reports</button>
  </div>
  <pre id="output" style="background:#111;color:#eee;padding:8px;min-height:120px"></pre>
  <script>
    const vscode = acquireVsCodeApi();
    const output = document.getElementById('output');
    
    window.addEventListener('message', event => {
      const message = event.data;
      if (message.type === 'result') {
        output.textContent += JSON.stringify(message.data, null, 2) + '\\n';
      }
    });
  </script>
</body>
</html>`;
}

async function runCliCommand(root: string, command: string[]): Promise<any> {
  return new Promise((resolve) => {
    const { spawn } = require('child_process');
    const child = spawn(process.execPath, [
      path.join(root, 'apps', 'cli', 'dist', 'index.js'),
      ...command
    ], { cwd: root, shell: process.platform === 'win32' });
    
    let stdout = '';
    child.stdout.on('data', (data: Buffer) => stdout += data.toString());
    child.on('close', () => {
      try {
        resolve(JSON.parse(stdout.trim()));
      } catch {
        resolve({ error: 'Parse failed', raw: stdout });
      }
    });
  });
}

export function activate(context: vscode.ExtensionContext): void {
  const disposable = vscode.commands.registerCommand('odavlStudio.openPanel', () => {
    const panel = vscode.window.createWebviewPanel(
      'odavlStudio',
      'ODAVL Studio',
      vscode.ViewColumn.One,
      { enableScripts: true }
    );
    
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    const telemetryMode = readTelemetryMode(workspaceRoot);
    panel.webview.html = createWebviewHtml(telemetryMode);
    
    panel.webview.onDidReceiveMessage(async (message) => {
      if (!workspaceRoot) {
        panel.webview.postMessage({ type: 'result', data: { error: 'No workspace' } });
        return;
      }
      
      try {
        let result: any;
        
        if (message.type === 'scan') {
          result = await runCliCommand(workspaceRoot, ['scan']);
        } else if (message.type === 'heal') {
          result = await runCliCommand(workspaceRoot, ['heal', '--recipe', 'remove-unused', '--dry-run']);
        } else if (message.type === 'openReports') {
          const reportsPath = path.join(workspaceRoot, 'reports');
          try {
            await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(reportsPath), true);
            result = { success: true, message: 'Opening reports folder' };
          } catch {
            result = { error: 'Could not open reports folder' };
          }
        } else {
          result = { error: 'Unknown command', type: message.type };
        }
        
        panel.webview.postMessage({ type: 'result', data: result });
      } catch (error: any) {
        panel.webview.postMessage({ 
          type: 'result', 
          data: { error: 'Command failed', message: error.message } 
        });
      }
    });
  });
  
  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  // Extension cleanup - intentionally minimal
}