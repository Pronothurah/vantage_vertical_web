# Design Document

## Overview

This design document outlines the technical approach for optimizing the blog post layout on the Vantage Vertical website. The primary focus is repositioning the featured image to eliminate the visual gap between social sharing and content, while improving overall spacing and visual hierarchy throughout the blog post structure.

The optimization will maintain the existing Next.js architecture and component structure while making targeted improvements to the layout flow and spacing system.

## Architecture

### Current Blog Structure Analysis

**Existing Layout Flow:**
```
1. Breadcrumb Navigation
2. Article Header Section
   - Category Badge
   - Title (H1)
   - Excerpt
   - Meta Information (Author, Date, Read Time)
   - Social Share Component
3. [LARGE GAP - ISSUE AREA]
4. Featured Image
5. Article Content
6. Tags Section
7. Author Bio
8. Related Posts
9. Call to Action
```

**Optimized Layout Flow:**
```
1. Breadcrumb Navigation
2. Article Header Section
   - Category Badge
   - Title (H1)
   - Excerpt
   - Featured Image (MOVED HERE)
   - Meta Information (Author, Date, Read Time)
   - Social Share Component (REPOSITIONED)
3. Article Content (REDUCED GAP)
4. Tags Section
5. Author Bio
6. Related Posts
7. Call to Action
```

### Component Modifications Required

#### 1. Blog Post Page Layout (`src/app/blog/[slug]/page.tsx`)

The main changes will be made to the article header section structure:

```typescript
// Current problematic structure
<div className="text-center mb-12">
  {/* Category, Title, Excerpt, Meta, Social Share */}
</div>
<div className="relative aspect-video mb-12">
  {/* Featured Image - creates gap */}
</div>

// Optimized structure
<div className="text-center mb-8">
  {/* Category, Title, Excerpt */}
</div>
<div className="relative aspect-video mb-8">
  {/* Featured Image - moved up */}
</div>
<div className="text-center mb-8">
  {/* Meta Information, Social Share */}
</div>
```

#### 2. Spacing System Optimization

**Current Spacing Issues:**
- `mb-12` (48px) after header content
- `mb-12` (48px) after featured image
- Creates 96px total gap before content

**Optimized Spacing:**
- `mb-8` (32px) after title section
- `mb-8` (32px) after featured image
- `mb-8` (32px) after meta/social section
- Total: 96px distributed more evenly

### Layout Responsive Behavior

#### Desktop Layout (1024px+)
```css
.blog-header-section {
  max-width: 4rem; /* 64rem = 1024px */
  margin: 0 auto;
  padding: 0 1rem;
}

.featured-image-container {
  aspect-ratio: 16/9;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-bottom: 2rem; /* 32px */
}

.meta-social-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem; /* 24px */
  margin-bottom: 2rem; /* 32px */
}
```

#### Tablet Layout (768px - 1023px)
```css
.blog-header-section {
  padding: 0 2rem;
}

.featured-image-container {
  margin-bottom: 1.5rem; /* 24px */
}

.meta-social-section {
  gap: 1rem; /* 16px */
  margin-bottom: 1.5rem; /* 24px */
}
```

#### Mobile Layout (< 768px)
```css
.blog-header-section {
  padding: 0 1rem;
}

.featured-image-container {
  aspect-ratio: 4/3; /* More square for mobile */
  margin-bottom: 1rem; /* 16px */
}

.meta-social-section {
  gap: 0.75rem; /* 12px */
  margin-bottom: 1rem; /* 16px */
}

.social-share-mobile {
  flex-direction: row;
  justify-content: center;
  flex-wrap: wrap;
}
```

## Components and Interfaces

### Modified Blog Post Page Component

```typescript
interface BlogPostLayoutProps {
  post: BlogPost;
  author: Author | null;
  category: BlogCategory | undefined;
  relatedPosts: BlogPost[];
}

interface BlogHeaderSectionProps {
  post: BlogPost;
  author: Author | null;
  category: BlogCategory | undefined;
}

interface BlogMetaSectionProps {
  author: Author | null;
  publishedAt: string;
  readTime: number;
  socialShareProps: SocialShareProps;
}
```

### Enhanced Social Share Component

The social share component may need minor adjustments for the new positioning:

```typescript
interface SocialShareProps {
  url: string;
  title: string;
  description: string;
  variant?: 'header' | 'inline' | 'sidebar'; // Add variant for different contexts
  size?: 'small' | 'medium' | 'large';
}
```

### Image Optimization Enhancements

