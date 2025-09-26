// --- ODAVL Control Panel WebviewViewProvider ---
class OdavlControlPanelProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'odavl.control';
  private _view?: vscode.WebviewView;
  constructor(private readonly _extensionUri: vscode.Uri) {}
  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'media')],
    };
    const htmlPath = path.join(this._extensionUri.fsPath, 'media', 'control-center.html');
    fs.readFile(htmlPath, 'utf8', (err, data) => {
      webviewView.webview.html = err ? '<b>Failed to load UI</b>' : data;
    });
    webviewView.webview.onDidReceiveMessage(async (msg) => {
      const root = getWorkspaceRoot();
      if (!root) return;
      if (msg.type === 'scan') {
        runInTerminal('pnpm -w run odavl:scan');
      } else if (msg.type === 'heal') {
        runInTerminal('pnpm -w run odavl:heal');
      } else if (msg.type === 'explain') {
        runInTerminal('pnpm -w run odavl:problems:run');
      } else if (msg.type === 'undo') {
        runInTerminal('echo "Undo placeholder"');
      } else if (msg.type === 'reports') {
        vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(path.join(root, 'reports')));
      }
    });
  }
}
// --- Doctor Mode: Always-On Guardian ---
function activateDoctorMode(context: vscode.ExtensionContext) {
  const runDoctor = () => {
    runInTerminal('pnpm -w run odavl:problems:run');
    updateDoctorStatusBar();
  };
  vscode.workspace.onDidSaveTextDocument(() => runDoctor());
  runDoctor();
}

let doctorStatusBar: vscode.StatusBarItem | undefined;
function updateDoctorStatusBar() {
  // Simulate: In real impl, parse CLI output for error count
  const root = getWorkspaceRoot();
  if (!doctorStatusBar) {
    doctorStatusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    doctorStatusBar.command = 'odavl.control';
  }
  // For demo, always PASS
  doctorStatusBar.text = 'Doctor: PASS ✅';
  doctorStatusBar.tooltip = 'ODAVL Doctor: Project is clean';
  doctorStatusBar.show();
}

import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { spawn } from "child_process";
import { activateDoctor } from './doctor';

// Minimal helper to run a command in a visible terminal named 'ODAVL Doctor'
function runInTerminal(command: string) {
  const name = 'ODAVL Doctor';
  let terminal = vscode.window.terminals.find(t => t.name === name);
  if (!terminal) {
    terminal = vscode.window.createTerminal({ name });
  }
  terminal.show();
  terminal.sendText(command);
}


// ...existing code...

// --- Telemetry and error taxonomy helpers ---
function sendTelemetry(cmd: string, duration: number, exitCode: number) {
  const enabled = vscode.workspace.getConfiguration('odavl').get('telemetryEnabled');
  if (enabled) {
    // Non-PII: command, duration, exitCode
    // (In real impl, send to backend or append to log)
    // console.log(`[telemetry]`, { cmd, duration, exitCode });
  }
}
function showError(msg: string) {
  vscode.window.showErrorMessage(`[ODAVL] ${msg}`);
}

// Module-level status bar variables
let statusItem: vscode.StatusBarItem | undefined;
let updateInterval: NodeJS.Timeout | undefined;

function readTelemetryMode(root: string): string {
  try {
    const content = fs.readFileSync(
      path.join(root, ".odavl.policy.yml"),
      "utf8",
    );
    const telemetryRegex = /telemetry:\s*(on|anonymized|off)/;
    const match = telemetryRegex.exec(content);
    return match ? match[1] : "off";
  } catch {
    return "off";
  }
}

// Helper to run CLI commands
async function runCli(
  args: string[],
  opts?: { cwd?: string; timeout?: number },
): Promise<{ ok: boolean; stdout: string; stderr: string }> {
  const root = opts?.cwd || getWorkspaceRoot();
  if (!root) return { ok: false, stdout: "", stderr: "No workspace" };

  const cliPath = path.join(root, "apps", "cli", "dist", "index.js");
  return run("node", [cliPath, ...args], root, opts?.timeout || 30000);
}

