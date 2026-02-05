/**
 * Cultural & Language Adapter Interface
 * Ensures culturally appropriate communication and multi-language support
 */

import {
  Language,
  CulturalContext,
  UserProfile,
  CulturalConcern,
  CulturalAdaptation
} from '../types';

export interface ICulturalLanguageAdapter {
  /**
   * Detect language from input text
   * @param input - Text input to analyze
   * @returns Detected language with confidence
   */
  detectLanguage(input: string): LanguageDetection;

  /**
   * Translate content to target language
   * @param content - Content to translate
   * @param targetLanguage - Target language
   * @returns Translated content
   */
  translateContent(content: string, targetLanguage: Language): Promise<TranslationResult>;

  /**
   * Adapt content for cultural context
   * @param content - Original content
   * @param culturalContext - Cultural context for adaptation
   * @returns Culturally adapted content
   */
  adaptCulturally(content: string, culturalContext: CulturalContext): CulturalAdaptationResult;

  /**
   * Adjust communication style based on user profile
   * @param content - Content to adjust
   * @param userProfile - User profile for style adaptation
   * @returns Style-adjusted content
   */
  adjustCommunicationStyle(content: string, userProfile: UserProfile): StyleAdaptationResult;

  /**
   * Get culturally appropriate examples for health concepts
   * @param concept - Health concept
   * @param culturalContext - Cultural context
   * @returns Culturally relevant examples
   */
  getCulturalExamples(concept: string, culturalContext: CulturalContext): CulturalExample[];
}

export interface ILanguageDetector {
  /**
   * Detect primary language of text
   * @param text - Text to analyze
   * @returns Language detection result
   */
  detectPrimaryLanguage(text: string): LanguageDetection;

  /**
   * Detect multiple languages in mixed text
   * @param text - Text with potentially multiple languages
   * @returns Array of language detections with positions
   */
  detectMultipleLanguages(text: string): MultiLanguageDetection[];

  /**
   * Get supported languages
   * @returns List of supported languages
   */
  getSupportedLanguages(): Language[];
}

export interface LanguageDetection {
  language: Language;
  confidence: number;
  script?: string;
  region?: string;
}

export interface MultiLanguageDetection extends LanguageDetection {
  startPosition: number;
  endPosition: number;
  textSegment: string;
}

export interface ITranslationService {
  /**
   * Translate text between languages
   * @param text - Text to translate
   * @param sourceLanguage - Source language (auto-detect if not provided)
   * @param targetLanguage - Target language
   * @returns Translation result
   */
  translate(
    text: string, 
    targetLanguage: Language, 
    sourceLanguage?: Language
  ): Promise<TranslationResult>;

  /**
   * Batch translate multiple texts
   * @param texts - Array of texts to translate
   * @param targetLanguage - Target language
   * @param sourceLanguage - Source language
   * @returns Array of translation results
   */
  batchTranslate(
    texts: string[], 
    targetLanguage: Language, 
    sourceLanguage?: Language
  ): Promise<TranslationResult[]>;

  /**
   * Get translation quality score
   * @param originalText - Original text
   * @param translatedText - Translated text
   * @param sourceLanguage - Source language
   * @param targetLanguage - Target language
   * @returns Quality assessment
   */
  assessTranslationQuality(
    originalText: string,
    translatedText: string,
    sourceLanguage: Language,
    targetLanguage: Language
  ): Promise<TranslationQuality>;
}

export interface TranslationResult {
  originalText: string;
  translatedText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  confidence: number;
  alternatives?: string[];
  metadata: TranslationMetadata;
}

export interface TranslationMetadata {
  method: 'neural' | 'statistical' | 'rule_based' | 'hybrid';
  processingTime: number;
  characterCount: number;
  warnings: string[];
}

export interface TranslationQuality {
  score: number; // 0-100
  fluency: number;
  adequacy: number;
  issues: QualityIssue[];
  suggestions: string[];
}

export interface QualityIssue {
  type: 'grammar' | 'terminology' | 'cultural' | 'context';
  description: string;
  severity: 'low' | 'medium' | 'high';
  position?: { start: number; end: number };
}

export interface ICulturalAdapter {
  /**
   * Adapt content for specific cultural context
   * @param content - Content to adapt
   * @param culturalContext - Target cultural context
   * @returns Culturally adapted content
   */
  adaptForCulture(content: string, culturalContext: CulturalContext): CulturalAdaptationResult;

