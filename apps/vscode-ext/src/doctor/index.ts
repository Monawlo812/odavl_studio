import * as vscode from 'vscode';
import { showDoctorStatus } from './status';
import { selectDiagnostics } from './selector';
import { runBatchFix } from './runner';

let doctorEnabled = true;
let doctorTimer: NodeJS.Timeout | undefined;

export function activateDoctor(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration('odavl.doctor');
  doctorEnabled = config.get('enabled', true);
  showDoctorStatus(context, doctorEnabled);

  context.subscriptions.push(
    vscode.commands.registerCommand('odavl.doctor.toggle', () => {
      doctorEnabled = !doctorEnabled;
      showDoctorStatus(context, doctorEnabled);
      if (doctorEnabled) startLoop(); else stopLoop();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('odavl.doctor.fixNext', async () => {
      const diags = selectDiagnostics();
      if (diags.length) await runBatchFix([diags[0]], { batch: false });
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand('odavl.doctor.fixAllBatch', async () => {
      const diags = selectDiagnostics();
      if (diags.length) await runBatchFix(diags, { batch: true });
    })
  );

  // Autorun on startup if enabled
  if (config.get('autorunOnStartup', true)) {
    doctorEnabled = true;
    showDoctorStatus(context, doctorEnabled);
    setTimeout(async () => {
      const diags = selectDiagnostics();
      if (diags.length) await runBatchFix(diags, { batch: true });
    }, 1000);
  }
  if (doctorEnabled) startLoop();

  function startLoop() {
    stopLoop();
    doctorTimer = setInterval(async () => {
      if (!doctorEnabled) return;
      const diags = selectDiagnostics();
      if (diags.length) await runBatchFix(diags, { batch: false });
    }, 8000);
  }
  function stopLoop() {
    if (doctorTimer) clearInterval(doctorTimer);
    doctorTimer = undefined;
  }
}
