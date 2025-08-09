import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email/emailService';
import { generateNewsletterEmails, NewsletterSubscriptionData } from '@/lib/email/templates/newsletter';
import { EmailErrorType } from '@/lib/email/types';

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

/**
 * Sends newsletter confirmation email using shared EmailService
 * @param subscriptionData - Newsletter subscription data
 * @returns Promise<{ success: boolean, error?: string }>
 */
async function sendNewsletterEmails(subscriptionData: NewsletterSubscriptionData): Promise<{ success: boolean, error?: string }> {
  try {
    // Check if email service is configured
    const serviceStatus = emailService.getStatus();
    if (!serviceStatus.isConfigured) {
      console.log('Email service not configured. Skipping email send for:', subscriptionData.email);
      console.log('Confirmation token would be:', subscriptionData.confirmationToken);
      return { success: true }; // Return success to not block the subscription process
    }

    // Generate confirmation URL
    const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/newsletter/confirm?token=${subscriptionData.confirmationToken}&email=${encodeURIComponent(subscriptionData.email)}`;

    // Generate email templates
    const { welcomeEmail, adminNotification } = generateNewsletterEmails(
      subscriptionData,
      confirmationUrl
    );

    // Send welcome email to subscriber
    const welcomeResult = await emailService.sendEmail({
      to: subscriptionData.email,
      subject: welcomeEmail.subject,
      html: welcomeEmail.html,
      text: welcomeEmail.text,
    });

    if (!welcomeResult.success) {
      console.error('Failed to send newsletter welcome email:', welcomeResult.error);
      return { 
        success: false, 
        error: welcomeResult.error?.type === EmailErrorType.CONFIGURATION_ERROR 
          ? 'Email service configuration error' 
          : 'Failed to send confirmation email' 
      };
    }

    // Send admin notification (don't fail if this fails)
    try {
      const adminResult = await emailService.sendEmail({
        to: process.env.CONTACT_EMAIL || 'vantagevarticalltd@gmail.com',
        subject: adminNotification.subject,
        html: adminNotification.html,
        text: adminNotification.text,
      });

      if (!adminResult.success) {
        console.warn('Failed to send newsletter admin notification:', adminResult.error);
      }
    } catch (adminError) {
      console.warn('Admin notification failed, but continuing:', adminError);
    }

    return { success: true };

  } catch (error) {
    console.error('Newsletter email sending failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown email error' 
    };
  }
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
    const subscriptionData: NewsletterSubscriptionData = {
      email,
      subscribedAt: new Date(),
      confirmed: false,
      confirmationToken
    };

    // Add to temporary storage
    subscriptions.add(email);

    // Send newsletter emails asynchronously for better performance
    let queueIds;
    try {
      // Generate confirmation URL
      const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/newsletter/confirm?token=${confirmationToken}&email=${encodeURIComponent(email)}`;
      
      // Use async email processing to avoid blocking user response
      queueIds = await emailService.sendNewsletterEmailsAsync(
        subscriptionData,
        confirmationUrl,
        (results) => {
          // Log email results for monitoring (processed in background)
          console.log('Newsletter email processing completed:', {
            email,
            welcomeEmailSuccess: results.welcomeResult.success,
            adminEmailSuccess: results.adminResult?.success,
            welcomeEmailError: results.welcomeResult.error?.message,
            adminEmailError: results.adminResult?.error?.message,
            timestamp: new Date().toISOString()
          });
          
          // If welcome email failed, we might want to remove from subscriptions
          if (!results.welcomeResult.success) {
            console.warn('Newsletter welcome email failed, subscription may need manual follow-up:', email);
          }
        }
      );
      
      console.log('Newsletter emails queued for processing:', {
        email,
        welcomeQueueId: queueIds.welcomeQueueId,
        adminQueueId: queueIds.adminQueueId,
        confirmationToken
      });
      
    } catch (emailError) {
      console.error('Failed to queue newsletter emails:', emailError);
      
      // Remove from storage if email queueing failed
      subscriptions.delete(email);
      
      return NextResponse.json(
        { 
          error: 'Failed to process newsletter subscription. Please try again.',
          code: 'EMAIL_QUEUE_FAILED'
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

    // Validate email format
    const validation = validateEmail(email);
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Invalid email address', code: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // In production, verify token against database and update confirmation status
    // For now, just confirm the subscription
    console.log('Newsletter subscription confirmed:', normalizedEmail);

    // Send confirmation email using shared EmailService
    try {
      const serviceStatus = emailService.getStatus();
      if (serviceStatus.isConfigured) {
        const subscriptionData: NewsletterSubscriptionData = {
          email: normalizedEmail,
          subscribedAt: new Date(),
          confirmed: true,
          confirmationToken: token
        };

        const { confirmationEmail } = generateNewsletterEmails(
          subscriptionData,
          '' // No confirmation URL needed for this email
        );

        const confirmationResult = await emailService.sendEmail({
          to: normalizedEmail,
          subject: confirmationEmail.subject,
          html: confirmationEmail.html,
          text: confirmationEmail.text,
        });

        if (!confirmationResult.success) {
          console.warn('Failed to send newsletter confirmation email:', confirmationResult.error);
          // Don't fail the confirmation process if email fails
        }
      } else {
        console.log('Email service not configured. Skipping confirmation email for:', normalizedEmail);
      }
    } catch (emailError) {
      console.warn('Newsletter confirmation email failed, but continuing:', emailError);
      // Don't fail the confirmation process if email fails
    }

    return NextResponse.json(
      { 
        message: 'Your newsletter subscription has been confirmed! Welcome to Vantage Vertical.',
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