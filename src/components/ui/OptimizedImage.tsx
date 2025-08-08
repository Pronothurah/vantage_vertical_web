'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import ImageSkeleton from './ImageSkeleton';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'wide';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
  preventLayoutShift?: boolean;
  showSkeleton?: boolean;
  skeletonText?: string;
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
};

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 85,
  sizes,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  onError,
  aspectRatio,
  objectFit = 'cover',
  loading = 'lazy',
  fallbackSrc = '/images/placeholder-drone.svg',
  preventLayoutShift = true,
  showSkeleton = true,
  skeletonText = 'Loading image...',
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Maximum retry attempts for failed images
  const MAX_RETRY_ATTEMPTS = 2;

  // Update src when prop changes
  useEffect(() => {
    if (src !== imgSrc && retryCount === 0) {
      setImgSrc(src);
      setIsLoading(true);
      setHasError(false);
    }
  }, [src, imgSrc, retryCount]);

  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || (
    fill 
      ? '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      : width 
        ? `(max-width: 768px) ${Math.min(width, 768)}px, ${width}px`
        : '100vw'
  );

  // Generate blur placeholder for better loading experience
  const generateBlurDataURL = (w: number = 10, h: number = 10) => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      // Return a static base64 blur placeholder for SSR
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHZpZXdCb3g9IjAgMCAxMCAxMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZjNmNGY2Ii8+Cjwvc3ZnPgo=';
    }
    
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6'; // Gray-100
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  const handleLoad = () => {
    setIsLoading(false);
    setRetryCount(0); // Reset retry count on successful load
    
    // Performance monitoring - measure image load time
    if (imageRef.current) {
      const loadTime = performance.now();
      console.log(`Image loaded successfully in ${loadTime.toFixed(2)}ms: ${imgSrc}`);
    }
    
    onLoad?.();
  };

  const handleError = () => {
    console.warn(`Image failed to load (attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS + 1}): ${imgSrc}`);
    
    if (retryCount < MAX_RETRY_ATTEMPTS && imgSrc === src) {
      // Retry with exponential backoff
      const retryDelay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s...
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        setIsLoading(true);
        setHasError(false);
        // Force image reload by adding timestamp
        setImgSrc(`${src}?retry=${retryCount + 1}&t=${Date.now()}`);
      }, retryDelay);
      return;
    }
    
    setHasError(true);
    setIsLoading(false);
    
    // Try fallback if not already using it
    if (imgSrc !== fallbackSrc) {
      setImgSrc(fallbackSrc);
      setRetryCount(0); // Reset retry count for fallback
    }
    
    onError?.();
  };

  const imageClasses = cn(
    'transition-opacity duration-300',
    objectFit === 'cover' && 'object-cover',
    objectFit === 'contain' && 'object-contain',
    objectFit === 'fill' && 'object-fill',
    objectFit === 'none' && 'object-none',
    objectFit === 'scale-down' && 'object-scale-down',
    isLoading && 'opacity-0',
    !isLoading && 'opacity-100',
    className
  );

  const containerClasses = cn(
    'relative overflow-hidden',
    aspectRatio && aspectRatioClasses[aspectRatio],
    isLoading && 'animate-pulse bg-gray-200'
  );

  // For fill images, wrap in a container with layout shift prevention
  if (fill) {
    return (
      <div 
        ref={containerRef}
        className={cn(
          'relative overflow-hidden',
          aspectRatio && aspectRatioClasses[aspectRatio],
          // Prevent layout shift with fixed dimensions
          preventLayoutShift && [
            'min-h-[200px]',
            'md:min-h-[300px]',
            'lg:min-h-[400px]'
          ]
        )}
      >
        {/* Enhanced skeleton loading */}
        {isLoading && showSkeleton && (
          <ImageSkeleton
            className="absolute inset-0"
            aspectRatio={aspectRatio}
            showIcon={true}
            showText={retryCount > 0}
            text={retryCount > 0 ? `Retrying... (${retryCount}/${MAX_RETRY_ATTEMPTS})` : skeletonText}
            animate={true}
          />
        )}

        <Image
          ref={imageRef}
          src={imgSrc}
          alt={alt}
          fill
          className={cn(
            imageClasses,
            // Smooth transition when loading completes
            'transition-all duration-500 ease-out',
            isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
          )}
          priority={priority}
          quality={quality}
          sizes={responsiveSizes}
          placeholder={placeholder}
          blurDataURL={blurDataURL || generateBlurDataURL()}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : loading}
          // Add performance hints
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />

        {/* Enhanced error state */}
        {hasError && imgSrc === fallbackSrc && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center text-gray-500 p-4">
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
            <p className="text-sm font-medium text-gray-600 mb-1 text-center">Image unavailable</p>
            <p className="text-xs text-gray-400 text-center leading-relaxed">
              Failed to load after {MAX_RETRY_ATTEMPTS + 1} attempts
            </p>
          </div>
        )}
      </div>
    );
  }

  // For fixed size images with layout shift prevention
  return (
    <div 
      className={cn(
        'relative',
        aspectRatio && aspectRatioClasses[aspectRatio],
        // Prevent layout shift for fixed size images
        preventLayoutShift && width && height && `min-w-[${width}px] min-h-[${height}px]`
      )}
    >
      {/* Enhanced skeleton loading for fixed size images */}
      {isLoading && showSkeleton && (
        <ImageSkeleton
          className="absolute inset-0"
          aspectRatio={aspectRatio}
          showIcon={true}
          showText={retryCount > 0}
          text={retryCount > 0 ? `Retrying... (${retryCount}/${MAX_RETRY_ATTEMPTS})` : skeletonText}
          animate={true}
        />
      )}

      <Image
        ref={imageRef}
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          imageClasses,
          // Smooth transition when loading completes
          'transition-all duration-500 ease-out',
          isLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        )}
        priority={priority}
        quality={quality}
        sizes={responsiveSizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL || generateBlurDataURL(width, height)}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? 'eager' : loading}
        // Add performance hints
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />

      {/* Enhanced error state for fixed size images */}
      {hasError && imgSrc === fallbackSrc && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center text-gray-500 p-2">
          <div className="w-8 h-8 mb-2 text-gray-400" aria-hidden="true">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-600 text-center">Image unavailable</p>
          <p className="text-xs text-gray-400 text-center">
            Failed after {MAX_RETRY_ATTEMPTS + 1} attempts
          </p>
        </div>
      )}
    </div>
  );
}