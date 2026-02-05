/**
 * Arcadia Health - Main Entry Point
 * AI-powered healthcare assistant ecosystem for rural and semi-urban India
 */

import { SystemConfig, EncryptionConfig, LanguageConfig, PerformanceConfig, PrivacyConfig } from './types';
import { EncryptionService, SecureStorage, DataRetentionManager } from './services/encryption';

/**
 * Default system configuration
 */
export const defaultConfig: SystemConfig = {
  encryption: {
    algorithm: 'aes-256-gcm',
    keySize: 256,
    rotationPeriod: 30 // days
  } as EncryptionConfig,
  
  languages: {
    supported: ['en', 'hi', 'bn', 'te', 'ta', 'mr', 'gu', 'kn', 'ml', 'or'],
    default: 'en',
    translationService: 'google-translate'
  } as LanguageConfig,
  
  performance: {
    responseTimeTarget: 5000, // 5 seconds
    cacheSize: 100, // MB
    offlineCapability: true
  } as PerformanceConfig,
  
  privacy: {
    dataRetentionPeriod: 365, // days
    anonymizationRules: [
      'remove_personal_identifiers',
      'hash_sensitive_data',
      'aggregate_statistics_only'
    ],
    consentRequired: true
  } as PrivacyConfig
};

/**
 * Arcadia Health System
 * Main system class that orchestrates all components
 */
export class ArcadiaHealthSystem {
  private config: SystemConfig;
  private encryptionService: EncryptionService;
  private secureStorage: SecureStorage;
  private dataRetentionManager: DataRetentionManager;
  private initialized: boolean = false;

  constructor(config: SystemConfig = defaultConfig) {
    this.config = config;
    this.encryptionService = new EncryptionService(config.encryption);
    this.secureStorage = new SecureStorage(this.encryptionService);
    this.dataRetentionManager = new DataRetentionManager(this.secureStorage);
  }

  /**
   * Initialize the Arcadia Health system
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize encryption service
      console.log('Initializing encryption service...');
      
      // Set up data retention policies
      console.log('Setting up data retention policies...');
      this.dataRetentionManager.setRetentionPolicy('lab_report', this.config.privacy.dataRetentionPeriod);
      this.dataRetentionManager.setRetentionPolicy('vital_signs', 180); // 6 months
      this.dataRetentionManager.setRetentionPolicy('symptoms', 90); // 3 months
      
      // Initialize offline capabilities if enabled
      if (this.config.performance.offlineCapability) {
        console.log('Enabling offline capabilities...');
      }

      this.initialized = true;
      console.log('Arcadia Health system initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Arcadia Health system:', error);
      throw error;
    }
  }

  /**
   * Get system configuration
   */
  getConfig(): SystemConfig {
    return { ...this.config };
  }

  /**
   * Get encryption service
   */
  getEncryptionService(): EncryptionService {
    this.ensureInitialized();
    return this.encryptionService;
  }

  /**
   * Get secure storage service
   */
  getSecureStorage(): SecureStorage {
    this.ensureInitialized();
    return this.secureStorage;
  }

  /**
   * Get data retention manager
   */
  getDataRetentionManager(): DataRetentionManager {
    this.ensureInitialized();
    return this.dataRetentionManager;
  }

  /**
   * Shutdown the system gracefully
   */
  async shutdown(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      console.log('Shutting down Arcadia Health system...');
      
      // Purge expired data before shutdown
      await this.dataRetentionManager.purgeExpiredData();
      
      this.initialized = false;
      console.log('Arcadia Health system shut down successfully');
    } catch (error) {
      console.error('Error during system shutdown:', error);
      throw error;
    }
  }

  /**
   * Get system health status
   */
  getHealthStatus(): SystemHealthStatus {
    return {
      initialized: this.initialized,
      encryptionService: this.encryptionService ? 'healthy' : 'unavailable',
      secureStorage: this.secureStorage ? 'healthy' : 'unavailable',
      dataRetentionManager: this.dataRetentionManager ? 'healthy' : 'unavailable',
      timestamp: new Date()
    };
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error('Arcadia Health system not initialized. Call initialize() first.');
    }
  }
}

export interface SystemHealthStatus {
  initialized: boolean;
  encryptionService: 'healthy' | 'degraded' | 'unavailable';
  secureStorage: 'healthy' | 'degraded' | 'unavailable';
  dataRetentionManager: 'healthy' | 'degraded' | 'unavailable';
  timestamp: Date;
}

/**
 * Create and initialize a new Arcadia Health system instance
 */
export async function createArcadiaHealthSystem(config?: Partial<SystemConfig>): Promise<ArcadiaHealthSystem> {
  const fullConfig = { ...defaultConfig, ...config };
  const system = new ArcadiaHealthSystem(fullConfig);
  await system.initialize();
  return system;
}

// Export all types and interfaces
export * from './types';
export * from './interfaces/lab-report-interpreter';
export * from './interfaces/vital-signs-analyzer';
export * from './interfaces/triage-assistant';
export * from './interfaces/educational-content-provider';
export * from './interfaces/cultural-language-adapter';
export * from './services/encryption';

// Export test utilities for development
export * from './test/generators';

/**
 * Version information
 */
export const VERSION = '1.0.0';
export const BUILD_DATE = new Date().toISOString();

console.log(`Arcadia Health v${VERSION} - AI-powered healthcare assistant for rural and semi-urban India`);
console.log(`Build date: ${BUILD_DATE}`);
console.log('Prioritizing safety boundaries, cultural sensitivity, and offline capability');