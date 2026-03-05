import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import Memory from './pages/Memory';
import Analytics from './pages/Analytics';
import Logs from './pages/Logs';
import Integrations from './pages/Integrations';
import Settings from './pages/Settings';
import Training from './pages/Training';
import KnowledgeBase from './pages/KnowledgeBase';
import Tools from './pages/Tools';
import Agents from './pages/Agents';
import CreatorStudio from './pages/CreatorStudio';
import LinkedinAutomation from './pages/LinkedinAutomation';

const NavBar = () => {
  const location = useLocation();
  const links = [
    { path: '/', label: '🏠 Dashboard' },
    { path: '/studio', label: '🎨 Studio' },
    { path: '/linkedin', label: '🔗 LinkedIn' },
    { path: '/training', label: '🧠 Training' },
    { path: '/knowledge', label: '💾 Knowledge' },
    { path: '/tools', label: '🔧 Tools' },
    { path: '/agents', label: '🤝 Agents' },
    { path: '/tasks', label: '📋 Tasks' },
    { path: '/memory', label: '🧬 Memory' },
    { path: '/analytics', label: '📊 Analytics' },
    { path: '/settings', label: '⚙️ Settings' },
  ];

  return (
    <nav className="bg-black/60 border-b border-neon-blue/20 backdrop-blur-lg px-4 py-2 flex items-center gap-1 overflow-x-auto custom-scrollbar">
      <span className="text-neon-blue font-bold text-lg mr-4 tracking-widest whitespace-nowrap">JARVIS</span>
      {links.map(link => (
        <Link
          key={link.path}
          to={link.path}
          className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-all ${location.pathname === link.path
            ? 'bg-neon-blue/20 text-neon-blue border border-neon-blue/50'
            : 'text-gray-400 hover:text-neon-blue hover:bg-neon-blue/10'
            }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-bg">
          <NavBar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/studio" element={<CreatorStudio />} />
            <Route path="/linkedin" element={<LinkedinAutomation />} />
            <Route path="/training" element={<Training />} />
            <Route path="/knowledge" element={<KnowledgeBase />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/memory" element={<Memory />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;