
import React, { useEffect } from 'react';


export function OdavlPanel() {
  const [guardian, setGuardian] = React.useState<any[]>([]);
  useEffect(() => {
    (globalThis as any).addEventListener('message', (e: MessageEvent) => {
      if (e.data && e.data.type === 'guardian-insights') {
        setGuardian(e.data.payload?.rules || []);
      }
    });
  }, []);

  // VS Code API
  const vscode = (globalThis as any).acquireVsCodeApi ? (globalThis as any).acquireVsCodeApi() : { postMessage: () => {} };

  const handle = (type: string) => () => {
    vscode.postMessage({ type });
  };

  return (
    <div>
      <button onClick={handle('scan')}>Scan</button>
      <button onClick={handle('heal')}>Heal</button>
      <button onClick={handle('undo')}>Undo</button>
      <button onClick={handle('explain')}>Explain</button>
      <button onClick={handle('openReports')}>Reports</button>
      <section id="guardian-insights" style={{ marginTop: 16, fontSize: 13 }}>
        <b>Guardian Insights</b>
        {guardian.length === 0 ? (
          <div>knowledge base initializing…</div>
        ) : (
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {guardian.map(r => (
              <li key={r.id}>
                {r.id}: success={r.successCount} fail={r.failCount} {r.trusted ? '(trusted)' : ''}
              </li>
            ))}
          </ul>
        )}
      </section>
      <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
        <span>Channel: Stable</span>
      </div>
    </div>
  );
}
