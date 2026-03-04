const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const data = req.body;
    data.createdBy = req.user.id;
    const task = new Task(data);
    await task.save();
    // emit socket event
    const agentNs = req.app.get('agentNamespace');
    if (agentNs) agentNs.emit('task:created', task);
    // log
    const SystemLog = require('../models/SystemLog');
    const log = new SystemLog({ level: 'info', message: `Task created: ${task.title}`, userId: req.user.id });
    await log.save();
    const logNs = req.app.get('logNamespace');
    if (logNs) logNs.emit('log', log);
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    const tasks = await Task.find(filters).populate('createdBy', 'email role');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Not found' });
    const agentNs = req.app.get('agentNamespace');
    if (agentNs) agentNs.emit('task:updated', task);
    const SystemLog = require('../models/SystemLog');
    const log = new SystemLog({ level: 'info', message: `Task updated: ${task.title}`, userId: req.user.id });
    await log.save();
    const logNs = req.app.get('logNamespace');
    if (logNs) logNs.emit('log', log);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Additional actions
exports.pauseTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    task.status = 'paused';
    await task.save();
    const agentNs = req.app.get('agentNamespace');
    if (agentNs) agentNs.emit('task:paused', task);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.resumeTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    if (task.status === 'paused') task.status = 'pending';
    await task.save();
    const agentNs = req.app.get('agentNamespace');
    if (agentNs) agentNs.emit('task:resumed', task);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Not found' });
    task.status = 'canceled';
    await task.save();
    const agentNs = req.app.get('agentNamespace');
    if (agentNs) agentNs.emit('task:canceled', task);
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
