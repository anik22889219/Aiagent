const os = require('os');
const SystemLog = require('../models/SystemLog');

exports.getStatus = async (req, res) => {
  try {
    // agent status stub
    res.json({ status: 'idle' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getHealth = async (req, res) => {
  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    const cpuLoad = os.loadavg();
    res.json({ uptime, memoryUsage, cpuLoad });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getLogs = async (req, res) => {
  try {
    const logs = await SystemLog.find().sort({ timestamp: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
