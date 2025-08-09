import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { 
  EmailServiceConfig, 
  EmailOptions, 
  EmailResult, 
  EmailError, 
  EmailErrorType 
} from './types';
import { 
  validateSMTPConfig, 
  getEmailConfig, 
  isValidEmail,
  sanitizeEmailContent
} from './utils';
import { EmailErrorHandler, emailErrorHandler } from './errorHandler';

export class EmailService {
  private transporter: Transporter | null = null;
  private config: EmailServiceConfig | null = null;
  private isConfigured = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initializes the email service with SMTP configuration
   */
  private initialize(): void {
    try {
      const smtpConfig = validateSMTPConfig();
      if (!smtpConfig) {
        console.warn('Email service not configured: Missing or invalid SMTP configuration');
        return;
      }

      this.config = getEmailConfig(smtpConfig);
      this.transporter = nodemailer.createTransport({
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        auth: {
          user: this.config.auth.user,
          pass: this.config.auth.pass,
        },
        pool: true, // Use connection pooling
        maxConnections: 5,
        maxMessages: 100,
      });

      this.isConfigured = true;
      console.log('Email service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize email service:', error);
      this.isConfigured = false;
    }
  }

  /**
   * Validates the current SMTP configuration
   * @returns Promise<boolean> - true if configuration is valid
   */
  async validateConfiguration(): Promise<boolean> {
    const startTime = Date.now();
    
    if (!this.isConfigured || !this.config) {
      const error = EmailErrorHandler.handleError(
        new Error('Email service not configured'),
        { operation: 'validate_configuration' }
      );
      
      emailErrorHandler.logOperation(
        'validate',
        { success: false, error },
        Date.now() - startTime
      );
      
      return false;
    }

    try {
      // Validate required configuration fields
      const requiredFields = ['host', 'port', 'auth.user', 'auth.pass', 'from'];
      for (const field of requiredFields) {
        const value = field.includes('.') 
          ? field.split('.').reduce((obj, key) => obj?.[key], this.config as any)
          : (this.config as any)[field];
        
        if (!value) {
          const error = EmailErrorHandler.handleError(
            new Error(`Missing required configuration field: ${field}`),
            { field, operation: 'validate_configuration' }
          );
          
          emailErrorHandler.logOperation(
            'validate',
            { success: false, error },
            Date.now() - startTime
          );
          
          return false;
        }
      }

      // Validate email format
      if (!isValidEmail(this.config.from)) {
        const error = EmailErrorHandler.handleError(
          new Error('Invalid from email address in configuration'),
          { fromEmail: this.config.from, operation: 'validate_configuration' }
        );
        
        emailErrorHandler.logOperation(
          'validate',
          { success: false, error },
          Date.now() - startTime
        );
        
        return false;
      }

      emailErrorHandler.logOperation(
        'validate',
        { success: true },
        Date.now() - startTime
      );
      
      return true;
    } catch (error) {
      const emailError = EmailErrorHandler.handleError(
        error as Error,
        { operation: 'validate_configuration' }
      );
      
      emailErrorHandler.logOperation(
        'validate',
        { success: false, error: emailError },
        Date.now() - startTime
      );
      
      return false;
    }
  }

  /**
   * Tests the SMTP connection
   * @returns Promise<boolean> - true if connection is successful
   */
  async testConnection(): Promise<boolean> {
    const startTime = Date.now();
    
    if (!this.transporter || !this.isConfigured) {
      const error = EmailErrorHandler.handleError(
        new Error('Email service not configured'),
        { operation: 'test_connection' }
      );
      
      emailErrorHandler.logOperation(
        'test_connection',
        { success: false, error },
        Date.now() - startTime
      );
      
      return false;
    }

    try {
      await this.transporter.verify();
      
      emailErrorHandler.logOperation(
        'test_connection',
        { success: true },
        Date.now() - startTime
      );
      
      return true;
    } catch (error) {
      const emailError = EmailErrorHandler.handleError(
        error as Error,
        { operation: 'test_connection' }
      );
      
      emailErrorHandler.logOperation(
        'test_connection',
        { success: false, error: emailError },
        Date.now() - startTime
      );
      
      return false;
    }
  }

