import fs from 'fs';
import path from 'path';

describe('Spec File Email Consistency', () => {
  const CORRECT_COMPANY_EMAIL = 'vantageverticalltd@gmail.com';
  const INCORRECT_EMAIL_TYPO = 'vantagevarticalltd@gmail.com'; // Missing 'e' in 'vertical'
  
  // Files that are allowed to contain the incorrect email as examples/documentation
  const ALLOWED_TYPO_FILES = [
    '.kiro/specs/email-address-standardization/requirements.md',
    '.kiro/specs/email-address-standardization/design.md',
    '.kiro/specs/email-address-standardization/tasks.md'
  ];

  let specFiles: string[] = [];

  // Helper function to recursively find markdown files
  function findMarkdownFiles(dir: string): string[] {
    const files: string[] = [];
    const fullPath = path.join(process.cwd(), dir);
    
    if (!fs.existsSync(fullPath)) {
      return files;
    }

    const entries = fs.readdirSync(fullPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const entryPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...findMarkdownFiles(entryPath));
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        files.push(entryPath);
      }
    }
    
    return files;
  }

  beforeAll(() => {
    // Find all markdown files in the .kiro/specs directory
    specFiles = findMarkdownFiles('.kiro/specs');
  });

  test('should find spec files to validate', () => {
    expect(specFiles.length).toBeGreaterThan(0);
    expect(specFiles.some(file => file.includes('.kiro/specs/'))).toBe(true);
  });

  test('should not contain email typos in non-documentation spec files', () => {
    const filesWithTypos: string[] = [];
    const typoDetails: Array<{ file: string; line: number; content: string }> = [];

    specFiles.forEach(filePath => {
      // Skip files that are allowed to contain typos as documentation
      if (ALLOWED_TYPO_FILES.includes(filePath)) {
        return;
      }

      const fullPath = path.resolve(process.cwd(), filePath);
      
      if (!fs.existsSync(fullPath)) {
        return;
      }

      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        if (line.includes(INCORRECT_EMAIL_TYPO)) {
          filesWithTypos.push(filePath);
          typoDetails.push({
            file: filePath,
            line: index + 1,
            content: line.trim()
          });
        }
      });
    });

    if (filesWithTypos.length > 0) {
      const errorMessage = `Found email typos in spec files:\n${typoDetails
        .map(detail => `  ${detail.file}:${detail.line} - "${detail.content}"`)
        .join('\n')}\n\nExpected: ${CORRECT_COMPANY_EMAIL}\nFound: ${INCORRECT_EMAIL_TYPO}`;
      
      fail(errorMessage);
    }

    expect(filesWithTypos).toHaveLength(0);
  });

  test('should use consistent email format across all spec files', () => {
    const emailInconsistencies: Array<{ file: string; line: number; email: string; content: string }> = [];
    const emailPattern = /[a-zA-Z0-9._%+-]+@gmail\.com/g;

    specFiles.forEach(filePath => {
      const fullPath = path.resolve(process.cwd(), filePath);
      
      if (!fs.existsSync(fullPath)) {
        return;
      }

      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        const matches = line.match(emailPattern);
        
        if (matches) {
          matches.forEach(email => {
            // Skip if this is in an allowed documentation file and it's the known typo
            if (ALLOWED_TYPO_FILES.includes(filePath) && email === INCORRECT_EMAIL_TYPO) {
              return;
            }

            // Check if it's a company email but not the correct format
            if (email.includes('vantage') && email !== CORRECT_COMPANY_EMAIL) {
              emailInconsistencies.push({
                file: filePath,
                line: index + 1,
                email,
                content: line.trim()
              });
            }
          });
        }
      });
    });

    if (emailInconsistencies.length > 0) {
      const errorMessage = `Found inconsistent email formats in spec files:\n${emailInconsistencies
        .map(detail => `  ${detail.file}:${detail.line} - Found "${detail.email}" in: "${detail.content}"`)
        .join('\n')}\n\nAll company emails should use: ${CORRECT_COMPANY_EMAIL}`;
      
      fail(errorMessage);
    }

    expect(emailInconsistencies).toHaveLength(0);
  });

  test('should contain the correct company email in relevant spec files', () => {
    const filesWithCorrectEmail: string[] = [];
    const totalEmailReferences: number[] = [];

    specFiles.forEach(filePath => {
      // Skip the email standardization spec files as they contain both correct and incorrect examples
      if (filePath.includes('email-address-standardization')) {
        return;
      }

      const fullPath = path.resolve(process.cwd(), filePath);
      
      if (!fs.existsSync(fullPath)) {
        return;
      }

      const content = fs.readFileSync(fullPath, 'utf-8');
      
      if (content.includes(CORRECT_COMPANY_EMAIL)) {
        filesWithCorrectEmail.push(filePath);
        
        // Count occurrences using split method
        const occurrences = content.split(CORRECT_COMPANY_EMAIL).length - 1;
        totalEmailReferences.push(occurrences);
      }
    });

    // Verify that files containing email references use the correct format
    expect(filesWithCorrectEmail.length).toBeGreaterThan(0);
    
    // Log the files that contain correct email references for verification
    console.log(`Files with correct company email (${CORRECT_COMPANY_EMAIL}):`);
    filesWithCorrectEmail.forEach((file, index) => {
      console.log(`  ${file} (${totalEmailReferences[index]} occurrences)`);
    });
  });

  test('should validate email addresses match expected patterns', () => {
    const validEmailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const invalidEmails: Array<{ file: string; line: number; email: string }> = [];

    specFiles.forEach(filePath => {
      const fullPath = path.resolve(process.cwd(), filePath);
      
      if (!fs.existsSync(fullPath)) {
        return;
      }

      const content = fs.readFileSync(fullPath, 'utf-8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        // Find potential email addresses
        const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
        const matches = line.match(emailPattern);
        
        if (matches) {
          matches.forEach(email => {
            if (!validEmailPattern.test(email)) {
              invalidEmails.push({
                file: filePath,
                line: index + 1,
                email
              });
            }
          });
        }
      });
    });

    if (invalidEmails.length > 0) {
      const errorMessage = `Found invalid email formats in spec files:\n${invalidEmails
        .map(detail => `  ${detail.file}:${detail.line} - "${detail.email}"`)
        .join('\n')}`;
      
      fail(errorMessage);
    }

    expect(invalidEmails).toHaveLength(0);
  });
});