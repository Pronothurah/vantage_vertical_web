# Design Document

## Overview

This design document outlines the completion and standardization of SMTP email integration across the Vantage Vertical website. The current system has functional contact forms and newsletter subscriptions, but drone inquiries and training enrollment forms need to be completed. Additionally, all email endpoints need consistent error handling, retry logic, and performance optimizations.

## Architecture

### Current State Analysis
- **Contact Form API** (`src/app/api/contact/route.ts`): ✅ Fully functional with nodemailer
- **Newsletter API** (`src/app/api/newsletter/route.ts`): ✅ Functional with confirmation emails
- **Drone Inquiry API** (`src/app/api/drone-inquiry/route.ts`): ⚠️ Templates exist but email sending is disabled
- **Training Enrollment API** (`src/app/api/enrollment/route.ts`): ⚠️ Only console logging, no email sending

### Target Architecture
All email endpoints will use a consistent architecture with:
1. **Shared Email Service Module**: Centralized nodemailer configuration and utilities
2. **Template System**: Reusable HTML email templates with consistent branding
3. **Error Handling**: Standardized error handling with retry logic
4. **Background Processing**: Asynchronous email sending to prevent UI blocking
5. **Configuration Management**: Centralized SMTP configuration validation

## Components and Interfaces

### 1. Shared Email Service Module

#### File Structure
```
src/lib/email/
├── emailService.ts          # Main email service class
├── templates/
│   ├── contact.ts          # Contact form template (existing)
│   ├── newsletter.ts       # Newsletter templates (existing)
│   ├── droneInquiry.ts     # Drone inquiry templates
│   ├── enrollment.ts       # Training enrollment templates
│   └── base.ts             # Base template with common styling
├── types.ts                # Email-related TypeScript interfaces
└── utils.ts                # Email utilities and validation
```

#### EmailService Class Interface
```typescript
interface EmailServiceConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: string;
  retryAttempts: number;
  retryDelay: number;
}

class EmailService {
  constructor(config: EmailServiceConfig);
  
  // Core sending methods
  async sendEmail(options: EmailOptions): Promise<EmailResult>;
  async sendContactFormEmail(data: ContactFormData): Promise<EmailResult>;
  async sendDroneInquiryEmail(data: DroneInquiryData): Promise<EmailResult>;
  async sendEnrollmentEmail(data: EnrollmentData): Promise<EmailResult>;
  async sendNewsletterConfirmation(email: string, token: string): Promise<EmailResult>;
  
  // Utility methods
  async validateConfiguration(): Promise<boolean>;
  async testConnection(): Promise<boolean>;
  private async retryWithBackoff<T>(fn: () => Promise<T>, attempts: number): Promise<T>;
}
```

### 2. Email Templates System

#### Base Template Structure
All email templates will extend a base template with consistent branding:

```typescript
interface BaseTemplateData {
  recipientName?: string;
  companyName: string;
  logoUrl: string;
  websiteUrl: string;
  contactEmail: string;
  contactPhone: string;
  unsubscribeUrl?: string;
}

interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

function generateBaseTemplate(
  content: string,
  data: BaseTemplateData,
  options?: TemplateOptions
): EmailTemplate;
```

#### Template Specifications

**Contact Form Template** (Already exists, needs standardization)
- Admin notification with form data
- Customer confirmation email
- Urgency-based styling and response times

**Drone Inquiry Template** (Needs implementation)
- Admin notification with inquiry details, customer info, and requirements
- Customer acknowledgment with next steps and timeline
- Product-specific information and pricing context

**Training Enrollment Template** (Needs implementation)
- Admin notification with enrollment details and student information
- Student confirmation with course details, schedule, and preparation instructions
- Payment and documentation requirements

**Newsletter Template** (Already exists, needs standardization)
- Welcome email with subscription confirmation
- Confirmation link with branded styling

### 3. Enhanced Error Handling System

#### Error Types and Handling
```typescript
enum EmailErrorType {
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
  SMTP_CONNECTION_ERROR = 'SMTP_CONNECTION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  TEMPLATE_ERROR = 'TEMPLATE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

interface EmailError extends Error {
  type: EmailErrorType;
  retryable: boolean;
  originalError?: Error;
  context?: Record<string, any>;
}

class EmailErrorHandler {
  static handleError(error: Error, context: Record<string, any>): EmailError;
  static shouldRetry(error: EmailError): boolean;
  static getRetryDelay(attempt: number): number;
}
```

#### Retry Logic Implementation
- **Exponential Backoff**: 1s, 2s, 4s, 8s, 16s delays
- **Maximum Attempts**: 5 retries for transient errors
- **Circuit Breaker**: Temporary disable after consecutive failures
- **Error Classification**: Distinguish between retryable and non-retryable errors

### 4. Configuration Management

#### Environment Variable Validation
```typescript
interface SMTPConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  contactEmail: string;
}

function validateSMTPConfig(): SMTPConfig | null;
function getEmailConfig(): EmailServiceConfig;
```

