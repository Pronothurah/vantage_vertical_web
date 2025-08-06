// Image optimization utilities for Next.js

export const imageSizes = {
  hero: '(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw',
  card: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  thumbnail: '(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw',
  avatar: '(max-width: 768px) 80px, 80px',
  logo: '(max-width: 768px) 120px, 150px',
  halfWidth: '(max-width: 768px) 100vw, 50vw',
  full: '100vw',
};

export const imageQuality = {
  hero: 85,
  card: 80,
  thumbnail: 75,
  default: 80,
};

export const imageFormats = {
  webp: 'image/webp',
  jpeg: 'image/jpeg',
  png: 'image/png',
};

export function getOptimizedImageUrl(
  src: string,
  width?: number,
  height?: number,
  quality?: number
): string {
  if (!src) return '';
  
  // If it's already an optimized URL or external URL, return as is
  if (src.startsWith('http') || src.includes('/_next/image')) {
    return src;
  }

  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality) params.set('q', quality.toString());

  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
}

export function generateBlurDataURL(width: number = 10, height: number = 10): string {
  // Generate a simple blur placeholder
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#f3f4f6'; // Gray-100
    ctx.fillRect(0, 0, width, height);
  }
  
  return canvas.toDataURL();
}