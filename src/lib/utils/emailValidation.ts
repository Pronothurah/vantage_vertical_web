/**
 * Email validation utilities for company email standardization
 * Ensures consistent use of the correct company email address
 */

const CORRECT_COMPANY_EMAIL = 'vantageverticalltd@gmail.com';
const COMMON_TYPOS = [
  'vantagevarticalltd@gmail.com', // missing 'e' in vertical
  'vantageverticalltd@gmial.com', // typo in gmail
  'vantageverticalltd@gmai.com',  // missing 'l' in gmail
  'vantageverticalltd@gmail.co',  // missing 'm' in .com
  'vantageverticalltd@yahoo.com', // wrong domain
  'vantagevertical@gmail.com',    // missing 'ltd'
  'vantageverticaltd@gmail.com',  // missing 'l' in ltd
];

/**
 * Validates if the provided email matches the correct company email format
 * @param email - The email address to validate
 * @returns true if the email matches the correct company email format
 */
export function validateCompanyEmail(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }
  
  return email.trim().toLowerCase() === CORRECT_COMPANY_EMAIL.toLowerCase();
}

/**
 * Returns the standardized company email address
 * @returns The correct company email address
 */
export function getStandardizedEmail(): string {
  return CORRECT_COMPANY_EMAIL;
}

/**
 * Detects common typos in email addresses and suggests corrections
 * @param email - The email address to check for typos
 * @returns Object containing typo detection results and suggested correction
 */
export function detectEmailTypos(email: string): {
  hasTypo: boolean;
  suggestedCorrection?: string;
  typoType?: string;
} {
  if (!email || typeof email !== 'string') {
    return { hasTypo: false };
  }

  const normalizedEmail = email.trim().toLowerCase();
  
  // Check if it's already correct
  if (normalizedEmail === CORRECT_COMPANY_EMAIL.toLowerCase()) {
    return { hasTypo: false };
  }

  // Check against known typos
  if (COMMON_TYPOS.some(typo => typo.toLowerCase() === normalizedEmail)) {
    return {
      hasTypo: true,
      suggestedCorrection: CORRECT_COMPANY_EMAIL,
      typoType: 'known_typo'
    };
  }

  // Check for partial matches that might be typos
  const emailParts = normalizedEmail.split('@');
  if (emailParts.length === 2) {
    const [localPart, domain] = emailParts;
    
    // Check for domain typos
    if (domain.includes('gmail') && domain !== 'gmail.com') {
      return {
        hasTypo: true,
        suggestedCorrection: CORRECT_COMPANY_EMAIL,
        typoType: 'domain_typo'
      };
    }
    
    // Check for local part typos (vantage variations)
    if (localPart.includes('vantage') && localPart.includes('vertical')) {
      return {
        hasTypo: true,
        suggestedCorrection: CORRECT_COMPANY_EMAIL,
        typoType: 'local_part_typo'
      };
    }
  }

  return { hasTypo: false };
}

/**
 * Validates and corrects email addresses, returning the standardized version
 * @param email - The email address to validate and potentially correct
 * @returns Object with validation results and corrected email if applicable
 */
export function validateAndCorrectEmail(email: string): {
  isValid: boolean;
  correctedEmail: string;
  wasTypo: boolean;
  originalEmail: string;
} {
  const originalEmail = email;
  
  // First check if it's already valid
  if (validateCompanyEmail(email)) {
    return {
      isValid: true,
      correctedEmail: email,
      wasTypo: false,
      originalEmail
    };
  }

  // Check for typos and suggest correction
  const typoResult = detectEmailTypos(email);
  
  if (typoResult.hasTypo && typoResult.suggestedCorrection) {
    return {
      isValid: false,
      correctedEmail: typoResult.suggestedCorrection,
      wasTypo: true,
      originalEmail
    };
  }

  // If no typo detected but still invalid, return standardized email
  return {
    isValid: false,
    correctedEmail: CORRECT_COMPANY_EMAIL,
    wasTypo: false,
    originalEmail
  };
}

/**
 * Type guard to check if a string is a valid company email
 * @param email - The email to check
 * @returns Type predicate indicating if email is valid company email
 */
export function isValidCompanyEmail(email: string): email is typeof CORRECT_COMPANY_EMAIL {
  return validateCompanyEmail(email);
}