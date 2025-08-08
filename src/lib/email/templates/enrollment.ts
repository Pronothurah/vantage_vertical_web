import { generateBaseTemplate, TemplateUtils } from './base';
import { EmailTemplate } from '../types';
import { EnrollmentData } from '../../../types/forms';

/**
 * Training program information for email templates
 */
interface ProgramInfo {
  name: string;
  duration: string;
  price: string;
  description: string;
  requirements: string[];
  schedule: string;
  location: string;
  certification: string;
}

/**
 * Program information database
 */
const PROGRAM_INFO: Record<string, ProgramInfo> = {
  'basic-pilot': {
    name: 'Basic Drone Pilot Training',
    duration: '3 days',
    price: 'KES 45,000',
    description: 'Comprehensive introduction to drone operations, safety protocols, and basic flight techniques.',
    requirements: [
      'Valid ID or passport',
      'Basic English proficiency',
      'Physical fitness for outdoor activities',
      'Laptop for theory sessions'
    ],
    schedule: 'Day 1-2: Theory and regulations, Day 3: Practical flight training',
    location: 'Vantage Vertical Training Center, Nairobi',
    certification: 'KCAA Basic Drone Pilot Certificate'
  },
  'commercial-pilot': {
    name: 'Commercial Drone Pilot Training',
    duration: '5 days',
    price: 'KES 85,000',
    description: 'Advanced training for commercial drone operations including aerial photography, surveying, and inspection techniques.',
    requirements: [
      'Valid ID or passport',
      'Basic Drone Pilot Certificate (or equivalent experience)',
      'Laptop for theory sessions',
      'Camera equipment knowledge (preferred)'
    ],
    schedule: 'Day 1-3: Advanced theory and regulations, Day 4-5: Commercial flight operations',
    location: 'Vantage Vertical Training Center, Nairobi',
    certification: 'KCAA Commercial Drone Pilot Certificate'
  },
  'agricultural-specialist': {
    name: 'Agricultural Drone Specialist',
    duration: '4 days',
    price: 'KES 65,000',
    description: 'Specialized training for agricultural applications including crop monitoring, spraying operations, and data analysis.',
    requirements: [
      'Valid ID or passport',
      'Basic Drone Pilot Certificate',
      'Agricultural background (preferred)',
      'Laptop for data analysis sessions'
    ],
    schedule: 'Day 1-2: Agricultural theory and applications, Day 3-4: Field operations and data analysis',
    location: 'Vantage Vertical Training Center + Field locations',
    certification: 'Agricultural Drone Operations Certificate'
  },
  'surveying-mapping': {
    name: 'Surveying and Mapping Specialist',
    duration: '5 days',
    price: 'KES 95,000',
    description: 'Professional training for surveying, mapping, and GIS applications using drone technology.',
    requirements: [
      'Valid ID or passport',
      'Basic Drone Pilot Certificate',
      'Surveying or GIS background (preferred)',
      'Laptop with GIS software capability'
    ],
    schedule: 'Day 1-3: Surveying theory and GIS, Day 4-5: Field mapping and data processing',
    location: 'Vantage Vertical Training Center + Survey sites',
    certification: 'Professional Drone Surveying Certificate'
  }
};

/**
 * Generates admin notification email for new training enrollment
 * @param enrollmentData - Student enrollment information
 * @returns EmailTemplate for admin notification
 */
export function generateEnrollmentAdminNotification(enrollmentData: EnrollmentData): EmailTemplate {
  const programInfo = PROGRAM_INFO[enrollmentData.program] || {
    name: enrollmentData.program,
    duration: 'TBD',
    price: 'Contact for pricing',
    description: 'Custom training program',
    requirements: [],
    schedule: 'To be arranged',
    location: 'Vantage Vertical Training Center',
    certification: 'Certificate of completion'
  };

  const enrollmentDetails = TemplateUtils.createInfoList({
    'Student Name': enrollmentData.name,
    'Email': enrollmentData.email,
    'Phone': enrollmentData.phone,
    'Program': programInfo.name,
    'Session': enrollmentData.session,
    'Experience Level': enrollmentData.experience,
    'Accommodation Needed': enrollmentData.accommodation ? 'Yes' : 'No',
    'Emergency Contact': enrollmentData.emergencyContact 
      ? `${enrollmentData.emergencyContact.name} (${enrollmentData.emergencyContact.relationship}) - ${enrollmentData.emergencyContact.phone}`
      : 'Not provided'
  });

  const motivationSection = enrollmentData.motivation 
    ? `
      <h3>Student Motivation</h3>
      <div class="highlight">
        <p><em>"${TemplateUtils.escapeHtml(enrollmentData.motivation)}"</em></p>
      </div>
    `
    : '';

  const content = `
    <h1>New Training Enrollment</h1>
    
    <p>A new student has enrolled for training. Please review the details below and follow up accordingly.</p>
    
    ${TemplateUtils.createAlert('New enrollment requires immediate attention for confirmation and scheduling.', 'info')}
    
    <h2>Student Information</h2>
    ${enrollmentDetails}
    
    ${motivationSection}
    
    <h2>Program Details</h2>
    ${TemplateUtils.createInfoList({
      'Program': programInfo.name,
      'Duration': programInfo.duration,
      'Price': programInfo.price,
      'Location': programInfo.location,
      'Certification': programInfo.certification
    })}
    
    <h2>Next Steps</h2>
    <ol>
      <li>Contact the student within 24 hours to confirm enrollment</li>
      <li>Send payment instructions and enrollment confirmation</li>
      <li>Schedule the training session based on availability</li>
      <li>Send pre-course materials and preparation instructions</li>
      <li>Update the training calendar and notify instructors</li>
    </ol>
    
    ${TemplateUtils.createHighlight('Remember to verify student requirements and send the welcome package.')}
    
    <p>Enrollment submitted on: <strong>${TemplateUtils.formatDate(new Date())}</strong></p>
  `;

  const template = generateBaseTemplate(content);
  
  return {
    ...template,
    subject: `New Training Enrollment: ${enrollmentData.name} - ${programInfo.name}`
  };
}

