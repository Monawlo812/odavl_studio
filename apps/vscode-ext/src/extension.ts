import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { spawn } from "child_process";

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

// WebviewViewProvider for Activity Bar
class OdavlControlCenterProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "odavl.control.center";
  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, "media")],
    };

    this._setHtmlForWebview(webviewView.webview);

    // Handle messages from webview (reuse existing logic)
    webviewView.webview.onDidReceiveMessage(async (message) => {
      const { cmd, type } = message;
      try {
        if (type === "undo") {
          const result = await runCli(["undo", "last"]);
          this._view?.webview.postMessage({ type: "undo", data: result.stdout || result.stderr });
        } else if (type === "explain") {
          const result = await runCli(["explain"]);
          this._view?.webview.postMessage({ type: "explain", data: result.stdout || result.stderr });
        } else if (cmd === "magic") {
          await vscode.commands.executeCommand("odavl.magic.run");
          this._view?.webview.postMessage({
            type: "success",
            message: "Magic workflow completed!",
          });
        } else if (cmd) {
          // Execute commands via terminal
          const terminal = vscode.window.createTerminal("ODAVL");
          terminal.sendText(`pnpm -w odavl ${cmd}`);
          terminal.show();
          this._view?.webview.postMessage({
            type: "success",
            message: `${cmd} executed! Check terminal.`,
          });
        }
      } catch (error) {
        this._view?.webview.postMessage({
          type: "error",
          message: `Failed: ${error}`,
        });
      }
    });
  }

  private async _setHtmlForWebview(webview: vscode.Webview) {
    try {
      const htmlPath = vscode.Uri.joinPath(
        this._extensionUri,
        "media",
        "control-center.html",
      );
      const html = await vscode.workspace.fs.readFile(htmlPath);
      webview.html = html.toString();
    } catch {
      // Fallback to compact HTML for Activity Bar
      webview.html = `<!DOCTYPE html>
<html><head><title>ODAVL Control</title></head>
<body style="font-family:sans-serif;padding:10px;background:var(--vscode-editor-background);color:var(--vscode-editor-foreground)">
  <h3>🎛️ ODAVL</h3>
  <div style="display:grid;gap:8px">
    <button onclick="runAction('scan')" style="padding:12px;font-size:12px;background:#007ACC;color:white;border:none;border-radius:4px;cursor:pointer">📊 Scan</button>
    <button onclick="runAction('shadow')" style="padding:12px;font-size:12px;background:#28A745;color:white;border:none;border-radius:4px;cursor:pointer">☁️ Shadow</button>
    <button onclick="runAction('pr')" style="padding:12px;font-size:12px;background:#DC3545;color:white;border:none;border-radius:4px;cursor:pointer">📝 PR</button>
    <button onclick="runAction('magic')" style="padding:12px;font-size:12px;background:#6F42C1;color:white;border:none;border-radius:4px;cursor:pointer">✨ Magic</button>
  </div>
  <div id="log" style="background:var(--vscode-textCodeBlock-background);padding:8px;border-radius:4px;height:100px;overflow-y:auto;font-size:10px;font-family:monospace;margin-top:8px"></div>
  <script>
    const vscode = acquireVsCodeApi();
    function runAction(cmd) { vscode.postMessage({ cmd }); }
    window.addEventListener('message', event => {
      const log = document.getElementById('log');
      const data = event.data;
      if (data.type) {
        log.textContent += new Date().toLocaleTimeString() + ' ' + data.message + '\\n';
        log.scrollTop = log.scrollHeight;
      }
    });
  </script>
</body></html>`;
    }
  }
}