#### Configuration Requirements
- **Required Variables**: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
- **Optional Variables**: SMTP_FROM (defaults to SMTP_USER), CONTACT_EMAIL
- **Validation**: Check all required variables are present and properly formatted
- **Error Handling**: Graceful degradation when email is not configured

## Data Models

### 1. Email Data Interfaces

```typescript
// Existing ContactFormData (already defined in types/forms.ts)
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
}

// Enhanced DroneInquiryData
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

// Enhanced EnrollmentData
interface EnrollmentData {
  name: string;
  email: string;
  phone: string;
  program: string;
  session: string;
  experience: string;
  motivation: string;
  accommodation?: boolean;
  terms: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

// Newsletter Subscription Data
interface NewsletterSubscriptionData {
  email: string;
  confirmationToken: string;
  subscribedAt: Date;
  confirmed: boolean;
}
```

### 2. Email Result Interface

```typescript
interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: EmailError;
  retryCount: number;
  timestamp: Date;
  recipient: string;
  subject: string;
}
```

## Error Handling

### 1. Configuration Errors
- **Missing Credentials**: Log warning and disable email functionality
- **Invalid Configuration**: Provide clear error messages for troubleshooting
- **Connection Failures**: Implement retry logic with exponential backoff

### 2. Runtime Errors
- **SMTP Errors**: Parse SMTP response codes and provide appropriate user feedback
- **Template Errors**: Validate template data and provide fallback content
- **Rate Limiting**: Implement queue system to handle high volumes

### 3. User Experience
- **Immediate Feedback**: Always provide immediate response to user actions
- **Background Processing**: Send emails asynchronously to avoid UI blocking
- **Graceful Degradation**: Continue form processing even if email fails

## Testing Strategy

### 1. Unit Tests
- **Email Service**: Test email sending, retry logic, and error handling
- **Templates**: Test template generation with various data inputs
- **Configuration**: Test configuration validation and error scenarios

### 2. Integration Tests
- **API Endpoints**: Test complete email flow for each form type
- **SMTP Integration**: Test actual email sending in development environment
- **Error Scenarios**: Test behavior with invalid configurations and network issues

### 3. Manual Testing
- **Email Delivery**: Verify emails are received and properly formatted
- **Template Rendering**: Check email appearance across different email clients
- **Error Handling**: Test form behavior when email service is unavailable

## Performance Considerations

### 1. Asynchronous Processing
- **Non-blocking Operations**: Use async/await for all email operations
- **Background Jobs**: Consider implementing job queue for high-volume scenarios
- **Timeout Handling**: Set appropriate timeouts for SMTP operations

### 2. Resource Management
- **Connection Pooling**: Reuse SMTP connections when possible
- **Memory Usage**: Optimize template rendering for large email volumes
- **Rate Limiting**: Respect SMTP provider limits to avoid service disruption

### 3. Monitoring and Logging
- **Success Metrics**: Track email delivery success rates
- **Error Logging**: Log detailed error information for troubleshooting
- **Performance Metrics**: Monitor email sending times and queue lengths

## Security Considerations

### 1. Credential Management
- **Environment Variables**: Store SMTP credentials securely
- **Access Control**: Limit access to email configuration
- **Encryption**: Use TLS for SMTP connections

### 2. Input Validation
- **Email Injection**: Sanitize all user inputs to prevent email injection attacks
- **Data Validation**: Validate all form data before processing
- **Rate Limiting**: Implement rate limiting to prevent abuse

### 3. Privacy Protection
- **Data Handling**: Minimize storage of sensitive user information
- **Logging**: Avoid logging sensitive data in error messages
- **Compliance**: Ensure GDPR compliance for email communications

## Implementation Phases

### Phase 1: Shared Email Service
1. Create centralized EmailService class
2. Implement configuration validation
3. Add retry logic and error handling
4. Create base email template system

### Phase 2: Complete Drone Inquiry Integration
1. Implement actual email sending in drone inquiry API
2. Create drone inquiry email templates
3. Add proper error handling and user feedback
4. Test email delivery and template rendering

### Phase 3: Complete Training Enrollment Integration
1. Implement email sending in enrollment API
2. Create enrollment confirmation templates
3. Add student and admin notification emails
4. Test complete enrollment flow

### Phase 4: Standardization and Optimization
1. Migrate existing contact and newsletter APIs to use shared service
2. Implement consistent error handling across all endpoints
3. Add performance monitoring and logging
4. Optimize template rendering and email delivery

### Phase 5: Testing and Validation
1. Comprehensive testing of all email functionality
2. Performance testing under load
3. Security testing and validation
4. Documentation and deployment preparation

## Migration Strategy

### Existing Code Preservation
- **Contact Form**: Migrate to shared service while preserving existing functionality
- **Newsletter**: Update to use standardized templates and error handling
- **Backward Compatibility**: Ensure no breaking changes to existing API contracts

### Gradual Rollout
1. **Development Testing**: Test new implementation in development environment
2. **Staging Validation**: Validate complete functionality in staging
3. **Production Deployment**: Deploy with monitoring and rollback capability
4. **Performance Monitoring**: Monitor email delivery rates and error rates post-deployment