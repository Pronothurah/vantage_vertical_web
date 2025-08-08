'use client';

import { useState } from 'react';
import { OptimizedImage } from '@/components/ui';
import ImageErrorBoundary from '@/components/ui/ImageErrorBoundary';
import { imageSizes, imageQuality } from '@/lib/imageUtils';
import { cn } from '@/lib/utils';

interface FeaturedImageSectionProps {
  src: string;
  alt: string;
  title: string;
  priority?: boolean;
  className?: string;
  onLoad?: () => void;
  onError?: (error: Event) => void;
}

/**
 * FeaturedImageSection Component
 * 
 * A dedicated component for blog post featured images with:
 * - Responsive aspect ratios (16:9 for desktop/tablet, 4:3 for mobile)
 * - Enhanced error handling with fallback image loading
 * - Proper accessibility attributes
 * - Loading states and smooth transitions
 * - Performance optimizations to prevent layout shift
 */
export default function FeaturedImageSection({
  src,
  alt,
  title,
  priority = true,
  className = '',
  onLoad,
  onError,
}: FeaturedImageSectionProps) {
  const handleImageLoad = () => {
    // Internal logging for analytics/monitoring
    console.log(`Featured image loaded successfully: ${src}`);
    
    // Call optional external handler if provided
    onLoad?.();
  };

  const handleImageError = () => {
    console.warn(`Featured image failed to load: ${src}`);
    
    // Call optional external handler if provided
    onError?.(new Event('error'));
  };

  const handleErrorBoundaryError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('FeaturedImageSection error boundary caught:', error, errorInfo);
    
    // In production, send to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: errorReportingService.captureException(error, { extra: errorInfo });
    }
  };

  return (
    <ImageErrorBoundary
      onError={handleErrorBoundaryError}
      fallback={
        <div 
          className={cn(
            'relative overflow-hidden rounded-lg',
            'aspect-[4/3] md:aspect-video',
            'min-h-[200px] md:min-h-[300px] lg:min-h-[400px]',
            'bg-gradient-to-br from-gray-50 to-gray-100',
            'flex flex-col items-center justify-center text-gray-500',
            'shadow-sm border border-gray-100',
            className
          )}
          role="img"
          aria-label="Featured image failed to load"
        >
          <div className="w-16 h-16 mb-3 text-gray-400" aria-hidden="true">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600 mb-1">Featured image unavailable</p>
          <p className="text-xs text-gray-400 text-center px-4 leading-relaxed">
            Unable to load image for "{title}"
          </p>
        </div>
      }
    >
      <section 
        className={cn(
          'featured-image-section',
          className
        )}
        aria-label="Featured image"
      >
        <div className={cn(
          'relative overflow-hidden rounded-lg',
          // Responsive aspect ratios
          'aspect-[4/3]', // 4:3 for mobile (default)
          'md:aspect-video', // 16:9 for tablet and desktop
          // Enhanced visual hierarchy
          'shadow-sm hover:shadow-md transition-shadow duration-300',
          'border border-gray-100'
        )}>
          <OptimizedImage
            src={src}
            alt={alt}
            fill
            className={cn(
              'object-cover',
              // Subtle hover effect for better interactivity
              'hover:scale-105 transition-transform duration-500 ease-out'
            )}
            priority={priority}
            quality={imageQuality.hero}
            sizes={imageSizes.hero}
            onLoad={handleImageLoad}
            onError={handleImageError}
            fallbackSrc="/images/placeholder-drone.svg"
            preventLayoutShift={true}
            showSkeleton={true}
            skeletonText={`Loading featured image for ${title}...`}
            aspectRatio="video"
          />
          
          {/* Image overlay for better text contrast when needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          
          {/* Accessibility: Enhanced screen reader support */}
          <div className="sr-only">
            Featured image for blog post: {title}
          </div>
        </div>
      </section>
    </ImageErrorBoundary>
  );
}