# Design Document

## Overview

This design document outlines the systematic approach to fixing email template issues across the Vantage Vertical website. The primary focus is on correcting logo display problems, standardizing contact information, and ensuring consistent branding across all email communications. The solution will update the base email template configuration and propagate changes to all specific email templates.

## Architecture

### Current State Analysis

**Logo Issues Identified:**
- Base template uses incorrect domain: `https://vantagevartical.com/vantage-logo.png` (missing 'e' in vertical)
- Drone inquiry templates use correct domain but inconsistent paths
- Some templates may have broken logo references

**Contact Information Issues:**
- Phone number placeholder: `+254 XXX XXX XXX` in base template
- Need to ensure all templates use: `+254704277687`
- Need to ensure all templates use: `vantageverticalltd@gmail.com`

**Current Template Structure:**
```
src/lib/email/templates/
├── base.ts (core configuration and utilities)
├── contact.ts (contact form emails)
├── enrollment.ts (training enrollment emails)
├── droneInquiry.ts (drone inquiry emails)
└── newsletter.ts (newsletter emails)
```

### Solution Architecture

The solution follows a centralized configuration approach:

1. **Base Template Updates**: Fix core configuration in `base.ts`
2. **Template Inheritance**: Ensure all templates inherit corrected base configuration
3. **Validation Layer**: Add checks to prevent future inconsistencies
4. **Testing Framework**: Verify templates render correctly across email clients

## Components and Interfaces

### 1. Base Template Configuration Updates

**File**: `src/lib/email/templates/base.ts`

**Current Problematic Configuration:**
```typescript
const DEFAULT_COMPANY_DATA: Partial<BaseTemplateData> = {
  companyName: 'Vantage Vertical',
  logoUrl: 'https://vantagevartical.com/vantage-logo.png', // WRONG DOMAIN
  websiteUrl: 'https://vantagevartical.com', // WRONG DOMAIN
  contactEmail: EMAIL_CONFIG.CONTACT_EMAIL,
  contactPhone: '+254 XXX XXX XXX', // PLACEHOLDER
};
```

**Updated Configuration:**
```typescript
const DEFAULT_COMPANY_DATA: Partial<BaseTemplateData> = {
  companyName: 'Vantage Vertical',
  logoUrl: 'https://vantagevertical.co.ke/vantage-logo.png', // CORRECTED
  websiteUrl: 'https://vantagevertical.co.ke', // CORRECTED
  contactEmail: EMAIL_CONFIG.CONTACT_EMAIL, // Already correct via config
  contactPhone: '+254704277687', // UPDATED
};
```

### 2. Logo URL Strategy

**Logo Selection Logic:**
```typescript
interface LogoConfig {
  default: string;
  white: string;
  dark: string;
}

const LOGO_CONFIG: LogoConfig = {
  default: 'https://vantagevertical.co.ke/vantage-logo.png',
  white: 'https://vantagevertical.co.ke/vantage-logo-white.jpg',
  dark: 'https://vantagevertical.co.ke/vantage-logo.png'
};

function getLogoUrl(background: 'light' | 'dark' = 'light'): string {
  return background === 'dark' ? LOGO_CONFIG.white : LOGO_CONFIG.default;
}
```

### 3. Template-Specific Updates

#### Contact Form Templates (`contact.ts`)
- Inherits from base configuration (no direct changes needed)
- Verify proper logo display in both admin and customer emails

#### Enrollment Templates (`enrollment.ts`)
- Inherits from base configuration (no direct changes needed)
- Ensure training-related emails display correct branding

#### Drone Inquiry Templates (`droneInquiry.ts`)
**Current Issues:**
```typescript
// These are hardcoded and need to be updated to use base config
<img src="https://vantagevertical.co.ke/vantage-logo-white.jpg" ... />
```

**Updated Approach:**
```typescript
// Use base template configuration instead of hardcoded values
const template = generateBaseTemplate(content, {
  logoUrl: getLogoUrl('dark') // For dark backgrounds
});
```

#### Newsletter Templates (`newsletter.ts`)
- Ensure newsletter emails use consistent branding
- Update any hardcoded logo references

### 4. Email Client Compatibility

**Logo Display Optimization:**
```html
<!-- Optimized logo HTML for email clients -->
<img 
  src="${logoUrl}" 
  alt="${companyName}" 
  style="height: 60px; width: auto; display: block; margin: 0 auto;"
  width="auto" 
  height="60"
/>
```

**Fallback Strategy:**
```html
<!-- With fallback for blocked images -->
<div style="background-color: #dc2626; color: white; padding: 10px; text-align: center;">
  <img src="${logoUrl}" alt="${companyName}" style="height: 60px;" />
  <!--[if !mso]><!-->
  <div style="display: none; font-size: 0; line-height: 0;">
    ${companyName}
  </div>
  <!--<![endif]-->
</div>
```

## Data Models

### Updated Base Template Data Model

```typescript
interface BaseTemplateData {
  recipientName?: string;
  companyName: string;
  logoUrl: string; // Always uses correct domain and path
  websiteUrl: string; // Always uses correct domain
  contactEmail: string; // Always uses vantageverticalltd@gmail.com
  contactPhone: string; // Always uses +254704277687
  unsubscribeUrl?: string;
}

interface LogoOptions {
  background?: 'light' | 'dark';
  size?: 'small' | 'medium' | 'large';
  alignment?: 'left' | 'center' | 'right';
}
```

