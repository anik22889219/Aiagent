const mongoose = require('mongoose');

const a2aTaskSchema = new mongoose.Schema({
    taskId: { type: String, required: true, unique: true, index: true },
    fromAgent: { type: String, required: true },
    toAgent: { type: String, required: true },
    status: {
        type: String,
        enum: ['submitted', 'working', 'completed', 'failed', 'canceled'],
        default: 'submitted',
    },
    input: { type: String },
    output: { type: String },
    artifacts: [{ type: mongoose.Schema.Types.Mixed }],
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
});

module.exports = mongoose.model('A2ATask', a2aTaskSchema);
