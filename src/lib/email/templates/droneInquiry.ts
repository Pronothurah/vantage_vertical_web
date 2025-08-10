import { EmailTemplate } from '../types';
import { DroneInquiryData } from '../../../types/forms';
import { EMAIL_CONFIG } from '../../config/email';
import { generateBaseTemplate, TemplateUtils } from './base';

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

  // Create inquiry details table
  const inquiryDetailsTable = TemplateUtils.createTable(
    ['Field', 'Value'],
    [
      ['Inquiry Type', inquiryTypeLabels[data.inquiryType]],
      ['Drone Model', data.droneId],
      ['Quantity', data.quantity.toString()],
      ['Budget Range', data.budget ? budgetLabels[data.budget as keyof typeof budgetLabels] || data.budget : 'Not specified'],
      ['Timeline', data.timeline ? timelineLabels[data.timeline as keyof typeof timelineLabels] || data.timeline : 'Not specified']
    ]
  );

  // Create customer information table
  const customerInfo = [
    ['Name', TemplateUtils.escapeHtml(data.name)],
    ['Email', `<a href="mailto:${data.email}">${TemplateUtils.escapeHtml(data.email)}</a>`],
    ['Phone', `<a href="tel:${data.phone}">${TemplateUtils.escapeHtml(data.phone)}</a>`],
    ...(data.company ? [['Company', TemplateUtils.escapeHtml(data.company)]] : []),
    ['Experience', data.experience.charAt(0).toUpperCase() + data.experience.slice(1)]
  ];
  const customerInfoTable = TemplateUtils.createTable(['Field', 'Value'], customerInfo);

  // Build content HTML
  const content = `
    <h1>New Drone Inquiry</h1>
    <p><strong>Sales Lead Alert:</strong> A new drone inquiry has been submitted and requires your attention.</p>
    
    ${TemplateUtils.createAlert('⚡ Action Required: Please respond to this inquiry within 24 hours', 'warning')}
    
    <h2>Inquiry Details</h2>
    ${inquiryDetailsTable}
    
    <h2>Customer Information</h2>
    ${customerInfoTable}
    
    <h2>Intended Use</h2>
    ${TemplateUtils.createHighlight(TemplateUtils.escapeHtml(data.intendedUse))}
    
    ${data.message ? `
    <h2>Additional Information</h2>
    ${TemplateUtils.createHighlight(TemplateUtils.escapeHtml(data.message))}
    ` : ''}
    
    <h2>Additional Services Requested</h2>
    <ul>
      <li><strong>Training Needed:</strong> ${data.trainingNeeded ? 'Yes' : 'No'}</li>
      <li><strong>Financing Interest:</strong> ${data.financingInterest ? 'Yes' : 'No'}</li>
    </ul>
    
    ${TemplateUtils.createDivider()}
    
    <p class="text-center" style="font-size: 12px; color: #6c757d;">
      This email was generated automatically from the Vantage Vertical website.<br>
      Timestamp: ${TemplateUtils.formatDate(new Date(), { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Africa/Nairobi'
      })}
    </p>
  `;

  // Generate the email using base template
  const baseTemplate = generateBaseTemplate(content, {
    recipientName: 'Sales Team'
  });

  return {
    subject,
    html: baseTemplate.html,
    text: baseTemplate.text
  };
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

  // Create inquiry summary list
  const inquirySummaryItems = {
    'Inquiry Type': inquiryTypeLabels[data.inquiryType],
    'Drone Model': data.droneId,
    'Quantity': data.quantity.toString(),
    ...(data.budget && { 'Budget Range': budgetLabels[data.budget as keyof typeof budgetLabels] || data.budget }),
    ...(data.timeline && { 'Timeline': timelineLabels[data.timeline as keyof typeof timelineLabels] || data.timeline })
  };

  // Build content HTML
  const content = `
    <h1>Thank You for Your Inquiry</h1>
    <p>Dear ${TemplateUtils.escapeHtml(data.name)},</p>
    
    <p>Thank you for your interest in our drone solutions. We have received your inquiry for <strong>${TemplateUtils.escapeHtml(data.droneId)}</strong> and our sales team will contact you within 24 hours.</p>
    
    <h2>Your Inquiry Summary</h2>
    ${TemplateUtils.createInfoList(inquirySummaryItems)}
    
    ${TemplateUtils.createAlert(`
      <h3>What Happens Next?</h3>
      <ul>
        <li>Our sales expert will contact you within 24 hours</li>
        <li>Free consultation to understand your specific needs</li>
        <li>Personalized recommendations and pricing</li>
        <li>KCAA compliance assistance and documentation</li>
        <li>Training and support options discussion</li>
        <li>Flexible payment terms and financing options</li>
      </ul>
    `, 'success')}
    
    ${TemplateUtils.createAlert(`
      <h3>Why Choose Vantage Vertical?</h3>
      <ul>
        <li>KCAA certified and compliant operations</li>
        <li>Expert consultation and ongoing support</li>
        <li>Comprehensive training programs</li>
        <li>Local service and maintenance</li>
        <li>Flexible financing options</li>
        <li>5+ years of industry experience</li>
      </ul>
    `, 'info')}
    
    <p>If you have any immediate questions, please don't hesitate to contact us using the information below.</p>
    
    <p>Thank you for choosing Vantage Vertical for your drone needs.</p>
    
    <p>
      Best regards,<br>
      <strong>Vantage Vertical Sales Team</strong><br>
      <em>Professional Drone Services Kenya</em>
    </p>
    
    ${TemplateUtils.createDivider()}
    
    <p class="text-center" style="font-size: 12px; color: #6c757d;">
      You received this email because you submitted an inquiry on our website.<br>
      If you have any questions, please contact us at ${EMAIL_CONFIG.CONTACT_EMAIL}
    </p>
  `;

  // Generate the email using base template
  const baseTemplate = generateBaseTemplate(content, {
    recipientName: data.name
  });

  return {
    subject,
    html: baseTemplate.html,
    text: baseTemplate.text
  };
}