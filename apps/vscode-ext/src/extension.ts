import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';

// Module-level status bar variables
let statusItem: vscode.StatusBarItem | undefined;
let updateInterval: NodeJS.Timeout | undefined;

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

// Helper to run CLI commands
async function runCli(args: string[], opts?: { cwd?: string, timeout?: number }): Promise<{ ok: boolean, stdout: string, stderr: string }> {
  const root = opts?.cwd || getWorkspaceRoot();
  if (!root) return { ok: false, stdout: '', stderr: 'No workspace' };
  
  const cliPath = path.join(root, 'apps', 'cli', 'dist', 'index.js');
  return run('node', [cliPath, ...args], root, opts?.timeout || 30000);
}

// Helper to run commands with timeout
async function run(cmd: string, args: string[] = [], cwd?: string, timeoutMs = 8000): Promise<{ ok: boolean, stdout: string, stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: cwd || process.cwd(), shell: process.platform === 'win32', stdio: 'pipe' });
    let stdout = '', stderr = '', resolved = false;
    
    const timeout = setTimeout(() => {
      if (!resolved) { resolved = true; child.kill(); resolve({ ok: false, stdout, stderr: 'Timeout' }); }
    }, timeoutMs);
    
    child.stdout?.on('data', (data) => stdout += data.toString());
    child.stderr?.on('data', (data) => stderr += data.toString());
    child.on('close', (code) => { if (!resolved) { resolved = true; clearTimeout(timeout); resolve({ ok: code === 0, stdout, stderr }); } });
    child.on('error', (error) => { if (!resolved) { resolved = true; clearTimeout(timeout); resolve({ ok: false, stdout, stderr: error.message }); } });
  });
}

// Get workspace root path
function getWorkspaceRoot(): string | undefined { return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath; }

// Fetch status data from CLI
async function fetchStatus(): Promise<{ governorState: string, telemetryMode: string }> {
  const root = getWorkspaceRoot();
  if (!root) return { governorState: 'n/a', telemetryMode: 'n/a' };
  
  try {
    const cliPath = path.join(root, 'apps', 'cli', 'dist', 'index.js');
    let result = await run('node', [cliPath, 'status'], root, 8000);
    
    if (result.ok && result.stdout) {
      try {
        const status = JSON.parse(result.stdout);
        return { governorState: status.governor?.state || 'n/a', telemetryMode: status.telemetry?.mode || 'n/a' };
      } catch { /* fallback below */ }
    }
    
    // Fallback to governor explain + config reading
    result = await run('node', [cliPath, 'governor', 'explain', '--json'], root, 6000);
    let governorState = 'n/a';
    if (result.ok && result.stdout) {
      try { const governor = JSON.parse(result.stdout); governorState = governor.pr?.allowedNow ? 'allowed' : 'blocked'; } catch { /* ignore */ }
    }
    return { governorState, telemetryMode: readTelemetryMode(root) };
  } catch { return { governorState: 'n/a', telemetryMode: 'n/a' }; }
}

// Render status bar with current data
function renderStatusBar(data: { governorState: string, telemetryMode: string }): void {
  if (!statusItem) return;
  statusItem.text = `ODAVL ▷ Control`;
  statusItem.tooltip = `ODAVL Studio — Governor: ${data.governorState} | Telemetry: ${data.telemetryMode}`;
  statusItem.command = 'odavl.controlCenter.open';
  statusItem.show();
}

