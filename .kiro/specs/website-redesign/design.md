# Design Document

## Overview

This design document outlines the technical architecture and user experience design for rebuilding the Vantage Vertical website. The redesign will migrate from the current React + Node.js stack to a modern Next.js application with Tailwind CSS, while maintaining the existing page structure and significantly improving content quality, visual design, and SEO performance.

The design focuses on creating a professional, high-converting website that effectively showcases Vantage Vertical's drone services, establishes trust with potential customers, and drives lead generation through strategic content placement and compelling calls-to-action.

## Architecture

### Technology Stack Migration

**Current Stack:**
- Frontend: React 18 with React Router
- Backend: Node.js/Express with MongoDB
- Styling: Custom CSS
- Deployment: Traditional hosting

**New Stack:**
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom brand configuration
- **Content Management**: Markdown-based blog with optional Sanity CMS integration
- **Image Optimization**: Next.js Image component with Cloudinary integration
- **Deployment**: Vercel (recommended) or Netlify
- **Database**: MongoDB (retained for contact forms and potential e-commerce)

### Project Structure

```
vantage_vertical_web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with navbar/footer
│   │   ├── page.tsx           # Home page
│   │   ├── about/page.tsx     # About page
│   │   ├── portfolio/page.tsx # Portfolio page
│   │   ├── technology/page.tsx# Technology page
│   │   ├── training/page.tsx  # Training page
│   │   ├── blog/              # Blog section
│   │   │   ├── page.tsx       # Blog listing
│   │   │   └── [slug]/page.tsx# Individual blog posts
│   │   ├── contact/page.tsx   # Contact page
│   │   ├── drones/page.tsx    # Drone shop page
│   │   └── api/               # API routes
│   │       ├── contact/route.ts
│   │       └── newsletter/route.ts
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components
│   │   ├── layout/           # Layout components
│   │   ├── sections/         # Page sections
│   │   └── forms/            # Form components
│   ├── lib/                  # Utilities and configurations
│   ├── styles/               # Global styles
│   └── data/                 # Static data and content
├── public/                   # Static assets
├── content/                  # Markdown blog posts
└── tailwind.config.js        # Tailwind configuration
```

### Performance Optimizations

1. **Server-Side Rendering (SSR)**: All pages will use Next.js SSR for improved SEO and initial load performance
2. **Image Optimization**: Next.js Image component with lazy loading and WebP conversion
3. **Code Splitting**: Automatic code splitting by Next.js for optimal bundle sizes
4. **Static Generation**: Blog posts and static content will use Static Site Generation (SSG)
5. **CDN Integration**: Cloudinary for optimized drone imagery and video content

## Components and Interfaces

### Core Layout Components

#### 1. Navigation Component (`components/layout/Navbar.tsx`)
```typescript
interface NavbarProps {
  isScrolled: boolean;
  currentPath: string;
}

// Features:
// - Sticky navigation with background change on scroll
// - Mobile-responsive hamburger menu
// - Active page highlighting
// - Brand logo with home navigation
// - Prominent CTA button
```

#### 2. Footer Component (`components/layout/Footer.tsx`)
```typescript
interface FooterProps {
  contactInfo: ContactInfo;
  socialLinks: SocialLink[];
  quickLinks: NavLink[];
}

// Features:
// - Company information and KCAA certification display
// - Service links and contact information
// - Social media integration
// - Newsletter signup form
// - Copyright and legal information
```

### Page-Specific Components

#### 3. Hero Section Component (`components/sections/HeroSection.tsx`)
```typescript
interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
  ctaText: string;
  ctaLink: string;
  tagline?: string;
}

// Features:
// - Full-width background with drone imagery
// - Animated text entrance effects
// - Multiple CTA options
// - Responsive typography scaling
// - Video background support
```

#### 4. Service Card Component (`components/sections/ServiceCard.tsx`)
```typescript
interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  image?: string;
}

// Features:
// - Hover animations and effects
// - Icon integration
// - Feature list display
// - Call-to-action integration
```

#### 5. Testimonial Component (`components/sections/TestimonialSlider.tsx`)
```typescript
interface TestimonialProps {
  testimonials: Testimonial[];
  autoPlay: boolean;
  showMetrics: boolean;
}

interface Testimonial {
  name: string;
  company: string;
  content: string;
  image?: string;
  metrics?: {
    improvement: string;
    value: string;
  };
}
```

### Form Components

#### 6. Contact Form Component (`components/forms/ContactForm.tsx`)
```typescript
interface ContactFormProps {
  variant: 'full' | 'inline' | 'modal';
  services: ServiceOption[];
  onSubmit: (data: ContactFormData) => Promise<void>;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
}
```

### Content Management Interfaces

#### 7. Blog Post Interface
```typescript
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  tags: string[];
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
}
```

#### 8. Drone Product Interface
```typescript
interface DroneProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  specifications: DroneSpec[];
  images: string[];
  description: string;
  inStock: boolean;
  category: 'commercial' | 'agricultural' | 'surveillance' | 'photography';
}
```

## Data Models

### Content Data Structure

#### Services Data Model
```typescript
interface Service {
  id: string;
  name: string;
  category: 'mapping' | 'surveillance' | 'agritech' | 'commercial' | 'training';
  description: string;
  features: string[];
  benefits: string[];
  targetKeywords: string[];
  pricing: {
    startingPrice: number;
    pricingModel: 'per-hour' | 'per-project' | 'subscription';
  };
  caseStudies: CaseStudy[];
}
```

