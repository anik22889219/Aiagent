import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../hooks/useSocket';

export default function LiveLog() {
  const [entries, setEntries] = useState([]);
  const bottomRef = useRef();

  useSocket('/api/logs', {
    log: (data) => {
      setEntries((prev) => [...prev, data]);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
  });

  return (
    <div className="p-4 bg-gray-800 rounded h-64 overflow-y-auto">
      <h3 className="text-xl mb-2">Live Logs</h3>
      {entries.map((e, idx) => (
        <div key={idx} className="text-sm">
          [{new Date(e.timestamp).toLocaleTimeString()}] <span className={e.level === 'error' ? 'text-red-400' : ''}>{e.message}</span>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
