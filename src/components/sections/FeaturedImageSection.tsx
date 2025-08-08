'use client';

import { useState } from 'react';
import { OptimizedImage } from '@/components/ui';
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleImageLoad = () => {
    setIsLoading(false);
    
    // Internal logging for analytics/monitoring
    console.log(`Featured image loaded successfully: ${src}`);
    
    // Call optional external handler if provided
    onLoad?.();
  };

  const handleImageError = (error: Event) => {
    setHasError(true);
    setIsLoading(false);
    
    // Try fallback image if not already using it
    if (currentSrc !== '/images/placeholder-drone.svg') {
      setCurrentSrc('/images/placeholder-drone.svg');
      setHasError(false); // Reset error state to try fallback
      setIsLoading(true);
      console.warn(`Featured image failed to load, trying fallback: ${src}`);
    } else {
      // Fallback also failed
      console.error(`Featured image and fallback both failed to load: ${src}`);
    }
    
    // Call optional external handler if provided
    onError?.(error);
  };

  return (
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
        // Prevent layout shift during loading with fixed dimensions
        'min-h-[200px]',
        'md:min-h-[300px]',
        'lg:min-h-[400px]',
        // Enhanced visual hierarchy
        'shadow-sm hover:shadow-md transition-shadow duration-300',
        'border border-gray-100'
      )}>
        <OptimizedImage
          src={currentSrc}
          alt={alt}
          fill
          className={cn(
            'object-cover',
            // Smooth loading transitions
            'blog-image-loading',
            isLoading ? 'blog-image-loading-state' : 'blog-image-loaded',
            // Subtle hover effect for better interactivity
            'hover:scale-105 transition-transform duration-500 ease-out'
          )}
          priority={priority}
          quality={imageQuality.hero}
          sizes={imageSizes.hero}
          onLoad={handleImageLoad}
          onError={handleImageError}
          fallbackSrc="/images/placeholder-drone.svg"
        />
        
        {/* Enhanced loading skeleton with smooth animation */}
        {isLoading && (
          <div 
            className={cn(
              'absolute inset-0 flex items-center justify-center',
              'blog-skeleton-image',
              'transition-opacity duration-300 ease-in-out'
            )}
            aria-label="Loading featured image"
          >
            {/* Animated loading icon */}
            <div className="w-16 h-16 text-gray-400 animate-pulse" aria-hidden="true">
              <svg 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                className="animate-spin"
                style={{ animationDuration: '2s' }}
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={1.5} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
            
            {/* Loading text for screen readers */}
            <span className="sr-only">Loading featured image for {title}</span>
            
            {/* Visual loading indicator */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-gray-600 text-center">
                Loading image...
              </div>
            </div>
          </div>
        )}

        {/* Enhanced error state with better visual feedback */}
        {hasError && currentSrc === '/images/placeholder-drone.svg' && (
          <div 
            className={cn(
              'absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100',
              'flex flex-col items-center justify-center text-gray-500',
              'transition-opacity duration-300 ease-in-out'
            )}
            role="img"
            aria-label="Featured image unavailable"
          >
            <div className="w-16 h-16 mb-3 text-gray-400" aria-hidden="true">
              <svg 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                className="animate-pulse"
              >
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
            
            {/* Fallback visual element */}
            <div className="absolute inset-0 opacity-5">
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-red-600/20"></div>
            </div>
          </div>
        )}

        {/* Accessibility: Enhanced screen reader support */}
        <div className="sr-only">
          Featured image for blog post: {title}. 
          {isLoading ? 'Currently loading.' : hasError ? 'Failed to load.' : 'Image loaded successfully.'}
        </div>
        
        {/* Image overlay for better text contrast when needed */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </section>
  );
}