import React, { useState } from 'react';

export function OdavlPanel() {
  const [undoLoading, setUndoLoading] = useState(false);
  const [explainLoading, setExplainLoading] = useState(false);
  const [diff, setDiff] = useState<string | null>(null);

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
      <div style={{ marginTop: 12, fontSize: 12, color: '#888' }}>
        <span>Channel: Stable</span>
      </div>
    </div>
  );
}
