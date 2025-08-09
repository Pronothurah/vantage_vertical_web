import { EmailError, EmailErrorType, EmailResult } from './types';

export interface EmailOperationLog {
  id: string;
  timestamp: Date;
  operation: 'send' | 'validate' | 'test_connection';
  recipient?: string;
  subject?: string;
  success: boolean;
  error?: EmailError;
  retryCount: number;
  duration: number;
  context?: Record<string, any>;
}

export interface EmailMetrics {
  totalOperations: number;
  successfulOperations: number;
  failedOperations: number;
  successRate: number;
  averageRetryCount: number;
  averageDuration: number;
  errorsByType: Record<EmailErrorType, number>;
  lastOperationTime: Date | null;
  consecutiveFailures: number;
}

export class EmailErrorHandler {
  private operationLogs: EmailOperationLog[] = [];
  private maxLogSize = 1000; // Keep last 1000 operations
  private consecutiveFailures = 0;
  private circuitBreakerThreshold = 5;
  private circuitBreakerResetTime = 300000; // 5 minutes
  private lastFailureTime = 0;
  private isCircuitOpen = false;

  /**
   * Handles and classifies email errors
   * @param error - The original error
   * @param context - Additional context information
   * @returns Classified EmailError
   */
  static handleError(error: Error, context: Record<string, any> = {}): EmailError {
    const emailError = new Error(error.message) as EmailError;
    emailError.name = 'EmailError';
    emailError.type = EmailErrorHandler.classifyError(error);
    emailError.originalError = error;
    emailError.context = context;
    emailError.retryable = EmailErrorHandler.shouldRetry(emailError);
    
    return emailError;
  }

  /**
   * Classifies errors based on error message, code, and context
   * @param error - The original error
   * @returns Appropriate EmailErrorType
   */
  static classifyError(error: any): EmailErrorType {
    const message = error.message?.toLowerCase() || '';
    const code = error.code;

    // Authentication errors
    if (message.includes('authentication') || 
        message.includes('invalid login') || 
        message.includes('invalid credentials') ||
        code === 'EAUTH' || 
        code === 535) {
      return EmailErrorType.AUTHENTICATION_ERROR;
    }

    // Connection errors
    if (message.includes('connection') || 
        message.includes('timeout') || 
        message.includes('network') ||
        message.includes('dns') ||
        code === 'ECONNECTION' || 
        code === 'ETIMEDOUT' || 
        code === 'ENOTFOUND' ||
        code === 'ECONNREFUSED') {
      return EmailErrorType.SMTP_CONNECTION_ERROR;
    }

    // Rate limiting errors
    if (message.includes('rate limit') || 
        message.includes('too many') || 
        message.includes('quota exceeded') ||
        message.includes('throttled') ||
        code === 421 || 
        code === 450 || 
        code === 451) {
      return EmailErrorType.RATE_LIMIT_ERROR;
    }

    // Configuration errors
    if (message.includes('invalid') && 
        (message.includes('host') || message.includes('port') || message.includes('configuration'))) {
      return EmailErrorType.CONFIGURATION_ERROR;
    }

    // Template errors
    if (message.includes('template') || 
        message.includes('render') || 
        message.includes('missing data')) {
      return EmailErrorType.TEMPLATE_ERROR;
    }

    // Validation errors
    if (message.includes('invalid email') || 
        message.includes('invalid recipient') ||
        message.includes('malformed') || 
        message.includes('validation') ||
        code === 550 || 
        code === 553) {
      return EmailErrorType.VALIDATION_ERROR;
    }

    return EmailErrorType.UNKNOWN_ERROR;
  }

  /**
   * Determines if an error should be retried
   * @param error - The EmailError to check
   * @returns true if the error is retryable
   */
  static shouldRetry(error: EmailError): boolean {
    switch (error.type) {
      case EmailErrorType.SMTP_CONNECTION_ERROR:
      case EmailErrorType.RATE_LIMIT_ERROR:
      case EmailErrorType.UNKNOWN_ERROR:
        return true;
      case EmailErrorType.CONFIGURATION_ERROR:
      case EmailErrorType.AUTHENTICATION_ERROR:
      case EmailErrorType.TEMPLATE_ERROR:
      case EmailErrorType.VALIDATION_ERROR:
        return false;
      default:
        return false;
    }
  }

