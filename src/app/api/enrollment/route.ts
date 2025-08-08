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

    // Send enrollment emails asynchronously
    let emailResults;
    try {
      emailResults = await emailService.sendEnrollmentEmails(enrollmentData);
      
      // Log email results
      console.log('Enrollment email results:', {
        enrollmentId,
        adminEmailSuccess: emailResults.adminResult.success,
        studentEmailSuccess: emailResults.studentResult.success,
        adminEmailError: emailResults.adminResult.error?.message,
        studentEmailError: emailResults.studentResult.error?.message
      });
      
    } catch (error) {
      console.error('Failed to send enrollment emails:', error);
      // Continue with success response even if emails fail
      emailResults = {
        adminResult: { success: false, error: error as any },
        studentResult: { success: false, error: error as any }
      };
    }

    // Determine response based on email success
    const bothEmailsSuccessful = emailResults.adminResult.success && emailResults.studentResult.success;
    const anyEmailSuccessful = emailResults.adminResult.success || emailResults.studentResult.success;

    if (bothEmailsSuccessful) {
      return NextResponse.json(
        { 
          message: 'Enrollment submitted successfully. Confirmation emails have been sent.',
          enrollmentId,
          status: 'confirmed',
          emailStatus: {
            confirmationSent: true,
            adminNotified: true
          }
        },
        { status: 200 }
      );
    } else if (anyEmailSuccessful) {
      return NextResponse.json(
        { 
          message: 'Enrollment submitted successfully. Some confirmation emails may have failed to send.',
          enrollmentId,
          status: 'pending_confirmation',
          emailStatus: {
            confirmationSent: emailResults.studentResult.success,
            adminNotified: emailResults.adminResult.success,
            warning: 'Some emails failed to send. Our team will follow up manually.'
          }
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { 
          message: 'Enrollment submitted successfully, but confirmation emails could not be sent. Our team will contact you directly.',
          enrollmentId,
          status: 'pending_manual_confirmation',
          emailStatus: {
            confirmationSent: false,
            adminNotified: false,
            error: 'Email delivery failed. Manual follow-up required.'
          }
        },
        { status: 200 }
      );
    }

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