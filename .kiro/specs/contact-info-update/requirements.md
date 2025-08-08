# Requirements Document

## Introduction

This document outlines the requirements for updating the contact information across the Vantage Vertical website. The current phone number and email address need to be updated to new values throughout the application, including environment files, configuration files, form components, and any hardcoded references in the codebase.

## Requirements

### Requirement 1: Phone Number Update

**User Story:** As a website administrator, I want to update the phone number from the current value to +254704277687 across all application files, so that customers can reach us using the correct contact information.

#### Acceptance Criteria

1. WHEN the system displays contact information THEN it SHALL show the phone number as +254704277687
2. WHEN a user views environment example files THEN the system SHALL display the updated phone number as a template
3. WHEN contact forms are submitted THEN the system SHALL use the updated phone number for any automated responses or notifications
4. WHEN the phone number appears in any component or configuration THEN it SHALL be consistently formatted as +254704277687

### Requirement 2: Email Address Update

**User Story:** As a website administrator, I want to update the email address from the current value to vantagevarticalltd@gmail.com across all application files, so that customer inquiries are directed to the correct email address.

#### Acceptance Criteria

1. WHEN the system displays contact information THEN it SHALL show the email as vantagevarticalltd@gmail.com
2. WHEN environment example files are referenced THEN the system SHALL display the updated email as a template
3. WHEN contact forms are submitted THEN the system SHALL send notifications to vantagevarticalltd@gmail.com
4. WHEN SMTP configuration is set up THEN the system SHALL use the updated email for sender information where appropriate
5. WHEN the email appears in any component or configuration THEN it SHALL be consistently formatted as vantagevarticalltd@gmail.com

### Requirement 3: Configuration File Updates

**User Story:** As a developer, I want all environment and configuration files updated with the new contact information, so that the application uses the correct values in all environments.

#### Acceptance Criteria

1. WHEN environment example files are updated THEN they SHALL contain the new phone number and email values
2. WHEN backend environment files are updated THEN they SHALL reflect the new contact information
3. WHEN frontend environment files are updated THEN they SHALL use the new contact details
4. WHEN configuration files reference contact information THEN they SHALL use the updated values

### Requirement 4: Component and Code Updates

**User Story:** As a developer, I want all React components and TypeScript files that reference contact information updated, so that the UI displays the correct contact details to users.

#### Acceptance Criteria

1. WHEN contact forms render THEN they SHALL display or use the updated contact information
2. WHEN any hardcoded contact information exists in components THEN it SHALL be updated to the new values
3. WHEN contact information is displayed in the UI THEN it SHALL show the updated phone number and email
4. WHEN API routes handle contact information THEN they SHALL use the updated values for processing

### Requirement 5: Company Information Updates

**User Story:** As a website administrator, I want to update the company founded date to December 2022 and team member count to 10+ across the application, so that accurate company information is displayed to visitors.

#### Acceptance Criteria

1. WHEN the system displays company founding information THEN it SHALL show December 2022 as the founded date
2. WHEN team member information is displayed THEN it SHALL show 10+ team members
3. WHEN any dates related to company history are shown THEN they SHALL be consistent with the December 2022 founding date
4. WHEN about sections or company profiles are displayed THEN they SHALL reflect the updated founding date and team size
5. WHEN any calculations or references depend on company age THEN they SHALL be based on the December 2022 founding date

### Requirement 6: Expert Team Member Updates

**User Story:** As a website administrator, I want to update the expert team member information with the correct names and roles, so that visitors see accurate information about our leadership and expertise.

#### Acceptance Criteria

1. WHEN the system displays CEO & Lead Pilot information THEN it SHALL show Michel Wanjugu
2. WHEN the system displays Technical Director information THEN it SHALL show Grace Wacheke
3. WHEN the system displays Operations Manager information THEN it SHALL show David Mutua with additional title as Aeronautical Engineer & Pilot
4. WHEN the system displays Business Development Lead information THEN it SHALL show Onsongo Onditi
5. WHEN instructor information is displayed THEN it SHALL include Michel Wanjugu, Grace Wacheke, David Mutua, Onsongo Onditi (all doubling as instructors), and Mike Kasio as an additional instructor
6. WHEN team member profiles are shown THEN they SHALL reflect the correct roles and qualifications for each person

### Requirement 7: Instructor Information Updates

