/**
 * Triage Assistant Interface
 * Provides guidance on healthcare urgency levels without diagnosing conditions
 */

import {
  SymptomInput,
  TriageAssessment,
  UrgencyLevel,
  CareRecommendation,
  EmergencyAlert,
  Location,
  UserProfile,
  PatientDemographics,
  RiskFactor
} from '../types';

export interface ITriageAssistant {
  /**
   * Assess symptoms and determine urgency level
   * @param symptoms - Array of symptom inputs
   * @returns Triage assessment with urgency level
   */
  assessSymptoms(symptoms: SymptomInput[]): TriageAssessment;

  /**
   * Determine urgency level from assessment
   * @param assessment - Triage assessment results
   * @returns Urgency level classification
   */
  determineUrgency(assessment: TriageAssessment): UrgencyLevel;

  /**
   * Recommend appropriate care based on urgency
   * @param urgency - Urgency level
   * @param location - User location for facility recommendations
   * @returns Care recommendations
   */
  recommendCare(urgency: UrgencyLevel, location: Location): CareRecommendation;

  /**
   * Check for emergency situations requiring immediate attention
   * @param symptoms - Symptom inputs to evaluate
   * @returns Emergency alert if critical situation detected
   */
  identifyEmergency(symptoms: SymptomInput[]): EmergencyAlert | null;

  /**
   * Provide culturally appropriate triage guidance
   * @param assessment - Triage assessment
   * @param userProfile - User cultural context
   * @returns Culturally adapted guidance
   */
  provideCulturalGuidance(assessment: TriageAssessment, userProfile: UserProfile): CulturalTriageGuidance;
}

export interface ISymptomProcessor {
  /**
   * Process and standardize symptom descriptions
   * @param rawSymptoms - Raw symptom descriptions
   * @returns Standardized symptom data
   */
  processSymptoms(rawSymptoms: string[]): ProcessedSymptom[];

  /**
   * Extract severity indicators from symptom descriptions
   * @param symptomText - Symptom description text
   * @returns Severity assessment
   */
  extractSeverity(symptomText: string): SeverityAssessment;

  /**
   * Identify symptom clusters and patterns
   * @param symptoms - Array of processed symptoms
   * @returns Symptom clusters
   */
  identifySymptomClusters(symptoms: ProcessedSymptom[]): SymptomCluster[];
}

export interface ProcessedSymptom {
  standardName: string;
  originalDescription: string;
  category: SymptomCategory;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  frequency: 'constant' | 'intermittent' | 'occasional';
  associatedSymptoms: string[];
  redFlags: RedFlag[];
}

export interface SeverityAssessment {
  level: 'mild' | 'moderate' | 'severe';
  confidence: number;
  indicators: string[];
  reasoning: string;
}

export interface SymptomCluster {
  name: string;
  symptoms: string[];
  urgencyImplication: 'low' | 'medium' | 'high';
  commonCauses: string[];
  redFlags: RedFlag[];
}

export interface RedFlag {
  type: 'emergency' | 'urgent' | 'concerning';
  description: string;
  action: string;
  timeframe: string;
}

export type SymptomCategory = 
  | 'cardiovascular'
  | 'respiratory' 
  | 'gastrointestinal'
  | 'neurological'
  | 'musculoskeletal'
  | 'dermatological'
  | 'genitourinary'
  | 'endocrine'
  | 'psychiatric'
  | 'general';

export interface IUrgencyCalculator {
  /**
   * Calculate urgency score based on symptoms and risk factors
   * @param symptoms - Processed symptoms
   * @param riskFactors - Patient risk factors
   * @returns Urgency score (0-100)
   */
  calculateUrgencyScore(symptoms: ProcessedSymptom[], riskFactors: RiskFactor[]): number;

  /**
   * Apply urgency modifiers based on patient demographics
   * @param baseScore - Base urgency score
   * @param demographics - Patient demographics
   * @returns Modified urgency score
   */
  applyDemographicModifiers(baseScore: number, demographics: PatientDemographics): number;

  /**
   * Convert urgency score to urgency level
   * @param score - Urgency score
   * @returns Urgency level classification
   */
  scoreToUrgencyLevel(score: number): UrgencyLevel;
}

export interface IFacilityRecommendationService {
  /**
   * Find appropriate healthcare facilities based on urgency and location
   * @param urgency - Urgency level
   * @param location - Patient location
   * @param facilityPreferences - User facility preferences
   * @returns Recommended facilities
   */
  findFacilities(
    urgency: UrgencyLevel, 
    location: Location, 
    facilityPreferences?: FacilityPreferences
  ): HealthcareFacility[];

  /**
   * Get estimated wait times for facilities
   * @param facilities - Healthcare facilities
   * @param urgency - Urgency level
   * @returns Facilities with wait time estimates
   */
  getWaitTimes(facilities: HealthcareFacility[], urgency: UrgencyLevel): FacilityWithWaitTime[];
}

export interface FacilityPreferences {
  language: string[];
  insurance: string[];
  specialties: string[];
  maxDistance: number; // in kilometers
}

export interface HealthcareFacility {
  id: string;
  name: string;
  type: 'emergency' | 'hospital' | 'clinic' | 'primary_care' | 'specialist';
  location: Location;
  distance: number; // in kilometers
  languages: string[];
  specialties: string[];
  contactInfo: ContactInfo;
  availability: FacilityAvailability;
}

export interface ContactInfo {
  phone: string;
  emergencyPhone?: string;
  address: string;
  website?: string;
}

export interface FacilityAvailability {
  isOpen: boolean;
  hours: string;
  emergencyServices: boolean;
  acceptsWalkIns: boolean;
}

export interface FacilityWithWaitTime extends HealthcareFacility {
  estimatedWaitTime: string;
  currentLoad: 'low' | 'medium' | 'high';
}

export interface CulturalTriageGuidance {
  guidance: string;
  culturalConsiderations: string[];
  localHealthPractices: string[];
  familyInvolvement: string;
  communicationStyle: string;
  barriers: CulturalBarrier[];
  facilitators: CulturalFacilitator[];
}

export interface CulturalBarrier {
  type: 'language' | 'financial' | 'transportation' | 'cultural_belief' | 'gender';
  description: string;
  mitigation: string;
}

export interface CulturalFacilitator {
  type: 'community_health_worker' | 'translator' | 'cultural_mediator' | 'family_support';
  description: string;
  availability: string;
}