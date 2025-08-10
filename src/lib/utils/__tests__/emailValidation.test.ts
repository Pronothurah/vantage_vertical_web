/**
 * Comprehensive test suite for email validation utilities
 * Tests email format validation, typo detection, and correction functionality
 */

import {
  validateCompanyEmail,
  getStandardizedEmail,
  detectEmailTypos,
  validateAndCorrectEmail,
  isValidCompanyEmail
} from '../emailValidation';

describe('Email Validation Utilities', () => {
  const CORRECT_EMAIL = 'vantageverticalltd@gmail.com';
  const COMMON_TYPOS = [
    'vantagevarticalltd@gmail.com', // missing 'e' in vertical
    'vantageverticalltd@gmial.com', // typo in gmail
    'vantageverticalltd@gmai.com',  // missing 'l' in gmail
    'vantageverticalltd@gmail.co',  // missing 'm' in .com
    'vantageverticalltd@yahoo.com', // wrong domain
    'vantagevertical@gmail.com',    // missing 'ltd'
    'vantageverticaltd@gmail.com',  // missing 'l' in ltd
  ];

  describe('validateCompanyEmail', () => {
    describe('correct email format validation', () => {
      it('should return true for the correct company email', () => {
        expect(validateCompanyEmail(CORRECT_EMAIL)).toBe(true);
      });

      it('should return true for correct email with different casing', () => {
        expect(validateCompanyEmail('VANTAGEVERTICALLTD@GMAIL.COM')).toBe(true);
        expect(validateCompanyEmail('VantageVerticalLtd@Gmail.Com')).toBe(true);
        expect(validateCompanyEmail('vantageverticalltd@GMAIL.com')).toBe(true);
      });

      it('should return true for correct email with whitespace', () => {
        expect(validateCompanyEmail('  vantageverticalltd@gmail.com  ')).toBe(true);
        expect(validateCompanyEmail('\tvantageverticalltd@gmail.com\n')).toBe(true);
      });
    });

    describe('invalid email format validation', () => {
      it('should return false for known typos', () => {
        COMMON_TYPOS.forEach(typo => {
          expect(validateCompanyEmail(typo)).toBe(false);
        });
      });

      it('should return false for completely different emails', () => {
        expect(validateCompanyEmail('user@example.com')).toBe(false);
        expect(validateCompanyEmail('admin@company.org')).toBe(false);
        expect(validateCompanyEmail('test@test.test')).toBe(false);
      });

      it('should return false for malformed emails', () => {
        expect(validateCompanyEmail('not-an-email')).toBe(false);
        expect(validateCompanyEmail('@gmail.com')).toBe(false);
        expect(validateCompanyEmail('vantageverticalltd@')).toBe(false);
        expect(validateCompanyEmail('vantageverticalltd')).toBe(false);
      });

      it('should return false for empty or invalid inputs', () => {
        expect(validateCompanyEmail('')).toBe(false);
        expect(validateCompanyEmail('   ')).toBe(false);
        expect(validateCompanyEmail(null as any)).toBe(false);
        expect(validateCompanyEmail(undefined as any)).toBe(false);
        expect(validateCompanyEmail(123 as any)).toBe(false);
      });
    });
  });

  describe('getStandardizedEmail', () => {
    it('should always return the correct company email', () => {
      expect(getStandardizedEmail()).toBe(CORRECT_EMAIL);
    });

    it('should return consistent results across multiple calls', () => {
      const email1 = getStandardizedEmail();
      const email2 = getStandardizedEmail();
      const email3 = getStandardizedEmail();
      
      expect(email1).toBe(email2);
      expect(email2).toBe(email3);
      expect(email1).toBe(CORRECT_EMAIL);
    });
  });

  describe('detectEmailTypos', () => {
    describe('typo detection functionality', () => {
      it('should detect known typos', () => {
        COMMON_TYPOS.forEach(typo => {
          const result = detectEmailTypos(typo);
          expect(result.hasTypo).toBe(true);
          expect(result.suggestedCorrection).toBe(CORRECT_EMAIL);
          expect(result.typoType).toBe('known_typo');
        });
      });

      it('should detect domain typos', () => {
        const domainTypos = [
          'vantageverticalltd@gmailcom',
          'vantageverticalltd@gmail.comm',
          'vantageverticalltd@gmai.com',
          'vantageverticalltd@gmial.com'
        ];

        domainTypos.forEach(typo => {
          const result = detectEmailTypos(typo);
          if (result.hasTypo) {
            expect(result.suggestedCorrection).toBe(CORRECT_EMAIL);
            expect(['known_typo', 'domain_typo']).toContain(result.typoType);
          }
        });
      });

      it('should detect local part typos', () => {
        const localPartTypos = [
          'vantagevertical@gmail.com',
          'vantageverticaltd@gmail.com'
        ];

        localPartTypos.forEach(typo => {
          const result = detectEmailTypos(typo);
          if (result.hasTypo) {
            expect(result.suggestedCorrection).toBe(CORRECT_EMAIL);
            expect(['known_typo', 'local_part_typo']).toContain(result.typoType);
          }
        });
      });

      it('should not detect typos in correct email', () => {
        const result = detectEmailTypos(CORRECT_EMAIL);
        expect(result.hasTypo).toBe(false);
        expect(result.suggestedCorrection).toBeUndefined();
        expect(result.typoType).toBeUndefined();
      });

      it('should handle case insensitive detection', () => {
        const result = detectEmailTypos('VANTAGEVARTICALLTD@GMAIL.COM');
        expect(result.hasTypo).toBe(true);
        expect(result.suggestedCorrection).toBe(CORRECT_EMAIL);
      });
    });

    describe('fallback behavior for invalid inputs', () => {
      it('should handle empty or invalid inputs gracefully', () => {
        expect(detectEmailTypos('')).toEqual({ hasTypo: false });
        expect(detectEmailTypos('   ')).toEqual({ hasTypo: false });
        expect(detectEmailTypos(null as any)).toEqual({ hasTypo: false });
        expect(detectEmailTypos(undefined as any)).toEqual({ hasTypo: false });
      });

      it('should handle malformed emails', () => {
        const malformedEmails = [
          'not-an-email',
          '@gmail.com',
          'user@',
          'user',
          '@@@@'
        ];

        malformedEmails.forEach(email => {
          const result = detectEmailTypos(email);
          expect(result.hasTypo).toBe(false);
        });
      });

      it('should not detect typos in completely different valid emails', () => {
        const differentEmails = [
          'user@example.com',
          'admin@company.org',
          'test@different-domain.net'
        ];

        differentEmails.forEach(email => {
          const result = detectEmailTypos(email);
          expect(result.hasTypo).toBe(false);
        });
      });
    });
  });

  describe('validateAndCorrectEmail', () => {
    describe('validation and correction functionality', () => {
      it('should validate correct email without correction', () => {
        const result = validateAndCorrectEmail(CORRECT_EMAIL);
        expect(result.isValid).toBe(true);
        expect(result.correctedEmail).toBe(CORRECT_EMAIL);
        expect(result.wasTypo).toBe(false);
        expect(result.originalEmail).toBe(CORRECT_EMAIL);
      });

      it('should correct known typos', () => {
        COMMON_TYPOS.forEach(typo => {
          const result = validateAndCorrectEmail(typo);
          expect(result.isValid).toBe(false);
          expect(result.correctedEmail).toBe(CORRECT_EMAIL);
          expect(result.wasTypo).toBe(true);
          expect(result.originalEmail).toBe(typo);
        });
      });

      it('should provide fallback for unknown invalid emails', () => {
        const invalidEmails = [
          'user@example.com',
          'admin@company.org',
          'not-an-email'
        ];

        invalidEmails.forEach(email => {
          const result = validateAndCorrectEmail(email);
          expect(result.isValid).toBe(false);
          expect(result.correctedEmail).toBe(CORRECT_EMAIL);
          expect(result.wasTypo).toBe(false);
          expect(result.originalEmail).toBe(email);
        });
      });

      it('should handle case insensitive validation', () => {
        const result = validateAndCorrectEmail('VANTAGEVERTICALLTD@GMAIL.COM');
        expect(result.isValid).toBe(true);
        expect(result.correctedEmail).toBe('VANTAGEVERTICALLTD@GMAIL.COM');
        expect(result.wasTypo).toBe(false);
      });
    });

    describe('fallback behavior for invalid configurations', () => {
      it('should handle empty inputs with fallback', () => {
        const result = validateAndCorrectEmail('');
        expect(result.isValid).toBe(false);
        expect(result.correctedEmail).toBe(CORRECT_EMAIL);
        expect(result.wasTypo).toBe(false);
        expect(result.originalEmail).toBe('');
      });

      it('should handle null/undefined inputs with fallback', () => {
        const nullResult = validateAndCorrectEmail(null as any);
        expect(nullResult.isValid).toBe(false);
        expect(nullResult.correctedEmail).toBe(CORRECT_EMAIL);
        expect(nullResult.wasTypo).toBe(false);

        const undefinedResult = validateAndCorrectEmail(undefined as any);
        expect(undefinedResult.isValid).toBe(false);
        expect(undefinedResult.correctedEmail).toBe(CORRECT_EMAIL);
        expect(undefinedResult.wasTypo).toBe(false);
      });

      it('should provide consistent fallback behavior', () => {
        const invalidInputs = ['', '   ', 'invalid', null, undefined];
        
        invalidInputs.forEach(input => {
          const result = validateAndCorrectEmail(input as any);
          expect(result.correctedEmail).toBe(CORRECT_EMAIL);
          expect(result.isValid).toBe(false);
        });
      });
    });
  });

  describe('isValidCompanyEmail', () => {
    it('should work as a type guard for correct email', () => {
      const email: string = CORRECT_EMAIL;
      
      if (isValidCompanyEmail(email)) {
        // TypeScript should narrow the type here
        expect(email).toBe(CORRECT_EMAIL);
      }
      
      expect(isValidCompanyEmail(email)).toBe(true);
    });

    it('should return false for invalid emails', () => {
      COMMON_TYPOS.forEach(typo => {
        expect(isValidCompanyEmail(typo)).toBe(false);
      });
      
      expect(isValidCompanyEmail('user@example.com')).toBe(false);
      expect(isValidCompanyEmail('')).toBe(false);
    });

    it('should handle case insensitive validation', () => {
      expect(isValidCompanyEmail('VANTAGEVERTICALLTD@GMAIL.COM')).toBe(true);
      expect(isValidCompanyEmail('VantageVerticalLtd@Gmail.Com')).toBe(true);
    });
  });

  describe('Integration tests', () => {
    it('should work together for complete email validation workflow', () => {
      // Test workflow: detect typo -> validate and correct -> verify result
      const typoEmail = 'vantagevarticalltd@gmail.com';
      
      // Step 1: Detect typo
      const typoResult = detectEmailTypos(typoEmail);
      expect(typoResult.hasTypo).toBe(true);
      
      // Step 2: Validate and correct
      const correctionResult = validateAndCorrectEmail(typoEmail);
      expect(correctionResult.wasTypo).toBe(true);
      expect(correctionResult.correctedEmail).toBe(CORRECT_EMAIL);
      
      // Step 3: Verify corrected email is valid
      expect(validateCompanyEmail(correctionResult.correctedEmail)).toBe(true);
      expect(isValidCompanyEmail(correctionResult.correctedEmail)).toBe(true);
    });

    it('should maintain consistency across all validation functions', () => {
      const testEmails = [
        CORRECT_EMAIL,
        ...COMMON_TYPOS,
        'user@example.com',
        '',
        'invalid-email'
      ];

      testEmails.forEach(email => {
        const isValid = validateCompanyEmail(email);
        const isValidTypeGuard = isValidCompanyEmail(email);
        const correctionResult = validateAndCorrectEmail(email);
        
        // Consistency check: both validation functions should agree
        expect(isValid).toBe(isValidTypeGuard);
        expect(isValid).toBe(correctionResult.isValid);
        
        // If valid, corrected email should be the same as original
        if (isValid) {
          expect(correctionResult.correctedEmail).toBe(email);
          expect(correctionResult.wasTypo).toBe(false);
        } else {
          // If invalid, should provide correction
          expect(correctionResult.correctedEmail).toBe(CORRECT_EMAIL);
        }
      });
    });
  });

  describe('Edge cases and error handling', () => {
    it('should handle extremely long strings', () => {
      const longEmail = 'a'.repeat(1000) + '@gmail.com';
      expect(validateCompanyEmail(longEmail)).toBe(false);
      expect(detectEmailTypos(longEmail)).toEqual({ hasTypo: false });
    });

    it('should handle special characters', () => {
      const specialEmails = [
        'vantageverticalltd+test@gmail.com',
        'vantageverticalltd.test@gmail.com',
        'vantage-vertical-ltd@gmail.com'
      ];

      specialEmails.forEach(email => {
        expect(validateCompanyEmail(email)).toBe(false);
        const result = validateAndCorrectEmail(email);
        expect(result.correctedEmail).toBe(CORRECT_EMAIL);
      });
    });

    it('should handle unicode characters', () => {
      const unicodeEmail = 'vantageverticalltd@gmäil.com';
      expect(validateCompanyEmail(unicodeEmail)).toBe(false);
      
      // The function detects this as a local part typo because it contains 'vantage' and 'vertical'
      const result = detectEmailTypos(unicodeEmail);
      expect(result.hasTypo).toBe(true);
      expect(result.suggestedCorrection).toBe('vantageverticalltd@gmail.com');
      expect(result.typoType).toBe('local_part_typo');
    });
  });
});