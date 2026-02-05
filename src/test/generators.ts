/**
 * Property-based test generators
 * Custom generators for health data, user profiles, and cultural contexts
 */

import * as fc from 'fast-check';
import {
  Language,
  EducationLevel,
  ComplexityLevel,
  UrgencyLevel,
  HealthDataType,
  MetricCategory,
  UserProfile,
  CulturalContext,
  HealthData,
  VitalSignInput,
  SymptomInput,
  Location,
  BloodPressure,
  HealthMetric,
  Range
} from '../types';

// ============================================================================
// Basic Type Generators
// ============================================================================

export const languageGen = fc.constantFrom<Language>(
  'en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'or'
);

export const educationLevelGen = fc.constantFrom<EducationLevel>(
  'basic', 'primary', 'secondary', 'higher_secondary', 'graduate', 'postgraduate'
);

export const complexityLevelGen = fc.constantFrom<ComplexityLevel>(
  'simple', 'intermediate', 'advanced'
);

export const urgencyLevelGen = fc.constantFrom<UrgencyLevel>(
  'immediate', 'within_24_hours', 'within_week'
);

export const healthDataTypeGen = fc.constantFrom<HealthDataType>(
  'lab_report', 'vital_signs', 'symptoms', 'medical_history'
);

export const metricCategoryGen = fc.constantFrom<MetricCategory>(
  'blood_chemistry', 'hematology', 'immunology', 'microbiology', 'vital_signs'
);

// ============================================================================
// Location Generators
// ============================================================================

export const locationGen = fc.record({
  state: fc.constantFrom(
    'Uttar Pradesh', 'Maharashtra', 'Bihar', 'West Bengal', 'Madhya Pradesh',
    'Tamil Nadu', 'Rajasthan', 'Karnataka', 'Gujarat', 'Andhra Pradesh'
  ),
  district: fc.string({ minLength: 3, maxLength: 20 }),
  pincode: fc.string({ minLength: 6, maxLength: 6 }).filter(s => /^\d{6}$/.test(s)),
  coordinates: fc.option(fc.record({
    latitude: fc.float({ min: Math.fround(8.0), max: Math.fround(37.0) }), // India's latitude range
    longitude: fc.float({ min: Math.fround(68.0), max: Math.fround(97.0) }) // India's longitude range
  }))
}) as fc.Arbitrary<Location>;

// ============================================================================
// Cultural Context Generators
// ============================================================================

export const culturalContextGen = fc.record({
  region: fc.constantFrom('North', 'South', 'East', 'West', 'Central', 'Northeast'),
  primaryLanguage: languageGen,
  educationLevel: educationLevelGen,
  healthBeliefs: fc.array(fc.record({
    category: fc.constantFrom('traditional', 'religious', 'modern', 'family'),
    description: fc.string({ minLength: 10, maxLength: 100 }),
    influence: fc.constantFrom('positive', 'neutral', 'negative')
  }), { minLength: 0, maxLength: 5 }),
  localPractices: fc.array(fc.record({
    name: fc.string({ minLength: 5, maxLength: 30 }),
    description: fc.string({ minLength: 10, maxLength: 100 }),
    medicalRelevance: fc.constantFrom('supportive', 'neutral', 'concerning')
  }), { minLength: 0, maxLength: 3 })
}) as fc.Arbitrary<CulturalContext>;

// ============================================================================
// User Profile Generators
// ============================================================================

export const userProfileGen = fc.record({
  id: fc.uuid(),
  preferredLanguage: languageGen,
  educationLevel: educationLevelGen,
  location: locationGen,
  culturalContext: culturalContextGen,
  accessibilityNeeds: fc.array(fc.record({
    type: fc.constantFrom('visual', 'auditory', 'motor', 'cognitive'),
    severity: fc.constantFrom('mild', 'moderate', 'severe'),
    accommodations: fc.array(fc.string({ minLength: 5, maxLength: 50 }), { maxLength: 3 })
  }), { maxLength: 2 }),
  communicationPreferences: fc.array(fc.record({
    modality: fc.constantFrom('text', 'voice', 'visual'),
    preference: fc.constantFrom('primary', 'secondary', 'fallback'),
    settings: fc.dictionary(fc.string(), fc.anything())
  }), { minLength: 1, maxLength: 3 }),
  createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
  lastUpdated: fc.date({ min: new Date('2020-01-01'), max: new Date() })
}) as fc.Arbitrary<UserProfile>;

// ============================================================================
// Health Data Generators
// ============================================================================

