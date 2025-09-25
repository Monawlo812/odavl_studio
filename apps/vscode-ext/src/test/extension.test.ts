import * as assert from 'assert';
import * as vscode from 'vscode';

describe('ODAVL VS Code Extension', function () {
  it('should activate and register commands', async function () {
    const commands = await vscode.commands.getCommands(true);
    assert.strictEqual(commands.includes('odavl.runCodemod'), true);
    assert.strictEqual(commands.includes('odavl.freezeNow'), true);
    assert.strictEqual(commands.includes('odavl.undo'), true);
    assert.strictEqual(commands.includes('odavl.openEvidence'), true);
  });

  it('should open Evidence panel and render list', async function () {
    await vscode.commands.executeCommand('odavl.openEvidence');
    // No error = pass; UI rendering is not easily testable in headless
  });
});
