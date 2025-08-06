import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'email', 'phone', 'program', 'session', 'experience', 'motivation', 'terms'];
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

    // Here you would typically:
    // 1. Save to database
    // 2. Send confirmation email to student
    // 3. Send notification email to training team
    // 4. Update available slots
    
    // For now, we'll simulate the process
    console.log('Training enrollment received:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      program: body.program,
      session: body.session,
      experience: body.experience,
      motivation: body.motivation.substring(0, 100) + '...',
      accommodation: body.accommodation,
      timestamp: new Date().toISOString()
    });

    // Simulate email sending
    const emailData = {
      to: body.email,
      subject: 'Training Enrollment Confirmation - Vantage Vertical',
      template: 'enrollment-confirmation',
      data: {
        name: body.name,
        program: body.program,
        session: body.session,
        experience: body.experience
      }
    };

    // In a real implementation, you would send the email here
    console.log('Would send confirmation email:', emailData);

    return NextResponse.json(
      { 
        message: 'Enrollment submitted successfully',
        enrollmentId: `ENV-${Date.now()}`,
        status: 'pending_confirmation'
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Enrollment submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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