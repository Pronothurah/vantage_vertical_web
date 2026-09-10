import { 
  validateTemplateDataComprehensive,
  validateContactInfo,
  validateLogoUrl,
  checkLogoAccessibility,
  BaseTemplateData 
} from '@/lib/email/templates/base';

describe('Email Template Validation Functions', () => {
  const validData: BaseTemplateData = {
    companyName: 'Vantage Vertical',
    logoUrl: 'https://vantagevertical.co.ke/vantage-logo.png',
    websiteUrl: 'https://vantagevertical.co.ke',
    contactEmail: 'vantageverticalltd@gmail.com',
    contactPhone: '+254704277687'
  };

  const invalidData: BaseTemplateData = {
    companyName: 'Vantage Vertical',
    logoUrl: 'https://vantagevartical.com/vantage-logo.png', // Wrong domain (typo)
    websiteUrl: 'https://vantagevartical.com', // Wrong domain (typo)
    contactEmail: 'invalid-email',
    contactPhone: '+254 XXX XXX XXX' // Placeholder format
  };

  describe('validateLogoUrl', () => {
    it('should return true for correct domain', () => {
      expect(validateLogoUrl('https://vantagevertical.co.ke/vantage-logo.png')).toBe(true);
      expect(validateLogoUrl('https://vantagevertical.co.ke/vantage-logo-white.jpg')).toBe(true);
    });

    it('should return false for incorrect domain', () => {
      expect(validateLogoUrl('https://vantagevartical.com/vantage-logo.png')).toBe(false);
      expect(validateLogoUrl('https://example.com/logo.png')).toBe(false);
    });

    it('should return false for invalid URLs', () => {
      expect(validateLogoUrl('not-a-url')).toBe(false);
      expect(validateLogoUrl('')).toBe(false);
    });
  });

  describe('validateContactInfo', () => {
    it('should return no errors for valid contact info', () => {
      const errors = validateContactInfo(validData);
      expect(errors).toHaveLength(0);
    });

    it('should return errors for invalid phone number format', () => {
      const dataWithInvalidPhone = { ...validData, contactPhone: '+254 XXX XXX XXX' };
      const errors = validateContactInfo(dataWithInvalidPhone);
      expect(errors).toContain('Invalid phone number format - should be +254 followed by 9 digits');
    });

    it('should return errors for incorrect website domain', () => {
      const dataWithWrongDomain = { ...validData, websiteUrl: 'https://vantagevartical.com' };
      const errors = validateContactInfo(dataWithWrongDomain);
      expect(errors).toContain('Website URL should use the correct domain (vantagevertical.co.ke)');
    });

    it('should validate phone number format strictly', () => {
      const testCases = [
        { phone: '+254123456789', shouldPass: true },
        { phone: '+254704277687', shouldPass: true },
        { phone: '+254 123 456 789', shouldPass: false }, // Spaces
        { phone: '254123456789', shouldPass: false }, // Missing +
        { phone: '+25412345678', shouldPass: false }, // Too short
        { phone: '+2541234567890', shouldPass: false }, // Too long
        { phone: '+254 XXX XXX XXX', shouldPass: false }, // Placeholder
      ];

      testCases.forEach(({ phone, shouldPass }) => {
        const testData = { ...validData, contactPhone: phone };
        const errors = validateContactInfo(testData);
        if (shouldPass) {
          expect(errors).toHaveLength(0);
        } else {
          expect(errors.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('checkLogoAccessibility', () => {
    it('should return false for invalid domain', async () => {
      const result = await checkLogoAccessibility('https://vantagevartical.com/logo.png');
      expect(result).toBe(false);
    });

    it('should return true for valid domain (in test environment)', async () => {
      const result = await checkLogoAccessibility('https://vantagevertical.co.ke/vantage-logo.png');
      expect(result).toBe(true);
    });

    it('should handle invalid URLs gracefully', async () => {
      const result = await checkLogoAccessibility('not-a-url');
      expect(result).toBe(false);
    });
  });

  describe('validateTemplateDataComprehensive', () => {
    it('should return valid result for correct data', async () => {
      const result = await validateTemplateDataComprehensive(validData);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.contactInfoValid).toBe(true);
      expect(result.logoAccessible).toBe(true);
    });

    it('should return errors for invalid data', async () => {
      const result = await validateTemplateDataComprehensive(invalidData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.contactInfoValid).toBe(false);
      expect(result.errors).toContain('Invalid contact email format in template data');
      expect(result.errors).toContain('Logo URL contains typo in domain - should be "vantagevertical.co.ke"');
    });

    it('should detect missing required fields', async () => {
      const incompleteData = {
        companyName: 'Test Company'
        // Missing other required fields
      } as BaseTemplateData;
      
      const result = await validateTemplateDataComprehensive(incompleteData);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required template data: logoUrl, websiteUrl, contactEmail, contactPhone');
    });

    it('should provide warnings for company standards', async () => {
      const dataWithNonStandardEmail = {
        ...validData,
        contactEmail: 'different@example.com'
      };
      
      const result = await validateTemplateDataComprehensive(dataWithNonStandardEmail);
      
      expect(result.warnings).toContain('Contact email should use the standardized company email address for consistency');
    });

    it('should detect domain typos in URLs', async () => {
      const dataWithTypo = {
        ...validData,
        logoUrl: 'https://vantagevartical.com/logo.png', // Typo in domain
        websiteUrl: 'https://vantagevartical.com' // Typo in domain
      };
      
      const result = await validateTemplateDataComprehensive(dataWithTypo);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Logo URL contains typo in domain - should be "vantagevertical.co.ke"');
      expect(result.warnings).toContain('Website URL contains typo in domain - should be "vantagevertical.co.ke"');
    });

    it('should validate URL formats', async () => {
      const dataWithInvalidUrls = {
        ...validData,
        logoUrl: 'not-a-url',
        websiteUrl: 'also-not-a-url'
      };
      
      const result = await validateTemplateDataComprehensive(dataWithInvalidUrls);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid URL format in template data');
    });
  });
});