  /**
   * Checks if the circuit breaker is open (service temporarily disabled)
   * @returns boolean - true if circuit breaker is open
   */
  private isCircuitBreakerOpen(): boolean {
    return emailErrorHandler.isCircuitBreakerOpen();
  }

  /**
   * Sends an email with retry logic and error handling
   * @param options - Email options
   * @returns Promise<EmailResult> - Result of email sending operation
   */
  async sendEmail(options: EmailOptions): Promise<EmailResult> {
    const startTime = Date.now();
    
    // Validate input
    if (!isValidEmail(options.to)) {
      const error = EmailErrorHandler.handleError(
        new Error('Invalid recipient email address'),
        { recipient: options.to, operation: 'send_email' }
      );
      const result = this.createFailureResult(options, error, 0);
      
      emailErrorHandler.logOperation(
        'send',
        result,
        Date.now() - startTime,
        { recipient: options.to, subject: options.subject }
      );
      
      return result;
    }

    // Check circuit breaker
    if (this.isCircuitBreakerOpen()) {
      const circuitStatus = emailErrorHandler.getCircuitBreakerStatus();
      const error = EmailErrorHandler.handleError(
        new Error('Email service temporarily disabled due to consecutive failures'),
        { 
          consecutiveFailures: circuitStatus.consecutiveFailures,
          operation: 'send_email',
          circuitBreakerOpen: true
        }
      );
      const result = this.createFailureResult(options, error, 0);
      
      emailErrorHandler.logOperation(
        'send',
        result,
        Date.now() - startTime,
        { recipient: options.to, subject: options.subject }
      );
      
      return result;
    }

    // Check if service is configured
    if (!this.isConfigured || !this.transporter || !this.config) {
      const error = EmailErrorHandler.handleError(
        new Error('Email service not configured'),
        { operation: 'send_email' }
      );
      const result = this.createFailureResult(options, error, 0);
      
      emailErrorHandler.logOperation(
        'send',
        result,
        Date.now() - startTime,
        { recipient: options.to, subject: options.subject }
      );
      
      return result;
    }

    // Sanitize content
    const sanitizedOptions = {
      ...options,
      subject: sanitizeEmailContent(options.subject),
      html: options.html, // HTML content should be handled by template system
      text: options.text ? sanitizeEmailContent(options.text) : undefined,
      from: options.from || this.config.from,
    };

    // Attempt to send with retry logic
    try {
      const result = await this.retryWithBackoff(
        () => this.attemptSend(sanitizedOptions),
        this.config.retryAttempts
      );
      
      emailErrorHandler.logOperation(
        'send',
        result,
        Date.now() - startTime,
        { recipient: options.to, subject: options.subject }
      );
      
      return result;
    } catch (error) {
      const result = this.createFailureResult(options, error as EmailError, 0);
      
      emailErrorHandler.logOperation(
        'send',
        result,
        Date.now() - startTime,
        { recipient: options.to, subject: options.subject }
      );
      
      return result;
    }
  }

  /**
   * Attempts to send an email (single attempt)
   * @param options - Sanitized email options
   * @returns Promise<EmailResult> - Result of single send attempt
   */
  private async attemptSend(options: EmailOptions): Promise<EmailResult> {
    try {
      const info = await this.transporter!.sendMail(options);
      
      return {
        success: true,
        messageId: info.messageId,
        retryCount: 0,
        timestamp: new Date(),
        recipient: options.to,
        subject: options.subject,
      };
    } catch (error: any) {
      const emailError = EmailErrorHandler.handleError(
        error,
        { 
          recipient: options.to, 
          subject: options.subject,
          smtpCode: error.code,
          smtpResponse: error.response,
          operation: 'attempt_send'
        }
      );
      
      throw emailError;
    }
  }

