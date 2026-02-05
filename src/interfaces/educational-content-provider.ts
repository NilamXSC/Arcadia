/**
 * Educational Content Provider Interface
 * Delivers culturally appropriate health education content
 */

import {
  EducationalContent,
  CulturalContext,
  UserProfile,
  ContentFilter,
  SearchResult,
  ComplexityLevel,
  Language,
  CulturalConcern
} from '../types';

export interface IEducationalContentProvider {
  /**
   * Get educational content based on topic and user profile
   * @param topic - Health topic to retrieve content for
   * @param userProfile - User context for personalization
   * @returns Personalized educational content
   */
  getContent(topic: string, userProfile: UserProfile): Promise<EducationalContent>;

  /**
   * Adapt content for cultural context
   * @param content - Original educational content
   * @param culturalContext - Cultural adaptation context
   * @returns Culturally adapted content
   */
  adaptContent(content: EducationalContent, culturalContext: CulturalContext): AdaptedContent;

  /**
   * Generate simple explanations for medical terms
   * @param medicalTerm - Medical term to explain
   * @param simplificationLevel - Level of simplification (1-5)
   * @returns Simple language explanation
   */
  generateExplanation(medicalTerm: string, simplificationLevel: number): string;

  /**
   * Search educational content
   * @param query - Search query
   * @param filters - Content filters
   * @returns Search results with relevance scores
   */
  searchContent(query: string, filters: ContentFilter[]): Promise<SearchResult[]>;

  /**
   * Get related topics for a given health topic
   * @param topic - Primary health topic
   * @param userProfile - User context
   * @returns Related topics with relevance
   */
  getRelatedTopics(topic: string, userProfile: UserProfile): RelatedTopic[];
}

export interface IContentRepository {
  /**
   * Retrieve content by ID
   * @param contentId - Unique content identifier
   * @returns Educational content
   */
  getById(contentId: string): Promise<EducationalContent | null>;

  /**
   * Search content by topic
   * @param topic - Topic to search for
   * @param filters - Optional filters
   * @returns Matching content
   */
  searchByTopic(topic: string, filters?: ContentFilter): Promise<EducationalContent[]>;

  /**
   * Get content by category
   * @param category - Content category
   * @param limit - Maximum number of results
   * @returns Content in category
   */
  getByCategory(category: ContentCategory, limit?: number): Promise<EducationalContent[]>;

  /**
   * Add new educational content
   * @param content - Content to add
   * @returns Success status
   */
  addContent(content: EducationalContent): Promise<boolean>;

  /**
   * Update existing content
   * @param contentId - Content ID to update
   * @param updates - Content updates
   * @returns Success status
   */
  updateContent(contentId: string, updates: Partial<EducationalContent>): Promise<boolean>;
}

export interface AdaptedContent {
  originalContent: EducationalContent;
  adaptedText: string;
  culturalNotes: string[];
  localExamples: string[];
  visualAdaptations: VisualAdaptation[];
  languageAdaptations: LanguageAdaptation[];
}

export interface VisualAdaptation {
  originalVisual: string;
  adaptedVisual: string;
  culturalRelevance: string;
  accessibilityDescription: string;
}

export interface LanguageAdaptation {
  originalLanguage: Language;
  targetLanguage: Language;
  translatedContent: string;
  culturalNuances: string[];
  localTerminology: LocalTermMapping[];
}

export interface LocalTermMapping {
  medicalTerm: string;
  localTerm: string;
  context: string;
  usage: string;
}

export interface RelatedTopic {
  topic: string;
  relevanceScore: number;
  relationship: 'prerequisite' | 'related' | 'advanced' | 'alternative';
  description: string;
}

export type ContentCategory = 
  | 'prevention'
  | 'nutrition'
  | 'exercise'
  | 'mental_health'
  | 'chronic_conditions'
  | 'maternal_health'
  | 'child_health'
  | 'elderly_care'
  | 'infectious_diseases'
  | 'first_aid'
  | 'medication_safety'
  | 'health_screening';

export interface IContentPersonalizer {
  /**
   * Personalize content based on user profile
   * @param content - Original content
   * @param userProfile - User profile for personalization
   * @returns Personalized content
   */
  personalizeContent(content: EducationalContent, userProfile: UserProfile): PersonalizedContent;

  /**
   * Adjust complexity level for user
   * @param content - Original content
   * @param targetComplexity - Target complexity level
   * @returns Content adjusted to complexity level
   */
  adjustComplexity(content: EducationalContent, targetComplexity: ComplexityLevel): EducationalContent;

  /**
   * Add cultural context to content
   * @param content - Original content
   * @param culturalContext - Cultural context to apply
   * @returns Content with cultural context
   */
  addCulturalContext(content: EducationalContent, culturalContext: CulturalContext): EducationalContent;
}

export interface PersonalizedContent {
  content: EducationalContent;
  personalizations: Personalization[];
  relevanceScore: number;
  engagementPrediction: number;
}

export interface Personalization {
  type: 'language' | 'complexity' | 'cultural' | 'demographic' | 'preference';
  description: string;
  confidence: number;
}

export interface IContentValidator {
  /**
   * Validate content for medical accuracy
   * @param content - Content to validate
   * @returns Validation results
   */
  validateMedicalAccuracy(content: EducationalContent): ContentValidation;

  /**
   * Check for inappropriate medical advice
   * @param content - Content to check
   * @returns Safety validation results
   */
  validateSafetyBoundaries(content: EducationalContent): SafetyValidation;

  /**
   * Validate cultural appropriateness
   * @param content - Content to validate
   * @param culturalContext - Cultural context
   * @returns Cultural validation results
   */
  validateCulturalAppropriateness(
    content: EducationalContent, 
    culturalContext: CulturalContext
  ): CulturalValidation;

  /**
   * Check language simplicity
   * @param text - Text to analyze
   * @param targetLevel - Target simplicity level
   * @returns Language complexity analysis
   */
  validateLanguageSimplicity(text: string, targetLevel: ComplexityLevel): LanguageValidation;
}

export interface ContentValidation {
  isValid: boolean;
  accuracy: number;
  sources: SourceValidation[];
  recommendations: string[];
  warnings: string[];
}

export interface SourceValidation {
  source: string;
  credibility: number;
  recency: number;
  relevance: number;
}

export interface SafetyValidation {
  isSafe: boolean;
  violations: SafetyViolation[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface SafetyViolation {
  type: 'diagnosis' | 'prescription' | 'treatment_advice' | 'emergency_advice';
  description: string;
  severity: 'low' | 'medium' | 'high';
  suggestion: string;
}

export interface CulturalValidation {
  isAppropriate: boolean;
  culturalFit: number;
  concerns: CulturalConcern[];
  suggestions: CulturalSuggestion[];
}

export interface CulturalSuggestion {
  area: string;
  suggestion: string;
  rationale: string;
  priority: 'low' | 'medium' | 'high';
}

export interface LanguageValidation {
  complexityScore: number;
  targetComplexity: ComplexityLevel;
  isAppropriate: boolean;
  issues: LanguageIssue[];
  suggestions: LanguageSuggestion[];
}

export interface LanguageIssue {
  type: 'jargon' | 'complexity' | 'length' | 'structure';
  text: string;
  severity: 'low' | 'medium' | 'high';
}

export interface LanguageSuggestion {
  original: string;
  suggested: string;
  rationale: string;
}