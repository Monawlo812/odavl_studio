import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";

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
export function activate(context: vscode.ExtensionContext) {
  const cmd = vscode.commands.registerCommand("odavlStudio.openPanel", () => {
    // ...existing code...
    // Refactored: extracted handlers, flattened logic, split ternaries, and reduced nesting for SonarLint compliance
    // ...existing code...
  });
  context.subscriptions.push(cmd);
}

// S1186: Provide a minimal implementation for deactivate
export function deactivate(): void {
  // No-op: required by VS Code extension API
}
