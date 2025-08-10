/**
 * Tests for email service error handling and validation safeguards
 * Verifies task 10 requirements: validation safeguards, automatic correction, logging
 */

import { EmailService } from '../emailService';
import { emailErrorHandler } from '../errorHandler';
import { validateAndCorrectEmail } from '../../utils/emailValidation';
import { isValidEmail } from '../utils';

// Mock dependencies
jest.mock('../utils', () => ({
  ...jest.requireActual('../utils'),
  isValidEmail: jest.fn(),
  isEmailTestMode: jest.fn(() => false),
  validateSMTPConfig: jest.fn(() => null), // Return null to prevent initialization
  getEmailConfig: jest.fn(() => ({
    host: 'smtp.test.com',
    port: 587,
    secure: false,
    auth: { user: 'test@test.com', pass: 'password' },
    from: 'vantageverticalltd@gmail.com',
    retryAttempts: 3,
    retryDelay: 1000
  }))
}));

jest.mock('../../utils/emailValidation');

// Mock the error handler module
jest.mock('../errorHandler', () => ({
  emailErrorHandler: {
    logOperation: jest.fn(),
    isCircuitBreakerOpen: jest.fn(() => false),
    getCircuitBreakerStatus: jest.fn(() => ({ consecutiveFailures: 0, isOpen: false })),
    resetCircuitBreaker: jest.fn(),
    getMetrics: jest.fn(() => ({
      totalOperations: 0,
      successRate: 1,
      averageRetryCount: 0,
      averageDuration: 0,
      errorsByType: {}
    }))
  },
  EmailErrorHandler: {
    handleError: jest.fn((error, context) => ({
      message: error.message,
      type: 'VALIDATION_ERROR',
      retryable: false,
      context
    }))
  }
}));

