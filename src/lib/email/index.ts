// Main exports
export { EmailService, emailService } from './emailService';
export * from './types';
export * from './utils';

// Template system exports
export { 
  generateBaseTemplate, 
  validateTemplateData, 
  TemplateUtils 
} from './templates/base';

// Re-export commonly used utilities
export { 
  validateSMTPConfig, 
  getEmailConfig, 
  createEmailError, 
  isValidEmail,
  sanitizeEmailContent 
} from './utils';