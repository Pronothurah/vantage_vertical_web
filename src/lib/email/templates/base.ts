import { EmailError, EmailErrorType } from '../types';
import { EMAIL_CONFIG } from '../../config/email';

/**
 * Base template data interface for consistent company branding
 */
export interface BaseTemplateData {
  recipientName?: string;
  companyName: string;
  logoUrl: string;
  websiteUrl: string;
  contactEmail: string;
  contactPhone: string;
  unsubscribeUrl?: string;
}

/**
 * Email template interface with HTML and text versions
 */
export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Template options for customization
 */
export interface TemplateOptions {
  includeHeader?: boolean;
  includeFooter?: boolean;
  backgroundColor?: string;
  primaryColor?: string;
  textColor?: string;
  linkColor?: string;
  buttonStyle?: 'primary' | 'secondary' | 'outline';
}

/**
 * Default template options
 */
const DEFAULT_TEMPLATE_OPTIONS: Required<TemplateOptions> = {
  includeHeader: true,
  includeFooter: true,
  backgroundColor: '#f8f9fa',
  primaryColor: '#dc2626', // Red color matching Vantage Vertical branding
  textColor: '#374151',
  linkColor: '#dc2626',
  buttonStyle: 'primary',
};

/**
 * Logo configuration for different background contexts
 */
export interface LogoConfig {
  default: string;
  white: string;
  dark: string;
}

/**
 * Logo configuration with correct domain and paths
 */
const LOGO_CONFIG: LogoConfig = {
  default: 'https://vantagevertical.co.ke/vantage-logo.png',
  white: 'https://vantagevertical.co.ke/vantage-logo-white.jpg',
  dark: 'https://vantagevertical.co.ke/vantage-logo.png'
};

/**
 * Logo selection options
 */
export interface LogoOptions {
  background?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
  alignment?: 'left' | 'center' | 'right';
}

/**
 * Gets the appropriate logo URL based on background context
 * @param background - Background type ('light' or 'dark')
 * @returns Logo URL for the specified background
 */
export function getLogoUrl(background: 'light' | 'dark' = 'light'): string {
  return background === 'dark' ? LOGO_CONFIG.white : LOGO_CONFIG.default;
}

/**
 * Validates that a logo URL uses the correct domain
 * @param logoUrl - Logo URL to validate
 * @returns True if the URL uses the correct domain
 */
export function validateLogoUrl(logoUrl: string): boolean {
  try {
    const url = new URL(logoUrl);
    return url.hostname === 'vantagevertical.co.ke';
  } catch {
    return false;
  }
}

/**
 * Template validation result interface
 */
export interface TemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  logoAccessible: boolean;
  contactInfoValid: boolean;
}

/**
 * Checks logo URL accessibility for testing purposes
 * @param logoUrl - Logo URL to check
 * @returns Promise that resolves to true if logo is accessible
 */
