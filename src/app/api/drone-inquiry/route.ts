import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email/emailService';
import { DroneInquiryData } from '@/types/forms';
import { 
  generateDroneInquiryAdminEmail, 
  generateDroneInquiryCustomerEmail 
} from '@/lib/email/templates/droneInquiry';
import { isValidEmail } from '@/lib/email/utils';

export async function POST(request: NextRequest) {
  try {
    const data: DroneInquiryData = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'droneId', 'intendedUse'];
    const missingFields = requiredFields.filter(field => !data[field as keyof DroneInquiryData]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate email format using shared utility
    if (!isValidEmail(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate SMTP configuration before attempting to send emails
    const isConfigured = await emailService.validateConfiguration();
    if (!isConfigured) {
      console.warn('Email service not configured, inquiry will be logged but not emailed');
      
      // Log the inquiry for manual processing
      console.log('Drone Inquiry Received (Email service unavailable):', {
        ...data,
        timestamp: new Date().toISOString(),
        source: 'website'
      });

      return NextResponse.json(
        { 
          message: 'Inquiry submitted successfully',
          inquiryId: `INQ-${Date.now()}`,
          estimatedResponse: '24 hours',
          warning: 'Email notifications may be delayed due to system maintenance'
        },
        { status: 200 }
      );
    }

    // Test SMTP connection
    const connectionTest = await emailService.testConnection();
    if (!connectionTest) {
      console.warn('SMTP connection test failed, proceeding with email attempts');
    }

    // Log the inquiry
    console.log('Drone Inquiry Received:', {
      ...data,
      timestamp: new Date().toISOString(),
      source: 'website'
    });

    // Generate email templates
    const adminEmailTemplate = generateDroneInquiryAdminEmail(data);
    const customerEmailTemplate = generateDroneInquiryCustomerEmail(data);

    // Send emails asynchronously (don't block the response)
    const emailPromises = [];

    // Send admin notification email
    const adminEmailPromise = emailService.sendEmail({
      to: process.env.CONTACT_EMAIL || 'vantagevarticalltd@gmail.com',
      subject: adminEmailTemplate.subject,
      html: adminEmailTemplate.html,
      text: adminEmailTemplate.text
    }).then(result => {
      if (result.success) {
        console.log('Admin drone inquiry notification sent successfully:', result.messageId);
      } else {
        console.error('Failed to send admin drone inquiry notification:', result.error?.message);
      }
      return result;
    }).catch(error => {
      console.error('Error sending admin drone inquiry notification:', error);
      return { success: false, error, retryCount: 0, timestamp: new Date(), recipient: process.env.CONTACT_EMAIL || 'vantagevarticalltd@gmail.com', subject: adminEmailTemplate.subject };
    });

    emailPromises.push(adminEmailPromise);

    // Send customer acknowledgment email
    const customerEmailPromise = emailService.sendEmail({
      to: data.email,
      subject: customerEmailTemplate.subject,
      html: customerEmailTemplate.html,
      text: customerEmailTemplate.text
    }).then(result => {
      if (result.success) {
        console.log('Customer drone inquiry acknowledgment sent successfully:', result.messageId);
      } else {
        console.error('Failed to send customer drone inquiry acknowledgment:', result.error?.message);
      }
      return result;
    }).catch(error => {
      console.error('Error sending customer drone inquiry acknowledgment:', error);
      return { success: false, error, retryCount: 0, timestamp: new Date(), recipient: data.email, subject: customerEmailTemplate.subject };
    });

    emailPromises.push(customerEmailPromise);

    // Process emails in background without blocking response
    Promise.all(emailPromises).then(results => {
      const adminResult = results[0];
      const customerResult = results[1];
      
      console.log('Drone inquiry email processing completed:', {
        adminEmailSent: adminResult.success,
        customerEmailSent: customerResult.success,
        inquiryId: `INQ-${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    });

    // Return immediate response to user
    return NextResponse.json(
      { 
        message: 'Inquiry submitted successfully',
        inquiryId: `INQ-${Date.now()}`,
        estimatedResponse: '24 hours'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing drone inquiry:', error);
    
    // Provide user-friendly error message
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return NextResponse.json(
      { 
        error: 'Unable to process your inquiry at this time. Please try again later or contact us directly.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}