  /**
   * Get cultural preferences for communication
   * @param culturalContext - Cultural context
   * @returns Communication preferences
   */
  getCommunicationPreferences(culturalContext: CulturalContext): CommunicationPreferences;

  /**
   * Validate cultural appropriateness
   * @param content - Content to validate
   * @param culturalContext - Cultural context
   * @returns Validation result
   */
  validateCulturalAppropriateness(
    content: string, 
    culturalContext: CulturalContext
  ): CulturalValidationResult;

  /**
   * Get local health terminology
   * @param medicalTerm - Medical term
   * @param culturalContext - Cultural context
   * @returns Local terminology options
   */
  getLocalTerminology(medicalTerm: string, culturalContext: CulturalContext): LocalTerminology[];
}

export interface CulturalAdaptationResult {
  adaptedContent: string;
  adaptations: CulturalAdaptation[];
  confidence: number;
  culturalFit: number;
}

export interface CommunicationPreferences {
  formality: 'formal' | 'informal' | 'respectful';
  directness: 'direct' | 'indirect' | 'contextual';
  familyInvolvement: 'individual' | 'family_centered' | 'community_oriented';
  authorityRelation: 'hierarchical' | 'egalitarian' | 'respectful_questioning';
  emotionalExpression: 'open' | 'reserved' | 'contextual';
  decisionMaking: 'autonomous' | 'consultative' | 'collective';
}

export interface CulturalValidationResult {
  isAppropriate: boolean;
  score: number; // 0-100
  concerns: CulturalConcern[];
  recommendations: CulturalRecommendation[];
}

export interface CulturalRecommendation {
  area: string;
  recommendation: string;
  rationale: string;
  priority: 'low' | 'medium' | 'high';
}

export interface LocalTerminology {
  medicalTerm: string;
  localTerm: string;
  language: Language;
  region: string;
  usage: 'common' | 'formal' | 'traditional';
  context: string;
}

export interface IStyleAdapter {
  /**
   * Adapt communication style for user profile
   * @param content - Content to adapt
   * @param userProfile - User profile
   * @returns Style-adapted content
   */
  adaptStyle(content: string, userProfile: UserProfile): StyleAdaptationResult;

  /**
   * Adjust complexity level
   * @param content - Content to adjust
   * @param targetComplexity - Target complexity level
   * @returns Complexity-adjusted content
   */
  adjustComplexity(content: string, targetComplexity: number): ComplexityAdjustmentResult;

  /**
   * Personalize tone and approach
   * @param content - Content to personalize
   * @param personalityProfile - User personality profile
   * @returns Personalized content
   */
  personalizeTone(content: string, personalityProfile: PersonalityProfile): ToneAdaptationResult;
}

export interface StyleAdaptationResult {
  adaptedContent: string;
  styleChanges: StyleChange[];
  readabilityScore: number;
  appropriatenessScore: number;
}

export interface StyleChange {
  type: 'vocabulary' | 'sentence_structure' | 'tone' | 'formality' | 'examples';
  original: string;
  adapted: string;
  reason: string;
}

export interface ComplexityAdjustmentResult {
  adjustedContent: string;
  originalComplexity: number;
  targetComplexity: number;
  achievedComplexity: number;
  adjustments: ComplexityAdjustment[];
}

export interface ComplexityAdjustment {
  type: 'vocabulary' | 'sentence_length' | 'concept_explanation' | 'structure';
  description: string;
  impact: number;
}

export interface PersonalityProfile {
  communicationStyle: 'analytical' | 'expressive' | 'amiable' | 'driver';
  informationPreference: 'detailed' | 'summary' | 'visual' | 'interactive';
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  decisionMaking: 'quick' | 'deliberate' | 'consultative';
}

export interface ToneAdaptationResult {
  adaptedContent: string;
  toneAdjustments: ToneAdjustment[];
  personalityFit: number;
}

export interface ToneAdjustment {
  aspect: 'warmth' | 'authority' | 'empathy' | 'encouragement' | 'clarity';
  original: string;
  adapted: string;
  rationale: string;
}

export interface CulturalExample {
  concept: string;
  example: string;
  culturalRelevance: string;
  appropriateness: number;
  context: string;
}