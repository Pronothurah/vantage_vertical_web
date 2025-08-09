import { EmailError, EmailErrorType, SMTPConfig, EmailServiceConfig } from './types';
import * as nodemailer from 'nodemailer';

/**
 * Configuration validation result interface
 */
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  config?: SMTPConfig;
}

/**
 * SMTP connection test result interface
 */
export interface ConnectionTestResult {
  success: boolean;
  error?: string;
  details?: {
    host: string;
    port: number;
    secure: boolean;
    responseTime: number;
  };
}

/**
 * Development mode email log entry
 */
export interface DevEmailLog {
  timestamp: Date;
  to: string;
  subject: string;
  html: string;
  text?: string;
  from: string;
}

/**
 * Validates SMTP configuration from environment variables with detailed reporting
 * @returns ConfigValidationResult with validation details
 */
export function validateSMTPConfigDetailed(): ConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const requiredVars = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  };

  // Check if all required variables are present
  for (const [key, value] of Object.entries(requiredVars)) {
    if (!value) {
      errors.push(`Missing required SMTP configuration: SMTP_${key.toUpperCase()}`);
    }
  }

  // If we have missing required vars, return early
  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      warnings,
    };
  }

  // Validate port number
  const port = parseInt(requiredVars.port!, 10);
  if (isNaN(port) || port <= 0 || port > 65535) {
    errors.push('Invalid SMTP_PORT: must be a valid port number between 1 and 65535');
  }

  // Validate host format
  if (requiredVars.host && !isValidHostname(requiredVars.host)) {
    errors.push('Invalid SMTP_HOST: must be a valid hostname or IP address');
  }

  // Validate email addresses
  const fromEmail = process.env.SMTP_FROM || requiredVars.user!;
  if (fromEmail && !isValidEmail(fromEmail)) {
    errors.push('Invalid SMTP_FROM or SMTP_USER: must be a valid email address');
  }

  const contactEmail = process.env.CONTACT_EMAIL || 'vantagevarticalltd@gmail.com';
  if (contactEmail && !isValidEmail(contactEmail)) {
    warnings.push('Invalid CONTACT_EMAIL: should be a valid email address');
  }

  // Check for optional but recommended variables
  if (!process.env.SMTP_FROM) {
    warnings.push('SMTP_FROM not set, using SMTP_USER as sender address');
  }

  if (!process.env.CONTACT_EMAIL) {
    warnings.push('CONTACT_EMAIL not set, using default vantagevarticalltd@gmail.com');
  }

  // Validate common SMTP configurations
  if (requiredVars.host === 'smtp.gmail.com' && port !== 587 && port !== 465) {
    warnings.push('Gmail SMTP typically uses port 587 (STARTTLS) or 465 (SSL)');
  }

  if (errors.length > 0) {
    return {
      isValid: false,
      errors,
      warnings,
    };
  }

  const config: SMTPConfig = {
    host: requiredVars.host!,
    port,
    user: requiredVars.user!,
    pass: requiredVars.pass!,
    from: fromEmail,
    contactEmail,
  };

  return {
    isValid: true,
    errors,
    warnings,
    config,
  };
}

/**
 * Validates SMTP configuration from environment variables (legacy function)
 * @returns SMTPConfig if valid, null if invalid or missing
 */
export function validateSMTPConfig(): SMTPConfig | null {
  const result = validateSMTPConfigDetailed();
  return result.isValid ? result.config! : null;
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
 * Validates hostname format
 * @param hostname - Hostname to validate
 * @returns true if hostname is valid
 */
export function isValidHostname(hostname: string): boolean {
  // Basic hostname validation - allows domain names and IP addresses
  const hostnameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  
  return hostnameRegex.test(hostname) || ipRegex.test(hostname);
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

/**
 * Tests SMTP connection with detailed error reporting
 * @param config - SMTP configuration to test
 * @returns Promise<ConnectionTestResult> - Connection test result
 */
export async function testSMTPConnection(config?: SMTPConfig): Promise<ConnectionTestResult> {
  const startTime = Date.now();
  
  // Use provided config or validate from environment
  let smtpConfig = config;
  if (!smtpConfig) {
    const validation = validateSMTPConfigDetailed();
    if (!validation.isValid) {
      return {
        success: false,
        error: `Configuration validation failed: ${validation.errors.join(', ')}`,
      };
    }
    smtpConfig = validation.config!;
  }

  try {
    // Create transporter for testing
    const transporter = nodemailer.createTransporter({
      host: smtpConfig.host,
      port: smtpConfig.port,
      secure: smtpConfig.port === 465,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
      // Set shorter timeout for testing
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
    });

    // Test the connection
    await transporter.verify();
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: true,
      details: {
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.port === 465,
        responseTime,
      },
    };
  } catch (error: any) {
    const responseTime = Date.now() - startTime;
    
    // Parse common SMTP errors for better user feedback
    let errorMessage = error.message || 'Unknown connection error';
    
    if (error.code === 'ECONNREFUSED') {
      errorMessage = `Connection refused to ${smtpConfig.host}:${smtpConfig.port}. Check host and port settings.`;
    } else if (error.code === 'ENOTFOUND') {
      errorMessage = `Host not found: ${smtpConfig.host}. Check hostname spelling.`;
    } else if (error.code === 'ETIMEDOUT') {
      errorMessage = `Connection timeout to ${smtpConfig.host}:${smtpConfig.port}. Check network connectivity.`;
    } else if (error.responseCode === 535) {
      errorMessage = 'Authentication failed. Check username and password.';
    } else if (error.r