#!/usr/bin/env node

/**
 * SMTP Configuration Testing Utility
 * 
 * This utility helps test and validate SMTP configuration for the email service.
 * It can be run from the command line or imported as a module.
 */

import { 
  validateSMTPConfigDetailed, 
  testSMTPConnection, 
  getEmailServiceStatus,
  isEmailTestMode,
  devEmailLogger 
} from './utils';
import { emailService } from './emailService';

/**
 * Colors for console output
 */
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

/**
 * Formats console output with colors
 */
function colorize(text: string, color: keyof typeof colors): string {
  return `${colors[color]}${text}${colors.reset}`;
}

/**
 * Prints a section header
 */
function printHeader(title: string): void {
  console.log('\n' + colorize('='.repeat(50), 'cyan'));
  console.log(colorize(title.toUpperCase(), 'cyan'));
  console.log(colorize('='.repeat(50), 'cyan'));
}

/**
 * Prints a success message
 */
function printSuccess(message: string): void {
  console.log(colorize('✓ ' + message, 'green'));
}

/**
 * Prints an error message
 */
function printError(message: string): void {
  console.log(colorize('✗ ' + message, 'red'));
}

/**
 * Prints a warning message
 */
function printWarning(message: string): void {
  console.log(colorize('⚠ ' + message, 'yellow'));
}

/**
 * Prints an info message
 */
function printInfo(message: string): void {
  console.log(colorize('ℹ ' + message, 'blue'));
}

/**
 * Tests SMTP configuration validation
 */
async function testConfigValidation(): Promise<boolean> {
  printHeader('SMTP Configuration Validation');
  
  const validation = validateSMTPConfigDetailed();
  
  if (validation.isValid) {
    printSuccess('SMTP configuration is valid');
    
    if (validation.config) {
      console.log('\nConfiguration details:');
      console.log(`  Host: ${validation.config.host}`);
      console.log(`  Port: ${validation.config.port}`);
      console.log(`  User: ${validation.config.user}`);
      console.log(`  From: ${validation.config.from}`);
      console.log(`  Contact Email: ${validation.config.contactEmail}`);
    }
    
    if (validation.warnings.length > 0) {
      console.log('\nWarnings:');
      validation.warnings.forEach(warning => printWarning(warning));
    }
    
    return true;
  } else {
    printError('SMTP configuration is invalid');
    
    if (validation.errors.length > 0) {
      console.log('\nErrors:');
      validation.errors.forEach(error => printError(error));
    }
    
    if (validation.warnings.length > 0) {
      console.log('\nWarnings:');
      validation.warnings.forEach(warning => printWarning(warning));
    }
    
    return false;
  }
}

/**
 * Tests SMTP connection
 */
async function testConnection(): Promise<boolean> {
  printHeader('SMTP Connection Test');
  
  try {
    const result = await testSMTPConnection();
    
    if (result.success) {
      printSuccess('SMTP connection successful');
      
      if (result.details) {
        console.log('\nConnection details:');
        console.log(`  Host: ${result.details.host}`);
        console.log(`  Port: ${result.details.port}`);
        console.log(`  Secure: ${result.details.secure}`);
        console.log(`  Response Time: ${result.details.responseTime}ms`);
      }
      
      return true;
    } else {
      printError('SMTP connection failed');
      
      if (result.error) {
        console.log('\nError details:');
        printError(result.error);
      }
      
      return false;
    }
  } catch (error) {
    printError('Connection test failed with exception');
    console.error(error);
    return false;
  }
}

/**
 * Tests email service functionality
 */
async function testEmailService(): Promise<boolean> {
  printHeader('Email Service Test');
  
  try {
    const configValid = await emailService.validateConfiguration();
    const connectionValid = await emailService.testConnection();
    
    if (configValid) {
      printSuccess('Email service configuration is valid');
    } else {
      printError('Email service configuration is invalid');
    }
    
    if (connectionValid) {
      printSuccess('Email service connection is working');
    } else {
      printError('Email service connection failed');
    }
    
    // Get service status
    const status = emailService.getServiceStatus();
    
    console.log('\nService Status:');
    console.log(`  Configured: ${status.isConfigured}`);
    console.log(`  Test Mode: ${status.isTestMode}`);
    console.log(`  Development Mode: ${status.isDevelopmentMode}`);
    console.log(`  Can Send Emails: ${status.canSendEmails}`);
    console.log(`  Circuit Breaker Open: ${status.circuitBreakerOpen}`);
    
    if (status.metrics) {
      console.log('\nMetrics:');
      console.log(`  Total Operations: ${status.metrics.totalOperations}`);
      console.log(`  Success Rate: ${(status.metrics.successRate * 100).toFixed(2)}%`);
      console.log(`  Average Retry Count: ${status.metrics.averageRetryCount.toFixed(2)}`);
      console.log(`  Average Duration: ${status.metrics.averageDuration.toFixed(2)}ms`);
    }
    
    return configValid && connectionValid;
  } catch (error) {
    printError('Email service test failed with exception');
    console.error(error);
    return false;
  }
}

/**
 * Sends a test email
 */
