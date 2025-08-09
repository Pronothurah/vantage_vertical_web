import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email/emailService';
import { isValidEmail } from '@/lib/email/utils';

/**
 * POST /api/email-test
 * Test endpoint for async email functionality
 */
export async function POST(request: NextRequest) {
  try {
    const { 
      testType, 
      email, 
      priority = 'normal',
      count = 1 
    } = await request.json();

    // Validate inputs
    if (!testType || !email) {
      return NextResponse.json(
        { error: 'testType and email are required' },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (count > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 test emails allowed' },
        { status: 400 }
      );
    }

    const results: string[] = [];

    switch (testType) {
      case 'simple':
        // Test simple async email
        for (let i = 0; i < count; i++) {
          const timestamp = new Date().toISOString();
          const queueId = await emailService.sendEmailAsync(
            {
              to: email,
              subject: `Test Email ${i + 1}/${count} - ${timestamp}`,
              html: `
                <h2>Async Email Test</h2>
                <p>This is test email ${i + 1} of ${count}.</p>
                <p>Sent at: ${timestamp}</p>
                <p>Priority: ${priority}</p>
                <p>Queue ID will be assigned after queueing</p>
              `,
              text: `
                Async Email Test
                
                This is test email ${i + 1} of ${count}.
                Sent at: ${timestamp}
                Priority: ${priority}
                Queue ID will be assigned after queueing
              `
            },
            priority as 'high' | 'normal' | 'low',
            (result) => {
              console.log(`Test email processed:`, {
                success: result.success,
                messageId: result.messageId,
                error: result.error?.message
              });
            }
          );
          
          results.push(queueId);
        }
        break;

      case 'contact':
        // Test contact form async emails
        const contactQueueIds = await emailService.sendContactEmailsAsync(
          {
            name: 'Test User',
            email: email,
            phone: '+254700000000',
            service: 'aerial-photography',
            message: 'This is a test contact form submission for async email testing.',
            urgency: 'low'
          },
          (results) => {
            console.log('Test contact form emails processed:', {
              adminSuccess: results.adminResult.success,
              customerSuccess: results.customerResult.success
            });
          }
        );
        
        results.push(contactQueueIds.adminQueueId, contactQueueIds.customerQueueId);
        break;

      case 'drone_inquiry':
        // Test drone inquiry async emails
        const droneQueueIds = await emailService.sendDroneInquiryEmailsAsync(
          {
            name: 'Test Customer',
            email: email,
            phone: '+254700000000',
            droneId: 'test-drone-001',
            inquiryType: 'quote',
            quantity: 1,
            budget: '50000-100000',
            timeline: '1-2 weeks',
            intendedUse: 'Testing async email functionality',
            experience: 'beginner',
            trainingNeeded: true,
            financingInterest: false,
            message: 'This is a test drone inquiry for async email testing.'
          },
          (results) => {
            console.log('Test drone inquiry emails processed:', {
              adminSuccess: results.adminResult.success,
              customerSuccess: results.customerResult.success
            });
          }
        );
        
        results.push(droneQueueIds.adminQueueId, droneQueueIds.customerQueueId);
        break;

      case 'enrollment':
        // Test enrollment async emails
        const enrollmentQueueIds = await emailService.sendEnrollmentEmailsAsync(
          {
            name: 'Test Student',
            email: email,
            phone: '+254700000000',
            program: 'basic-drone-training',
            session: 'morning',
            experience: 'beginner',
            motivation: 'Testing async email functionality for enrollment system.',
            accommodation: false,
            terms: true
          },
          (results) => {
            console.log('Test enrollment emails processed:', {
              adminSuccess: results.adminResult.success,
              studentSuccess: results.studentResult.success
            });
          }
        );
        
        results.push(enrollmentQueueIds.adminQueueId, enrollmentQueueIds.studentQueueId);
        break;

      case 'newsletter':
        // Test newsletter async emails
        const newsletterQueueIds = await emailService.sendNewsletterEmailsAsync(
          {
            email: email,
            subscribedAt: new Date(),
            confirmed: false,
            confirmationToken: 'test-token-' + Date.now()
          },
          'http://localhost:3000/newsletter/confirm?token=test-token&email=' + encodeURIComponent(email),
          (results) => {
            console.log('Test newsletter emails processed:', {
              welcomeSuccess: results.welcomeResult.success,
              adminSuccess: results.adminResult?.success
            });
          }
        );
        
        results.push(newsletterQueueIds.welcomeQueueId);
        if (newsletterQueueIds.adminQueueId) {
          results.push(newsletterQueueIds.adminQueueId);
        }
        break;

      case 'performance':
        // Test performance with multiple emails
        const performanceCount = Math.min(count, 5); // Limit for performance test
        const performancePromises = [];
        
        for (let i = 0; i < performanceCount; i++) {
          const promise = emailService.sendEmailAsync(
            {
              to: email,
              subject: `Performance Test ${i + 1}/${performanceCount} - ${new Date().toISOString()}`,
              html: `
                <h2>Performance Test Email</h2>
                <p>This is performance test email ${i + 1} of ${performanceCount}.</p>
                <p>Queued at: ${new Date().toISOString()}</p>
                <p>Testing async email queue performance and rate limiting.</p>
              `,
              text: `Performance Test Email ${i + 1}/${performanceCount} queued at ${new Date().toISOString()}`
            },
            'normal'
          );
          
          performancePromises.push(promise);
        }
        
        const performanceResults = await Promise.all(performancePromises);
        results.push(...performanceResults);
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid test type. Supported: simple, contact, drone_inquiry, enrollment, newsletter, performance' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: `${testType} email test initiated successfully`,
      testType,
      email,
      priority,
      count,
      queueIds: results,
      timestamp: new Date().toISOString(),
      note: 'Emails are being processed asynchronously. Check email-status endpoint for queue progress.'
    });

  } catch (error) {
    console.error('Email test error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to initiate email test',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/email-test
 * Returns available test types and usage information
 */
export async function GET() {
  return NextResponse.json({
    message: 'Email Test API',
    availableTests: {
      simple: 'Send simple test email(s)',
      contact: 'Test contact form email flow',
      drone_inquiry: 'Test drone inquiry email flow',
      enrollment: 'Test training enrollment email flow',
      newsletter: 'Test newsletter subscription email flow',
      performance: 'Test email queue performance with multiple emails'
    },
    usage: {
      method: 'POST',
      body: {
        testType: 'string (required) - One of the available test types',
        email: 'string (required) - Valid email address to send test emails to',
        priority: 'string (optional) - high, normal, or low (default: normal)',
        count: 'number (optional) - Number of emails to send for simple/performance tests (max: 10, default: 1)'
      }
    },
    examples: [
      {
        description: 'Simple test email',
        body: {
          testType: 'simple',
          email: 'test@example.com',
          priority: 'normal'
        }
      },
      {
        description: 'Performance test with 5 emails',
        body: {
          testType: 'performance',
          email: 'test@example.com',
          count: 5
        }
      },
      {
        description: 'Contact form test',
        body: {
          testType: 'contact',
          email: 'test@example.com'
        }
      }
    ],
    monitoring: {
      status: '/api/email-status - Check queue status and metrics',
      logs: 'Check server console for email processing logs'
    }
  });
}