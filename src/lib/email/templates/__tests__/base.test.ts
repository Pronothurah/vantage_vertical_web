import { 
  generateBaseTemplate, 
  validateTemplateData, 
  TemplateUtils,
  BaseTemplateData,
  TemplateOptions 
} from '../base';
import { EmailErrorType } from '../../types';

describe('Base Email Template System', () => {
  const validTemplateData: BaseTemplateData = {
    companyName: 'Test Company',
    logoUrl: 'https://example.com/logo.png',
    websiteUrl: 'https://example.com',
    contactEmail: 'test@example.com',
    contactPhone: '+1234567890',
    recipientName: 'John Doe',
  };

  describe('validateTemplateData', () => {
    it('should pass validation with valid data', () => {
      expect(() => validateTemplateData(validTemplateData)).not.toThrow();
    });

    it('should throw error for missing required fields', () => {
      const invalidData = { ...validTemplateData };
      delete (invalidData as any).companyName;

      expect(() => validateTemplateData(invalidData)).toThrow();
    });

    it('should throw error for invalid email format', () => {
      const invalidData = { ...validTemplateData, contactEmail: 'invalid-email' };

      expect(() => validateTemplateData(invalidData)).toThrow();
    });

    it('should throw error for invalid URL format', () => {
      const invalidData = { ...validTemplateData, websiteUrl: 'not-a-url' };

      expect(() => validateTemplateData(invalidData)).toThrow();
    });
  });

  describe('generateBaseTemplate', () => {
    it('should generate template with HTML and text versions', () => {
      const content = '<h1>Test Content</h1><p>This is a test email.</p>';
      const template = generateBaseTemplate(content, validTemplateData);

      expect(template).toHaveProperty('html');
      expect(template).toHaveProperty('text');
      expect(template).toHaveProperty('subject');
      expect(template.html).toContain(content);
      expect(template.html).toContain(validTemplateData.companyName);
      expect(template.text).toContain('Test Content');
      expect(template.text).toContain('This is a test email.');
    });

    it('should use default company data when not provided', () => {
      const content = '<p>Test content</p>';
      const template = generateBaseTemplate(content);

      expect(template.html).toContain('Vantage Vertical');
      expect(template.text).toContain('Vantage Vertical');
    });

    it('should apply custom template options', () => {
      const content = '<p>Test content</p>';
      const options: TemplateOptions = {
        primaryColor: '#ff0000',
        backgroundColor: '#000000',
        includeHeader: false,
      };
      
      const template = generateBaseTemplate(content, validTemplateData, options);

      expect(template.html).toContain('#ff0000');
      expect(template.html).toContain('#000000');
      expect(template.html).not.toContain('class="header"');
    });

    it('should handle unsubscribe URL when provided', () => {
      const dataWithUnsubscribe = {
        ...validTemplateData,
        unsubscribeUrl: 'https://example.com/unsubscribe',
      };
      
      const template = generateBaseTemplate('<p>Test</p>', dataWithUnsubscribe);

      expect(template.html).toContain('unsubscribe');
      expect(template.text).toContain('unsubscribe');
    });
  });

  describe('TemplateUtils', () => {
    describe('createButton', () => {
      it('should create a primary button by default', () => {
        const button = TemplateUtils.createButton('Click Me', 'https://example.com');
        
        expect(button).toContain('btn btn-primary');
        expect(button).toContain('Click Me');
        expect(button).toContain('https://example.com');
      });

      it('should create buttons with different styles', () => {
        const secondaryButton = TemplateUtils.createButton('Click Me', 'https://example.com', 'secondary');
        const outlineButton = TemplateUtils.createButton('Click Me', 'https://example.com', 'outline');
        
        expect(secondaryButton).toContain('btn-secondary');
        expect(outlineButton).toContain('btn-outline');
      });
    });

    describe('createAlert', () => {
      it('should create an info alert by default', () => {
        const alert = TemplateUtils.createAlert('Test message');
        
        expect(alert).toContain('alert alert-info');
        expect(alert).toContain('Test message');
      });

      it('should create alerts with different types', () => {
        const successAlert = TemplateUtils.createAlert('Success!', 'success');
        const warningAlert = TemplateUtils.createAlert('Warning!', 'warning');
        const dangerAlert = TemplateUtils.createAlert('Error!', 'danger');
        
        expect(successAlert).toContain('alert-success');
        expect(warningAlert).toContain('alert-warning');
        expect(dangerAlert).toContain('alert-danger');
      });
    });

    describe('createHighlight', () => {
      it('should create a highlight box', () => {
        const highlight = TemplateUtils.createHighlight('Important info');
        
        expect(highlight).toContain('class="highlight"');
        expect(highlight).toContain('Important info');
      });
    });

    describe('createInfoList', () => {
      it('should create a formatted list from object', () => {
        const items = {
          'Name': 'John Doe',
          'Email': 'john@example.com',
          'Phone': '+1234567890',
        };
        
        const list = TemplateUtils.createInfoList(items);
        
        expect(list).toContain('<ul>');
        expect(list).toContain('<strong>Name:</strong> John Doe');
        expect(list).toContain('<strong>Email:</strong> john@example.com');
        expect(list).toContain('<strong>Phone:</strong> +1234567890');
      });
    });

    describe('createDivider', () => {
      it('should create a divider with medium margin by default', () => {
        const divider = TemplateUtils.createDivider();
        
        expect(divider).toContain('mt-2 mb-2');
        expect(divider).toContain('<hr');
      });

      it('should create dividers with different margins', () => {
        const smallDivider = TemplateUtils.createDivider('small');
        const largeDivider = TemplateUtils.createDivider('large');
        
        expect(smallDivider).toContain('mt-1 mb-1');
        expect(largeDivider).toContain('mt-3 mb-3');
      });
    });

    describe('escapeHtml', () => {
      it('should escape HTML special characters', () => {
        const input = '<script>alert("xss")</script> & "quotes" & \'apostrophes\'';
        const escaped = TemplateUtils.escapeHtml(input);
        
        expect(escaped).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &quot;quotes&quot; &amp; &#39;apostrophes&#39;');
      });
    });

    describe('formatDate', () => {
      it('should format date with default options', () => {
        const date = new Date('2024-01-15');
        const formatted = TemplateUtils.formatDate(date);
        
        expect(formatted).toContain('January');
        expect(formatted).toContain('15');
        expect(formatted).toContain('2024');
      });

      it('should format date with custom options', () => {
        const date = new Date('2024-01-15');
        const formatted = TemplateUtils.formatDate(date, { 
          month: 'short', 
          day: 'numeric' 
        });
        
        expect(formatted).toContain('Jan');
        expect(formatted).toContain('15');
      });
    });

    describe('createTable', () => {
      it('should create a responsive table', () => {
        const headers = ['Name', 'Email', 'Phone'];
        const rows = [
          ['John Doe', 'john@example.com', '+1234567890'],
          ['Jane Smith', 'jane@example.com', '+0987654321'],
        ];
        
        const table = TemplateUtils.createTable(headers, rows);
        
        expect(table).toContain('<table');
        expect(table).toContain('<thead>');
        expect(table).toContain('<tbody>');
        expect(table).toContain('Name');
        expect(table).toContain('John Doe');
        expect(table).toContain('jane@example.com');
      });
    });
  });
});