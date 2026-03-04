const Integration = require('../models/Integration');

exports.listTools = async (req, res) => {
  try {
    const tools = await Integration.find();
    res.json(tools);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.toggleTool = async (req, res) => {
  try {
    const tool = await Integration.findById(req.params.id);
    if (!tool) return res.status(404).json({ message: 'Not found' });
    tool.enabled = !tool.enabled;
    await tool.save();
    res.json(tool);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.n8nTrigger = async (req, res) => {
  // call python script for n8n webhook
  try {
    const { data } = req.body;
    // simple stub: for now return success
    res.json({ status: 'received', data });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
