import React from 'react';
import AgentStatus from '../components/AgentStatus';
import HealthMetrics from '../components/HealthMetrics';
import LiveLog from '../components/LiveLog';

export default function Dashboard() {
  return (
    <div className="p-8 space-y-6">
      <nav className="mb-6">
        <a href="/" className="mr-4 text-neon-blue">Dashboard</a>
        <a href="/tasks" className="mr-4 text-neon-blue">Tasks</a>
      </nav>
      <h1 className="text-3xl mb-4">Eker AI Control Center</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AgentStatus />
        <HealthMetrics />
        <LiveLog />
      </div>
    </div>
  );
}