describe('EmailService Error Handling and Validation', () => {
  let emailService: EmailService;
  let mockValidateAndCorrectEmail: jest.MockedFunction<typeof validateAndCorrectEmail>;
  let mockIsValidEmail: jest.MockedFunction<typeof isValidEmail>;
  let mockEmailErrorHandler: any;

  beforeEach(() => {
    jest.clearAllMocks();
    
    mockValidateAndCorrectEmail = validateAndCorrectEmail as jest.MockedFunction<typeof validateAndCorrectEmail>;
    mockIsValidEmail = isValidEmail as jest.MockedFunction<typeof isValidEmail>;
    
    // Get the mocked error handler
    mockEmailErrorHandler = emailErrorHandler;

    emailService = new EmailService();
  });

  describe('Sender Email Validation and Correction', () => {
    it('should detect and correct typos in sender email', async () => {
      const typoEmail = 'vantagevarticalltd@gmail.com'; // missing 'e' in vertical
      const correctEmail = 'vantageverticalltd@gmail.com';

      mockIsValidEmail.mockReturnValue(true);
      mockValidateAndCorrectEmail.mockReturnValue({
        isValid: false,
        correctedEmail: correctEmail,
        wasTypo: true,
        originalEmail: typoEmail
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await emailService.sendEmail({
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test</p>',
        from: typoEmail
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        `[EMAIL VALIDATION] Typo detected in sender email: "${typoEmail}" -> corrected to: "${correctEmail}"`
      );

      expect(mockEmailErrorHandler.logOperation).toHaveBeenCalledWith(
        'email_correction',
        {
          success: true,
          originalEmail: typoEmail,
          correctedEmail: correctEmail,
          wasTypo: true
        },
        0,
        { operation: 'sender_email_correction', subject: 'Test Subject' }
      );

      consoleSpy.mockRestore();
    });

    it('should standardize invalid sender email format', async () => {
      const invalidEmail = 'vantagevertical@gmail.com'; // missing 'ltd'
      const correctEmail = 'vantageverticalltd@gmail.com';

      mockIsValidEmail.mockReturnValue(true);
      mockValidateAndCorrectEmail.mockReturnValue({
        isValid: false,
        correctedEmail: correctEmail,
        wasTypo: false,
        originalEmail: invalidEmail
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await emailService.sendEmail({
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test</p>',
        from: invalidEmail
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        `[EMAIL VALIDATION] Invalid sender email format: "${invalidEmail}" -> using standardized: "${correctEmail}"`
      );

      expect(mockEmailErrorHandler.logOperation).toHaveBeenCalledWith(
        'email_standardization',
        {
          success: true,
          originalEmail: invalidEmail,
          correctedEmail: correctEmail,
          wasTypo: false
        },
        0,
        { operation: 'sender_email_standardization', subject: 'Test Subject' }
      );

      consoleSpy.mockRestore();
    });

    it('should not modify valid sender email', async () => {
      const validEmail = 'vantageverticalltd@gmail.com';

      mockIsValidEmail.mockReturnValue(true);
      mockValidateAndCorrectEmail.mockReturnValue({
        isValid: true,
        correctedEmail: validEmail,
        wasTypo: false,
        originalEmail: validEmail
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await emailService.sendEmail({
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test</p>',
        from: validEmail
      });

      expect(consoleSpy).not.toHaveBeenCalled();
      expect(mockEmailErrorHandler.logOperation).not.toHaveBeenCalledWith(
        'email_correction',
        expect.any(Object),
        expect.any(Number),
        expect.any(Object)
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Recipient Email Validation', () => {
    it('should reject invalid recipient email', async () => {
      const invalidRecipient = 'invalid-email';

      mockIsValidEmail.mockReturnValue(false);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await emailService.sendEmail({
        to: invalidRecipient,
        subject: 'Test Subject',
        html: '<p>Test</p>'
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        `[EMAIL VALIDATION] Invalid recipient email address: ${invalidRecipient}`
      );

      expect(result.success).toBe(false);
      expect(result.recipient).toBe(invalidRecipient);

      consoleSpy.mockRestore();
    });

    it('should detect typos in recipient email but not auto-correct', async () => {
      const typoRecipient = 'vantagevarticalltd@gmail.com';
      const correctEmail = 'vantageverticalltd@gmail.com';

      mockIsValidEmail.mockReturnValue(true);
      mockValidateAndCorrectEmail
        .mockReturnValueOnce({
          isValid: true,
          correctedEmail: 'vantageverticalltd@gmail.com',
          wasTypo: false,
          originalEmail: 'vantageverticalltd@gmail.com'
        })
        .mockReturnValueOnce({
          isValid: false,
          correctedEmail: correctEmail,
          wasTypo: true,
          originalEmail: typoRecipient
        });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await emailService.sendEmail({
        to: typoRecipient,
        subject: 'Test Subject',
        html: '<p>Test</p>'
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        `[EMAIL VALIDATION] Typo detected in recipient email: "${typoRecipient}" -> should be: "${correctEmail}"`
      );

      expect(mockEmailErrorHandler.logOperation).toHaveBeenCalledWith(
        'recipient_typo_detected',
        {
          success: false,
          originalEmail: typoRecipient,
          suggestedCorrection: correctEmail,
          wasTypo: true
        },
        0,
        { operation: 'recipient_typo_detection', subject: 'Test Subject' }
      );

      consoleSpy.mockRestore();
    });
  });

  describe('Service Configuration Validation', () => {
    it('should log error when service is not configured', async () => {
      // Create a new service instance that won't be configured
      const unconfiguredService = new (EmailService as any)();
      unconfiguredService.isConfigured = false;
      unconfiguredService.transporter = null;
      unconfiguredService.config = null;

      mockIsValidEmail.mockReturnValue(true);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await unconfiguredService.sendEmail({
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test</p>'
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[EMAIL VALIDATION] Email service not configured'
      );

      expect(result.success).toBe(false);

      consoleSpy.mockRestore();
    });
  });

  describe('Enrollment Email Validation', () => {
    it('should validate and correct admin email in enrollment', async () => {
      const typoAdminEmail = 'vantagevarticalltd@gmail.com';
      const correctAdminEmail = 'vantageverticalltd@gmail.com';

      mockIsValidEmail.mockReturnValue(true);
      mockValidateAndCorrectEmail.mockReturnValue({
        isValid: false,
        correctedEmail: correctAdminEmail,
        wasTypo: true,
        originalEmail: typoAdminEmail
      });

      // Mock EMAIL_CONFIG
      jest.doMock('../../config/email', () => ({
        EMAIL_CONFIG: {
          CONTACT_EMAIL: typoAdminEmail,
          SMTP_FROM: 'vantageverticalltd@gmail.com',
          COMPANY_EMAIL: 'vantageverticalltd@gmail.com'
        }
      }));

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await emailService.sendEnrollmentEmails({
        email: 'student@test.com',
        name: 'Test Student'
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        `[EMAIL VALIDATION] Typo detected in enrollment admin email: "${typoAdminEmail}" -> corrected to: "${correctAdminEmail}"`
      );

      expect(mockEmailErrorHandler.logOperation).toHaveBeenCalledWith(
        'email_correction',
        {
          success: true,
          originalEmail: typoAdminEmail,
          correctedEmail: correctAdminEmail,
          wasTypo: true
        },
        0,
        { operation: 'enrollment_admin_email_correction', context: 'sendEnrollmentEmails' }
      );

      consoleSpy.mockRestore();
    });

    it('should handle invalid student email in enrollment', async () => {
      const invalidStudentEmail = 'invalid-student-email';

      mockIsValidEmail
        .mockReturnValueOnce(false) // For student email validation
        .mockReturnValue(true); // For other validations

      mockValidateAndCorrectEmail.mockReturnValue({
        isValid: true,
        correctedEmail: 'vantageverticalltd@gmail.com',
        wasTypo: false,
        originalEmail: 'vantageverticalltd@gmail.com'
      });

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      const result = await emailService.sendEnrollmentEmails({
        email: invalidStudentEmail,
        name: 'Test Student'
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        `[EMAIL VALIDATION] Invalid student email in enrollment: ${invalidStudentEmail}`
      );

      expect(result.studentResult.success).toBe(false);
      expect(result.studentResult.recipient).toBe(invalidStudentEmail);

      consoleSpy.mockRestore();
    });
  });

  describe('Graceful Fallback Behavior', () => {
    it('should use standardized email as fallback for invalid configurations', async () => {
      const invalidEmail = 'vantagevartical@gmail.com'; // Company email with typo
      const standardizedEmail = 'vantageverticalltd@gmail.com';

      mockIsValidEmail.mockReturnValue(true);
      mockValidateAndCorrectEmail.mockReturnValue({
        isValid: false,
        correctedEmail: standardizedEmail,
        wasTypo: false,
        originalEmail: invalidEmail
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      await emailService.sendEmail({
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test</p>',
        from: invalidEmail
      });

      expect(consoleSpy).toHaveBeenCalledWith(
        `[EMAIL VALIDATION] Invalid sender email format: "${invalidEmail}" -> using standardized: "${standardizedEmail}"`
      );

      consoleSpy.mockRestore();
    });

    it('should continue processing even with validation warnings', async () => {
      mockIsValidEmail.mockReturnValue(true);
      mockValidateAndCorrectEmail.mockReturnValue({
        isValid: true,
        correctedEmail: 'vantageverticalltd@gmail.com',
        wasTypo: false,
        originalEmail: 'vantageverticalltd@gmail.com'
      });

      const result = await emailService.sendEmail({
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test</p>'
      });

      // Should not fail due to validation warnings
      expect(result).toBeDefined();
    });
  });

  describe('Logging and Monitoring', () => {
    it('should log all validation operations for monitoring', async () => {
      const typoEmail = 'vantagevarticalltd@gmail.com';
      const correctEmail = 'vantageverticalltd@gmail.com';

      mockIsValidEmail.mockReturnValue(true);
      mockValidateAndCorrectEmail.mockReturnValue({
        isValid: false,
        correctedEmail: correctEmail,
        wasTypo: true,
        originalEmail: typoEmail
      });

      await emailService.sendEmail({
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test</p>',
        from: typoEmail
      });

      // Verify that validation operations are logged
      expect(mockEmailErrorHandler.logOperation).toHaveBeenCalledWith(
        'email_correction',
        expect.objectContaining({
          success: true,
          originalEmail: typoEmail,
          correctedEmail: correctEmail,
          wasTypo: true
        }),
        0,
        expect.objectContaining({
          operation: 'sender_email_correction'
        })
      );
    });

    it('should provide detailed context in log operations', async () => {
      mockIsValidEmail.mockReturnValue(true);
      mockValidateAndCorrectEmail.mockReturnValue({
        isValid: false,
        correctedEmail: 'vantageverticalltd@gmail.com',
        wasTypo: true,
        originalEmail: 'vantagevarticalltd@gmail.com'
      });

      await emailService.sendEmail({
        to: 'recipient@test.com',
        subject: 'Important Email',
        html: '<p>Test</p>',
        from: 'vantagevarticalltd@gmail.com'
      });

      expect(mockEmailErrorHandler.logOperation).toHaveBeenCalledWith(
        'email_correction',
        expect.any(Object),
        0,
        expect.objectContaining({
          operation: 'sender_email_correction',
          subject: 'Important Email'
        })
      );
    });
  });
});