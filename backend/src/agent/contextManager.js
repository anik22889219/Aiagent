const Memory = require('../models/Memory');

const JARVIS_SYSTEM_PROMPT = `You are JARVIS (Just A Rather Very Intelligent System), an advanced AI assistant modeled after Iron Man's personal AI.

## Personality
- Address the user as "Sir" occasionally
- Be concise, precise, and proactive
- Use technical language when appropriate
- Show confidence but acknowledge limitations
- Respond with wit and intelligence

## Capabilities
You have access to tools. When the user asks something that requires a tool, USE IT.
Do not refuse tool usage — you are an autonomous agent.

When you need to:
- Search the web → use web_search tool
- Search internal knowledge → use knowledge_search tool
- Do math → use calculator tool
- Get current time → use datetime tool
- Make API calls → use http_request tool
- Store important info → use memory_store tool
- Execute code → use code_executor tool
- Manage GitHub → use github_tool tool
- Manage files → use file_manager tool

## Rules
1. ALWAYS use a tool when one is relevant — never say "I can't do that" if a tool exists
2. If you're unsure, search knowledge base first
3. Store any new important facts the user shares
4. Be actionable — execute, don't just explain
5. Keep responses concise unless asked for detail`;

class ContextManager {
    constructor() {
        this.conversationHistory = new Map(); // sessionId -> messages[]
        this.maxHistoryLength = 20;
    }

    /**
     * Build full context for the agent brain
     */
    async buildContext(sessionId, userMessage) {
        // Get conversation history
        const history = this.getHistory(sessionId);

        // Search for relevant knowledge from memory
        let relevantKnowledge = [];
        try {
            relevantKnowledge = await Memory.find(
                { $text: { $search: userMessage } }
            ).limit(3).lean();
        } catch (e) {
            // Text search may not be available
        }

        // Build knowledge context string
        let knowledgeContext = '';
        if (relevantKnowledge.length > 0) {
            knowledgeContext = '\n\n## Relevant Knowledge from Memory:\n' +
                relevantKnowledge.map(k => `- [${k.category}] ${k.title}: ${k.content}`).join('\n');
        }

        const systemPrompt = JARVIS_SYSTEM_PROMPT + knowledgeContext;

        return {
            systemPrompt,
            history: this._formatHistory(history),
            userMessage,
        };
    }

    /**
     * Add a message to conversation history
     */
    addMessage(sessionId, role, text) {
        if (!text || text.trim().length === 0) return;

        if (!this.conversationHistory.has(sessionId)) {
            this.conversationHistory.set(sessionId, []);
        }
        const history = this.conversationHistory.get(sessionId);
        history.push({ role, text, timestamp: Date.now() });

        // Trim to max length
        if (history.length > this.maxHistoryLength) {
            history.splice(0, history.length - this.maxHistoryLength);
        }
    }

    getHistory(sessionId) {
        return this.conversationHistory.get(sessionId) || [];
    }

    clearHistory(sessionId) {
        this.conversationHistory.delete(sessionId);
    }

    /**
     * Format history for Gemini API — MUST alternate user/model roles
     * Gemini requires strictly alternating roles: user, model, user, model...
     * History must start with 'user' and end with 'model'
     */
    _formatHistory(history) {
        if (!history || history.length === 0) return [];

        const formatted = [];
        let lastRole = null;

        for (const msg of history) {
            const geminiRole = msg.role === 'ai' ? 'model' : 'user';

            // Skip consecutive same-role messages (merge or skip)
            if (geminiRole === lastRole) {
                // Merge with previous message
                const prev = formatted[formatted.length - 1];
                prev.parts[0].text += '\n' + msg.text;
                continue;
            }

            formatted.push({
                role: geminiRole,
                parts: [{ text: msg.text }],
            });
            lastRole = geminiRole;
        }

        // Gemini requires history to start with 'user' — remove leading 'model'
        while (formatted.length > 0 && formatted[0].role === 'model') {
            formatted.shift();
        }

        // Gemini requires history to end with 'model' — remove trailing 'user'
        // (because the current user message will be sent separately)
        while (formatted.length > 0 && formatted[formatted.length - 1].role === 'user') {
            formatted.pop();
        }

        return formatted;
    }

    getSystemPrompt() {
        return JARVIS_SYSTEM_PROMPT;
    }
}

// Singleton
let instance = null;
function getContextManager() {
    if (!instance) instance = new ContextManager();
    return instance;
}

module.exports = { ContextManager, getContextManager, JARVIS_SYSTEM_PROMPT };
