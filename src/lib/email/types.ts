export enum EmailErrorType {
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  SMTP_CONNECTION_ERROR = 'SMTP_CONNECTION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  TEMPLATE_ERROR = 'TEMPLATE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface EmailError extends Error {
  type: EmailErrorType;
  retryable: boolean;
  originalError?: Error;
  context?: Record<string, any>;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: EmailError;
  retryCount: number;
  timestamp: Date;
  recipient: string;
  subject: string;
}

export interface EmailServiceConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
  retryAttempts: number;
  retryDelay: number;
}

export interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  contactEmail: string;
}

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

// Template-related interfaces
export interface BaseTemplateData {
  recipientName?: string;
  companyName: string;
  logoUrl: string;
  websiteUrl: string;
  contactEmail: string;
  contactPhone: string;
  unsubscribeUrl?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface TemplateOptions {
  includeHeader?: boolean;
  includeFooter?: boolean;
  backgroundColor?: string;
  primaryColor?: string;
  textColor?: string;
  linkColor?: string;
  buttonStyle?: 'primary' | 'secondary' | 'outline';
}