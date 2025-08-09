import { ContactFormData } from '@/types/forms';
import { generateBaseTemplate, TemplateUtils, BaseTemplateData, EmailTemplate } from './base';
import { serviceOptions, urgencyLevels } from '@/data';

/**
 * Generates contact form email templates for both admin notification and customer confirmation
 * @param formData - Contact form submission data
 * @returns Object containing admin notification and customer confirmation templates
 */
export function generateContactEmails(formData: ContactFormData): {
  adminNotification: EmailTemplate;
  customerConfirmation: EmailTemplate;
} {
  // Get service and urgency labels
  const serviceLabel = serviceOptions.find(s => s.value === formData.service)?.label || formData.service;
  const urgencyLabel = urgencyLevels.find(u => u.value === formData.urgency)?.label || formData.urgency;

  // Generate admin notification email
  const adminNotification = generateAdminNotificationEmail(formData, serviceLabel, urgencyLabel);
  
  // Generate customer confirmation email
  const customerConfirmation = generateCustomerConfirmationEmail(formData, serviceLabel, urgencyLabel);

  return {
    adminNotification,
    customerConfirmation
  };
}

/**
 * Generates the admin notification email template
 * @param formData - Contact form data
 * @param serviceLabel - Human-readable service label
 * @param urgencyLabel - Human-readable urgency label
 * @returns EmailTemplate for admin notification
 */
function generateAdminNotificationEmail(
  formData: ContactFormData,
  serviceLabel: string,
  urgencyLabel: string
): EmailTemplate {
  // Determine urgency color and response time
  const urgencyColor = formData.urgency === 'high' ? '#dc3545' : 
                      formData.urgency === 'medium' ? '#ffc107' : '#28a745';
  const responseTime = formData.urgency === 'high' ? '24-48 hours' : 
                      formData.urgency === 'medium' ? '3-5 days' : '1-2 weeks';

  // Create contact details table
  const contactDetails = TemplateUtils.createTable(
    ['Field', 'Value'],
    [
      ['Name', TemplateUtils.escapeHtml(formData.name)],
      ['Email', `<a href="mailto:${formData.email}" style="color: #dc2626;">${TemplateUtils.escapeHtml(formData.email)}</a>`],
      ['Phone', `<a href="tel:${formData.phone}" style="color: #dc2626;">${TemplateUtils.escapeHtml(formData.phone)}</a>`],
      ['Service', TemplateUtils.escapeHtml(serviceLabel)],
      ['Urgency', `<span style="color: ${urgencyColor}; font-weight: bold;">${TemplateUtils.escapeHtml(urgencyLabel)}</span>`]
    ]
  );

  // Create message content
  const messageContent = `
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #dc2626; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #dc2626;">Customer Message</h3>
      <p style="margin-bottom: 0; white-space: pre-wrap;">${TemplateUtils.escapeHtml(formData.message)}</p>
    </div>
  `;

  // Create response time alert
  const responseAlert = TemplateUtils.createAlert(
    `<strong>Expected Response Time:</strong> ${responseTime}<br>
     <strong>Submitted:</strong> ${TemplateUtils.formatDate(new Date(), { 
       year: 'numeric', 
       month: 'long', 
       day: 'numeric', 
       hour: '2-digit', 
       minute: '2-digit' 
     })}`,
    formData.urgency === 'high' ? 'danger' : formData.urgency === 'medium' ? 'warning' : 'info'
  );

  // Combine content
  const content = `
    <h1>New Contact Form Submission</h1>
    <p>A new contact form has been submitted through the Vantage Vertical website. Please review the details below and respond according to the urgency level.</p>
    
    <h2>Contact Information</h2>
    ${contactDetails}
    
    ${messageContent}
    
    ${responseAlert}
    
    <div style="margin-top: 30px; padding: 15px; background-color: #e7f3ff; border-radius: 5px;">
      <h3 style="margin-top: 0; color: #0c5460;">Next Steps</h3>
      <ul style="margin-bottom: 0;">
        <li>Review the customer's inquiry and service requirements</li>
        <li>Respond within the expected timeframe based on urgency level</li>
        <li>Use the provided contact information to reach out directly</li>
        <li>Consider scheduling a consultation if appropriate</li>
      </ul>
    </div>
  `;

  const template = generateBaseTemplate(content);
  
  return {
    ...template,
    subject: `New ${urgencyLabel} Contact Form Submission - ${serviceLabel}`
  };
}

/**
 * Generates the customer confirmation email template
 * @param formData - Contact form data
 * @param serviceLabel - Human-readable service label
 * @param urgencyLabel - Human-readable urgency label
 * @returns EmailTemplate for customer confirmation
 */
