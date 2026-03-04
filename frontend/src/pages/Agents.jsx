import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Agents = () => {
    const [agents, setAgents] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [discoverUrl, setDiscoverUrl] = useState('');
    const [delegateAgent, setDelegateAgent] = useState('');
    const [delegateMessage, setDelegateMessage] = useState('');
    const [delegateResult, setDelegateResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [agentCard, setAgentCard] = useState(null);

    useEffect(() => { fetchAgents(); fetchTasks(); fetchSelfCard(); }, []);

    const fetchAgents = async () => {
        try {
            const resp = await fetch(`${API}/api/a2a/agents`);
            const data = await resp.json();
            setAgents(data.agents || []);
        } catch (e) { console.error(e); }
    };

    const fetchTasks = async () => {
        try {
            const resp = await fetch(`${API}/api/a2a/tasks`);
            const data = await resp.json();
            setTasks(data.tasks || []);
        } catch (e) { console.error(e); }
    };

    const fetchSelfCard = async () => {
        try {
            const resp = await fetch(`${API}/.well-known/agent.json`);
            const data = await resp.json();
            setAgentCard(data);
        } catch (e) { console.error(e); }
    };

    const handleDiscover = async () => {
        if (!discoverUrl.trim()) return;
        setLoading(true);
        try {
            const resp = await fetch(`${API}/api/a2a/discover`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: discoverUrl }),
            });
            await resp.json();
            setDiscoverUrl('');
            fetchAgents();
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleDelegate = async () => {
        if (!delegateAgent || !delegateMessage) return;
        setLoading(true);
        try {
            const resp = await fetch(`${API}/api/a2a/delegate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agentUrl: delegateAgent, message: delegateMessage }),
            });
            const data = await resp.json();
            setDelegateResult(data);
            setDelegateMessage('');
            fetchTasks();
        } catch (e) { setDelegateResult({ error: e.message }); }
        setLoading(false);
    };

    const statusColor = {
        completed: 'text-green-400 bg-green-900/30',
        working: 'text-yellow-400 bg-yellow-900/30',
        failed: 'text-red-400 bg-red-900/30',
        submitted: 'text-blue-400 bg-blue-900/30',
        canceled: 'text-gray-400 bg-gray-900/30',
    };

    return (
        <div className="min-h-screen bg-dark-bg p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-neon-blue mb-2 tracking-wider">🤝 A2A AGENT NETWORK</h1>
                <p className="text-gray-400 mb-6">Agent-to-Agent Protocol — Discover and delegate tasks to remote agents</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Self Card */}
                    {agentCard && (
                        <div className="glass-panel p-6 lg:col-span-2">
                            <h2 className="text-neon-blue font-semibold text-lg mb-3 tracking-wide">YOUR AGENT CARD</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <span className="text-gray-500 text-xs">NAME</span>
                                    <p className="text-white font-bold">{agentCard.name}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-xs">VERSION</span>
                                    <p className="text-white">{agentCard.version}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-xs">PROTOCOL</span>
                                    <p className="text-white">{agentCard.protocol}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-xs">SKILLS</span>
                                    <p className="text-white">{agentCard.skills?.length} active</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {agentCard.skills?.map((s, i) => (
                                    <span key={i} className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded-full text-neon-blue text-xs">{s.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Discover Agent */}
                    <div className="glass-panel p-6">
                        <h2 className="text-neon-blue font-semibold text-lg mb-3 tracking-wide">DISCOVER AGENT</h2>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                value={discoverUrl}
                                onChange={(e) => setDiscoverUrl(e.target.value)}
                                placeholder="Agent URL (e.g. http://agent:8080)"
                                className="flex-1 bg-black/40 border border-neon-blue/30 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleDiscover}
                                disabled={loading}
                                className="px-4 py-3 bg-neon-blue/20 border border-neon-blue text-neon-blue rounded-lg font-bold hover:bg-neon-blue/30 transition-all"
                            >
                                🔍
                            </motion.button>
                        </div>

                        <div className="mt-4 space-y-2">
                            <h3 className="text-gray-400 text-sm">Connected Agents ({agents.length})</h3>
                            {agents.map((agent, i) => (
                                <div key={i} className="p-3 bg-black/40 border border-neon-blue/10 rounded-lg">
                                    <div className="flex justify-between">
                                        <span className="text-white font-medium">{agent.name}</span>
                                        <span className="text-neon-blue text-xs">{agent.skills?.length} skills</span>
                                    </div>
                                    <p className="text-gray-500 text-xs mt-1">{agent.url}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Delegate Task */}
                    <div className="glass-panel p-6">
                        <h2 className="text-neon-blue font-semibold text-lg mb-3 tracking-wide">DELEGATE TASK</h2>
                        <select
                            value={delegateAgent}
                            onChange={(e) => setDelegateAgent(e.target.value)}
                            className="w-full bg-black/40 border border-neon-blue/30 rounded-lg p-3 text-white mb-3 focus:border-neon-blue focus:outline-none"
                        >
                            <option value="">Select an agent...</option>
                            {agents.map((a, i) => (
                                <option key={i} value={a.url}>{a.name} ({a.url})</option>
                            ))}
                        </select>
                        <textarea
                            value={delegateMessage}
                            onChange={(e) => setDelegateMessage(e.target.value)}
                            placeholder="Task description for the remote agent..."
                            rows={4}
                            className="w-full bg-black/40 border border-neon-blue/30 rounded-lg p-3 text-white resize-none focus:border-neon-blue focus:outline-none mb-3"
                        />
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleDelegate}
                            disabled={loading || !delegateAgent || !delegateMessage}
                            className="w-full py-3 bg-neon-blue/20 border border-neon-blue text-neon-blue rounded-lg font-bold tracking-wider hover:bg-neon-blue/30 disabled:opacity-50 transition-all"
                        >
                            {loading ? '📡 DELEGATING...' : '🚀 DELEGATE TASK'}
                        </motion.button>

                        <AnimatePresence>
                            {delegateResult && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 p-3 bg-black/40 border border-green-500/30 rounded-lg">
                                    <pre className="text-gray-300 text-xs overflow-x-auto">{JSON.stringify(delegateResult, null, 2)}</pre>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* A2A Task History */}
                    <div className="glass-panel p-6 lg:col-span-2">
                        <h2 className="text-neon-blue font-semibold text-lg mb-3 tracking-wide">TASK HISTORY</h2>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {tasks.length === 0 && <p className="text-gray-500 text-center py-4">No A2A tasks yet</p>}
                            {tasks.map((task, i) => (
                                <div key={task._id || i} className="p-3 bg-black/40 border border-neon-blue/10 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="text-white text-sm">{task.input?.substring(0, 80)}...</p>
                                        <p className="text-gray-500 text-xs">{task.fromAgent} → {task.toAgent} • {new Date(task.createdAt).toLocaleString()}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded ${statusColor[task.status] || 'text-gray-400'}`}>
                                        {task.status?.toUpperCase()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Agents;
