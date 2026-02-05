/**
 * Encryption Service
 * Provides AES-256 encryption for health data security
 * Implements Requirements 6.1 and 6.2 for data protection
 */

import * as crypto from 'node:crypto';
import { EncryptionConfig } from '../types';

export interface IEncryptionService {
  /**
   * Encrypt sensitive data
   * @param data - Data to encrypt
   * @param key - Encryption key (optional, uses default if not provided)
   * @returns Encrypted data with metadata
   */
  encrypt(data: string, key?: string): EncryptionResult;

  /**
   * Decrypt encrypted data
   * @param encryptedData - Encrypted data with metadata
   * @param key - Decryption key (optional, uses default if not provided)
   * @returns Decrypted data
   */
  decrypt(encryptedData: EncryptionResult, key?: string): string;

  /**
   * Generate a new encryption key
   * @returns Base64 encoded encryption key
   */
  generateKey(): string;

  /**
   * Hash data for integrity verification
   * @param data - Data to hash
   * @returns Hash result
   */
  hash(data: string): HashResult;

  /**
   * Verify data integrity
   * @param data - Original data
   * @param hash - Hash to verify against
   * @returns True if data matches hash
   */
  verifyHash(data: string, hash: HashResult): boolean;
}

export interface EncryptionResult {
  encryptedData: string;
  iv: string;
  algorithm: string;
  keyId?: string;
  timestamp: Date;
}

export interface HashResult {
  hash: string;
  algorithm: string;
  salt: string;
  timestamp: Date;
}

export class EncryptionService implements IEncryptionService {
  private readonly algorithm = 'aes-256-cbc';
  private readonly keyLength = 32; // 256 bits
  private readonly ivLength = 16; // 128 bits
  private readonly saltLength = 32; // 256 bits
  private readonly defaultKey: string;

  constructor(config: EncryptionConfig, defaultKey?: string) {
    this.defaultKey = defaultKey || this.generateKey();
    
    // Validate configuration
    if (config.keySize !== 256) {
      throw new Error('Only AES-256 is supported');
    }
  }

