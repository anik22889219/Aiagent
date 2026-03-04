const Task = require('../models/Task');

exports.tasksPerDay = async (req, res) => {
  try {
    const data = await Task.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.errorFrequency = async (req, res) => {
  try {
    const data = await Task.aggregate([
      { $match: { status: 'failed' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.executionTimes = async (req, res) => {
  try {
    const data = await Task.aggregate([
      { $match: { executionTimeMs: { $gt: 0 } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
          avgTime: { $avg: "$executionTimeMs" },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
