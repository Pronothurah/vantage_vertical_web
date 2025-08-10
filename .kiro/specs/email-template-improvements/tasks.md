# Implementation Plan

- [x] 1. Fix base email template configuration
  - Update `DEFAULT_COMPANY_DATA` in `src/lib/email/templates/base.ts` to use correct domain (vantagevertical.co.ke instead of vantagevartical.com)
  - Replace phone number placeholder `+254 XXX XXX XXX` with actual phone number `+254704277687`
  - Ensure `contactEmail` uses the standardized email address from EMAIL_CONFIG
  - Add logo selection utility functions for different background contexts
  - _Requirements: 1.1, 1.4, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4_

- [x] 2. Create logo URL utility functions
  - Implement `getLogoUrl()` function in `src/lib/email/templates/base.ts` to select appropriate logo based on background
  - Create `LOGO_CONFIG` constant with correct URLs for default and white logo variants
  - Add validation function to ensure logo URLs use correct domain
  - Update logo HTML generation to include proper alt text and email-optimized styling
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 6.1, 6.4_

- [x] 3. Update drone inquiry email templates
  - Replace hardcoded logo URLs in `src/lib/email/templates/droneInquiry.ts` with base template configuration
  - Update `generateDroneInquiryAdminEmail()` to use `generateBaseTemplate()` for consistent branding
  - Update `generateDroneInquiryCustomerEmail()` to use `generateBaseTemplate()` for consistent branding
  - Ensure contact information uses standardized phone number and email address
  - _Requirements: 1.1, 1.4, 2.1, 2.2, 4.3_

- [x] 4. Verify and update contact form email templates
  - Review `src/lib/email/templates/contact.ts` to ensure it properly inherits from base configuration
  - Verify that both admin notification and customer confirmation emails use correct logo and contact info
  - Update any hardcoded contact information to use base template configuration
  - Test email generation with updated base configuration
  - _Requirements: 2.1, 2.2, 2.4, 4.1_

- [x] 5. Verify and update enrollment email templates
  - Review `src/lib/email/templates/enrollment.ts` to ensure it properly inherits from base configuration
  - Verify that both admin notification and student confirmation emails use correct logo and contact info
  - Update any hardcoded contact information to use base template configuration
  - Ensure training-related emails display consistent branding
  - _Requirements: 2.1, 2.2, 2.4, 4.2_

- [x] 6. Update newsletter email templates (if exists)
  - Review `src/lib/email/templates/newsletter.ts` for any hardcoded logo or contact information
  - Update newsletter templates to use base template configuration
  - Ensure newsletter emails use consistent branding and contact information
  - Test newsletter email generation with updated configuration
  - _Requirements: 2.1, 2.2, 2.4, 4.4_

- [-] 7. Add email template validation functions
  - Create `validateTemplateData()` enhancement in `src/lib/email/templates/base.ts` to check logo URL domain
  - Add `validateContactInfo()` function to verify phone number and email format
  - Implement logo URL accessibility check for testing purposes
  - Add validation to prevent future use of incorrect domains or contact information
  - _Requirements: 3.5, 5.2, 6.1, 6.2_

- [ ] 8. Create comprehensive email template tests
  - Create test file `src/lib/email/templates/__tests__/base-config.test.ts` to verify base configuration
  - Test that logo URLs use correct domain (vantagevertical.co.ke)
  - Test that contact information uses correct phone number and email
  - Test logo selection utility functions for different backgrounds
  - Verify template inheritance works correctly across all email types
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 9. Update email template integration tests
  - Update existing email service tests to verify correct logo and contact information
  - Test contact form email generation with updated configuration
  - Test enrollment email generation with updated configuration
  - Test drone inquiry email generation with updated configuration
  - Verify that all email types render correctly with new branding
  - _Requirements: 5.1, 5.2, 5.4, 5.5_

- [ ] 10. Optimize email template HTML for email clients
  - Update logo HTML generation in `src/lib/email/templates/base.ts` with email-optimized attributes
  - Add proper width/height attributes for better email client compatibility
  - Implement fallback text for when images are blocked
  - Ensure responsive design works across different email clients
  - Add proper alt text for accessibility compliance
  - _Requirements: 1.5, 5.3, 5.5, 6.1, 6.3, 6.4_