const Patient = require('../models/Patient');

const list = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, city, search } = req.query;
    const skip = (Math.max(1, parseInt(page, 10)) - 1) * Math.min(50, Math.max(1, parseInt(limit, 10)));
    const lim = Math.min(50, Math.max(1, parseInt(limit, 10)));
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (search) filter.$or = [
      { name: new RegExp(search, 'i') },
      { city: new RegExp(search, 'i') },
      { hospital: new RegExp(search, 'i') },
      { conditions: new RegExp(search, 'i') },
    ];
    const [patients, total] = await Promise.all([
      Patient.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(lim).lean(),
      Patient.countDocuments(filter),
    ]);
    res.json({ patients, total, page: parseInt(page, 10), limit: lim });
  } catch (err) {
    next(err);
  }
};

const getById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).lean();
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json(patient);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json(patient);
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { list, getById, create, update, remove };
