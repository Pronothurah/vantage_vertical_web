import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Rate limiting store for newsletter subscriptions
const newsletterRateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration for newsletter
const NEWSLETTER_RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const NEWSLETTER_RATE_LIMIT_MAX_REQUESTS = 3; // Max 3 newsletter subscriptions per hour per IP

// Subscription storage (in production, use a database)
const subscriptions = new Set<string>();

interface NewsletterSubscription {
  email: string;
  subscribedAt: Date;
  confirmed: boolean;
  confirmationToken?: string;
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

function checkNewsletterRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const clientData = newsletterRateLimitStore.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize rate limit for this IP
    newsletterRateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + NEWSLETTER_RATE_LIMIT_WINDOW
    });
    return true;
  }
  
  if (clientData.count >= NEWSLETTER_RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  // Increment count
  clientData.count++;
  newsletterRateLimitStore.set(clientIP, clientData);
  return true;
}

function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  // Trim and convert to lowercase
  email = email.trim().toLowerCase();

  // Check length
  if (email.length > 254) {
    return { isValid: false, error: 'Email address is too long' };
  }

  // Enhanced email validation
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please provide a valid email address' };
  }

  // Check for common disposable email domains
  const disposableDomains = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
    'mailinator.com', 'throwaway.email', 'temp-mail.org'
  ];
  
  const domain = email.split('@')[1];
  if (disposableDomains.includes(domain)) {
    return { isValid: false, error: 'Please use a permanent email address' };
  }

  return { isValid: true };
}

function generateConfirmationToken(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

async function sendConfirmationEmail(email: string, confirmationToken: string): Promise<void> {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/newsletter/confirm?token=${confirmationToken}&email=${encodeURIComponent(email)}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #D72638; color: white; padding: 30px; text-align: center;">
        <img src="https://vantagevertical.co.ke/vantage-logo-white.jpg" alt="Vantage Vertical Logo" style="height: 60px; margin-bottom: 15px;" />
        <h1 style="margin: 0; font-size: 28px;">Welcome to Vantage Vertical!</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px;">Confirm your newsletter subscription</p>
      </div>
      
      <div style="padding: 40px 30px; background-color: #f8f9fa;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #333; margin-top: 0; font-size: 24px;">Almost there!</h2>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for subscribing to the Vantage Vertical newsletter. You'll receive updates about:
          </p>
          
          <ul style="color: #666; font-size: 16px; line-height: 1.8; padding-left: 20px;">
            <li>Latest drone technology and innovations</li>
            <li>Agricultural drone solutions and case studies</li>
            <li>Aerial mapping and surveillance insights</li>
            <li>Training program announcements</li>
            <li>Industry news and best practices</li>
          </ul>
          
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            To complete your subscription, please click the button below to confirm your email address:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmationUrl}" 
               style="background-color: #D72638; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; display: inline-block;">
              Confirm Subscription
            </a>
          </div>
          
          <p style="color: #999; font-size: 14px; line-height: 1.5;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${confirmationUrl}" style="color: #D72638; word-break: break-all;">${confirmationUrl}</a>
          </p>
          
          <div style="margin-top: 30px; padding: 20px; background-color: #e7f3ff; border-radius: 5px; border-left: 4px solid #D72638;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Note:</strong> This confirmation link will expire in 24 hours. 
              If you didn't subscribe to our newsletter, you can safely ignore this email.
            </p>
          </div>
        </div>
      </div>
      
      <div style="background-color: #343a40; color: white; padding: 20px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">
          © ${new Date().getFullYear()} Vantage Vertical. All rights reserved.
        </p>
        <p style="margin: 10px 0 0 0;">
          Professional drone services for aerial mapping, surveillance, and agriculture.
        </p>
      </div>
    </div>
  `;

  const textContent = `
Welcome to Vantage Vertical Newsletter!

Thank you for subscribing to our newsletter. You'll receive updates about:
- Latest drone technology and innovations
- Agricultural drone solutions and case studies
- Aerial mapping and surveillance insights
- Training program announcements
- Industry news and best practices

To complete your subscription, please visit this link to confirm your email address:
${confirmationUrl}

This confirmation link will expire in 24 hours.

If you didn't subscribe to our newsletter, you can safely ignore this email.

© ${new Date().getFullYear()} Vantage Vertical. All rights reserved.
Professional drone services for aerial mapping, surveillance, and agriculture.
  `;

  await transporter.sendMail({
    from: `"Vantage Vertical" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: 'Confirm your Vantage Vertical newsletter subscription',
    text: textContent,
    html: htmlContent,
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Check rate limit
    if (!checkNewsletterRateLimit(clientIP)) {
      return NextResponse.json(
        { 
          error: 'Too many subscription attempts. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    // Parse request body
    let requestData: { email: string };
    try {
      requestData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request data', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    // Validate email
    const validation = validateEmail(requestData.email);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: validation.error,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    const email = requestData.email.trim().toLowerCase();

    // Check if already subscribed
    if (subscriptions.has(email)) {
      return NextResponse.json(
        { 
          message: 'You are already subscribed to our newsletter.',
          code: 'ALREADY_SUBSCRIBED'
        },
        { status: 200 }
      );
    }

    // Generate confirmation token
    const confirmationToken = generateConfirmationToken();

    // Store subscription (in production, save to database)
    const subscription: NewsletterSubscription = {
      email,
      subscribedAt: new Date(),
      confirmed: false,
      confirmationToken
    };

    // Add to temporary storage
    subscriptions.add(email);

    // Send confirmation email
    try {
      await sendConfirmationEmail(email, confirmationToken);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      
      // Remove from storage if email failed
      subscriptions.delete(email);
      
      return NextResponse.json(
        { 
          error: 'Failed to send confirmation email. Please try again.',
          code: 'EMAIL_SEND_FAILED'
        },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      { 
        message: 'Thank you for subscribing! Please check your email to confirm your subscription.',
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    return NextResponse.json(
      { 
        error: 'An internal server error occurred. Please try again later.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}

// Handle confirmation (GET request)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const email = searchParams.get('email');

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Invalid confirmation link', code: 'INVALID_PARAMS' },
        { status: 400 }
      );
    }

    // In production, verify token against database
    // For now, just confirm the subscription
    console.log('Newsletter subscription confirmed:', email);

    return NextResponse.json(
      { 
        message: 'Your newsletter subscription has been confirmed!',
        success: true
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter confirmation error:', error);
    
    return NextResponse.json(
      { 
        error: 'An error occurred during confirmation.',
        code: 'CONFIRMATION_ERROR'
      },
      { status: 500 }
    );
  }
}