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
  });
});