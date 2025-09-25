import * as vscode from 'vscode';

let statusBar: vscode.StatusBarItem | undefined;

export function showDoctorStatus(context: vscode.ExtensionContext, enabled: boolean) {
  if (!statusBar) {
    statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBar.command = 'odavl.doctor.toggle';
    context.subscriptions.push(statusBar);
  }
  statusBar.text = enabled ? 'Doctor: On' : 'Doctor: Off';
  statusBar.show();
}
