import { EmailTemplate } from '../types';
import { DroneInquiryData } from '@/types/forms';

/**
 * Generates admin notification email for drone inquiries
 * @param data - Drone inquiry form data
 * @returns EmailTemplate - Admin notification email template
 */
export function generateDroneInquiryAdminEmail(data: DroneInquiryData): EmailTemplate {
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

  const subject = `New Drone Inquiry - ${inquiryTypeLabels[data.inquiryType]} - ${data.droneId}`;

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: #D72638; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <img src="https://vantagevertical.co.ke/vantage-logo-white.jpg" alt="Vantage Vertical Logo" style="height: 60px; margin-bottom: 10px;" />
            <h1 style="margin: 0; font-size: 24px;">New Drone Inquiry</h1>
            <p style="margin: 5px 0 0 0; font-size: 16px;">Vantage Vertical Sales Lead</p>
          </div>
          
          <!-- Inquiry Details -->
          <div style="background: #f9f9f9; padding: 20px; margin: 0; border-left: 4px solid #D72638;">
            <h2 style="color: #D72638; margin-top: 0; font-size: 20px;">Inquiry Details</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 30%; vertical-align: top;">Inquiry Type:</td>
                <td style="padding: 8px 0; vertical-align: top;">${inquiryTypeLabels[data.inquiryType]}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Drone Model:</td>
                <td style="padding: 8px 0; vertical-align: top;">${data.droneId}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Quantity:</td>
                <td style="padding: 8px 0; vertical-align: top;">${data.quantity}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Budget Range:</td>
                <td style="padding: 8px 0; vertical-align: top;">${data.budget ? budgetLabels[data.budget as keyof typeof budgetLabels] || data.budget : 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Timeline:</td>
                <td style="padding: 8px 0; vertical-align: top;">${data.timeline ? timelineLabels[data.timeline as keyof typeof timelineLabels] || data.timeline : 'Not specified'}</td>
              </tr>
            </table>
          </div>

          <!-- Customer Information -->
          <div style="background: white; padding: 20px; border: 1px solid #ddd; margin: 20px 0;">
            <h2 style="color: #D72638; margin-top: 0; font-size: 20px;">Customer Information</h2>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; font-weight: bold; width: 30%; vertical-align: top;">Name:</td>
                <td style="padding: 8px 0; vertical-align: top;">${data.name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Email:</td>
                <td style="padding: 8px 0; vertical-align: top;"><a href="mailto:${data.email}" style="color: #D72638; text-decoration: none;">${data.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Phone:</td>
                <td style="padding: 8px 0; vertical-align: top;"><a href="tel:${data.phone}" style="color: #D72638; text-decoration: none;">${data.phone}</a></td>
              </tr>
              ${data.company ? `
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Company:</td>
                <td style="padding: 8px 0; vertical-align: top;">${data.company}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Experience:</td>
                <td style="padding: 8px 0; vertical-align: top;">${data.experience.charAt(0).toUpperCase() + data.experience.slice(1)}</td>
              </tr>
            </table>
          </div>

          <!-- Intended Use -->
          <div style="background: white; padding: 20px; border: 1px solid #ddd; margin-top: 0;">
            <h3 style="color: #D72638; margin-top: 0; font-size: 18px;">Intended Use</h3>
            <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #D72638; margin: 0; font-size: 14px; line-height: 1.5;">
              ${data.intendedUse}
            </p>
            
            ${data.message ? `
            <h3 style="color: #D72638; margin-top: 20px; font-size: 18px;">Additional Information</h3>
            <p style="background: #f9f9f9; padding: 15px; border-left: 4px solid #D72638; margin: 0; font-size: 14px; line-height: 1.5;">
              ${data.message}
            </p>
            ` : ''}
          </div>

          <!-- Additional Services -->
          <div style="background: #e8f4fd; padding: 20px; margin: 20px 0; border-left: 4px solid #007bff; border-radius: 4px;">
            <h3 style="color: #007bff; margin-top: 0; font-size: 18px;">Additional Services Requested</h3>
            <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
              <li style="margin-bottom: 5px;">Training Needed: <strong>${data.trainingNeeded ? 'Yes' : 'No'}</strong></li>
              <li>Financing Interest: <strong>${data.financingInterest ? 'Yes' : 'No'}</strong></li>
            </ul>
          </div>

          <!-- Action Required -->
          <div style="background: #D72638; color: white; padding: 15px; text-align: center; margin-top: 30px; border-radius: 4px;">
            <p style="margin: 0; font-size: 16px; font-weight: bold;">
              ⚡ Action Required: Please respond to this inquiry within 24 hours
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #dee2e6; margin-top: 20px; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 12px; color: #6c757d;">
              This email was generated automatically from the Vantage Vertical website contact form.<br>
              Timestamp: ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
NEW DRONE INQUIRY - ${inquiryTypeLabels[data.inquiryType]}

INQUIRY DETAILS:
- Inquiry Type: ${inquiryTypeLabels[data.inquiryType]}
- Drone Model: ${data.droneId}
- Quantity: ${data.quantity}
- Budget Range: ${data.budget ? budgetLabels[data.budget as keyof typeof budgetLabels] || data.budget : 'Not specified'}
- Timeline: ${data.timeline ? timelineLabels[data.timeline as keyof typeof timelineLabels] || data.timeline : 'Not specified'}

CUSTOMER INFORMATION:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}
${data.company ? `- Company: ${data.company}` : ''}
- Experience: ${data.experience.charAt(0).toUpperCase() + data.experience.slice(1)}

INTENDED USE:
${data.intendedUse}

${data.message ? `ADDITIONAL INFORMATION:
${data.message}` : ''}

ADDITIONAL SERVICES:
- Training Needed: ${data.trainingNeeded ? 'Yes' : 'No'}
- Financing Interest: ${data.financingInterest ? 'Yes' : 'No'}

ACTION REQUIRED: Please respond to this inquiry within 24 hours.

---
This email was generated automatically from the Vantage Vertical website.
Timestamp: ${new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })}
  `;

  return { subject, html, text };
}

/**
 * Generates customer acknowledgment email for drone inquiries
 * @param data - Drone inquiry form data
 * @returns EmailTemplate - Customer acknowledgment email template
 */
export function generateDroneInquiryCustomerEmail(data: DroneInquiryData): EmailTemplate {
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

  const subject = `Thank you for your drone inquiry - Vantage Vertical`;

  const html = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
          <!-- Header -->
          <div style="background: #D72638; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <img src="https://vantagevertical.co.ke/vantage-logo-white.jpg" alt="Vantage Vertical Logo" style="height: 60px; margin-bottom: 10px;" />
            <h1 style="margin: 0; font-size: 24px;">Thank You for Your Inquiry</h1>
            <p style="margin: 5px 0 0 0; font-size: 16px;">Vantage Vertical - Professional Drone Services</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 30px 20px;">
            <p style="font-size: 16px; margin-bottom: 20px;">Dear ${data.name},</p>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Thank you for your interest in our drone solutions. We have received your inquiry for <strong>${data.droneId}</strong> and our sales team will contact you within 24 hours.
            </p>
            
            <!-- Inquiry Summary -->
            <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #D72638; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #D72638; margin-top: 0; font-size: 18px;">Your Inquiry Summary</h3>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                <li style="margin-bottom: 8px;"><strong>Inquiry Type:</strong> ${inquiryTypeLabels[data.inquiryType]}</li>
                <li style="margin-bottom: 8px;"><strong>Drone Model:</strong> ${data.droneId}</li>
                <li style="margin-bottom: 8px;"><strong>Quantity:</strong> ${data.quantity}</li>
                ${data.budget ? `<li style="margin-bottom: 8px;"><strong>Budget Range:</strong> ${budgetLabels[data.budget as keyof typeof budgetLabels] || data.budget}</li>` : ''}
                ${data.timeline ? `<li style="margin-bottom: 8px;"><strong>Timeline:</strong> ${timelineLabels[data.timeline as keyof typeof timelineLabels] || data.timeline}</li>` : ''}
              </ul>
            </div>

            <!-- What Happens Next -->
            <div style="background: #e8f5e8; padding: 20px; border-left: 4px solid #28a745; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #28a745; margin-top: 0; font-size: 18px;">What Happens Next?</h3>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                <li style="margin-bottom: 8px;">Our sales expert will contact you within 24 hours</li>
                <li style="margin-bottom: 8px;">Free consultation to understand your specific needs</li>
                <li style="margin-bottom: 8px;">Personalized recommendations and pricing</li>
                <li style="margin-bottom: 8px;">KCAA compliance assistance and documentation</li>
                <li style="margin-bottom: 8px;">Training and support options discussion</li>
                <li>Flexible payment terms and financing options</li>
              </ul>
            </div>

            <!-- Why Choose Vantage Vertical -->
            <div style="background: #fff3cd; padding: 20px; border-left: 4px solid #ffc107; margin: 20px 0; border-radius: 4px;">
              <h3 style="color: #856404; margin-top: 0; font-size: 18px;">Why Choose Vantage Vertical?</h3>
              <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
                <li style="margin-bottom: 8px;">KCAA certified and compliant operations</li>
                <li style="margin-bottom: 8px;">Expert consultation and ongoing support</li>
                <li style="margin-bottom: 8px;">Comprehensive training programs</li>
                <li style="margin-bottom: 8px;">Local service and maintenance</li>
                <li style="margin-bottom: 8px;">Flexible financing options</li>
                <li>5+ years of industry experience</li>
              </ul>
            </div>

            <p style="font-size: 16px; line-height: 1.6; margin: 20px 0;">
              If you have any immediate questions, please don't hesitate to contact us:
            </p>
            
            <!-- Contact Information -->
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 4px;">
              <p style="margin: 5px 0; font-size: 16px;"><strong>Phone:</strong> <a href="tel:+254704277687" style="color: #D72638; text-decoration: none;">+254 704 277 687</a></p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Email:</strong> <a href="mailto:vantagevarticalltd@gmail.com" style="color: #D72638; text-decoration: none;">vantagevarticalltd@gmail.com</a></p>
              <p style="margin: 5px 0; font-size: 16px;"><strong>Website:</strong> <a href="https://vantagevertical.co.ke" style="color: #D72638; text-decoration: none;">www.vantagevertical.co.ke</a></p>
            </div>

            <p style="font-size: 16px; line-height: 1.6; margin: 20px 0;">
              Thank you for choosing Vantage Vertical for your drone needs.
            </p>
            
            <p style="font-size: 16px; margin-top: 30px;">
              Best regards,<br>
              <strong>Vantage Vertical Sales Team</strong><br>
              <span style="color: #666; font-size: 14px;">Professional Drone Services Kenya</span>
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #dee2e6; margin-top: 20px; border-radius: 0 0 8px 8px;">
            <p style="margin: 0; font-size: 12px; color: #6c757d;">
              This email was sent from Vantage Vertical. If you have any questions, please contact us at vantagevarticalltd@gmail.com<br>
              You received this email because you submitted an inquiry on our website.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Thank you for your drone inquiry - Vantage Vertical

Dear ${data.name},

Thank you for your interest in our drone solutions. We have received your inquiry for ${data.droneId} and our sales team will contact you within 24 hours.

YOUR INQUIRY SUMMARY:
- Inquiry Type: ${inquiryTypeLabels[data.inquiryType]}
- Drone Model: ${data.droneId}
- Quantity: ${data.quantity}
${data.budget ? `- Budget Range: ${budgetLabels[data.budget as keyof typeof budgetLabels] || data.budget}` : ''}
${data.timeline ? `- Timeline: ${timelineLabels[data.timeline as keyof typeof timelineLabels] || data.timeline}` : ''}

WHAT HAPPENS NEXT?
- Our sales expert will contact you within 24 hours
- Free consultation to understand your specific needs
- Personalized recommendations and pricing
- KCAA compliance assistance and documentation
- Training and support options discussion
- Flexible payment terms and financing options

WHY CHOOSE VANTAGE VERTICAL?
- KCAA certified and compliant operations
- Expert consultation and ongoing support
- Comprehensive training programs
- Local service and maintenance
- Flexible financing options
- 5+ years of industry experience

If you have any immediate questions, please don't hesitate to contact us:

Phone: +254 704 277 687
Email: vantagevarticalltd@gmail.com
Website: www.vantagevertical.co.ke

Thank you for choosing Vantage Vertical for your drone needs.

Best regards,
Vantage Vertical Sales Team
Professional Drone Services Kenya

---
This email was sent from Vantage Vertical. If you have any questions, please contact us at vantagevarticalltd@gmail.com
You received this email because you submitted an inquiry on our website.
  `;

  return { subject, html, text };
}