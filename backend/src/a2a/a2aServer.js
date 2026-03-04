const { v4: uuidv4 } = require('uuid');
const { getAgentBrain } = require('../agent/agentBrain');
const A2ATask = require('../models/A2ATask');

/**
 * A2A Task Server — JSON-RPC 2.0 endpoint
 * Handles tasks from remote agents
 */
function setupA2AServer(app) {
    app.post('/a2a', async (req, res) => {
        const { jsonrpc, id, method, params } = req.body;

        if (jsonrpc !== '2.0') {
            return res.json({ jsonrpc: '2.0', id, error: { code: -32600, message: 'Invalid Request: must be JSON-RPC 2.0' } });
        }

        try {
            let result;

            switch (method) {
                case 'tasks/send':
                    result = await handleTaskSend(params);
                    break;
                case 'tasks/get':
                    result = await handleTaskGet(params);
                    break;
                case 'tasks/cancel':
                    result = await handleTaskCancel(params);
                    break;
                default:
                    return res.json({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } });
            }

            res.json({ jsonrpc: '2.0', id, result });
        } catch (error) {
            console.error('[A2A Server] Error:', error);
            res.json({ jsonrpc: '2.0', id, error: { code: -32000, message: error.message } });
        }
    });

    console.log('[A2A] JSON-RPC server registered at /a2a');
}

async function handleTaskSend(params) {
    const taskId = params.id || uuidv4();
    const message = params.message;

    if (!message || !message.parts || message.parts.length === 0) {
        throw new Error('Message with parts is required');
    }

    // Extract text from message parts
    const textParts = message.parts.filter(p => p.type === 'text').map(p => p.text);
    const userMessage = textParts.join('\n');

    // Save task
    const task = new A2ATask({
        taskId,
        fromAgent: params.metadata?.fromAgent || 'unknown',
        toAgent: 'JARVIS',
        status: 'working',
        input: userMessage,
        metadata: params.metadata || {},
    });
    await task.save();

    // Process with Agent Brain
    const brain = getAgentBrain();
    try {
        const result = await brain.process(userMessage, `a2a-${taskId}`);

        task.status = 'completed';
        task.output = result.text;
        task.completedAt = new Date();
        await task.save();

        return {
            id: taskId,
            status: { state: 'completed' },
            artifacts: [{
                parts: [{ type: 'text', text: result.text }],
            }],
            metadata: {
                iterations: result.iterations,
                usage: result.usage,
            },
        };
    } catch (error) {
        task.status = 'failed';
        task.output = error.message;
        await task.save();

        return {
            id: taskId,
            status: { state: 'failed', message: { parts: [{ type: 'text', text: error.message }] } },
        };
    }
}

async function handleTaskGet(params) {
    const task = await A2ATask.findOne({ taskId: params.id });
    if (!task) throw new Error(`Task not found: ${params.id}`);

    return {
        id: task.taskId,
        status: { state: task.status },
        artifacts: task.output ? [{ parts: [{ type: 'text', text: task.output }] }] : [],
    };
}

async function handleTaskCancel(params) {
    const task = await A2ATask.findOne({ taskId: params.id });
    if (!task) throw new Error(`Task not found: ${params.id}`);

    task.status = 'canceled';
    await task.save();

    return { id: task.taskId, status: { state: 'canceled' } };
}

module.exports = { setupA2AServer };