```typescript
interface FeaturedImageProps {
  src: string;
  alt: string;
  title: string;
  priority?: boolean;
  className?: string;
  sizes: string;
  quality: number;
}

// Enhanced image loading with better fallback handling
const FeaturedImageComponent = ({
  src,
  alt,
  title,
  priority = true,
  className = "",
  sizes,
  quality
}: FeaturedImageProps) => {
  return (
    <div className={`relative aspect-video overflow-hidden rounded-lg ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority={priority}
        quality={quality}
        sizes={sizes}
        fallbackSrc="/images/placeholder-drone.svg"
        onError={(e) => {
          console.warn(`Failed to load featured image: ${src}`);
        }}
      />
    </div>
  );
};
```

## Data Models

### Blog Post Layout Configuration

```typescript
interface BlogLayoutConfig {
  spacing: {
    headerBottom: string;
    imageBottom: string;
    metaBottom: string;
    sectionGap: string;
  };
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  imageAspectRatios: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
}

const blogLayoutConfig: BlogLayoutConfig = {
  spacing: {
    headerBottom: 'mb-8', // 32px
    imageBottom: 'mb-8',  // 32px
    metaBottom: 'mb-8',   // 32px
    sectionGap: 'pb-16'   // 64px
  },
  breakpoints: {
    mobile: 768,
    tablet: 1024,
    desktop: 1280
  },
  imageAspectRatios: {
    desktop: 'aspect-video',    // 16:9
    tablet: 'aspect-video',     // 16:9
    mobile: 'aspect-[4/3]'      // 4:3
  }
};
```

## Error Handling

### Image Loading Error Handling

```typescript
const handleImageError = (error: Event, fallbackSrc: string) => {
  const img = error.target as HTMLImageElement;
  if (img.src !== fallbackSrc) {
    img.src = fallbackSrc;
    console.warn('Featured image failed to load, using fallback');
  }
};

const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.classList.add('loaded');
  // Remove any loading skeleton or placeholder
};
```

### Layout Shift Prevention

```typescript
// Prevent cumulative layout shift during image loading
const preventLayoutShift = {
  // Reserve space for image before it loads
  minHeight: 'min-h-[200px] md:min-h-[300px] lg:min-h-[400px]',
  
  // Use skeleton loader during image load
  skeleton: 'animate-pulse bg-gray-200',
  
  // Smooth transition when image loads
  transition: 'transition-opacity duration-300'
};
```

## Testing Strategy

### Visual Regression Testing

1. **Layout Comparison Tests**
   - Before/after screenshots of blog post layouts
   - Cross-browser compatibility testing
   - Mobile responsiveness validation

2. **Spacing Verification**
   - Measure actual pixel spacing between elements
   - Verify consistent spacing across different screen sizes
   - Test with various content lengths

### Performance Testing

1. **Core Web Vitals Impact**
   - Measure Cumulative Layout Shift (CLS) improvements
   - Verify Largest Contentful Paint (LCP) isn't negatively affected
   - Test First Input Delay (FID) for interactive elements

2. **Image Loading Performance**
   - Test featured image loading times
   - Verify lazy loading still works correctly
   - Measure impact on overall page load speed

### Accessibility Testing

1. **Screen Reader Navigation**
   - Test reading order with repositioned elements
   - Verify proper heading hierarchy
   - Check focus management for interactive elements

2. **Keyboard Navigation**
   - Test tab order through repositioned elements
   - Verify social share buttons remain accessible
   - Check skip links and navigation shortcuts

## Visual Design Specifications

### Spacing Scale

```css
/* Tailwind spacing scale used */
.spacing-xs { margin-bottom: 0.5rem; }  /* 8px */
.spacing-sm { margin-bottom: 1rem; }    /* 16px */
.spacing-md { margin-bottom: 1.5rem; }  /* 24px */
.spacing-lg { margin-bottom: 2rem; }    /* 32px */
.spacing-xl { margin-bottom: 3rem; }    /* 48px */
.spacing-2xl { margin-bottom: 4rem; }   /* 64px */
```

### Typography Hierarchy

```css
/* Blog post typography with improved spacing */
.blog-title {
  @apply text-4xl md:text-5xl font-bold mb-6 leading-tight;
}

.blog-excerpt {
  @apply text-xl text-gray-600 mb-8 leading-relaxed;
}

.blog-meta {
  @apply text-gray-600 mb-6;
}

.blog-content {
  @apply prose prose-lg max-w-none;
}
```

### Component Styling

```css
/* Featured image container */
.featured-image-container {
  @apply relative overflow-hidden rounded-lg mb-8;
  aspect-ratio: 16/9;
}

@media (max-width: 768px) {
  .featured-image-container {
    aspect-ratio: 4/3;
    @apply mb-6;
  }
}

/* Social share positioning */
.social-share-header {
  @apply flex justify-center items-center gap-4 mb-8;
}

@media (max-width: 640px) {
  .social-share-header {
    @apply flex-wrap gap-3 mb-6;
  }
}
```

This design provides a comprehensive approach to fixing the blog layout issues while maintaining the existing architecture and improving the overall user experience. The changes are focused and targeted to address the specific spacing and positioning problems identified.