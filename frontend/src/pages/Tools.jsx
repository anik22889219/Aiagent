import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Tools = () => {
    const [tools, setTools] = useState([]);
    const [selectedTool, setSelectedTool] = useState(null);
    const [testArgs, setTestArgs] = useState('{}');
    const [testResult, setTestResult] = useState(null);
    const [executing, setExecuting] = useState(false);

    useEffect(() => { fetchTools(); }, []);

    const fetchTools = async () => {
        try {
            const resp = await fetch(`${API}/api/tools`);
            const data = await resp.json();
            setTools(data.tools || []);
        } catch (e) { console.error(e); }
    };

    const handleTest = async (toolName) => {
        setExecuting(true);
        setTestResult(null);
        try {
            const args = JSON.parse(testArgs);
            const resp = await fetch(`${API}/api/tools/execute`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: toolName, args }),
            });
            const data = await resp.json();
            setTestResult(data);
        } catch (e) { setTestResult({ error: e.message }); }
        setExecuting(false);
    };

    const toolIcons = {
        calculator: '🧮', datetime: '🕐', knowledge_search: '🔍', memory_store: '💾',
        web_search: '🌐', http_request: '📡', code_executor: '⚡', github_tool: '🐙', file_manager: '📁',
    };

    return (
        <div className="min-h-screen bg-dark-bg p-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-neon-blue mb-2 tracking-wider">🔧 TOOL REGISTRY</h1>
                <p className="text-gray-400 mb-6">{tools.length} tools registered and operational</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Tool List */}
                    <div className="lg:col-span-1 space-y-3">
                        {tools.map((tool, i) => (
                            <motion.div
                                key={tool.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => { setSelectedTool(tool); setTestResult(null); setTestArgs('{}'); }}
                                className={`p-4 rounded-lg cursor-pointer transition-all ${selectedTool?.name === tool.name
                                        ? 'bg-neon-blue/20 border border-neon-blue'
                                        : 'bg-black/40 border border-neon-blue/10 hover:border-neon-blue/40'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{toolIcons[tool.name] || '🔧'}</span>
                                    <div>
                                        <h3 className="text-white font-medium text-sm">{tool.name}</h3>
                                        <p className="text-gray-400 text-xs line-clamp-1">{tool.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Tool Detail + Testing */}
                    <div className="lg:col-span-2">
                        {selectedTool ? (
                            <motion.div
                                key={selectedTool.name}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="glass-panel p-6"
                            >
                                <h2 className="text-xl text-neon-blue font-bold mb-1">{toolIcons[selectedTool.name]} {selectedTool.name}</h2>
                                <p className="text-gray-400 mb-4">{selectedTool.description}</p>

                                <h3 className="text-white font-semibold mb-2 text-sm tracking-wide">PARAMETERS</h3>
                                <div className="bg-black/40 rounded-lg p-3 mb-4">
                                    <pre className="text-gray-300 text-xs overflow-x-auto">{JSON.stringify(selectedTool.parameters, null, 2)}</pre>
                                </div>

                                <h3 className="text-white font-semibold mb-2 text-sm tracking-wide">TEST EXECUTION</h3>
                                <textarea
                                    value={testArgs}
                                    onChange={(e) => setTestArgs(e.target.value)}
                                    rows={4}
                                    placeholder='{"key": "value"}'
                                    className="w-full bg-black/40 border border-neon-blue/30 rounded-lg p-3 text-white font-mono text-sm resize-none focus:border-neon-blue focus:outline-none mb-3"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTest(selectedTool.name)}
                                    disabled={executing}
                                    className="w-full py-3 bg-neon-blue/20 border border-neon-blue text-neon-blue rounded-lg font-bold tracking-wider hover:bg-neon-blue/30 transition-all"
                                >
                                    {executing ? '⚡ EXECUTING...' : '▶ EXECUTE TOOL'}
                                </motion.button>

                                {testResult && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-4 bg-black/40 border border-green-500/30 rounded-lg p-4"
                                    >
                                        <h4 className="text-green-400 font-semibold text-sm mb-2">RESULT</h4>
                                        <pre className="text-gray-300 text-xs overflow-x-auto whitespace-pre-wrap">{JSON.stringify(testResult, null, 2)}</pre>
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            <div className="glass-panel p-12 text-center">
                                <p className="text-gray-500 text-lg">← Select a tool to inspect and test</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Tools;
