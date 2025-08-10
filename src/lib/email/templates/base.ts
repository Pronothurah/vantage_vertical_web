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
 * Generates the HTML version of the email template optimized for email clients
 * @param content - Main content HTML
 * @param data - Template data
 * @param options - Template options
 * @returns Complete HTML email optimized for various email clients
 */
function generateHTMLTemplate(
  content: string,
  data: BaseTemplateData,
  options: Required<TemplateOptions>
): string {
  const header = options.includeHeader ? generateHeader(data, options) : '';
  const footer = options.includeFooter ? generateFooter(data, options) : '';

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="email=no" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${data.companyName}</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        ${generateCSS(options)}
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${options.backgroundColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;">
    <!--[if mso | IE]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td>
    <![endif]-->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 0; padding: 0; background-color: ${options.backgroundColor};">
        <tr>
            <td align="center" style="padding: 0;">
                <table class="email-container" role="presentation" cellpadding="0" cellspacing="0" border="0" style="
                    max-width: 600px;
                    width: 100%;
                    margin: 0 auto;
                    background-color: #ffffff;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                ">
                    ${header}
                    <tr>
                        <td class="content" style="padding: 30px;">
                            ${content}
                        </td>
                    </tr>
                    ${footer}
                </table>
            </td>
        </tr>
    </table>
    <!--[if mso | IE]>
            </td>
        </tr>
    </table>
    <![endif]-->
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
 * Generates optimized logo HTML for email clients
 * @param data - Template data
 * @param options - Logo display options
 * @returns Optimized logo HTML
 */
function generateOptimizedLogo(data: BaseTemplateData, options: { 
  width?: number; 
  height?: number; 
  alignment?: 'left' | 'center' | 'right';
  includeTextFallback?: boolean;
} = {}): string {
  const {
    width = 200,
    height = 60,
    alignment = 'center',
    includeTextFallback = true
  } = options;

  const alignmentStyle = alignment === 'center' ? 'margin: 0 auto; display: block;' :
                        alignment === 'right' ? 'margin-left: auto; display: block;' :
                        'margin-right: auto; display: block;';

  // Email-optimized logo HTML with proper attributes and fallbacks
  const logoHtml = `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
      <tr>
        <td align="${alignment}" style="padding: 0;">
          <!--[if mso]>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
          <![endif]-->
          <img 
            src="${data.logoUrl}" 
            alt="${data.companyName} - Professional Drone Services" 
            title="${data.companyName}"
            width="${width}" 
            height="${height}"
            style="
              ${alignmentStyle}
              max-width: ${width}px;
              height: ${height}px;
              width: auto;
              border: 0;
              outline: none;
              text-decoration: none;
              -ms-interpolation-mode: bicubic;
              vertical-align: middle;
            "
            border="0"
          />
          <!--[if mso]>
              </td>
            </tr>
          </table>
          <![endif]-->
          ${includeTextFallback ? `
          <!--[if !mso]><!-->
          <div style="
            display: none; 
            font-size: 0; 
            line-height: 0; 
            max-height: 0; 
            overflow: hidden;
            mso-hide: all;
          ">
            ${data.companyName}
          </div>
          <!--<![endif]-->
          ` : ''}
        </td>
      </tr>
    </table>
  `;

  return logoHtml;
}

/**
 * Generates the email header with logo and branding optimized for email clients
 * @param data - Template data
 * @param options - Template options
 * @returns HTML header with optimized logo
 */
function generateHeader(data: BaseTemplateData, options: Required<TemplateOptions>): string {
  const optimizedLogo = generateOptimizedLogo(data, {
    width: 200,
    height: 60,
    alignment: 'center',
    includeTextFallback: true
  });

  return `
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
      <tr>
        <td class="header" style="
          background-color: ${options.primaryColor};
          color: white;
          padding: 20px;
          text-align: center;
        ">
          <div class="header-content" style="
            display: block;
            text-align: center;
          ">
            ${optimizedLogo}
            <h1 class="company-name" style="
              font-size: 24px;
              font-weight: bold;
              margin: 15px 0 0 0;
              padding: 0;
              color: white;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              line-height: 1.2;
            ">${data.companyName}</h1>
          </div>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Generates the email footer with contact information optimized for email clients
 * @param data - Template data
 * @param options - Template options
 * @returns HTML footer with table-based layout
 */
function generateFooter(data: BaseTemplateData, options: Required<TemplateOptions>): string {
  const unsubscribeRow = data.unsubscribeUrl 
    ? `
    <tr>
      <td align="center" style="padding: 15px 20px 0 20px;">
        <p style="
          font-size: 12px;
          color: #6c757d;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        ">
          <a href="${data.unsubscribeUrl}" style="color: #6c757d; text-decoration: underline;">Unsubscribe</a>
        </p>
      </td>
    </tr>
    ` : '';

  return `
    <tr>
      <td class="footer" style="
        background-color: #f8f9fa;
        padding: 0;
        border-top: 1px solid #e9ecef;
      ">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="width: 100%;">
          <tr>
            <td align="center" style="padding: 20px;">
              <div class="contact-info" style="text-align: center;">
                <p style="
                  margin: 0 0 5px 0;
                  font-size: 14px;
                  color: #374151;
                  font-weight: bold;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                ">${data.companyName}</p>
                <p style="
                  margin: 0 0 5px 0;
                  font-size: 14px;
                  color: #6c757d;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                ">Email: <a href="mailto:${data.contactEmail}" style="color: ${options.linkColor}; text-decoration: none;">${data.contactEmail}</a></p>
                <p style="
                  margin: 0 0 5px 0;
                  font-size: 14px;
                  color: #6c757d;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                ">Phone: <a href="tel:${data.contactPhone}" style="color: #6c757d; text-decoration: none;">${data.contactPhone}</a></p>
                <p style="
                  margin: 0;
                  font-size: 14px;
                  color: #6c757d;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                ">Website: <a href="${data.websiteUrl}" style="color: ${options.linkColor}; text-decoration: none;">${data.websiteUrl}</a></p>
              </div>
            </td>
          </tr>
          ${unsubscribeRow}
        </table>
      </td>
    </tr>
  `;
}

/**
 * Generates CSS styles optimized for email clients
 * @param options - Template options
 * @returns CSS string optimized for various email clients
 */
function generateCSS(options: Required<TemplateOptions>): string {
  return `
    /* Email client reset and base styles */
    body, table, td, p, a, li, blockquote {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
    }

    table, td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
    }

    img {
        -ms-interpolation-mode: bicubic;
        border: 0;
        outline: none;
        text-decoration: none;
    }

    /* Reset styles for email clients */
    body {
        margin: 0 !important;
        padding: 0 !important;
        background-color: ${options.backgroundColor} !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
        font-size: 16px;
        line-height: 1.6;
        color: ${options.textColor};
        width: 100% !important;
        min-width: 100% !important;
    }

    /* Prevent Outlook from adding extra spacing */
    table {
        border-collapse: collapse !important;
        border-spacing: 0 !important;
    }

    /* Force Outlook to provide a "view in browser" menu link */
    #outlook a {
        padding: 0;
    }

    /* Force Hotmail to display emails at full width */
    .ReadMsgBody {
        width: 100%;
    }

    .ExternalClass {
        width: 100%;
    }

    /* Force Hotmail to display normal line spacing */
    .ExternalClass,
    .ExternalClass p,
    .ExternalClass span,
    .ExternalClass font,
    .ExternalClass td,
    .ExternalClass div {
        line-height: 100%;
    }

    /* Prevent WebKit and Windows mobile changing default text sizes */
    body, table, td, p, a, li, blockquote {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
    }

    /* Remove spacing between tables in Outlook 2007 and up */
    table, td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
    }

    /* Allow smoother rendering of resized image in Internet Explorer */
    img {
        -ms-interpolation-mode: bicubic;
    }

    /* Email container styles */
    .email-container {
        max-width: 600px !important;
        width: 100% !important;
        margin: 0 auto !important;
        background-color: #ffffff !important;
    }

    /* Content styles with email client compatibility */
    .content {
        padding: 30px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
    }

    .content h1 {
        color: ${options.primaryColor} !important;
        font-size: 28px !important;
        margin: 0 0 20px 0 !important;
        padding: 0 !important;
        font-weight: 600 !important;
        line-height: 1.2 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
    }

    .content h2 {
        color: ${options.primaryColor} !important;
        font-size: 22px !important;
        margin: 25px 0 15px 0 !important;
        padding: 0 !important;
        font-weight: 600 !important;
        line-height: 1.2 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
    }

    .content h3 {
        color: ${options.textColor} !important;
        font-size: 18px !important;
        margin: 20px 0 10px 0 !important;
        padding: 0 !important;
        font-weight: 600 !important;
        line-height: 1.2 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
    }

    .content p {
        margin: 0 0 15px 0 !important;
        padding: 0 !important;
        font-size: 16px !important;
        line-height: 1.6 !important;
        color: ${options.textColor} !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
    }

    .content ul, .content ol {
        margin: 0 0 15px 0 !important;
        padding: 0 0 0 20px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
    }

    .content li {
        margin: 0 0 5px 0 !important;
        padding: 0 !important;
        font-size: 16px !important;
        line-height: 1.6 !important;
        color: ${options.textColor} !important;
    }

    /* Link styles with email client compatibility */
    a {
        color: ${options.linkColor} !important;
        text-decoration: underline !important;
        font-weight: normal !important;
    }

    a:hover {
        text-decoration: underline !important;
    }

    /* Button styles optimized for email clients */
    .btn {
        display: inline-block !important;
        padding: 12px 24px !important;
        margin: 10px 0 !important;
        background-color: ${options.primaryColor} !important;
        color: #ffffff !important;
        text-decoration: none !important;
        font-weight: 600 !important;
        text-align: center !important;
        border-radius: 6px !important;
        border: 2px solid ${options.primaryColor} !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
        font-size: 16px !important;
        line-height: 1.2 !important;
        mso-padding-alt: 0;
        mso-text-raise: 0;
    }

    .btn-primary {
        background-color: ${options.primaryColor} !important;
        color: #ffffff !important;
        border: 2px solid ${options.primaryColor} !important;
    }

    .btn-secondary {
        background-color: transparent !important;
        color: ${options.primaryColor} !important;
        border: 2px solid ${options.primaryColor} !important;
    }

    .btn-outline {
        background-color: transparent !important;
        color: ${options.textColor} !important;
        border: 2px solid ${options.textColor} !important;
    }

    /* Utility classes */
    .text-center {
        text-align: center !important;
    }

    .text-left {
        text-align: left !important;
    }

    .text-right {
        text-align: right !important;
    }

    /* Spacing utilities */
    .mb-0 { margin-bottom: 0 !important; }
    .mb-1 { margin-bottom: 10px !important; }
    .mb-2 { margin-bottom: 20px !important; }
    .mb-3 { margin-bottom: 30px !important; }

    .mt-0 { margin-top: 0 !important; }
    .mt-1 { margin-top: 10px !important; }
    .mt-2 { margin-top: 20px !important; }
    .mt-3 { margin-top: 30px !important; }

    /* Alert and highlight styles */
    .highlight {
        background-color: #fff3cd !important;
        padding: 15px !important;
        border-left: 4px solid #ffc107 !important;
        margin: 15px 0 !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
    }

    .alert {
        padding: 15px !important;
        margin: 15px 0 !important;
        border-radius: 4px !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif !important;
    }

    .alert-info {
        background-color: #d1ecf1 !important;
        border: 1px solid #bee5eb !important;
        color: #0c5460 !important;
    }

    .alert-success {
        background-color: #d4edda !important;
        border: 1px solid #c3e6cb !important;
        color: #155724 !important;
    }

    .alert-warning {
        background-color: #fff3cd !important;
        border: 1px solid #ffeaa7 !important;
        color: #856404 !important;
    }

    .alert-danger {
        background-color: #f8d7da !important;
        border: 1px solid #f5c6cb !important;
        color: #721c24 !important;
    }

    /* Mobile responsive styles */
    @media only screen and (max-width: 600px) {
        .email-container {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
        }

        .content {
            padding: 20px !important;
        }

        .content h1 {
            font-size: 24px !important;
            line-height: 1.2 !important;
        }

        .content h2 {
            font-size: 20px !important;
            line-height: 1.2 !important;
        }

        .content h3 {
            font-size: 18px !important;
            line-height: 1.2 !important;
        }

        .content p, .content li {
            font-size: 16px !important;
            line-height: 1.6 !important;
        }

        .btn {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 10px 0 !important;
            padding: 15px 20px !important;
            font-size: 16px !important;
            text-align: center !important;
        }

        /* Mobile-specific table adjustments */
        table[class="email-container"] {
            width: 100% !important;
            max-width: 100% !important;
        }

        td[class="content"] {
            padding: 20px !important;
        }

        td[class="header"] {
            padding: 15px !important;
        }

        td[class="footer"] {
            padding: 15px !important;
        }

        /* Mobile logo adjustments */
        img[class="logo"] {
            max-width: 180px !important;
            height: auto !important;
        }
    }

    /* Dark mode support for email clients that support it */
    @media (prefers-color-scheme: dark) {
        .content {
            background-color: #ffffff !important;
        }
        
        .content p, .content h1, .content h2, .content h3, .content li {
            color: ${options.textColor} !important;
        }
    }

    /* High contrast mode support */
    @media (prefers-contrast: high) {
        .btn {
            border-width: 3px !important;
        }
        
        a {
            text-decoration: underline !important;
        }
    }

    /* Outlook-specific styles */
    <!--[if mso]>
    <style type="text/css">
        .email-container {
            width: 600px !important;
        }
        
        .content {
            padding: 30px !important;
        }
        
        .btn {
            mso-style-priority: 100 !important;
            mso-padding-alt: 12px 24px !important;
        }
        
        .content p, .content h1, .content h2, .content h3 {
            mso-line-height-rule: exactly !important;
        }
    </style>
    <![endif]-->
  `;
}

/**
 * Export the optimized logo function for use in other templates
 */
export { generateOptimizedLogo };

/**
 * Template utility functions for common email elements
 */
export const TemplateUtils = {
  /**
   * Creates a call-to-action button optimized for email clients
   * @param text - Button text
   * @param url - Button URL
   * @param style - Button style
   * @returns HTML button element optimized for email clients
   */
  createButton(text: string, url: string, style: 'primary' | 'secondary' | 'outline' = 'primary'): string {
    const buttonStyles = {
      primary: 'background-color: #dc2626; color: #ffffff; border: 2px solid #dc2626;',
      secondary: 'background-color: transparent; color: #dc2626; border: 2px solid #dc2626;',
      outline: 'background-color: transparent; color: #374151; border: 2px solid #374151;'
    };

    return `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="border-radius: 6px; ${buttonStyles[style]}">
            <a href="${url}" 
               style="
                 display: inline-block;
                 padding: 12px 24px;
                 font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif;
                 font-size: 16px;
                 font-weight: 600;
                 text-decoration: none;
                 border-radius: 6px;
                 ${buttonStyles[style]}
               "
               class="btn btn-${style}">${text}</a>
          </td>
        </tr>
      </table>
    `;
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