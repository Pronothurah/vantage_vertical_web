import { EmailService } from '@/lib/email/emailService';
import { emailErrorHandler } from '@/lib/email/errorHandler';
import { EmailErrorType, EmailError } from '@/lib/email/types';

// Mock nodemailer
const mockTransporter = {
  verify: jest.fn(),
  sendMail: jest.fn(),
};

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => mockTransporter),
}));

describe('EmailService Integration with ErrorHandler', () => {
  let emailService: EmailService;

  beforeEach(() => {
    // Clear logs before each test
    emailErrorHandler.clearLogs();
    
    // Reset circuit breaker
    emailErrorHandler.resetCircuitBreaker();
    
    // Mock environment variables
    process.env.SMTP_HOST = 'smtp.gmail.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASS = 'testpass';
    process.env.SMTP_FROM = 'test@example.com';
    process.env.CONTACT_EMAIL = 'vantageverticalltd@gmail.com';
    
    emailService = new EmailService();
  });

  afterEach(() => {
    // Clean up environment variables
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASS;
    delete process.env.SMTP_FROM;
    delete process.env.CONTACT_EMAIL;
  });

  describe('error handling integration', () => {
    it('should log validation errors through ErrorHandler', async () => {
      const result = await emailService.sendEmail({
        to: 'invalid-email',
        subject: 'Test Subject',
        html: '<p>Test content</p>',
      });

      expect(result.success).toBe(false);
      expect(result.error?.type).toBe(EmailErrorType.VALIDATION_ERROR);

      // Check that the error was logged
      const logs = emailErrorHandler.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].success).toBe(false);
      expect(logs[0].operation).toBe('send');
      expect(logs[0].error?.type).toBe(EmailErrorType.VALIDATION_ERROR);
    });

    it('should log configuration validation through ErrorHandler', async () => {
      // Remove required environment variable
      delete process.env.SMTP_HOST;
      
      // Create new service instance without SMTP_HOST
      const unconfiguredService = new EmailService();
      
      const isValid = await unconfiguredService.validateConfiguration();
      
      expect(isValid).toBe(false);

      // Check that the validation error was logged
      const logs = emailErrorHandler.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].success).toBe(false);
      expect(logs[0].operation).toBe('validate');
    });

    it('should track circuit breaker state through ErrorHandler', async () => {
      // Mock transporter to always fail
      const mockTransporter = {
        verify: jest.fn().mockRejectedValue(new Error('Connection failed')),
        sendMail: jest.fn().mockRejectedValue(new Error('SMTP connection failed')),
      };
      
      // Replace the transporter
      (emailService as any).transporter = mockTransporter;
      (emailService as any).isConfigured = true;
      (emailService as any).config = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: 'test@example.com', pass: 'testpass' },
        from: 'test@example.com',
        retryAttempts: 1,
        retryDelay: 100,
      };

      // Send multiple emails to trigger circuit breaker
      for (let i = 0; i < 5; i++) {
        await emailService.sendEmail({
          to: 'test@example.com',
          subject: 'Test Subject',
          html: '<p>Test content</p>',
        });
      }

      // Circuit breaker should be open
      expect(emailErrorHandler.isCircuitBreakerOpen()).toBe(true);

      // Check circuit breaker status
      const status = emailErrorHandler.getCircuitBreakerStatus();
      expect(status.isOpen).toBe(true);
      expect(status.consecutiveFailures).toBe(5);
    });

    it('should provide comprehensive metrics through ErrorHandler', async () => {
      // Mock transporter for mixed results
      const mockTransporter = {
        verify: jest.fn().mockResolvedValue(true),
        sendMail: jest.fn()
          .mockResolvedValueOnce({ messageId: 'success-1' })
          .mockResolvedValueOnce({ messageId: 'success-2' })
          .mockRejectedValueOnce(new Error('SMTP connection failed')),
      };
      
      // Replace the transporter
      (emailService as any).transporter = mockTransporter;
      (emailService as any).isConfigured = true;
      (emailService as any).config = {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: { user: 'test@example.com', pass: 'testpass' },
        from: 'test@example.com',
        retryAttempts: 1,
        retryDelay: 100,
      };

      // Send multiple emails
      await emailService.sendEmail({
        to: 'test1@example.com',
        subject: 'Test Subject 1',
        html: '<p>Test content 1</p>',
      });

      await emailService.sendEmail({
        to: 'test2@example.com',
        subject: 'Test Subject 2',
        html: '<p>Test content 2</p>',
      });

      await emailService.sendEmail({
        to: 'test3@example.com',
        subject: 'Test Subject 3',
        html: '<p>Test content 3</p>',
      });

      // Check metrics
      const metrics = emailErrorHandler.getMetrics();
      expect(metrics.totalOperations).toBe(3);
      expect(metrics.successfulOperations).toBe(2);
      expect(metrics.failedOperations).toBe(1);
      expect(metrics.successRate).toBeCloseTo(66.67, 1);
      expect(metrics.errorsByType[EmailErrorType.SMTP_CONNECTION_ERROR]).toBe(1);
    });

    it('should provide filtered logs through ErrorHandler', async () => {
      // Test validation error
      await emailService.sendEmail({
        to: 'invalid-email',
        subject: 'Test Subject',
        html: '<p>Test content</p>',
      });

      // Test connection validation
      await emailService.validateConfiguration();

      // Get filtered logs
      const sendLogs = emailErrorHandler.getFilteredLogs({ operation: 'send' });
      const validateLogs = emailErrorHandler.getFilteredLogs({ operation: 'validate' });
      const failureLogs = emailErrorHandler.getFilteredLogs({ success: false });

      expect(sendLogs).toHaveLength(1);
      expect(validateLogs).toHaveLength(1);
      expect(failureLogs).toHaveLength(1); // Only the send operation should fail
      expect(failureLogs[0].operation).toBe('send');
    });
  });

  describe('template branding integration', () => {
    it('should generate contact form emails with correct logo and contact information', async () => {
      const mockContactData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+254700000000',
        service: 'aerial-mapping',
        message: 'I need aerial mapping services.',
        urgency: 'medium' as const
      };

      // Mock the contact template generation
      const { generateContactEmails } = require('@/lib/email/templates/contact');
      const emails = generateContactEmails(mockContactData);

      // Verify admin notification uses correct branding
      expect(emails.adminNotification.html).toContain('vantagevertical.co.ke/vantage-logo.png');
      expect(emails.adminNotification.html).toContain('+254704277687');
      expect(emails.adminNotification.html).toContain('vantageverticalltd@gmail.com');
      expect(emails.adminNotification.html).not.toContain('vantagevartical.com');
      expect(emails.adminNotification.html).not.toContain('+254 XXX XXX XXX');

      // Verify customer confirmation uses correct branding
      expect(emails.customerConfirmation.html).toContain('vantagevertical.co.ke/vantage-logo.png');
      expect(emails.customerConfirmation.html).toContain('+254704277687');
      expect(emails.customerConfirmation.html).toContain('vantageverticalltd@gmail.com');
      expect(emails.customerConfirmation.html).not.toContain('vantagevartical.com');
      expect(emails.customerConfirmation.html).not.toContain('+254 XXX XXX XXX');
    });

    it('should generate enrollment emails with correct logo and contact information', async () => {
      const mockEnrollmentData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+254712345678',
        program: 'basic-pilot',
        session: 'January 2024',
        experience: 'beginner' as const,
        accommodation: true,
        motivation: 'I want to start a drone business',
        emergencyContact: {
          name: 'John Smith',
          relationship: 'spouse',
          phone: '+254787654321'
        }
      };

      // Mock the enrollment template generation
      const { generateEnrollmentEmails } = require('@/lib/email/templates/enrollment');
      const emails = generateEnrollmentEmails(mockEnrollmentData);

      // Verify admin notification uses correct branding
      expect(emails.adminNotification.html).toContain('vantagevertical.co.ke/vantage-logo.png');
      expect(emails.adminNotification.html).toContain('+254704277687');
      expect(emails.adminNotification.html).toContain('vantageverticalltd@gmail.com');
      expect(emails.adminNotification.html).not.toContain('vantagevartical.com');
      expect(emails.adminNotification.html).not.toContain('+254 XXX XXX XXX');

      // Verify student confirmation uses correct branding
      expect(emails.studentConfirmation.html).toContain('vantagevertical.co.ke/vantage-logo.png');
      expect(emails.studentConfirmation.html).toContain('+254704277687');
      expect(emails.studentConfirmation.html).toContain('vantageverticalltd@gmail.com');
      expect(emails.studentConfirmation.html).not.toContain('vantagevartical.com');
      expect(emails.studentConfirmation.html).not.toContain('+254 XXX XXX XXX');
    });

    it('should generate drone inquiry emails with correct logo and contact information', async () => {
      const mockDroneInquiryData = {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        phone: '+254723456789',
        company: 'Test Company',
        droneId: 'DJI-Mavic-3',
        quantity: 2,
        inquiryType: 'quote' as const,
        budget: '200k-500k',
        timeline: 'short',
        experience: 'intermediate' as const,
        intendedUse: 'Agricultural monitoring',
        message: 'Need drones for crop monitoring',
        trainingNeeded: true,
        financingInterest: false
      };

      // Mock the drone inquiry template generation
      const { generateDroneInquiryAdminEmail, generateDroneInquiryCustomerEmail } = require('@/lib/email/templates/droneInquiry');
      const adminEmail = generateDroneInquiryAdminEmail(mockDroneInquiryData);
      const customerEmail = generateDroneInquiryCustomerEmail(mockDroneInquiryData);

      // Verify admin email uses correct branding
      expect(adminEmail.html).toContain('vantagevertical.co.ke/vantage-logo.png');
      expect(adminEmail.html).toContain('+254704277687');
      expect(adminEmail.html).toContain('vantageverticalltd@gmail.com');
      expect(adminEmail.html).not.toContain('vantagevartical.com');
      expect(adminEmail.html).not.toContain('+254 XXX XXX XXX');

      // Verify customer email uses correct branding
      expect(customerEmail.html).toContain('vantagevertical.co.ke/vantage-logo.png');
      expect(customerEmail.html).toContain('+254704277687');
      expect(customerEmail.html).toContain('vantageverticalltd@gmail.com');
      expect(customerEmail.html).not.toContain('vantagevartical.com');
      expect(customerEmail.html).not.toContain('+254 XXX XXX XXX');
    });

    it('should generate newsletter emails with correct logo and contact information', async () => {
      const mockNewsletterData = {
        email: 'subscriber@example.com',
        confirmationToken: 'test-token-123',
        subscribedAt: new Date(),
        confirmed: true
      };

      const confirmationUrl = 'https://vantagevertical.co.ke/newsletter/confirm?token=test-token-123';

      // Mock the newsletter template generation
      const { generateNewsletterEmails } = require('@/lib/email/templates/newsletter');
      const emails = generateNewsletterEmails(mockNewsletterData, confirmationUrl);

      // Verify welcome email uses correct branding
      expect(emails.welcomeEmail.html).toContain('vantagevertical.co.ke/vantage-logo.png');
      expect(emails.welcomeEmail.html).toContain('+254704277687');
      expect(emails.welcomeEmail.html).toContain('vantageverticalltd@gmail.com');
      expect(emails.welcomeEmail.html).not.toContain('vantagevartical.com');
      expect(emails.welcomeEmail.html).not.toContain('+254 XXX XXX XXX');

      // Verify confirmation email uses correct branding
      expect(emails.confirmationEmail.html).toContain('vantagevertical.co.ke/vantage-logo.png');
      expect(emails.confirmationEmail.html).toContain('+254704277687');
      expect(emails.confirmationEmail.html).toContain('vantageverticalltd@gmail.com');
      expect(emails.confirmationEmail.html).not.toContain('vantagevartical.com');
      expect(emails.confirmationEmail.html).not.toContain('+254 XXX XXX XXX');

      // Verify admin notification uses correct branding
      expect(emails.adminNotification.html).toContain('vantagevertical.co.ke/vantage-logo.png');
      expect(emails.adminNotification.html).toContain('+254704277687');
      expect(emails.adminNotification.html).toContain('vantageverticalltd@gmail.com');
      expect(emails.adminNotification.html).not.toContain('vantagevartical.com');
      expect(emails.adminNotification.html).not.toContain('+254 XXX XXX XXX');
    });

    it('should verify all email types render correctly with new branding', async () => {
      // Test that base template configuration is consistent across all email types
      const { generateBaseTemplate, getLogoUrl, validateLogoUrl } = require('@/lib/email/templates/base');
      
      // Test logo URL validation
      const correctLogoUrl = getLogoUrl('light');
      const darkLogoUrl = getLogoUrl('dark');
      
      expect(validateLogoUrl(correctLogoUrl)).toBe(true);
      expect(validateLogoUrl(darkLogoUrl)).toBe(true);
      expect(validateLogoUrl('https://vantagevartical.com/logo.png')).toBe(false); // Wrong domain
      
      // Test base template generation
      const testContent = '<h1>Test Email</h1><p>This is a test email content.</p>';
      const template = generateBaseTemplate(testContent);
      
      // Verify base template uses correct branding
      expect(template.html).toContain('vantagevertical.co.ke/vantage-logo.png');
      expect(template.html).toContain('+254704277687');
      expect(template.html).toContain('vantageverticalltd@gmail.com');
      expect(template.html).toContain('https://vantagevertical.co.ke');
      expect(template.html).not.toContain('vantagevartical.com');
      expect(template.html).not.toContain('+254 XXX XXX XXX');
      
      // Verify text version also contains correct information
      expect(template.text).toContain('Vantage Vertical');
      expect(template.text).toContain('+254704277687');
      expect(template.text).toContain('vantageverticalltd@gmail.com');
    });

    it('should validate contact information consistency across templates', async () => {
      const { validateContactInfo, validateCompanyStandards } = require('@/lib/email/templates/base');
      
      const correctData = {
        companyName: 'Vantage Vertical',
        logoUrl: 'https://vantagevertical.co.ke/vantage-logo.png',
        websiteUrl: 'https://vantagevertical.co.ke',
        contactEmail: 'vantageverticalltd@gmail.com',
        contactPhone: '+254704277687'
      };
      
      const incorrectData = {
        companyName: 'Vantage Vertical',
        logoUrl: 'https://vantagevartical.com/logo.png', // Wrong domain
        websiteUrl: 'https://vantagevartical.com', // Wrong domain
        contactEmail: 'contact@vantagevartical.com', // Wrong email
        contactPhone: '+254 XXX XXX XXX' // Placeholder
      };
      
      // Test correct data validation
      const correctErrors = validateContactInfo(correctData);
      const correctWarnings = validateCompanyStandards(correctData);
      
      expect(correctErrors).toHaveLength(0);
      expect(correctWarnings).toHaveLength(0);
      
      // Test incorrect data validation
      const incorrectErrors = validateContactInfo(incorrectData);
      const incorrectWarnings = validateCompanyStandards(incorrectData);
      
      expect(incorrectErrors.length).toBeGreaterThan(0);
      expect(incorrectWarnings.length).toBeGreaterThan(0);
      
      // Verify specific error messages
      expect(incorrectErrors.some(error => error.includes('phone number format'))).toBe(true);
      expect(incorrectErrors.some(error => error.includes('correct domain'))).toBe(true);
      expect(incorrectWarnings.some(warning => warning.includes('standardized company email'))).toBe(true);
    });
  });

  describe('status integration', () => {
    it('should include ErrorHandler metrics in service status', () => {
      const status = emailService.getStatus();

      expect(status).toHaveProperty('metrics');
      expect(status.metrics).toHaveProperty('totalOperations');
      expect(status.metrics).toHaveProperty('successRate');
      expect(status.metrics).toHaveProperty('errorsByType');
      expect(status).toHaveProperty('circuitBreakerOpen');
      expect(status).toHaveProperty('consecutiveFailures');
    });

    it('should reset circuit breaker through service', () => {
      // Manually set circuit breaker to open state for testing
      for (let i = 0; i < 5; i++) {
        const error = { 
          success: false, 
          error: { 
            type: EmailErrorType.SMTP_CONNECTION_ERROR,
            retryable: true,
            name: 'SMTPConnectionError',
            message: 'SMTP connection failed'
          } as EmailError
        };
        emailErrorHandler.logOperation('send', error, 1000);
      }

      expect(emailErrorHandler.isCircuitBreakerOpen()).toBe(true);

      // Reset through service
      emailService.resetCircuitBreaker();

      expect(emailErrorHandler.isCircuitBreakerOpen()).toBe(false);
    });
  });
});