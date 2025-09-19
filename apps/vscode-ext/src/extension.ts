import * as vscode from 'vscode';
export function activate(context: vscode.ExtensionContext) {
  const cmd = vscode.commands.registerCommand('odavlStudio.openPanel', () => {
    const panel = vscode.window.createWebviewPanel('odavlStudio','ODAVL Studio',vscode.ViewColumn.One,{ enableScripts:true });
    panel.webview.html = `<!doctype html><html><body style="font-family:sans-serif;padding:16px">
<h1>ODAVL Studio</h1>
<p>Panel placeholder. Buttons: <b>Scan</b> (wired), others TBD.</p>
<div style="display:flex;gap:8px;margin-bottom:8px">
<button id="scan">Scan</button><button disabled>Heal</button><button disabled>Shadow</button><button disabled>Open PR</button>
</div>
<pre id="out" style="background:#111;color:#eee;padding:8px;border-radius:6px;min-height:80px"></pre>
<script>
const vscode = acquireVsCodeApi();
document.getElementById('scan').addEventListener('click',()=>{ vscode.postMessage({type:'scan'}); });
window.addEventListener('message',e=>{ const m=e.data; if(m?.type==='scanResult'){ document.getElementById('out').textContent = JSON.stringify(m.data,null,2); }});
</script>
</body></html>`;
    panel.webview.onDidReceiveMessage(msg => {
      if (msg?.type === 'scan') {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceRoot) {
          panel.webview.postMessage({ type:'scanResult', data: { pass:false, error:'No workspace folder found' } });
          return;
        }
        
        const cliPath = `${workspaceRoot}/apps/cli/dist/index.js`;
        const { spawn } = require('child_process');
        const child = spawn('node', [cliPath, 'scan'], { cwd: workspaceRoot });
        
        let stdout = '';
        let stderr = '';
        child.stdout.on('data', (data: any) => stdout += data);
        child.stderr.on('data', (data: any) => stderr += data);
        child.on('close', (code: number) => {
          try {
            const result = JSON.parse(stdout);
            panel.webview.postMessage({ type:'scanResult', data: result });
          } catch (e) {
            panel.webview.postMessage({ type:'scanResult', data: { pass:false, error:`CLI error (${code}): ${stderr || stdout || 'Unknown error'}` } });
          }
        });
      }
    }, undefined, context.subscriptions);
  });
  context.subscriptions.push(cmd);
}
export function deactivate(){}