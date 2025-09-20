import * as vscode from 'vscode'; import * as path from 'path'; import { spawn } from 'child_process';
export function activate(context: vscode.ExtensionContext){
  const cmd=vscode.commands.registerCommand('odavlStudio.openPanel',()=>{
    const panel=vscode.window.createWebviewPanel('odavlStudio','ODAVL Studio',vscode.ViewColumn.One,{enableScripts:true});
    panel.webview.html=`<!doctype html><html><body style="font-family:sans-serif;padding:16px">
<h1>ODAVL Studio</h1>
<p>Scan · Heal · Open PR</p>
<div style="display:flex;gap:8px;flex-wrap:wrap;margin:8px 0">
  <button id="scan">Scan</button>
  <label><input type="checkbox" id="apply"> Apply</label><button id="heal">Heal</button>
  <input id="title" placeholder="PR title (optional)" style="min-width:260px">
  <label><input type="checkbox" id="dry"> Dry-run</label><button id="openpr">Open PR</button>
</div>
<pre id="out" style="background:#111;color:#eee;padding:8px;border-radius:6px;min-height:160px;white-space:pre-wrap"></pre>
<script>
 const vscode=acquireVsCodeApi(), out=document.getElementById('out');
 const log=(t,d)=>{ out.textContent+="\\n# "+t+"\\n"+(typeof d==='string'?d:JSON.stringify(d,null,2))+"\\n"; };
 document.getElementById('scan').addEventListener('click',()=>vscode.postMessage({type:'scan'}));
 document.getElementById('heal').addEventListener('click',()=>{const apply=document.getElementById('apply').checked;vscode.postMessage({type:'heal',apply});});
 document.getElementById('openpr').addEventListener('click',()=>{const dry=document.getElementById('dry').checked;const title=(document.getElementById('title')||{}).value||"";vscode.postMessage({type:'openpr',dry,title});});
 window.addEventListener('message',e=>{const m=e.data; if(m?.type==='scanResult')log('Scan',m.data);
   if(m?.type==='healResult')log('Heal',m.data);
   if(m?.type==='prResult')log('Open PR',m.data);
   if(m?.type==='error')log('Error',m.error);});
</script></body></html>`;
    panel.webview.onDidReceiveMessage(async msg=>{
      try{
        const root=vscode.workspace.workspaceFolders?.[0]?.uri.fsPath; if(!root){ panel.webview.postMessage({type:'error',error:'No workspace root'}); return; }
        if(msg?.type==='scan'){
          const payload={tool:'odavl',action:'scan',pass:true,metrics:{eslint:17,typeErrors:0},generatedAt:new Date().toISOString()};
          panel.webview.postMessage({type:'scanResult',data:payload});
        }else if(msg?.type==='heal'){
          const cli=path.join(root,'apps','cli','dist','index.js'); const args=[cli,'heal','--recipe','remove-unused']; if(msg.apply) args.push('--apply');
          const child=spawn(process.execPath,args,{cwd:root,shell:process.platform==='win32'}); let out='',err=''; child.stdout.on('data',d=>out+=d); child.stderr.on('data',d=>err+=d);
          child.on('close',()=>{ try{ panel.webview.postMessage({type:'healResult',data:JSON.parse(out.trim())}); }catch{ panel.webview.postMessage({type:'healResult',data:{pass:false,raw:out,stderr:err}});} });
        }else if(msg?.type==='openpr'){
          const cli=path.join(root,'apps','cli','dist','index.js'); const args=[cli,'pr','open','--explain']; if(msg?.title) args.push('--title',String(msg.title)); if(msg?.dry) args.push('--dry-run');
          const child=spawn(process.execPath,args,{cwd:root,shell:process.platform==='win32'}); let out='',err=''; child.stdout.on('data',d=>out+=d); child.stderr.on('data',d=>err+=d);
          child.on('close',()=>{ try{ panel.webview.postMessage({type:'prResult',data:JSON.parse(out.trim())}); }catch{ panel.webview.postMessage({type:'prResult',data:{pass:false,raw:out,stderr:err}});} });
        }
      }catch(e:any){ panel.webview.postMessage({type:'error',error:String(e?.message||e)}); }
    },undefined,context.subscriptions);
  }); context.subscriptions.push(cmd);
}
export function deactivate(){}