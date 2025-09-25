import React, { useState, useEffect } from 'react';

export function OdavlPanel() {
  const [undoLoading, setUndoLoading] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [diff, setDiff] = useState<string | null>(null);
  const [guardian, setGuardian] = useState<any[]>([]);
  useEffect(() => {
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'guardian-insights') {
        setGuardian(e.data.payload?.rules || []);
      }
    });
  }, []);

  // Handlers (stubbed)
  const handleUndo = async () => {
    setUndoLoading(true);
    setTimeout(() => setUndoLoading(false), 800);
  };
  const handleExplain = async () => {
    setExplainLoading(true);
    setTimeout(() => setExplainLoading(false), 800);
  };
  const handleShowDiff = () => {
    setDiff('--- before\n+++ after\n-foo\n+bar');
  };

  return (
    <div>
      <button onClick={handleUndo} disabled={undoLoading}>
        {undoLoading ? 'Undoing...' : 'Undo'}
      </button>
      <button onClick={handleExplain} disabled={explainLoading}>
        {explainLoading ? 'Explaining...' : 'Explain'}
      </button>
      <button onClick={handleShowDiff}>Show Diff</button>
      {diff && (
        <pre style={{ border: '1px solid #ccc', marginTop: 8 }}>
          {diff}
        </pre>
      )}
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
