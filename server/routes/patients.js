const express = require('express');
const { body, param, validationResult } = require('express-validator');
const { list, getById, create, update, remove } = require('../controllers/patientController');
const { auth } = require('../middleware/auth');

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

// Mock patients data
const mockPatients = [
  {
    _id: '1',
    name: 'Arjun Kumar',
    age: 45,
    gender: 'male',
    city: 'Mumbai',
    hospital: 'City General Hospital',
    condition: 'Diabetes Type 2',
    conditions: ['Diabetes Type 2', 'Hypertension'],
    status: 'stable',
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    notes: 'Patient responding well to medication',
    vitals: [
      { 
        bloodPressureSystolic: 130, 
        bloodPressureDiastolic: 85, 
        heartRate: 78, 
        temperature: 98.6, 
        oxygenSaturation: 97,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ],
    reports: [
      { title: 'Blood Test', summary: 'HbA1c: 7.2%, Fasting glucose: 145 mg/dL', date: '2024-01-15' }
    ]
  },
  {
    _id: '2',
    name: 'Priya Sharma',
    age: 32,
    gender: 'female',
    city: 'Delhi',
    hospital: 'Apollo Hospital',
    condition: 'Hypertension',
    conditions: ['Hypertension'],
    status: 'monitoring',
    lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    notes: 'Monitor blood pressure regularly',
    vitals: [
      { 
        bloodPressureSystolic: 145, 
        bloodPressureDiastolic: 92, 
        heartRate: 82, 
        temperature: 98.4, 
        oxygenSaturation: 98,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ],
    reports: []
  },
  {
    _id: '3',
    name: 'Rajesh Patel',
    age: 58,
    gender: 'male',
    city: 'Ahmedabad',
    hospital: 'Sterling Hospital',
    condition: 'Asthma',
    conditions: ['Asthma'],
    status: 'stable',
    lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: 'Using inhaler as prescribed',
    vitals: [
      { 
        bloodPressureSystolic: 125, 
        bloodPressureDiastolic: 80, 
        heartRate: 72, 
        temperature: 98.2, 
        oxygenSaturation: 95,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ],
    reports: []
  },
  {
    _id: '4',
    name: 'Lakshmi Reddy',
    age: 67,
    gender: 'female',
    city: 'Hyderabad',
    hospital: 'Care Hospital',
    condition: 'Arthritis',
    conditions: ['Arthritis', 'Osteoporosis'],
    status: 'stable',
    lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    notes: 'Physical therapy recommended',
    vitals: [
      { 
        bloodPressureSystolic: 135, 
        bloodPressureDiastolic: 88, 
        heartRate: 75, 
        temperature: 98.5, 
        oxygenSaturation: 96,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ],
    reports: []
  },
  {
    _id: '5',
    name: 'Vikram Singh',
    age: 41,
    gender: 'male',
    city: 'Jaipur',
    hospital: 'Fortis Hospital',
    condition: 'Diabetes Type 2',
    conditions: ['Diabetes Type 2'],
    status: 'critical',
    lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: 'Requires immediate attention - elevated BP',
    vitals: [
      { 
        bloodPressureSystolic: 160, 
        bloodPressureDiastolic: 95, 
        heartRate: 88, 
        temperature: 99.1, 
        oxygenSaturation: 94,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ],
    reports: []
  },
  {
    _id: '6',
    name: 'Meera Iyer',
    age: 29,
    gender: 'female',
    city: 'Chennai',
    hospital: 'Apollo Hospital',
    condition: 'Thyroid',
    conditions: ['Hypothyroidism'],
    status: 'stable',
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    notes: 'Thyroid levels normalizing',
    vitals: [
      { 
        bloodPressureSystolic: 120, 
        bloodPressureDiastolic: 78, 
        heartRate: 70, 
        temperature: 98.3, 
        oxygenSaturation: 99,
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      }
    ],
    reports: []
  },
  {
    _id: '7',
    name: 'Amit Desai',
    age: 52,
    gender: 'male',
    city: 'Pune',
    hospital: 'Ruby Hall Clinic',
    condition: 'Heart Disease',
    conditions: ['Coronary Artery Disease', 'Hypertension'],
    status: 'monitoring',
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    notes: 'Cardiac monitoring required',
    vitals: [
      { 
        bloodPressureSystolic: 140, 
        bloodPressureDiastolic: 90, 
        heartRate: 80, 
        temperature: 98.6, 
        oxygenSaturation: 96,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      }
    ],
    reports: []
  },
  {
    _id: '8',
    name: 'Sunita Rao',
    age: 38,
    gender: 'female',
    city: 'Bangalore',
    hospital: 'Manipal Hospital',
    condition: 'Migraine',
    conditions: ['Chronic Migraine'],
    status: 'stable',
    lastVisit: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    notes: 'Migraine frequency reduced',
    vitals: [
      { 
        bloodPressureSystolic: 118, 
        bloodPressureDiastolic: 75, 
        heartRate: 68, 
        temperature: 98.1, 
        oxygenSaturation: 99,
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
      }
    ],
    reports: []
  },
  {
    _id: '9',
    name: 'Karan Malhotra',
    age: 35,
    gender: 'male',
    city: 'Chandigarh',
    hospital: 'PGI',
    condition: 'Asthma',
    conditions: ['Asthma', 'Allergic Rhinitis'],
    status: 'stable',
    lastVisit: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    notes: 'Seasonal allergies managed',
    vitals: [
      { 
        bloodPressureSystolic: 122, 
        bloodPressureDiastolic: 80, 
        heartRate: 74, 
        temperature: 98.4, 
        oxygenSaturation: 96,
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
      }
    ],
    reports: []
  },
  {
    _id: '10',
    name: 'Deepa Nair',
    age: 44,
    gender: 'female',
    city: 'Kochi',
    hospital: 'Amrita Hospital',
    condition: 'Diabetes Type 2',
    conditions: ['Diabetes Type 2'],
    status: 'stable',
    lastVisit: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    notes: 'Blood sugar levels controlled',
    vitals: [
      { 
        bloodPressureSystolic: 128, 
        bloodPressureDiastolic: 82, 
        heartRate: 76, 
        temperature: 98.5, 
        oxygenSaturation: 97,
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
      }
    ],
    reports: []
  },
  {
    _id: '11',
    name: 'Ravi Krishnan',
    age: 61,
    gender: 'male',
    city: 'Coimbatore',
    hospital: 'PSG Hospital',
    condition: 'COPD',
    conditions: ['COPD', 'Hypertension'],
    status: 'monitoring',
    lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: 'Oxygen therapy ongoing',
    vitals: [
      { 
        bloodPressureSystolic: 138, 
        bloodPressureDiastolic: 86, 
        heartRate: 79, 
        temperature: 98.7, 
        oxygenSaturation: 92,
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      }
    ],
    reports: []
  }
];

router.use(auth);

router.get('/', (req, res, next) => {
  if (req.user && req.user.role === 'guest') {
    // Return paginated response format
    return res.json({
      patients: mockPatients,
      total: mockPatients.length,
      page: 1,
      limit: 20
    });
  }
  list(req, res, next);
});

router.get(
  '/:id',
  [param('id').custom(val => val.length > 0)],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty() && req.user.role !== 'guest') {
      return res.status(400).json({ error: errors.array()[0].msg });
    }
    
    if (req.user && req.user.role === 'guest') {
      const patient = mockPatients.find(p => p._id === req.params.id);
      if (!patient) {
        return res.status(404).json({ error: 'Patient not found' });
      }
      return res.json(patient);
    }
    getById(req, res, next);
  }
);

router.post(
  '/',
  [
    body('name').trim().notEmpty(),
    body('age').isInt({ min: 0, max: 120 }),
    body('gender').isIn(['male', 'female', 'other']),
    body('city').trim().notEmpty(),
    body('hospital').trim().notEmpty(),
  ],
  validate,
  create
);

router.patch(
  '/:id',
  [param('id').isMongoId()],
  validate,
  update
);

router.delete(
  '/:id',
  [param('id').isMongoId()],
  validate,
  remove
);

module.exports = router;
