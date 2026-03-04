import React, { useState, useEffect } from 'react';
import Avatar from '../components/Avatar';
import useJarvisVoice from '../hooks/useJarvisVoice';
import ChatWindow from '../components/ChatWindow';
import { TopBar, StatusCard, ChatInput } from '../components/HUD';
import { motion } from 'framer-motion';
import { useSocket } from '../hooks/useSocket';

export default function Dashboard() {
  const { isListening, isSpeaking, transcript, startListening, speak, setTranscript } = useJarvisVoice();
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', text: 'Welcome back, Sir. All systems are operational. How can I assist you today?' }
  ]);
  const [inputText, setInputText] = useState('');

  // Connect to AI Socket Namespace
  const aiSocket = useSocket('/api/ai', {
    'response': (data) => {
      setMessages(prev => [...prev, data]);
      speak(data.text);
    },
    'error': (err) => {
      console.error('AI Socket Error:', err);
    }
  });

  // Handle voice transcript updates
  useEffect(() => {
    if (transcript) {
      handleSendMessage(transcript);
      setTranscript('');
    }
  }, [transcript]);

  const handleSendMessage = (text) => {
    const userText = text || inputText;
    if (!userText.trim()) return;

    // Add user message to UI
    const newMessage = { id: Date.now(), role: 'user', text: userText };
    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    // Send to backend via Socket
    if (aiSocket) {
      aiSocket.emit('message', { text: userText, sessionId: 'default' });
    }
  };

  return (
    <div className="fixed inset-0 bg-dark-bg flex flex-col overflow-hidden">
      {/* Background HUD Layers */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-jarvis-glow rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-jarvis-plasma rounded-full blur-[120px] opacity-30" />
      </div>

      <TopBar />

      <main className="flex-1 relative flex flex-col md:flex-row p-6 gap-6 overflow-hidden">
        {/* Left: Chat Window */}
        <div className="w-full md:w-1/3 h-1/2 md:h-full z-10">
          <ChatWindow messages={messages} />
        </div>

        {/* Center: 3D Avatar */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <Avatar isSpeaking={isSpeaking} isListening={isListening} />

          {/* Diagnostic Stats Overlay */}
          <div className="absolute top-10 right-10 flex flex-col gap-4 opacity-70 scale-90 md:scale-100 origin-top-right">
            <StatusCard title="Core Temp" value="42" unit="°C" trend={45} />
            <StatusCard title="Network Latency" value="18" unit="ms" trend={20} />
          </div>

          <div className="absolute bottom-10 left-10 flex flex-col gap-4 opacity-70 scale-90 md:scale-100 origin-bottom-left">
            <StatusCard title="Battery" value="98" unit="%" trend={98} />
          </div>
        </div>
      </main>

      {/* Bottom: Input Bar */}
      <ChatInput
        value={inputText}
        onChange={setInputText}
        onSend={() => handleSendMessage()}
        onMicStart={startListening}
        isListening={isListening}
      />

      {/* Futuristic Floating HUD Elements */}
      <div className="absolute bottom-24 right-10 hidden md:block">
        <div className="w-24 h-24 border-2 border-jarvis-glow border-dashed rounded-full animate-spin-slow opacity-20" />
      </div>
    </div>
  );
}