export const rangeGen = fc.record({
  min: fc.float({ min: Math.fround(0), max: Math.fround(1000) }),
  max: fc.float({ min: Math.fround(0), max: Math.fround(1000) }),
  unit: fc.constantFrom('mg/dL', 'g/dL', 'mmol/L', 'IU/L', 'ng/mL', '%'),
  ageGroup: fc.option(fc.constantFrom('child', 'adult', 'elderly')),
  gender: fc.option(fc.constantFrom('male', 'female', 'other'))
}).filter(r => r.min <= r.max) as fc.Arbitrary<Range>;

export const healthMetricGen = fc.record({
  name: fc.constantFrom(
    'Hemoglobin', 'Blood Glucose', 'Cholesterol', 'Blood Pressure',
    'Heart Rate', 'Temperature', 'Oxygen Saturation'
  ),
  value: fc.oneof(
    fc.float({ min: Math.fround(0), max: Math.fround(1000) }),
    fc.string({ minLength: 1, maxLength: 20 })
  ),
  unit: fc.constantFrom('mg/dL', 'g/dL', 'mmol/L', 'bpm', '°C', '%', 'mmHg'),
  referenceRange: rangeGen,
  category: metricCategoryGen,
  abnormalityFlag: fc.option(fc.record({
    type: fc.constantFrom('high', 'low', 'critical_high', 'critical_low'),
    severity: fc.constantFrom('mild', 'moderate', 'severe'),
    explanation: fc.string({ minLength: 10, maxLength: 100 })
  }))
}) as fc.Arbitrary<HealthMetric>;

// ============================================================================
// Vital Signs Generators
// ============================================================================

export const bloodPressureGen = fc.record({
  systolic: fc.integer({ min: 70, max: 200 }),
  diastolic: fc.integer({ min: 40, max: 120 }),
  unit: fc.constant('mmHg' as const)
}).filter(bp => bp.systolic > bp.diastolic) as fc.Arbitrary<BloodPressure>;

export const vitalSignInputGen = fc.record({
  bloodPressure: fc.option(bloodPressureGen),
  heartRate: fc.option(fc.integer({ min: 30, max: 200 })),
  temperature: fc.option(fc.float({ min: Math.fround(35.0), max: Math.fround(42.0) })),
  oxygenSaturation: fc.option(fc.integer({ min: 70, max: 100 })),
  timestamp: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
  source: fc.record({
    type: fc.constantFrom('user_input', 'uploaded_document', 'device', 'healthcare_provider'),
    name: fc.string({ minLength: 3, maxLength: 30 }),
    reliability: fc.float({ min: Math.fround(0.5), max: Math.fround(1.0) }),
    timestamp: fc.date({ min: new Date('2020-01-01'), max: new Date() })
  })
}) as fc.Arbitrary<VitalSignInput>;

// ============================================================================
// Symptom Generators
// ============================================================================

export const symptomInputGen = fc.record({
  symptom: fc.constantFrom(
    'headache', 'fever', 'cough', 'chest pain', 'shortness of breath',
    'nausea', 'vomiting', 'diarrhea', 'fatigue', 'dizziness',
    'abdominal pain', 'back pain', 'joint pain', 'rash', 'sore throat'
  ),
  severity: fc.constantFrom('mild', 'moderate', 'severe'),
  duration: fc.constantFrom(
    'less than 1 hour', '1-6 hours', '6-24 hours', '1-3 days',
    '3-7 days', '1-2 weeks', 'more than 2 weeks'
  ),
  frequency: fc.constantFrom('constant', 'intermittent', 'occasional'),
  associatedSymptoms: fc.array(
    fc.constantFrom('fever', 'nausea', 'fatigue', 'dizziness', 'sweating'),
    { maxLength: 3 }
  ),
  timestamp: fc.date({ min: new Date('2020-01-01'), max: new Date() })
}) as fc.Arbitrary<SymptomInput>;

// ============================================================================
// Text Content Generators
// ============================================================================

export const simpleTextGen = fc.string({ minLength: 10, maxLength: 200 })
  .filter(s => {
    // Ensure text doesn't contain medical advice patterns
    const medicalAdvicePatterns = [
      /\b(diagnos[ei]s?|diagnose[ds]?)\b/i,
      /\b(prescrib[ei]|prescription)\b/i,
      /\b(treat(ment)? with)\b/i,
      /\b(you have|you are suffering from)\b/i
    ];
    return !medicalAdvicePatterns.some(pattern => pattern.test(s));
  });

