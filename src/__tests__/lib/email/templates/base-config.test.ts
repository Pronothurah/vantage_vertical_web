import { 
  generateBaseTemplate, 
  validateTemplateData,
  validateContactInfo,
  validateCompanyStandards,
  validateTemplateDataComprehensive,
  validateLogoUrl,
  getLogoUrl,
  checkLogoAccessibility,
  BaseTemplateData,
  LogoOptions,
  TemplateValidationResult
} from '@/lib/email/templates/base';
import { generateContactEmails } from '@/lib/email/templates/contact';
import { generateEnrollmentEmails } from '@/lib/email/templates/enrollment';
import { generateDroneInquiryAdminEmail, generateDroneInquiryCustomerEmail } from '@/lib/email/templates/droneInquiry';
import { generateNewsletterWelcomeEmail } from '@/lib/email/templates/newsletter';
import { EMAIL_CONFIG } from '@/lib/config/email';

describe('Base Email Template Configuration Tests', () => {
  describe('Logo URL Configuration', () => {
    describe('getLogoUrl function', () => {
      it('should return default logo URL for light background', () => {
        const logoUrl = getLogoUrl('light');
        expect(logoUrl).toBe('https://vantagevertical.co.ke/vantage-logo.png');
      });

      it('should return white logo URL for dark background', () => {
        const logoUrl = getLogoUrl('dark');
        expect(logoUrl).toBe('https://vantagevertical.co.ke/vantage-logo-white.jpg');
      });

      it('should default to light background when no parameter provided', () => {
        const logoUrl = getLogoUrl();
        expect(logoUrl).toBe('https://vantagevertical.co.ke/vantage-logo.png');
      });

      it('should use correct domain (vantagevertical.co.ke) for all logo variants', () => {
        const lightLogo = getLogoUrl('light');
        const darkLogo = getLogoUrl('dark');
        
        expect(lightLogo).toContain('vantagevertical.co.ke');
        expect(darkLogo).toContain('vantagevertical.co.ke');
        
        // Ensure no typos in domain
        expect(lightLogo).not.toContain('vantagevartical.com');
        expect(darkLogo).not.toContain('vantagevartical.com');
      });
    });

    describe('validateLogoUrl function', () => {
      it('should validate correct domain URLs', () => {
        const validUrls = [
          'https://vantagevertical.co.ke/vantage-logo.png',
          'https://vantagevertical.co.ke/vantage-logo-white.jpg',
          'https://vantagevertical.co.ke/images/logo.png'
        ];

        validUrls.forEach(url => {
          expect(validateLogoUrl(url)).toBe(true);
        });
      });

      it('should reject incorrect domain URLs', () => {
        const invalidUrls = [
          'https://vantagevartical.com/vantage-logo.png', // typo in domain
          'https://example.com/logo.png',
          'https://google.com/logo.png'
        ];

        invalidUrls.forEach(url => {
          expect(validateLogoUrl(url)).toBe(false);
        });
      });

      it('should accept correct domain regardless of protocol (current behavior)', () => {
        const urlsWithCorrectDomain = [
          'https://vantagevertical.co.ke/logo.png',
          'http://vantagevertical.co.ke/logo.png', // current implementation allows HTTP
          'ftp://vantagevertical.co.ke/logo.png' // current implementation allows FTP
        ];

        urlsWithCorrectDomain.forEach(url => {
          expect(validateLogoUrl(url)).toBe(true);
        });
      });

      it('should handle invalid URL formats', () => {
        const invalidFormats = [
          'not-a-url',
          'vantagevertical.co.ke/logo.png', // missing protocol
          ''
        ];

        invalidFormats.forEach(url => {
          expect(validateLogoUrl(url)).toBe(false);
        });
      });
    });

    describe('checkLogoAccessibility function', () => {
      it('should return false for invalid domain URLs', async () => {
        const invalidUrl = 'https://vantagevartical.com/logo.png';
        const result = await checkLogoAccessibility(invalidUrl);
        expect(result).toBe(false);
      });

      it('should return true for valid domain URLs in browser environment', async () => {
        // Mock browser environment
        const originalWindow = global.window;
        (global as any).window = {};

        const validUrl = 'https://vantagevertical.co.ke/vantage-logo.png';
        const result = await checkLogoAccessibility(validUrl);
        expect(result).toBe(true);

        // Restore original environment
        if (originalWindow) {
          global.window = originalWindow;
        } else {
          delete (global as any).window;
        }
      });

      it('should handle network errors gracefully', async () => {
        const invalidUrl = 'not-a-url';
        const result = await checkLogoAccessibility(invalidUrl);
        expect(result).toBe(false);
      });
    });
  });

  describe('Contact Information Configuration', () => {
    describe('validateContactInfo function', () => {
      it('should validate correct phone number format', () => {
        const validData: BaseTemplateData = {
          companyName: 'Vantage Vertical',
          logoUrl: 'https://vantagevertical.co.ke/logo.png',
          websiteUrl: 'https://vantagevertical.co.ke',
          contactEmail: 'vantageverticalltd@gmail.com',
          contactPhone: '+254704277687'
        };

        const errors = validateContactInfo(validData);
        expect(errors).toHaveLength(0);
      });

      it('should reject incorrect phone number formats', () => {
        const invalidPhoneNumbers = [
          '+254 XXX XXX XXX', // placeholder
          '+254123', // too short
          '+25412345678901', // too long
          '254704277687', // missing +
          '+1234567890', // wrong country code
          'phone-number' // not a number
        ];

        invalidPhoneNumbers.forEach(phone => {
          const data: BaseTemplateData = {
            companyName: 'Vantage Vertical',
            logoUrl: 'https://vantagevertical.co.ke/logo.png',
            websiteUrl: 'https://vantagevertical.co.ke',
            contactEmail: 'vantageverticalltd@gmail.com',
            contactPhone: phone
          };

          const errors = validateContactInfo(data);
          expect(errors.length).toBeGreaterThan(0);
          expect(errors[0]).toContain('Invalid phone number format');
        });
      });

      it('should validate correct website URL domain', () => {
        const validData: BaseTemplateData = {
          companyName: 'Vantage Vertical',
          logoUrl: 'https://vantagevertical.co.ke/logo.png',
          websiteUrl: 'https://vantagevertical.co.ke',
          contactEmail: 'vantageverticalltd@gmail.com',
          contactPhone: '+254704277687'
        };

        const errors = validateContactInfo(validData);
        expect(errors).toHaveLength(0);
      });

      it('should reject incorrect website URL domains', () => {
        const invalidDomains = [
          'https://vantagevartical.com', // typo in domain
          'https://example.com',
          'https://google.com'
        ];

        invalidDomains.forEach(websiteUrl => {
          const data: BaseTemplateData = {
            companyName: 'Vantage Vertical',
            logoUrl: 'https://vantagevertical.co.ke/logo.png',
            websiteUrl,
            contactEmail: 'vantageverticalltd@gmail.com',
            contactPhone: '+254704277687'
          };

          const errors = validateContactInfo(data);
          expect(errors.length).toBeGreaterThan(0);
          expect(errors[0]).toContain('correct domain');
        });
      });
    });

    describe('validateCompanyStandards function', () => {
      it('should pass with standardized company email', () => {
        const data: BaseTemplateData = {
          companyName: 'Vantage Vertical',
          logoUrl: 'https://vantagevertical.co.ke/logo.png',
          websiteUrl: 'https://vantagevertical.co.ke',
          contactEmail: 'vantageverticalltd@gmail.com',
          contactPhone: '+254704277687'
        };

        const warnings = validateCompanyStandards(data);
        expect(warnings).toHaveLength(0);
      });

      it('should warn about non-standard email addresses', () => {
        const nonStandardEmails = [
          'contact@vantagevertical.co.ke',
          'info@example.com',
          'admin@company.com'
        ];

        nonStandardEmails.forEach(contactEmail => {
          const data: BaseTemplateData = {
            companyName: 'Vantage Vertical',
            logoUrl: 'https://vantagevertical.co.ke/logo.png',
            websiteUrl: 'https://vantagevertical.co.ke',
            contactEmail,
            contactPhone: '+254704277687'
          };

          const warnings = validateCompanyStandards(data);
          expect(warnings.length).toBeGreaterThan(0);
          expect(warnings[0]).toContain('standardized company email');
        });
      });
    });

    describe('Default company data configuration', () => {
      it('should use correct phone number in default configuration', () => {
        const template = generateBaseTemplate('<p>Test</p>');
        
        expect(template.html).toContain('+254704277687');
        expect(template.text).toContain('+254704277687');
        
        // Should not contain placeholder
        expect(template.html).not.toContain('+254 XXX XXX XXX');
        expect(template.text).not.toContain('+254 XXX XXX XXX');
      });

      it('should use correct email address from EMAIL_CONFIG', () => {
        const template = generateBaseTemplate('<p>Test</p>');
        
        expect(template.html).toContain(EMAIL_CONFIG.CONTACT_EMAIL);
        expect(template.text).toContain(EMAIL_CONFIG.CONTACT_EMAIL);
      });

      it('should use correct website domain', () => {
        const template = generateBaseTemplate('<p>Test</p>');
        
        expect(template.html).toContain('vantagevertical.co.ke');
        expect(template.text).toContain('vantagevertical.co.ke');
        
        // Should not contain typo domain
        expect(template.html).not.toContain('vantagevartical.com');
        expect(template.text).not.toContain('vantagevartical.com');
      });

      it('should use correct logo URL with proper domain', () => {
        const template = generateBaseTemplate('<p>Test</p>');
        
        expect(template.html).toContain('https://vantagevertical.co.ke/vantage-logo.png');
        
        // Should not contain typo domain
        expect(template.html).not.toContain('vantagevartical.com');
      });
    });
  });

  describe('Comprehensive Template Validation', () => {
    describe('validateTemplateDataComprehensive function', () => {
      it('should pass comprehensive validation with correct data', async () => {
        const validData: BaseTemplateData = {
          companyName: 'Vantage Vertical',
          logoUrl: 'https://vantagevertical.co.ke/vantage-logo.png',
          websiteUrl: 'https://vantagevertical.co.ke',
          contactEmail: 'vantageverticalltd@gmail.com',
          contactPhone: '+254704277687'
        };

        const result = await validateTemplateDataComprehensive(validData);
        
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
        expect(result.contactInfoValid).toBe(true);
      });

      it('should detect domain typos in logo URL', async () => {
        const dataWithTypo: BaseTemplateData = {
          companyName: 'Vantage Vertical',
          logoUrl: 'https://vantagevartical.com/vantage-logo.png', // typo
          websiteUrl: 'https://vantagevertical.co.ke',
          contactEmail: 'vantageverticalltd@gmail.com',
          contactPhone: '+254704277687'
        };

        const result = await validateTemplateDataComprehensive(dataWithTypo);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.some(error => error.includes('typo in domain'))).toBe(true);
      });

      it('should detect domain typos in website URL', async () => {
        const dataWithTypo: BaseTemplateData = {
          companyName: 'Vantage Vertical',
          logoUrl: 'https://vantagevertical.co.ke/vantage-logo.png',
          websiteUrl: 'https://vantagevartical.com', // typo
          contactEmail: 'vantageverticalltd@gmail.com',
          contactPhone: '+254704277687'
        };

        const result = await validateTemplateDataComprehensive(dataWithTypo);
        
        expect(result.warnings.some(warning => warning.includes('typo in domain'))).toBe(true);
      });

      it('should validate all required fields are present', async () => {
        const incompleteData = {
          companyName: 'Vantage Vertical',
          logoUrl: 'https://vantagevertical.co.ke/vantage-logo.png'
          // missing required fields
        } as BaseTemplateData;

        const result = await validateTemplateDataComprehensive(incompleteData);
        
        expect(result.isValid).toBe(false);
        expect(result.errors.some(error => error.includes('Missing required template data'))).toBe(true);
      });

      it('should validate email format', async () => {
        const invalidEmailData: BaseTemplateData = {
          companyName: 'Vantage Vertical',
          logoUrl: 'https://vantagevertical.co.ke/vantage-logo.png',
          websiteUrl: 'https://vantagevertical.co.ke',
          contactEmail: 'invalid-email-format',
          contactPhone: '+254704277687'
        };

        const result = await validateTemplateDataComprehensive(invalidEmailData);
        
        expect(result.isValid).toBe(false);
        expect(result.contactInfoValid).toBe(false);
        expect(result.errors.some(error => error.includes('Invalid contact email format'))).toBe(true);
      });
    });
  });

  describe('Template Inheritance Across Email Types', () => {
    const mockContactData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+254712345678',
      service: 'aerial-photography',
      urgency: 'medium',
      message: 'Test message'
    };

    const mockEnrollmentData = {
      name: 'Jane Smith',
      email: 'jane@example.com',
      phone: '+254787654321',
      program: 'basic-pilot',
      session: 'March 2024',
      experience: 'beginner',
      accommodation: false,
      motivation: 'Career development'
    };

    const mockDroneInquiryData = {
      name: 'Bob Johnson',
      email: 'bob@example.com',
      phone: '+254798765432',
      droneId: 'DJI-Mavic-3',
      quantity: 1,
      inquiryType: 'quote' as const,
      intendedUse: 'Agricultural monitoring',
      experience: 'intermediate',
      trainingNeeded: true,
      financingInterest: false
    };

    const mockNewsletterData = {
      email: 'subscriber@example.com',
      confirmationToken: 'test-token-123',
      confirmationUrl: 'https://vantagevertical.co.ke/confirm?token=test-token-123'
    };

    describe('Contact form email templates', () => {
      it('should inherit correct logo URL from base configuration', () => {
        const emails = generateContactEmails(mockContactData);
        
        expect(emails.adminNotification.html).toContain('https://vantagevertical.co.ke/vantage-logo.png');
        expect(emails.customerConfirmation.html).toContain('https://vantagevertical.co.ke/vantage-logo.png');
        
        // Should not contain typo domain
        expect(emails.adminNotification.html).not.toContain('vantagevartical.com');
        expect(emails.customerConfirmation.html).not.toContain('vantagevartical.com');
      });

      it('should inherit correct contact information from base configuration', () => {
        const emails = generateContactEmails(mockContactData);
        
        // Check phone number
        expect(emails.adminNotification.html).toContain('+254704277687');
        expect(emails.customerConfirmation.html).toContain('+254704277687');
        
        // Check email
        expect(emails.adminNotification.html).toContain(EMAIL_CONFIG.CONTACT_EMAIL);
        expect(emails.customerConfirmation.html).toContain(EMAIL_CONFIG.CONTACT_EMAIL);
        
        // Should not contain placeholders
        expect(emails.adminNotification.html).not.toContain('+254 XXX XXX XXX');
        expect(emails.customerConfirmation.html).not.toContain('+254 XXX XXX XXX');
      });

      it('should inherit correct website URL from base configuration', () => {
        const emails = generateContactEmails(mockContactData);
        
        expect(emails.adminNotification.html).toContain('vantagevertical.co.ke');
        expect(emails.customerConfirmation.html).toContain('vantagevertical.co.ke');
        
        // Should not contain typo domain
        expect(emails.adminNotification.html).not.toContain('vantagevartical.com');
        expect(emails.customerConfirmation.html).not.toContain('vantagevartical.com');
      });
    });

    describe('Enrollment email templates', () => {
      it('should inherit correct logo URL from base configuration', () => {
        const emails = generateEnrollmentEmails(mockEnrollmentData);
        
        expect(emails.adminNotification.html).toContain('https://vantagevertical.co.ke/vantage-logo.png');
        expect(emails.studentConfirmation.html).toContain('https://vantagevertical.co.ke/vantage-logo.png');
        
        // Should not contain typo domain
        expect(emails.adminNotification.html).not.toContain('vantagevartical.com');
        expect(emails.studentConfirmation.html).not.toContain('vantagevartical.com');
      });

      it('should inherit correct contact information from base configuration', () => {
        const emails = generateEnrollmentEmails(mockEnrollmentData);
        
        // Check phone number
        expect(emails.adminNotification.html).toContain('+254704277687');
        expect(emails.studentConfirmation.html).toContain('+254704277687');
        
        // Check email
        expect(emails.adminNotification.html).toContain(EMAIL_CONFIG.CONTACT_EMAIL);
        expect(emails.studentConfirmation.html).toContain(EMAIL_CONFIG.CONTACT_EMAIL);
      });

      it('should inherit correct website URL from base configuration', () => {
        const emails = generateEnrollmentEmails(mockEnrollmentData);
        
        expect(emails.adminNotification.html).toContain('vantagevertical.co.ke');
        expect(emails.studentConfirmation.html).toContain('vantagevertical.co.ke');
        
        // Should not contain typo domain
        expect(emails.adminNotification.html).not.toContain('vantagevartical.com');
        expect(emails.studentConfirmation.html).not.toContain('vantagevartical.com');
      });
    });

    describe('Drone inquiry email templates', () => {
      it('should inherit correct logo URL from base configuration', () => {
        const adminEmail = generateDroneInquiryAdminEmail(mockDroneInquiryData);
        const customerEmail = generateDroneInquiryCustomerEmail(mockDroneInquiryData);
        
        expect(adminEmail.html).toContain('https://vantagevertical.co.ke/vantage-logo.png');
        expect(customerEmail.html).toContain('https://vantagevertical.co.ke/vantage-logo.png');
        
        // Should not contain typo domain
        expect(adminEmail.html).not.toContain('vantagevartical.com');
        expect(customerEmail.html).not.toContain('vantagevartical.com');
      });

      it('should inherit correct contact information from base configuration', () => {
        const adminEmail = generateDroneInquiryAdminEmail(mockDroneInquiryData);
        const customerEmail = generateDroneInquiryCustomerEmail(mockDroneInquiryData);
        
        // Check phone number
        expect(adminEmail.html).toContain('+254704277687');
        expect(customerEmail.html).toContain('+254704277687');
        
        // Check email
        expect(adminEmail.html).toContain(EMAIL_CONFIG.CONTACT_EMAIL);
        expect(customerEmail.html).toContain(EMAIL_CONFIG.CONTACT_EMAIL);
      });

      it('should inherit correct website URL from base configuration', () => {
        const adminEmail = generateDroneInquiryAdminEmail(mockDroneInquiryData);
        const customerEmail = generateDroneInquiryCustomerEmail(mockDroneInquiryData);
        
        expect(adminEmail.html).toContain('vantagevertical.co.ke');
        expect(customerEmail.html).toContain('vantagevertical.co.ke');
        
        // Should not contain typo domain
        expect(adminEmail.html).not.toContain('vantagevartical.com');
        expect(customerEmail.html).not.toContain('vantagevartical.com');
      });
    });

    describe('Newsletter email templates', () => {
      it('should inherit correct logo URL from base configuration', () => {
        const welcomeEmail = generateNewsletterWelcomeEmail(mockNewsletterData);
        
        expect(welcomeEmail.html).toContain('https://vantagevertical.co.ke/vantage-logo.png');
        
        // Should not contain typo domain
        expect(welcomeEmail.html).not.toContain('vantagevartical.com');
      });

      it('should inherit correct contact information from base configuration', () => {
        const welcomeEmail = generateNewsletterWelcomeEmail(mockNewsletterData);
        
        // Check phone number
        expect(welcomeEmail.html).toContain('+254704277687');
        
        // Check email
        expect(welcomeEmail.html).toContain(EMAIL_CONFIG.CONTACT_EMAIL);
      });

      it('should inherit correct website URL from base configuration', () => {
        const welcomeEmail = generateNewsletterWelcomeEmail(mockNewsletterData);
        
        expect(welcomeEmail.html).toContain('vantagevertical.co.ke');
        
        // Should not contain typo domain
        expect(welcomeEmail.html).not.toContain('vantagevartical.com');
      });
    });
  });

  describe('Logo Selection for Different Backgrounds', () => {
    it('should use appropriate logo for light backgrounds in templates', () => {
      const template = generateBaseTemplate('<p>Test content</p>', {}, {
        backgroundColor: '#ffffff'
      });
      
      // Should use default logo for light backgrounds
      expect(template.html).toContain('https://vantagevertical.co.ke/vantage-logo.png');
    });

    it('should allow manual logo selection for dark backgrounds', () => {
      const template = generateBaseTemplate('<p>Test content</p>', {
        logoUrl: getLogoUrl('dark')
      });
      
      // Should use white logo for dark backgrounds
      expect(template.html).toContain('https://vantagevertical.co.ke/vantage-logo-white.jpg');
    });

    it('should validate both logo variants use correct domain', () => {
      const lightLogo = getLogoUrl('light');
      const darkLogo = getLogoUrl('dark');
      
      expect(validateLogoUrl(lightLogo)).toBe(true);
      expect(validateLogoUrl(darkLogo)).toBe(true);
      
      // Both should use correct domain
      expect(lightLogo).toContain('vantagevertical.co.ke');
      expect(darkLogo).toContain('vantagevertical.co.ke');
    });
  });

  describe('Error Prevention and Validation', () => {
    it('should prevent use of incorrect domains through validation', () => {
      const dataWithWrongDomain: BaseTemplateData = {
        companyName: 'Vantage Vertical',
        logoUrl: 'https://vantagevartical.com/logo.png', // typo
        websiteUrl: 'https://vantagevartical.com', // typo
        contactEmail: 'vantageverticalltd@gmail.com',
        contactPhone: '+254704277687'
      };

      expect(() => validateTemplateData(dataWithWrongDomain)).toThrow();
    });

    it('should prevent use of placeholder contact information', () => {
      const dataWithPlaceholder: BaseTemplateData = {
        companyName: 'Vantage Vertical',
        logoUrl: 'https://vantagevertical.co.ke/logo.png',
        websiteUrl: 'https://vantagevertical.co.ke',
        contactEmail: 'vantageverticalltd@gmail.com',
        contactPhone: '+254 XXX XXX XXX' // placeholder
      };

      expect(() => validateTemplateData(dataWithPlaceholder)).toThrow();
    });

    it('should provide helpful error messages for common mistakes', () => {
      const dataWithTypo: BaseTemplateData = {
        companyName: 'Vantage Vertical',
        logoUrl: 'https://vantagevartical.com/logo.png', // typo
        websiteUrl: 'https://vantagevertical.co.ke',
        contactEmail: 'vantageverticalltd@gmail.com',
        contactPhone: '+254704277687'
      };

      try {
        validateTemplateData(dataWithTypo);
        fail('Expected validation to throw an error');
      } catch (error: any) {
        expect(error.message).toContain('correct domain');
        expect(error.message).toContain('vantagevertical.co.ke');
      }
    });
  });
});