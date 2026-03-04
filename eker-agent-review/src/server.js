require('dotenv').config();
const express = require('express');
const app = express();
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'eker-agent-review' }));

app.post('/internal/route-task', (req, res) => {
  const payload = req.body || {};
  // Echo back a minimal acceptance for review purposes
  return res.json({ status: 'accepted', received: payload });
});

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => console.log(`Eker Agent Review server listening on ${PORT}`));

module.exports = app;