#### Industry Data Model
```typescript
interface Industry {
  name: string;
  slug: string;
  description: string;
  services: string[];
  benefits: string[];
  caseStudies: CaseStudy[];
  targetKeywords: string[];
}

// Industries: Agriculture, Security, Construction, Real Estate, Events
```

### SEO Data Structure

#### Page SEO Model
```typescript
interface PageSEO {
  title: string;
  metaDescription: string;
  keywords: string[];
  openGraph: {
    title: string;
    description: string;
    image: string;
    type: string;
  };
  structuredData: any; // JSON-LD schema markup
}
```

## Error Handling

### Client-Side Error Handling

1. **Form Validation Errors**
   - Real-time validation with clear error messages
   - Field-level validation with visual indicators
   - Success states with confirmation messages

2. **API Communication Errors**
   - Network error handling with retry mechanisms
   - Graceful degradation for offline scenarios
   - Loading states and error boundaries

3. **Image Loading Errors**
   - Fallback images for failed drone photography
   - Progressive loading with blur placeholders
   - Alt text for accessibility compliance

### Server-Side Error Handling

1. **API Route Error Handling**
   - Structured error responses with appropriate HTTP status codes
   - Logging integration for monitoring and debugging
   - Rate limiting for contact form submissions

2. **Content Loading Errors**
   - Fallback content for missing blog posts or services
   - 404 pages with helpful navigation options
   - Graceful handling of CMS connectivity issues

## Testing Strategy

### Unit Testing
- **Component Testing**: Jest and React Testing Library for all UI components
- **Utility Function Testing**: Test all helper functions and data transformations
- **API Route Testing**: Test all Next.js API routes with mock data

### Integration Testing
- **Page Rendering**: Test complete page renders with all components
- **Form Submissions**: End-to-end testing of contact and newsletter forms
- **Navigation Flow**: Test user journeys through the site

### Performance Testing
- **Lighthouse Audits**: Automated performance, accessibility, and SEO scoring
- **Core Web Vitals**: Monitor LCP, FID, and CLS metrics
- **Load Testing**: Test API endpoints under expected traffic loads

### Accessibility Testing
- **Screen Reader Compatibility**: Test with NVDA and JAWS
- **Keyboard Navigation**: Ensure all interactive elements are keyboard accessible
- **Color Contrast**: Verify WCAG 2.1 AA compliance for all text/background combinations

## Visual Design System

### Brand Color Implementation

```css
/* Tailwind CSS Configuration */
colors: {
  primary: '#D72638',      // Vantage Red - CTAs, highlights
  secondary: '#000000',    // Black - text, headers
  background: '#FFFFFF',   // White - main background
  gray: '#343A40',         // Steel Gray - secondary text
  accent: '#DCCA87',       // Golden - special highlights
  charcoal: '#212529',     // Dark backgrounds, footers
  deepBlue: '#1E3A8A',     // Deep Blue - navbar hover effects
}
```

### Typography Scale

```css
/* Font Configuration */
fontFamily: {
  heading: ['Poppins', 'sans-serif'],  // Bold, modern headings
  body: ['Inter', 'sans-serif'],       // Clean, readable body text
}

/* Typography Scale */
text-xs: 12px    // Small labels, captions
text-sm: 14px    // Body text, descriptions
text-base: 16px  // Default body text
text-lg: 18px    // Large body text, subheadings
text-xl: 20px    // Section subheadings
text-2xl: 24px   // Page subheadings
text-3xl: 30px   // Section headings
text-4xl: 36px   // Page headings
text-5xl: 48px   // Hero headings
text-6xl: 60px   // Large hero text
```

### Component Design Patterns

#### Button Styles
```css
/* Primary CTA Button */
.btn-primary {
  @apply bg-primary text-white px-6 py-3 rounded-lg font-semibold 
         hover:bg-red-700 transition-colors duration-200 
         focus:ring-2 focus:ring-primary focus:ring-offset-2;
}

/* Secondary Button */
.btn-secondary {
  @apply border-2 border-primary text-primary px-6 py-3 rounded-lg 
         font-semibold hover:bg-primary hover:text-white 
         transition-all duration-200;
}
```

#### Card Components
```css
.service-card {
  @apply bg-white rounded-xl shadow-lg p-6 hover:shadow-xl 
         transition-shadow duration-300 border border-gray-100;
}

.testimonial-card {
  @apply bg-gray-50 rounded-lg p-6 relative 
         before:content-['"'] before:text-4xl before:text-primary 
         before:absolute before:top-2 before:left-4;
}
```

### Responsive Design Breakpoints

```css
/* Tailwind Breakpoints */
sm: 640px   // Mobile landscape
md: 768px   // Tablet
lg: 1024px  // Desktop
xl: 1280px  // Large desktop
2xl: 1536px // Extra large screens
```

### Animation and Interaction Design

#### Scroll Animations
- Fade-in animations for service cards
- Parallax effects for hero backgrounds
- Progress indicators for long-form content

#### Hover Effects
- Subtle scale transforms on interactive elements
- Color transitions on buttons and links
- Image overlay effects on portfolio items

#### Loading States
- Skeleton screens for content loading
- Progressive image loading with blur effects
- Smooth transitions between page states

This design provides a comprehensive foundation for building a modern, high-performing website that effectively showcases Vantage Vertical's drone services while maintaining excellent user experience and search engine optimization.