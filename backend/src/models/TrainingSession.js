const mongoose = require('mongoose');

const trainingSessionSchema = new mongoose.Schema({
    sessionName: { type: String, required: true },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: 'pending',
    },
    documents: [{
        filename: String,
        content: String,
        contentType: { type: String, default: 'text/plain' },
        size: Number,
    }],
    knowledgeCreated: { type: Number, default: 0 },
    chunksProcessed: { type: Number, default: 0 },
    totalChunks: { type: Number, default: 0 },
    errors: [{ type: String }],
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TrainingSession', trainingSessionSchema);
