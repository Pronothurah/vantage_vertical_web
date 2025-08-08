'use client';

import { cn } from '@/lib/utils';

interface ImageSkeletonProps {
  className?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'landscape' | 'wide';
  showIcon?: boolean;
  showText?: boolean;
  text?: string;
  animate?: boolean;
}

const aspectRatioClasses = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[16/9]',
};

/**
 * ImageSkeleton Component
 * 
 * A skeleton loading component for images that prevents layout shift
 * and provides visual feedback during image loading.
 */
export default function ImageSkeleton({
  className = '',
  aspectRatio = 'video',
  showIcon = true,
  showText = false,
  text = 'Loading image...',
  animate = true,
}: ImageSkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-gray-200',
        aspectRatio && aspectRatioClasses[aspectRatio],
        animate && 'animate-pulse',
        className
      )}
      role="img"
      aria-label="Loading image"
    >
      {/* Gradient overlay for visual depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300" />
      
      {/* Loading content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showIcon && (
          <div 
            className={cn(
              'w-12 h-12 mb-3 text-gray-400',
              animate && 'animate-spin'
            )}
            aria-hidden="true"
            style={{ animationDuration: animate ? '2s' : undefined }}
          >
            <svg 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
          </div>
        )}
        
        {showText && (
          <div className="text-center px-4">
            <p className="text-sm text-gray-500 font-medium">
              {text}
            </p>
            
            {/* Loading dots animation */}
            <div className="flex justify-center mt-2 space-x-1">
              <div 
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '0ms' }}
              />
              <div 
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <div 
                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Shimmer effect for enhanced loading animation */}
      {animate && (
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
      
      {/* Screen reader content */}
      <span className="sr-only">
        {text}
      </span>
    </div>
  );
}

/* Add shimmer keyframe to global CSS if not already present */
declare global {
  interface CSSStyleDeclaration {
    '--shimmer-duration'?: string;
  }
}