import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useSocket } from '../hooks/useSocket';

export default function AgentStatus() {
  const [status, setStatus] = useState('idle');

  useSocket('/api/agent', {
    'agent:status_changed': (data) => setStatus(data.status),
  });

  useEffect(() => {
    api.get('/api/system/status').then((res) => setStatus(res.data.status)).catch(() => {});
  }, []);

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h3 className="text-xl mb-2">Agent Status</h3>
      <div className="text-2xl font-bold capitalize">{status}</div>
    </div>
  );
}
