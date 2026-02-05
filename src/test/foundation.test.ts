/**
 * Foundation Property-Based Tests
 * Tests core system properties and interfaces
 * Feature: arcadia-health
 */

import * as fc from 'fast-check';
import { ArcadiaHealthSystem, createArcadiaHealthSystem } from '../index';
import {
  userProfileGen,
  healthMetricGen,
  simpleTextGen,
  medicalTermGen,
  consistentHealthDataGen,
  diverseUserProfileGen
} from './generators';

describe('Arcadia Health Foundation', () => {
  let system: ArcadiaHealthSystem;

  beforeEach(async () => {
    system = await createArcadiaHealthSystem();
  });

  afterEach(async () => {
    await system.shutdown();
  });

  describe('System Initialization', () => {
    test('should initialize with default configuration', async () => {
      const newSystem = new ArcadiaHealthSystem();
      await newSystem.initialize();
      
      const config = newSystem.getConfig();
      expect(config.encryption.algorithm).toBe('aes-256-gcm');
      expect(config.encryption.keySize).toBe(256);
      expect(config.languages.supported).toContain('en');
      expect(config.languages.supported).toContain('hi');
      expect(config.performance.responseTimeTarget).toBe(5000);
      expect(config.privacy.consentRequired).toBe(true);
      
      await newSystem.shutdown();
    });

    test('should provide health status', () => {
      const status = system.getHealthStatus();
      expect(status.initialized).toBe(true);
      expect(status.encryptionService).toBe('healthy');
      expect(status.secureStorage).toBe('healthy');
      expect(status.dataRetentionManager).toBe('healthy');
      expect(status.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('Encryption Service Properties', () => {
    test('Property: Encryption roundtrip preserves data', () => {
      fc.assert(fc.property(
        fc.string({ minLength: 1, maxLength: 1000 }),
        (data) => {
          const encryptionService = system.getEncryptionService();
          const encrypted = encryptionService.encrypt(data);
          const decrypted = encryptionService.decrypt(encrypted);
          
          expect(decrypted).toBe(data);
          expect(encrypted.algorithm).toBe('aes-256-cbc');
          expect(encrypted.encryptedData).not.toBe(data);
          expect(encrypted.iv).toBeDefined();
        }
      ));
    });

    test('Property: Hash verification is consistent', () => {
      fc.assert(fc.property(
        fc.string({ minLength: 1, maxLength: 1000 }),
        (data) => {
          const encryptionService = system.getEncryptionService();
          const hash = encryptionService.hash(data);
          const isValid = encryptionService.verifyHash(data, hash);
          
          expect(isValid).toBe(true);
          expect(hash.algorithm).toBe('pbkdf2-sha512');
          expect(hash.hash).toBeDefined();
          expect(hash.salt).toBeDefined();
        }
      ));
    });

    test('Property: Different data produces different hashes', () => {
      fc.assert(fc.property(
        fc.string({ minLength: 1, maxLength: 500 }),
        fc.string({ minLength: 1, maxLength: 500 }),
        (data1, data2) => {
          fc.pre(data1 !== data2); // Only test with different data
          
          const encryptionService = system.getEncryptionService();
          const hash1 = encryptionService.hash(data1);
          const hash2 = encryptionService.hash(data2);
          
          expect(hash1.hash).not.toBe(hash2.hash);
        }
      ));
    });
  });

  describe('Secure Storage Properties', () => {
    test('Property: Storage roundtrip preserves data structure', async () => {
      await fc.assert(fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.record({
          id: fc.uuid(),
          value: fc.integer(),
          text: fc.string(),
          flag: fc.boolean()
        }),
        async (key, data) => {
          const storage = system.getSecureStorage();
          
          const stored = await storage.store(key, data);
          expect(stored).toBe(true);
          
          const retrieved = await storage.retrieve<typeof data>(key);
          expect(retrieved).toEqual(data);
          
          // Cleanup
          await storage.delete(key);
        }
      ));
    });

    test('Property: TTL expiration works correctly', async () => {
      await fc.assert(fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.integer({ min: 1, max: 2 }), // Short TTL for testing
        async (key, data, ttl) => {
          const storage = system.getSecureStorage();
          
          await storage.store(key, data, ttl);
          expect(await storage.exists(key)).toBe(true);
          
          // Wait for expiration
          await new Promise(resolve => setTimeout(resolve, (ttl + 1) * 1000));
          
          expect(await storage.exists(key)).toBe(false);
          expect(await storage.retrieve(key)).toBeNull();
        }
      ), { timeout: 10000 });
    });
  });

  describe('Type System Properties', () => {
    test('Property: User profiles have consistent cultural context', () => {
      fc.assert(fc.property(
        diverseUserProfileGen,
        (profile) => {
          // Validate that cultural context is consistent with location and language
          expect(profile.id).toBeDefined();
          expect(profile.preferredLanguage).toBeDefined();
          expect(profile.culturalContext.primaryLanguage).toBeDefined();
          expect(profile.location.state).toBeDefined();
          expect(profile.location.pincode).toMatch(/^\d{6}$/);
          
          // Cultural context should be coherent
          expect(profile.culturalContext.region).toBeDefined();
          expect(profile.culturalContext.educationLevel).toBe(profile.educationLevel);
        }
      ));
    });

    test('Property: Health metrics have valid ranges', () => {
      fc.assert(fc.property(
        healthMetricGen,
        (metric) => {
          expect(metric.name).toBeDefined();
          expect(metric.value).toBeDefined();
          expect(metric.unit).toBeDefined();
          expect(metric.referenceRange.min).toBeLessThanOrEqual(metric.referenceRange.max);
          expect(metric.category).toBeDefined();
          
          if (typeof metric.value === 'number') {
            expect(metric.value).toBeGreaterThanOrEqual(0);
          }
        }
      ));
    });

    test('Property: Health data maintains referential integrity', () => {
      fc.assert(fc.property(
        consistentHealthDataGen,
        (healthData) => {
          expect(healthData.userId).toBeDefined();
          expect(healthData.dataType).toBeDefined();
          expect(healthData.timestamp).toBeInstanceOf(Date);
          expect(healthData.values.length).toBeGreaterThan(0);
          expect(healthData.source.reliability).toBeGreaterThanOrEqual(0);
          expect(healthData.source.reliability).toBeLessThanOrEqual(1);
          
          // All values should have consistent structure
          healthData.values.forEach(value => {
            expect(value.metric).toBeDefined();
            expect(value.confidence).toBeGreaterThanOrEqual(0);
            expect(value.confidence).toBeLessThanOrEqual(1);
            expect(value.interpretation.status).toBeDefined();
          });
        }
      ));
    });
  });

  describe('Safety Boundary Properties', () => {
    test('Property: Simple text should not contain medical advice', () => {
      fc.assert(fc.property(
        simpleTextGen,
        (text) => {
          expect(text).toContainNoMedicalAdvice();
        }
      ));
    });

    test('Property: Generated text should be simple language', () => {
      fc.assert(fc.property(
        simpleTextGen,
        (text) => {
          expect(text).toBeSimpleLanguage();
        }
      ));
    });

    test('Property: Medical terms should not appear in simple explanations', () => {
      fc.assert(fc.property(
        medicalTermGen,
        simpleTextGen,
        (medicalTerm, explanation) => {
          // If explanation contains the medical term, it should be in a safe context
          if (explanation.toLowerCase().includes(medicalTerm.toLowerCase())) {
            expect(explanation).toContainNoMedicalAdvice();
          }
        }
      ));
    });
  });

  describe('Cultural Appropriateness Properties', () => {
    test('Property: Content should be culturally appropriate', () => {
      fc.assert(fc.property(
        simpleTextGen,
        (content) => {
          expect(content).toBeCulturallyAppropriate();
        }
      ));
    });

    test('Property: User profiles should have valid cultural contexts', () => {
      fc.assert(fc.property(
        userProfileGen,
        (profile) => {
          const { culturalContext } = profile;
          
          // Cultural context should be internally consistent
          expect(culturalContext.region).toBeDefined();
          expect(culturalContext.primaryLanguage).toBeDefined();
          expect(culturalContext.educationLevel).toBeDefined();
          
          // Health beliefs should be reasonable
          culturalContext.healthBeliefs.forEach(belief => {
            expect(belief.category).toBeDefined();
            expect(belief.description.length).toBeGreaterThan(5);
            expect(['positive', 'neutral', 'negative']).toContain(belief.influence);
          });
          
          // Local practices should be reasonable
          culturalContext.localPractices.forEach(practice => {
            expect(practice.name.length).toBeGreaterThan(3);
            expect(practice.description.length).toBeGreaterThan(5);
            expect(['supportive', 'neutral', 'concerning']).toContain(practice.medicalRelevance);
          });
        }
      ));
    });
  });

  describe('Performance Properties', () => {
    test('Property: System operations should complete within timeout', async () => {
      const startTime = Date.now();
      
      // Test basic system operations
      const config = system.getConfig();
      const status = system.getHealthStatus();
      const encryptionService = system.getEncryptionService();
      const storage = system.getSecureStorage();
      
      // Simple operations
      const testData = 'test data';
      const encrypted = encryptionService.encrypt(testData);
      const decrypted = encryptionService.decrypt(encrypted);
      
      await storage.store('test-key', { data: 'test' });
      const retrieved = await storage.retrieve('test-key');
      await storage.delete('test-key');
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete well within the 5-second target
      expect(duration).toBeLessThan(1000); // 1 second for basic operations
      expect(config).toBeDefined();
      expect(status.initialized).toBe(true);
      expect(decrypted).toBe(testData);
      expect(retrieved).toEqual({ data: 'test' });
    });
  });
});

// Feature: arcadia-health, Property 9: Data Security
describe('Property 9: Data Security', () => {
  test('**Validates: Requirements 6.1, 6.2, 6.4**', async () => {
    await fc.assert(fc.asyncProperty(
      consistentHealthDataGen,
      fc.string({ minLength: 1, maxLength: 100 }),
      async (healthData, encryptionKey) => {
        const system = await createArcadiaHealthSystem();
        const encryptionService = system.getEncryptionService();
        const storage = system.getSecureStorage();
        
        // Test encryption during storage
        const serializedData = JSON.stringify(healthData);
        const encrypted = encryptionService.encrypt(serializedData, encryptionKey);
        
        // Verify encryption properties
        expect(encrypted.algorithm).toBe('aes-256-cbc');
        expect(encrypted.encryptedData).not.toBe(serializedData);
        expect(encrypted.iv).toBeDefined();
        expect(encrypted.timestamp).toBeInstanceOf(Date);
        
        // Test secure storage
        const storageKey = `health-data-${healthData.userId}`;
        await storage.store(storageKey, healthData);
        const retrieved = await storage.retrieve(storageKey);
        
        expect(retrieved).toEqual(healthData);
        
        // Test data retention policy
        const retentionManager = system.getDataRetentionManager();
        const retentionPeriod = retentionManager.getRetentionPeriod(healthData.dataType);
        expect(retentionPeriod).toBeGreaterThan(0);
        
        // Cleanup
        await storage.delete(storageKey);
        await system.shutdown();
      }
    ));
  });
});