  /**
   * Implements retry logic with exponential backoff
   * @param fn - Function to retry
   * @param maxAttempts - Maximum number of attempts
   * @returns Promise<EmailResult> - Final result after all attempts
   */
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxAttempts: number
  ): Promise<T> {
    let lastError: EmailError | null = null;
    
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const result = await fn();
        
        // If we have a successful result, add retry count
        if (typeof result === 'object' && result !== null && 'success' in result) {
          (result as any).retryCount = attempt;
        }
        
        return result;
      } catch (error) {
        lastError = error as EmailError;
        
        // Don't retry if error is not retryable
        if (!lastError.retryable) {
          break;
        }
        
        // Don't retry on last attempt
        if (attempt === maxAttempts - 1) {
          break;
        }
        
        // Calculate delay and wait
        const delay = EmailErrorHandler.getRetryDelay(attempt, this.config!.retryDelay);
        console.log(`Email send attempt ${attempt + 1} failed, retrying in ${delay}ms:`, lastError.message);
        await this.sleep(delay);
      }
    }
    
    // All attempts failed, return failure result
    throw lastError;
  }

  /**
   * Creates a failure result object
   * @param options - Original email options
   * @param error - The error that occurred
   * @param retryCount - Number of retries attempted
   * @returns EmailResult - Failure result
   */
  private createFailureResult(
    options: EmailOptions, 
    error: EmailError, 
    retryCount: number
  ): EmailResult {
    return {
      success: false,
      error,
      retryCount,
      timestamp: new Date(),
      recipient: options.to,
      subject: options.subject,
    };
  }

  /**
   * Utility function to sleep for specified milliseconds
   * @param ms - Milliseconds to sleep
   * @returns Promise<void>
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Gets the current configuration status
   * @returns Object with configuration status information
   */
  getStatus() {
    const circuitStatus = emailErrorHandler.getCircuitBreakerStatus();
    const metrics = emailErrorHandler.getMetrics();
    
    return {
      isConfigured: this.isConfigured,
      consecutiveFailures: circuitStatus.consecutiveFailures,
      circuitBreakerOpen: circuitStatus.isOpen,
      lastFailureTime: circuitStatus.lastFailureTime,
      metrics: {
        totalOperations: metrics.totalOperations,
        successRate: metrics.successRate,
        averageRetryCount: metrics.averageRetryCount,
        averageDuration: metrics.averageDuration,
        errorsByType: metrics.errorsByType,
      },
      config: this.config ? {
        host: this.config.host,
        port: this.config.port,
        secure: this.config.secure,
        from: this.config.from,
        retryAttempts: this.config.retryAttempts,
        retryDelay: this.config.retryDelay,
      } : null,
    };
  }

  /**
   * Sends enrollment confirmation and admin notification emails
   * @param enrollmentData - Training enrollment data
   * @returns Promise<{ studentResult: EmailResult, adminResult: EmailResult }>
   */
  async sendEnrollmentEmails(enrollmentData: any): Promise<{ studentResult: EmailResult, adminResult: EmailResult }> {
    const { generateEnrollmentEmails } = await import('./templates/enrollment');
    const { adminNotification, studentConfirmation } = generateEnrollmentEmails(enrollmentData);

    // Send both emails concurrently
    const [adminResult, studentResult] = await Promise.allSettled([
      this.sendEmail({
        to: process.env.CONTACT_EMAIL || 'vantagevarticalltd@gmail.com',
        subject: adminNotification.subject,
        html: adminNotification.html,
        text: adminNotification.text,
      }),
      this.sendEmail({
        to: enrollmentData.email,
        subject: studentConfirmation.subject,
        html: studentConfirmation.html,
        text: studentConfirmation.text,
      })
    ]);

    return {
      adminResult: adminResult.status === 'fulfilled' ? adminResult.value : {
        success: false,
        error: adminResult.reason,
        retryCount: 0,
        timestamp: new Date(),
        recipient: process.env.CONTACT_EMAIL || 'vantagevarticalltd@gmail.com',
        subject: adminNotification.subject,
      },
      studentResult: studentResult.status === 'fulfilled' ? studentResult.value : {
        success: false,
        error: studentResult.reason,
        retryCount: 0,
        timestamp: new Date(),
        recipient: enrollmentData.email,
        subject: studentConfirmation.subject,
      }
    };
  }

  /**
   * Manually reset the circuit breaker
   */
  resetCircuitBreaker(): void {
    emailErrorHandler.resetCircuitBreaker();
  }
}

// Export singleton instance
export const emailService = new EmailService();