export async function checkLogoAccessibility(logoUrl: string): Promise<boolean> {
  try {
    // First validate the URL format and domain
    if (!validateLogoUrl(logoUrl)) {
      return false;
    }

    // In a browser environment, we can't make arbitrary HTTP requests due to CORS
    // This function is primarily for testing environments
    if (typeof window !== 'undefined') {
      // Browser environment - return true if URL is valid (actual accessibility check would need server-side proxy)
      return true;
    }

    // Node.js environment - can make actual HTTP request
    if (typeof fetch !== 'undefined') {
      const response = await fetch(logoUrl, { method: 'HEAD' });
      return response.ok;
    }

    // Fallback - assume accessible if URL is valid
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Default company data for Vantage Vertical
 */
const DEFAULT_COMPANY_DATA: Partial<BaseTemplateData> = {
  companyName: 'Vantage Vertical',
  logoUrl: getLogoUrl('light'),
  websiteUrl: 'https://vantagevertical.co.ke',
  contactEmail: EMAIL_CONFIG.CONTACT_EMAIL,
  contactPhone: '+254704277687',
};

/**
 * Creates an email error with proper typing
 */
function createEmailError(error: Error, type: EmailErrorType, context?: Record<string, any>): EmailError {
  const emailError = error as EmailError;
  emailError.type = type;
  emailError.retryable = false;
  emailError.context = context;
  return emailError;
}

/**
 * Validates contact information format
 * @param data - Template data to validate
 * @returns Array of validation errors
 */
export function validateContactInfo(data: BaseTemplateData): string[] {
  const errors: string[] = [];
  
  // Validate phone number format (should be +254 followed by 9 digits)
  if (data.contactPhone && !data.contactPhone.match(/^\+254\d{9}$/)) {
    errors.push('Invalid phone number format - should be +254 followed by 9 digits');
  }
  
  // Validate website URL (should use correct domain)
  if (data.websiteUrl && !data.websiteUrl.includes('vantagevertical.co.ke')) {
    errors.push('Website URL should use the correct domain (vantagevertical.co.ke)');
  }
  
  return errors;
}

/**
 * Validates contact information format with strict company standards
 * @param data - Template data to validate
 * @returns Array of validation warnings for non-standard values
 */
export function validateCompanyStandards(data: BaseTemplateData): string[] {
  const warnings: string[] = [];
  
  // Warn if not using the standardized company email
  if (data.contactEmail && !data.contactEmail.includes('vantageverticalltd@gmail.com')) {
    warnings.push('Contact email should use the standardized company email address for consistency');
  }
  
  return warnings;
}

/**
 * Comprehensive template validation that returns detailed results
 * @param data - Template data to validate
 * @returns Detailed validation result with errors, warnings, and accessibility status
 */
export async function validateTemplateDataComprehensive(data: BaseTemplateData): Promise<TemplateValidationResult> {
  const result: TemplateValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    logoAccessible: false,
    contactInfoValid: true
  };

  // Check required fields
  const requiredFields: (keyof BaseTemplateData)[] = [
    'companyName',
    'logoUrl',
    'websiteUrl',
    'contactEmail',
    'contactPhone'
  ];

  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    result.errors.push(`Missing required template data: ${missingFields.join(', ')}`);
    result.isValid = false;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (data.contactEmail && !emailRegex.test(data.contactEmail)) {
    result.errors.push('Invalid contact email format in template data');
    result.isValid = false;
    result.contactInfoValid = false;
  }

  // Validate URLs
  try {
    if (data.logoUrl) new URL(data.logoUrl);
    if (data.websiteUrl) new URL(data.websiteUrl);
    if (data.unsubscribeUrl) new URL(data.unsubscribeUrl);
  } catch (error) {
    result.errors.push('Invalid URL format in template data');
    result.isValid = false;
  }

  // Validate logo URL uses correct domain
  if (data.logoUrl && !validateLogoUrl(data.logoUrl)) {
    result.errors.push('Logo URL must use the correct domain (vantagevertical.co.ke)');
    result.isValid = false;
  }

  // Check logo accessibility
  if (data.logoUrl) {
    try {
      result.logoAccessible = await checkLogoAccessibility(data.logoUrl);
      if (!result.logoAccessible) {
        result.warnings.push('Logo URL may not be accessible - please verify the image loads correctly');
      }
    } catch (error) {
      result.warnings.push('Could not verify logo accessibility');
    }
  }

  // Validate contact information format
  const contactErrors = validateContactInfo(data);
  if (contactErrors.length > 0) {
    result.errors.push(...contactErrors);
    result.isValid = false;
    result.contactInfoValid = false;
  }

  // Check company standards (warnings only)
  const companyWarnings = validateCompanyStandards(data);
  if (companyWarnings.length > 0) {
    result.warnings.push(...companyWarnings);
  }

  // Additional domain validation warnings
  if (data.websiteUrl && data.websiteUrl.includes('vantagevartical.com')) {
    result.warnings.push('Website URL contains typo in domain - should be "vantagevertical.co.ke"');
  }

  if (data.logoUrl && data.logoUrl.includes('vantagevartical.com')) {
    result.errors.push('Logo URL contains typo in domain - should be "vantagevertical.co.ke"');
    result.isValid = false;
  }

  return result;
}

/**
 * Validates that required template data is present
 * @param data - Template data to validate
 * @throws EmailError if validation fails
 */
export function validateTemplateData(data: BaseTemplateData): void {
  const requiredFields: (keyof BaseTemplateData)[] = [
    'companyName',
    'logoUrl',
    'websiteUrl',
    'contactEmail',
    'contactPhone'
  ];

  const missingFields = requiredFields.filter(field => !data[field]);
  
  if (missingFields.length > 0) {
    throw createEmailError(
      new Error(`Missing required template data: ${missingFields.join(', ')}`),
      EmailErrorType.TEMPLATE_ERROR,
      { missingFields, providedData: Object.keys(data) }
    );
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.contactEmail)) {
    throw createEmailError(
      new Error('Invalid contact email format in template data'),
      EmailErrorType.TEMPLATE_ERROR,
      { contactEmail: data.contactEmail }
    );
  }

  // Validate URLs
  try {
    new URL(data.logoUrl);
    new URL(data.websiteUrl);
    if (data.unsubscribeUrl) {
      new URL(data.unsubscribeUrl);
    }
  } catch (error) {
    throw createEmailError(
      new Error('Invalid URL format in template data'),
      EmailErrorType.TEMPLATE_ERROR,
      { error: (error as Error).message }
    );
  }

  // Validate logo URL uses correct domain
  if (!validateLogoUrl(data.logoUrl)) {
    throw createEmailError(
      new Error('Logo URL must use the correct domain (vantagevertical.co.ke)'),
      EmailErrorType.TEMPLATE_ERROR,
      { logoUrl: data.logoUrl }
    );
  }

  // Validate contact information (only for critical errors, not company standards)
  const contactErrors = validateContactInfo(data);
  if (contactErrors.length > 0) {
    throw createEmailError(
      new Error(`Contact information validation failed: ${contactErrors.join(', ')}`),
      EmailErrorType.TEMPLATE_ERROR,
      { contactErrors, contactData: { 
        contactEmail: data.contactEmail, 
        contactPhone: data.contactPhone, 
        websiteUrl: data.websiteUrl 
      }}
    );
  }

  // Log warnings for company standards (but don't throw errors)
  const companyWarnings = validateCompanyStandards(data);
  if (companyWarnings.length > 0 && process.env.NODE_ENV !== 'test') {
    console.warn('Email template company standards warnings:', companyWarnings);
  }
}