function generateCustomerConfirmationEmail(
  formData: ContactFormData,
  serviceLabel: string,
  urgencyLabel: string
): EmailTemplate {
  const responseTime = formData.urgency === 'high' ? '24-48 hours' : 
                      formData.urgency === 'medium' ? '3-5 days' : '1-2 weeks';

  // Create submission summary
  const submissionSummary = TemplateUtils.createTable(
    ['Detail', 'Information'],
    [
      ['Service Requested', TemplateUtils.escapeHtml(serviceLabel)],
      ['Urgency Level', TemplateUtils.escapeHtml(urgencyLabel)],
      ['Expected Response', responseTime],
      ['Submission Date', TemplateUtils.formatDate(new Date(), { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      })]
    ]
  );

  // Create next steps based on service type
  const nextSteps = getNextStepsForService(formData.service);

  const content = `
    <h1>Thank You for Contacting Vantage Vertical</h1>
    <p>Dear ${TemplateUtils.escapeHtml(formData.name)},</p>
    
    <p>Thank you for reaching out to us regarding our ${serviceLabel.toLowerCase()} services. We have received your inquiry and will respond within ${responseTime} based on the urgency level you specified.</p>
    
    <h2>Your Submission Summary</h2>
    ${submissionSummary}
    
    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #dc2626; margin: 20px 0;">
      <h3 style="margin-top: 0; color: #dc2626;">Your Message</h3>
      <p style="margin-bottom: 0; white-space: pre-wrap; font-style: italic;">"${TemplateUtils.escapeHtml(formData.message)}"</p>
    </div>
    
    <h2>What Happens Next?</h2>
    <div style="background-color: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <ul style="margin-bottom: 0;">
        ${nextSteps.map(step => `<li>${step}</li>`).join('')}
      </ul>
    </div>
    
    <h2>In the Meantime</h2>
    <p>While you wait for our response, feel free to:</p>
    <ul>
      <li>Explore our <a href="https://vantagevartical.com/portfolio" style="color: #dc2626;">portfolio</a> to see examples of our work</li>
      <li>Learn more about our <a href="https://vantagevartical.com/technology" style="color: #dc2626;">drone technology</a></li>
      <li>Check out our <a href="https://vantagevartical.com/training" style="color: #dc2626;">training programs</a></li>
      <li>Follow us on social media for updates and industry insights</li>
    </ul>
    
    ${TemplateUtils.createAlert(
      '<strong>Need immediate assistance?</strong><br>For urgent matters, you can also reach us directly at vantagevarticalltd@gmail.com or call us during business hours.',
      'info'
    )}
    
    <p>We look forward to working with you and helping you achieve your goals with our professional drone services.</p>
    
    <p>Best regards,<br>
    <strong>The Vantage Vertical Team</strong></p>
  `;

  const template = generateBaseTemplate(content, {
    recipientName: formData.name
  });
  
  return {
    ...template,
    subject: `Thank you for contacting Vantage Vertical - We'll respond within ${responseTime}`
  };
}

/**
 * Gets service-specific next steps for the customer
 * @param service - Service type from form
 * @returns Array of next steps
 */
function getNextStepsForService(service: string): string[] {
  const serviceSteps: Record<string, string[]> = {
    'aerial-photography': [
      'Our team will review your photography requirements and location details',
      'We\'ll provide a detailed quote including equipment, crew, and post-processing',
      'We\'ll schedule a consultation to discuss your vision and timeline',
      'Upon agreement, we\'ll coordinate the shoot date and logistics'
    ],
    'surveying-mapping': [
      'We\'ll assess your surveying requirements and site specifications',
      'Our experts will determine the best approach and equipment for your project',
      'We\'ll provide a comprehensive proposal with deliverables and timeline',
      'We\'ll schedule the survey and coordinate with relevant stakeholders'
    ],
    'agricultural-monitoring': [
      'We\'ll evaluate your farm size, crop types, and monitoring needs',
      'Our agricultural specialists will recommend the best monitoring solution',
      'We\'ll provide a customized package with regular monitoring schedules',
      'We\'ll set up data collection and reporting systems for your farm'
    ],
    'inspection-services': [
      'We\'ll review the structures or areas requiring inspection',
      'Our certified inspectors will determine the appropriate inspection methods',
      'We\'ll provide a detailed inspection plan and safety protocols',
      'We\'ll schedule the inspection and deliver comprehensive reports'
    ],
    'training-certification': [
      'We\'ll assess your current skill level and training objectives',
      'Our instructors will recommend the most suitable training program',
      'We\'ll provide course details, schedules, and certification requirements',
      'We\'ll help you register for the next available training session'
    ],
    'equipment-sales': [
      'We\'ll review your equipment needs and budget requirements',
      'Our sales team will recommend the best drone solutions for your use case',
      'We\'ll provide detailed specifications, pricing, and financing options',
      'We\'ll arrange product demonstrations and training if needed'
    ]
  };

  return serviceSteps[service] || [
    'Our team will carefully review your specific requirements',
    'We\'ll prepare a customized proposal tailored to your needs',
    'We\'ll schedule a consultation to discuss your project in detail',
    'We\'ll provide next steps and timeline for your project'
  ];
}

/**
 * Generates a simple contact form email (for backward compatibility)
 * @param formData - Contact form data
 * @returns EmailTemplate for basic contact email
 */
export function generateContactEmail(formData: ContactFormData): EmailTemplate {
  const { adminNotification } = generateContactEmails(formData);
  return adminNotification;
}