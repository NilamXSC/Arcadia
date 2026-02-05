const Patient = require('../models/Patient');
const { queryAI } = require('../services/aiService');

const chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }
    const trimmed = message.trim();
    if (!trimmed) {
      return res.status(400).json({ error: 'Message cannot be empty' });
    }

    let dashboardSnapshot = null;
    try {
      const [total, byCity, byCondition] = await Promise.all([
        Patient.countDocuments(),
        Patient.aggregate([{ $group: { _id: '$city', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 10 }]),
        Patient.aggregate([
          { $unwind: '$conditions' },
          { $group: { _id: '$conditions', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 15 },
        ]),
      ]);
      const avgAge = await Patient.aggregate([{ $group: { _id: null, avg: { $avg: '$age' } } }]);
      dashboardSnapshot = { totalPatients: total, avgAge: avgAge[0]?.avg ?? 0, byCity, byCondition };
    } catch {
      // use empty snapshot
    }

    const result = await queryAI(trimmed, history, dashboardSnapshot);
    res.json({
      reply: result.reply,
      sources: result.sources || [],
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { chat };
