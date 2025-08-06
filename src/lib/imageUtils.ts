/**
 * Image optimization utilities for Vantage Vertical website
 */

// Generate a blur data URL for better loading experience
export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  // Create a simple gray blur placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// Generate responsive image sizes for different use cases
export const imageSizes = {
  hero: '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw',
  card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  thumbnail: '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw',
  avatar: '(max-width: 768px) 80px, 120px',
  logo: '(max-width: 768px) 150px, 200px',
  fullWidth: '100vw',
  halfWidth: '50vw',
  thirdWidth: '33vw',
};

// Common aspect ratios for drone imagery
export const aspectRatios = {
  square: 'aspect-square',
  video: 'aspect-video', // 16:9
  portrait: 'aspect-[3/4]',
  landscape: 'aspect-[4/3]',
  wide: 'aspect-[21/9]',
  ultraWide: 'aspect-[32/9]',
};

// Image quality settings for different use cases
export const imageQuality = {
  thumbnail: 60,
  card: 75,
  hero: 85,
  gallery: 90,
  print: 95,
};

// Fallback images for different contexts
export const fallbackImages = {
  drone: '/images/placeholder-drone.jpg',
  hero: '/images/placeholder-hero.jpg',
  avatar: '/images/placeholder-avatar.jpg',
  logo: '/images/placeholder-logo.jpg',
  blog: '/images/placeholder-blog.jpg',
};

// Optimize Cloudinary URLs (if using Cloudinary)
export function optimizeCloudinaryUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'scale' | 'crop';
  } = {}
): string {
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options;

  // Extract the base URL and image path
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const [baseUrl, imagePath] = parts;
  
  // Build transformation parameters
  const transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  return `${baseUrl}/upload/${transformations.join(',')}/${imagePath}`;
}

// Check if image is from external source
export function isExternalImage(src: string): boolean {
  return src.startsWith('http') && !src.includes(process.env.NEXT_PUBLIC_SITE_URL || '');
}

// Get optimized image props for Next.js Image component
export function getOptimizedImageProps(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    priority?: boolean;
    sizes?: string;
    aspectRatio?: keyof typeof aspectRatios;
  } = {}
) {
  const {
    width,
    height,
    quality = imageQuality.card,
    priority = false,
    sizes,
    aspectRatio
  } = options;

  return {
    src,
    width,
    height,
    quality,
    priority,
    sizes: sizes || (width ? `${width}px` : imageSizes.card),
    placeholder: 'blur' as const,
    blurDataURL: generateBlurDataURL(width, height),
    className: aspectRatio ? aspectRatios[aspectRatio] : undefined,
  };
}

// Preload critical images
export function preloadImage(src: string): void {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }
}

// Lazy load images with Intersection Observer
export function createImageObserver(
  callback: (entry: IntersectionObserverEntry) => void,
  options: IntersectionObserverInit = {}
): IntersectionObserver | null {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    rootMargin: '50px 0px',
    threshold: 0.1,
    ...options,
  });
}