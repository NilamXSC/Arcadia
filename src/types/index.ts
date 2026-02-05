/**
 * Core type definitions for Arcadia Health system
 * Defines fundamental interfaces for health data, user profiles, and system components
 */

// ============================================================================
// Core System Types
// ============================================================================

export type Language = 'en' | 'hi' | 'bn' | 'te' | 'ta' | 'mr' | 'gu' | 'kn' | 'ml' | 'or';

export type EducationLevel = 'basic' | 'primary' | 'secondary' | 'higher_secondary' | 'graduate' | 'postgraduate';

export type ComplexityLevel = 'simple' | 'intermediate' | 'advanced';

export type PrivacyLevel = 'public' | 'private' | 'sensitive' | 'highly_sensitive';

export type UrgencyLevel = 'immediate' | 'within_24_hours' | 'within_week';

export type AssessmentLevel = 'normal' | 'attention_needed' | 'concerning' | 'urgent';

export type HealthDataType = 'lab_report' | 'vital_signs' | 'symptoms' | 'medical_history';

export type MetricCategory = 'blood_chemistry' | 'hematology' | 'immunology' | 'microbiology' | 'vital_signs';

export type VisualType = 'chart' | 'graph' | 'icon' | 'illustration' | 'infographic';

// ============================================================================
// Location and Cultural Context
// ============================================================================

