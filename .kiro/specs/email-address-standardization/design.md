# Design Document

## Overview

This design addresses the critical email delivery issue caused by inconsistent email addresses across the codebase. The primary problem is the typo "vantagevarticalltd@gmail.com" (missing 'e' in "vertical") appearing in several spec files, which causes email delivery failures. The correct email address "vantageverticalltd@gmail.com" is already properly used in most of the active codebase.

## Architecture

### Current State Analysis

**Correct Usage (Active Codebase):**
- Most production files use the correct "vantageverticalltd@gmail.com"
- Environment files (.env, .env.example) have correct addresses
- Email service implementations use correct addresses
- Frontend components display correct addresses

**Problematic Areas:**
- Spec files contain the typo "vantagevarticalltd@gmail.com"
- Some spec files reference this incorrect address in requirements and design documents

### Solution Architecture

The solution follows a three-tier approach:

1. **Immediate Fix**: Correct typos in existing spec files
2. **Validation Layer**: Add email format validation to prevent future issues
3. **Centralization**: Ensure all email references use centralized configuration

## Components and Interfaces

### 1. Email Configuration Centralization

**Current Configuration Sources:**
- Environment variables (CONTACT_EMAIL, SMTP_FROM)
- Hardcoded values in components and templates
- Default fallbacks in email service

**Standardized Configuration:**
```typescript
// src/lib/config/email.ts
export const EMAIL_CONFIG = {
  CONTACT_EMAIL: process.env.CONTACT_EMAIL || 'vantageverticalltd@gmail.com',
  SMTP_FROM: process.env.SMTP_FROM || 'vantageverticalltd@gmail.com',
  COMPANY_EMAIL: 'vantageverticalltd@gmail.com'
} as const;
```

### 2. Email Validation Utility

**Validation Function:**
```typescript
// src/lib/utils/emailValidation.ts
export function validateCompanyEmail(email: string): boolean {
  const VALID_COMPANY_EMAIL = 'vantageverticalltd@gmail.com';
  return email === VALID_COMPANY_EMAIL;
}

export function getStandardizedEmail(): string {
  return 'vantageverticalltd@gmail.com';
}
```

### 3. Spec File Updates

**Files Requiring Correction:**
- `.kiro/specs/webapp-cleanup/design.md`
- `.kiro/specs/email-smtp-integration/requirements.md`
- `.kiro/specs/contact-info-update/requirements.md`
- `.kiro/specs/contact-info-update/tasks.md`
- `.kiro/specs/contact-info-update/design.md`

## Data Models

### Email Configuration Model

```typescript
interface EmailConfig {
  contactEmail: string;
  smtpFrom: string;
  companyEmail: string;
}

interface EmailValidationResult {
  isValid: boolean;
  correctedEmail?: string;
  errors: string[];
}
```

## Error Handling

### Validation Errors

1. **Invalid Email Format**: Return clear error message with correct format
2. **Typo Detection**: Suggest correct email when common typos are detected
3. **Configuration Missing**: Provide fallback to standard company email

### Runtime Safeguards

```typescript
// Email service safeguard
function ensureValidEmail(email: string): string {
  if (!validateCompanyEmail(email)) {
    console.warn(`Invalid company email detected: ${email}, using standard email`);
    return getStandardizedEmail();
  }
  return email;
}
```

## Testing Strategy

### 1. Unit Tests

**Email Validation Tests:**
- Test correct email format validation
- Test typo detection and correction
- Test fallback behavior

**Configuration Tests:**
- Verify centralized configuration returns correct values
- Test environment variable precedence
- Validate default fallbacks

### 2. Integration Tests

**Email Service Tests:**
- Verify all email sends use correct address
- Test email template rendering with correct addresses
- Validate admin notification recipients

### 3. Spec File Validation Tests

**Content Validation:**
- Scan all spec files for email addresses
- Verify no typos exist in documentation
- Ensure consistency across all specs

### 4. Regression Tests

**Email Delivery Tests:**
- Test actual email delivery to correct address
- Verify no bounced emails from typos
- Validate SMTP configuration uses correct sender

## Implementation Approach

### Phase 1: Immediate Fixes
1. Correct typos in all spec files
2. Update any remaining hardcoded incorrect addresses
3. Verify environment configuration

### Phase 2: Validation Implementation
1. Create email validation utilities
2. Add validation to email service
3. Implement configuration centralization

### Phase 3: Testing & Verification
1. Add comprehensive test coverage
2. Validate email delivery functionality
3. Create monitoring for future issues

## Security Considerations

- Email addresses are not sensitive but consistency is critical for delivery
- Validation prevents accidental typos that could cause delivery failures
- Centralized configuration reduces risk of inconsistencies

## Performance Impact

- Minimal performance impact from validation
- Centralized configuration may slightly improve performance by reducing redundant environment variable reads
- Email delivery reliability improvement outweighs any minor overhead