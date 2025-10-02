import * as vscode from 'vscode';

async function runInTerminal(title: string, command: string): Promise<void> {
  const term = vscode.window.terminals.find(t => t.name === title) || vscode.window.createTerminal({ name: title });
  term.show(true);
  term.sendText(command, true);
  // Lightweight UX: hint messages; exit status is not captured here by design.
  vscode.window.setStatusBarMessage(`$(history) ${title}: running...`, 3000);
}

export function registerUndoRedo(context: vscode.ExtensionContext) {
  const undo = vscode.commands.registerCommand('odavl.undoLast', async () => {
    await runInTerminal('ODAVL Undo', 'pnpm -w exec odavl undo --last || pnpm -w odavl undo --last || odavl undo last');
    vscode.window.showInformationMessage('ODAVL: requested undo of the last operation.');
  });

  const redo = vscode.commands.registerCommand('odavl.redoLast', async () => {
    await runInTerminal('ODAVL Redo', 'pnpm -w exec odavl redo --last || pnpm -w odavl redo --last || odavl redo last');
    vscode.window.showInformationMessage('ODAVL: requested redo of the last operation.');
  });

  context.subscriptions.push(undo, redo);
}
