import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // TODO: Integrate with email service (e.g., Mailchimp, ConvertKit, etc.)
    // For now, we'll just log the subscription and return success
    console.log('Newsletter subscription:', email);

    // In a real implementation, you would:
    // 1. Add the email to your newsletter service
    // 2. Send a confirmation email
    // 3. Store the subscription in your database
    
    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}