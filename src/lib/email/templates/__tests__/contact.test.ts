import { generateContactEmails } from '../contact';
import { ContactFormData } from '@/types/forms';

// Mock the data imports
jest.mock('@/data', () => ({
  serviceOptions: [
    { value: 'aerial-mapping', label: 'Aerial Mapping' },
    { value: 'surveillance', label: 'Surveillance' },
    { value: 'agritech', label: 'Agritech Solutions' },
  ],
  urgencyLevels: [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' },
  ],
}));

describe('Contact Email Templates', () => {
  const mockContactFormData: ContactFormData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254700000000',
    service: 'aerial-mapping',
    message: 'I need aerial mapping services for my farm.',
    urgency: 'medium'
  };

  describe('generateContactEmails', () => {
    it('should generate both admin notification and customer confirmation emails', () => {
      const result = generateContactEmails(mockContactFormData);

      expect(result).toHaveProperty('adminNotification');
      expect(result).toHaveProperty('customerConfirmation');
      
      // Check admin notification
      expect(result.adminNotification.subject).toContain('Medium Priority');
      expect(result.adminNotification.subject).toContain('Aerial Mapping');
      expect(result.adminNotification.html).toContain('John Doe');
      expect(result.adminNotification.html).toContain('john@example.com');
      expect(result.adminNotification.html).toContain('aerial mapping services');
      expect(result.adminNotification.text).toContain('John Doe');
      
      // Check customer confirmation
      expect(result.customerConfirmation.subject).toContain('Thank you');
      expect(result.customerConfirmation.html).toContain('Dear John Doe');
      expect(result.customerConfirmation.html).toContain('3-5 days'); // Medium urgency response time
      expect(result.customerConfirmation.text).toContain('John Doe');
    });

    it('should handle different urgency levels correctly', () => {
      const highUrgencyData = { ...mockContactFormData, urgency: 'high' as const };
      const result = generateContactEmails(highUrgencyData);

      expect(result.adminNotification.subject).toContain('High Priority');
      expect(result.customerConfirmation.html).toContain('24-48 hours');
    });

    it('should handle different service types correctly', () => {
      const surveillanceData = { ...mockContactFormData, service: 'surveillance' };
      const result = generateContactEmails(surveillanceData);

      expect(result.adminNotification.subject).toContain('Surveillance');
      expect(result.customerConfirmation.html).toContain('surveillance');
    });

    it('should escape HTML content properly', () => {
      const dataWithHtml = {
        ...mockContactFormData,
        name: 'John <script>alert("xss")</script> Doe',
        message: 'Test message with <b>HTML</b> content'
      };
      
      const result = generateContactEmails(dataWithHtml);
      
      // Should escape HTML in the content
      expect(result.adminNotification.html).not.toContain('<script>');
      expect(result.adminNotification.html).not.toContain('<b>HTML</b>');
      expect(result.customerConfirmation.html).not.toContain('<script>');
    });

    it('should include all required contact information', () => {
      const result = generateContactEmails(mockContactFormData);

      // Admin notification should include all form data
      expect(result.adminNotification.html).toContain(mockContactFormData.name);
      expect(result.adminNotification.html).toContain(mockContactFormData.email);
      expect(result.adminNotification.html).toContain(mockContactFormData.phone);
      expect(result.adminNotification.html).toContain(mockContactFormData.message);

      // Customer confirmation should be personalized
      expect(result.customerConfirmation.html).toContain(`Dear ${mockContactFormData.name}`);
      expect(result.customerConfirmation.html).toContain('Aerial Mapping');
    });

    it('should use correct logo URL from base configuration', () => {
      const result = generateContactEmails(mockContactFormData);

      // Both emails should use the correct domain for logo
      expect(result.adminNotification.html).toContain('vantagevertical.co.ke/vantage-logo.png');
      expect(result.customerConfirmation.html).toContain('vantagevertical.co.ke/vantage-logo.png');
      
      // Should not contain the incorrect domain
      expect(result.adminNotification.html).not.toContain('vantagevartical.com');
      expect(result.customerConfirmation.html).not.toContain('vantagevartical.com');
    });

    it('should use correct contact information from base configuration', () => {
      const result = generateContactEmails(mockContactFormData);

      // Both emails should use the correct phone number
      expect(result.adminNotification.html).toContain('+254704277687');
      expect(result.customerConfirmation.html).toContain('+254704277687');
      
      // Both emails should use the correct email address
      expect(result.adminNotification.html).toContain('vantageverticalltd@gmail.com');
      expect(result.customerConfirmation.html).toContain('vantageverticalltd@gmail.com');
      
      // Both emails should use the correct website URL
      expect(result.adminNotification.html).toContain('vantagevertical.co.ke');
      expect(result.customerConfirmation.html).toContain('vantagevertical.co.ke');
    });

    it('should use correct website URLs in customer confirmation links', () => {
      const result = generateContactEmails(mockContactFormData);

      // Customer confirmation should use correct domain in all links
      expect(result.customerConfirmation.html).toContain('https://vantagevertical.co.ke/portfolio');
      expect(result.customerConfirmation.html).toContain('https://vantagevertical.co.ke/technology');
      expect(result.customerConfirmation.html).toContain('https://vantagevertical.co.ke/training');
      
      // Should not contain the incorrect domain in any links
      expect(result.customerConfirmation.html).not.toContain('vantagevartical.com');
    });

    it('should generate valid HTML and text versions', () => {
      const result = generateContactEmails(mockContactFormData);

      // Both emails should have HTML and text versions
      expect(result.adminNotification.html).toBeTruthy();
      expect(result.adminNotification.text).toBeTruthy();
      expect(result.customerConfirmation.html).toBeTruthy();
      expect(result.customerConfirmation.text).toBeTruthy();

      // HTML should contain proper structure
      expect(result.adminNotification.html).toContain('<!DOCTYPE html PUBLIC');
      expect(result.adminNotification.html).toContain('<html');
      expect(result.adminNotification.html).toContain('</html>');
      
      expect(result.customerConfirmation.html).toContain('<!DOCTYPE html PUBLIC');
      expect(result.customerConfirmation.html).toContain('<html');
      expect(result.customerConfirmation.html).toContain('</html>');

      // Text versions should contain key information without HTML tags
      expect(result.adminNotification.text).toContain('Vantage Vertical');
      expect(result.adminNotification.text).toContain(mockContactFormData.name);
      expect(result.adminNotification.text).not.toContain('<html>');
      
      expect(result.customerConfirmation.text).toContain('Vantage Vertical');
      expect(result.customerConfirmation.text).toContain(mockContactFormData.name);
      expect(result.customerConfirmation.text).not.toContain('<html>');
    });
  });
});