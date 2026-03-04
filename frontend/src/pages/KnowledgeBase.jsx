import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const KnowledgeBase = () => {
    const [entries, setEntries] = useState([]);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState(null);
    const [topics, setTopics] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [searching, setSearching] = useState(false);

    useEffect(() => { fetchEntries(); fetchTopics(); }, [page]);

    const fetchEntries = async () => {
        try {
            const resp = await fetch(`${API}/api/knowledge?page=${page}&limit=15`);
            const data = await resp.json();
            setEntries(data.entries || []);
            setTotal(data.total || 0);
        } catch (e) { console.error(e); }
    };

    const fetchTopics = async () => {
        try {
            const resp = await fetch(`${API}/api/knowledge/topics`);
            const data = await resp.json();
            setTopics(data.topics || []);
        } catch (e) { console.error(e); }
    };

    const handleSearch = async () => {
        if (!query.trim()) return;
        setSearching(true);
        try {
            const resp = await fetch(`${API}/api/knowledge/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, limit: 10 }),
            });
            const data = await resp.json();
            setSearchResults(data);
        } catch (e) { console.error(e); }
        setSearching(false);
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`${API}/api/knowledge/${id}`, { method: 'DELETE' });
            fetchEntries();
        } catch (e) { console.error(e); }
    };

    return (
        <div className="min-h-screen bg-dark-bg p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-neon-blue mb-2 tracking-wider">💾 KNOWLEDGE BASE</h1>
                <p className="text-gray-400 mb-6">{total} entries across {topics.length} topics</p>

                {/* Semantic Search */}
                <div className="glass-panel p-4 mb-6">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Semantic search... Ask anything about stored knowledge"
                            className="flex-1 bg-black/40 border border-neon-blue/30 rounded-lg p-3 text-white focus:border-neon-blue focus:outline-none"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleSearch}
                            disabled={searching}
                            className="px-6 py-3 bg-neon-blue/20 border border-neon-blue text-neon-blue rounded-lg font-bold tracking-wider hover:bg-neon-blue/30 transition-all"
                        >
                            {searching ? '🔍...' : '🔍 SEARCH'}
                        </motion.button>
                    </div>

                    <AnimatePresence>
                        {searchResults && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 space-y-2"
                            >
                                <p className="text-neon-blue text-sm font-semibold">{searchResults.count} results for "{searchResults.query}"</p>
                                {searchResults.results?.map((r, i) => (
                                    <div key={i} className="p-3 bg-black/40 border border-neon-blue/10 rounded-lg">
                                        <div className="flex justify-between">
                                            <span className="text-white font-medium">{r.title}</span>
                                            <span className="text-neon-blue text-sm">{(r.score * 100).toFixed(0)}% match</span>
                                        </div>
                                        <p className="text-gray-400 text-sm mt-1 line-clamp-2">{r.content}</p>
                                        <span className="text-xs text-gray-500">{r.source} • {r.category}</span>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Topics */}
                {topics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {topics.slice(0, 15).map((t, i) => (
                            <span key={i} className="px-3 py-1 bg-neon-blue/10 border border-neon-blue/30 rounded-full text-neon-blue text-sm">
                                {t}
                            </span>
                        ))}
                    </div>
                )}

                {/* Knowledge Entries */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {entries.map((entry, i) => (
                        <motion.div
                            key={entry._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="glass-panel p-4"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-white font-medium text-sm">{entry.topic}</h3>
                                <button onClick={() => handleDelete(entry._id)} className="text-red-400/50 hover:text-red-400 text-xs transition-colors">✕</button>
                            </div>
                            <p className="text-gray-400 text-xs line-clamp-3 mb-2">{entry.content}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-xs px-2 py-0.5 bg-neon-blue/10 text-neon-blue rounded">{entry.category}</span>
                                <span className="text-gray-500 text-xs">{entry.source}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                {total > 15 && (
                    <div className="flex justify-center gap-3 mt-6">
                        <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded disabled:opacity-30">← Prev</button>
                        <span className="text-gray-400 py-2">Page {page}</span>
                        <button onClick={() => setPage(p => p + 1)} className="px-4 py-2 bg-neon-blue/10 border border-neon-blue/30 text-neon-blue rounded">Next →</button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default KnowledgeBase;
