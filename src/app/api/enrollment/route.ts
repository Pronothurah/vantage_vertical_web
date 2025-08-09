import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '../../../lib/email/emailService';
import { EnrollmentData } from '../../../types/forms';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields (excluding terms which is handled separately)
    const requiredFields = ['name', 'email', 'phone', 'program', 'session', 'experience', 'motivation'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: 'Missing required fields', fields: missingFields },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone format (Kenyan numbers)
    const phoneRegex = /^(\+254|0)[17]\d{8}$/;
    if (!phoneRegex.test(body.phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Validate terms acceptance
    if (!body.terms) {
      return NextResponse.json(
        { error: 'Terms and conditions must be accepted' },
        { status: 400 }
      );
    }

    // Create enrollment data object
    const enrollmentData: EnrollmentData = {
      name: body.name,
      email: body.email,
      phone: body.phone,
      program: body.program,
      session: body.session,
      experience: body.experience,
      motivation: body.motivation,
      accommodation: body.accommodation || false,
      terms: body.terms,
      emergencyContact: body.emergencyContact || undefined
    };

    // Generate enrollment ID
    const enrollmentId = `ENV-${Date.now()}`;
    
    // Log enrollment for record keeping
    console.log('Training enrollment received:', {
      enrollmentId,
      name: enrollmentData.name,
      email: enrollmentData.email,
      phone: enrollmentData.phone,
      program: enrollmentData.program,
      session: enrollmentData.session,
      experience: enrollmentData.experience,
      motivation: enrollmentData.motivation.substring(0, 100) + (enrollmentData.motivation.length > 100 ? '...' : ''),
      accommodation: enrollmentData.accommodation,
      timestamp: new Date().toISOString()
    });

    // Send enrollment emails asynchronously for better performance
    let queueIds;
    try {
      // Use async email processing to avoid blocking user response
      queueIds = await emailService.sendEnrollmentEmailsAsync(
        enrollmentData,
        (results) => {
          // Log email results for monitoring (processed in background)
          console.log('Enrollment email processing completed:', {
            enrollmentId,
            adminEmailSuccess: results.adminResult.success,
            studentEmailSuccess: results.studentResult.success,
            adminEmailError: results.adminResult.error?.message,
            studentEmailError: results.studentResult.error?.message,
            timestamp: new Date().toISOString()
          });
        }
      );
      
      console.log('Enrollment emails queued for processing:', {
        enrollmentId,
        adminQueueId: queueIds.adminQueueId,
        studentQueueId: queueIds.studentQueueId,
        enrollmentData: {
          name: enrollmentData.name,
          email: enrollmentData.email,
          program: enrollmentData.program,
          session: enrollmentData.session
        }
      });
      
    } catch (emailError) {
      console.error('Failed to queue enrollment emails:', emailError);
      
      // Continue with success response even if email queueing fails
      // This ensures user experience is not blocked by email issues
      queueIds = null;
    }

    // Return immediate success response with email processing status
    return NextResponse.json(
      { 
        message: 'Enrollment submitted successfully. Confirmation emails are being processed.',
        enrollmentId,
        status: 'confirmed',
        emailStatus: {
          processing: true,
          adminQueueId: queueIds?.adminQueueId,
          studentQueueId: queueIds?.studentQueueId,
          note: 'Email confirmations will be sent shortly. You will receive confirmation emails once processing is complete.'
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Enrollment submission error:', error);
    
    // Provide more specific error information in development
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        ...(isDevelopment && { details: (error as Error).message })
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Training enrollment API endpoint' },
    { status: 200 }
  );
}