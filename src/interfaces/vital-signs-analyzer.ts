/**
 * Vital Signs Analyzer Interface
 * Analyzes user-inputted vital signs and provides educational context
 */

import {
  VitalSignInput,
  VitalSignAnalysis,
  TrendAnalysis,
  Explanation,
  UserProfile,
  ValidationResult,
  TrendIndicator,
  TrendPattern
} from '../types';

export interface IVitalSignsAnalyzer {
  /**
   * Validate vital signs input
   * @param vitalSigns - Input vital signs data
   * @returns Validation result with errors/warnings
   */
  validateInput(vitalSigns: VitalSignInput): ValidationResult;

  /**
   * Analyze vital signs and provide assessment
   * @param vitalSigns - Vital signs to analyze
   * @returns Comprehensive analysis with educational content
   */
  analyzeVitalSigns(vitalSigns: VitalSignInput): VitalSignAnalysis;

  /**
   * Generate trend analysis from historical data
   * @param historicalData - Array of historical vital sign measurements
   * @returns Trend analysis with patterns and insights
   */
  generateTrends(historicalData: VitalSignInput[]): TrendAnalysis;

  /**
   * Explain significance of vital signs in simple language
   * @param analysis - Vital sign analysis results
   * @param userProfile - User context for cultural adaptation
   * @returns User-friendly explanation
   */
  explainSignificance(analysis: VitalSignAnalysis, userProfile: UserProfile): Explanation;

  /**
   * Check for concerning vital sign patterns
   * @param vitalSigns - Current vital signs
   * @param historicalData - Previous measurements
   * @returns Alert if concerning patterns detected
   */
  checkForConcerns(vitalSigns: VitalSignInput, historicalData?: VitalSignInput[]): VitalSignAlert | null;
}

export interface IVitalSignValidator {
  /**
   * Validate blood pressure measurements
   * @param systolic - Systolic pressure
   * @param diastolic - Diastolic pressure
   * @returns Validation result
   */
  validateBloodPressure(systolic: number, diastolic: number): ValidationResult;

  /**
   * Validate heart rate measurement
   * @param heartRate - Heart rate in BPM
   * @returns Validation result
   */
  validateHeartRate(heartRate: number): ValidationResult;

  /**
   * Validate temperature measurement
   * @param temperature - Temperature value
   * @param unit - Temperature unit (C or F)
   * @returns Validation result
   */
  validateTemperature(temperature: number, unit: 'C' | 'F'): ValidationResult;

  /**
   * Validate oxygen saturation measurement
   * @param oxygenSaturation - SpO2 percentage
   * @returns Validation result
   */
  validateOxygenSaturation(oxygenSaturation: number): ValidationResult;
}

export interface IVitalSignRangeService {
  /**
   * Get normal ranges for vital signs based on demographics
   * @param demographics - Patient demographics
   * @returns Normal ranges for all vital signs
   */
  getNormalRanges(demographics: VitalSignDemographics): VitalSignRanges;

  /**
   * Assess vital sign against normal ranges
   * @param vitalSign - Specific vital sign measurement
   * @param demographics - Patient demographics
   * @returns Assessment result
   */
  assessVitalSign(vitalSign: VitalSignMeasurement, demographics: VitalSignDemographics): VitalSignAssessment;
}

export interface VitalSignDemographics {
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'moderate' | 'active';
  medicalConditions?: string[];
}

export interface VitalSignRanges {
  bloodPressure: {
    systolic: { min: number; max: number };
    diastolic: { min: number; max: number };
  };
  heartRate: { min: number; max: number };
  temperature: { min: number; max: number; unit: 'C' };
  oxygenSaturation: { min: number; max: number };
}

export interface VitalSignMeasurement {
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'oxygen_saturation';
  value: number | { systolic: number; diastolic: number };
  unit: string;
  timestamp: Date;
}

export interface VitalSignAssessment {
  status: 'normal' | 'borderline' | 'abnormal' | 'critical';
  explanation: string;
  educationalContent: string;
  recommendedAction?: string;
}

export interface VitalSignAlert {
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  affectedVitalSigns: string[];
  recommendedActions: string[];
  seekImmediateCare: boolean;
}

export interface ITrendAnalyzer {
  /**
   * Identify patterns in vital sign data
   * @param measurements - Historical measurements
   * @returns Identified patterns
   */
  identifyPatterns(measurements: VitalSignMeasurement[]): TrendPattern[];

  /**
   * Calculate trend indicators
   * @param measurements - Historical measurements
   * @returns Trend indicators for each vital sign
   */
  calculateTrendIndicators(measurements: VitalSignMeasurement[]): TrendIndicator[];

  /**
   * Generate insights from trend analysis
   * @param patterns - Identified patterns
   * @param indicators - Trend indicators
   * @returns Human-readable insights
   */
  generateInsights(patterns: TrendPattern[], indicators: TrendIndicator[]): string[];
}