/**
 * Generates the base email template with consistent branding
 * @param content - Main email content (HTML)
 * @param data - Template data for branding
 * @param options - Template customization options
 * @returns Complete email template with HTML and text versions
 */
export function generateBaseTemplate(
  content: string,
  data: Partial<BaseTemplateData> = {},
  options: Partial<TemplateOptions> = {}
): EmailTemplate {
  // Merge with defaults
  const templateData: BaseTemplateData = { ...DEFAULT_COMPANY_DATA, ...data } as BaseTemplateData;
  const templateOptions: Required<TemplateOptions> = { ...DEFAULT_TEMPLATE_OPTIONS, ...options };

  // Validate template data
  validateTemplateData(templateData);

  // Generate HTML version
  const html = generateHTMLTemplate(content, templateData, templateOptions);
  
  // Generate text version
  const text = generateTextTemplate(content, templateData);

  return {
    subject: '', // Subject should be set by specific template implementations
    html,
    text,
  };
}

/**
 * Generates the HTML version of the email template
 * @param content - Main content HTML
 * @param data - Template data
 * @param options - Template options
 * @returns Complete HTML email
 */
function generateHTMLTemplate(
  content: string,
  data: BaseTemplateData,
  options: Required<TemplateOptions>
): string {
  const header = options.includeHeader ? generateHeader(data, options) : '';
  const footer = options.includeFooter ? generateFooter(data, options) : '';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>${data.companyName}</title>
    <style>
        ${generateCSS(options)}
    </style>
</head>
<body>
    <div class="email-container">
        ${header}
        <div class="content">
            ${content}
        </div>
        ${footer}
    </div>
</body>
</html>`.trim();
}

/**
 * Generates the text version of the email template
 * @param content - Main content (will be stripped of HTML)
 * @param data - Template data
 * @returns Plain text email
 */
function generateTextTemplate(content: string, data: BaseTemplateData): string {
  // Strip HTML tags and convert to plain text
  const plainContent = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
    .replace(/&amp;/g, '&') // Replace HTML entities
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  return `
${data.companyName}
${'-'.repeat(data.companyName.length)}

${plainContent}

---
${data.companyName}
Email: ${data.contactEmail}
Phone: ${data.contactPhone}
Website: ${data.websiteUrl}

${data.unsubscribeUrl ? `To unsubscribe, visit: ${data.unsubscribeUrl}` : ''}
`.trim();
}

/**
 * Generates the email header with logo and branding
 * @param data - Template data
 * @param options - Template options
 * @returns HTML header
 */
function generateHeader(data: BaseTemplateData, options: Required<TemplateOptions>): string {
  return `
    <div class="header">
        <div class="header-content">
            <img src="${data.logoUrl}" alt="${data.companyName}" class="logo" />
            <h1 class="company-name">${data.companyName}</h1>
        </div>
    </div>
  `;
}

/**
 * Generates the email footer with contact information
 * @param data - Template data
 * @param options - Template options
 * @returns HTML footer
 */
function generateFooter(data: BaseTemplateData, options: Required<TemplateOptions>): string {
  const unsubscribeLink = data.unsubscribeUrl 
    ? `<p class="unsubscribe"><a href="${data.unsubscribeUrl}">Unsubscribe</a></p>`
    : '';

  return `
    <div class="footer">
        <div class="footer-content">
            <div class="contact-info">
                <p><strong>${data.companyName}</strong></p>
                <p>Email: <a href="mailto:${data.contactEmail}">${data.contactEmail}</a></p>
                <p>Phone: ${data.contactPhone}</p>
                <p>Website: <a href="${data.websiteUrl}">${data.websiteUrl}</a></p>
            </div>
            ${unsubscribeLink}
        </div>
    </div>
  `;
}

/**
 * Generates CSS styles for the email template
 * @param options - Template options
 * @returns CSS string
 */
function generateCSS(options: Required<TemplateOptions>): string {
  return `
    /* Reset and base styles */
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        line-height: 1.6;
        color: ${options.textColor};
        background-color: ${options.backgroundColor};
        margin: 0;
        padding: 0;
    }

    .email-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    /* Header styles */
    .header {
        background-color: ${options.primaryColor};
        color: white;
        padding: 20px;
        text-align: center;
    }

    .header-content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .logo {
        max-height: 60px;
        width: auto;
        margin-bottom: 10px;
    }

    .company-name {
        font-size: 24px;
        font-weight: bold;
        margin: 0;
    }

    /* Content styles */
    .content {
        padding: 30px;
    }

    .content h1 {
        color: ${options.primaryColor};
        font-size: 28px;
        margin-bottom: 20px;
        font-weight: 600;
    }

    .content h2 {
        color: ${options.primaryColor};
        font-size: 22px;
        margin-bottom: 15px;
        margin-top: 25px;
        font-weight: 600;
    }

    .content h3 {
        color: ${options.textColor};
        font-size: 18px;
        margin-bottom: 10px;
        margin-top: 20px;
        font-weight: 600;
    }

    .content p {
        margin-bottom: 15px;
        font-size: 16px;
        line-height: 1.6;
    }

    .content ul, .content ol {
        margin-bottom: 15px;
        padding-left: 20px;
    }

    .content li {
        margin-bottom: 5px;
    }

    /* Link styles */
    a {
        color: ${options.linkColor};
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    /* Button styles */
    .btn {
        display: inline-block;
        padding: 12px 24px;
        margin: 10px 0;
        border-radius: 6px;
        text-decoration: none;
        font-weight: 600;
        text-align: center;
        transition: all 0.3s ease;
    }

    .btn-primary {
        background-color: ${options.primaryColor};
        color: white;
        border: 2px solid ${options.primaryColor};
    }

    .btn-primary:hover {
        background-color: transparent;
        color: ${options.primaryColor};
        text-decoration: none;
    }

    .btn-secondary {
        background-color: transparent;
        color: ${options.primaryColor};
        border: 2px solid ${options.primaryColor};
    }

    .btn-secondary:hover {
        background-color: ${options.primaryColor};
        color: white;
        text-decoration: none;
    }

    .btn-outline {
        background-color: transparent;
        color: ${options.textColor};
        border: 2px solid ${options.textColor};
    }

    .btn-outline:hover {
        background-color: ${options.textColor};
        color: white;
        text-decoration: none;
    }

    /* Footer styles */
    .footer {
        background-color: #f8f9fa;
        padding: 20px;
        border-top: 1px solid #e9ecef;
    }

    .footer-content {
        text-align: center;
    }

    .contact-info {
        margin-bottom: 15px;
    }

    .contact-info p {
        margin-bottom: 5px;
        font-size: 14px;
        color: #6c757d;
    }

    .contact-info a {
        color: ${options.linkColor};
    }

    .unsubscribe {
        font-size: 12px;
        color: #6c757d;
        margin-top: 15px;
    }

    .unsubscribe a {
        color: #6c757d;
    }

    /* Responsive styles */
    @media only screen and (max-width: 600px) {
        .email-container {
            width: 100% !important;
            margin: 0 !important;
        }

        .content {
            padding: 20px !important;
        }

        .header {
            padding: 15px !important;
        }

        .footer {
            padding: 15px !important;
        }

        .company-name {
            font-size: 20px !important;
        }

        .content h1 {
            font-size: 24px !important;
        }

        .content h2 {
            font-size: 20px !important;
        }

        .btn {
            display: block !important;
            width: 100% !important;
            margin: 10px 0 !important;
        }
    }

    /* Utility classes */
    .text-center {
        text-align: center;
    }

    .text-left {
        text-align: left;
    }

    .text-right {
        text-align: right;
    }

    .mb-0 { margin-bottom: 0 !important; }
    .mb-1 { margin-bottom: 10px !important; }
    .mb-2 { margin-bottom: 20px !important; }
    .mb-3 { margin-bottom: 30px !important; }

    .mt-0 { margin-top: 0 !important; }
    .mt-1 { margin-top: 10px !important; }
    .mt-2 { margin-top: 20px !important; }
    .mt-3 { margin-top: 30px !important; }

    .highlight {
        background-color: #fff3cd;
        padding: 15px;
        border-left: 4px solid #ffc107;
        margin: 15px 0;
    }

    .alert {
        padding: 15px;
        margin: 15px 0;
        border-radius: 4px;
    }

    .alert-info {
        background-color: #d1ecf1;
        border: 1px solid #bee5eb;
        color: #0c5460;
    }

    .alert-success {
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        color: #155724;
    }

    .alert-warning {
        background-color: #fff3cd;
        border: 1px solid #ffeaa7;
        color: #856404;
    }

    .alert-danger {
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        color: #721c24;
    }
  `;
}

/**
 * Template utility functions for common email elements
 */
export const TemplateUtils = {
  /**
   * Creates a call-to-action button
   * @param text - Button text
   * @param url - Button URL
   * @param style - Button style
   * @returns HTML button element
   */
  createButton(text: string, url: string, style: 'primary' | 'secondary' | 'outline' = 'primary'): string {
    return `<a href="${url}" class="btn btn-${style}">${text}</a>`;
  },

  /**
   * Creates a highlighted information box
   * @param content - Box content
   * @param type - Box type
   * @returns HTML alert box
   */
  createAlert(content: string, type: 'info' | 'success' | 'warning' | 'danger' = 'info'): string {
    return `<div class="alert alert-${type}">${content}</div>`;
  },

  /**
   * Creates a highlight box for important information
   * @param content - Content to highlight
   * @returns HTML highlight box
   */
  createHighlight(content: string): string {
    return `<div class="highlight">${content}</div>`;
  },

  /**
   * Creates a formatted list of key-value pairs
   * @param items - Object with key-value pairs
   * @returns HTML formatted list
   */
  createInfoList(items: Record<string, string>): string {
    const listItems = Object.entries(items)
      .map(([key, value]) => `<li><strong>${key}:</strong> ${value}</li>`)
      .join('');
    
    return `<ul>${listItems}</ul>`;
  },

  /**
   * Creates a divider line
   * @param margin - Margin around divider
   * @returns HTML divider
   */
  createDivider(margin: 'small' | 'medium' | 'large' = 'medium'): string {
    const marginClass = margin === 'small' ? 'mt-1 mb-1' : 
                       margin === 'large' ? 'mt-3 mb-3' : 'mt-2 mb-2';
    
    return `<hr class="${marginClass}" style="border: none; border-top: 1px solid #e9ecef;" />`;
  },

  /**
   * Escapes HTML content to prevent injection
   * @param content - Content to escape
   * @returns Escaped HTML content
   */
  escapeHtml(content: string): string {
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  },

  /**
   * Formats a date for email display
   * @param date - Date to format
   * @param options - Formatting options
   * @returns Formatted date string
   */
  formatDate(date: Date, options: Intl.DateTimeFormatOptions = {}): string {
    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options
    };
    
    return date.toLocaleDateString('en-US', defaultOptions);
  },

  /**
   * Creates a responsive table
   * @param headers - Table headers
   * @param rows - Table rows data
   * @returns HTML table
   */
  createTable(headers: string[], rows: string[][]): string {
    const headerRow = headers.map(header => `<th style="padding: 10px; border-bottom: 2px solid #dee2e6; text-align: left;">${header}</th>`).join('');
    const bodyRows = rows.map(row => 
      `<tr>${row.map(cell => `<td style="padding: 10px; border-bottom: 1px solid #dee2e6;">${cell}</td>`).join('')}</tr>`
    ).join('');

    return `
      <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
        <thead>
          <tr>${headerRow}</tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
    `;
  }
};