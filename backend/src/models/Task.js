const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  priority: { type: String, enum: ['low','medium','high','critical'], default: 'low' },
  status: { type: String, enum: ['pending','running','completed','failed','paused','canceled'], default: 'pending' },
  command: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scheduledAt: { type: Date },
  startedAt: { type: Date },
  completedAt: { type: Date },
  result: { type: mongoose.Schema.Types.Mixed },
  errorMessage: { type: String },
  retryCount: { type: Number, default: 0 },
  executionTimeMs: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Task', taskSchema);
