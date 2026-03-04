import React from 'react';
import { useAuth } from '../hooks/useAuth';

export default function NavBar() {
  const { user } = useAuth();
  return (
    <nav className="mb-6">
      <a href="/" className="mr-4 text-neon-blue">Dashboard</a>
      <a href="/tasks" className="mr-4 text-neon-blue">Tasks</a>
      <a href="/memory" className="mr-4 text-neon-blue">Memory</a>
      <a href="/analytics" className="mr-4 text-neon-blue">Analytics</a>
      <a href="/logs" className="mr-4 text-neon-blue">Logs</a>
      <a href="/integrations" className="mr-4 text-neon-blue">Integrations</a>
      {user && user.role === 'admin' && <a href="/settings" className="mr-4 text-neon-blue">Settings</a>}
    </nav>
  );
}
