const Memory = require('../models/Memory');
const KnowledgeBase = require('../models/KnowledgeBase');
const { EmbeddingService } = require('./embeddingService');

class VectorSearch {
    constructor() {
        this.embeddingService = new EmbeddingService();
    }

    /**
     * Semantic search across knowledge base
     * @param {string} query - Search query
     * @param {Object} options - { limit, threshold, collection }
     */
    async search(query, options = {}) {
        const { limit = 5, threshold = 0.6, collection = 'all' } = options;

        // Generate query embedding
        const queryEmbedding = await this.embeddingService.embed(query);
        if (!queryEmbedding) {
            // Fallback to text search
            return this._textSearch(query, limit);
        }

        // Get all entries with embeddings
        let entries = [];
        if (collection === 'all' || collection === 'knowledge') {
            try {
                const kbEntries = await KnowledgeBase.find({ embedding: { $exists: true, $ne: null } }).lean();
                entries.push(...kbEntries.map(e => ({ ...e, _source: 'knowledge' })));
            } catch (e) { /* collection may not exist yet */ }
        }
        if (collection === 'all' || collection === 'memory') {
            try {
                const memEntries = await Memory.find({ embedding: { $exists: true, $ne: null } }).lean();
                entries.push(...memEntries.map(e => ({ ...e, _source: 'memory' })));
            } catch (e) { /* collection may not exist yet */ }
        }

        // Calculate cosine similarity
        const scored = entries.map(entry => ({
            ...entry,
            score: EmbeddingService.cosineSimilarity(queryEmbedding, entry.embedding),
        }));

        // Filter and sort
        return scored
            .filter(e => e.score >= threshold)
            .sort((a, b) => b.score - a.score)
            .slice(0, limit)
            .map(e => ({
                id: e._id,
                title: e.title || e.topic,
                content: e.content,
                score: Math.round(e.score * 100) / 100,
                source: e._source,
                category: e.category,
            }));
    }

    /**
     * Fallback text search
     */
    async _textSearch(query, limit) {
        const results = [];

        try {
            const memories = await Memory.find({ $text: { $search: query } }).limit(limit).lean();
            results.push(...memories.map(m => ({
                id: m._id,
                title: m.title,
                content: m.content,
                score: 0.5,
                source: 'memory',
                category: m.category,
            })));
        } catch (e) { /* text index may not exist */ }

        try {
            const kbs = await KnowledgeBase.find({ $text: { $search: query } }).limit(limit).lean();
            results.push(...kbs.map(k => ({
                id: k._id,
                title: k.topic,
                content: k.content,
                score: 0.5,
                source: 'knowledge',
                category: k.category,
            })));
        } catch (e) { /* text index may not exist */ }

        return results.slice(0, limit);
    }
}

let instance = null;
function getVectorSearch() {
    if (!instance) instance = new VectorSearch();
    return instance;
}

module.exports = { VectorSearch, getVectorSearch };
