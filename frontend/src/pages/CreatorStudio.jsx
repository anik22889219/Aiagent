import React, { useState } from 'react';

const API_BASE = 'http://localhost:8080/api/studio';

const CreatorStudio = () => {
    const [activeTab, setActiveTab] = useState('linkedin');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    // Form States
    const [linkedinContent, setLinkedinContent] = useState('');
    const [linkedinMediaUrl, setLinkedinMediaUrl] = useState('');

    const [imagePrompt, setImagePrompt] = useState('');
    const [imageAspectRatio, setImageAspectRatio] = useState('1:1');

    const [videoPrompt, setVideoPrompt] = useState('');
    const [videoImageUrl, setVideoImageUrl] = useState('');

    const [rechargeAmount, setRechargeAmount] = useState(10);
    const [paymentMethod, setPaymentMethod] = useState('credit_card');

    const handleAction = async (endpoint, payload) => {
        setLoading(true);
        setResult(null);
        setError(null);
        try {
            const response = await fetch(`${API_BASE}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Optional: Add Auth header if your backend requires it
                    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (!response.ok || data.status === 'error') {
                throw new Error(data.message || 'An error occurred');
            }
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'linkedin', label: '🔗 LinkedIn Post' },
        { id: 'image', label: '🎨 Image Gen' },
        { id: 'video', label: '🎬 Video Gen' },
        { id: 'recharge', label: '💳 Recharge' },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto text-gray-200">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neon-blue tracking-wide">Creator Studio</h1>
                    <p className="text-sm text-gray-400 mt-2">Automate posting, generate media, and manage credits.</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 mb-6 border-b border-neon-blue/20 pb-2 overflow-x-auto custom-scrollbar">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setResult(null); setError(null); }}
                        className={`px-4 py-2 rounded-t-lg font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'bg-neon-blue/20 text-neon-blue border-b-2 border-neon-blue'
                                : 'text-gray-400 hover:text-neon-blue hover:bg-neon-blue/5'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Input Form Section */}
                <div className="bg-black/40 border border-neon-blue/30 rounded-xl p-6 shadow-lg shadow-neon-blue/5">
                    {activeTab === 'linkedin' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-white mb-4">Create LinkedIn Post</h2>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Post Content</label>
                                <textarea
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none transition-all resize-none"
                                    rows="5"
                                    placeholder="Write your insightful post here..."
                                    value={linkedinContent}
                                    onChange={(e) => setLinkedinContent(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Media URL (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-neon-blue outline-none transition-all"
                                    placeholder="https://example.com/image.jpg"
                                    value={linkedinMediaUrl}
                                    onChange={(e) => setLinkedinMediaUrl(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => handleAction('linkedin', { content: linkedinContent, media_url: linkedinMediaUrl })}
                                disabled={loading || !linkedinContent}
                                className="w-full bg-neon-blue text-black font-bold py-2 rounded hover:bg-blue-400 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Posting...' : 'Post to LinkedIn'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'image' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-white mb-4">Generate Image</h2>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Prompt</label>
                                <textarea
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-neon-blue outline-none transition-all resize-none"
                                    rows="3"
                                    placeholder="A futuristic city cyberpunk style..."
                                    value={imagePrompt}
                                    onChange={(e) => setImagePrompt(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Aspect Ratio</label>
                                <select
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-neon-blue outline-none"
                                    value={imageAspectRatio}
                                    onChange={(e) => setImageAspectRatio(e.target.value)}
                                >
                                    <option value="1:1">1:1 Square</option>
                                    <option value="16:9">16:9 Landscape</option>
                                    <option value="9:16">9:16 Portrait</option>
                                </select>
                            </div>
                            <button
                                onClick={() => handleAction('image', { prompt: imagePrompt, aspect_ratio: imageAspectRatio })}
                                disabled={loading || !imagePrompt}
                                className="w-full bg-purple-500 text-white font-bold py-2 rounded hover:bg-purple-400 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Generating...' : 'Generate Image'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'video' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-white mb-4">Generate Video</h2>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Prompt</label>
                                <textarea
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-3 text-white focus:border-neon-blue outline-none transition-all resize-none"
                                    rows="3"
                                    placeholder="A cinematic drone shot over snowy mountains..."
                                    value={videoPrompt}
                                    onChange={(e) => setVideoPrompt(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Starting Image URL (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-neon-blue outline-none transition-all"
                                    placeholder="https://example.com/base-image.jpg"
                                    value={videoImageUrl}
                                    onChange={(e) => setVideoImageUrl(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={() => handleAction('video', { prompt: videoPrompt, image_url: videoImageUrl })}
                                disabled={loading || !videoPrompt}
                                className="w-full bg-pink-500 text-white font-bold py-2 rounded hover:bg-pink-400 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Generating...' : 'Generate Video'}
                            </button>
                        </div>
                    )}

                    {activeTab === 'recharge' && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-white mb-4">Buy Credits</h2>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
                                <input
                                    type="number"
                                    min="5"
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-neon-blue outline-none transition-all"
                                    value={rechargeAmount}
                                    onChange={(e) => setRechargeAmount(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Payment Method</label>
                                <select
                                    className="w-full bg-gray-900 border border-gray-700 rounded p-2 text-white focus:border-neon-blue outline-none"
                                    value={paymentMethod}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                >
                                    <option value="credit_card">Credit Card (**** 1234)</option>
                                    <option value="paypal">PayPal</option>
                                    <option value="crypto">Crypto Wallet</option>
                                </select>
                            </div>
                            <button
                                onClick={() => handleAction('recharge', { amount: rechargeAmount, payment_method: paymentMethod })}
                                disabled={loading || rechargeAmount <= 0}
                                className="w-full bg-green-500 text-white font-bold py-2 rounded hover:bg-green-400 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Processing...' : 'Complete Purchase'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Output Section */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 min-h-[300px] flex flex-col justify-center shadow-inner relative overflow-hidden">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
                            <div className="w-10 h-10 border-4 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {!result && !error && !loading && (
                        <div className="text-center text-gray-500 h-full flex items-center justify-center">
                            Submit an action to see results here
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {result && (
                        <div className="space-y-4 max-w-full">
                            <h3 className="font-semibold text-green-400 border-b border-green-900/50 pb-2">
                                Success
                            </h3>

                            {activeTab === 'image' && result.image_url && (
                                <div className="mt-4 break-words">
                                    <img src={result.image_url} alt="Generated" className="rounded-lg max-w-full h-auto max-h-64 object-cover mx-auto mx-w-[300px]" />
                                    <p className="text-xs text-gray-400 mt-2 truncate text-center break-all">URL: {result.image_url}</p>
                                </div>
                            )}

                            {activeTab === 'video' && result.video_url && (
                                <div className="mt-4 break-words">
                                    <a href={result.video_url} target="_blank" rel="noreferrer" className="text-blue-400 underline break-all inline-block max-w-full">
                                        Download / View Video
                                    </a>
                                    <p className="text-xs text-gray-500 mt-2">Cost: {result.cost} credits</p>
                                </div>
                            )}

                            <div className="bg-black/50 p-4 rounded text-xs font-mono text-gray-400 overflow-x-auto break-all">
                                <pre>{JSON.stringify(result, null, 2)}</pre>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CreatorStudio;
