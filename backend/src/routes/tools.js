const express = require('express');
const router = express.Router();
const { getToolRegistry } = require('../tools/toolRegistry');

// GET /api/tools — List all registered tools
router.get('/', (req, res) => {
    const registry = getToolRegistry();
    res.json({ tools: registry.listTools(), count: registry.listTools().length });
});

// GET /api/tools/:name — Get a specific tool
router.get('/:name', (req, res) => {
    const registry = getToolRegistry();
    const tool = registry.getTool(req.params.name);
    if (!tool) return res.status(404).json({ message: 'Tool not found' });
    res.json(tool);
});

// POST /api/tools/execute — Manually execute a tool
router.post('/execute', async (req, res) => {
    try {
        const { name, args } = req.body;
        if (!name) return res.status(400).json({ message: 'Tool name required' });

        const registry = getToolRegistry();
        const result = await registry.execute(name, args || {});
        res.json({ tool: name, result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/tools/register — Register a custom tool (limited)
router.post('/register', (req, res) => {
    try {
        const { name, description, parameters } = req.body;
        if (!name) return res.status(400).json({ message: 'Tool name required' });

        const registry = getToolRegistry();
        registry.register({
            name,
            description: description || '',
            parameters: parameters || { type: 'object', properties: {} },
            execute: async (args) => ({ message: `Custom tool ${name} executed`, args }),
        });

        res.status(201).json({ message: `Tool "${name}" registered`, tool: registry.getTool(name) });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE /api/tools/:name — Unregister a tool
router.delete('/:name', (req, res) => {
    const registry = getToolRegistry();
    const removed = registry.unregister(req.params.name);
    if (!removed) return res.status(404).json({ message: 'Tool not found' });
    res.json({ message: `Tool "${req.params.name}" unregistered` });
});

module.exports = router;
