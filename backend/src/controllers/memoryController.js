const Memory = require('../models/Memory');

exports.createMemory = async (req, res) => {
  try {
    const mem = new Memory(req.body);
    await mem.save();
    res.status(201).json(mem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMemories = async (req, res) => {
  try {
    const filters = {};
    if (req.query.category) filters.category = req.query.category;
    if (req.query.tags) filters.tags = { $in: req.query.tags.split(',') };
    const memories = await Memory.find(filters).sort({ createdAt: -1 });
    res.json(memories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMemoryById = async (req, res) => {
  try {
    const mem = await Memory.findById(req.params.id);
    if (!mem) return res.status(404).json({ message: 'Not found' });
    res.json(mem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateMemory = async (req, res) => {
  try {
    const mem = await Memory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mem) return res.status(404).json({ message: 'Not found' });
    res.json(mem);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteMemory = async (req, res) => {
  try {
    const mem = await Memory.findByIdAndDelete(req.params.id);
    if (!mem) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.searchMemories = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.json([]);
    const results = await Memory.find({ $text: { $search: query } });
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
