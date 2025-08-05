import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { ContactFormData } from '@/types/forms';
import { serviceOptions, urgencyLevels } from '@/data';

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

async function sendNotificationEmail(formData: ContactFormData): Promise<void> {
  // Create transporter (configure with your email service)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Get service label
  const serviceLabel = serviceOptions.find(s => s.value === formData.service)?.label || formData.service;
  const urgencyLabel = urgencyLevels.find(u => u.value === formData.urgency)?.label || formData.urgency;

  // Email content
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #D72638; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">New Contact Form Submission</h1>
        <p style="margin: 5px 0 0 0;">Vantage Vertical Website</p>
      </div>
      
      <div style="padding: 30px; background-color: #f8f9fa;">
        <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #D72638; margin-top: 0;">Contact Details</h2>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Name:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${formData.name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <a href="mailto:${formData.email}" style="color: #D72638;">${formData.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Phone:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <a href="tel:${formData.phone}" style="color: #D72638;">${formData.phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Service:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${serviceLabel}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">Urgency:</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <span style="color: ${formData.urgency === 'high' ? '#dc3545' : formData.urgency === 'medium' ? '#ffc107' : '#28a745'};">
                  ${urgencyLabel}
                </span>
              </td>
            </tr>
          </table>
          
          <h3 style="color: #D72638; margin-top: 25px;">Message</h3>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #D72638;">
            ${formData.message.replace(/\n/g, '<br>')}
          </div>
          
          <div style="margin-top: 25px; padding: 15px; background-color: #e7f3ff; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #666;">
              <strong>Submitted:</strong> ${new Date().toLocaleString()}<br>
              <strong>Response Time:</strong> ${formData.urgency === 'high' ? '24-48 hours' : formData.urgency === 'medium' ? '3-5 days' : '1-2 weeks'}
            </p>
          </div>
        </div>
      </div>
      
      <div style="background-color: #343a40; color: white; padding: 20px; text-align: center; font-size: 14px;">
        <p style="margin: 0;">This email was sent from the Vantage Vertical contact form.</p>
        <p style="margin: 5px 0 0 0;">Please respond promptly based on the urgency level indicated.</p>
      </div>
    </div>
  `;

  const textContent = `
New Contact Form Submission - Vantage Vertical

Contact Details:
Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Service: ${serviceLabel}
Urgency: ${urgencyLabel}

Message:
${formData.message}

Submitted: ${new Date().toLocaleString()}
Response Time: ${formData.urgency === 'high' ? '24-48 hours' : formData.urgency === 'medium' ? '3-5 days' : '1-2 weeks'}
  `;

  // Send email
  await transporter.sendMail({
    from: `"Vantage Vertical Website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: process.env.CONTACT_EMAIL || 'info@vantagevertical.com',
    subject: `New ${urgencyLabel} Contact Form Submission - ${serviceLabel}`,
    text: textContent,
    html: htmlContent,
  });
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

    // Send notification email
    try {
      await sendNotificationEmail(formData);
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      
      // Don't fail the request if email fails, but log it
      // In production, you might want to queue this for retry
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