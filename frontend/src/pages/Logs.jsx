import React, { useState, useEffect } from 'react';
import api from '../utils/api';

export default function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get('/api/system/logs').then((r) => setLogs(r.data)).catch(() => {});
  }, []);

  return (
    <div className="p-8">
      <nav className="mb-6">
        <a href="/" className="mr-4 text-neon-blue">Dashboard</a>
        <a href="/tasks" className="mr-4 text-neon-blue">Tasks</a>
        <a href="/memory" className="mr-4 text-neon-blue">Memory</a>
        <a href="/analytics" className="mr-4 text-neon-blue">Analytics</a>
        <a href="/logs" className="mr-4 text-neon-blue">Logs</a>
      </nav>
      <h2 className="text-2xl mb-4">System Logs</h2>
      <ul>
        {logs.map((l) => (
          <li key={l._id} className="mb-2 p-2 bg-gray-800 rounded">
            <span className={l.level === 'error' ? 'text-red-400' : ''}>[{new Date(l.timestamp).toLocaleTimeString()}]</span> {l.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
