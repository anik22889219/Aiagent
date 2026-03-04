const mongoose = require('mongoose');

const integrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['n8n','api','webhook'], default: 'api' },
  enabled: { type: Boolean, default: true },
  config: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Integration', integrationSchema);