**User Story:** As a website visitor interested in training, I want to see accurate instructor information, so that I know who will be providing the training and their qualifications.

#### Acceptance Criteria

1. WHEN training or instructor sections are displayed THEN the system SHALL show all expert team members (Michel Wanjugu, Grace Wacheke, David Mutua, Onsongo Onditi) as instructors
2. WHEN instructor listings are shown THEN the system SHALL include Mike Kasio as an additional instructor
3. WHEN instructor qualifications are displayed THEN the system SHALL show appropriate titles and expertise for each instructor
4. WHEN training pages reference instructors THEN they SHALL use the updated names and roles

### Requirement 8: Training Program Updates

**User Story:** As a potential training participant, I want to see accurate training program names and pricing, so that I can make informed decisions about which courses to enroll in.

#### Acceptance Criteria

1. WHEN Basic Drone Pilot Certification is displayed THEN the system SHALL show it as "KCAA UAS (Unmanned Aircraft System) Certification" with a price of Ksh 150,000
2. WHEN Commercial Drone Operations training is displayed THEN the system SHALL show it as "Commercial Drone Operations" with a price of Ksh 130,000
3. WHEN Agricultural Drone Specialist training is displayed THEN the system SHALL show a price of Ksh 100,000
4. WHEN Drone Instructor Certification is displayed THEN the system SHALL show a price of Ksh 100,000
5. WHEN training pricing is shown THEN all prices SHALL be consistently formatted in Kenyan Shillings (Ksh)
6. WHEN training program descriptions are displayed THEN they SHALL reflect the updated program names and content

### Requirement 9: Homepage Hero Section Updates

**User Story:** As a website visitor, I want to see an engaging and properly sized hero section that clearly communicates the company's value proposition, so that I understand what services are offered and feel compelled to explore further.

#### Acceptance Criteria

1. WHEN the homepage hero section loads THEN the tagline "See More. Do More. From Above." SHALL be displayed at half its current font size
2. WHEN the homepage hero section loads THEN "Professional Aerial Intelligence" SHALL be displayed at 2x its current size with enhanced visual prominence
3. WHEN "Professional Aerial Intelligence" is displayed THEN it SHALL include animated typing and disappearing effects to create visual interest
4. WHEN the hero description is shown THEN it SHALL read "A leading Unmanned Aircraft company in East Africa that offers professional services in aerial mapping, surveillance, agritech solutions, commercial photography, and comprehensive drone training programs."
5. WHEN the hero section animations play THEN they SHALL be smooth, accessible, and not cause motion sickness for users with vestibular disorders
6. WHEN the hero section is viewed on mobile devices THEN the text sizing and animations SHALL scale appropriately for smaller screens

### Requirement 6: Cross-Application Consistency

**User Story:** As a quality assurance tester, I want to ensure that when any component or information is updated, those changes are reflected consistently across all pages and sections of the web application, so that users see uniform and accurate information regardless of where they navigate.

#### Acceptance Criteria

1. WHEN a shared component is modified THEN the system SHALL ensure the changes appear on all pages where that component is used
2. WHEN contact information is updated in one location THEN it SHALL be automatically reflected in all other locations where it appears
3. WHEN team member information is changed THEN it SHALL be consistent across about pages, training sections, and any other references
4. WHEN training program details are updated THEN they SHALL be uniform across training pages, pricing sections, and enrollment forms
5. WHEN company information is modified THEN it SHALL be consistent across all pages, components, and configurations
6. WHEN hero section changes are made THEN similar hero components on other pages SHALL maintain visual consistency

### Requirement 10: Consistency and Validation

**User Story:** As a quality assurance tester, I want to ensure all contact information and company details updates are consistent and properly formatted across the entire application, so that there are no discrepancies in how information is displayed or used.

#### Acceptance Criteria

1. WHEN searching the codebase for old contact information THEN no instances of the previous phone number or email SHALL remain
2. WHEN the phone number is displayed THEN it SHALL consistently use the format +254704277687
3. WHEN the email is displayed THEN it SHALL consistently use vantagevarticalltd@gmail.com
4. WHEN company founding date is referenced THEN it SHALL consistently show December 2022
5. WHEN team member count is displayed THEN it SHALL consistently show 10+
6. WHEN contact information is used in different contexts THEN it SHALL maintain consistent formatting and values
7. WHEN the application is tested THEN all contact-related functionality SHALL work correctly with the updated information