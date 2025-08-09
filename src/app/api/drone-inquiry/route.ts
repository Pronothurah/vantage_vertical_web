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

    // Send drone inquiry emails asynchronously for better performance
    let queueIds;
    try {
      // Use async email processing to avoid blocking user response
      queueIds = await emailService.sendDroneInquiryEmailsAsync(
        data,
        (results) => {
          // Log email results for monitoring (processed in background)
          console.log('Drone inquiry email processing completed:', {
            adminEmailSuccess: results.adminResult.success,
            customerEmailSuccess: results.customerResult.success,
            adminEmailError: results.adminResult.error?.message,
            customerEmailError: results.customerResult.error?.message,
            inquiryId: `INQ-${Date.now()}`,
            timestamp: new Date().toISOString()
          });
        }
      );
      
      console.log('Drone inquiry emails queued for processing:', {
        adminQueueId: queueIds.adminQueueId,
        customerQueueId: queueIds.customerQueueId,
        inquiryData: {
          name: data.name,
          email: data.email,
          droneId: data.droneId,
          inquiryType: data.inquiryType
        }
      });
      
    } catch (emailError) {
      console.error('Failed to queue drone inquiry emails:', emailError);
      
      // Continue with success response even if email queueing fails
      // This ensures user experience is not blocked by email issues
      queueIds = null;
    }

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