  encrypt(data: string, key?: string): EncryptionResult {
    try {
      const encryptionKey = key ? Buffer.from(key, 'base64') : Buffer.from(this.defaultKey, 'base64');
      
      if (encryptionKey.length !== this.keyLength) {
        throw new Error('Invalid key length');
      }

      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipheriv(this.algorithm, encryptionKey, iv);

      let encrypted = cipher.update(data, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      return {
        encryptedData: encrypted,
        iv: iv.toString('base64'),
        algorithm: this.algorithm,
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  decrypt(encryptedData: EncryptionResult, key?: string): string {
    try {
      const decryptionKey = key ? Buffer.from(key, 'base64') : Buffer.from(this.defaultKey, 'base64');
      
      if (decryptionKey.length !== this.keyLength) {
        throw new Error('Invalid key length');
      }

      const iv = Buffer.from(encryptedData.iv, 'base64');
      const decipher = crypto.createDecipheriv(encryptedData.algorithm, decryptionKey, iv);

      let decrypted = decipher.update(encryptedData.encryptedData, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      return decrypted;
    } catch (error) {
      throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  generateKey(): string {
    const key = crypto.randomBytes(this.keyLength);
    return key.toString('base64');
  }

  hash(data: string): HashResult {
    try {
      const salt = crypto.randomBytes(this.saltLength);
      const hash = crypto.pbkdf2Sync(data, salt, 100000, 64, 'sha512');

      return {
        hash: hash.toString('base64'),
        algorithm: 'pbkdf2-sha512',
        salt: salt.toString('base64'),
        timestamp: new Date()
      };
    } catch (error) {
      throw new Error(`Hashing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  verifyHash(data: string, hashResult: HashResult): boolean {
    try {
      const salt = Buffer.from(hashResult.salt, 'base64');
      const hash = crypto.pbkdf2Sync(data, salt, 100000, 64, 'sha512');
      const expectedHash = Buffer.from(hashResult.hash, 'base64');

      return crypto.timingSafeEqual(hash, expectedHash);
    } catch (error) {
      return false;
    }
  }
}

/**
 * Secure data storage utility
 * Handles encrypted storage and retrieval of health data
 */
export interface ISecureStorage {
  /**
   * Store encrypted data
   * @param key - Storage key
   * @param data - Data to store
   * @param ttl - Time to live in seconds (optional)
   * @returns Success status
   */
  store(key: string, data: unknown, ttl?: number): Promise<boolean>;

  /**
   * Retrieve and decrypt data
   * @param key - Storage key
   * @returns Decrypted data or null if not found
   */
  retrieve<T>(key: string): Promise<T | null>;

  /**
   * Delete stored data
   * @param key - Storage key
   * @returns Success status
   */
  delete(key: string): Promise<boolean>;

  /**
   * Check if data exists
   * @param key - Storage key
   * @returns True if data exists
   */
  exists(key: string): Promise<boolean>;

  /**
   * Clear expired data
   * @returns Number of items cleared
   */
  clearExpired(): Promise<number>;
}

export class SecureStorage implements ISecureStorage {
  private storage: Map<string, StoredItem> = new Map();
  private encryptionService: IEncryptionService;

  constructor(encryptionService: IEncryptionService) {
    this.encryptionService = encryptionService;
    
    // Set up periodic cleanup of expired items
    setInterval(() => {
      void this.clearExpired();
    }, 60000); // Check every minute
  }

  async store(key: string, data: unknown, ttl?: number): Promise<boolean> {
    try {
      const serializedData = JSON.stringify(data);
      const encrypted = this.encryptionService.encrypt(serializedData);
      
      const expiresAt = ttl ? new Date(Date.now() + ttl * 1000) : undefined;
      
      const item: StoredItem = {
        data: encrypted,
        createdAt: new Date(),
        ...(expiresAt && { expiresAt })
      };
      
      this.storage.set(key, item);

      return true;
    } catch (error) {
      console.error('Failed to store data:', error);
      return false;
    }
  }

  async retrieve<T>(key: string): Promise<T | null> {
    try {
      const item = this.storage.get(key);
      
      if (!item) {
        return null;
      }

      // Check if expired
      if (item.expiresAt && item.expiresAt < new Date()) {
        this.storage.delete(key);
        return null;
      }

      const decrypted = this.encryptionService.decrypt(item.data);
      return JSON.parse(decrypted) as T;
    } catch (error) {
      console.error('Failed to retrieve data:', error);
      return null;
    }
  }

  async delete(key: string): Promise<boolean> {
    return this.storage.delete(key);
  }

  async exists(key: string): Promise<boolean> {
    const item = this.storage.get(key);
    
    if (!item) {
      return false;
    }

    // Check if expired
    if (item.expiresAt && item.expiresAt < new Date()) {
      this.storage.delete(key);
      return false;
    }

    return true;
  }

  async clearExpired(): Promise<number> {
    let cleared = 0;
    const now = new Date();

    for (const [key, item] of this.storage.entries()) {
      if (item.expiresAt && item.expiresAt < now) {
        this.storage.delete(key);
        cleared++;
      }
    }

    return cleared;
  }
}

interface StoredItem {
  data: EncryptionResult;
  createdAt: Date;
  expiresAt?: Date;
}

/**
 * Data retention policy manager
 * Implements automatic data purging based on retention policies
 */
export interface IDataRetentionManager {
  /**
   * Set retention policy for data type
   * @param dataType - Type of data
   * @param retentionPeriod - Retention period in days
   */
  setRetentionPolicy(dataType: string, retentionPeriod: number): void;

  /**
   * Check if data should be retained
   * @param dataType - Type of data
   * @param createdAt - When data was created
   * @returns True if data should be retained
   */
  shouldRetain(dataType: string, createdAt: Date): boolean;

  /**
   * Get retention period for data type
   * @param dataType - Type of data
   * @returns Retention period in days
   */
  getRetentionPeriod(dataType: string): number;

  /**
   * Purge expired data
   * @param dataType - Type of data to purge (optional, purges all if not specified)
   * @returns Number of items purged
   */
  purgeExpiredData(dataType?: string): Promise<number>;
}

export class DataRetentionManager implements IDataRetentionManager {
  private retentionPolicies: Map<string, number> = new Map();
  private secureStorage: ISecureStorage;

  constructor(secureStorage: ISecureStorage) {
    this.secureStorage = secureStorage;
    
    // Set default retention policies (in days)
    this.setRetentionPolicy('lab_report', 365); // 1 year
    this.setRetentionPolicy('vital_signs', 180); // 6 months
    this.setRetentionPolicy('symptoms', 90); // 3 months
    this.setRetentionPolicy('educational_content', 30); // 1 month
    this.setRetentionPolicy('user_session', 7); // 1 week
  }

  setRetentionPolicy(dataType: string, retentionPeriod: number): void {
    if (retentionPeriod <= 0) {
      throw new Error('Retention period must be positive');
    }
    this.retentionPolicies.set(dataType, retentionPeriod);
  }

  shouldRetain(dataType: string, createdAt: Date): boolean {
    const retentionPeriod = this.getRetentionPeriod(dataType);
    const expirationDate = new Date(createdAt.getTime() + retentionPeriod * 24 * 60 * 60 * 1000);
    return new Date() < expirationDate;
  }

  getRetentionPeriod(dataType: string): number {
    return this.retentionPolicies.get(dataType) || 30; // Default 30 days
  }

  async purgeExpiredData(): Promise<number> {
    // This is a simplified implementation
    // In a real system, this would iterate through stored data
    // and remove items based on their creation date and retention policy
    
    let purged = 0;
    
    // For now, just clear expired items from secure storage
    purged += await this.secureStorage.clearExpired();
    
    return purged;
  }
}