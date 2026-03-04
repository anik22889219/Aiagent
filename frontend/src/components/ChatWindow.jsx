import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ChatWindow = ({ messages }) => {
    const scrollRef = useRef();

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full glass-panel overflow-hidden border-opacity-20">
            <div className="p-4 border-b border-hologram-cyan border-opacity-30 bg-glass-bg">
                <h3 className="hud-text text-sm">Communication Log</h3>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
            >
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={msg.id || i}
                            initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20, y: 10 }}
                            animate={{ opacity: 1, x: 0, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user'
                                        ? 'bg-jarvis-plasma bg-opacity-20 border border-jarvis-plasma text-white rounded-br-none'
                                        : 'bg-jarvis-glow bg-opacity-10 border border-jarvis-glow border-opacity-30 text-neon-blue rounded-bl-none shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed">{msg.text}</p>
                                <span className="text-[10px] opacity-40 mt-1 block">
                                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ChatWindow;
