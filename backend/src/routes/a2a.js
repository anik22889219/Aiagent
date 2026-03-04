const express = require('express');
const router = express.Router();
const { getA2AClient } = require('../a2a/a2aClient');
const A2ATask = require('../models/A2ATask');

// GET /api/a2a/agents — List discovered agents
router.get('/agents', (req, res) => {
    const client = getA2AClient();
    res.json({ agents: client.listAgents() });
});

// POST /api/a2a/discover — Discover an agent at URL
router.post('/discover', async (req, res) => {
    try {
        const { url } = req.body;
        if (!url) return res.status(400).json({ message: 'Agent URL is required' });

        const client = getA2AClient();
        const card = await client.discover(url);
        res.json({ message: 'Agent discovered', card });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/a2a/delegate — Delegate a task to a remote agent
router.post('/delegate', async (req, res) => {
    try {
        const { agentUrl, message } = req.body;
        if (!agentUrl || !message) return res.status(400).json({ message: 'agentUrl and message required' });

        const client = getA2AClient();
        const result = await client.sendTask(agentUrl, message);
        res.json({ result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/a2a/tasks — List A2A task history
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await A2ATask.find().sort({ createdAt: -1 }).limit(50);
        res.json({ tasks });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
