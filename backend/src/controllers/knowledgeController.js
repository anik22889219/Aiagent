const KnowledgeBase = require('../models/KnowledgeBase');
const TrainingSession = require('../models/TrainingSession');
const { getEmbeddingService } = require('../services/embeddingService');
const { getVectorSearch } = require('../services/vectorSearch');

// POST /api/knowledge/train — Train the agent with new content
exports.train = async (req, res) => {
    try {
        const { sessionName, content, topic, category, tags } = req.body;
        if (!content) return res.status(400).json({ message: 'Content is required' });

        const embeddingService = getEmbeddingService();

        // Create training session
        const session = new TrainingSession({
            sessionName: sessionName || `Training ${Date.now()}`,
            status: 'processing',
            startedAt: new Date(),
            documents: [{ filename: topic || 'direct-input', content, contentType: 'text/plain', size: content.length }],
        });
        await session.save();

        // Process document: chunk and embed
        const processedChunks = await embeddingService.processDocument(content, {
            topic: topic || 'General Knowledge',
            category: category || 'training',
            tags: tags || [],
        });

        session.totalChunks = processedChunks.length;

        // Save each chunk as a knowledge entry
        let created = 0;
        for (const chunk of processedChunks) {
            try {
                const entry = new KnowledgeBase({
                    topic: chunk.topic,
                    content: chunk.content,
                    embedding: chunk.embedding,
                    category: chunk.category,
                    source: 'training',
                    tags: chunk.tags,
                    chunkIndex: chunk.chunkIndex,
                    totalChunks: chunk.totalChunks,
                    parentDocument: session._id.toString(),
                    confidence: 0.9,
                    importance: 0.7,
                });
                await entry.save();
                created++;
            } catch (e) {
                session.errors.push(`Chunk ${chunk.chunkIndex}: ${e.message}`);
            }
        }

        session.knowledgeCreated = created;
        session.chunksProcessed = processedChunks.length;
        session.status = 'completed';
        session.completedAt = new Date();
        await session.save();

        res.status(201).json({
            message: `Training complete. ${created} knowledge entries created from ${processedChunks.length} chunks.`,
            session,
        });
    } catch (err) {
        console.error('Training error:', err);
        res.status(500).json({ message: 'Training failed: ' + err.message });
    }
};

// POST /api/knowledge/query — Semantic search
exports.query = async (req, res) => {
    try {
        const { query, limit, threshold, collection } = req.body;
        if (!query) return res.status(400).json({ message: 'Query is required' });

        const vectorSearch = getVectorSearch();
        const results = await vectorSearch.search(query, { limit, threshold, collection });

        res.json({ query, results, count: results.length });
    } catch (err) {
        console.error('Knowledge query error:', err);
        res.status(500).json({ message: 'Query failed: ' + err.message });
    }
};

// GET /api/knowledge — List all knowledge entries
exports.listKnowledge = async (req, res) => {
    try {
        const { category, source, page = 1, limit = 20 } = req.query;
        const filter = {};
        if (category) filter.category = category;
        if (source) filter.source = source;

        const entries = await KnowledgeBase.find(filter)
            .select('-embedding')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await KnowledgeBase.countDocuments(filter);

        res.json({ entries, total, page: parseInt(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/knowledge/topics — List all known topics
exports.getTopics = async (req, res) => {
    try {
        const topics = await KnowledgeBase.distinct('topic');
        const categories = await KnowledgeBase.distinct('category');
        res.json({ topics, categories });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// POST /api/knowledge/correct — Correct a knowledge entry
exports.correct = async (req, res) => {
    try {
        const { id, content, topic, confidence } = req.body;
        const embeddingService = getEmbeddingService();

        const updates = { updatedAt: new Date() };
        if (content) {
            updates.content = content;
            updates.embedding = await embeddingService.embed(content);
        }
        if (topic) updates.topic = topic;
        if (confidence !== undefined) updates.confidence = confidence;

        const entry = await KnowledgeBase.findByIdAndUpdate(id, updates, { new: true });
        if (!entry) return res.status(404).json({ message: 'Not found' });

        res.json(entry);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE /api/knowledge/:id
exports.deleteKnowledge = async (req, res) => {
    try {
        const entry = await KnowledgeBase.findByIdAndDelete(req.params.id);
        if (!entry) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Knowledge entry deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// GET /api/knowledge/sessions — List training sessions
exports.getSessions = async (req, res) => {
    try {
        const sessions = await TrainingSession.find()
            .select('-documents.content')
            .sort({ createdAt: -1 })
            .limit(20);
        res.json(sessions);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
