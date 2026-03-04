const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
    topic: { type: String, required: true, index: true },
    content: { type: String, required: true },
    category: {
        type: String,
        enum: ['general', 'technical', 'personal', 'business', 'training', 'conversation'],
        default: 'general',
    },
    embedding: { type: [Number], default: null },
    source: {
        type: String,
        enum: ['manual', 'conversation', 'training', 'tool-output', 'a2a'],
        default: 'manual',
    },
    confidence: { type: Number, default: 0.8, min: 0, max: 1 },
    importance: { type: Number, default: 0.5, min: 0, max: 1 },
    tags: [{ type: String }],
    relations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeBase' }],
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    accessCount: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: null },
    chunkIndex: { type: Number, default: 0 },
    totalChunks: { type: Number, default: 1 },
    parentDocument: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

knowledgeBaseSchema.index({ topic: 'text', content: 'text' });
knowledgeBaseSchema.index({ category: 1 });
knowledgeBaseSchema.index({ tags: 1 });
knowledgeBaseSchema.index({ source: 1 });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
