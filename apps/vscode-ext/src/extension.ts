// --- ODAVL Control Center Panel Registration (Phase 2) ---
import * as vscode from "vscode";


function getWebviewHtml(context: vscode.ExtensionContext): string {
  const scriptUri = vscode.Uri.joinPath(context.extensionUri, "media", "panel.js");
  return `<!DOCTYPE html><html lang='en'><head><meta charset='UTF-8'><title>ODAVL Control Center</title></head><body><div id='root'></div><script src='${scriptUri}'></script></body></html>`;
}

function handleLineFactory(panel: vscode.WebviewPanel, cmd: string) {
  return (line: string) => {
    if (!line.trim()) return;
    if (cmd === "fix") {
      let status: "phase" | "error" | "success" | undefined;
      const l = line.toLowerCase();
      if (l.includes("phase") || l.includes("step")) status = "phase";
      else if (l.includes("error")) status = "error";
      else if (l.includes("done") || l.includes("complete")) status = "success";
      if (status) {
        panel.webview.postMessage({ type: "doctor", status, data: line });
        return;
      }
    }
    panel.webview.postMessage({ type: "log", data: line });
  };
}

function onPanelMessage(panel: vscode.WebviewPanel, commandMap: Record<string, string[]>, cp: any) {
  return (msg: { command: string }) => {
    const cmd = msg.command;
    if (!cmd || !commandMap[cmd]) return;
    const proc = cp.spawn("pnpm", commandMap[cmd], { cwd: vscode.workspace.workspaceFolders?.[0]?.uri.fsPath, shell: true });
    const handleLine = handleLineFactory(panel, cmd);
    proc.stdout.on("data", (data: Buffer) => {
      data.toString().split(/\r?\n/).forEach((line: string) => handleLine(line));
    });
    proc.stderr.on("data", (data: Buffer) => {
      data.toString().split(/\r?\n/).forEach((line: string) => handleLine(line));
    });
  };
}

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand("odavl.openControlCenter", () => {
      const panel = vscode.window.createWebviewPanel(
        "odavl.controlCenter",
        "ODAVL Control Center",
        vscode.ViewColumn.One,
        { enableScripts: true, localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, "media")] }
      );
      panel.webview.html = getWebviewHtml(context);
      const commandMap: Record<string, string[]> = {
        scan: ["-w", "run", "odavl:scan"],
        fix: ["-w", "run", "odavl:doctor:run"],
        undo: ["-w", "run", "odavl:undo"],
        redo: ["-w", "run", "odavl:redo"],
        reports: ["-w", "run", "odavl:reports"],
      };
      const cp = require("child_process");
      panel.webview.onDidReceiveMessage(onPanelMessage(panel, commandMap, cp));
    })
  );
}

export function deactivate(): void {
  // No-op
}