### Email Template Validation Model

```typescript
interface TemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  logoAccessible: boolean;
  contactInfoValid: boolean;
}
```

## Error Handling

### Logo Loading Failures

```typescript
function validateLogoUrl(logoUrl: string): Promise<boolean> {
  return fetch(logoUrl, { method: 'HEAD' })
    .then(response => response.ok)
    .catch(() => false);
}

function getLogoWithFallback(preferredUrl: string): string {
  // In email templates, we'll rely on alt text and email client handling
  // Server-side validation can be added for testing
  return preferredUrl;
}
```

### Contact Information Validation

```typescript
function validateContactInfo(data: BaseTemplateData): string[] {
  const errors: string[] = [];
  
  if (!data.contactPhone.match(/^\+254\d{9}$/)) {
    errors.push('Invalid phone number format');
  }
  
  if (!data.contactEmail.includes('vantageverticalltd@gmail.com')) {
    errors.push('Incorrect email address');
  }
  
  if (!data.websiteUrl.includes('vantagevertical.co.ke')) {
    errors.push('Incorrect website URL');
  }
  
  return errors;
}
```

## Testing Strategy

### 1. Template Rendering Tests

```typescript
describe('Email Template Rendering', () => {
  test('should use correct logo URL', () => {
    const template = generateBaseTemplate('<p>Test content</p>');
    expect(template.html).toContain('vantagevertical.co.ke/vantage-logo.png');
    expect(template.html).not.toContain('vantagevartical.com');
  });
  
  test('should display correct contact information', () => {
    const template = generateBaseTemplate('<p>Test content</p>');
    expect(template.html).toContain('+254704277687');
    expect(template.html).toContain('vantageverticalltd@gmail.com');
  });
});
```

### 2. Email Client Testing

**Manual Testing Checklist:**
- [ ] Gmail (web and mobile)
- [ ] Outlook (web and desktop)
- [ ] Apple Mail
- [ ] Yahoo Mail
- [ ] Thunderbird

**Automated Testing:**
- Use email testing services like Litmus or Email on Acid
- Test responsive design across different screen sizes
- Verify logo loading and fallback behavior

### 3. Integration Tests

```typescript
describe('Email Service Integration', () => {
  test('should send contact form email with correct branding', async () => {
    const result = await sendContactFormEmail(mockFormData);
    expect(result.success).toBe(true);
    // Verify email content contains correct logo and contact info
  });
});
```

## Performance Considerations

### Logo Optimization

**Image Specifications:**
- **Format**: PNG for default logo, JPG for white logo
- **Size**: Optimized for email (max 200KB)
- **Dimensions**: 300x100px recommended for email headers
- **Compression**: Balanced quality vs. file size

**CDN Strategy:**
- Host logos on reliable CDN or main website
- Ensure HTTPS for security
- Consider email-specific image hosting if needed

### Email Size Optimization

- Keep total email size under 100KB when possible
- Optimize images for email clients
- Use efficient CSS and HTML structure
- Minimize external resource dependencies

## Security Considerations

### Image Security

- Use HTTPS for all logo URLs
- Validate image URLs to prevent injection
- Consider Content Security Policy implications
- Ensure images are hosted on trusted domains

### Contact Information Protection

- Validate contact information format
- Prevent injection in contact details
- Ensure proper encoding in email headers
- Use secure email transmission protocols

## Implementation Phases

### Phase 1: Base Template Updates (Priority: High)
1. Update `DEFAULT_COMPANY_DATA` in `base.ts`
2. Fix domain typo: `vantagevartical.com` → `vantagevertical.co.ke`
3. Update phone number placeholder
4. Add logo selection utilities

### Phase 2: Template-Specific Updates (Priority: High)
1. Update `droneInquiry.ts` hardcoded logo URLs
2. Ensure all templates inherit from base configuration
3. Remove any remaining hardcoded contact information
4. Standardize logo usage across templates

### Phase 3: Validation and Testing (Priority: Medium)
1. Add template validation functions
2. Create comprehensive test suite
3. Test across major email clients
4. Verify responsive design

### Phase 4: Documentation and Monitoring (Priority: Low)
1. Update template documentation
2. Add usage guidelines for future templates
3. Implement monitoring for email delivery
4. Create troubleshooting guide

## Accessibility Considerations

### Logo Accessibility

```html
<img 
  src="${logoUrl}" 
  alt="Vantage Vertical - Professional Drone Services"
  role="img"
  style="height: 60px; width: auto;"
/>
```

### Contact Information Accessibility

- Ensure phone numbers are properly formatted for screen readers
- Use semantic HTML for contact information
- Provide clear labels for contact methods
- Ensure sufficient color contrast for text

## Monitoring and Maintenance

### Email Delivery Monitoring

- Track email open rates to identify rendering issues
- Monitor bounce rates for delivery problems
- Set up alerts for template rendering failures
- Regular testing across email clients

### Template Maintenance

- Regular audits of logo accessibility
- Periodic validation of contact information
- Updates for new email client compatibility
- Performance monitoring and optimization

This design ensures that all email templates will display the correct Vantage Vertical branding with proper logo images and accurate contact information, providing a professional and consistent experience for all email recipients.