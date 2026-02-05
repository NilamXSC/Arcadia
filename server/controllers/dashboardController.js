const Patient = require('../models/Patient');

const analytics = async (req, res, next) => {
  try {
    const [
      totalPatients,
      byCity,
      byCondition,
      recentVitals,
    ] = await Promise.all([
      Patient.countDocuments(),
      Patient.aggregate([
        { $group: { _id: '$city', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),
      Patient.aggregate([
        { $unwind: '$conditions' },
        { $group: { _id: '$conditions', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 15 },
      ]),
      Patient.aggregate([
        { $match: { 'vitals.0': { $exists: true } } },
        { $project: { name: 1, vitals: { $slice: ['$vitals', -1] } } },
        { $unwind: '$vitals' },
        { $sort: { 'vitals.recordedAt': -1 } },
        { $limit: 20 },
      ]),
    ]);

    const avgAge = await Patient.aggregate([
      { $group: { _id: null, avg: { $avg: '$age' } } },
    ]);
    const byGender = await Patient.aggregate([
      { $group: { _id: '$gender', count: { $sum: 1 } } },
    ]);

    res.json({
      totalPatients,
      avgAge: avgAge[0]?.avg ?? 0,
      byCity,
      byCondition,
      byGender,
      recentVitals,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { analytics };
