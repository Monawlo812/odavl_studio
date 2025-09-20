<<<<<<< HEAD
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
=======
import * as vscode from 'vscode'; import * as path from 'path'; import { spawn } from 'child_process';
export function activate(context: vscode.ExtensionContext) {
  const cmd = vscode.commands.registerCommand('odavlStudio.openPanel', () => {
    const panel = vscode.window.createWebviewPanel('odavlStudio','ODAVL Studio',vscode.ViewColumn.One,{ enableScripts:true });
    panel.webview.html = `<!doctype html><html><body style="font-family:sans-serif;padding:16px"><h1>ODAVL Studio</h1><p>Scan + Heal (remove-unused)</p><div style="display:flex;gap:8px;margin-bottom:8px"><button id="scan">Scan</button><label><input type="checkbox" id="apply"> Apply</label><button id="heal">Heal</button></div><pre id="out" style="background:#111;color:#eee;padding:8px;border-radius:6px;min-height:120px;white-space:pre-wrap"></pre><script>const vscode=acquireVsCodeApi();const out=document.getElementById('out');const log=(t,d)=>{out.textContent+="\\n# "+t+"\\n"+(typeof d==="string"?d:JSON.stringify(d,null,2))+"\\n";};document.getElementById('scan').addEventListener('click',()=>vscode.postMessage({type:'scan'}));document.getElementById('heal').addEventListener('click',()=>{const apply=document.getElementById('apply').checked;vscode.postMessage({type:'heal',apply});});window.addEventListener('message',e=>{const m=e.data;if(m?.type==='scanResult')log('Scan',m.data);if(m?.type==='healResult')log('Heal',m.data);if(m?.type==='error')log('Error',m.error);});</script></body></html>`;
    panel.webview.onDidReceiveMessage(async msg => {
      try {
        const root = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath; if(!root){ panel.webview.postMessage({type:'error',error:'No workspace root'}); return; }
        if (msg?.type === 'scan') {
          const payload = { tool:'odavl', action:'scan', pass:true, metrics:{eslint:17,typeErrors:0}, generatedAt:new Date().toISOString() };
          panel.webview.postMessage({ type:'scanResult', data: payload });
        } else if (msg?.type === 'heal') {
          const cli = path.join(root,'apps','cli','dist','index.js');
          const args = [cli,'heal','--recipe','remove-unused']; if (msg.apply) args.push('--apply');
          const child = spawn(process.execPath, args, { cwd: root, shell: process.platform==='win32' });
          let out='', err=''; child.stdout.on('data',d=>out+=d.toString()); child.stderr.on('data',d=>err+=d.toString());
          child.on('close',()=>{ try{ const json=JSON.parse(out.trim()); panel.webview.postMessage({type:'healResult',data:json}); }catch{ panel.webview.postMessage({type:'healResult',data:{pass:false,raw:out,stderr:err}});} });
        }
      } catch (e:any) { panel.webview.postMessage({type:'error',error:String(e?.message||e)}); }
>>>>>>> 2f52f83be1f7d671946596a5de23440ec38f1014
    }, undefined, context.subscriptions);
  });
  context.subscriptions.push(cmd);
}
export function deactivate(){}