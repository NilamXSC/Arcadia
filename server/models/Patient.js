const mongoose = require('mongoose');

const vitalSchema = new mongoose.Schema({
  bloodPressureSystolic: Number,
  bloodPressureDiastolic: Number,
  heartRate: Number,
  temperature: Number,
  oxygenSaturation: Number,
  recordedAt: { type: Date, default: Date.now },
});

const reportSchema = new mongoose.Schema({
  type: { type: String, enum: ['lab', 'imaging', 'clinical'], required: true },
  title: String,
  summary: String,
  findings: [String],
  date: { type: Date, default: Date.now },
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 0, max: 120 },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  city: { type: String, required: true, trim: true },
  hospital: { type: String, required: true, trim: true },
  conditions: [{ type: String, trim: true }],
  vitals: [vitalSchema],
  reports: [reportSchema],
  lastVisit: Date,
  notes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Patient', patientSchema);
