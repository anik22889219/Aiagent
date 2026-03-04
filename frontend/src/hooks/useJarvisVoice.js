import { useState, useCallback, useEffect } from 'react';

const useJarvisVoice = () => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');

    const recognition = window.SpeechRecognition || window.webkitSpeechRecognition
        ? new (window.SpeechRecognition || window.webkitSpeechRecognition)()
        : null;

    if (recognition) {
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
    }

    const startListening = useCallback(() => {
        if (!recognition) {
            console.error('Speech recognition not supported');
            return;
        }
        try {
            recognition.start();
            setIsListening(true);
        } catch (e) {
            console.error('Recognition error:', e);
        }
    }, [recognition]);

    const stopListening = useCallback(() => {
        if (recognition) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition]);

    useEffect(() => {
        if (!recognition) return;

        recognition.onresult = (event) => {
            const current = event.resultIndex;
            const text = event.results[current][0].transcript;
            setTranscript(text);
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
    }, [recognition]);

    const speak = useCallback((text) => {
        if (!('speechSynthesis' in window)) {
            console.error('Speech synthesis not supported');
            return;
        }

        // Cancel any current speaking
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);

        // Choose a robotic/deep voice if available
        const voices = window.speechSynthesis.getVoices();
        const jarvisVoice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('Samantha'));
        if (jarvisVoice) utterance.voice = jarvisVoice;

        utterance.pitch = 0.9;
        utterance.rate = 1.0;

        window.speechSynthesis.speak(utterance);
    }, []);

    return { isListening, isSpeaking, transcript, startListening, stopListening, speak, setTranscript };
};

export default useJarvisVoice;
