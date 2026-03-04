require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { classifyAndPlan } = require('./brain');

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 4002;

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'commander-brain' }));

app.post('/internal/route-task', async (req, res) => {
  try {
    const payload = req.body;
    if (!payload || !payload.command) {
      return res.status(400).json({ error: 'Missing required field: command' });
    }
    const decision = await classifyAndPlan(payload);
    // Basic logging (could be expanded to audit logs)
    console.info('Decision:', { task_id: decision.task_id, category: decision.category, agent: decision.agent_target });
    return res.json(decision);
  } catch (err) {
    console.error('Error routing task:', err);
    return res.status(500).json({ error: 'internal_error' });
  }
});

app.listen(PORT, () => console.log(`Commander Brain listening on port ${PORT}`));

module.exports = app;