async function sendTestEmail(recipient?: string): Promise<boolean> {
  printHeader('Test Email Send');
  
  const testRecipient = recipient || process.env.CONTACT_EMAIL || 'vantagevarticalltd@gmail.com';
  
  if (!testRecipient) {
    printError('No recipient specified and no CONTACT_EMAIL configured');
    return false;
  }
  
  printInfo(`Sending test email to: ${testRecipient}`);
  
  if (isEmailTestMode()) {
    printWarning('Running in test mode - email will be logged instead of sent');
  }
  
  try {
    const result = await emailService.sendEmail({
      to: testRecipient,
      subject: 'SMTP Configuration Test Email',
      html: `
        <h2>SMTP Configuration Test</h2>
        <p>This is a test email to verify that your SMTP configuration is working correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'unknown'}</p>
        <p>If you received this email, your SMTP configuration is working properly!</p>
      `,
      text: `
SMTP Configuration Test

This is a test email to verify that your SMTP configuration is working correctly.

Timestamp: ${new Date().toISOString()}
Environment: ${process.env.NODE_ENV || 'unknown'}

If you received this email, your SMTP configuration is working properly!
      `.trim(),
    });
    
    if (result.success) {
      printSuccess('Test email sent successfully');
      
      if (result.messageId) {
        console.log(`Message ID: ${result.messageId}`);
      }
      
      if (result.retryCount > 0) {
        printWarning(`Email required ${result.retryCount} retries`);
      }
      
      return true;
    } else {
      printError('Test email failed to send');
      
      if (result.error) {
        console.log('\nError details:');
        printError(result.error.message);
        
        if (result.error.type) {
          console.log(`Error Type: ${result.error.type}`);
        }
      }
      
      return false;
    }
  } catch (error) {
    printError('Test email failed with exception');
    console.error(error);
    return false;
  }
}

/**
 * Shows development mode logs
 */
function showDevLogs(): void {
  printHeader('Development Mode Logs');
  
  if (!isEmailTestMode()) {
    printInfo('Not in test mode - no development logs available');
    return;
  }
  
  const logs = devEmailLogger.getLogs();
  
  if (logs.length === 0) {
    printInfo('No development logs found');
    return;
  }
  
  console.log(`Found ${logs.length} logged emails:\n`);
  
  logs.slice(0, 10).forEach((log, index) => {
    console.log(`${index + 1}. ${colorize(log.subject, 'cyan')}`);
    console.log(`   To: ${log.to}`);
    console.log(`   From: ${log.from}`);
    console.log(`   Time: ${log.timestamp.toISOString()}`);
    console.log('');
  });
  
  if (logs.length > 10) {
    printInfo(`... and ${logs.length - 10} more logs`);
  }
}

/**
 * Provides configuration recommendations
 */
function showRecommendations(): void {
  printHeader('Configuration Recommendations');
  
  const status = getEmailServiceStatus();
  
  if (status.recommendations.length === 0) {
    printSuccess('No recommendations - configuration looks good!');
    return;
  }
  
  console.log('Recommendations to improve your email configuration:\n');
  
  status.recommendations.forEach((recommendation, index) => {
    console.log(`${index + 1}. ${recommendation}`);
  });
  
  console.log('\nExample .env configuration:');
  console.log(colorize(`
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=your-email@gmail.com
SMTP_FROM_NAME="Your Website"
CONTACT_EMAIL=vantagevarticalltd@gmail.com
  `.trim(), 'yellow'));
}

/**
 * Main test runner
 */
export async function runEmailConfigTest(options: {
  testRecipient?: string;
  skipConnection?: boolean;
  skipTestEmail?: boolean;
  showLogs?: boolean;
} = {}): Promise<boolean> {
  console.log(colorize('Email Configuration Test Utility', 'magenta'));
  console.log(colorize('=====================================', 'magenta'));
  
  let allTestsPassed = true;
  
  // Test configuration validation
  const configValid = await testConfigValidation();
  allTestsPassed = allTestsPassed && configValid;
  
  // Test connection if config is valid and not skipped
  if (configValid && !options.skipConnection) {
    const connectionValid = await testConnection();
    allTestsPassed = allTestsPassed && connectionValid;
  }
  
  // Test email service
  const serviceValid = await testEmailService();
  allTestsPassed = allTestsPassed && serviceValid;
  
  // Send test email if requested and service is valid
  if (!options.skipTestEmail && serviceValid) {
    const emailSent = await sendTestEmail(options.testRecipient);
    allTestsPassed = allTestsPassed && emailSent;
  }
  
  // Show development logs if requested
  if (options.showLogs) {
    showDevLogs();
  }
  
  // Show recommendations
  showRecommendations();
  
  // Final summary
  printHeader('Test Summary');
  
  if (allTestsPassed) {
    printSuccess('All tests passed! Email configuration is working correctly.');
  } else {
    printError('Some tests failed. Please review the errors above and fix your configuration.');
  }
  
  return allTestsPassed;
}

/**
 * Command line interface
 */
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: Parameters<typeof runEmailConfigTest>[0] = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--recipient':
      case '-r':
        options.testRecipient = args[++i];
        break;
      case '--skip-connection':
        options.skipConnection = true;
        break;
      case '--skip-test-email':
        options.skipTestEmail = true;
        break;
      case '--show-logs':
        options.showLogs = true;
        break;
      case '--help':
      case '-h':
        console.log(`
Email Configuration Test Utility

Usage: node configTest.js [options]

Options:
  --recipient, -r <email>    Recipient for test email (default: CONTACT_EMAIL)
  --skip-connection          Skip SMTP connection test
  --skip-test-email          Skip sending test email
  --show-logs                Show development mode email logs
  --help, -h                 Show this help message

Examples:
  node configTest.js                           # Run all tests
  node configTest.js --recipient test@example.com  # Send test email to specific recipient
  node configTest.js --skip-test-email         # Test configuration without sending email
  node configTest.js --show-logs               # Show development mode logs
        `);
        process.exit(0);
        break;
    }
  }
  
  // Run the tests
  runEmailConfigTest(options)
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('Test runner failed:', error);
      process.exit(1);
    });
}