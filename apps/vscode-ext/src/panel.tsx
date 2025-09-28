<<<<<<< HEAD



import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ScanLine, Stethoscope, Undo2, Redo2, FileBarChart2 } from 'lucide-react';

const BUTTONS = [
  { label: 'Scan Project', command: 'scan', icon: <ScanLine size={20} />, color: 'bg-blue-600 hover:bg-blue-700' },
  { label: 'Fix Problems', command: 'fix', icon: <Stethoscope size={20} />, color: 'bg-purple-600 hover:bg-purple-700' },
  { label: 'Undo', command: 'undo', icon: <Undo2 size={20} />, color: 'bg-yellow-500 hover:bg-yellow-600 text-black' },
  { label: 'Redo', command: 'redo', icon: <Redo2 size={20} />, color: 'bg-yellow-700 hover:bg-yellow-800' },
  { label: 'Reports Viewer', command: 'reports', icon: <FileBarChart2 size={20} />, color: 'bg-green-600 hover:bg-green-700' },
];

export function OdavlPanel() {
  const [logs, setLogs] = useState<string[]>([]);
  const [doctorEvents, setDoctorEvents] = useState<{status: string, data: string}[]>([]);
  const logRef = useRef<HTMLPreElement>(null);
  useEffect(() => {
    // @ts-ignore: window is available in webview context
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'log') setLogs((prev) => [...prev, event.data.data]);
      if (event.data?.type === 'doctor') setDoctorEvents((prev) => [...prev, { status: event.data.status, data: event.data.data }]);
    };
    // @ts-ignore: window is available in webview context
    if (typeof window !== 'undefined') {
      // @ts-ignore
      window.addEventListener('message', handler);
      return () => {
        // @ts-ignore
        window.removeEventListener('message', handler);
      };
    }
    return () => {};
  }, []);
  useEffect(() => {
    if (logRef.current) {
      // @ts-ignore
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);
  const post = (command: string) => {
    // @ts-ignore: window is available in webview context
    if (typeof window !== 'undefined' && (window as any).acquireVsCodeApi) {
      // @ts-ignore
      (window as any).acquireVsCodeApi().postMessage({ command });
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-transparent">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
        {BUTTONS.map((btn) => (
          <motion.button
            key={btn.command}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.96 }}
            className={`rounded-xl shadow flex items-center gap-2 p-4 text-white font-semibold text-lg focus:outline-none transition ${btn.color}`}
            onClick={() => post(btn.command)}
          >
            {btn.icon}
            <span>{btn.label}</span>
          </motion.button>
        ))}
      </div>
      {/* Doctor Mode Timeline */}
      {doctorEvents.length > 0 && (
        <div className="flex flex-row gap-2 mt-4 max-w-2xl w-full overflow-x-auto">
          {doctorEvents.map((ev, i) => {
            let cardColor = 'bg-green-500 text-white';
            if (ev.status === 'phase') cardColor = 'bg-blue-500 text-white';
            else if (ev.status === 'error') cardColor = 'bg-red-500 text-white';
            // Use a composite key from status and data, fallback to index if not unique
            const key = `${ev.status}-${ev.data}-${i}`;
            return (
              <motion.div key={key} initial={{ scale: 0.9 }} animate={{ scale: 1 }} className={`rounded-lg px-3 py-2 min-w-[120px] text-xs font-semibold shadow transition ${cardColor}`}>
                {ev.data}
              </motion.div>
            );
          })}
        </div>
      )}
      <pre ref={logRef} className="w-full max-w-2xl h-56 mt-4 bg-gray-900 text-green-200 rounded-xl p-3 overflow-y-auto text-xs">
        {logs.join('\n')}
      </pre>
=======
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
>>>>>>> 9fe4bd7 (chore: bootstrap ODAVL Studio repository)
    </div>
  );
}
