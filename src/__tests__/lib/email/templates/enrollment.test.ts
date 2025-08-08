import { 
  generateEnrollmentAdminNotification, 
  generateEnrollmentStudentConfirmation,
  generateEnrollmentEmails,
  getProgramInfo
} from '@/lib/email/templates/enrollment';
import { EnrollmentData } from '@/types/forms';

describe('Enrollment Email Templates', () => {
  const mockEnrollmentData: EnrollmentData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254700123456',
    program: 'basic-pilot',
    session: '2024-02-15-2024-02-17',
    experience: 'complete-beginner',
    motivation: 'I want to learn drone operations for aerial photography and videography. This skill will help me expand my photography business and offer new services to my clients.',
    accommodation: false,
    terms: true,
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+254700123457',
      relationship: 'spouse'
    }
  };

  describe('generateEnrollmentAdminNotification', () => {
    it('should generate admin notification email with correct content', () => {
      const template = generateEnrollmentAdminNotification(mockEnrollmentData);

      expect(template.subject).toBe('New Training Enrollment: John Doe - Basic Drone Pilot Training');
      expect(template.html).toContain('John Doe');
      expect(template.html).toContain('john@example.com');
      expect(template.html).toContain('+254700123456');
      expect(template.html).toContain('Basic Drone Pilot Training');
      expect(template.html).toContain('complete-beginner');
      expect(template.html).toContain('aerial photography');
      expect(template.html).toContain('Jane Doe (spouse) - +254700123457');
      expect(template.text).toContain('John Doe');
      expect(template.text).toContain('New Training Enrollment');
    });

    it('should handle enrollment without emergency contact', () => {
      const dataWithoutEmergencyContact = {
        ...mockEnrollmentData,
        emergencyContact: undefined
      };

      const template = generateEnrollmentAdminNotification(dataWithoutEmergencyContact);

      expect(template.html).toContain('Not provided');
      expect(template.subject).toBe('New Training Enrollment: John Doe - Basic Drone Pilot Training');
    });

    it('should handle accommodation request', () => {
      const dataWithAccommodation = {
        ...mockEnrollmentData,
        accommodation: true
      };

      const template = generateEnrollmentAdminNotification(dataWithAccommodation);

      expect(template.html).toContain('Accommodation Needed');
      expect(template.html).toContain('Yes');
    });

    it('should handle unknown program gracefully', () => {
      const dataWithUnknownProgram = {
        ...mockEnrollmentData,
        program: 'unknown-program'
      };

      const template = generateEnrollmentAdminNotification(dataWithUnknownProgram);

      expect(template.subject).toContain('unknown-program');
      expect(template.html).toContain('unknown-program');
    });
  });

  describe('generateEnrollmentStudentConfirmation', () => {
    it('should generate student confirmation email with correct content', () => {
      const template = generateEnrollmentStudentConfirmation(mockEnrollmentData);

      expect(template.subject).toBe('Welcome to Vantage Vertical Training - Basic Drone Pilot Training Enrollment Confirmed');
      expect(template.html).toContain('Dear John Doe');
      expect(template.html).toContain('Basic Drone Pilot Training');
      expect(template.html).toContain('3 days');
      expect(template.html).toContain('KES 45,000');
      expect(template.html).toContain('KCAA Basic Drone Pilot Certificate');
      expect(template.html).toContain('2024-02-15-2024-02-17');
      expect(template.text).toContain('John Doe');
      expect(template.text).toContain('Training Enrollment Confirmation');
    });

    it('should show accommodation assistance message when requested', () => {
      const dataWithAccommodation = {
        ...mockEnrollmentData,
        accommodation: true
      };

      const template = generateEnrollmentStudentConfirmation(dataWithAccommodation);

      expect(template.html).toContain('You requested accommodation assistance');
      expect(template.html).toContain('local accommodation options');
    });

    it('should show no accommodation message when not requested', () => {
      const template = generateEnrollmentStudentConfirmation(mockEnrollmentData);

      expect(template.html).toContain('You indicated that you don\'t need accommodation assistance');
    });

    it('should include program requirements when available', () => {
      const template = generateEnrollmentStudentConfirmation(mockEnrollmentData);

      expect(template.html).toContain('What to Bring');
      expect(template.html).toContain('Valid ID or passport');
      expect(template.html).toContain('Basic English proficiency');
    });
  });

  describe('generateEnrollmentEmails', () => {
    it('should generate both admin and student emails', () => {
      const emails = generateEnrollmentEmails(mockEnrollmentData);

      expect(emails.adminNotification).toBeDefined();
      expect(emails.studentConfirmation).toBeDefined();
      expect(emails.adminNotification.subject).toContain('New Training Enrollment');
      expect(emails.studentConfirmation.subject).toContain('Welcome to Vantage Vertical Training');
    });
  });

  describe('getProgramInfo', () => {
    it('should return correct info for basic-pilot program', () => {
      const info = getProgramInfo('basic-pilot');

      expect(info.name).toBe('Basic Drone Pilot Training');
      expect(info.duration).toBe('3 days');
      expect(info.price).toBe('KES 45,000');
      expect(info.certification).toBe('KCAA Basic Drone Pilot Certificate');
      expect(info.requirements).toContain('Valid ID or passport');
    });

    it('should return correct info for commercial-pilot program', () => {
      const info = getProgramInfo('commercial-pilot');

      expect(info.name).toBe('Commercial Drone Pilot Training');
      expect(info.duration).toBe('5 days');
      expect(info.price).toBe('KES 85,000');
      expect(info.certification).toBe('KCAA Commercial Drone Pilot Certificate');
    });

    it('should return default info for unknown program', () => {
      const info = getProgramInfo('unknown-program');

      expect(info.name).toBe('unknown-program');
      expect(info.duration).toBe('TBD');
      expect(info.price).toBe('Contact for pricing');
      expect(info.certification).toBe('Certificate of completion');
      expect(info.requirements).toEqual([]);
    });
  });

  describe('Template Content Validation', () => {
    it('should escape HTML in user input', () => {
      const dataWithHtml = {
        ...mockEnrollmentData,
        name: 'John <script>alert("xss")</script> Doe',
        motivation: 'I want to learn <b>drone operations</b> for aerial photography.'
      };

      const adminTemplate = generateEnrollmentAdminNotification(dataWithHtml);
      const studentTemplate = generateEnrollmentStudentConfirmation(dataWithHtml);

      // HTML should be escaped in the templates
      // The motivation field should be escaped
      expect(adminTemplate.html).toContain('&lt;b&gt;drone operations&lt;/b&gt;');
      expect(adminTemplate.html).not.toContain('<b>drone operations</b>');
      
      // The student template should escape the name in the greeting
      expect(studentTemplate.html).toContain('John &lt;script&gt;');
      expect(studentTemplate.html).not.toContain('<script>');
    });

    it('should include all required template sections', () => {
      const adminTemplate = generateEnrollmentAdminNotification(mockEnrollmentData);
      const studentTemplate = generateEnrollmentStudentConfirmation(mockEnrollmentData);

      // Admin template sections
      expect(adminTemplate.html).toContain('New Training Enrollment');
      expect(adminTemplate.html).toContain('Student Information');
      expect(adminTemplate.html).toContain('Program Details');
      expect(adminTemplate.html).toContain('Next Steps');

      // Student template sections
      expect(studentTemplate.html).toContain('Training Enrollment Confirmation');
      expect(studentTemplate.html).toContain('Your Training Program');
      expect(studentTemplate.html).toContain('Program Details');
      expect(studentTemplate.html).toContain('What to Bring');
      expect(studentTemplate.html).toContain('Next Steps');
      expect(studentTemplate.html).toContain('Questions?');
    });

    it('should include contact information and branding', () => {
      const template = generateEnrollmentStudentConfirmation(mockEnrollmentData);

      expect(template.html).toContain('Vantage Vertical');
      expect(template.html).toContain('vantagevarticalltd@gmail.com');
      expect(template.text).toContain('Vantage Vertical');
      expect(template.text).toContain('vantagevarticalltd@gmail.com');
    });
  });
});