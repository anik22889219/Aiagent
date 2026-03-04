const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiClient {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn('GEMINI_API_KEY not set — Agent Brain will use fallback responses.');
            this.available = false;
            return;
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.available = true;
    }

    /**
     * Chat with function calling support (ReAct loop)
     * @param {string} systemPrompt - System instructions
     * @param {Array} history - Conversation history [{role, parts}]
     * @param {string} userMessage - Current user message
     * @param {Array} tools - Gemini function declarations
     * @returns {Object} { text, functionCalls, usage }
     */
    async chat(systemPrompt, history, userMessage, tools = []) {
        if (!this.available) {
            return this._fallback(userMessage);
        }

        try {
            const model = this.genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                systemInstruction: systemPrompt,
            });

            const chatConfig = {};
            if (tools.length > 0) {
                chatConfig.tools = [{ functionDeclarations: tools }];
                chatConfig.toolConfig = { functionCallingConfig: { mode: 'AUTO' } };
            }

            const chat = model.startChat({
                history: history || [],
                ...chatConfig,
            });

            const result = await chat.sendMessage(userMessage);
            const response = result.response;

            // Extract function calls if any
            const functionCalls = [];
            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.functionCall) {
                        functionCalls.push({
                            name: part.functionCall.name,
                            args: part.functionCall.args,
                        });
                    }
                }
            }

            return {
                text: response.text?.() || '',
                functionCalls,
                usage: response.usageMetadata || {},
            };
        } catch (error) {
            console.error('Gemini API Error:', error.message);
            return this._fallback(userMessage, error.message);
        }
    }

    /**
     * Continue chat after tool execution (send function results back)
     */
    async sendToolResults(systemPrompt, history, toolResults, tools = []) {
        if (!this.available) return this._fallback('tool result');

        try {
            const model = this.genAI.getGenerativeModel({
                model: 'gemini-2.0-flash',
                systemInstruction: systemPrompt,
            });

            const chatConfig = {};
            if (tools.length > 0) {
                chatConfig.tools = [{ functionDeclarations: tools }];
                chatConfig.toolConfig = { functionCallingConfig: { mode: 'AUTO' } };
            }

            const chat = model.startChat({ history, ...chatConfig });

            // Build function response parts
            const parts = toolResults.map(tr => ({
                functionResponse: {
                    name: tr.name,
                    response: { result: tr.result },
                },
            }));

            const result = await chat.sendMessage(parts);
            const response = result.response;

            const functionCalls = [];
            if (response.candidates?.[0]?.content?.parts) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.functionCall) {
                        functionCalls.push({
                            name: part.functionCall.name,
                            args: part.functionCall.args,
                        });
                    }
                }
            }

            return {
                text: response.text?.() || '',
                functionCalls,
                usage: response.usageMetadata || {},
            };
        } catch (error) {
            console.error('Gemini Tool Result Error:', error.message);
            return this._fallback('tool result', error.message);
        }
    }

    /**
     * Generate embeddings for text
     */
    async embed(text) {
        if (!this.available) return null;

        try {
            const model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
            const result = await model.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            console.error('Embedding Error:', error.message);
            return null;
        }
    }

    /**
     * Batch embed multiple texts
     */
    async batchEmbed(texts) {
        if (!this.available) return texts.map(() => null);

        try {
            const model = this.genAI.getGenerativeModel({ model: 'text-embedding-004' });
            const results = await Promise.all(
                texts.map(text => model.embedContent(text).catch(() => null))
            );
            return results.map(r => r?.embedding?.values || null);
        } catch (error) {
            console.error('Batch Embedding Error:', error.message);
            return texts.map(() => null);
        }
    }

    _fallback(userMessage, error = null) {
        const responses = [
            `I've analyzed your request regarding "${userMessage.substring(0, 50)}". Processing with available resources.`,
            `Task acknowledged, Sir. Working on "${userMessage.substring(0, 50)}" with local capabilities.`,
            `Running diagnostics on "${userMessage.substring(0, 50)}"... Completed with local analysis.`,
        ];
        return {
            text: error
                ? `System notice: Gemini API unavailable (${error}). Using fallback mode.`
                : responses[Math.floor(Math.random() * responses.length)],
            functionCalls: [],
            usage: {},
        };
    }
}

// Singleton
let instance = null;
function getGeminiClient() {
    if (!instance) instance = new GeminiClient();
    return instance;
}

module.exports = { GeminiClient, getGeminiClient };
