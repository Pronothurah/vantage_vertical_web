/**
 * Centralized email configuration for the application
 * Provides standardized email addresses with environment variable fallbacks
 */

export const EMAIL_CONFIG = {
  /**
   * Contact email address used for receiving inquiries and contact form submissions
   */
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || 'vantageverticalltd@gmail.com',
  
  /**
   * SMTP sender email address used for outgoing emails
   */
  SMTP_FROM: process.env.SMTP_FROM || 'vantageverticalltd@gmail.com',
  
  /**
   * Company email address - the standardized company email
   */
  COMPANY_EMAIL: 'vantageverticalltd@gmail.com'
} as const;

/**
 * Type definition for email configuration
 */
export type EmailConfigType = typeof EMAIL_CONFIG;