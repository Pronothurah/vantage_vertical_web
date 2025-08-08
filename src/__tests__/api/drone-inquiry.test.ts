import { POST } from '@/app/api/drone-inquiry/route';
import { NextRequest } from 'next/server';
import { emailService } from '@/lib/email/emailService';

// Mock the email service
jest.mock('@/lib/email/emailService', () => ({
  emailService: {
    validateConfiguration: jest.fn(),
    testConnection: jest.fn(),
    sendEmail: jest.fn(),
  },
}));

const mockEmailService = emailService as jest.Mocked<typeof emailService>;

describe('/api/drone-inquiry', () => {
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

  const validInquiryData = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254700123456',
    droneId: 'dji-mavic-3',
    inquiryType: 'quote' as const,
    quantity: 1,
    intendedUse: 'Commercial photography',
    experience: 'beginner' as const,
    trainingNeeded: false,
    financingInterest: false,
    message: 'I need a quote for this drone',
  };

  it('should successfully process drone inquiry with email service configured', async () => {
    // Mock email service as configured and working
    mockEmailService.validateConfiguration.mockResolvedValue(true);
    mockEmailService.testConnection.mockResolvedValue(true);
    mockEmailService.sendEmail.mockResolvedValue({
      success: true,
      messageId: 'test-message-id',
      retryCount: 0,
      timestamp: new Date(),
      recipient: 'test@example.com',
      subject: 'Test Subject',
    });

    const request = new NextRequest('http://localhost:3000/api/drone-inquiry', {
      method: 'POST',
      body: JSON.stringify(validInquiryData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Inquiry submitted successfully');
    expect(data.inquiryId).toMatch(/^INQ-\d+$/);
    expect(data.estimatedResponse).toBe('24 hours');
    expect(data.warning).toBeUndefined();

    // Verify email service was called
    expect(mockEmailService.validateConfiguration).toHaveBeenCalled();
    expect(mockEmailService.testConnection).toHaveBeenCalled();
    expect(mockEmailService.sendEmail).toHaveBeenCalledTimes(2); // Admin and customer emails
  });

  it('should handle case when email service is not configured', async () => {
    // Mock email service as not configured
    mockEmailService.validateConfiguration.mockResolvedValue(false);

    const request = new NextRequest('http://localhost:3000/api/drone-inquiry', {
      method: 'POST',
      body: JSON.stringify(validInquiryData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Inquiry submitted successfully');
    expect(data.warning).toBe('Email notifications may be delayed due to system maintenance');

    // Verify email service validation was called but no emails were sent
    expect(mockEmailService.validateConfiguration).toHaveBeenCalled();
    expect(mockEmailService.sendEmail).not.toHaveBeenCalled();
  });

  it('should validate required fields', async () => {
    const invalidData = {
      name: 'John Doe',
      // Missing required fields
    };

    const request = new NextRequest('http://localhost:3000/api/drone-inquiry', {
      method: 'POST',
      body: JSON.stringify(invalidData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Missing required fields');
  });

  it('should validate email format', async () => {
    const invalidEmailData = {
      ...validInquiryData,
      email: 'invalid-email',
    };

    const request = new NextRequest('http://localhost:3000/api/drone-inquiry', {
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

  it('should handle email sending errors gracefully', async () => {
    // Mock email service as configured but failing to send
    mockEmailService.validateConfiguration.mockResolvedValue(true);
    mockEmailService.testConnection.mockResolvedValue(true);
    mockEmailService.sendEmail.mockResolvedValue({
      success: false,
      error: {
        name: 'EmailError',
        message: 'SMTP connection failed',
        type: 'SMTP_CONNECTION_ERROR',
        retryable: true,
      } as any,
      retryCount: 3,
      timestamp: new Date(),
      recipient: 'test@example.com',
      subject: 'Test Subject',
    });

    const request = new NextRequest('http://localhost:3000/api/drone-inquiry', {
      method: 'POST',
      body: JSON.stringify(validInquiryData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    // Should still return success to user even if email fails
    expect(response.status).toBe(200);
    expect(data.message).toBe('Inquiry submitted successfully');

    // Verify email service was called
    expect(mockEmailService.sendEmail).toHaveBeenCalled();
  });

  it('should handle SMTP connection test failure', async () => {
    // Mock email service as configured but connection test fails
    mockEmailService.validateConfiguration.mockResolvedValue(true);
    mockEmailService.testConnection.mockResolvedValue(false);
    mockEmailService.sendEmail.mockResolvedValue({
      success: true,
      messageId: 'test-message-id',
      retryCount: 0,
      timestamp: new Date(),
      recipient: 'test@example.com',
      subject: 'Test Subject',
    });

    const request = new NextRequest('http://localhost:3000/api/drone-inquiry', {
      method: 'POST',
      body: JSON.stringify(validInquiryData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe('Inquiry submitted successfully');

    // Should still attempt to send emails even if connection test fails
    expect(mockEmailService.sendEmail).toHaveBeenCalled();
  });

  it('should handle JSON parsing errors', async () => {
    const request = new NextRequest('http://localhost:3000/api/drone-inquiry', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Unable to process your inquiry at this time. Please try again later or contact us directly.');
  });

  it('should send emails with correct templates and recipients', async () => {
    // Mock email service as configured and working
    mockEmailService.validateConfiguration.mockResolvedValue(true);
    mockEmailService.testConnection.mockResolvedValue(true);
    mockEmailService.sendEmail.mockResolvedValue({
      success: true,
      messageId: 'test-message-id',
      retryCount: 0,
      timestamp: new Date(),
      recipient: 'test@example.com',
      subject: 'Test Subject',
    });

    const request = new NextRequest('http://localhost:3000/api/drone-inquiry', {
      method: 'POST',
      body: JSON.stringify(validInquiryData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    await POST(request);

    // Verify admin email was sent
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'vantagevarticalltd@gmail.com',
        subject: expect.stringContaining('New Drone Inquiry'),
        html: expect.stringContaining('John Doe'),
        text: expect.stringContaining('John Doe'),
      })
    );

    // Verify customer email was sent
    expect(mockEmailService.sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'john@example.com',
        subject: expect.stringContaining('Thank you for your drone inquiry'),
        html: expect.stringContaining('John'),
        text: expect.stringContaining('John'),
      })
    );
  });
});