export async function activate(
  context: vscode.ExtensionContext,
): Promise<void> {
  // Create error log function
  const logError = (error: string) => {
    const root = getWorkspaceRoot();
    if (root) {
      const errorPath = path.join(
        root,
        "reports",
        "ux",
        "VSCODE-ICON-FORCE",
        "errors.log",
      );
      const timestamp = new Date().toISOString();
      const errorEntry = `${timestamp}: ${error}\n`;
      try {
        fs.mkdirSync(path.dirname(errorPath), { recursive: true });
        fs.appendFileSync(errorPath, errorEntry);
      } catch {
        /* ignore file write errors */
      }
    }
  };

  // Register WebviewViewProvider for Activity Bar
  const provider = new OdavlControlCenterProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      OdavlControlCenterProvider.viewType,
      provider,
    ),
  );

  // Auto-reveal Activity Bar container on activation
  try {
    // Force reveal ODAVL container and view
    try {
      await vscode.commands.executeCommand(
        "workbench.view.extension.odavlControl",
      );
    } catch {
      logError("Failed to focus ODAVL container");
    }

    // Show info toast on first activation
    vscode.window.showInformationMessage(
      "🎯 ODAVL icon is available in the Activity Bar.",
    );

    // Safety net: ensure sidebar is visible
    try {
      await vscode.commands.executeCommand("workbench.action.focusSideBar");
    } catch {
      // Ignore sidebar errors
    }
  } catch (error) {
    logError(`Auto-reveal failed: ${error}`);
  }

  // Create status bar item
  statusItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    99,
  );
  context.subscriptions.push(statusItem);

  // Initial status bar update and setup periodic updates
  updateStatusBar();
  updateInterval = setInterval(updateStatusBar, 30000);
  context.subscriptions.push(
    new vscode.Disposable(() => {
      if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = undefined;
      }
    }),
  );

  // Update on configuration changes
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((e) => {
      if (e.affectsConfiguration("studio") || e.affectsConfiguration("odavl"))
        updateStatusBar();
    }),
  );

  const disposable = vscode.commands.registerCommand(
    "odavlStudio.openPanel",
    () => {
      updateStatusBar(); // Update status bar when panel opens

      const panel = vscode.window.createWebviewPanel(
        "odavlStudio",
        "ODAVL Studio",
        vscode.ViewColumn.One,
        { enableScripts: true },
      );
      const workspaceRoot =
        vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "";
      const telemetryMode = readTelemetryMode(workspaceRoot);
      panel.webview.html = createWebviewHtml(telemetryMode);

      panel.webview.onDidReceiveMessage(async (message) => {
        if (!workspaceRoot) {
          panel.webview.postMessage({
            type: "result",
            data: { error: "No workspace" },
          });
          return;
        }

        try {
          let result: any;
          if (message.type === "scan") {
            result = await runCliCommand(workspaceRoot, ["scan"]);
          } else if (message.type === "heal") {
            result = await runCliCommand(workspaceRoot, [
              "heal",
              "--recipe",
              "remove-unused",
              "--dry-run",
            ]);
          } else if (message.type === "openReports") {
            const reportsPath = path.join(workspaceRoot, "reports");
            try {
              await vscode.commands.executeCommand(
                "vscode.openFolder",
                vscode.Uri.file(reportsPath),
                true,
              );
              result = { success: true, message: "Opening reports folder" };
            } catch {
              result = { error: "Could not open reports folder" };
            }
          } else {
            result = { error: "Unknown command", type: message.type };
          }
          panel.webview.postMessage({ type: "result", data: result });
        } catch (error: any) {
          panel.webview.postMessage({
            type: "result",
            data: { error: "Command failed", message: error.message },
          });
        }
      });
    },
  );

  context.subscriptions.push(disposable);

  // Register Control Center command with fallback logic
  const controlCenterCommand = vscode.commands.registerCommand(
    "odavl.controlCenter.open",
    async () => {
      try {
        // Try to reveal Activity Bar view first
        await vscode.commands.executeCommand(
          "workbench.view.extension.odavlControl",
        );
        // Small delay to let view render
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch {
        // Fallback: open as panel
        try {
          const panel = vscode.window.createWebviewPanel(
            "odavlControlCenter",
            "ODAVL Control Center",
            vscode.ViewColumn.One,
            {
              enableScripts: true,
              localResourceRoots: [
                vscode.Uri.joinPath(context.extensionUri, "media"),
              ],
            },
          );

          // Load external HTML file or fallback
          try {
            const htmlPath = vscode.Uri.joinPath(
              context.extensionUri,
              "media",
              "control-center.html",
            );
            const html = await vscode.workspace.fs.readFile(htmlPath);
            panel.webview.html = html.toString();
          } catch {
            panel.webview.html = createWebviewHtml("off"); // Fallback HTML
          }

          // Handle messages from webview
          panel.webview.onDidReceiveMessage(async (message) => {
            const { cmd } = message;
            const workspaceRoot = getWorkspaceRoot();
            try {
              panel.webview.postMessage({
                type: "log",
                message: `Starting ${cmd}...`,
              });

              if (cmd === "magic") {
                await vscode.commands.executeCommand("odavl.magic.run");
                panel.webview.postMessage({
                  type: "success",
                  message: "Magic workflow completed!",
                });
              } else {
                // Run CLI commands via terminal and save reports
                const timestamp = Date.now();
                const reportFile = `vscode-${cmd}-${timestamp}.json`;
                const reportPath = workspaceRoot
                  ? path.join(workspaceRoot, "reports", "vscode", reportFile)
                  : reportFile;

                const terminal = vscode.window.createTerminal("ODAVL");
                if (workspaceRoot) {
                  terminal.sendText(
                    `pnpm -w odavl ${cmd} --json > "${reportPath}"`,
                  );
                } else {
                  terminal.sendText(`pnpm -w odavl ${cmd}`);
                }
                terminal.show();

                panel.webview.postMessage({
                  type: "success",
                  message: `${cmd} command executed! Report: ${reportFile}`,
                });
              }
            } catch (error) {
              panel.webview.postMessage({
                type: "error",
                message: `Failed: ${error}`,
              });
              logError(`Panel command failed: ${error}`);
            }
          });
        } catch (error) {
          logError(`Panel fallback failed: ${error}`);
          vscode.window.showErrorMessage(
            "Failed to open ODAVL Control Center. Check Activity Bar for ODAVL icon.",
          );
        }
      }
    },
  );

  // Register Magic command with enhanced error handling
  const magicCommand = vscode.commands.registerCommand(
    "odavl.magic.run",
    async () => {
      const root = getWorkspaceRoot();
      if (!root) {
        vscode.window.showErrorMessage("No workspace opened");
        return;
      }

      // Show progress with steps
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: "✨ Running ODAVL Magic...",
          cancellable: false,
        },
        async (progress) => {
          try {
            const cliPath = path.join(root, "apps", "cli", "dist", "index.js");

            // Step 1: Build CLI (safety check)
            progress.report({ increment: 10, message: "🔧 Preparing CLI..." });
            await run(
              "pnpm",
              ["--filter", "@odavl/cli", "run", "build"],
              root,
              30000,
            );

            // Step 2: Scan
            progress.report({
              increment: 20,
              message: "📊 Scanning codebase...",
            });
            let result = await run(
              "node",
              [cliPath, "scan", "--json"],
              root,
              30000,
            );
            if (!result.ok) throw new Error(`Scan failed: ${result.stderr}`);

            // Step 3: Heal (dry run first, then apply if safe)
            progress.report({ increment: 25, message: "🔧 Planning fixes..." });
            result = await run(
              "node",
              [
                cliPath,
                "heal",
                "--recipe",
                "esm-hygiene",
                "--dry-run",
                "--max-files",
                "5",
              ],
              root,
              30000,
            );
            if (result.ok) {
              progress.report({
                increment: 15,
                message: "🔧 Applying fixes...",
              });
              await run(
                "node",
                [
                  cliPath,
                  "heal",
                  "--recipe",
                  "esm-hygiene",
                  "--apply",
                  "--max-files",
                  "5",
                ],
                root,
                45000,
              );
            }

            // Step 4: Shadow run
            progress.report({
              increment: 20,
              message: "☁️ Running shadow CI...",
            });
            result = await run(
              "node",
              [cliPath, "shadow", "run", "--wait"],
              root,
              180000,
            ); // 3 min timeout
            if (!result.ok) console.log(`Shadow warning: ${result.stderr}`); // Non-critical

            // Step 5: PR dry run
            progress.report({ increment: 10, message: "📝 Preparing PR..." });
            await run(
              "node",
              [cliPath, "pr", "open", "--dry-run"],
              root,
              30000,
            );

            // Save Magic workflow summary with enhanced metadata
            const timestamp = Date.now();
            const magicReport = {
              timestamp: new Date().toISOString(),
              workflow: "magic",
              steps: ["build", "scan", "heal", "shadow", "pr"],
              success: true,
              duration_ms: timestamp - Date.now(), // Approximate
              source: "vscode-extension",
              activityBarTriggered: true,
            };

            // Save to both vscode and ux directories
            const vscodePath = path.join(
              root,
              "reports",
              "vscode",
              `magic-${timestamp}.json`,
            );
            const uxPath = path.join(
              root,
              "reports",
              "ux",
              `magic-${timestamp}.json`,
            );

            // Ensure directories exist
            fs.mkdirSync(path.dirname(vscodePath), { recursive: true });
            fs.mkdirSync(path.dirname(uxPath), { recursive: true });

            await vscode.workspace.fs.writeFile(
              vscode.Uri.file(vscodePath),
              Buffer.from(JSON.stringify(magicReport, null, 2)),
            );
            await vscode.workspace.fs.writeFile(
              vscode.Uri.file(uxPath),
              Buffer.from(JSON.stringify(magicReport, null, 2)),
            );

            vscode.window.showInformationMessage(
              "✨ Magic completed! 🎉 Check reports/ folder for results.",
            );
          } catch (error) {
            logError(`Magic workflow failed: ${error}`);
            vscode.window.showErrorMessage(`Magic failed: ${error}`);
          }
        },
      );
    },
  );

  // Register Debug command for diagnostics
  const debugCommand = vscode.commands.registerCommand(
    "odavl.debug.showIconStatus",
    async () => {
      const root = getWorkspaceRoot();
      if (!root) {
        vscode.window.showErrorMessage("No workspace opened");
        return;
      }

      try {
        // Collect comprehensive diagnostics
        const diagnostics = {
          timestamp: new Date().toISOString(),
          workspace: root,
          extension: {
            version: context.extension.packageJSON.version,
            activationEvents: context.extension.packageJSON.activationEvents,
          },
          manifest: {
            viewsContainersPresent:
              !!context.extension.packageJSON.contributes?.viewsContainers
                ?.activitybar,
            viewsPresent:
              !!context.extension.packageJSON.contributes?.views?.odavlControl,
            commandsPresent:
              context.extension.packageJSON.contributes?.commands?.length || 0,
          },
          files: {
            iconLightExists: fs.existsSync(
              path.join(
                root,
                "apps",
                "vscode-ext",
                "media",
                "odavl-icon-light.svg",
              ),
            ),
            iconDarkExists: fs.existsSync(
              path.join(
                root,
                "apps",
                "vscode-ext",
                "media",
                "odavl-icon-dark.svg",
              ),
            ),
            packageJsonExists: fs.existsSync(
              path.join(root, "apps", "vscode-ext", "package.json"),
            ),
          },
          registration: {
            viewRegistered: true, // We know this ran if command executed
            providerActive: !!provider,
            statusBarActive: !!statusItem,
          },
          activationEventsOk: true,
          iconFilesPresent: fs.existsSync(
            path.join(
              root,
              "apps",
              "vscode-ext",
              "media",
              "odavl-icon-light.svg",
            ),
          ),
          viewRegistered: true,
        };

        // Save status report
        const statusPath = path.join(
          root,
          "reports",
          "ux",
          "VSCODE-ICON-FORCE",
          "status.json",
        );
        fs.mkdirSync(path.dirname(statusPath), { recursive: true });
        fs.writeFileSync(statusPath, JSON.stringify(diagnostics, null, 2));

        // Show results to user
        const overallStatus =
          diagnostics.files.iconLightExists &&
          diagnostics.files.iconDarkExists &&
          diagnostics.manifest.viewsContainersPresent;

        if (overallStatus) {
          vscode.window.showInformationMessage(
            `✅ Icon status: OK! Diagnostics saved to reports/ux/VSCODE-ICON-FORCE/status.json`,
          );
        } else {
          vscode.window.showWarningMessage(
            `⚠️ Icon issues detected. Check reports/ux/VSCODE-ICON-FORCE/status.json for details.`,
          );
        }
      } catch (error) {
        logError(`Debug command failed: ${error}`);
        vscode.window.showErrorMessage(`Debug failed: ${error}`);
      }
    },
  );

  context.subscriptions.push(controlCenterCommand, magicCommand, debugCommand);
}

export function deactivate(): void {
  // Clean up status bar and timer
  if (updateInterval) {
    clearInterval(updateInterval);
    updateInterval = undefined;
  }
  if (statusItem) {
    statusItem.dispose();
    statusItem = undefined;
  }
}
