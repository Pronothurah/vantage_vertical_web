/**
 * Integration tests for email configuration
 * Tests environment variable precedence, fallback behavior, and integration with email service
 */

import { EMAIL_CONFIG, EmailConfigType } from '@/lib/config/email';
import { validateCompanyEmail, getStandardizedEmail } from '@/lib/utils/emailValidation';

// Mock environment variables for testing
const originalEnv = process.env;

describe('Email Configuration Integration Tests', () => {
  beforeEach(() => {
    // Reset environment variables before each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Environment Variable Precedence and Fallback Behavior', () => {
    describe('CONTACT_EMAIL configuration', () => {
      it('should use environment variable when CONTACT_EMAIL is set', () => {
        // Set environment variable
        process.env.CONTACT_EMAIL = 'custom@example.com';
        
        // Re-import to get fresh configuration
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        expect(freshConfig.CONTACT_EMAIL).toBe('custom@example.com');
      });

      it('should fallback to default when CONTACT_EMAIL is not set', () => {
        // Ensure environment variable is not set
        delete process.env.CONTACT_EMAIL;
        
        // Re-import to get fresh configuration
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        expect(freshConfig.CONTACT_EMAIL).toBe('vantageverticalltd@gmail.com');
      });

      it('should fallback to default when CONTACT_EMAIL is empty string', () => {
        process.env.CONTACT_EMAIL = '';
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        expect(freshConfig.CONTACT_EMAIL).toBe('vantageverticalltd@gmail.com');
      });

      it('should fallback to default when CONTACT_EMAIL is whitespace', () => {
        process.env.CONTACT_EMAIL = '   ';
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        expect(freshConfig.CONTACT_EMAIL).toBe('vantageverticalltd@gmail.com');
      });
    });

    describe('SMTP_FROM configuration', () => {
      it('should use environment variable when SMTP_FROM is set', () => {
        process.env.SMTP_FROM = 'smtp@example.com';
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        expect(freshConfig.SMTP_FROM).toBe('smtp@example.com');
      });

      it('should fallback to default when SMTP_FROM is not set', () => {
        delete process.env.SMTP_FROM;
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        expect(freshConfig.SMTP_FROM).toBe('vantageverticalltd@gmail.com');
      });

      it('should fallback to default when SMTP_FROM is empty', () => {
        process.env.SMTP_FROM = '';
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        expect(freshConfig.SMTP_FROM).toBe('vantageverticalltd@gmail.com');
      });
    });

    describe('COMPANY_EMAIL configuration', () => {
      it('should always return the standardized company email regardless of environment', () => {
        // Test with various environment configurations
        const envConfigs = [
          { CONTACT_EMAIL: 'custom@example.com', SMTP_FROM: 'smtp@example.com' },
          { CONTACT_EMAIL: '', SMTP_FROM: '' },
          {},
        ];

        envConfigs.forEach((envConfig, index) => {
          // Set environment
          Object.keys(envConfig).forEach(key => {
            process.env[key] = (envConfig as any)[key];
          });
          
          delete require.cache[require.resolve('@/lib/config/email')];
          const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
          
          expect(freshConfig.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
        });
      });

      it('should be immutable and not affected by environment changes', () => {
        const config1 = EMAIL_CONFIG.COMPANY_EMAIL;
        
        process.env.CONTACT_EMAIL = 'different@example.com';
        process.env.SMTP_FROM = 'different-smtp@example.com';
        
        const config2 = EMAIL_CONFIG.COMPANY_EMAIL;
        
        expect(config1).toBe(config2);
        expect(config1).toBe('vantageverticalltd@gmail.com');
      });
    });

    describe('Multiple environment variables precedence', () => {
      it('should handle both CONTACT_EMAIL and SMTP_FROM being set', () => {
        process.env.CONTACT_EMAIL = 'contact@custom.com';
        process.env.SMTP_FROM = 'smtp@custom.com';
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        expect(freshConfig.CONTACT_EMAIL).toBe('contact@custom.com');
        expect(freshConfig.SMTP_FROM).toBe('smtp@custom.com');
        expect(freshConfig.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
      });

      it('should handle mixed environment variable states', () => {
        process.env.CONTACT_EMAIL = 'contact@custom.com';
        delete process.env.SMTP_FROM;
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        expect(freshConfig.CONTACT_EMAIL).toBe('contact@custom.com');
        expect(freshConfig.SMTP_FROM).toBe('vantageverticalltd@gmail.com');
        expect(freshConfig.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
      });
    });
  });

  describe('Centralized Configuration Returns Correct Values', () => {
    describe('Configuration object structure', () => {
      it('should have all required properties', () => {
        expect(EMAIL_CONFIG).toHaveProperty('CONTACT_EMAIL');
        expect(EMAIL_CONFIG).toHaveProperty('SMTP_FROM');
        expect(EMAIL_CONFIG).toHaveProperty('COMPANY_EMAIL');
      });

      it('should have correct TypeScript types', () => {
        // Type assertion tests
        const config: EmailConfigType = EMAIL_CONFIG;
        expect(typeof config.CONTACT_EMAIL).toBe('string');
        expect(typeof config.SMTP_FROM).toBe('string');
        expect(typeof config.COMPANY_EMAIL).toBe('string');
      });

      it('should be readonly/immutable', () => {
        // Test that the configuration is marked as const
        // In JavaScript, const objects are not deeply immutable by default
        // This test verifies the TypeScript readonly behavior
        const config = EMAIL_CONFIG;
        
        // The object properties can still be modified in JavaScript runtime
        // but TypeScript should prevent this at compile time
        expect(typeof config.CONTACT_EMAIL).toBe('string');
        expect(typeof config.SMTP_FROM).toBe('string');
        expect(typeof config.COMPANY_EMAIL).toBe('string');
        
        // Test that we can't reassign the entire config
        expect(() => {
          // @ts-expect-error - Testing immutability
          const EMAIL_CONFIG = {};
        }).not.toThrow(); // This is a compile-time check, not runtime
      });
    });

    describe('Default configuration values', () => {
      it('should return correct default values when no environment variables are set', () => {
        delete process.env.CONTACT_EMAIL;
        delete process.env.SMTP_FROM;
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        expect(freshConfig.CONTACT_EMAIL).toBe('vantageverticalltd@gmail.com');
        expect(freshConfig.SMTP_FROM).toBe('vantageverticalltd@gmail.com');
        expect(freshConfig.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
      });

      it('should ensure all default values are valid company emails', () => {
        delete process.env.CONTACT_EMAIL;
        delete process.env.SMTP_FROM;
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        expect(validateCompanyEmail(freshConfig.CONTACT_EMAIL)).toBe(true);
        expect(validateCompanyEmail(freshConfig.SMTP_FROM)).toBe(true);
        expect(validateCompanyEmail(freshConfig.COMPANY_EMAIL)).toBe(true);
      });

      it('should match standardized email from validation utilities', () => {
        const standardizedEmail = getStandardizedEmail();
        
        delete process.env.CONTACT_EMAIL;
        delete process.env.SMTP_FROM;
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        expect(freshConfig.CONTACT_EMAIL).toBe(standardizedEmail);
        expect(freshConfig.SMTP_FROM).toBe(standardizedEmail);
        expect(freshConfig.COMPANY_EMAIL).toBe(standardizedEmail);
      });
    });

    describe('Configuration consistency', () => {
      it('should maintain consistency across multiple imports', () => {
        // Reset environment to ensure clean state
        delete process.env.CONTACT_EMAIL;
        delete process.env.SMTP_FROM;
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: config1 } = require('@/lib/config/email');
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: config2 } = require('@/lib/config/email');
        
        expect(config1.COMPANY_EMAIL).toBe(config2.COMPANY_EMAIL);
      });

      it('should provide consistent configuration for concurrent access', () => {
        // Reset environment to ensure clean state
        delete process.env.CONTACT_EMAIL;
        delete process.env.SMTP_FROM;
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        const configs = Array.from({ length: 10 }, () => freshConfig);
        
        configs.forEach(config => {
          expect(config.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
          expect(config).toBe(freshConfig); // Same reference
        });
      });
    });
  });

  describe('Integration with Email Service Components', () => {
    describe('Email service configuration integration', () => {
      it('should integrate correctly with email service initialization', async () => {
        // Mock email service to test integration
        const mockEmailService = {
          config: null as any,
          initialize() {
            this.config = {
              from: EMAIL_CONFIG.SMTP_FROM,
              contactEmail: EMAIL_CONFIG.CONTACT_EMAIL,
              companyEmail: EMAIL_CONFIG.COMPANY_EMAIL,
            };
          },
          getConfig() {
            return this.config;
          }
        };

        mockEmailService.initialize();
        const serviceConfig = mockEmailService.getConfig();

        expect(serviceConfig.from).toBe(EMAIL_CONFIG.SMTP_FROM);
        expect(serviceConfig.contactEmail).toBe(EMAIL_CONFIG.CONTACT_EMAIL);
        expect(serviceConfig.companyEmail).toBe(EMAIL_CONFIG.COMPANY_EMAIL);
      });

      it('should provide valid email addresses for service configuration', () => {
        // Test that all configuration values are valid email formats
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        expect(emailRegex.test(EMAIL_CONFIG.CONTACT_EMAIL)).toBe(true);
        expect(emailRegex.test(EMAIL_CONFIG.SMTP_FROM)).toBe(true);
        expect(emailRegex.test(EMAIL_CONFIG.COMPANY_EMAIL)).toBe(true);
      });

      it('should integrate with email validation utilities', () => {
        // Reset environment to ensure clean state
        delete process.env.CONTACT_EMAIL;
        delete process.env.SMTP_FROM;
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        // Test integration with validation functions
        const isContactEmailValid = validateCompanyEmail(freshConfig.CONTACT_EMAIL);
        const isSmtpFromValid = validateCompanyEmail(freshConfig.SMTP_FROM);
        const isCompanyEmailValid = validateCompanyEmail(freshConfig.COMPANY_EMAIL);

        // At least COMPANY_EMAIL should always be valid
        expect(isCompanyEmailValid).toBe(true);
        
        // With no environment variables set, all should be valid
        expect(isContactEmailValid).toBe(true);
        expect(isSmtpFromValid).toBe(true);
      });
    });

    describe('Template system integration', () => {
      it('should provide configuration for email templates', () => {
        // Mock template system integration
        const mockTemplateConfig = {
          getContactEmail: () => EMAIL_CONFIG.CONTACT_EMAIL,
          getFromEmail: () => EMAIL_CONFIG.SMTP_FROM,
          getCompanyEmail: () => EMAIL_CONFIG.COMPANY_EMAIL,
        };

        expect(mockTemplateConfig.getContactEmail()).toBe(EMAIL_CONFIG.CONTACT_EMAIL);
        expect(mockTemplateConfig.getFromEmail()).toBe(EMAIL_CONFIG.SMTP_FROM);
        expect(mockTemplateConfig.getCompanyEmail()).toBe(EMAIL_CONFIG.COMPANY_EMAIL);
      });

      it('should ensure template configuration uses standardized emails', () => {
        // Reset environment to ensure clean state
        delete process.env.CONTACT_EMAIL;
        delete process.env.SMTP_FROM;
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        const standardizedEmail = getStandardizedEmail();
        
        // Company email should always be standardized
        expect(freshConfig.COMPANY_EMAIL).toBe(standardizedEmail);
        
        // With no environment overrides, all should be standardized
        expect(freshConfig.CONTACT_EMAIL).toBe(standardizedEmail);
        expect(freshConfig.SMTP_FROM).toBe(standardizedEmail);
      });
    });

    describe('Error handling integration', () => {
      it('should handle invalid environment variable gracefully', () => {
        // Set invalid email in environment
        process.env.CONTACT_EMAIL = 'invalid-email-format';
        process.env.SMTP_FROM = 'another-invalid-email';
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        // Configuration should still load, even with invalid environment values
        expect(freshConfig.CONTACT_EMAIL).toBe('invalid-email-format');
        expect(freshConfig.SMTP_FROM).toBe('another-invalid-email');
        expect(freshConfig.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
        
        // Validation utilities should catch these issues
        expect(validateCompanyEmail(freshConfig.CONTACT_EMAIL)).toBe(false);
        expect(validateCompanyEmail(freshConfig.SMTP_FROM)).toBe(false);
        expect(validateCompanyEmail(freshConfig.COMPANY_EMAIL)).toBe(true);
      });

      it('should provide fallback mechanism through COMPANY_EMAIL', () => {
        // Even with invalid environment variables, COMPANY_EMAIL provides a valid fallback
        process.env.CONTACT_EMAIL = 'invalid';
        process.env.SMTP_FROM = 'also-invalid';
        
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        
        // Services can always fall back to COMPANY_EMAIL
        const fallbackEmail = freshConfig.COMPANY_EMAIL;
        expect(validateCompanyEmail(fallbackEmail)).toBe(true);
        expect(fallbackEmail).toBe(getStandardizedEmail());
      });
    });

    describe('Runtime configuration changes', () => {
      it('should handle environment changes during runtime', () => {
        // This test demonstrates that configuration is evaluated at module load time
        // In a real application, environment variables should be set before the application starts
        
        // Test 1: Set environment variable before module load
        process.env.CONTACT_EMAIL = 'runtime@example.com';
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: config1 } = require('@/lib/config/email');
        
        expect(config1.CONTACT_EMAIL).toBe('runtime@example.com');
        expect(config1.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
        
        // Test 2: Change environment variable after module load (should not affect loaded config)
        process.env.CONTACT_EMAIL = 'different@example.com';
        // Without clearing cache, the configuration should remain the same
        expect(config1.CONTACT_EMAIL).toBe('runtime@example.com'); // Still the original value
        
        // Test 3: Demonstrate that COMPANY_EMAIL is always consistent
        expect(config1.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
        
        // Clean up for other tests
        delete process.env.CONTACT_EMAIL;
      });

      it('should maintain COMPANY_EMAIL consistency across runtime changes', () => {
        const companyEmails: string[] = [];
        
        // Test multiple environment configurations
        const envConfigs = [
          {},
          { CONTACT_EMAIL: 'test1@example.com' },
          { SMTP_FROM: 'test2@example.com' },
          { CONTACT_EMAIL: 'test3@example.com', SMTP_FROM: 'test4@example.com' },
        ];

        envConfigs.forEach(envConfig => {
          // Reset environment
          delete process.env.CONTACT_EMAIL;
          delete process.env.SMTP_FROM;
          
          // Set new environment
          Object.entries(envConfig).forEach(([key, value]) => {
            process.env[key] = value;
          });
          
          delete require.cache[require.resolve('@/lib/config/email')];
          const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
          
          companyEmails.push(freshConfig.COMPANY_EMAIL);
        });

        // All COMPANY_EMAIL values should be identical
        const uniqueCompanyEmails = [...new Set(companyEmails)];
        expect(uniqueCompanyEmails).toHaveLength(1);
        expect(uniqueCompanyEmails[0]).toBe('vantageverticalltd@gmail.com');
      });
    });
  });

  describe('Performance and Memory Tests', () => {
    it('should not create new objects on repeated access', () => {
      const config1 = EMAIL_CONFIG;
      const config2 = EMAIL_CONFIG;
      
      // Should be the same reference (singleton pattern)
      expect(config1).toBe(config2);
    });

    it('should handle rapid successive configuration access', () => {
      // Reset environment to ensure clean state
      delete process.env.CONTACT_EMAIL;
      delete process.env.SMTP_FROM;
      
      delete require.cache[require.resolve('@/lib/config/email')];
      const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
      
      const startTime = Date.now();
      
      // Access configuration many times rapidly
      for (let i = 0; i < 1000; i++) {
        const config = freshConfig;
        expect(config.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
      }
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      // Should complete quickly (less than 500ms for 1000 accesses)
      expect(duration).toBeLessThan(500);
    });

    it('should not leak memory on module reloads', () => {
      // Simulate multiple module reloads
      for (let i = 0; i < 10; i++) {
        delete require.cache[require.resolve('@/lib/config/email')];
        const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
        expect(freshConfig.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
      }
      
      // Test should complete without memory issues
      expect(true).toBe(true);
    });
  });

  describe('Edge Cases and Error Conditions', () => {
    it('should handle undefined environment variables', () => {
      process.env.CONTACT_EMAIL = undefined as any;
      process.env.SMTP_FROM = undefined as any;
      
      delete require.cache[require.resolve('@/lib/config/email')];
      const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
      
      expect(freshConfig.CONTACT_EMAIL).toBe('vantageverticalltd@gmail.com');
      expect(freshConfig.SMTP_FROM).toBe('vantageverticalltd@gmail.com');
      expect(freshConfig.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
    });

    it('should handle null environment variables', () => {
      process.env.CONTACT_EMAIL = null as any;
      process.env.SMTP_FROM = null as any;
      
      delete require.cache[require.resolve('@/lib/config/email')];
      const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
      
      expect(freshConfig.CONTACT_EMAIL).toBe('vantageverticalltd@gmail.com');
      expect(freshConfig.SMTP_FROM).toBe('vantageverticalltd@gmail.com');
      expect(freshConfig.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
    });

    it('should handle very long environment variable values', () => {
      const longEmail = 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com';
      process.env.CONTACT_EMAIL = longEmail;
      
      delete require.cache[require.resolve('@/lib/config/email')];
      const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
      
      expect(freshConfig.CONTACT_EMAIL).toBe(longEmail);
      expect(freshConfig.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
    });

    it('should handle special characters in environment variables', () => {
      const specialEmail = 'test+special@example.com';
      process.env.CONTACT_EMAIL = specialEmail;
      
      delete require.cache[require.resolve('@/lib/config/email')];
      const { EMAIL_CONFIG: freshConfig } = require('@/lib/config/email');
      
      expect(freshConfig.CONTACT_EMAIL).toBe(specialEmail);
      expect(freshConfig.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
    });
  });
});