import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function HealthMetrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    api.get('/api/system/health').then((res) => setMetrics(res.data)).catch(() => {});
  }, []);

  if (!metrics) return <div>Loading...</div>;

  const { uptime, memoryUsage, cpuLoad } = metrics;
  return (
    <div className="p-4 bg-gray-800 rounded">
      <h3 className="text-xl mb-2">System Health</h3>
      <div>Uptime: {Math.floor(uptime)}s</div>
      <div>Memory (RSS): {Math.round(memoryUsage.rss / 1024 / 1024)} MB</div>
      <div>CPU Load: {cpuLoad.map((l,i)=><span key={i}>{l.toFixed(2)} </span>)}</div>
    </div>
  );
}
