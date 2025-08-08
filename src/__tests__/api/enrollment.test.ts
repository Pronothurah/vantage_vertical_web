import { POST } from '@/app/api/enrollment/route';
import { NextRequest } from 'next/server';
import { emailService } from '@/lib/email/emailService';

// Mock the email service
jest.mock('@/lib/email/emailService', () => ({
  emailService: {
    sendEnrollmentEmails: jest.fn(),
  },
}));

const mockEmailService = emailService as jest.Mocked<typeof emailService>;

describe('/api/enrollment', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset console methods
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const validEnrollmentData = {
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

  it('should successfully process enrollment with both emails sent', async () => {
    // Mock successful email sending
    mockEmailService.sendEnrollmentEmails.mockResolvedValue({
      adminResult: {
        success: true,
        messageId: 'admin-message-id',
        retryCount: 0,
        timestamp: new Date(),
        recipient: 'vantagevarticalltd@gmail.com',
        subject: 'New Training Enrollment: John Doe - Basic Drone Pilot Training',
      },
      studentResult: {
        success: true,
        messageId: 'student-message-id',
        retryCount: 0,
        timestamp: new Date(),
        recipient: 'john@example.com',
        subject: 'Welcome to Vantage Vertical Training - Basic Drone Pilot Training Enrollment Confirmed',
      }
    });

    const request = new NextRequest('http://localhost:3000/api/enrollment', {
      method: 'POST',
      body: JSON.stringify(validEnrollmentData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Enrollment submitted successfully. Confirmation emails have been sent.');
    expect(data.enrollmentId).toMatch(/^ENV-\d+$/);
    expect(data.status).toBe('confirmed');
    expect(data.emailStatus.confirmationSent).toBe(true);
    expect(data.emailStatus.adminNotified).toBe(true);

    // Verify email service was called with correct data
    expect(mockEmailService.sendEnrollmentEmails).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+254700123456',
        program: 'basic-pilot',
        session: '2024-02-15-2024-02-17',
        experience: 'complete-beginner',
        motivation: expect.stringContaining('aerial photography'),
        accommodation: false,
        terms: true,
        emergencyContact: {
          name: 'Jane Doe',
          phone: '+254700123457',
          relationship: 'spouse'
        }
      })
    );
  });

  it('should handle partial email failure gracefully', async () => {
    // Mock partial email failure (admin email fails, student email succeeds)
    mockEmailService.sendEnrollmentEmails.mockResolvedValue({
      adminResult: {
        success: false,
        error: {
          name: 'EmailError',
          message: 'SMTP connection failed',
          type: 'SMTP_CONNECTION_ERROR',
          retryable: true,
        } as any,
        retryCount: 3,
        timestamp: new Date(),
        recipient: 'vantagevarticalltd@gmail.com',
        subject: 'New Training Enrollment: John Doe - Basic Drone Pilot Training',
      },
      studentResult: {
        success: true,
        messageId: 'student-message-id',
        retryCount: 0,
        timestamp: new Date(),
        recipient: 'john@example.com',
        subject: 'Welcome to Vantage Vertical Training - Basic Drone Pilot Training Enrollment Confirmed',
      }
    });

    const request = new NextRequest('http://localhost:3000/api/enrollment', {
      method: 'POST',
      body: JSON.stringify(validEnrollmentData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Enrollment submitted successfully. Some confirmation emails may have failed to send.');
    expect(data.status).toBe('pending_confirmation');
    expect(data.emailStatus.confirmationSent).toBe(true);
    expect(data.emailStatus.adminNotified).toBe(false);
    expect(data.emailStatus.warning).toBe('Some emails failed to send. Our team will follow up manually.');
  });

  it('should handle complete email failure gracefully', async () => {
    // Mock complete email failure
    mockEmailService.sendEnrollmentEmails.mockResolvedValue({
      adminResult: {
        success: false,
        error: {
          name: 'EmailError',
          message: 'SMTP connection failed',
          type: 'SMTP_CONNECTION_ERROR',
          retryable: true,
        } as any,
        retryCount: 3,
        timestamp: new Date(),
        recipient: 'vantagevarticalltd@gmail.com',
        subject: 'New Training Enrollment: John Doe - Basic Drone Pilot Training',
      },
      studentResult: {
        success: false,
        error: {
          name: 'EmailError',
          message: 'SMTP connection failed',
          type: 'SMTP_CONNECTION_ERROR',
          retryable: true,
        } as any,
        retryCount: 3,
        timestamp: new Date(),
        recipient: 'john@example.com',
        subject: 'Welcome to Vantage Vertical Training - Basic Drone Pilot Training Enrollment Confirmed',
      }
    });

    const request = new NextRequest('http://localhost:3000/api/enrollment', {
      method: 'POST',
      body: JSON.stringify(validEnrollmentData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Enrollment submitted successfully, but confirmation emails could not be sent. Our team will contact you directly.');
    expect(data.status).toBe('pending_manual_confirmation');
    expect(data.emailStatus.confirmationSent).toBe(false);
    expect(data.emailStatus.adminNotified).toBe(false);
    expect(data.emailStatus.error).toBe('Email delivery failed. Manual follow-up required.');
  });

  it('should validate required fields', async () => {
    const invalidData = {
      name: 'John Doe',
      email: 'john@example.com',
      // Missing required fields
    };

    const request = new NextRequest('http://localhost:3000/api/enrollment', {
      method: 'POST',
      body: JSON.stringify(invalidData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Missing required fields');
    expect(data.fields).toEqual(expect.arrayContaining(['phone', 'program', 'session', 'experience', 'motivation']));
  });

  it('should validate email format', async () => {
    const invalidEmailData = {
      ...validEnrollmentData,
      email: 'invalid-email',
    };

    const request = new NextRequest('http://localhost:3000/api/enrollment', {
      method: 'POST',
      body: JSON.stringify(invalidEmailData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid email format');
  });

  it('should validate phone format', async () => {
    const invalidPhoneData = {
      ...validEnrollmentData,
      phone: '123456789', // Invalid Kenyan phone format
    };

    const request = new NextRequest('http://localhost:3000/api/enrollment', {
      method: 'POST',
      body: JSON.stringify(invalidPhoneData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid phone number format');
  });

  it('should validate terms acceptance', async () => {
    const noTermsData = {
      ...validEnrollmentData,
      terms: false,
    };

    const request = new NextRequest('http://localhost:3000/api/enrollment', {
      method: 'POST',
      body: JSON.stringify(noTermsData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    // The API checks for missing required fields first, then terms acceptance
    // Since terms is false (not missing), it should be caught by the terms validation
    expect(data.error).toBe('Terms and conditions must be accepted');
  });

  it('should handle enrollment without emergency contact', async () => {
    const noEmergencyContactData = {
      ...validEnrollmentData,
      emergencyContact: undefined,
    };

    // Mock successful email sending
    mockEmailService.sendEnrollmentEmails.mockResolvedValue({
      adminResult: {
        success: true,
        messageId: 'admin-message-id',
        retryCount: 0,
        timestamp: new Date(),
        recipient: 'vantagevarticalltd@gmail.com',
        subject: 'New Training Enrollment: John Doe - Basic Drone Pilot Training',
      },
      studentResult: {
        success: true,
        messageId: 'student-message-id',
        retryCount: 0,
        timestamp: new Date(),
        recipient: 'john@example.com',
        subject: 'Welcome to Vantage Vertical Training - Basic Drone Pilot Training Enrollment Confirmed',
      }
    });

    const request = new NextRequest('http://localhost:3000/api/enrollment', {
      method: 'POST',
      body: JSON.stringify(noEmergencyContactData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Enrollment submitted successfully. Confirmation emails have been sent.');

    // Verify email service was called with undefined emergency contact
    expect(mockEmailService.sendEnrollmentEmails).toHaveBeenCalledWith(
      expect.objectContaining({
        emergencyContact: undefined
      })
    );
  });

  it('should handle email service throwing an error', async () => {
    // Mock email service throwing an error
    mockEmailService.sendEnrollmentEmails.mockRejectedValue(new Error('Email service unavailable'));

    const request = new NextRequest('http://localhost:3000/api/enrollment', {
      method: 'POST',
      body: JSON.stringify(validEnrollmentData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Enrollment submitted successfully, but confirmation emails could not be sent. Our team will contact you directly.');
    expect(data.status).toBe('pending_manual_confirmation');
  });

  it('should handle JSON parsing errors', async () => {
    const request = new NextRequest('http://localhost:3000/api/enrollment', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });

  it('should handle accommodation request properly', async () => {
    const accommodationData = {
      ...validEnrollmentData,
      accommodation: true,
    };

    // Mock successful email sending
    mockEmailService.sendEnrollmentEmails.mockResolvedValue({
      adminResult: {
        success: true,
        messageId: 'admin-message-id',
        retryCount: 0,
        timestamp: new Date(),
        recipient: 'vantagevarticalltd@gmail.com',
        subject: 'New Training Enrollment: John Doe - Basic Drone Pilot Training',
      },
      studentResult: {
        success: true,
        messageId: 'student-message-id',
        retryCount: 0,
        timestamp: new Date(),
        recipient: 'john@example.com',
        subject: 'Welcome to Vantage Vertical Training - Basic Drone Pilot Training Enrollment Confirmed',
      }
    });

    const request = new NextRequest('http://localhost:3000/api/enrollment', {
      method: 'POST',
      body: JSON.stringify(accommodationData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);

    // Verify email service was called with accommodation request
    expect(mockEmailService.sendEnrollmentEmails).toHaveBeenCalledWith(
      expect.objectContaining({
        accommodation: true
      })
    );
  });
});