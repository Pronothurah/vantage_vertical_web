'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { OptimizedImage } from '@/components/ui';
import { imageSizes, imageQuality } from '@/lib/imageUtils';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  backgroundVideo?: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  tagline?: string;
  className?: string;
}

export default function HeroSection({
  title,
  subtitle,
  backgroundImage,
  backgroundVideo,
  ctaText,
  ctaLink,
  secondaryCtaText,
  secondaryCtaLink,
  tagline,
  className = ''
}: HeroSectionProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className={`relative min-h-screen flex items-center justify-center overflow-hidden ${className}`}>
      {/* Background Media */}
      <div className="absolute inset-0 z-0">
        {backgroundVideo ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={backgroundImage}
          >
            <source src={backgroundVideo} type="video/mp4" />
            {/* Fallback to background image if video fails */}
            {backgroundImage && (
              <OptimizedImage
                src={backgroundImage}
                alt="Hero background"
                fill
                className="object-cover"
                priority
                quality={imageQuality.hero}
                sizes={imageSizes.hero}
                fallbackSrc="/images/placeholder-drone.svg"
              />
            )}
          </video>
        ) : backgroundImage ? (
          <OptimizedImage
            src={backgroundImage}
            alt="Hero background"
            fill
            className="object-cover"
            priority
            quality={imageQuality.hero}
            sizes={imageSizes.hero}
            fallbackSrc="/images/placeholder-drone.svg"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-charcoal" />
        )}
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Tagline */}
        {tagline && (
          <div
            className={`transform transition-all duration-1000 ease-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
          >
            <p className="text-primary font-semibold text-sm sm:text-base uppercase tracking-wider mb-4">
              {tagline}
            </p>
          </div>
        )}

        {/* Main Title */}
        <div
          className={`transform transition-all duration-1000 ease-out delay-200 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <h1 className="font-heading font-bold text-white mb-6">
            <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight">
              {title}
            </span>
          </h1>
        </div>

        {/* Subtitle */}
        <div
          className={`transform transition-all duration-1000 ease-out delay-400 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <p className="font-body text-gray-200 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto mb-8 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className={`transform transition-all duration-1000 ease-out delay-600 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary CTA */}
            <Link
              href={ctaLink}
              className="btn-primary inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-lg group"
            >
              {ctaText}
              <svg
                className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>

            {/* Secondary CTA */}
            {secondaryCtaText && secondaryCtaLink && (
              <Link
                href={secondaryCtaLink}
                className="btn-secondary inline-flex items-center px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 hover:scale-105 group"
              >
                {secondaryCtaText}
                <svg
                  className="ml-2 w-5 h-5 transform group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ease-out delay-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          <div className="flex flex-col items-center text-white/70 hover:text-white transition-colors duration-200">
            <span className="text-sm font-medium mb-2">Scroll to explore</span>
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}