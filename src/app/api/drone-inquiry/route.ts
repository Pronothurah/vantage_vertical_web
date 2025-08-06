import { NextRequest, NextResponse } from 'next/server';

interface DroneInquiryData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  droneId: string;
  inquiryType: 'purchase' | 'quote' | 'bulk' | 'consultation';
  quantity: number;
  budget: string;
  timeline: string;
  intendedUse: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  trainingNeeded: boolean;
  financingInterest: boolean;
  message: string;
}

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email notifications
    // 3. Integrate with CRM
    // 4. Send confirmation email to customer

    // For now, we'll simulate the process
    console.log('Drone Inquiry Received:', {
      ...data,
      timestamp: new Date().toISOString(),
      source: 'website'
    });

    // Simulate email sending (replace with actual email service)
    const emailContent = generateInquiryEmail(data);
    console.log('Email content generated:', emailContent);

    // In a real implementation, you would:
    // await sendEmail({
    //   to: 'sales@vantagevertical.co.ke',
    //   subject: `New Drone Inquiry - ${data.inquiryType}`,
    //   html: emailContent.adminEmail
    // });
    //
    // await sendEmail({
    //   to: data.email,
    //   subject: 'Thank you for your drone inquiry - Vantage Vertical',
    //   html: emailContent.customerEmail
    // });

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
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateInquiryEmail(data: DroneInquiryData) {
  const inquiryTypeLabels = {
    purchase: 'Ready to Purchase',
    quote: 'Price Quote Request',
    bulk: 'Bulk Order Inquiry',
    consultation: 'Free Consultation Request'
  };

  const budgetLabels = {
    'under-200k': 'Under KES 200,000',
    '200k-500k': 'KES 200,000 - 500,000',
    '500k-1m': 'KES 500,000 - 1,000,000',
    '1m-2m': 'KES 1,000,000 - 2,000,000',
    'above-2m': 'Above KES 2,000,000',
    'flexible': 'Flexible based on value'
  };

  const timelineLabels = {
    'immediate': 'Immediate (1-2 weeks)',
    'short': 'Short term (1 month)',
    'medium': 'Medium term (2-3 months)',
    'long': 'Long term (3+ months)',
    'planning': 'Just planning/researching'
  };

  const adminEmail = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #D72638; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">New Drone Inquiry</h1>
            <p style="margin: 5px 0 0 0;">Vantage Vertical Sales Lead</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; margin: 20px 0;">
            <h2 style="color: #D72638; margin-top: 0;">Inquiry Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 30%;">Inquiry Type:</td>
                <td style="padding: 8px 0;">${inquiryTypeLabels[data.inquiryType]}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Drone Model:</td>
                <td style="padding: 8px 0;">${data.droneId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Quantity:</td>
                <td style="padding: 8px 0;">${data.quantity}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Budget Range:</td>
                <td style="padding: 8px 0;">${data.budget ? budgetLabels[data.budget as keyof typeof budgetLabels] || data.budget : 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Timeline:</td>
                <td style="padding: 8px 0;">${data.timeline ? timelineLabels[data.timeline as keyof typeof timelineLabels] || data.timeline : 'Not specified'}</td>
              </tr>
            </table>
          </div>

          <div style="background: white; padding: 20px; border: 1px solid #ddd;">
            <h2 style="color: #D72638; margin-top: 0;">Customer Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 30%;">Name:</td>
                <td style="padding: 8px 0;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0;"><a href="mailto:${data.email}">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                <td style="padding: 8px 0;"><a href="tel:${data.phone}">${data.phone}</a></td>
              </tr>
              ${data.company ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Company:</td>
                <td style="padding: 8px 0;">${data.company}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold;">Experience:</td>
                <td style="padding: 8px 0;">${data.experience.charAt(0).toUpperCase() + data.experience.slice(1)}</td>
              </tr>
            </table>
          </div>

          <div style="background: white; padding: 20px; border: 1px solid #ddd; margin-top: 20px;">
            <h3 style="color: #D72638; margin-top: 0;">Intended Use</h3>
            <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #D72638; margin: 0;">
              ${data.intendedUse}
            </p>
            
            ${data.message ? `
            <h3 style="color: #D72638;">Additional Information</h3>
            <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #D72638; margin: 0;">
              ${data.message}
            </p>
            ` : ''}
          </div>

          <div style="background: #f0f8ff; padding: 20px; margin: 20px 0; border-left: 4px solid #007bff;">
            <h3 style="color: #007bff; margin-top: 0;">Additional Services Requested</h3>
            <ul style="margin: 0; padding-left: 20px;">
              <li>Training Needed: ${data.trainingNeeded ? 'Yes' : 'No'}</li>
              <li>Financing Interest: ${data.financingInterest ? 'Yes' : 'No'}</li>
            </ul>
          </div>

          <div style="background: #D72638; color: white; padding: 15px; text-align: center; margin-top: 30px;">
            <p style="margin: 0;">
              <strong>Action Required:</strong> Please respond to this inquiry within 24 hours
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const customerEmail = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #D72638; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Thank You for Your Inquiry</h1>
            <p style="margin: 5px 0 0 0;">Vantage Vertical - Professional Drone Services</p>
          </div>
          
          <div style="padding: 30px 20px;">
            <p>Dear ${data.name},</p>
            
            <p>Thank you for your interest in our drone solutions. We have received your inquiry for <strong>${data.droneId}</strong> and our sales team will contact you within 24 hours.</p>
            
            <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #D72638; margin: 20px 0;">
              <h3 style="color: #D72638; margin-top: 0;">Your Inquiry Summary</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Inquiry Type:</strong> ${inquiryTypeLabels[data.inquiryType]}</li>
                <li><strong>Drone Model:</strong> ${data.droneId}</li>
                <li><strong>Quantity:</strong> ${data.quantity}</li>
                ${data.budget ? `<li><strong>Budget Range:</strong> ${budgetLabels[data.budget as keyof typeof budgetLabels] || data.budget}</li>` : ''}
                ${data.timeline ? `<li><strong>Timeline:</strong> ${timelineLabels[data.timeline as keyof typeof timelineLabels] || data.timeline}</li>` : ''}
              </ul>
            </div>

            <div style="background: #e8f5e8; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0;">
              <h3 style="color: #28a745; margin-top: 0;">What Happens Next?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Our sales expert will contact you within 24 hours</li>
                <li>Free consultation to understand your specific needs</li>
                <li>Personalized recommendations and pricing</li>
                <li>KCAA compliance assistance and documentation</li>
                <li>Training and support options discussion</li>
                <li>Flexible payment terms and financing options</li>
              </ul>
            </div>

            <div style="background: #fff3cd; padding: 20px; border-left: 4px solid #ffc107; margin: 20px 0;">
              <h3 style="color: #856404; margin-top: 0;">Why Choose Vantage Vertical?</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>KCAA certified and compliant operations</li>
                <li>Expert consultation and ongoing support</li>
                <li>Comprehensive training programs</li>
                <li>Local service and maintenance</li>
                <li>Flexible financing options</li>
                <li>5+ years of industry experience</li>
              </ul>
            </div>

            <p>If you have any immediate questions, please don't hesitate to contact us:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <p style="margin: 5px 0;"><strong>Phone:</strong> <a href="tel:+254700000000" style="color: #D72638;">+254 700 000 000</a></p>
              <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:sales@vantagevertical.co.ke" style="color: #D72638;">sales@vantagevertical.co.ke</a></p>
              <p style="margin: 5px 0;"><strong>Website:</strong> <a href="https://vantagevertical.co.ke" style="color: #D72638;">www.vantagevertical.co.ke</a></p>
            </div>

            <p>Thank you for choosing Vantage Vertical for your drone needs.</p>
            
            <p>Best regards,<br>
            <strong>Vantage Vertical Sales Team</strong><br>
            Professional Drone Services Kenya</p>
          </div>

          <div style="background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #dee2e6;">
            <p style="margin: 0; font-size: 12px; color: #6c757d;">
              This email was sent from Vantage Vertical. If you have any questions, please contact us at sales@vantagevertical.co.ke
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return {
    adminEmail,
    customerEmail
  };
}