/**
 * Test setup configuration
 * Configures Jest and fast-check for property-based testing
 */

import * as fc from 'fast-check';

// Configure fast-check for property-based testing
fc.configureGlobal({
  numRuns: 100, // Minimum 100 iterations per property test
  seed: 42, // Fixed seed for reproducible tests
  verbose: true,
  markInterruptAsFailure: true,
  interruptAfterTimeLimit: 30000, // 30 second timeout
});

// Global test timeout
jest.setTimeout(30000);

// Mock console methods in tests to reduce noise
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Reset console mocks before each test
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterEach(() => {
  // Restore console methods after each test
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidHealthData(): R;
      toContainNoMedicalAdvice(): R;
      toBeSimpleLanguage(): R;
      toBeCulturallyAppropriate(): R;
    }
  }
}

// Custom Jest matchers for health data validation
expect.extend({
  toBeValidHealthData(received: unknown) {
    const pass = received !== null && 
                 received !== undefined && 
                 typeof received === 'object';
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be valid health data`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be valid health data`,
        pass: false,
      };
    }
  },

  toContainNoMedicalAdvice(received: string) {
    const medicalAdvicePatterns = [
      /\b(diagnos[ei]s?|diagnose[ds]?)\b/i,
      /\b(prescrib[ei]|prescription|medication for)\b/i,
      /\b(treat(ment)? with|take this (drug|medicine))\b/i,
      /\b(you have|you are suffering from)\b/i,
      /\b(cure[ds]?|healing|remedy for)\b/i
    ];

    const containsAdvice = medicalAdvicePatterns.some(pattern => pattern.test(received));
    
    if (!containsAdvice) {
      return {
        message: () => `expected "${received}" to contain medical advice`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected "${received}" not to contain medical advice`,
        pass: false,
      };
    }
  },

  toBeSimpleLanguage(received: string) {
    // Simple heuristics for language complexity
    const avgWordsPerSentence = received.split(/[.!?]+/).reduce((acc, sentence) => {
      const words = sentence.trim().split(/\s+/).length;
      return acc + words;
    }, 0) / received.split(/[.!?]+/).length;

    const complexWords = received.split(/\s+/).filter(word => 
      word.length > 8 || /[A-Z]{2,}/.test(word)
    ).length;

    const complexityRatio = complexWords / received.split(/\s+/).length;
    
    const isSimple = avgWordsPerSentence <= 15 && complexityRatio <= 0.1;
    
    if (isSimple) {
      return {
        message: () => `expected "${received}" not to be simple language`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected "${received}" to be simple language (avg words per sentence: ${avgWordsPerSentence}, complexity ratio: ${complexityRatio})`,
        pass: false,
      };
    }
  },

  toBeCulturallyAppropriate(received: string) {
    // Basic checks for cultural appropriateness
    const inappropriatePatterns = [
      /\b(primitive|backward|uneducated)\b/i,
      /\b(superstition|myth|folklore)\b/i,
      /\b(modern medicine is better)\b/i
    ];

    const isInappropriate = inappropriatePatterns.some(pattern => pattern.test(received));
    
    if (!isInappropriate) {
      return {
        message: () => `expected "${received}" to be culturally inappropriate`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected "${received}" to be culturally appropriate`,
        pass: false,
      };
    }
  },
});

export {};