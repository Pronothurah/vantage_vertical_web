# Design Document

## Overview

This design document outlines the systematic approach to updating contact information, company details, team member information, training programs, and hero section content across the Vantage Vertical website. The updates will ensure consistency across all components, pages, and configuration files while maintaining the existing architecture and user experience.

## Architecture

### Update Strategy
The implementation will follow a centralized data approach where possible, updating core data files first and then propagating changes to components that reference this data. For hardcoded values, we'll perform targeted replacements across the codebase.

### File Categories
1. **Configuration Files**: Environment files and configuration templates
2. **Data Files**: Centralized data exports in `src/data/index.tsx`
3. **Component Files**: React components with hardcoded values
4. **Test Files**: Unit and integration tests with mock data
5. **API Routes**: Backend endpoints that handle contact information

## Components and Interfaces

### 1. Contact Information Updates

#### Environment Files
- **Primary**: `.env.example` - Template file with contact information
- **Backend**: `backend/.env.example` - Backend environment template
- **Impact**: These serve as templates for developers setting up the application

#### Data Layer
- **File**: `src/data/index.tsx`
- **Component**: `companyInfo` object
- **Current Structure**:
```typescript
export const companyInfo = {
  name: 'Vantage Vertical',
  tagline: 'See More. Do More. From Above.',
  description: '...',
  phone: '+254 700 123 456', // TO UPDATE
  email: 'info@vantagevertical.co.ke', // TO UPDATE
  founded: '2020', // TO UPDATE to December 2022
  teamSize: '15+', // TO UPDATE to 10+
  // ... other properties
}
```

#### Component Layer
- **Contact Page**: `src/app/contact/page.tsx` - Contains hardcoded contact information
- **Footer Component**: `src/components/layout/Footer.tsx` - Displays contact info
- **Contact Forms**: Various form components that may reference contact details

### 2. Team Member Information Updates

#### Data Structure
- **File**: `src/data/index.tsx`
- **Arrays**: `teamMembers`, `instructors`, `testimonials`
- **Current Team Structure**:
```typescript
export const teamMembers = [
  {
    id: 'david-kuria',
    name: 'David Kuria', // TO UPDATE to Michel Wanjugu
    role: 'CEO & Lead Pilot',
    // ... other properties
  },
  {
    id: 'mary-wanjiku', 
    name: 'Mary Wanjiku', // TO UPDATE to Grace Wacheke
    role: 'Technical Director',
    // ... other properties
  },
  {
    id: 'james-ochieng',
    name: 'James Ochieng', // TO UPDATE to David Mutua
    role: 'Operations Manager', // TO UPDATE to include Aeronautical Engineer & Pilot
    // ... other properties
  }
  // TO ADD: Onsongo Onditi as Business Development Lead
]
```

#### Instructor Updates
- **Current**: Derived from team members
- **New**: All team members double as instructors + Mike Kasio as additional instructor

### 3. Training Program Updates

#### Data Structure
- **File**: `src/data/index.tsx`
- **Array**: `trainingPrograms`
- **Updates Required**:
```typescript
export const trainingPrograms = [
  {
    id: 'basic-pilot',
    title: 'Basic Drone Pilot Certification', // TO UPDATE to 'KCAA UAS (Unmanned Aircraft System) Certification'
    price: 'KSh 50,000', // TO UPDATE to 'KSh 150,000'
    // ... other properties
  },
  {
    id: 'commercial-operations',
    title: 'Commercial Drone Operations', // Keep same
    price: 'KSh 75,000', // TO UPDATE to 'KSh 130,000'
    // ... other properties
  },
  {
    id: 'agricultural-specialist',
    title: 'Agricultural Drone Specialist', // Keep same
    price: 'KSh 100,000', // Keep same
    // ... other properties
  },
  {
    id: 'instructor-certification',
    title: 'Drone Instructor Certification', // Keep same
    price: 'KSh 150,000', // TO UPDATE to 'KSh 100,000'
    // ... other properties
  }
]
```

### 4. Hero Section Updates

#### Component Location
- **File**: `src/app/page.tsx`
- **Component**: `HeroSection`
- **Props to Update**:
```typescript
<HeroSection
  title="See More. Do More. From Above." // Reduce font size by half
  subtitle="Leading drone services company..." // TO UPDATE entire text
  tagline="Professional Aerial Intelligence" // Increase size by 2x, add animation
  // ... other props
/>
```

