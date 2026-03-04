const { getGeminiClient } = require('../agent/geminiClient');

class EmbeddingService {
    constructor() {
        this.client = getGeminiClient();
        this.chunkSize = 500; // tokens approx
        this.chunkOverlap = 50;
    }

    /**
     * Generate embedding for a single text
     */
    async embed(text) {
        if (!text || text.trim().length === 0) return null;
        return await this.client.embed(text.substring(0, 10000)); // Limit input
    }

    /**
     * Batch embed multiple texts
     */
    async batchEmbed(texts) {
        return await this.client.batchEmbed(texts.map(t => t.substring(0, 10000)));
    }

    /**
     * Chunk a large document into smaller pieces for embedding
     */
    chunkText(text, maxChunkChars = 2000, overlapChars = 200) {
        if (text.length <= maxChunkChars) return [text];

        const chunks = [];
        let start = 0;

        while (start < text.length) {
            let end = Math.min(start + maxChunkChars, text.length);

            // Try to break at a sentence boundary
            if (end < text.length) {
                const lastPeriod = text.lastIndexOf('.', end);
                const lastNewline = text.lastIndexOf('\n', end);
                const breakPoint = Math.max(lastPeriod, lastNewline);
                if (breakPoint > start + maxChunkChars * 0.5) {
                    end = breakPoint + 1;
                }
            }

            chunks.push(text.substring(start, end).trim());
            start = end - overlapChars;
        }

        return chunks.filter(c => c.length > 0);
    }

    /**
     * Process a document: chunk it and generate embeddings
     */
    async processDocument(text, metadata = {}) {
        const chunks = this.chunkText(text);
        const embeddings = await this.batchEmbed(chunks);

        return chunks.map((chunk, i) => ({
            content: chunk,
            embedding: embeddings[i],
            chunkIndex: i,
            totalChunks: chunks.length,
            ...metadata,
        }));
    }

    /**
     * Cosine similarity between two vectors
     */
    static cosineSimilarity(a, b) {
        if (!a || !b || a.length !== b.length) return 0;

        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        for (let i = 0; i < a.length; i++) {
            dotProduct += a[i] * b[i];
            normA += a[i] * a[i];
            normB += b[i] * b[i];
        }

        if (normA === 0 || normB === 0) return 0;
        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }
}

let instance = null;
function getEmbeddingService() {
    if (!instance) instance = new EmbeddingService();
    return instance;
}

module.exports = { EmbeddingService, getEmbeddingService };
