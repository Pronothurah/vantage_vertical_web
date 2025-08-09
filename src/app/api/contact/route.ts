import { NextRequest, NextResponse } from 'next/server';
import { ContactFormData } from '@/types/forms';
import { serviceOptions, urgencyLevels } from '@/data';
import { emailService } from '@/lib/email/emailService';
import { generateContactEmails } from '@/lib/email/templates/contact';
import { EmailErrorType } from '@/lib/email/types';

// Rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per window

// Spam protection keywords
const SPAM_KEYWORDS = [
  'viagra', 'casino', 'lottery', 'winner', 'congratulations',
  'click here', 'free money', 'make money fast', 'work from home',
  'weight loss', 'crypto', 'bitcoin', 'investment opportunity'
];

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

function checkRateLimit(clientIP: string): boolean {
  const now = Date.now();
  const clientData = rateLimitStore.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    // Reset or initialize rate limit for this IP
    rateLimitStore.set(clientIP, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }
  
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  // Increment count
  clientData.count++;
  rateLimitStore.set(clientIP, clientData);
  return true;
}

function detectSpam(message: string, name: string, email: string): boolean {
  const textToCheck = `${message} ${name} ${email}`.toLowerCase();
  
  // Check for spam keywords
  const hasSpamKeywords = SPAM_KEYWORDS.some(keyword => 
    textToCheck.includes(keyword.toLowerCase())
  );
  
  // Check for excessive links
  const linkCount = (textToCheck.match(/https?:\/\//g) || []).length;
  const hasExcessiveLinks = linkCount > 2;
  
  // Check for excessive capitalization
  const capsRatio = (message.match(/[A-Z]/g) || []).length / message.length;
  const hasExcessiveCaps = capsRatio > 0.5 && message.length > 20;
  
  // Check for suspicious patterns
  const hasSuspiciousPatterns = /(.)\1{4,}/.test(message); // Repeated characters
  
  return hasSpamKeywords || hasExcessiveLinks || hasExcessiveCaps || hasSuspiciousPatterns;
}

function validateContactData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Required fields validation
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }
  
  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(data.email)) {
      errors.push('Please provide a valid email address');
    }
  }
  
  if (!data.phone || typeof data.phone !== 'string') {
    errors.push('Phone number is required');
  } else {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(data.phone.replace(/[\s\-\(\)]/g, ''))) {
      errors.push('Please provide a valid phone number');
    }
  }
  
  if (!data.service || typeof data.service !== 'string') {
    errors.push('Please select a service');
  } else {
    const validServices = serviceOptions.map(s => s.value);
    if (!validServices.includes(data.service)) {
      errors.push('Please select a valid service');
    }
  }
  
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push('Message is required and must be at least 10 characters');
  }
  
  if (!data.urgency || typeof data.urgency !== 'string') {
    errors.push('Please select urgency level');
  } else {
    const validUrgencies = urgencyLevels.map(u => u.value);
    if (!validUrgencies.includes(data.urgency)) {
      errors.push('Please select a valid urgency level');
    }
  }
  
  // Length validations
  if (data.name && data.name.length > 50) {
    errors.push('Name must be less than 50 characters');
  }
  
  if (data.message && data.message.length > 1000) {
    errors.push('Message must be less than 1000 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Sends contact form emails using the shared EmailService
 * @param formData - Contact form submission data
 * @returns Promise with email results
 */
async function sendContactEmails(formData: ContactFormData): Promise<{
  adminResult: { success: boolean; error?: any };
  customerResult: { success: boolean; error?: any };
}> {
  try {
    // Generate email templates using the shared template system
    const { adminNotification, customerConfirmation } = generateContactEmails(formData);

    // Send admin notification email
    const adminResult = await emailService.sendEmail({
      to: process.env.CONTACT_EMAIL || 'vantagevarticalltd@gmail.com',
      subject: adminNotification.subject,
      html: adminNotification.html,
      text: adminNotification.text,
    });

    // Send customer confirmation email
    const customerResult = await emailService.sendEmail({
      to: formData.email,
      subject: customerConfirmation.subject,
      html: customerConfirmation.html,
      text: customerConfirmation.text,
    });

    return {
      adminResult: {
        success: adminResult.success,
        error: adminResult.error
      },
      customerResult: {
        success: customerResult.success,
        error: customerResult.error
      }
    };
  } catch (error) {
    console.error('Error generating or sending contact emails:', error);
    return {
      adminResult: { success: false, error },
      customerResult: { success: false, error }
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request);
    
    // Check rate limit
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Please wait before submitting another form.',
          code: 'RATE_LIMIT_EXCEEDED'
        },
        { status: 429 }
      );
    }

    // Parse request body
    let formData: ContactFormData;
    try {
      formData = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON data', code: 'INVALID_JSON' },
        { status: 400 }
      );
    }

    // Validate form data
    const validation = validateContactData(formData);
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Validation failed',
          details: validation.errors,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    // Spam detection
    if (detectSpam(formData.message, formData.name, formData.email)) {
      // Log spam attempt but don't reveal to user
      console.warn('Spam detected from IP:', clientIP, 'Data:', {
        name: formData.name,
        email: formData.email,
        message: formData.message.substring(0, 100)
      });
      
      // Return success to avoid revealing spam detection
      return NextResponse.json(
        { 
          message: 'Thank you for your message. We will get back to you soon.',
          success: true
        },
        { status: 200 }
      );
    }

    // Send contact form emails asynchronously for better performance
    let queueIds;
    try {
      // Use async email processing to avoid blocking user response
      queueIds = await emailService.sendContactEmailsAsync(
        formData,
        (results) => {
          // Log email results for monitoring (processed in background)
          console.log('Contact form email processing completed:', {
            adminEmailSuccess: results.adminResult.success,
            customerEmailSuccess: results.customerResult.success,
            adminEmailError: results.adminResult.error?.message,
            customerEmailError: results.customerResult.error?.message,
            timestamp: new Date().toISOString()
          });
          
          // Check if both emails failed due to configuration issues
          if (!results.adminResult.success && !results.customerResult.success) {
            const adminError = results.adminResult.error;
            const customerError = results.customerResult.error;
            
            if (adminError?.type === EmailErrorType.CONFIGURATION_ERROR || 
                customerError?.type === EmailErrorType.CONFIGURATION_ERROR) {
              console.warn('Email service not configured properly for contact form');
            }
          }
        }
      );
      
      console.log('Contact form emails queued for processing:', {
        adminQueueId: queueIds.adminQueueId,
        customerQueueId: queueIds.customerQueueId,
        formData: {
          name: formData.name,
          email: formData.email,
          service: formData.service,
          urgency: formData.urgency
        }
      });
      
    } catch (emailError) {
      console.error('Failed to queue contact form emails:', emailError);
      
      // Continue with success response even if email queueing fails
      // This ensures user experience is not blocked by email issues
      queueIds = null;
    }

    // Return success response
    return NextResponse.json(
      { 
        message: 'Thank you for your message. We will get back to you soon.',
        success: true,
        urgency: formData.urgency
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Contact form API error:', error);
    
    return NextResponse.json(
      { 
        error: 'An internal server error occurred. Please try again later.',
        code: 'INTERNAL_ERROR'
      },
      { status: 500 }
    );
  }
}