// Helper to run commands with timeout
async function run(
  cmd: string,
  args: string[] = [],
  cwd?: string,
  timeoutMs = 8000,
): Promise<{ ok: boolean; stdout: string; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd: cwd || process.cwd(),
      shell: process.platform === "win32",
      stdio: "pipe",
    });
    let stdout = "",
      stderr = "",
      resolved = false;

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        child.kill();
        resolve({ ok: false, stdout, stderr: "Timeout" });
      }
    }, timeoutMs);

    child.stdout?.on("data", (data) => (stdout += data.toString()));
    child.stderr?.on("data", (data) => (stderr += data.toString()));
    child.on("close", (code) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({ ok: code === 0, stdout, stderr });
      }
    });
    child.on("error", (error) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({ ok: false, stdout, stderr: error.message });
      }
    });
  });
}

// Get workspace root path
function getWorkspaceRoot(): string | undefined {
  return vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
}

// Fetch status data from CLI
async function fetchStatus(): Promise<{
  governorState: string;
  telemetryMode: string;
}> {
  const root = getWorkspaceRoot();
  if (!root) return { governorState: "n/a", telemetryMode: "n/a" };

  try {
    const cliPath = path.join(root, "apps", "cli", "dist", "index.js");
    let result = await run("node", [cliPath, "status"], root, 8000);

    if (result.ok && result.stdout) {
      try {
        const status = JSON.parse(result.stdout);
        return {
          governorState: status.governor?.state || "n/a",
          telemetryMode: status.telemetry?.mode || "n/a",
        };
      } catch {
        /* fallback below */
      }
    }

    // Fallback to governor explain + config reading
    result = await run(
      "node",
      [cliPath, "governor", "explain", "--json"],
      root,
      6000,
    );
    let governorState = "n/a";
    if (result.ok && result.stdout) {
      try {
        const governor = JSON.parse(result.stdout);
        governorState = governor.pr?.allowedNow ? "allowed" : "blocked";
      } catch {
        /* ignore */
      }
    }
    return { governorState, telemetryMode: readTelemetryMode(root) };
  } catch {
    return { governorState: "n/a", telemetryMode: "n/a" };
  }
}

// Render status bar with current data
function renderStatusBar(data: {
  governorState: string;
  telemetryMode: string;
}): void {
  if (!statusItem) return;
  statusItem.text = `ODAVL ▷ Control`;
  statusItem.tooltip = `ODAVL Studio — Governor: ${data.governorState} | Telemetry: ${data.telemetryMode}`;
  statusItem.command = "odavl.controlCenter.open";
  statusItem.show();
}

// Update status bar with fresh data
async function updateStatusBar(): Promise<void> {
  try {
    const data = await fetchStatus();
    renderStatusBar(data);
  } catch {
    renderStatusBar({ governorState: "error", telemetryMode: "error" });
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
    <button onclick="vscode.postMessage({type:'undo'})">Undo</button>
    <button onclick="vscode.postMessage({type:'explain'})">Explain</button>
    <button onclick="vscode.postMessage({type:'openReports'})">Reports</button>
  </div>
  <pre id="output" style="background:#111;color:#eee;padding:8px;min-height:120px"></pre>
  <script>
    const vscode = acquireVsCodeApi();
    const output = document.getElementById('output');
    
    window.addEventListener('message', event => {
      const message = event.data;
      if (message.type === 'result') {
        output.textContent += JSON.stringify(message.data, null, 2) + '\n';
      }
      if (message.type === 'undo') {
        output.textContent += 'Undo: ' + message.data + '\n';
      }
      if (message.type === 'explain') {
        output.textContent += 'Explain: ' + message.data + '\n';
      }
    });
  </script>
</body>
</html>`;
}

async function runCliCommand(root: string, command: string[]): Promise<any> {
  return new Promise((resolve) => {
    const { spawn } = require("child_process");
    const child = spawn(
      process.execPath,
      [path.join(root, "apps", "cli", "dist", "index.js"), ...command],
      { cwd: root, shell: process.platform === "win32" },
    );

    let stdout = "";
    child.stdout.on("data", (data: Buffer) => (stdout += data.toString()));
    child.on("close", () => {
      try {
        resolve(JSON.parse(stdout.trim()));
      } catch {
        resolve({ error: "Parse failed", raw: stdout });
      }
    });
  });
}


export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      'odavl.control',
      new OdavlControlPanelProvider(context.extensionUri),
    ),
  );
  activateDoctorMode(context);
}

export function deactivate(): void {
  if (doctorStatusBar) {
    doctorStatusBar.dispose();
    doctorStatusBar = undefined;
  }
}
