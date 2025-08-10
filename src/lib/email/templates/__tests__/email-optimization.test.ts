import { 
  generateBaseTemplate, 
  generateOptimizedLogo,
  BaseTemplateData,
  TemplateOptions 
} from '../base';

describe('Email Template Optimization', () => {
  const mockTemplateData: BaseTemplateData = {
    companyName: 'Vantage Vertical',
    logoUrl: 'https://vantagevertical.co.ke/vantage-logo.png',
    websiteUrl: 'https://vantagevertical.co.ke',
    contactEmail: 'vantageverticalltd@gmail.com',
    contactPhone: '+254704277687',
  };

  describe('Optimized Logo Generation', () => {
    test('should generate email-optimized logo HTML with proper attributes', () => {
      const logoHtml = generateOptimizedLogo(mockTemplateData, {
        width: 200,
        height: 60,
        alignment: 'center',
        includeTextFallback: true
      });

      // Check for email-optimized attributes
      expect(logoHtml).toContain('role="presentation"');
      expect(logoHtml).toContain('cellpadding="0"');
      expect(logoHtml).toContain('cellspacing="0"');
      expect(logoHtml).toContain('border="0"');
      
      // Check for proper width/height attributes
      expect(logoHtml).toContain('width="200"');
      expect(logoHtml).toContain('height="60"');
      
      // Check for proper alt text
      expect(logoHtml).toContain('alt="Vantage Vertical - Professional Drone Services"');
      
      // Check for email client compatibility styles
      expect(logoHtml).toContain('-ms-interpolation-mode: bicubic');
      expect(logoHtml).toContain('vertical-align: middle');
      expect(logoHtml).toContain('text-decoration: none');
      
      // Check for Outlook conditional comments
      expect(logoHtml).toContain('<!--[if mso]>');
      expect(logoHtml).toContain('<![endif]-->');
      
      // Check for text fallback
      expect(logoHtml).toContain('display: none');
      expect(logoHtml).toContain('mso-hide: all');
      expect(logoHtml).toContain(mockTemplateData.companyName);
    });

    test('should handle different alignment options', () => {
      const leftAligned = generateOptimizedLogo(mockTemplateData, { alignment: 'left' });
      const centerAligned = generateOptimizedLogo(mockTemplateData, { alignment: 'center' });
      const rightAligned = generateOptimizedLogo(mockTemplateData, { alignment: 'right' });

      expect(leftAligned).toContain('align="left"');
      expect(centerAligned).toContain('align="center"');
      expect(rightAligned).toContain('align="right"');
    });

    test('should allow disabling text fallback', () => {
      const logoWithoutFallback = generateOptimizedLogo(mockTemplateData, {
        includeTextFallback: false
      });

      expect(logoWithoutFallback).not.toContain('display: none');
      expect(logoWithoutFallback).not.toContain('mso-hide: all');
    });

    test('should use custom dimensions', () => {
      const customLogo = generateOptimizedLogo(mockTemplateData, {
        width: 300,
        height: 80
      });

      expect(customLogo).toContain('width="300"');
      expect(customLogo).toContain('height="80"');
      expect(customLogo).toContain('max-width: 300px');
      expect(customLogo).toContain('height: 80px');
    });
  });

  describe('Email Template HTML Structure', () => {
    test('should generate XHTML-compliant email template', () => {
      const template = generateBaseTemplate('<p>Test content</p>', mockTemplateData);

      // Check for XHTML DOCTYPE
      expect(template.html).toContain('<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"');
      expect(template.html).toContain('xmlns="http://www.w3.org/1999/xhtml"');
      
      // Check for proper meta tags
      expect(template.html).toContain('http-equiv="Content-Type"');
      expect(template.html).toContain('charset=UTF-8');
      expect(template.html).toContain('name="viewport"');
      expect(template.html).toContain('name="format-detection"');
      expect(template.html).toContain('name="x-apple-disable-message-reformatting"');
    });

    test('should include Outlook-specific conditional comments', () => {
      const template = generateBaseTemplate('<p>Test content</p>', mockTemplateData);

      // Check for MSO conditional comments
      expect(template.html).toContain('<!--[if mso]>');
      expect(template.html).toContain('<!--[if mso | IE]>');
      expect(template.html).toContain('<![endif]-->');
      
      // Check for Office document settings
      expect(template.html).toContain('<o:OfficeDocumentSettings>');
      expect(template.html).toContain('<o:AllowPNG/>');
      expect(template.html).toContain('<o:PixelsPerInch>96</o:PixelsPerInch>');
    });

    test('should use table-based layout for email client compatibility', () => {
      const template = generateBaseTemplate('<p>Test content</p>', mockTemplateData);

      // Check for table-based structure
      expect(template.html).toContain('role="presentation"');
      expect(template.html).toContain('cellpadding="0"');
      expect(template.html).toContain('cellspacing="0"');
      expect(template.html).toContain('border="0"');
      
      // Check for proper table nesting
      const tableMatches = template.html.match(/<table/g);
      expect(tableMatches).toBeTruthy();
      expect(tableMatches!.length).toBeGreaterThan(3); // Multiple nested tables
    });

    test('should include proper email client reset styles', () => {
      const template = generateBaseTemplate('<p>Test content</p>', mockTemplateData);

      // Check for email client reset CSS
      expect(template.html).toContain('-webkit-text-size-adjust: 100%');
      expect(template.html).toContain('-ms-text-size-adjust: 100%');
      expect(template.html).toContain('mso-table-lspace: 0pt');
      expect(template.html).toContain('mso-table-rspace: 0pt');
      expect(template.html).toContain('-ms-interpolation-mode: bicubic');
      
      // Check for Outlook-specific resets
      expect(template.html).toContain('#outlook a');
      expect(template.html).toContain('.ReadMsgBody');
      expect(template.html).toContain('.ExternalClass');
    });
  });

  describe('Responsive Design', () => {
    test('should include mobile-responsive CSS', () => {
      const template = generateBaseTemplate('<p>Test content</p>', mockTemplateData);

      // Check for mobile media queries
      expect(template.html).toContain('@media only screen and (max-width: 600px)');
      
      // Check for mobile-specific styles
      expect(template.html).toContain('width: 100% !important');
      expect(template.html).toContain('max-width: 100% !important');
      expect(template.html).toContain('padding: 20px !important');
      
      // Check for mobile button styles
      expect(template.html).toContain('display: block !important');
    });

    test('should include accessibility features', () => {
      const template = generateBaseTemplate('<p>Test content</p>', mockTemplateData);

      // Check for high contrast support
      expect(template.html).toContain('@media (prefers-contrast: high)');
      
      // Check for proper ARIA attributes
      expect(template.html).toContain('role="presentation"');
      
      // Check for proper alt text in logo
      expect(template.html).toContain('alt="Vantage Vertical - Professional Drone Services"');
    });
  });

  describe('Contact Information Optimization', () => {
    test('should include clickable phone and email links', () => {
      const template = generateBaseTemplate('<p>Test content</p>', mockTemplateData);

      // Check for mailto links
      expect(template.html).toContain(`href="mailto:${mockTemplateData.contactEmail}"`);
      
      // Check for tel links
      expect(template.html).toContain(`href="tel:${mockTemplateData.contactPhone}"`);
      
      // Check for website links
      expect(template.html).toContain(`href="${mockTemplateData.websiteUrl}"`);
    });

    test('should use proper inline styles for footer elements', () => {
      const template = generateBaseTemplate('<p>Test content</p>', mockTemplateData);

      // Check for inline styles in footer
      expect(template.html).toContain('font-family: -apple-system');
      expect(template.html).toContain('font-size: 14px');
      expect(template.html).toContain('color: #6c757d');
      expect(template.html).toContain('text-decoration: none');
    });
  });

  describe('Email Client Compatibility', () => {
    test('should include format detection meta tags', () => {
      const template = generateBaseTemplate('<p>Test content</p>', mockTemplateData);

      // Check for format detection prevention
      expect(template.html).toContain('content="telephone=no"');
      expect(template.html).toContain('content="date=no"');
      expect(template.html).toContain('content="address=no"');
      expect(template.html).toContain('content="email=no"');
    });

    test('should use important declarations for critical styles', () => {
      const template = generateBaseTemplate('<p>Test content</p>', mockTemplateData);

      // Check for !important declarations
      expect(template.html).toContain('margin: 0 !important');
      expect(template.html).toContain('padding: 0 !important');
      expect(template.html).toContain('width: 100% !important');
      expect(template.html).toContain('background-color: #ffffff !important');
    });

    test('should include proper font stack for cross-platform compatibility', () => {
      const template = generateBaseTemplate('<p>Test content</p>', mockTemplateData);

      // Check for comprehensive font stack
      expect(template.html).toContain('-apple-system, BlinkMacSystemFont');
      expect(template.html).toContain("'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell");
      expect(template.html).toContain("'Helvetica Neue', Arial, sans-serif");
    });
  });

  describe('Fallback Support', () => {
    test('should include text version with proper formatting', () => {
      const template = generateBaseTemplate('<h1>Test Title</h1><p>Test content with <strong>bold</strong> text.</p>', mockTemplateData);

      // Check text version exists and is properly formatted
      expect(template.text).toContain('Vantage Vertical');
      expect(template.text).toContain('Test Title');
      expect(template.text).toContain('Test content with bold text.');
      expect(template.text).toContain(`Email: ${mockTemplateData.contactEmail}`);
      expect(template.text).toContain(`Phone: ${mockTemplateData.contactPhone}`);
      expect(template.text).toContain(`Website: ${mockTemplateData.websiteUrl}`);
      
      // Check that HTML tags are stripped
      expect(template.text).not.toContain('<h1>');
      expect(template.text).not.toContain('<strong>');
    });

    test('should handle unsubscribe URL in text version', () => {
      const dataWithUnsubscribe = {
        ...mockTemplateData,
        unsubscribeUrl: 'https://vantagevertical.co.ke/unsubscribe'
      };
      
      const template = generateBaseTemplate('<p>Test content</p>', dataWithUnsubscribe);

      expect(template.text).toContain('To unsubscribe, visit: https://vantagevertical.co.ke/unsubscribe');
    });
  });

  describe('Custom Template Options', () => {
    test('should apply custom colors and styling options', () => {
      const customOptions: Partial<TemplateOptions> = {
        primaryColor: '#0066cc',
        backgroundColor: '#f0f0f0',
        textColor: '#333333',
        linkColor: '#0066cc'
      };

      const template = generateBaseTemplate('<p>Test content</p>', mockTemplateData, customOptions);

      expect(template.html).toContain('background-color: #f0f0f0');
      expect(template.html).toContain('color: #0066cc !important');
      expect(template.html).toContain('color: #333333 !important');
    });

    test('should allow disabling header and footer', () => {
      const noHeaderFooter: Partial<TemplateOptions> = {
        includeHeader: false,
        includeFooter: false
      };

      const template = generateBaseTemplate('<p>Test content</p>', mockTemplateData, noHeaderFooter);

      // Check that header and footer table rows are not present in the HTML structure
      expect(template.html).not.toContain('<td class="header"');
      expect(template.html).not.toContain('<td class="footer"');
      
      // Check that the company name is not in the body content (it might still be in title/CSS)
      const bodyContent = template.html.split('<body')[1]?.split('</body>')[0] || '';
      expect(bodyContent).not.toContain(mockTemplateData.companyName);
      
      // Check that logo image is not present
      expect(template.html).not.toContain(`src="${mockTemplateData.logoUrl}"`);
      
      // Check that contact information is not in the body
      expect(bodyContent).not.toContain(mockTemplateData.contactEmail);
      expect(bodyContent).not.toContain(mockTemplateData.contactPhone);
    });
  });

  describe('Error Handling and Validation', () => {
    test('should validate template data before generation', () => {
      const invalidData = {
        ...mockTemplateData,
        contactEmail: 'invalid-email'
      };

      expect(() => {
        generateBaseTemplate('<p>Test content</p>', invalidData);
      }).toThrow('Invalid contact email format');
    });

    test('should validate logo URL domain', () => {
      const invalidLogoData = {
        ...mockTemplateData,
        logoUrl: 'https://wrong-domain.com/logo.png'
      };

      expect(() => {
        generateBaseTemplate('<p>Test content</p>', invalidLogoData);
      }).toThrow('Logo URL must use the correct domain');
    });
  });
});