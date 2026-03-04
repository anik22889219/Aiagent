const { getAgentBrain } = require('../agent/agentBrain');

module.exports = (io) => {
    const aiNamespace = io.of('/api/ai');

    aiNamespace.on('connection', (socket) => {
        console.log('Client connected to AI namespace:', socket.id);
        const sessionId = socket.id;
        const brain = getAgentBrain();

        socket.on('message', async (data) => {
            const { text } = data;
            console.log(`[AI Socket] Message from ${sessionId}: ${text}`);

            try {
                // Stream handler — sends tool execution updates to client
                const onStream = (event) => {
                    socket.emit('agent_event', event);
                };

                // Process through the Agent Brain (ReAct loop)
                const result = await brain.process(text, sessionId, onStream);

                socket.emit('response', {
                    text: result.text,
                    id: Date.now(),
                    role: 'ai',
                    iterations: result.iterations,
                    usage: result.usage,
                });
            } catch (error) {
                console.error('[AI Socket] Processing Error:', error);
                socket.emit('response', {
                    text: `System alert: An error occurred during processing — ${error.message}. Running diagnostics.`,
                    id: Date.now(),
                    role: 'ai',
                });
            }
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected from AI namespace:', sessionId);
        });
    });

    return aiNamespace;
};
