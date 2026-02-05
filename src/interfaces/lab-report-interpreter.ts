/**
 * Lab Report Interpreter Interface
 * Processes uploaded lab reports and extracts key health metrics for user-friendly explanation
 */

import {
  ParsedReport,
  HealthMetric,
  AbnormalValue,
  Explanation,
  UserProfile,
  ValidationResult,
  PatientDemographics
} from '../types';

export interface ILabReportInterpreter {
  /**
   * Parse uploaded lab report document
   * @param document - File containing lab report (PDF, image, etc.)
   * @returns Parsed report with extracted data
   */
  parseReport(document: File): Promise<ParsedReport>;

  /**
   * Extract health metrics from parsed report
   * @param parsedReport - Previously parsed report data
   * @returns Array of standardized health metrics
   */
  extractMetrics(parsedReport: ParsedReport): HealthMetric[];

  /**
   * Generate user-friendly explanations for health metrics
   * @param metrics - Health metrics to explain
   * @param userProfile - User context for cultural adaptation
   * @returns Array of explanations in simple language
   */
  explainMetrics(metrics: HealthMetric[], userProfile: UserProfile): Explanation[];

  /**
   * Identify and flag abnormal values
   * @param metrics - Health metrics to analyze
   * @returns Array of abnormal values with explanations
   */
  flagAbnormalValues(metrics: HealthMetric[]): AbnormalValue[];

  /**
   * Validate lab report format and content
   * @param document - Document to validate
   * @returns Validation result with errors/warnings
   */
  validateReport(document: File): Promise<ValidationResult>;
}

export interface IDocumentParser {
  /**
   * Extract text from various document formats
   * @param document - Document file
   * @returns Extracted text content
   */
  extractText(document: File): Promise<string>;

  /**
   * Perform OCR on scanned documents
   * @param document - Image or scanned PDF
   * @returns OCR-extracted text
   */
  performOCR(document: File): Promise<string>;

  /**
   * Detect document format and quality
   * @param document - Document to analyze
   * @returns Format and quality information
   */
  analyzeDocument(document: File): Promise<DocumentAnalysis>;
}

export interface DocumentAnalysis {
  format: 'pdf' | 'image' | 'text';
  quality: 'high' | 'medium' | 'low';
  confidence: number;
  requiresOCR: boolean;
  estimatedAccuracy: number;
}

export interface IMedicalEntityRecognizer {
  /**
   * Extract medical entities from text
   * @param text - Raw text from lab report
   * @returns Recognized medical entities
   */
  recognizeEntities(text: string): MedicalEntity[];

  /**
   * Normalize medical terminology
   * @param entities - Raw medical entities
   * @returns Standardized entities
   */
  normalizeEntities(entities: MedicalEntity[]): NormalizedEntity[];
}

export interface MedicalEntity {
  text: string;
  type: 'test_name' | 'value' | 'unit' | 'reference_range' | 'patient_info';
  confidence: number;
  position: {
    start: number;
    end: number;
  };
}

export interface NormalizedEntity {
  standardName: string;
  originalText: string;
  category: string;
  mappingConfidence: number;
}

export interface IReferenceRangeService {
  /**
   * Get reference ranges for a specific test
   * @param testName - Standardized test name
   * @param demographics - Patient demographics
   * @returns Reference range information
   */
  getReferenceRange(testName: string, demographics: PatientDemographics): ReferenceRangeInfo;

  /**
   * Compare value against reference range
   * @param testName - Test name
   * @param value - Test value
   * @param demographics - Patient demographics
   * @returns Comparison result
   */
  compareToRange(testName: string, value: number, demographics: PatientDemographics): RangeComparison;
}

export interface ReferenceRangeInfo {
  testName: string;
  normalRange: {
    min: number;
    max: number;
  };
  unit: string;
  ageSpecific: boolean;
  genderSpecific: boolean;
  source: string;
}

export interface RangeComparison {
  status: 'normal' | 'high' | 'low' | 'critical_high' | 'critical_low';
  deviation: number;
  significance: 'mild' | 'moderate' | 'severe';
  explanation: string;
}