// Update status bar with fresh data
async function updateStatusBar(): Promise<void> {
  try { const data = await fetchStatus(); renderStatusBar(data); } 
  catch { renderStatusBar({ governorState: 'error', telemetryMode: 'error' }); }
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
  // Create status bar item
  statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 99);
  context.subscriptions.push(statusItem);
  
  // Initial status bar update and setup periodic updates
  updateStatusBar();
  updateInterval = setInterval(updateStatusBar, 30000);
  context.subscriptions.push(new vscode.Disposable(() => { if (updateInterval) { clearInterval(updateInterval); updateInterval = undefined; } }));
  
  // Update on configuration changes
  context.subscriptions.push(vscode.workspace.onDidChangeConfiguration((e) => { if (e.affectsConfiguration('studio') || e.affectsConfiguration('odavl')) updateStatusBar(); }));
  
  const disposable = vscode.commands.registerCommand('odavlStudio.openPanel', () => {
    updateStatusBar(); // Update status bar when panel opens
    
    const panel = vscode.window.createWebviewPanel('odavlStudio', 'ODAVL Studio', vscode.ViewColumn.One, { enableScripts: true });
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '';
    const telemetryMode = readTelemetryMode(workspaceRoot);
    panel.webview.html = createWebviewHtml(telemetryMode);
    
    panel.webview.onDidReceiveMessage(async (message) => {
      if (!workspaceRoot) { panel.webview.postMessage({ type: 'result', data: { error: 'No workspace' } }); return; }
      
      try {
        let result: any;
        if (message.type === 'scan') { result = await runCliCommand(workspaceRoot, ['scan']); }
        else if (message.type === 'heal') { result = await runCliCommand(workspaceRoot, ['heal', '--recipe', 'remove-unused', '--dry-run']); }
        else if (message.type === 'openReports') {
          const reportsPath = path.join(workspaceRoot, 'reports');
          try { await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(reportsPath), true); result = { success: true, message: 'Opening reports folder' }; }
          catch { result = { error: 'Could not open reports folder' }; }
        } else { result = { error: 'Unknown command', type: message.type }; }
        panel.webview.postMessage({ type: 'result', data: result });
      } catch (error: any) { panel.webview.postMessage({ type: 'result', data: { error: 'Command failed', message: error.message } }); }
    });
  });
  
  context.subscriptions.push(disposable);

  // Register Control Center command
  const controlCenterCommand = vscode.commands.registerCommand('odavl.controlCenter.open', async () => {
    const panel = vscode.window.createWebviewPanel(
      'odavlControlCenter',
      'ODAVL Control Center',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
      }
    );

    // Load external HTML file
    const htmlPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'control-center.html');
    const html = await vscode.workspace.fs.readFile(htmlPath);
    panel.webview.html = html.toString();

    // Handle messages from webview
    panel.webview.onDidReceiveMessage(async (message) => {
      const { cmd } = message;
      try {
        panel.webview.postMessage({ type: 'log', message: `Starting ${cmd}...` });
        
        if (cmd === 'magic') {
          await vscode.commands.executeCommand('odavl.magic.run');
          panel.webview.postMessage({ type: 'success', message: 'Magic workflow completed!' });
        } else {
          // Run CLI commands via terminal
          const terminal = vscode.window.createTerminal('ODAVL');
          terminal.sendText(`pnpm -w odavl ${cmd}`);
          terminal.show();
          panel.webview.postMessage({ type: 'success', message: `${cmd} command executed!` });
        }
      } catch (error) {
        panel.webview.postMessage({ type: 'error', message: `Failed: ${error}` });
      }
    });
  });

  // Register Magic command  
  const magicCommand = vscode.commands.registerCommand('odavl.magic.run', async () => {
    const root = getWorkspaceRoot();
    if (!root) {
      vscode.window.showErrorMessage('No workspace opened');
      return;
    }

    // Show progress with steps
    await vscode.window.withProgress({
      location: vscode.ProgressLocation.Notification,
      title: "✨ Running ODAVL Magic...",
      cancellable: false
    }, async (progress) => {
      try {
        const cliPath = path.join(root, 'apps', 'cli', 'dist', 'index.js');
        
        // Step 1: Scan
        progress.report({ increment: 20, message: "📊 Scanning codebase..." });
        let result = await run('node', [cliPath, 'scan', '--json'], root, 30000);
        if (!result.ok) throw new Error(`Scan failed: ${result.stderr}`);
        
        // Step 2: Heal (if needed)
        progress.report({ increment: 30, message: "🔧 Applying fixes..." });
        result = await run('node', [cliPath, 'heal', '--recipe', 'esm-hygiene', '--apply', '--max-files', '5'], root, 45000);
        if (!result.ok) console.log(`Heal warning: ${result.stderr}`); // Non-critical
        
        // Step 3: Shadow run
        progress.report({ increment: 30, message: "☁️ Running shadow CI..." });
        result = await run('node', [cliPath, 'shadow', 'run', '--json'], root, 60000);
        if (!result.ok) console.log(`Shadow warning: ${result.stderr}`); // Non-critical
        
        // Step 4: Generate reports
        progress.report({ increment: 20, message: "📝 Generating reports..." });
        await run('node', [cliPath, 'report', 'health', '--since', '1h'], root, 15000);
        
        vscode.window.showInformationMessage('✨ Magic completed! Check reports/ folder for results.');
      } catch (error) {
        vscode.window.showErrorMessage(`Magic failed: ${error}`);
      }
    });
  });

  context.subscriptions.push(controlCenterCommand, magicCommand);
}

export function deactivate(): void {
  // Clean up status bar and timer
  if (updateInterval) { clearInterval(updateInterval); updateInterval = undefined; }
  if (statusItem) { statusItem.dispose(); statusItem = undefined; }
}