import { EmailService } from '../emailService';
import { emailErrorHandler } from '../errorHandler';
import { EmailErrorType } from '../types';

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
    process.env.CONTACT_EMAIL = 'contact@example.com';
    
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
        const error = { success: false, error: { type: EmailErrorType.SMTP_CONNECTION_ERROR } };
        emailErrorHandler.logOperation('send', error, 1000);
      }

      expect(emailErrorHandler.isCircuitBreakerOpen()).toBe(true);

      // Reset through service
      emailService.resetCircuitBreaker();

      expect(emailErrorHandler.isCircuitBreakerOpen()).toBe(false);
    });
  });
});