# Implementation Plan

- [x] 1. Fix typos in spec files
  - Replace all instances of "vantagevarticalltd@gmail.com" with "vantageverticalltd@gmail.com" in spec files
  - Update `.kiro/specs/webapp-cleanup/design.md` to use correct email address
  - Update `.kiro/specs/email-smtp-integration/requirements.md` to use correct email address
  - Update `.kiro/specs/contact-info-update/requirements.md` to use correct email address
  - Update `.kiro/specs/contact-info-update/tasks.md` to use correct email address
  - Update `.kiro/specs/contact-info-update/design.md` to use correct email address
  - _Requirements: 1.1, 1.4_

- [x] 2. Create centralized email configuration
  - Create `src/lib/config/email.ts` with standardized email configuration constants
  - Export EMAIL_CONFIG object with CONTACT_EMAIL, SMTP_FROM, and COMPANY_EMAIL properties
  - Implement environment variable fallbacks with correct default email address
  - _Requirements: 2.1, 2.2_

- [x] 3. Implement email validation utilities
  - Create `src/lib/utils/emailValidation.ts` with email validation functions
  - Implement `validateCompanyEmail()` function to check for correct company email format
  - Implement `getStandardizedEmail()` function to return the correct company email
  - Add typo detection logic for common email address mistakes
  - _Requirements: 3.1, 3.3_

- [x] 4. Update email service to use centralized configuration
  - Modify `src/lib/email/emailService.ts` to import and use EMAIL_CONFIG
  - Replace hardcoded email fallbacks with centralized configuration
  - Add email validation before sending emails
  - Update all email sending methods to use standardized configuration
  - _Requirements: 2.1, 2.3_

- [x] 5. Update email templates to use centralized configuration
  - Modify `src/lib/email/templates/base.ts` to use EMAIL_CONFIG for contactEmail
  - Update template utility functions to reference centralized email configuration
  - Ensure all email templates use consistent email addresses
  - _Requirements: 1.2, 2.1_

- [x] 6. Add validation to email utility functions
  - Update `src/lib/email/utils.ts` to use new validation utilities
  - Replace hardcoded email validation with centralized validation functions
  - Add warning messages for invalid email configurations
  - _Requirements: 3.1, 3.2_

- [x] 7. Create comprehensive test suite for email validation
  - Create `src/lib/utils/__tests__/emailValidation.test.ts` with unit tests
  - Test correct email format validation
  - Test typo detection and correction functionality
  - Test fallback behavior for invalid configurations
  - _Requirements: 3.1, 3.3_

- [x] 8. Add integration tests for email configuration
  - Create `src/lib/config/__tests__/email.test.ts` with configuration tests
  - Test environment variable precedence and fallback behavior
  - Verify centralized configuration returns correct values
  - Test integration with email service components
  - _Requirements: 2.1, 2.2_

- [x] 9. Create spec file validation test
  - Create `src/__tests__/spec-validation/email-consistency.test.ts`
  - Implement test to scan all spec files for email addresses
  - Verify no typos exist in documentation files
  - Ensure consistency across all specification documents
  - _Requirements: 3.1, 3.3_

- [x] 10. Update email service error handling
  - Add email validation safeguards to all email sending methods
  - Implement automatic correction for detected typos
  - Add logging for email validation warnings and corrections
  - Ensure graceful fallback to correct email address
  - _Requirements: 1.1, 3.3_