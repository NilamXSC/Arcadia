require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Patient = require('../models/Patient');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/arcadia';

const patients = [
  {
    name: 'Arjun Sharma',
    age: 34,
    gender: 'male',
    city: 'Mumbai',
    hospital: 'Apollo Hospital',
    conditions: ['Hypertension', 'Type 2 Diabetes'],
    vitals: [
      { bloodPressureSystolic: 142, bloodPressureDiastolic: 88, heartRate: 78, temperature: 36.8, oxygenSaturation: 98, recordedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
      { bloodPressureSystolic: 138, bloodPressureDiastolic: 86, heartRate: 74, temperature: 36.6, oxygenSaturation: 99, recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
    reports: [
      { type: 'lab', title: 'CBC', summary: 'Hemoglobin 13.2 g/dL', findings: ['RBC normal', 'WBC 7.2'], date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { type: 'lab', title: 'Fasting Blood Sugar', summary: 'FBS 118 mg/dL', findings: ['Elevated fasting glucose'], date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
    ],
    lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    notes: 'Regular follow-up for diabetes and BP. Diet advised.',
  },
  {
    name: 'Priya Patel',
    age: 28,
    gender: 'female',
    city: 'Ahmedabad',
    hospital: 'Civil Hospital',
    conditions: ['Anemia', 'Vitamin D deficiency'],
    vitals: [
      { bloodPressureSystolic: 110, bloodPressureDiastolic: 72, heartRate: 82, temperature: 36.9, oxygenSaturation: 99, recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
    reports: [
      { type: 'lab', title: 'Hemoglobin', summary: '9.8 g/dL - mild anemia', findings: ['Low ferritin'], date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
    ],
    lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    notes: 'Iron and Vitamin D supplementation started.',
  },
  {
    name: 'Rahul Verma',
    age: 45,
    gender: 'male',
    city: 'Delhi',
    hospital: 'AIIMS',
    conditions: ['COPD', 'Hypertension'],
    vitals: [
      { bloodPressureSystolic: 148, bloodPressureDiastolic: 92, heartRate: 88, temperature: 36.7, oxygenSaturation: 94, recordedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
      { bloodPressureSystolic: 145, bloodPressureDiastolic: 90, heartRate: 86, temperature: 36.5, oxygenSaturation: 95, recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
    reports: [
      { type: 'imaging', title: 'Chest X-Ray', summary: 'Mild hyperinflation', findings: ['Consistent with COPD'], date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    ],
    lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    notes: 'On inhaler and BP medication. SpO2 monitoring at home.',
  },
  {
    name: 'Sneha Reddy',
    age: 52,
    gender: 'female',
    city: 'Hyderabad',
    hospital: 'Yashoda Hospital',
    conditions: ['Hypothyroidism', 'Osteoporosis'],
    vitals: [
      { bloodPressureSystolic: 122, bloodPressureDiastolic: 78, heartRate: 72, temperature: 36.4, oxygenSaturation: 98, recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
    reports: [
      { type: 'lab', title: 'TSH', summary: 'TSH 4.2 mIU/L', findings: ['On thyroxine'], date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000) },
    ],
    lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    notes: 'Stable on thyroid medication. Calcium and D3 advised.',
  },
  {
    name: 'Kavita Nair',
    age: 38,
    gender: 'female',
    city: 'Chennai',
    hospital: 'Fortis Malar',
    conditions: ['Asthma', 'Allergic rhinitis'],
    vitals: [
      { bloodPressureSystolic: 118, bloodPressureDiastolic: 76, heartRate: 76, temperature: 36.8, oxygenSaturation: 98, recordedAt: new Date(Date.now() - 0 * 24 * 60 * 60 * 1000) },
    ],
    reports: [
      { type: 'clinical', title: 'PFT', summary: 'FEV1 82% predicted', findings: ['Reversible obstruction'], date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
    ],
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    notes: 'Inhaler use as needed. Allergy season care.',
  },
  {
    name: 'Vijay Kumar',
    age: 61,
    gender: 'male',
    city: 'Bangalore',
    hospital: 'Manipal Hospital',
    conditions: ['Coronary artery disease', 'Type 2 Diabetes', 'Hypertension'],
    vitals: [
      { bloodPressureSystolic: 132, bloodPressureDiastolic: 82, heartRate: 68, temperature: 36.6, oxygenSaturation: 97, recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
    reports: [
      { type: 'lab', title: 'HbA1c', summary: '7.1%', findings: ['Diabetes under fair control'], date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    ],
    lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    notes: 'Post-PCI. Dual antiplatelet. Regular cardiology follow-up.',
  },
  {
    name: 'Anita Desai',
    age: 41,
    gender: 'female',
    city: 'Pune',
    hospital: 'Ruby Hall',
    conditions: ['Migraine', 'GERD'],
    vitals: [
      { bloodPressureSystolic: 114, bloodPressureDiastolic: 74, heartRate: 80, temperature: 36.9, oxygenSaturation: 99, recordedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    ],
    reports: [],
    lastVisit: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    notes: 'Lifestyle and diet advice for GERD. Triptans for migraine.',
  },
  {
    name: 'Raj Mehta',
    age: 55,
    gender: 'male',
    city: 'Mumbai',
    hospital: 'Lilavati Hospital',
    conditions: ['Chronic kidney disease Stage 3', 'Hypertension'],
    vitals: [
      { bloodPressureSystolic: 140, bloodPressureDiastolic: 88, heartRate: 72, temperature: 36.5, oxygenSaturation: 98, recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
    reports: [
      { type: 'lab', title: 'Creatinine', summary: '1.4 mg/dL', findings: ['eGFR 58'], date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
    ],
    lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    notes: 'Nephrology follow-up. Low salt and protein diet.',
  },
  {
    name: 'Meera Iyer',
    age: 33,
    gender: 'female',
    city: 'Chennai',
    hospital: 'Apollo Chennai',
    conditions: ['PCOS', 'Vitamin B12 deficiency'],
    vitals: [
      { bloodPressureSystolic: 108, bloodPressureDiastolic: 70, heartRate: 84, temperature: 36.7, oxygenSaturation: 99, recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
    reports: [
      { type: 'lab', title: 'B12', summary: '280 pg/mL', findings: ['Low B12'], date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000) },
    ],
    lastVisit: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    notes: 'B12 injections. Metformin for PCOS.',
  },
  {
    name: 'Suresh Gupta',
    age: 49,
    gender: 'male',
    city: 'Kolkata',
    hospital: 'AMRI Hospital',
    conditions: ['Rheumatoid arthritis', 'Osteoarthritis'],
    vitals: [
      { bloodPressureSystolic: 126, bloodPressureDiastolic: 80, heartRate: 76, temperature: 36.8, oxygenSaturation: 98, recordedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    ],
    reports: [
      { type: 'lab', title: 'ESR', summary: '28 mm/hr', findings: ['Mild inflammation'], date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    ],
    lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    notes: 'DMARD therapy. Physiotherapy advised.',
  },
  {
    name: 'Deepa Krishnan',
    age: 67,
    gender: 'female',
    city: 'Bangalore',
    hospital: 'Narayana Health',
    conditions: ['Atrial fibrillation', 'Hypertension', 'Hypothyroidism'],
    vitals: [
      { bloodPressureSystolic: 136, bloodPressureDiastolic: 84, heartRate: 92, temperature: 36.5, oxygenSaturation: 97, recordedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    ],
    reports: [
      { type: 'lab', title: 'INR', summary: '2.1', findings: ['On warfarin'], date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    ],
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    notes: 'Anticoagulation. Rate control. Thyroid stable.',
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  await Patient.deleteMany({});
  await Patient.insertMany(patients);
  const adminExists = await User.findOne({ email: 'admin@arcadia.dev' });
  if (!adminExists) {
    await User.create({
      email: 'admin@arcadia.dev',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin',
    });
    console.log('Created admin@arcadia.dev / admin123');
  }
  console.log(`Seeded ${patients.length} patients`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
