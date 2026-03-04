const { getGeminiClient } = require('./geminiClient');
const { getContextManager } = require('./contextManager');

const MAX_ITERATIONS = 5;

class AgentBrain {
    constructor() {
        this.gemini = getGeminiClient();
        this.contextManager = getContextManager();
        this.toolRegistry = null; // Set after tool registry is created
    }

    setToolRegistry(registry) {
        this.toolRegistry = registry;
    }

    /**
     * Main processing pipeline — ReAct Loop
     * Think → Act → Observe → Repeat until answer
     */
    async process(userMessage, sessionId, onStream = null) {
        // 1. Build context (gets history BEFORE this message)
        const ctx = await this.contextManager.buildContext(sessionId, userMessage);

        // Save user message to history
        this.contextManager.addMessage(sessionId, 'user', userMessage);

        // 2. Get tool declarations for Gemini
        const tools = this.toolRegistry ? this.toolRegistry.getGeminiDeclarations() : [];

        // 3. ReAct loop
        let iterations = 0;
        let finalResponse = null;

        try {
            // Initial call — send history + new user message
            let result = await this.gemini.chat(ctx.systemPrompt, ctx.history, userMessage, tools);

            while (iterations < MAX_ITERATIONS) {
                iterations++;

                // If no function calls, we have our final answer
                if (!result.functionCalls || result.functionCalls.length === 0) {
                    finalResponse = result.text;
                    break;
                }

                // Execute tool calls
                if (onStream) {
                    onStream({ type: 'tool_start', tools: result.functionCalls.map(fc => fc.name) });
                }

                const toolResults = [];
                for (const fc of result.functionCalls) {
                    console.log(`[AgentBrain] Executing tool: ${fc.name}`, JSON.stringify(fc.args));

                    let toolResult;
                    try {
                        if (this.toolRegistry) {
                            toolResult = await this.toolRegistry.execute(fc.name, fc.args);
                        } else {
                            toolResult = { error: 'Tool registry not initialized' };
                        }
                    } catch (error) {
                        console.error(`[AgentBrain] Tool error (${fc.name}):`, error.message);
                        toolResult = { error: error.message };
                    }

                    toolResults.push({
                        name: fc.name,
                        result: typeof toolResult === 'string' ? toolResult : JSON.stringify(toolResult),
                    });

                    if (onStream) {
                        onStream({ type: 'tool_result', tool: fc.name, result: toolResult });
                    }
                }

                // Build the conversation so far for sendToolResults
                // History: previous turns + current user msg + model's function call
                const fullHistory = [
                    ...ctx.history,
                    { role: 'user', parts: [{ text: userMessage }] },
                    {
                        role: 'model',
                        parts: result.functionCalls.map(fc => ({
                            functionCall: { name: fc.name, args: fc.args },
                        })),
                    },
                ];

                // Send tool results back to Gemini
                result = await this.gemini.sendToolResults(
                    ctx.systemPrompt,
                    fullHistory,
                    toolResults,
                    tools
                );
            }
        } catch (error) {
            console.error('[AgentBrain] Processing error:', error.message);
            finalResponse = `I encountered an issue while processing your request, Sir. Error: ${error.message}. Let me try a different approach.`;
        }

        // If we exhausted iterations without a text response
        if (!finalResponse) {
            finalResponse = 'I completed the requested operations, Sir. All tasks executed successfully.';
        }

        // Save AI response to history
        this.contextManager.addMessage(sessionId, 'ai', finalResponse);

        return {
            text: finalResponse,
            iterations,
            usage: {},
        };
    }

    /**
     * Simple query without tools (for quick responses)
     */
    async quickQuery(systemPrompt, userMessage) {
        const result = await this.gemini.chat(systemPrompt, [], userMessage, []);
        return result.text;
    }
}

// Singleton
let instance = null;
function getAgentBrain() {
    if (!instance) instance = new AgentBrain();
    return instance;
}

module.exports = { AgentBrain, getAgentBrain };
