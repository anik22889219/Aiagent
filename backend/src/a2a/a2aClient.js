const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

/**
 * A2A Client — Discover and delegate tasks to remote agents
 */
class A2AClient {
    constructor() {
        this.discoveredAgents = new Map(); // url -> agentCard
    }

    /**
     * Discover an agent by fetching its Agent Card
     */
    async discover(agentUrl) {
        try {
            const cardUrl = `${agentUrl.replace(/\/$/, '')}/.well-known/agent.json`;
            const resp = await axios.get(cardUrl, { timeout: 10000 });
            const card = resp.data;

            this.discoveredAgents.set(agentUrl, {
                ...card,
                discoveredAt: Date.now(),
                url: agentUrl,
            });

            return card;
        } catch (error) {
            throw new Error(`Failed to discover agent at ${agentUrl}: ${error.message}`);
        }
    }

    /**
     * Send a task to a remote agent
     */
    async sendTask(agentUrl, message, metadata = {}) {
        const taskId = uuidv4();

        try {
            const resp = await axios.post(`${agentUrl}/a2a`, {
                jsonrpc: '2.0',
                id: `req-${taskId}`,
                method: 'tasks/send',
                params: {
                    id: taskId,
                    message: {
                        role: 'user',
                        parts: [{ type: 'text', text: message }],
                    },
                    metadata: {
                        fromAgent: 'JARVIS',
                        ...metadata,
                    },
                },
            }, { timeout: 60000 });

            return resp.data.result || resp.data.error;
        } catch (error) {
            throw new Error(`Failed to send task to ${agentUrl}: ${error.message}`);
        }
    }

    /**
     * Get task status from a remote agent
     */
    async getTaskStatus(agentUrl, taskId) {
        try {
            const resp = await axios.post(`${agentUrl}/a2a`, {
                jsonrpc: '2.0',
                id: `req-status-${Date.now()}`,
                method: 'tasks/get',
                params: { id: taskId },
            }, { timeout: 10000 });

            return resp.data.result || resp.data.error;
        } catch (error) {
            throw new Error(`Failed to get task status: ${error.message}`);
        }
    }

    /**
     * List all discovered agents
     */
    listAgents() {
        const agents = [];
        for (const [url, card] of this.discoveredAgents) {
            agents.push({
                url,
                name: card.name,
                description: card.description,
                skills: card.skills?.map(s => s.name) || [],
                discoveredAt: card.discoveredAt,
            });
        }
        return agents;
    }
}

let instance = null;
function getA2AClient() {
    if (!instance) instance = new A2AClient();
    return instance;
}

module.exports = { A2AClient, getA2AClient };
