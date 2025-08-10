import { 
  generateNewsletterWelcomeEmail,
  generateNewsletterConfirmationEmail,
  generateNewsletterAdminNotification,
  generateNewsletterUnsubscribeEmail,
  generateNewsletterEmails,
  NewsletterSubscriptionData,
  NewsletterConfirmationData
} from '../newsletter';

describe('Newsletter Email Templates', () => {
  const mockSubscriptionData: NewsletterSubscriptionData = {
    email: 'subscriber@example.com',
    confirmationToken: 'test-token-123',
    subscribedAt: new Date('2024-01-15T10:00:00Z'),
    confirmed: true
  };

  const mockConfirmationData: NewsletterConfirmationData = {
    email: 'subscriber@example.com',
    confirmationToken: 'test-token-123',
    confirmationUrl: 'https://vantagevertical.co.ke/newsletter/confirm?token=test-token-123'
  };

  describe('generateNewsletterWelcomeEmail', () => {
    it('should generate welcome email with correct branding and contact info', () => {
      const template = generateNewsletterWelcomeEmail(mockConfirmationData);

      // Check that template is generated
      expect(template).toHaveProperty('html');
      expect(template).toHaveProperty('text');
      expect(template).toHaveProperty('subject');

      // Check subject line
      expect(template.subject).toContain('Confirm your Vantage Vertical newsletter subscription');

      // Check HTML content
      expect(template.html).toContain('Welcome to Vantage Vertical!');
      expect(template.html).toContain('Thank you for subscribing');
      expect(template.html).toContain('Confirm Subscription');
      expect(template.html).toContain(mockConfirmationData.confirmationUrl);

      // Check that it uses base template (should contain company branding)
      expect(template.html).toContain('Vantage Vertical');
      expect(template.html).toContain('vantagevertical.co.ke');
      expect(template.html).toContain('+254704277687'); // Correct phone number from base config
      expect(template.html).toContain('vantageverticalltd@gmail.com'); // Correct email from base config

      // Check text version
      expect(template.text).toContain('Welcome to Vantage Vertical');
      expect(template.text).toContain('Vantage Vertical');
      expect(template.text).toContain('+254704277687');
      expect(template.text).toContain('vantageverticalltd@gmail.com');
    });

    it('should include unsubscribe URL', () => {
      const template = generateNewsletterWelcomeEmail(mockConfirmationData);

      expect(template.html).toContain('unsubscribe');
      expect(template.html).toContain(`email=${encodeURIComponent(mockConfirmationData.email)}`);
    });

    it('should include newsletter content description', () => {
      const template = generateNewsletterWelcomeEmail(mockConfirmationData);

      expect(template.html).toContain('Latest drone technology');
      expect(template.html).toContain('Agricultural drone solutions');
      expect(template.html).toContain('Aerial mapping and surveillance');
      expect(template.html).toContain('Training program announcements');
      expect(template.html).toContain('Industry news and best practices');
    });

    it('should include confirmation expiry notice', () => {
      const template = generateNewsletterWelcomeEmail(mockConfirmationData);

      expect(template.html).toContain('24 hours');
      expect(template.html).toContain('expire');
    });
  });

  describe('generateNewsletterConfirmationEmail', () => {
    it('should generate confirmation email with correct branding and contact info', () => {
      const template = generateNewsletterConfirmationEmail(mockSubscriptionData);

      // Check that template is generated
      expect(template).toHaveProperty('html');
      expect(template).toHaveProperty('text');
      expect(template).toHaveProperty('subject');

      // Check subject line
      expect(template.subject).toContain('Welcome to Vantage Vertical - Subscription Confirmed!');

      // Check HTML content
      expect(template.html).toContain('Subscription Confirmed!');
      expect(template.html).toContain('successfully confirmed');
      expect(template.html).toContain('Welcome to the Vantage Vertical community');

      // Check that it uses base template (should contain company branding)
      expect(template.html).toContain('Vantage Vertical');
      expect(template.html).toContain('vantagevertical.co.ke');
      expect(template.html).toContain('+254704277687'); // Correct phone number from base config
      expect(template.html).toContain('vantageverticalltd@gmail.com'); // Correct email from base config

      // Check text version
      expect(template.text).toContain('Subscription Confirmed');
      expect(template.text).toContain('Vantage Vertical');
      expect(template.text).toContain('+254704277687');
      expect(template.text).toContain('vantageverticalltd@gmail.com');
    });

    it('should include what to expect information', () => {
      const template = generateNewsletterConfirmationEmail(mockSubscriptionData);

      expect(template.html).toContain('What\'s Next?');
      expect(template.html).toContain('Monthly Newsletter');
      expect(template.html).toContain('first Tuesday of each month');
      expect(template.html).toContain('Breaking News');
      expect(template.html).toContain('Exclusive Content');
      expect(template.html).toContain('Early Access');
    });

    it('should include service exploration buttons', () => {
      const template = generateNewsletterConfirmationEmail(mockSubscriptionData);

      expect(template.html).toContain('View Our Services');
      expect(template.html).toContain('Training Programs');
      expect(template.html).toContain('https://vantagevertical.co.ke/services');
      expect(template.html).toContain('https://vantagevertical.co.ke/training');
    });

    it('should include unsubscribe URL', () => {
      const template = generateNewsletterConfirmationEmail(mockSubscriptionData);

      expect(template.html).toContain('unsubscribe');
      expect(template.html).toContain(`email=${encodeURIComponent(mockSubscriptionData.email)}`);
    });
  });

  describe('generateNewsletterAdminNotification', () => {
    it('should generate admin notification with correct branding and contact info', () => {
      const template = generateNewsletterAdminNotification(mockSubscriptionData);

      // Check that template is generated
      expect(template).toHaveProperty('html');
      expect(template).toHaveProperty('text');
      expect(template).toHaveProperty('subject');

      // Check subject line
      expect(template.subject).toContain('New Newsletter Subscription');
      expect(template.subject).toContain(mockSubscriptionData.email);

      // Check HTML content
      expect(template.html).toContain('New Newsletter Subscription');
      expect(template.html).toContain(mockSubscriptionData.email);
      expect(template.html).toContain(mockSubscriptionData.confirmationToken);
      expect(template.html).toContain('Confirmed'); // Since confirmed is true

      // Check that it uses base template (should contain company branding)
      expect(template.html).toContain('Vantage Vertical');
      expect(template.html).toContain('vantagevertical.co.ke');
      expect(template.html).toContain('+254704277687'); // Correct phone number from base config
      expect(template.html).toContain('vantageverticalltd@gmail.com'); // Correct email from base config

      // Check text version
      expect(template.text).toContain('New Newsletter Subscription');
      expect(template.text).toContain('Vantage Vertical');
      expect(template.text).toContain('+254704277687');
      expect(template.text).toContain('vantageverticalltd@gmail.com');
    });

    it('should handle unconfirmed subscriptions', () => {
      const unconfirmedData = { ...mockSubscriptionData, confirmed: false };
      const template = generateNewsletterAdminNotification(unconfirmedData);

      expect(template.html).toContain('Pending Confirmation');
      expect(template.html).toContain('pending email confirmation');
      expect(template.html).toContain('Monitor for confirmation completion');
    });

    it('should include admin action buttons', () => {
      const template = generateNewsletterAdminNotification(mockSubscriptionData);

      expect(template.html).toContain('View All Subscribers');
      expect(template.html).toContain('https://vantagevertical.co.ke/admin/newsletter');
    });

    it('should format subscription date correctly', () => {
      const template = generateNewsletterAdminNotification(mockSubscriptionData);

      expect(template.html).toContain('January');
      expect(template.html).toContain('15');
      expect(template.html).toContain('2024');
    });
  });

  describe('generateNewsletterUnsubscribeEmail', () => {
    it('should generate unsubscribe email with correct branding and contact info', () => {
      const email = 'unsubscriber@example.com';
      const template = generateNewsletterUnsubscribeEmail(email);

      // Check that template is generated
      expect(template).toHaveProperty('html');
      expect(template).toHaveProperty('text');
      expect(template).toHaveProperty('subject');

      // Check subject line
      expect(template.subject).toContain('Newsletter Unsubscription Confirmed');
      expect(template.subject).toContain('Vantage Vertical');

      // Check HTML content
      expect(template.html).toContain('Subscription Cancelled');
      expect(template.html).toContain('successfully cancelled');
      expect(template.html).toContain('sorry to see you go');

      // Check that it uses base template (should contain company branding)
      expect(template.html).toContain('Vantage Vertical');
      expect(template.html).toContain('vantagevertical.co.ke');
      expect(template.html).toContain('+254704277687'); // Correct phone number from base config
      expect(template.html).toContain('vantageverticalltd@gmail.com'); // Correct email from base config

      // Check text version
      expect(template.text).toContain('Subscription Cancelled');
      expect(template.text).toContain('Vantage Vertical');
      expect(template.text).toContain('+254704277687');
      expect(template.text).toContain('vantageverticalltd@gmail.com');
    });

    it('should include feedback request', () => {
      const template = generateNewsletterUnsubscribeEmail('test@example.com');

      expect(template.html).toContain('We\'d Love Your Feedback');
      expect(template.html).toContain('Provide Feedback');
      expect(template.html).toContain('https://vantagevertical.co.ke/feedback?type=unsubscribe');
    });

    it('should include stay connected options', () => {
      const template = generateNewsletterUnsubscribeEmail('test@example.com');

      expect(template.html).toContain('Stay Connected');
      expect(template.html).toContain('Visit our website');
      expect(template.html).toContain('Contact us directly');
      expect(template.html).toContain('Re-subscribe anytime');
      expect(template.html).toContain('Visit Our Website');
    });
  });

  describe('generateNewsletterEmails', () => {
    it('should generate all newsletter email types', () => {
      const confirmationUrl = 'https://vantagevertical.co.ke/newsletter/confirm?token=test-token-123';
      const emails = generateNewsletterEmails(mockSubscriptionData, confirmationUrl);

      expect(emails).toHaveProperty('welcomeEmail');
      expect(emails).toHaveProperty('confirmationEmail');
      expect(emails).toHaveProperty('adminNotification');
      expect(emails).toHaveProperty('unsubscribeEmail');

      // Verify all emails are properly generated
      expect(emails.welcomeEmail.subject).toContain('Confirm your Vantage Vertical newsletter subscription');
      expect(emails.confirmationEmail.subject).toContain('Welcome to Vantage Vertical - Subscription Confirmed!');
      expect(emails.adminNotification.subject).toContain('New Newsletter Subscription');
      expect(emails.unsubscribeEmail.subject).toContain('Newsletter Unsubscription Confirmed');

      // Verify all use correct branding
      Object.values(emails).forEach(email => {
        expect(email.html).toContain('vantagevertical.co.ke');
        expect(email.html).toContain('+254704277687');
        expect(email.html).toContain('vantageverticalltd@gmail.com');
      });
    });
  });

  describe('Logo and Contact Information Consistency', () => {
    it('should use correct logo URL from base template', () => {
      const welcomeTemplate = generateNewsletterWelcomeEmail(mockConfirmationData);
      const confirmationTemplate = generateNewsletterConfirmationEmail(mockSubscriptionData);
      const adminTemplate = generateNewsletterAdminNotification(mockSubscriptionData);
      const unsubscribeTemplate = generateNewsletterUnsubscribeEmail('test@example.com');

      // All templates should use the correct domain
      [welcomeTemplate, confirmationTemplate, adminTemplate, unsubscribeTemplate].forEach(template => {
        expect(template.html).toContain('vantagevertical.co.ke/vantage-logo.png');
        // Should NOT contain the incorrect domain
        expect(template.html).not.toContain('vantagevartical.com');
      });
    });

    it('should use standardized contact information', () => {
      const welcomeTemplate = generateNewsletterWelcomeEmail(mockConfirmationData);
      const confirmationTemplate = generateNewsletterConfirmationEmail(mockSubscriptionData);
      const adminTemplate = generateNewsletterAdminNotification(mockSubscriptionData);
      const unsubscribeTemplate = generateNewsletterUnsubscribeEmail('test@example.com');

      // All templates should use the same standardized contact info
      [welcomeTemplate, confirmationTemplate, adminTemplate, unsubscribeTemplate].forEach(template => {
        expect(template.html).toContain('+254704277687');
        expect(template.html).toContain('vantageverticalltd@gmail.com');
        expect(template.html).toContain('vantagevertical.co.ke');
      });
    });

    it('should not contain any hardcoded incorrect contact information', () => {
      const welcomeTemplate = generateNewsletterWelcomeEmail(mockConfirmationData);
      const confirmationTemplate = generateNewsletterConfirmationEmail(mockSubscriptionData);
      const adminTemplate = generateNewsletterAdminNotification(mockSubscriptionData);
      const unsubscribeTemplate = generateNewsletterUnsubscribeEmail('test@example.com');

      // Should not contain placeholder phone number or wrong domain
      [welcomeTemplate, confirmationTemplate, adminTemplate, unsubscribeTemplate].forEach(template => {
        expect(template.html).not.toContain('+254 XXX XXX XXX');
        expect(template.html).not.toContain('vantagevartical.com'); // Wrong domain
      });
    });

    it('should generate valid HTML and text versions', () => {
      const welcomeTemplate = generateNewsletterWelcomeEmail(mockConfirmationData);
      const confirmationTemplate = generateNewsletterConfirmationEmail(mockSubscriptionData);

      // Both templates should have HTML and text versions
      [welcomeTemplate, confirmationTemplate].forEach(template => {
        expect(template.html).toBeTruthy();
        expect(template.text).toBeTruthy();

        // HTML should contain proper structure
        expect(template.html).toContain('<!DOCTYPE html PUBLIC');
        expect(template.html).toContain('<html');
        expect(template.html).toContain('</html>');

        // Text versions should contain key information without HTML tags
        expect(template.text).toContain('Vantage Vertical');
        expect(template.text).not.toContain('<html>');
        expect(template.text).not.toContain('<div>');
      });
    });

    it('should include correct website URLs in all links', () => {
      const confirmationTemplate = generateNewsletterConfirmationEmail(mockSubscriptionData);

      // All links should use correct domain
      expect(confirmationTemplate.html).toContain('https://vantagevertical.co.ke/services');
      expect(confirmationTemplate.html).toContain('https://vantagevertical.co.ke/training');
      
      // Should not contain the incorrect domain in any links
      expect(confirmationTemplate.html).not.toContain('vantagevartical.com');
    });
  });
});