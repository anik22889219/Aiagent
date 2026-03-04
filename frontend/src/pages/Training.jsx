import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Training = () => {
    const [content, setContent] = useState('');
    const [topic, setTopic] = useState('');
    const [category, setCategory] = useState('training');
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    useEffect(() => { fetchSessions(); }, []);

    const fetchSessions = async () => {
        try {
            const resp = await fetch(`${API}/api/knowledge/sessions`);
            const data = await resp.json();
            setSessions(data || []);
        } catch (e) { console.error(e); }
    };

    const handleTrain = async () => {
        if (!content.trim()) return;
        setLoading(true);
        setResult(null);
        try {
            const resp = await fetch(`${API}/api/knowledge/train`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, topic: topic || 'General', category, sessionName: topic || `Training ${Date.now()}` }),
            });
            const data = await resp.json();
            setResult(data);
            setContent('');
            setTopic('');
            fetchSessions();
        } catch (e) { setResult({ message: 'Training failed: ' + e.message }); }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-dark-bg p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-neon-blue mb-2 tracking-wider">🧠 AGENT TRAINING</h1>
                <p className="text-gray-400 mb-8">Feed documents and knowledge to train the AI agent</p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Training Input */}
                    <div className="glass-panel p-6">
                        <h2 className="text-neon-blue font-semibold text-lg mb-4 tracking-wide">TRAINING DATA INPUT</h2>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Topic / Title..."
                            className="w-full bg-black/40 border border-neon-blue/30 rounded-lg p-3 text-white mb-3 focus:border-neon-blue focus:outline-none transition-colors"
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full bg-black/40 border border-neon-blue/30 rounded-lg p-3 text-white mb-3 focus:border-neon-blue focus:outline-none"
                        >
                            <option value="training">Training</option>
                            <option value="technical">Technical</option>
                            <option value="business">Business</option>
                            <option value="personal">Personal</option>
                            <option value="general">General</option>
                        </select>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Paste training content here... (documents, facts, Q&A, articles)"
                            rows={12}
                            className="w-full bg-black/40 border border-neon-blue/30 rounded-lg p-3 text-white resize-none focus:border-neon-blue focus:outline-none transition-colors"
                        />
                        <div className="flex items-center justify-between mt-4">
                            <span className="text-gray-500 text-sm">{content.length} characters</span>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleTrain}
                                disabled={loading || !content.trim()}
                                className="px-6 py-3 bg-neon-blue/20 border border-neon-blue text-neon-blue rounded-lg font-bold tracking-wider hover:bg-neon-blue/30 disabled:opacity-50 transition-all"
                            >
                                {loading ? '⚡ PROCESSING...' : '🚀 TRAIN AGENT'}
                            </motion.button>
                        </div>

                        <AnimatePresence>
                            {result && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="mt-4 p-4 bg-green-900/30 border border-green-500/50 rounded-lg text-green-400"
                                >
                                    ✅ {result.message}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Training History */}
                    <div className="glass-panel p-6">
                        <h2 className="text-neon-blue font-semibold text-lg mb-4 tracking-wide">TRAINING SESSIONS</h2>
                        <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                            {sessions.length === 0 && (
                                <p className="text-gray-500 text-center py-8">No training sessions yet. Feed the agent some knowledge!</p>
                            )}
                            {sessions.map((s, i) => (
                                <motion.div
                                    key={s._id || i}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="p-4 bg-black/40 border border-neon-blue/20 rounded-lg"
                                >
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-white font-medium">{s.sessionName}</h3>
                                        <span className={`text-xs px-2 py-1 rounded ${s.status === 'completed' ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                                            {s.status?.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm mt-1">
                                        {s.knowledgeCreated} entries • {s.chunksProcessed} chunks
                                    </p>
                                    <p className="text-gray-500 text-xs mt-1">
                                        {new Date(s.createdAt).toLocaleString()}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Training;