#### Animation Implementation
- **Library**: CSS animations or Framer Motion (if available)
- **Effect**: Typing and disappearing animation for "Professional Aerial Intelligence"
- **Accessibility**: Respect `prefers-reduced-motion` media query

## Data Models

### Updated Company Information Model
```typescript
interface CompanyInfo {
  name: string;
  tagline: string;
  description: string;
  phone: string; // +254704277687
  email: string; // vantagevarticalltd@gmail.com
  founded: string; // December 2022
  teamSize: string; // 10+
  projectsCompleted: string;
  mission: string;
  vision: string;
  values: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}
```

### Updated Team Member Model
```typescript
interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  experience: string;
  projects: string;
  specializations: string[];
  certifications: string[];
  isInstructor: boolean; // New field
}
```

### Updated Training Program Model
```typescript
interface TrainingProgram {
  id: string;
  title: string;
  level: string;
  duration: string;
  price: string; // Updated pricing
  description: string;
  objectives: string[];
  prerequisites: string[];
  certification: string;
  instructors: string[]; // Updated instructor list
}
```

## Error Handling

### Validation Strategy
1. **Data Consistency**: Ensure all references to updated information are consistent
2. **Format Validation**: Verify phone number and email formats are correct
3. **Link Validation**: Ensure `tel:` and `mailto:` links use correct formats
4. **Animation Fallbacks**: Provide static fallbacks for animated elements

### Error Prevention
1. **Search and Replace**: Use comprehensive search to find all instances
2. **Type Safety**: Leverage TypeScript to catch inconsistencies
3. **Test Updates**: Update all test files with new expected values

## Testing Strategy

### Unit Tests
- **Contact Form Tests**: Update mock data with new contact information
- **Component Tests**: Update expected values in hero section tests
- **Data Tests**: Verify data structure integrity after updates

### Integration Tests
- **Page Tests**: Update expected contact information in page tests
- **Navigation Tests**: Verify contact links work with new information
- **Form Tests**: Ensure forms work with updated contact details

### Manual Testing
- **Visual Verification**: Check all pages display updated information correctly
- **Link Testing**: Verify phone and email links work properly
- **Animation Testing**: Ensure hero animations work across devices
- **Responsive Testing**: Verify updates work on all screen sizes

## Performance Considerations

### Animation Performance
- **CSS Transforms**: Use transform and opacity for smooth animations
- **Hardware Acceleration**: Leverage GPU acceleration for animations
- **Reduced Motion**: Respect user preferences for reduced motion

### Bundle Size Impact
- **Minimal Impact**: Text updates won't significantly affect bundle size
- **Animation Libraries**: Only add animation code if not already present

## Accessibility Considerations

### Screen Reader Support
- **Semantic HTML**: Maintain proper heading hierarchy
- **ARIA Labels**: Ensure animated elements have appropriate labels
- **Focus Management**: Maintain logical tab order after updates

### Motion Sensitivity
- **Reduced Motion**: Provide static alternatives for animations
- **Animation Controls**: Allow users to pause/disable animations if needed

## SEO Impact

### Meta Data Updates
- **Page Titles**: Update any titles that reference old contact information
- **Meta Descriptions**: Update descriptions with new company positioning
- **Structured Data**: Update any structured data with new contact information

### Content Updates
- **Hero Description**: New description emphasizes East Africa positioning
- **Company Information**: Updated founding date affects company age references

## Implementation Phases

### Phase 1: Core Data Updates
1. Update `src/data/index.tsx` with all new information
2. Update environment example files
3. Update configuration files

### Phase 2: Component Updates
1. Update hardcoded values in components
2. Update contact page information
3. Update footer component

### Phase 3: Hero Section Enhancement
1. Implement font size changes
2. Add animation to "Professional Aerial Intelligence"
3. Update hero description text

### Phase 4: Test Updates
1. Update all test files with new expected values
2. Update mock data in test utilities
3. Verify all tests pass

### Phase 5: Validation
1. Search for any remaining old values
2. Test all contact functionality
3. Verify animations work properly
4. Check responsive behavior