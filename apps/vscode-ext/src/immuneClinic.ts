import * as vscode from 'vscode';import {execSync} from 'child_process';import * as fs from 'fs';import * as path from 'path';
export function openImmuneClinic(context:vscode.ExtensionContext){
  const panel=vscode.window.createWebviewPanel('immuneClinic','ODAVL Immune Clinic',vscode.ViewColumn.One,{enableScripts:true});
  const update=()=>{
    const p=path.join(vscode.workspace.rootPath||'','reports','immune','metrics.md');
    let body='no metrics yet'; try{body=fs.readFileSync(p,'utf8');}catch{}
    panel.webview.html=`<html><body>
  <h1>ODAVL Immune Clinic</h1>
  <button onclick="vscode.postMessage({cmd:'scan'})">Scan Metrics</button>
  <h2>Metrics</h2><pre>${body.replace(/</g,'&lt;')}</pre>
  <h2>Vaccines</h2><p>coming soon (dry-run results)</p>
  <h2>Antibodies</h2><p>coming soon (suggest/apply)</p>
  <h2>Healers</h2><p>coming soon (last heal report)</p>
  <h2>Verify &amp; Undo</h2><p>coming soon</p>
  <h2>Escalation</h2><p>coming soon (SUMMARY.md)</p>
  <script>
    const vscode=acquireVsCodeApi();
    window.addEventListener('message',e=>{document.body.innerHTML=e.data.html});
  </script>
</body></html>`;
  };
  update();
  panel.webview.onDidReceiveMessage(msg=>{
    if(msg.cmd==='scan'){
      try{execSync('pnpm -w run odavl:immune:metrics',{stdio:'ignore'});}catch{}
      update();
    }
  },undefined,context.subscriptions);
}
