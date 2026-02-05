const express = require('express');
const { analytics } = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Mock data for guest users - matching the expected structure
const mockAnalytics = {
  totalPatients: 11,
  avgAge: 45,
  byCity: [
    { _id: 'Mumbai', count: 3 },
    { _id: 'Delhi', count: 2 },
    { _id: 'Ahmedabad', count: 2 },
    { _id: 'Hyderabad', count: 2 },
    { _id: 'Jaipur', count: 2 }
  ],
  byCondition: [
    { _id: 'Diabetes Type 2', count: 4 },
    { _id: 'Hypertension', count: 3 },
    { _id: 'Asthma', count: 2 },
    { _id: 'Arthritis', count: 1 },
    { _id: 'Heart Disease', count: 1 }
  ],
  byGender: [
    { _id: 'male', count: 6 },
    { _id: 'female', count: 5 }
  ],
  activePatients: 8,
  criticalCases: 2,
  recentVisits: 23
};

router.get('/analytics', auth, (req, res, next) => {
  // Check if guest user
  if (req.user && req.user.role === 'guest') {
    return res.json(mockAnalytics);
  }
  // Otherwise use normal controller
  analytics(req, res, next);
});

module.exports = router;
