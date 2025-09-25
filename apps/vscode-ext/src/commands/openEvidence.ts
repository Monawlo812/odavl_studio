import * as vscode from 'vscode';
import { getHtml } from '../webview/EvidencePanel';
import { listEvidence } from '../services/evidence';

export async function openEvidence() {
  const panel = vscode.window.createWebviewPanel('odavl.evidence', 'ODAVL Evidence', vscode.ViewColumn.One, { enableScripts: true });
  panel.webview.html = getHtml();
  const items = await listEvidence();
  // Ensure all booleans are coerced to string for webview
  const itemsStr = items.map((item: any) => ({ ...item, value: typeof item.value === 'boolean' ? String(item.value) : item.value }));
  panel.webview.postMessage({ type: 'evidence', items: itemsStr });
}