/**
 * Generates student confirmation email for training enrollment
 * @param enrollmentData - Student enrollment information
 * @returns EmailTemplate for student confirmation
 */
export function generateEnrollmentStudentConfirmation(enrollmentData: EnrollmentData): EmailTemplate {
  const programInfo = PROGRAM_INFO[enrollmentData.program] || {
    name: enrollmentData.program,
    duration: 'TBD',
    price: 'Contact for pricing',
    description: 'Custom training program',
    requirements: [],
    schedule: 'To be arranged',
    location: 'Vantage Vertical Training Center',
    certification: 'Certificate of completion'
  };

  const requirementsList = programInfo.requirements.length > 0 
    ? `<ul>${programInfo.requirements.map(req => `<li>${req}</li>`).join('')}</ul>`
    : '<p>No specific requirements listed.</p>';

  const content = `
    <h1>Training Enrollment Confirmation</h1>
    
    <p>Dear ${TemplateUtils.escapeHtml(enrollmentData.name)},</p>
    
    <p>Thank you for enrolling in our drone training program! We're excited to help you develop your skills in drone operations.</p>
    
    ${TemplateUtils.createAlert('Your enrollment has been received and is being processed. Our team will contact you within 24 hours.', 'success')}
    
    <h2>Your Training Program</h2>
    <div class="highlight">
      <h3>${programInfo.name}</h3>
      <p>${programInfo.description}</p>
    </div>
    
    <h2>Program Details</h2>
    ${TemplateUtils.createInfoList({
      'Duration': programInfo.duration,
      'Investment': programInfo.price,
      'Schedule': programInfo.schedule,
      'Location': programInfo.location,
      'Certification': programInfo.certification,
      'Your Session': enrollmentData.session
    })}
    
    <h2>What to Bring</h2>
    ${requirementsList}
    
    <h2>Next Steps</h2>
    <ol>
      <li><strong>Confirmation Call:</strong> Our team will contact you within 24 hours to confirm your enrollment and discuss payment options.</li>
      <li><strong>Payment:</strong> Complete payment to secure your spot in the program.</li>
      <li><strong>Pre-Course Materials:</strong> You'll receive study materials and preparation instructions via email.</li>
      <li><strong>Final Confirmation:</strong> We'll send final details including exact timing and location 48 hours before the course.</li>
    </ol>
    
    ${TemplateUtils.createHighlight('Important: Your spot is reserved for 48 hours pending payment confirmation.')}
    
    <h2>Accommodation</h2>
    ${enrollmentData.accommodation 
      ? TemplateUtils.createAlert('You requested accommodation assistance. Our team will provide local accommodation options during the confirmation call.', 'info')
      : '<p>You indicated that you don\'t need accommodation assistance.</p>'
    }
    
    <h2>Questions?</h2>
    <p>If you have any questions about the program or need to make changes to your enrollment, please don't hesitate to contact us:</p>
    
    <div class="text-center">
      ${TemplateUtils.createButton('Contact Training Team', 'mailto:vantagevarticalltd@gmail.com?subject=Training Enrollment Question', 'primary')}
    </div>
    
    <p>We look forward to training you and helping you achieve your drone operation goals!</p>
    
    <p>Best regards,<br>
    <strong>The Vantage Vertical Training Team</strong></p>
  `;

  const template = generateBaseTemplate(content);
  
  return {
    ...template,
    subject: `Welcome to Vantage Vertical Training - ${programInfo.name} Enrollment Confirmed`
  };
}

/**
 * Generates a comprehensive enrollment email package (both admin and student emails)
 * @param enrollmentData - Student enrollment information
 * @returns Object containing both email templates
 */
export function generateEnrollmentEmails(enrollmentData: EnrollmentData) {
  return {
    adminNotification: generateEnrollmentAdminNotification(enrollmentData),
    studentConfirmation: generateEnrollmentStudentConfirmation(enrollmentData)
  };
}

/**
 * Utility function to get program information
 * @param programId - Program identifier
 * @returns Program information or default values
 */
export function getProgramInfo(programId: string): ProgramInfo {
  return PROGRAM_INFO[programId] || {
    name: programId,
    duration: 'TBD',
    price: 'Contact for pricing',
    description: 'Custom training program',
    requirements: [],
    schedule: 'To be arranged',
    location: 'Vantage Vertical Training Center',
    certification: 'Certificate of completion'
  };
}