  /**
   * Calculates retry delay with exponential backoff
   * @param attempt - Current attempt number (0-based)
   * @param baseDelay - Base delay in milliseconds
   * @returns Delay in milliseconds with jitter
   */
  static getRetryDelay(attempt: number, baseDelay: number = 1000): number {
    const exponentialDelay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 0.1 * exponentialDelay; // Add 10% jitter
    return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
  }

  /**
   * Logs an email operation with detailed information
   * @param operation - Type of operation
   * @param result - Result of the operation
   * @param duration - Duration in milliseconds
   * @param context - Additional context
   */
  logOperation(
    operation: 'send' | 'validate' | 'test_connection',
    result: EmailResult | { success: boolean; error?: EmailError },
    duration: number,
    context: Record<string, any> = {}
  ): void {
    const logEntry: EmailOperationLog = {
      id: this.generateLogId(),
      timestamp: new Date(),
      operation,
      recipient: 'recipient' in result ? result.recipient : context.recipient,
      subject: 'subject' in result ? result.subject : context.subject,
      success: result.success,
      error: result.error,
      retryCount: 'retryCount' in result ? result.retryCount : 0,
      duration,
      context,
    };

    this.operationLogs.push(logEntry);

    // Maintain log size limit
    if (this.operationLogs.length > this.maxLogSize) {
      this.operationLogs = this.operationLogs.slice(-this.maxLogSize);
    }

    // Update circuit breaker state
    this.updateCircuitBreakerState(result.success);

    // Log to console with appropriate level
    this.logToConsole(logEntry);
  }

  /**
   * Updates circuit breaker state based on operation result
   * @param success - Whether the operation was successful
   */
  private updateCircuitBreakerState(success: boolean): void {
    if (success) {
      this.consecutiveFailures = 0;
      if (this.isCircuitOpen) {
        this.isCircuitOpen = false;
        console.log('Email service circuit breaker closed - service restored');
      }
    } else {
      this.consecutiveFailures++;
      this.lastFailureTime = Date.now();

      if (this.consecutiveFailures >= this.circuitBreakerThreshold && !this.isCircuitOpen) {
        this.isCircuitOpen = true;
        console.error(
          `Email service circuit breaker opened after ${this.consecutiveFailures} consecutive failures. ` +
          `Service will be disabled for ${this.circuitBreakerResetTime / 1000} seconds.`
        );
      }
    }
  }

  /**
   * Checks if the circuit breaker is open
   * @returns true if circuit breaker is open
   */
  isCircuitBreakerOpen(): boolean {
    if (!this.isCircuitOpen) {
      return false;
    }

    const timeSinceLastFailure = Date.now() - this.lastFailureTime;
    if (timeSinceLastFailure > this.circuitBreakerResetTime) {
      // Reset circuit breaker after timeout
      this.isCircuitOpen = false;
      this.consecutiveFailures = 0;
      console.log('Email service circuit breaker reset after timeout');
      return false;
    }

    return true;
  }

  /**
   * Manually resets the circuit breaker
   */
  resetCircuitBreaker(): void {
    this.isCircuitOpen = false;
    this.consecutiveFailures = 0;
    this.lastFailureTime = 0;
    console.log('Email service circuit breaker manually reset');
  }

  /**
   * Gets current email operation metrics
   * @returns EmailMetrics with success rates and error statistics
   */
  getMetrics(): EmailMetrics {
    const totalOperations = this.operationLogs.length;
    const successfulOperations = this.operationLogs.filter(log => log.success).length;
    const failedOperations = totalOperations - successfulOperations;

    const errorsByType: Record<EmailErrorType, number> = {
      [EmailErrorType.CONFIGURATION_ERROR]: 0,
      [EmailErrorType.SMTP_CONNECTION_ERROR]: 0,
      [EmailErrorType.AUTHENTICATION_ERROR]: 0,
      [EmailErrorType.RATE_LIMIT_ERROR]: 0,
      [EmailErrorType.TEMPLATE_ERROR]: 0,
      [EmailErrorType.VALIDATION_ERROR]: 0,
      [EmailErrorType.UNKNOWN_ERROR]: 0,
    };

    let totalRetryCount = 0;
    let totalDuration = 0;

    this.operationLogs.forEach(log => {
      if (log.error) {
        errorsByType[log.error.type]++;
      }
      totalRetryCount += log.retryCount;
      totalDuration += log.duration;
    });

    return {
      totalOperations,
      successfulOperations,
      failedOperations,
      successRate: totalOperations > 0 ? (successfulOperations / totalOperations) * 100 : 0,
      averageRetryCount: totalOperations > 0 ? totalRetryCount / totalOperations : 0,
      averageDuration: totalOperations > 0 ? totalDuration / totalOperations : 0,
      errorsByType,
      lastOperationTime: this.operationLogs.length > 0 
        ? this.operationLogs[this.operationLogs.length - 1].timestamp 
        : null,
      consecutiveFailures: this.consecutiveFailures,
    };
  }

