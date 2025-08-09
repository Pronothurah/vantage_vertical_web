import { EmailErrorHandler, emailErrorHandler } from '../errorHandler';
import { EmailErrorType, EmailResult } from '../types';

describe('EmailErrorHandler', () => {
  let handler: EmailErrorHandler;

  beforeEach(() => {
    handler = new EmailErrorHandler();
    // Clear any existing logs
    handler.clearLogs();
  });

  describe('handleError', () => {
    it('should classify authentication errors correctly', () => {
      const originalError = new Error('Authentication failed');
      originalError.name = 'AuthError';
      (originalError as any).code = 'EAUTH';

      const emailError = EmailErrorHandler.handleError(originalError, { test: 'context' });

      expect(emailError.type).toBe(EmailErrorType.AUTHENTICATION_ERROR);
      expect(emailError.retryable).toBe(false);
      expect(emailError.originalError).toBe(originalError);
      expect(emailError.context).toEqual({ test: 'context' });
    });

    it('should classify connection errors correctly', () => {
      const originalError = new Error('Connection timeout');
      (originalError as any).code = 'ETIMEDOUT';

      const emailError = EmailErrorHandler.handleError(originalError);

      expect(emailError.type).toBe(EmailErrorType.SMTP_CONNECTION_ERROR);
      expect(emailError.retryable).toBe(true);
    });

    it('should classify rate limit errors correctly', () => {
      const originalError = new Error('Rate limit exceeded');

      const emailError = EmailErrorHandler.handleError(originalError);

      expect(emailError.type).toBe(EmailErrorType.RATE_LIMIT_ERROR);
      expect(emailError.retryable).toBe(true);
    });

    it('should classify validation errors correctly', () => {
      const originalError = new Error('Invalid email address');
      (originalError as any).code = 550;

      const emailError = EmailErrorHandler.handleError(originalError);

      expect(emailError.type).toBe(EmailErrorType.VALIDATION_ERROR);
      expect(emailError.retryable).toBe(false);
    });

    it('should classify unknown errors as retryable', () => {
      const originalError = new Error('Something went wrong');

      const emailError = EmailErrorHandler.handleError(originalError);

      expect(emailError.type).toBe(EmailErrorType.UNKNOWN_ERROR);
      expect(emailError.retryable).toBe(true);
    });
  });

  describe('shouldRetry', () => {
    it('should return true for retryable error types', () => {
      const retryableTypes = [
        EmailErrorType.SMTP_CONNECTION_ERROR,
        EmailErrorType.RATE_LIMIT_ERROR,
        EmailErrorType.UNKNOWN_ERROR,
      ];

      retryableTypes.forEach(type => {
        const error = { type, retryable: true } as any;
        expect(EmailErrorHandler.shouldRetry(error)).toBe(true);
      });
    });

    it('should return false for non-retryable error types', () => {
      const nonRetryableTypes = [
        EmailErrorType.CONFIGURATION_ERROR,
        EmailErrorType.AUTHENTICATION_ERROR,
        EmailErrorType.TEMPLATE_ERROR,
        EmailErrorType.VALIDATION_ERROR,
      ];

      nonRetryableTypes.forEach(type => {
        const error = { type, retryable: false } as any;
        expect(EmailErrorHandler.shouldRetry(error)).toBe(false);
      });
    });
  });

  describe('getRetryDelay', () => {
    it('should calculate exponential backoff correctly', () => {
      const baseDelay = 1000;
      
      const delay0 = EmailErrorHandler.getRetryDelay(0, baseDelay);
      const delay1 = EmailErrorHandler.getRetryDelay(1, baseDelay);
      const delay2 = EmailErrorHandler.getRetryDelay(2, baseDelay);

      // Should be approximately baseDelay * 2^attempt with jitter
      expect(delay0).toBeGreaterThanOrEqual(baseDelay * 0.9);
      expect(delay0).toBeLessThanOrEqual(baseDelay * 1.1);
      
      expect(delay1).toBeGreaterThanOrEqual(baseDelay * 2 * 0.9);
      expect(delay1).toBeLessThanOrEqual(baseDelay * 2 * 1.1);
      
      expect(delay2).toBeGreaterThanOrEqual(baseDelay * 4 * 0.9);
      expect(delay2).toBeLessThanOrEqual(baseDelay * 4 * 1.1);
    });

    it('should cap delay at 30 seconds', () => {
      const delay = EmailErrorHandler.getRetryDelay(10, 1000);
      expect(delay).toBeLessThanOrEqual(30000);
    });
  });

  describe('logOperation', () => {
    it('should log successful operations', () => {
      const result: EmailResult = {
        success: true,
        messageId: 'test-123',
        retryCount: 0,
        timestamp: new Date(),
        recipient: 'test@example.com',
        subject: 'Test Subject',
      };

      handler.logOperation('send', result, 1500);

      const logs = handler.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].success).toBe(true);
      expect(logs[0].operation).toBe('send');
      expect(logs[0].recipient).toBe('test@example.com');
      expect(logs[0].subject).toBe('Test Subject');
      expect(logs[0].duration).toBe(1500);
    });

    it('should log failed operations', () => {
      const error = EmailErrorHandler.handleError(
        new Error('SMTP connection failed'),
        { smtpCode: 'ECONNECTION' }
      );
      
      const result: EmailResult = {
        success: false,
        error,
        retryCount: 2,
        timestamp: new Date(),
        recipient: 'test@example.com',
        subject: 'Test Subject',
      };

      handler.logOperation('send', result, 3000);

      const logs = handler.getRecentLogs(1);
      expect(logs).toHaveLength(1);
      expect(logs[0].success).toBe(false);
      expect(logs[0].error).toBe(error);
      expect(logs[0].retryCount).toBe(2);
    });

    it('should maintain log size limit', () => {
      // Log more than the max size
      for (let i = 0; i < 1100; i++) {
        const result = {
          success: true,
          retryCount: 0,
          timestamp: new Date(),
          recipient: `test${i}@example.com`,
          subject: `Test ${i}`,
        };
        handler.logOperation('send', result, 100);
      }

      const logs = handler.getRecentLogs(2000);
      expect(logs.length).toBeLessThanOrEqual(1000);
    });
  });

  describe('circuit breaker', () => {
    it('should open circuit breaker after consecutive failures', () => {
      expect(handler.isCircuitBreakerOpen()).toBe(false);

      // Log 5 consecutive failures
      for (let i = 0; i < 5; i++) {
        const error = EmailErrorHandler.handleError(new Error('Connection failed'));
        const result = { success: false, error };
        handler.logOperation('send', result, 1000);
      }

      expect(handler.isCircuitBreakerOpen()).toBe(true);
    });

    it('should reset circuit breaker on successful operation', () => {
      // Log failures to open circuit breaker
      for (let i = 0; i < 5; i++) {
        const error = EmailErrorHandler.handleError(new Error('Connection failed'));
        const result = { success: false, error };
        handler.logOperation('send', result, 1000);
      }

      expect(handler.isCircuitBreakerOpen()).toBe(true);

      // Log successful operation
      const successResult = { success: true };
      handler.logOperation('send', successResult, 1000);

      expect(handler.isCircuitBreakerOpen()).toBe(false);
    });

    it('should manually reset circuit breaker', () => {
      // Open circuit breaker
      for (let i = 0; i < 5; i++) {
        const error = EmailErrorHandler.handleError(new Error('Connection failed'));
        const result = { success: false, error };
        handler.logOperation('send', result, 1000);
      }

      expect(handler.isCircuitBreakerOpen()).toBe(true);

      handler.resetCircuitBreaker();
      expect(handler.isCircuitBreakerOpen()).toBe(false);
    });

    it('should reset circuit breaker after timeout', (done) => {
      // Create handler with short reset time for testing
      const testHandler = new EmailErrorHandler();
      (testHandler as any).circuitBreakerResetTime = 100; // 100ms for testing

      // Open circuit breaker
      for (let i = 0; i < 5; i++) {
        const error = EmailErrorHandler.handleError(new Error('Connection failed'));
        const result = { success: false, error };
        testHandler.logOperation('send', result, 1000);
      }

      expect(testHandler.isCircuitBreakerOpen()).toBe(true);

      // Wait for reset timeout
      setTimeout(() => {
        expect(testHandler.isCircuitBreakerOpen()).toBe(false);
        done();
      }, 150);
    });
  });

  describe('getMetrics', () => {
    it('should calculate metrics correctly', () => {
      // Log some operations
      const successResult = { success: true, retryCount: 0 };
      const failureResult = { 
        success: false, 
        error: EmailErrorHandler.handleError(new Error('Test error')),
        retryCount: 2 
      };

      handler.logOperation('send', successResult, 1000);
      handler.logOperation('send', successResult, 1500);
      handler.logOperation('send', failureResult, 2000);

      const metrics = handler.getMetrics();

      expect(metrics.totalOperations).toBe(3);
      expect(metrics.successfulOperations).toBe(2);
      expect(metrics.failedOperations).toBe(1);
      expect(metrics.successRate).toBeCloseTo(66.67, 1);
      expect(metrics.averageRetryCount).toBeCloseTo(0.67, 1);
      expect(metrics.averageDuration).toBeCloseTo(1500, 0);
      expect(metrics.errorsByType[EmailErrorType.UNKNOWN_ERROR]).toBe(1);
    });

    it('should handle empty metrics', () => {
      const metrics = handler.getMetrics();

      expect(metrics.totalOperations).toBe(0);
      expect(metrics.successfulOperations).toBe(0);
      expect(metrics.failedOperations).toBe(0);
      expect(metrics.successRate).toBe(0);
      expect(metrics.averageRetryCount).toBe(0);
      expect(metrics.averageDuration).toBe(0);
      expect(metrics.lastOperationTime).toBeNull();
    });
  });

  describe('getFilteredLogs', () => {
    beforeEach(() => {
      // Set up test data
      const successResult = { success: true, retryCount: 0 };
      const failureResult = { 
        success: false, 
        error: EmailErrorHandler.handleError(new Error('Connection failed')),
        retryCount: 1 
      };

      handler.logOperation('send', successResult, 1000, { recipient: 'user1@example.com' });
      handler.logOperation('validate', successResult, 500);
      handler.logOperation('send', failureResult, 2000, { recipient: 'user2@example.com' });
      handler.logOperation('test_connection', successResult, 300);
    });

    it('should filter by success status', () => {
      const successLogs = handler.getFilteredLogs({ success: true });
      const failureLogs = handler.getFilteredLogs({ success: false });

      expect(successLogs).toHaveLength(3);
      expect(failureLogs).toHaveLength(1);
    });

    it('should filter by operation type', () => {
      const sendLogs = handler.getFilteredLogs({ operation: 'send' });
      const validateLogs = handler.getFilteredLogs({ operation: 'validate' });

      expect(sendLogs).toHaveLength(2);
      expect(validateLogs).toHaveLength(1);
    });

    it('should filter by error type', () => {
      const connectionErrorLogs = handler.getFilteredLogs({ 
        errorType: EmailErrorType.SMTP_CONNECTION_ERROR 
      });

      expect(connectionErrorLogs).toHaveLength(1);
    });

    it('should apply multiple filters', () => {
      const filteredLogs = handler.getFilteredLogs({ 
        success: true, 
        operation: 'send' 
      });

      expect(filteredLogs).toHaveLength(1);
    });

    it('should limit results', () => {
      const limitedLogs = handler.getFilteredLogs({ limit: 2 });

      expect(limitedLogs).toHaveLength(2);
    });
  });

  describe('clearLogs', () => {
    it('should clear all logs', () => {
      const result = { success: true };
      handler.logOperation('send', result, 1000);
      handler.logOperation('send', result, 1000);

      expect(handler.getRecentLogs(10)).toHaveLength(2);

      handler.clearLogs();

      expect(handler.getRecentLogs(10)).toHaveLength(0);
    });

    it('should clear logs older than specified date', () => {
      const result = { success: true };
      
      // Log an operation
      handler.logOperation('send', result, 1000);
      
      // Wait a bit and log another
      setTimeout(() => {
        handler.logOperation('send', result, 1000);
        
        const cutoffDate = new Date(Date.now() - 50);
        handler.clearLogs(cutoffDate);
        
        const remainingLogs = handler.getRecentLogs(10);
        expect(remainingLogs).toHaveLength(1);
      }, 100);
    });
  });

  describe('getCircuitBreakerStatus', () => {
    it('should return correct circuit breaker status', () => {
      const status = handler.getCircuitBreakerStatus();

      expect(status.isOpen).toBe(false);
      expect(status.consecutiveFailures).toBe(0);
      expect(status.threshold).toBe(5);
      expect(status.timeUntilReset).toBe(0);
    });

    it('should return correct status when circuit breaker is open', () => {
      // Open circuit breaker
      for (let i = 0; i < 5; i++) {
        const error = EmailErrorHandler.handleError(new Error('Connection failed'));
        const result = { success: false, error };
        handler.logOperation('send', result, 1000);
      }

      const status = handler.getCircuitBreakerStatus();

      expect(status.isOpen).toBe(true);
      expect(status.consecutiveFailures).toBe(5);
      expect(status.timeUntilReset).toBeGreaterThan(0);
    });
  });
});

describe('emailErrorHandler singleton', () => {
  it('should be a singleton instance', () => {
    expect(emailErrorHandler).toBeInstanceOf(EmailErrorHandler);
  });

  it('should maintain state across imports', () => {
    const result = { success: true };
    emailErrorHandler.logOperation('test_connection', result, 500);

    const logs = emailErrorHandler.getRecentLogs(1);
    expect(logs).toHaveLength(1);
    expect(logs[0].operation).toBe('test_connection');
  });
});