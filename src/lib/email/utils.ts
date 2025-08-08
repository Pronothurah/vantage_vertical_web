import { EmailError, EmailErrorType, SMTPConfig, EmailServiceConfig } from './types';

/**
 * Validates SMTP configuration from environment variables
 * @returns SMTPConfig if valid, null if invalid or missing
 */
export function validateSMTPConfig(): SMTPConfig | null {
  const requiredVars = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  };

  // Check if all required variables are present
  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      console.warn(`Missing required SMTP configuration: SMTP_${key.toUpperCase()}`);
      return null;
    }
  }

  const port = parseInt(requiredVars.port!, 10);
  if (isNaN(port) || port <= 0 || port > 65535) {
    console.warn('Invalid SMTP_PORT: must be a valid port number');
    return null;
  }

  return {
    host: requiredVars.host!,
    port,
    user: requiredVars.user!,
    pass: requiredVars.pass!,
    from: process.env.SMTP_FROM || requiredVars.user!,
    contactEmail: process.env.CONTACT_EMAIL || 'vantagevarticalltd@gmail.com',
  };
}

/**
 * Converts SMTP config to EmailService config with defaults
 * @param smtpConfig - Validated SMTP configuration
 * @returns EmailServiceConfig with retry settings
 */
export function getEmailConfig(smtpConfig: SMTPConfig): EmailServiceConfig {
  return {
    host: smtpConfig.host,
    port: smtpConfig.port,
    secure: smtpConfig.port === 465, // Use secure for port 465, otherwise use STARTTLS
    auth: {
      user: smtpConfig.user,
      pass: smtpConfig.pass,
    },
    from: smtpConfig.from,
    retryAttempts: 5,
    retryDelay: 1000, // Base delay in milliseconds
  };
}

/**
 * Creates an EmailError with proper typing and context
 * @param error - Original error
 * @param type - Email error type
 * @param context - Additional context information
 * @returns Properly typed EmailError
 */
export function createEmailError(
  error: Error,
  type: EmailErrorType,
  context?: Record<string, any>
): EmailError {
  const emailError = new Error(error.message) as EmailError;
  emailError.name = 'EmailError';
  emailError.type = type;
  emailError.originalError = error;
  emailError.context = context;
  emailError.retryable = isRetryableError(type);
  
  return emailError;
}

/**
 * Determines if an error type is retryable
 * @param errorType - The email error type
 * @returns true if the error is retryable
 */
export function isRetryableError(errorType: EmailErrorType): boolean {
  switch (errorType) {
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
 * Calculates exponential backoff delay
 * @param attempt - Current attempt number (0-based)
 * @param baseDelay - Base delay in milliseconds
 * @returns Delay in milliseconds with jitter
 */
export function calculateBackoffDelay(attempt: number, baseDelay: number): number {
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 0.1 * exponentialDelay; // Add 10% jitter
  return Math.min(exponentialDelay + jitter, 30000); // Cap at 30 seconds
}

/**
 * Classifies SMTP errors based on error message and code
 * @param error - The original error
 * @returns Appropriate EmailErrorType
 */
export function classifySmtpError(error: any): EmailErrorType {
  const message = error.message?.toLowerCase() || '';
  const code = error.code;

  // Authentication errors
  if (message.includes('authentication') || message.includes('invalid login') || code === 'EAUTH') {
    return EmailErrorType.AUTHENTICATION_ERROR;
  }

  // Connection errors
  if (message.includes('connection') || message.includes('timeout') || 
      code === 'ECONNECTION' || code === 'ETIMEDOUT' || code === 'ENOTFOUND') {
    return EmailErrorType.SMTP_CONNECTION_ERROR;
  }

  // Rate limiting
  if (message.includes('rate limit') || message.includes('too many') || 
      message.includes('quota exceeded')) {
    return EmailErrorType.RATE_LIMIT_ERROR;
  }

  // Configuration errors
  if (message.includes('invalid') && (message.includes('host') || message.includes('port'))) {
    return EmailErrorType.CONFIGURATION_ERROR;
  }

  return EmailErrorType.UNKNOWN_ERROR;
}

/**
 * Validates email address format
 * @param email - Email address to validate
 * @returns true if email is valid
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes email content to prevent injection attacks
 * @param content - Content to sanitize
 * @returns Sanitized content
 */
export function sanitizeEmailContent(content: string): string {
  // Remove potential email injection patterns
  return content
    .replace(/[\r\n]+/g, ' ') // Replace line breaks with spaces
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();
}