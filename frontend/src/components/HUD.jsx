import React from 'react';
import { motion } from 'framer-motion';

export const TopBar = ({ status = "ACTIVE", cpu = "12%", memory = "45%" }) => (
    <div className="flex justify-between items-center p-4 border-b border-hologram-cyan border-opacity-20 bg-glass-bg backdrop-blur-lg z-50">
        <div className="flex items-center gap-4">
            <div className="w-10 h-10 border-2 border-jarvis-glow rounded-full flex items-center justify-center neon-glow animate-spin-slow">
                <div className="w-4 h-4 bg-jarvis-glow rounded-sm" />
            </div>
            <div>
                <h1 className="hud-text text-xl">JARVIS</h1>
                <p className="text-[10px] opacity-50 tracking-tighter">MARK VIII INTERFACE</p>
            </div>
        </div>

        <div className="hidden md:flex gap-8 items-center h-full">
            <div className="text-right">
                <p className="text-[10px] opacity-50 uppercase">System Status</p>
                <p className={`text-sm hud-text ${status === 'ACTIVE' ? 'text-jarvis-glow' : 'text-red-500'}`}>{status}</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] opacity-50 uppercase">CPU Load</p>
                <p className="text-sm hud-text">{cpu}</p>
            </div>
            <div className="text-right">
                <p className="text-[10px] opacity-50 uppercase">Memory</p>
                <p className="text-sm hud-text">{memory}</p>
            </div>
        </div>

        <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-jarvis-glow animate-pulse" />
            <div className="w-2 h-2 rounded-full bg-jarvis-glow opacity-40" />
            <div className="w-2 h-2 rounded-full bg-jarvis-glow opacity-20" />
        </div>
    </div>
);

export const StatusCard = ({ title, value, unit, trend }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className="p-4 glass-panel border-opacity-30 flex flex-col justify-between h-32"
    >
        <p className="text-[10px] opacity-50 uppercase tracking-widest">{title}</p>
        <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-light text-white">{value}</h2>
            <span className="text-xs text-jarvis-glow opacity-70">{unit}</span>
        </div>
        <div className="h-1 bg-dark-bg rounded-full overflow-hidden mt-2">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: trend + '%' }}
                className="h-full bg-jarvis-glow shadow-[0_0_10px_#00f0ff]"
            />
        </div>
    </motion.div>
);

export const ChatInput = ({ onSend, onMicStart, isListening, value, onChange }) => (
    <div className="p-4 bg-dark-bg border-t border-hologram-cyan border-opacity-20 z-50">
        <div className="max-w-4xl mx-auto flex gap-4 items-center">
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onMicStart}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isListening
                        ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                        : 'bg-jarvis-glow bg-opacity-10 border border-jarvis-glow text-jarvis-glow'
                    }`}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
            </motion.button>

            <div className="flex-1 relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onSend()}
                    placeholder="Awaiting Command..."
                    className="w-full bg-glass-bg border border-hologram-cyan border-opacity-30 rounded-full px-6 py-3 text-white placeholder-neon-blue placeholder-opacity-30 focus:outline-none focus:border-opacity-100 transition-all font-light"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                    <div className="w-1 h-4 bg-jarvis-glow opacity-20" />
                    <div className="w-1 h-3 bg-jarvis-glow opacity-40" />
                    <div className="w-1 h-5 bg-jarvis-glow opacity-60" />
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSend}
                className="px-8 py-3 bg-jarvis-glow text-dark-bg font-bold rounded-full hud-text hover:shadow-[0_0_20px_#00f0ff] transition-all"
            >
                Execute
            </motion.button>
        </div>
    </div>
);
