import { generateBaseTemplate } from '@/lib/email/templates/base';
import { EMAIL_CONFIG } from '@/lib/config/email';

describe('Base Template Email Configuration', () => {
  it('should use centralized EMAIL_CONFIG for contact email', () => {
    const template = generateBaseTemplate('<p>Test content</p>');
    
    // Check that the HTML contains the centralized email
    expect(template.html).toContain(EMAIL_CONFIG.CONTACT_EMAIL);
    expect(template.html).toContain('vantageverticalltd@gmail.com');
    
    // Check that the text version also contains the centralized email
    expect(template.text).toContain(EMAIL_CONFIG.CONTACT_EMAIL);
    expect(template.text).toContain('vantageverticalltd@gmail.com');
  });

  it('should not contain hardcoded incorrect email addresses', () => {
    const template = generateBaseTemplate('<p>Test content</p>');
    
    // Ensure no typos are present
    expect(template.html).not.toContain('vantagevarticalltd@gmail.com');
    expect(template.text).not.toContain('vantagevarticalltd@gmail.com');
  });

  it('should allow overriding contact email through template data', () => {
    const customEmail = 'custom@example.com';
    const template = generateBaseTemplate('<p>Test content</p>', {
      contactEmail: customEmail
    });
    
    expect(template.html).toContain(customEmail);
    expect(template.text).toContain(customEmail);
  });

  it('should use EMAIL_CONFIG values as defaults', () => {
    // Test that EMAIL_CONFIG is properly imported and used
    expect(EMAIL_CONFIG.CONTACT_EMAIL).toBe('vantageverticalltd@gmail.com');
    expect(EMAIL_CONFIG.SMTP_FROM).toBe('vantageverticalltd@gmail.com');
    expect(EMAIL_CONFIG.COMPANY_EMAIL).toBe('vantageverticalltd@gmail.com');
  });
});