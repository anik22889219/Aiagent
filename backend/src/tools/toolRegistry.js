/**
 * Central Tool Registry — Dynamic tool discovery and management
 * Each tool has: name, description, parameters (JSON Schema), execute function
 */
class ToolRegistry {
    constructor() {
        this.tools = new Map();
    }

    /**
     * Register a tool
     * @param {Object} tool - { name, description, parameters, execute }
     */
    register(tool) {
        if (!tool.name || !tool.execute) {
            throw new Error('Tool must have name and execute function');
        }
        this.tools.set(tool.name, {
            name: tool.name,
            description: tool.description || '',
            parameters: tool.parameters || { type: 'object', properties: {} },
            execute: tool.execute,
            registeredAt: Date.now(),
        });
        console.log(`[ToolRegistry] Registered: ${tool.name}`);
    }

    /**
     * Unregister a tool
     */
    unregister(name) {
        return this.tools.delete(name);
    }

    /**
     * Execute a tool by name
     */
    async execute(name, args = {}) {
        const tool = this.tools.get(name);
        if (!tool) {
            throw new Error(`Tool not found: ${name}`);
        }

        const startTime = Date.now();
        try {
            const result = await Promise.race([
                tool.execute(args),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Tool execution timeout (30s)')), 30000)),
            ]);

            console.log(`[ToolRegistry] ${name} completed in ${Date.now() - startTime}ms`);
            return result;
        } catch (error) {
            console.error(`[ToolRegistry] ${name} failed:`, error.message);
            throw error;
        }
    }

    /**
     * Get Gemini function declarations for all tools
     */
    getGeminiDeclarations() {
        const declarations = [];
        for (const [, tool] of this.tools) {
            declarations.push({
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters,
            });
        }
        return declarations;
    }

    /**
     * List all tools (without execute functions)
     */
    listTools() {
        const list = [];
        for (const [, tool] of this.tools) {
            list.push({
                name: tool.name,
                description: tool.description,
                parameters: tool.parameters,
                registeredAt: tool.registeredAt,
            });
        }
        return list;
    }

    /**
     * Get a specific tool's info
     */
    getTool(name) {
        const tool = this.tools.get(name);
        if (!tool) return null;
        return {
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
        };
    }
}

// Singleton
let instance = null;
function getToolRegistry() {
    if (!instance) instance = new ToolRegistry();
    return instance;
}

module.exports = { ToolRegistry, getToolRegistry };