export const medicalTermGen = fc.constantFrom(
  'hypertension', 'diabetes', 'cholesterol', 'anemia', 'infection',
  'inflammation', 'cardiovascular', 'respiratory', 'gastrointestinal'
);

export const healthTopicGen = fc.constantFrom(
  'nutrition', 'exercise', 'mental health', 'preventive care',
  'chronic disease management', 'maternal health', 'child health',
  'elderly care', 'infectious diseases', 'first aid'
);

// ============================================================================
// Lab Report Generators
// ============================================================================

export const labReportDataGen = fc.record({
  patientName: fc.option(fc.string({ minLength: 3, maxLength: 50 })),
  age: fc.option(fc.integer({ min: 1, max: 120 })),
  gender: fc.option(fc.constantFrom('male', 'female', 'other')),
  testResults: fc.array(fc.record({
    testName: fc.constantFrom(
      'Complete Blood Count', 'Blood Glucose', 'Lipid Profile',
      'Liver Function Test', 'Kidney Function Test', 'Thyroid Function'
    ),
    value: fc.oneof(fc.float({ min: Math.fround(0), max: Math.fround(1000) }), fc.string({ minLength: 1, maxLength: 20 })),
    unit: fc.constantFrom('mg/dL', 'g/dL', 'mmol/L', 'IU/L', 'ng/mL'),
    referenceRange: rangeGen,
    status: fc.constantFrom('normal', 'abnormal', 'borderline'),
    category: metricCategoryGen
  }), { minLength: 1, maxLength: 10 }),
  reportDate: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
  labFacility: fc.string({ minLength: 5, maxLength: 50 })
});

// ============================================================================
// Utility Generators
// ============================================================================

export const nonEmptyStringGen = fc.string({ minLength: 1, maxLength: 100 });

export const positiveNumberGen = fc.float({ min: Math.fround(0.1), max: Math.fround(1000) });

export const percentageGen = fc.float({ min: Math.fround(0), max: Math.fround(100) });

export const confidenceGen = fc.float({ min: Math.fround(0), max: Math.fround(1) });

// ============================================================================
// Generator Combinators
// ============================================================================

/**
 * Generate valid health data with consistent relationships
 */
export const consistentHealthDataGen = fc.record({
  userId: fc.uuid(),
  dataType: healthDataTypeGen,
  timestamp: fc.date({ min: new Date('2020-01-01'), max: new Date() }),
  values: fc.array(fc.record({
    metric: fc.string({ minLength: 3, maxLength: 30 }),
    value: fc.oneof(fc.float({ min: Math.fround(0), max: Math.fround(1000) }), fc.boolean(), fc.string({ minLength: 1, maxLength: 50 })),
    unit: fc.option(fc.constantFrom('mg/dL', 'g/dL', 'bpm', '°C', '%')),
    confidence: confidenceGen,
    interpretation: fc.record({
      status: fc.constantFrom('normal', 'abnormal', 'borderline', 'unknown'),
      significance: fc.constantFrom('low', 'medium', 'high'),
      explanation: fc.string({ minLength: 10, maxLength: 100 }),
      culturalContext: fc.option(fc.string({ minLength: 10, maxLength: 50 }))
    }),
    referenceRange: fc.option(rangeGen)
  }), { minLength: 1, maxLength: 5 }),
  source: fc.record({
    type: fc.constantFrom('user_input', 'uploaded_document', 'device', 'healthcare_provider'),
    name: fc.string({ minLength: 3, maxLength: 30 }),
    reliability: confidenceGen,
    timestamp: fc.date({ min: new Date('2020-01-01'), max: new Date() })
  }),
  privacy: fc.constantFrom('public', 'private', 'sensitive', 'highly_sensitive'),
  metadata: fc.dictionary(fc.string(), fc.anything())
}) as fc.Arbitrary<HealthData>;

/**
 * Generate culturally diverse user profiles
 */
export const diverseUserProfileGen = userProfileGen.filter(profile => {
  // Ensure cultural context matches location and language
  const regionLanguageMap: Record<string, Language[]> = {
    'North': ['hi', 'en'],
    'South': ['te', 'ta', 'kn', 'ml', 'en'],
    'East': ['bn', 'or', 'en'],
    'West': ['mr', 'gu', 'en'],
    'Central': ['hi', 'en'],
    'Northeast': ['en']
  };
  
  const validLanguages = regionLanguageMap[profile.culturalContext.region] || ['en'];
  return validLanguages.includes(profile.preferredLanguage);
});

export { fc };