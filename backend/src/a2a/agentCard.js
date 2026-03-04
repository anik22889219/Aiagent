const { getToolRegistry } = require('../tools/toolRegistry');

/**
 * Agent Card — Describes this agent's capabilities for A2A discovery
 * Served at /.well-known/agent.json
 */
function generateAgentCard() {
    const registry = getToolRegistry();
    const tools = registry.listTools();

    return {
        name: 'JARVIS',
        description: 'Advanced Autonomous AI Assistant — Iron-Man Architecture. Capable of knowledge management, tool execution, web search, code execution, and multi-agent collaboration.',
        url: process.env.AGENT_URL || 'http://localhost:5000',
        version: '1.0.0',
        protocol: 'a2a/1.0',
        capabilities: {
            streaming: true,
            pushNotifications: false,
            stateTransitionHistory: true,
        },
        skills: [
            {
                id: 'general-assistant',
                name: 'General AI Assistant',
                description: 'Answer questions, have conversations, and provide assistance on any topic.',
                tags: ['general', 'chat', 'assistant'],
            },
            {
                id: 'knowledge-management',
                name: 'Knowledge Management',
                description: 'Store, search, and retrieve information from the knowledge base. Train on documents.',
                tags: ['knowledge', 'memory', 'training', 'search'],
            },
            {
                id: 'tool-execution',
                name: 'Tool Execution',
                description: `Execute ${tools.length} integrated tools including: ${tools.map(t => t.name).join(', ')}`,
                tags: ['tools', 'automation', 'execution'],
            },
            {
                id: 'code-execution',
                name: 'Code Execution',
                description: 'Execute JavaScript code in a sandboxed environment.',
                tags: ['code', 'javascript', 'execution'],
            },
            {
                id: 'web-research',
                name: 'Web Research',
                description: 'Search the internet and fetch data from URLs.',
                tags: ['web', 'search', 'research'],
            },
        ],
        authentication: {
            type: 'none',
        },
        defaultInputModes: ['text'],
        defaultOutputModes: ['text'],
    };
}

function setupAgentCardEndpoint(app) {
    app.get('/.well-known/agent.json', (req, res) => {
        res.json(generateAgentCard());
    });
    console.log('[A2A] Agent Card endpoint registered at /.well-known/agent.json');
}

module.exports = { generateAgentCard, setupAgentCardEndpoint };
