import { 
  generateDroneInquiryAdminEmail,
  generateDroneInquiryCustomerEmail
} from '../droneInquiry';
import { DroneInquiryData } from '../../../../types/forms';

describe('Drone Inquiry Email Templates', () => {
  const mockDroneInquiryData: DroneInquiryData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+254712345678',
    company: 'Test Agriculture Ltd',
    droneId: 'DJI-Mavic-3-Enterprise',
    quantity: 2,
    inquiryType: 'quote',
    budget: '500k-1m',
    timeline: 'medium',
    experience: 'intermediate',
    intendedUse: 'Agricultural monitoring and crop analysis',
    message: 'We need drones for precision agriculture on our 500-acre farm',
    trainingNeeded: true,
    financingInterest: true
  };

  describe('generateDroneInquiryAdminEmail', () => {
    it('should generate admin notification with correct branding and contact info', () => {
      const template = generateDroneInquiryAdminEmail(mockDroneInquiryData);

      // Check that template is generated
      expect(template).toHaveProperty('html');
      expect(template).toHaveProperty('text');
      expect(template).toHaveProperty('subject');

      // Check subject line
      expect(template.subject).toContain('New Drone Inquiry');
      expect(template.subject).toContain('Price Quote Request');
      expect(template.subject).toContain('DJI-Mavic-3-Enterprise');

      // Check HTML content contains inquiry information
      expect(template.html).toContain('John Doe');
      expect(template.html).toContain('john.doe@example.com');
      expect(template.html).toContain('+254712345678');
      expect(template.html).toContain('Test Agriculture Ltd');
      expect(template.html).toContain('DJI-Mavic-3-Enterprise');
      expect(template.html).toContain('Agricultural monitoring');

      // Check that it uses base template (should contain company branding)
      expect(template.html).toContain('Vantage Vertical');
      expect(template.html).toContain('vantagevertical.co.ke');
      expect(template.html).toContain('+254704277687'); // Correct phone number from base config
      expect(template.html).toContain('vantageverticalltd@gmail.com'); // Correct email from base config

      // Check text version
      expect(template.text).toContain('John Doe');
      expect(template.text).toContain('Vantage Vertical');
      expect(template.text).toContain('+254704277687');
      expect(template.text).toContain('vantageverticalltd@gmail.com');
    });

    it('should handle different inquiry types correctly', () => {
      const purchaseData = { ...mockDroneInquiryData, inquiryType: 'purchase' as const };
      const consultationData = { ...mockDroneInquiryData, inquiryType: 'consultation' as const };
      const bulkData = { ...mockDroneInquiryData, inquiryType: 'bulk' as const };

      const purchaseTemplate = generateDroneInquiryAdminEmail(purchaseData);
      const consultationTemplate = generateDroneInquiryAdminEmail(consultationData);
      const bulkTemplate = generateDroneInquiryAdminEmail(bulkData);

      expect(purchaseTemplate.subject).toContain('Ready to Purchase');
      expect(consultationTemplate.subject).toContain('Free Consultation Request');
      expect(bulkTemplate.subject).toContain('Bulk Order Inquiry');
    });

    it('should display budget and timeline information', () => {
      const template = generateDroneInquiryAdminEmail(mockDroneInquiryData);

      expect(template.html).toContain('KES 500,000 - 1,000,000');
      expect(template.html).toContain('Medium term (2-3 months)');
    });

    it('should handle additional services information', () => {
      const template = generateDroneInquiryAdminEmail(mockDroneInquiryData);

      expect(template.html).toContain('Training Needed');
      expect(template.html).toContain('Financing Interest');
      expect(template.html).toContain('Yes'); // Both training and financing are true
    });

    it('should handle missing optional fields gracefully', () => {
      const minimalData = {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+254723456789',
        droneId: 'DJI-Mini-3',
        quantity: 1,
        inquiryType: 'quote' as const,
        experience: 'beginner' as const,
        intendedUse: 'Photography',
        trainingNeeded: false,
        financingInterest: false
      };

      const template = generateDroneInquiryAdminEmail(minimalData);

      expect(template.html).toContain('Jane Smith');
      expect(template.html).toContain('DJI-Mini-3');
      expect(template.html).toContain('Not specified'); // For missing budget/timeline
    });
  });

  describe('generateDroneInquiryCustomerEmail', () => {
    it('should generate customer acknowledgment with correct branding and contact info', () => {
      const template = generateDroneInquiryCustomerEmail(mockDroneInquiryData);

      // Check that template is generated
      expect(template).toHaveProperty('html');
      expect(template).toHaveProperty('text');
      expect(template).toHaveProperty('subject');

      // Check subject line
      expect(template.subject).toContain('Thank you for your drone inquiry');
      expect(template.subject).toContain('Vantage Vertical');

      // Check HTML content contains customer name and inquiry info
      expect(template.html).toContain('Dear John Doe');
      expect(template.html).toContain('DJI-Mavic-3-Enterprise');
      expect(template.html).toContain('Price Quote Request');

      // Check that it uses base template (should contain company branding)
      expect(template.html).toContain('Vantage Vertical');
      expect(template.html).toContain('vantagevertical.co.ke');
      expect(template.html).toContain('+254704277687'); // Correct phone number from base config
      expect(template.html).toContain('vantageverticalltd@gmail.com'); // Correct email from base config

      // Check text version
      expect(template.text).toContain('John Doe');
      expect(template.text).toContain('Vantage Vertical');
      expect(template.text).toContain('+254704277687');
      expect(template.text).toContain('vantageverticalltd@gmail.com');
    });

    it('should include inquiry summary information', () => {
      const template = generateDroneInquiryCustomerEmail(mockDroneInquiryData);

      expect(template.html).toContain('Your Inquiry Summary');
      expect(template.html).toContain('Price Quote Request');
      expect(template.html).toContain('DJI-Mavic-3-Enterprise');
      expect(template.html).toContain('2'); // Quantity
      expect(template.html).toContain('KES 500,000 - 1,000,000'); // Budget
      expect(template.html).toContain('Medium term (2-3 months)'); // Timeline
    });

    it('should include what happens next information', () => {
      const template = generateDroneInquiryCustomerEmail(mockDroneInquiryData);

      expect(template.html).toContain('What Happens Next?');
      expect(template.html).toContain('sales expert will contact you within 24 hours');
      expect(template.html).toContain('Free consultation');
      expect(template.html).toContain('KCAA compliance assistance');
    });

    it('should include company value proposition', () => {
      const template = generateDroneInquiryCustomerEmail(mockDroneInquiryData);

      expect(template.html).toContain('Why Choose Vantage Vertical?');
      expect(template.html).toContain('KCAA certified');
      expect(template.html).toContain('Expert consultation');
      expect(template.html).toContain('Comprehensive training programs');
      expect(template.html).toContain('5+ years of industry experience');
    });

    it('should handle different inquiry types in customer email', () => {
      const consultationData = { ...mockDroneInquiryData, inquiryType: 'consultation' as const };
      const template = generateDroneInquiryCustomerEmail(consultationData);

      expect(template.html).toContain('Free Consultation Request');
    });
  });

  describe('Logo and Contact Information Consistency', () => {
    it('should use correct logo URL from base template', () => {
      const adminTemplate = generateDroneInquiryAdminEmail(mockDroneInquiryData);
      const customerTemplate = generateDroneInquiryCustomerEmail(mockDroneInquiryData);

      // Both templates should use the correct domain
      [adminTemplate, customerTemplate].forEach(template => {
        expect(template.html).toContain('vantagevertical.co.ke/vantage-logo.png');
        // Should NOT contain the incorrect domain
        expect(template.html).not.toContain('vantagevartical.com');
      });
    });

    it('should use standardized contact information', () => {
      const adminTemplate = generateDroneInquiryAdminEmail(mockDroneInquiryData);
      const customerTemplate = generateDroneInquiryCustomerEmail(mockDroneInquiryData);

      // Both templates should use the same standardized contact info
      [adminTemplate, customerTemplate].forEach(template => {
        expect(template.html).toContain('+254704277687');
        expect(template.html).toContain('vantageverticalltd@gmail.com');
        expect(template.html).toContain('vantagevertical.co.ke');
      });
    });

    it('should not contain any hardcoded incorrect contact information', () => {
      const adminTemplate = generateDroneInquiryAdminEmail(mockDroneInquiryData);
      const customerTemplate = generateDroneInquiryCustomerEmail(mockDroneInquiryData);

      // Should not contain placeholder phone number or wrong domain
      [adminTemplate, customerTemplate].forEach(template => {
        expect(template.html).not.toContain('+254 XXX XXX XXX');
        expect(template.html).not.toContain('vantagevartical.com'); // Wrong domain
      });
    });

    it('should generate valid HTML and text versions', () => {
      const adminTemplate = generateDroneInquiryAdminEmail(mockDroneInquiryData);
      const customerTemplate = generateDroneInquiryCustomerEmail(mockDroneInquiryData);

      // Both templates should have HTML and text versions
      [adminTemplate, customerTemplate].forEach(template => {
        expect(template.html).toBeTruthy();
        expect(template.text).toBeTruthy();

        // HTML should contain proper structure
        expect(template.html).toContain('<!DOCTYPE html>');
        expect(template.html).toContain('<html');
        expect(template.html).toContain('</html>');

        // Text versions should contain key information without HTML tags
        expect(template.text).toContain('Vantage Vertical');
        expect(template.text).not.toContain('<html>');
        expect(template.text).not.toContain('<div>');
      });
    });

    it('should escape HTML content properly', () => {
      const dataWithHtml = {
        ...mockDroneInquiryData,
        name: 'John <script>alert("xss")</script> Doe',
        message: 'Test message with <b>HTML</b> content',
        intendedUse: 'Agriculture <img src="x" onerror="alert(1)">'
      };
      
      const adminTemplate = generateDroneInquiryAdminEmail(dataWithHtml);
      const customerTemplate = generateDroneInquiryCustomerEmail(dataWithHtml);
      
      // Should escape HTML in the content
      [adminTemplate, customerTemplate].forEach(template => {
        expect(template.html).not.toContain('<script>');
        expect(template.html).not.toContain('<b>HTML</b>');
        expect(template.html).not.toContain('onerror="alert(1)"'); // Check for the actual dangerous attribute
        
        // Verify that HTML is properly escaped - check for the actual escaped content
        expect(template.html).toContain('&lt;script&gt;');
        expect(template.html).toContain('&quot;xss&quot;');
      });

      // Admin template should contain the intendedUse field with escaped content
      expect(adminTemplate.html).toContain('&quot;alert(1)&quot;');
      
      // Customer template should contain the message field with escaped content  
      expect(customerTemplate.html).not.toContain('<b>HTML</b>');
    });
  });
});