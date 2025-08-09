import { EmailTemplate, BaseTemplateData } from './base';
import { generateBaseTemplate, TemplateUtils } from './base';

/**
 * Newsletter subscription data interface
 */
export interface NewsletterSubscriptionData {
  email: string;
  confirmationToken: string;
  subscribedAt: Date;
  confirmed: boolean;
}

/**
 * Newsletter confirmation data interface
 */
export interface NewsletterConfirmationData {
  email: string;
  confirmationToken: string;
  confirmationUrl: string;
}

/**
 * Generates newsletter welcome email template
 * @param data - Newsletter subscription data
 * @param baseData - Base template data (optional, uses defaults if not provided)
 * @returns EmailTemplate with subject, HTML, and text versions
 */
export function generateNewsletterWelcomeEmail(
  data: NewsletterConfirmationData,
  baseData?: Partial<BaseTemplateData>
): EmailTemplate {
  const content = `
    <h1>Welcome to Vantage Vertical!</h1>
    
    <p>Thank you for subscribing to our newsletter. You'll receive updates about:</p>
    
    <ul>
      <li><strong>Latest drone technology and innovations</strong> - Stay ahead with cutting-edge developments</li>
      <li><strong>Agricultural drone solutions and case studies</strong> - Real-world applications and success stories</li>
      <li><strong>Aerial mapping and surveillance insights</strong> - Professional techniques and best practices</li>
      <li><strong>Training program announcements</strong> - New courses and certification opportunities</li>
      <li><strong>Industry news and best practices</strong> - Expert analysis and market trends</li>
    </ul>
    
    <p>To complete your subscription, please click the button below to confirm your email address:</p>
    
    <div class="text-center">
      ${TemplateUtils.createButton('Confirm Subscription', data.confirmationUrl, 'primary')}
    </div>
    
    ${TemplateUtils.createAlert(
      '<strong>Note:</strong> This confirmation link will expire in 24 hours. If you didn\'t subscribe to our newsletter, you can safely ignore this email.',
      'info'
    )}
    
    <p>If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #6c757d; font-size: 14px;">
      <a href="${data.confirmationUrl}">${data.confirmationUrl}</a>
    </p>
    
    ${TemplateUtils.createDivider()}
    
    <h3>What to Expect</h3>
    <p>Our newsletter is sent monthly and includes:</p>
    <ul>
      <li>Featured drone projects and case studies</li>
      <li>Technical tips and tutorials</li>
      <li>Industry insights and market analysis</li>
      <li>Training opportunities and certifications</li>
      <li>Special offers and early access to new services</li>
    </ul>
    
    <p>We respect your privacy and will never share your email address with third parties.</p>
  `;

  const template = generateBaseTemplate(content, {
    unsubscribeUrl: `${process.env.FRONTEND_URL || 'https://vantagevartical.com'}/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}`,
    ...baseData
  });

  return {
    ...template,
    subject: 'Confirm your Vantage Vertical newsletter subscription'
  };
}

/**
 * Generates newsletter subscription confirmation email (after confirmation)
 * @param data - Newsletter subscription data
 * @param baseData - Base template data (optional, uses defaults if not provided)
 * @returns EmailTemplate with subject, HTML, and text versions
 */
export function generateNewsletterConfirmationEmail(
  data: NewsletterSubscriptionData,
  baseData?: Partial<BaseTemplateData>
): EmailTemplate {
  const content = `
    <h1>Subscription Confirmed!</h1>
    
    ${TemplateUtils.createAlert(
      'Your newsletter subscription has been successfully confirmed. Welcome to the Vantage Vertical community!',
      'success'
    )}
    
    <p>Thank you for confirming your subscription to the Vantage Vertical newsletter. You're now part of our community of drone enthusiasts, professionals, and innovators.</p>
    
    <h3>What's Next?</h3>
    <p>Here's what you can expect from us:</p>
    
    <ul>
      <li><strong>Monthly Newsletter:</strong> Delivered on the first Tuesday of each month</li>
      <li><strong>Breaking News:</strong> Important industry updates as they happen</li>
      <li><strong>Exclusive Content:</strong> Subscriber-only insights and resources</li>
      <li><strong>Early Access:</strong> First to know about new services and training programs</li>
    </ul>
    
    ${TemplateUtils.createHighlight(
      '<strong>First Newsletter Coming Soon!</strong> Your first newsletter will arrive within the next few days, featuring our latest projects and upcoming training sessions.'
    )}
    
    <h3>Explore Our Services</h3>
    <p>While you wait for your first newsletter, explore what Vantage Vertical has to offer:</p>
    
    <div class="text-center">
      ${TemplateUtils.createButton('View Our Services', `${process.env.FRONTEND_URL || 'https://vantagevartical.com'}/services`, 'primary')}
      ${TemplateUtils.createButton('Training Programs', `${process.env.FRONTEND_URL || 'https://vantagevartical.com'}/training`, 'secondary')}
    </div>
    
    ${TemplateUtils.createDivider()}
    
    <h3>Connect With Us</h3>
    <p>Stay connected and get the latest updates:</p>
    <ul>
      <li>Visit our website: <a href="${process.env.FRONTEND_URL || 'https://vantagevartical.com'}">${process.env.FRONTEND_URL || 'vantagevartical.com'}</a></li>
      <li>Follow us on social media for daily updates</li>
      <li>Contact us directly for personalized consultations</li>
    </ul>
    
    <p>Thank you for choosing Vantage Vertical for your drone technology needs!</p>
  `;

  const template = generateBaseTemplate(content, {
    unsubscribeUrl: `${process.env.FRONTEND_URL || 'https://vantagevartical.com'}/newsletter/unsubscribe?email=${encodeURIComponent(data.email)}`,
    ...baseData
  });

  return {
    ...template,
    subject: 'Welcome to Vantage Vertical - Subscription Confirmed!'
  };
}

