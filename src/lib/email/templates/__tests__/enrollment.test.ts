import { 
  generateEnrollmentAdminNotification,
  generateEnrollmentStudentConfirmation,
  generateEnrollmentEmails,
  getProgramInfo
} from '../enrollment';
import { EnrollmentData } from '../../../../types/forms';

describe('Enrollment Email Templates', () => {
  const mockEnrollmentData: EnrollmentData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+254712345678',
    program: 'basic-pilot',
    session: 'January 2024',
    experience: 'beginner',
    accommodation: true,
    motivation: 'I want to start a drone photography business',
    emergencyContact: {
      name: 'Jane Doe',
      relationship: 'spouse',
      phone: '+254787654321'
    }
  };

  describe('generateEnrollmentAdminNotification', () => {
    it('should generate admin notification with correct branding and contact info', () => {
      const template = generateEnrollmentAdminNotification(mockEnrollmentData);

      // Check that template is generated
      expect(template).toHaveProperty('html');
      expect(template).toHaveProperty('text');
      expect(template).toHaveProperty('subject');

      // Check subject line
      expect(template.subject).toContain('New Training Enrollment');
      expect(template.subject).toContain('John Doe');
      expect(template.subject).toContain('Basic Drone Pilot Training');

      // Check HTML content contains student information
      expect(template.html).toContain('John Doe');
      expect(template.html).toContain('john.doe@example.com');
      expect(template.html).toContain('+254712345678');
      expect(template.html).toContain('Basic Drone Pilot Training');
      expect(template.html).toContain('January 2024');

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

    it('should handle emergency contact information', () => {
      const template = generateEnrollmentAdminNotification(mockEnrollmentData);

      expect(template.html).toContain('Jane Doe');
      expect(template.html).toContain('spouse');
      expect(template.html).toContain('+254787654321');
    });

    it('should handle motivation section', () => {
      const template = generateEnrollmentAdminNotification(mockEnrollmentData);

      expect(template.html).toContain('Student Motivation');
      expect(template.html).toContain('I want to start a drone photography business');
    });

    it('should handle missing emergency contact gracefully', () => {
      const dataWithoutEmergencyContact = { ...mockEnrollmentData };
      delete dataWithoutEmergencyContact.emergencyContact;

      const template = generateEnrollmentAdminNotification(dataWithoutEmergencyContact);

      expect(template.html).toContain('Not provided');
    });
  });

  describe('generateEnrollmentStudentConfirmation', () => {
    it('should generate student confirmation with correct branding and contact info', () => {
      const template = generateEnrollmentStudentConfirmation(mockEnrollmentData);

      // Check that template is generated
      expect(template).toHaveProperty('html');
      expect(template).toHaveProperty('text');
      expect(template).toHaveProperty('subject');

      // Check subject line
      expect(template.subject).toContain('Welcome to Vantage Vertical Training');
      expect(template.subject).toContain('Basic Drone Pilot Training');

      // Check HTML content contains student name and program info
      expect(template.html).toContain('Dear John Doe');
      expect(template.html).toContain('Basic Drone Pilot Training');
      expect(template.html).toContain('January 2024');

      // Check that it uses base template (should contain company branding)
      expect(template.html).toContain('Vantage Vertical');
      expect(template.html).toContain('vantagevertical.co.ke');
      expect(template.html).toContain('+254704277687'); // Correct phone number from base config
      expect(template.html).toContain('vantageverticalltd@gmail.com'); // Correct email from base config

      // Check contact button uses correct email
      expect(template.html).toContain('mailto:vantageverticalltd@gmail.com');

      // Check text version
      expect(template.text).toContain('John Doe');
      expect(template.text).toContain('Vantage Vertical');
      expect(template.text).toContain('+254704277687');
      expect(template.text).toContain('vantageverticalltd@gmail.com');
    });

    it('should display accommodation information correctly', () => {
      const template = generateEnrollmentStudentConfirmation(mockEnrollmentData);

      expect(template.html).toContain('You requested accommodation assistance');
    });

    it('should handle no accommodation request', () => {
      const dataWithoutAccommodation = { ...mockEnrollmentData, accommodation: false };
      const template = generateEnrollmentStudentConfirmation(dataWithoutAccommodation);

      expect(template.html).toContain('You indicated that you don\'t need accommodation assistance');
    });

    it('should include program requirements', () => {
      const template = generateEnrollmentStudentConfirmation(mockEnrollmentData);

      expect(template.html).toContain('What to Bring');
      expect(template.html).toContain('Valid ID or passport');
      expect(template.html).toContain('Basic English proficiency');
    });
  });

  describe('generateEnrollmentEmails', () => {
    it('should generate both admin and student emails', () => {
      const emails = generateEnrollmentEmails(mockEnrollmentData);

      expect(emails).toHaveProperty('adminNotification');
      expect(emails).toHaveProperty('studentConfirmation');

      // Verify both emails are properly generated
      expect(emails.adminNotification.subject).toContain('New Training Enrollment');
      expect(emails.studentConfirmation.subject).toContain('Welcome to Vantage Vertical Training');

      // Verify both use correct branding
      expect(emails.adminNotification.html).toContain('vantagevertical.co.ke');
      expect(emails.studentConfirmation.html).toContain('vantagevertical.co.ke');
    });
  });

  describe('getProgramInfo', () => {
    it('should return correct program information for known programs', () => {
      const basicPilotInfo = getProgramInfo('basic-pilot');

      expect(basicPilotInfo.name).toBe('Basic Drone Pilot Training');
      expect(basicPilotInfo.duration).toBe('3 days');
      expect(basicPilotInfo.price).toBe('KES 45,000');
    });

    it('should return default information for unknown programs', () => {
      const unknownProgramInfo = getProgramInfo('unknown-program');

      expect(unknownProgramInfo.name).toBe('unknown-program');
      expect(unknownProgramInfo.duration).toBe('TBD');
      expect(unknownProgramInfo.price).toBe('Contact for pricing');
    });
  });

  describe('Logo and Contact Information Consistency', () => {
    it('should use correct logo URL from base template', () => {
      const template = generateEnrollmentStudentConfirmation(mockEnrollmentData);

      // Should use the correct domain
      expect(template.html).toContain('vantagevertical.co.ke/vantage-logo.png');
      // Should NOT contain the incorrect domain
      expect(template.html).not.toContain('vantagevartical.com');
    });

    it('should use standardized contact information', () => {
      const adminTemplate = generateEnrollmentAdminNotification(mockEnrollmentData);
      const studentTemplate = generateEnrollmentStudentConfirmation(mockEnrollmentData);

      // Both templates should use the same standardized contact info
      [adminTemplate, studentTemplate].forEach(template => {
        expect(template.html).toContain('+254704277687');
        expect(template.html).toContain('vantageverticalltd@gmail.com');
        expect(template.html).toContain('vantagevertical.co.ke');
      });
    });

    it('should not contain any hardcoded incorrect contact information', () => {
      const adminTemplate = generateEnrollmentAdminNotification(mockEnrollmentData);
      const studentTemplate = generateEnrollmentStudentConfirmation(mockEnrollmentData);

      // Should not contain placeholder phone number
      [adminTemplate, studentTemplate].forEach(template => {
        expect(template.html).not.toContain('+254 XXX XXX XXX');
        expect(template.html).not.toContain('vantagevartical.com'); // Wrong domain
      });
    });
  });
});