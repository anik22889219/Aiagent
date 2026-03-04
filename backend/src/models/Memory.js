const mongoose = require('mongoose');

const memorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['dev','marketing','automation','business'], default: 'dev' },
  tags: [{ type: String }],
  embedding: { type: Array, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

memorySchema.index({ category: 1 });
memorySchema.index({ tags: 1 });
// text index for search
memorySchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Memory', memorySchema);
