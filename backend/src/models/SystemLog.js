const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
  level: { type: String, enum: ['info','warn','error'], default: 'info' },
  message: { type: String, required: true },
  module: { type: String },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('SystemLog', systemLogSchema);