export interface Location {
  state: string;
  district: string;
  pincode: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface CulturalContext {
  region: string;
  primaryLanguage: Language;
  educationLevel: EducationLevel;
  healthBeliefs: HealthBelief[];
  localPractices: LocalPractice[];
}

export interface CulturalConcern {
  type: 'language' | 'belief' | 'practice' | 'sensitivity' | 'religious' | 'social' | 'gender' | 'age' | 'economic' | 'educational';
  description: string;
  impact?: 'low' | 'medium' | 'high';
  severity?: 'low' | 'medium' | 'high';
}

export interface HealthBelief {
  category: string;
  description: string;
  influence: 'positive' | 'neutral' | 'negative';
}

export interface LocalPractice {
  name: string;
  description: string;
  medicalRelevance: 'supportive' | 'neutral' | 'concerning';
}

// ============================================================================
// User Profile and Preferences
// ============================================================================

export interface UserProfile {
  id: string;
  preferredLanguage: Language;
  educationLevel: EducationLevel;
  location: Location;
  culturalContext: CulturalContext;
  accessibilityNeeds: AccessibilityNeed[];
  communicationPreferences: CommunicationPreference[];
  createdAt: Date;
  lastUpdated: Date;
}

export interface AccessibilityNeed {
  type: 'visual' | 'auditory' | 'motor' | 'cognitive';
  severity: 'mild' | 'moderate' | 'severe';
  accommodations: string[];
}

export interface CommunicationPreference {
  modality: 'text' | 'voice' | 'visual';
  preference: 'primary' | 'secondary' | 'fallback';
  settings: Record<string, unknown>;
}

// ============================================================================
// Health Data Models
// ============================================================================

export interface HealthData {
  userId: string;
  dataType: HealthDataType;
  timestamp: Date;
  values: HealthValue[];
  source: DataSource;
  privacy: PrivacyLevel;
  metadata: Record<string, unknown>;
}

export interface HealthValue {
  metric: string;
  value: string | number | boolean;
  unit?: string;
  confidence: number;
  interpretation: Interpretation;
  referenceRange?: Range;
}

export interface DataSource {
  type: 'user_input' | 'uploaded_document' | 'device' | 'healthcare_provider';
  name: string;
  reliability: number;
  timestamp: Date;
}

export interface Range {
  min: number;
  max: number;
  unit: string;
  ageGroup?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface Interpretation {
  status: 'normal' | 'abnormal' | 'borderline' | 'unknown';
  significance: 'low' | 'medium' | 'high';
  explanation: string;
  culturalContext?: string;
}

// ============================================================================
// Lab Report Types
// ============================================================================

export interface ParsedReport {
  patientInfo: PatientInfo;
  testResults: TestResult[];
  reportDate: Date;
  labFacility: string;
  reportId?: string;
  metadata: Record<string, unknown>;
}

export interface PatientInfo {
  name?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  id?: string;
}

export interface PatientDemographics {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  ethnicity?: string;
  region?: string;
  chronicConditions?: string[];
  medications?: string[];
  pregnancyStatus?: boolean;
  immunocompromised?: boolean;
}

export interface TestResult {
  testName: string;
  value: string | number;
  unit?: string;
  referenceRange?: Range;
  status: 'normal' | 'abnormal' | 'borderline';
  category: MetricCategory;
}

export interface HealthMetric {
  name: string;
  value: number | string;
  unit: string;
  referenceRange: Range;
  category: MetricCategory;
  abnormalityFlag?: AbnormalityFlag;
}

export interface AbnormalityFlag {
  type: 'high' | 'low' | 'critical_high' | 'critical_low';
  severity: 'mild' | 'moderate' | 'severe';
  explanation: string;
}

export interface AbnormalValue {
  metric: HealthMetric;
  flag: AbnormalityFlag;
  educationalContent: string;
  recommendedAction: string;
}

// ============================================================================
// Vital Signs Types
// ============================================================================

export interface VitalSignInput {
  bloodPressure?: BloodPressure;
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  timestamp: Date;
  source: DataSource;
}

export interface BloodPressure {
  systolic: number;
  diastolic: number;
  unit: 'mmHg';
}

export interface VitalSignAnalysis {
  metrics: AnalyzedMetric[];
  overallAssessment: AssessmentLevel;
  educationalContent: string[];
  trendIndicators: TrendIndicator[];
  recommendations: string[];
}

export interface AnalyzedMetric {
  name: string;
  value: number | BloodPressure;
  unit: string;
  status: 'normal' | 'abnormal' | 'borderline';
  interpretation: string;
  culturalExplanation?: string;
}

export interface TrendIndicator {
  metric: string;
  direction: 'improving' | 'stable' | 'worsening';
  timeframe: string;
  significance: 'low' | 'medium' | 'high';
}

export interface TrendAnalysis {
  patterns: TrendPattern[];
  insights: string[];
  recommendations: string[];
}

export interface TrendPattern {
  metric: string;
  pattern: 'increasing' | 'decreasing' | 'stable' | 'fluctuating';
  duration: string;
  confidence: number;
}

// ============================================================================
// Triage and Symptom Types
// ============================================================================

export interface SymptomInput {
  symptom: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  frequency: 'constant' | 'intermittent' | 'occasional';
  associatedSymptoms: string[];
  timestamp: Date;
}

export interface TriageAssessment {
  urgencyScore: number;
  urgencyLevel: UrgencyLevel;
  riskFactors: RiskFactor[];
  recommendedActions: Action[];
  timeframe: string;
  reasoning: string;
}

export interface RiskFactor {
  factor: string;
  category?: 'age' | 'chronic_condition' | 'medication' | 'lifestyle' | 'family_history';
  severity: 'low' | 'medium' | 'high';
  impact: string;
  urgencyModifier?: number; // Multiplier for urgency score
}

export interface Action {
  type: 'seek_care' | 'monitor' | 'lifestyle' | 'emergency';
  description: string;
  priority: 'immediate' | 'urgent' | 'routine';
  culturalConsiderations?: string;
}

export interface CareRecommendation {
  urgencyLevel: UrgencyLevel;
  facilityType: 'emergency' | 'hospital' | 'clinic' | 'primary_care';
  recommendations: string[];
  culturalGuidance: string[];
  estimatedWaitTime?: string;
}

export interface EmergencyAlert {
  severity: 'critical' | 'urgent';
  message: string;
  immediateActions: string[];
  contactNumbers: string[];
}

// ============================================================================
// Educational Content Types
// ============================================================================

export interface EducationalContent {
  id: string;
  title: string;
  content: string;
  complexity: ComplexityLevel;
  culturalAdaptations: CulturalAdaptation[];
  relatedTopics: string[];
  lastUpdated: Date;
  sources: ContentSource[];
}

export interface CulturalAdaptation {
  region?: string;
  language?: Language;
  adaptedContent?: string;
  culturalNotes?: string[];
  type?: 'terminology' | 'example' | 'analogy' | 'reference' | 'tone';
  original?: string;
  adapted?: string;
  rationale?: string;
}

export interface ContentSource {
  type: 'medical_journal' | 'health_organization' | 'government' | 'expert_review';
  name: string;
  url?: string;
  credibility: number;
}

export interface ContentFilter {
  complexity?: ComplexityLevel;
  language?: Language;
  region?: string;
  topics?: string[];
}

export interface SearchResult {
  content: EducationalContent;
  relevanceScore: number;
  matchedTerms: string[];
}

// ============================================================================
// Explanation and Communication Types
// ============================================================================

export interface Explanation {
  content: string;
  simplificationLevel: number;
  culturalAdaptations: string[];
  visualAids: VisualAid[];
  audioContent?: AudioContent;
  relatedEducation: string[];
  safetyBoundaries: SafetyBoundary[];
}

export interface VisualAid {
  type: VisualType;
  content: string;
  description: string;
  culturallyAppropriate: boolean;
  accessibilityText: string;
}

export interface AudioContent {
  language: Language;
  audioUrl: string;
  transcript: string;
  duration: number;
}

export interface SafetyBoundary {
  type: 'no_diagnosis' | 'no_prescription' | 'seek_professional_care';
  message: string;
  emphasis: 'low' | 'medium' | 'high';
}

// ============================================================================
// Validation and Error Types
// ============================================================================

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion: string;
}

// ============================================================================
// System Configuration Types
// ============================================================================

export interface SystemConfig {
  encryption: EncryptionConfig;
  languages: LanguageConfig;
  performance: PerformanceConfig;
  privacy: PrivacyConfig;
}

export interface EncryptionConfig {
  algorithm: string;
  keySize: number;
  rotationPeriod: number;
}

export interface LanguageConfig {
  supported: Language[];
  default: Language;
  translationService: string;
}

export interface PerformanceConfig {
  responseTimeTarget: number;
  cacheSize: number;
  offlineCapability: boolean;
}

export interface PrivacyConfig {
  dataRetentionPeriod: number;
  anonymizationRules: string[];
  consentRequired: boolean;
}