  /**
   * Gets recent operation logs
   * @param limit - Maximum number of logs to return
   * @returns Array of recent EmailOperationLog entries
   */
  getRecentLogs(limit: number = 50): EmailOperationLog[] {
    return this.operationLogs
      .slice(-limit)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Gets logs filtered by criteria
   * @param filters - Filter criteria
   * @returns Filtered array of EmailOperationLog entries
   */
  getFilteredLogs(filters: {
    success?: boolean;
    operation?: 'send' | 'validate' | 'test_connection';
    errorType?: EmailErrorType;
    recipient?: string;
    since?: Date;
    limit?: number;
  }): EmailOperationLog[] {
    let filteredLogs = this.operationLogs;

    if (filters.success !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.success === filters.success);
    }

    if (filters.operation) {
      filteredLogs = filteredLogs.filter(log => log.operation === filters.operation);
    }

    if (filters.errorType) {
      filteredLogs = filteredLogs.filter(log => log.error?.type === filters.errorType);
    }

    if (filters.recipient) {
      filteredLogs = filteredLogs.filter(log => log.recipient === filters.recipient);
    }

    if (filters.since) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.since!);
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters.limit) {
      filteredLogs = filteredLogs.slice(0, filters.limit);
    }

    return filteredLogs;
  }

  /**
   * Clears operation logs
   * @param olderThan - Optional date to clear logs older than
   */
  clearLogs(olderThan?: Date): void {
    if (olderThan) {
      this.operationLogs = this.operationLogs.filter(log => log.timestamp >= olderThan);
      console.log(`Cleared email operation logs older than ${olderThan.toISOString()}`);
    } else {
      this.operationLogs = [];
      console.log('Cleared all email operation logs');
    }
  }

  /**
   * Gets circuit breaker status
   * @returns Object with circuit breaker information
   */
  getCircuitBreakerStatus() {
    return {
      isOpen: this.isCircuitBreakerOpen(),
      consecutiveFailures: this.consecutiveFailures,
      threshold: this.circuitBreakerThreshold,
      lastFailureTime: this.lastFailureTime,
      resetTime: this.circuitBreakerResetTime,
      timeUntilReset: this.isCircuitOpen 
        ? Math.max(0, this.circuitBreakerResetTime - (Date.now() - this.lastFailureTime))
        : 0,
    };
  }

  /**
   * Generates a unique log ID
   * @returns Unique string identifier
   */
  private generateLogId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Logs operation to console with appropriate level
   * @param logEntry - The log entry to output
   */
  private logToConsole(logEntry: EmailOperationLog): void {
    const { operation, success, recipient, subject, error, retryCount, duration } = logEntry;
    
    const baseMessage = `Email ${operation} ${success ? 'succeeded' : 'failed'}`;
    const details = [
      recipient && `to: ${recipient}`,
      subject && `subject: "${subject}"`,
      `duration: ${duration}ms`,
      retryCount > 0 && `retries: ${retryCount}`,
    ].filter(Boolean).join(', ');

    const fullMessage = `${baseMessage} (${details})`;

    if (success) {
      console.log(fullMessage);
    } else {
      console.error(`${fullMessage} - Error: ${error?.message || 'Unknown error'}`);
      
      // Log additional error details for debugging
      if (error?.context) {
        console.error('Error context:', error.context);
      }
      
      if (error?.originalError && error.originalError !== error) {
        console.error('Original error:', error.originalError);
      }
    }
  }
}

// Export singleton instance
export const emailErrorHandler = new EmailErrorHandler();