/**
 * Generates admin notification email for new newsletter subscription
 * @param data - Newsletter subscription data
 * @param baseData - Base template data (optional, uses defaults if not provided)
 * @returns EmailTemplate with subject, HTML, and text versions
 */
export function generateNewsletterAdminNotification(
  data: NewsletterSubscriptionData,
  baseData?: Partial<BaseTemplateData>
): EmailTemplate {
  const content = `
    <h1>New Newsletter Subscription</h1>
    
    <p>A new user has subscribed to the Vantage Vertical newsletter.</p>
    
    ${TemplateUtils.createInfoList({
      'Email Address': data.email,
      'Subscription Date': TemplateUtils.formatDate(data.subscribedAt, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }),
      'Status': data.confirmed ? 'Confirmed' : 'Pending Confirmation',
      'Confirmation Token': data.confirmationToken || 'N/A'
    })}
    
    ${data.confirmed 
      ? TemplateUtils.createAlert('This subscription has been confirmed and the user will receive newsletters.', 'success')
      : TemplateUtils.createAlert('This subscription is pending email confirmation.', 'warning')
    }
    
    <h3>Next Steps</h3>
    <ul>
      <li>Add the subscriber to your email marketing platform</li>
      <li>Update your subscriber count metrics</li>
      <li>Consider sending a personalized welcome message</li>
      ${!data.confirmed ? '<li>Monitor for confirmation completion</li>' : ''}
    </ul>
    
    <div class="text-center">
      ${TemplateUtils.createButton('View All Subscribers', `${process.env.FRONTEND_URL || 'https://vantagevartical.com'}/admin/newsletter`, 'primary')}
    </div>
  `;

  const template = generateBaseTemplate(content, baseData);

  return {
    ...template,
    subject: `New Newsletter Subscription - ${data.email}`
  };
}

/**
 * Generates newsletter unsubscribe confirmation email
 * @param email - Email address that unsubscribed
 * @param baseData - Base template data (optional, uses defaults if not provided)
 * @returns EmailTemplate with subject, HTML, and text versions
 */
export function generateNewsletterUnsubscribeEmail(
  email: string,
  baseData?: Partial<BaseTemplateData>
): EmailTemplate {
  const content = `
    <h1>Subscription Cancelled</h1>
    
    ${TemplateUtils.createAlert(
      'Your newsletter subscription has been successfully cancelled.',
      'info'
    )}
    
    <p>We're sorry to see you go! Your email address has been removed from our newsletter mailing list.</p>
    
    <h3>What This Means</h3>
    <ul>
      <li>You will no longer receive our monthly newsletter</li>
      <li>You won't get updates about new services or training programs</li>
      <li>Your email has been permanently removed from our mailing list</li>
    </ul>
    
    <h3>We'd Love Your Feedback</h3>
    <p>If you have a moment, we'd appreciate knowing why you unsubscribed. Your feedback helps us improve our content and services.</p>
    
    <div class="text-center">
      ${TemplateUtils.createButton('Provide Feedback', `${process.env.FRONTEND_URL || 'https://vantagevartical.com'}/feedback?type=unsubscribe`, 'secondary')}
    </div>
    
    ${TemplateUtils.createDivider()}
    
    <h3>Stay Connected</h3>
    <p>Even though you've unsubscribed from our newsletter, you can still:</p>
    <ul>
      <li>Visit our website for the latest updates</li>
      <li>Contact us directly for drone services</li>
      <li>Follow us on social media</li>
      <li>Re-subscribe anytime if you change your mind</li>
    </ul>
    
    <div class="text-center">
      ${TemplateUtils.createButton('Visit Our Website', `${process.env.FRONTEND_URL || 'https://vantagevartical.com'}`, 'outline')}
    </div>
    
    <p>Thank you for being part of the Vantage Vertical community. We hope to serve you again in the future!</p>
  `;

  const template = generateBaseTemplate(content, baseData);

  return {
    ...template,
    subject: 'Newsletter Unsubscription Confirmed - Vantage Vertical'
  };
}

/**
 * Generates all newsletter-related emails
 * @param data - Newsletter subscription data
 * @param confirmationUrl - URL for email confirmation
 * @param baseData - Base template data (optional)
 * @returns Object containing all newsletter email templates
 */
export function generateNewsletterEmails(
  data: NewsletterSubscriptionData,
  confirmationUrl: string,
  baseData?: Partial<BaseTemplateData>
) {
  return {
    welcomeEmail: generateNewsletterWelcomeEmail(
      {
        email: data.email,
        confirmationToken: data.confirmationToken || '',
        confirmationUrl
      },
      baseData
    ),
    confirmationEmail: generateNewsletterConfirmationEmail(data, baseData),
    adminNotification: generateNewsletterAdminNotification(data, baseData),
    unsubscribeEmail: generateNewsletterUnsubscribeEmail(data.email, baseData)
  };
}