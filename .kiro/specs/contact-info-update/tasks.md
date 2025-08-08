# Implementation Plan

- [x] 1. Update core data configuration files
  - Update `.env.example` with new phone number (+254704277687) and email (vantagevarticalltd@gmail.com)
  - Update `backend/.env.example` with new contact information
  - Ensure consistent formatting across all environment files
  - _Requirements: 1.1, 2.1, 3.1, 3.2, 3.3_

- [x] 2. Update centralized company information in data layer
  - Modify `src/data/index.tsx` companyInfo object with new phone, email, founded date (December 2022), and team size (10+)
  - Update company description to "A leading Unmanned Aircraft company in East Africa that offers professional services in aerial mapping, surveillance, agritech solutions, commercial photography, and comprehensive drone training programs."
  - Ensure all company information fields are consistently updated
  - _Requirements: 1.1, 2.1, 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 3. Update team member information in data layer
  - Replace David Kuria with Michel Wanjugu as CEO & Lead Pilot in teamMembers array
  - Replace Mary Wanjiku with Grace Wacheke as Technical Director
  - Replace James Ochieng with David Mutua as Operations Manager (Aeronautical Engineer & Pilot)
  - Add Onsongo Onditi as Business Development Lead to teamMembers array
  - Update instructor arrays to include all team members plus Mike Kasio as additional instructor
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 7.1, 7.2, 7.3, 7.4_

- [x] 4. Update training program information and pricing
  - Change "Basic Drone Pilot Certification" to "KCAA UAS (Unmanned Aircraft System) Certification" with price KSh 150,000
  - Update "Commercial Drone Operations" price to KSh 130,000
  - Update "Agricultural Drone Specialist" price to KSh 100,000
  - Update "Drone Instructor Certification" price to KSh 100,000
  - Ensure consistent pricing format across all training programs
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 5. Update hardcoded contact information in components
  - Update contact information in `src/app/contact/page.tsx` with new phone and email
  - Update footer component `src/components/layout/Footer.tsx` with new contact details
  - Update any hardcoded contact references in form components
  - Ensure all tel: and mailto: links use correct new contact information
  - _Requirements: 1.1, 2.1, 4.1, 4.2, 4.3, 4.4_

- [x] 6. Implement hero section content and styling updates
  - Reduce font size of "See More. Do More. From Above." tagline by half in `src/app/page.tsx`
  - Increase "Professional Aerial Intelligence" text size by 2x and make it visually prominent
  - Update hero subtitle to new company description text
  - Implement responsive font sizing for mobile, tablet, and desktop breakpoints
  - _Requirements: 9.1, 9.2, 9.4, 9.6_

- [x] 7. Add typing animation to "Professional Aerial Intelligence"
  - Create CSS keyframe animations or implement JavaScript typing effect for "Professional Aerial Intelligence"
  - Add disappearing/reappearing animation cycle for visual interest
  - Implement prefers-reduced-motion media query to respect accessibility preferences
  - Ensure animation performance is optimized and doesn't cause layout shift
  - _Requirements: 9.3, 9.5_

- [ ] 8. Update all test files with new expected values
  - Update contact form tests in `src/__tests__/integration/forms.test.tsx` with new contact information
  - Update page tests in `src/__tests__/integration/pages.test.tsx` with new hero content and contact details
  - Update navigation tests in `src/__tests__/integration/navigation.test.tsx` with new contact information
  - Update component tests with new expected team member names and training program details
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

- [x] 9. Update API routes and form handling
  - Update contact API route in `src/app/api/contact/route.ts` to use new email for notifications
  - Update any email templates or automated responses with new contact information
  - Ensure form validation still works correctly with updated contact details
  - Test form submission functionality with new contact information
  - _Requirements: 2.3, 4.1, 4.2, 4.3, 4.4_

- [x] 10. Perform comprehensive validation and consistency check
  - Search codebase for any remaining instances of old phone number (+254 700 123 456)
  - Search codebase for any remaining instances of old email (info@vantagevertical.co.ke)
  - Verify all team member name references are updated consistently
  - Check that all training program names and prices are consistent across components
  - Validate that hero section changes are reflected properly across all screen sizes
  - _Requirements: 6.1, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_