'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ServiceIcon from '@/components/ui/ServiceIcon';

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: string;
  iconSvg?: React.ReactNode | (() => React.ReactNode);
  iconType?: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  image?: string;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
  style?: React.CSSProperties;
}

export default function ServiceCard({
  title,
  description,
  icon,
  iconSvg,
  iconType,
  features,
  ctaText,
  ctaLink,
  image,
  variant = 'default',
  className = '',
  style
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardClasses = {
    default: 'service-card h-full',
    featured: 'service-card h-full border-2 border-primary bg-gradient-to-br from-white to-red-50',
    compact: 'service-card h-full p-4'
  };

  return (
    <div
      className={`${cardClasses[variant]} ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Section */}
      {image && (
        <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className={`object-cover transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      )}

      {/* Icon Section */}
      <div className="flex items-center mb-4">
        {iconType ? (
          <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 ${
            isHovered ? 'bg-primary text-white scale-110' : ''
          }`}>
            <ServiceIcon 
              type={iconType} 
              className={`w-6 h-6 transition-colors duration-300 ${
                isHovered ? 'text-white' : 'text-primary'
              }`}
            />
          </div>
        ) : iconSvg ? (
          <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 ${
            isHovered ? 'bg-primary text-white scale-110' : ''
          }`}>
            {typeof iconSvg === 'function' ? iconSvg() : iconSvg}
          </div>
        ) : icon ? (
          <div className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-transform duration-300 ${
            isHovered ? 'scale-110' : ''
          }`}>
            <Image
              src={icon}
              alt={`${title} icon`}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center transition-all duration-300 ${
            isHovered ? 'bg-primary scale-110' : ''
          }`}>
            <ServiceIcon 
              type="default" 
              className={`w-6 h-6 transition-colors duration-300 ${
                isHovered ? 'text-white' : 'text-primary'
              }`}
            />
          </div>
        )}

        <div className="ml-4">
          <h3 className={`font-heading font-semibold transition-colors duration-300 ${
            variant === 'compact' ? 'text-lg' : 'text-xl'
          } ${isHovered ? 'text-primary' : 'text-gray-900'}`}>
            {title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className={`text-gray-600 mb-6 leading-relaxed ${
        variant === 'compact' ? 'text-sm' : 'text-base'
      }`}>
        {description}
      </p>

      {/* Features List */}
      {features.length > 0 && (
        <div className="mb-6">
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li
                key={index}
                className={`flex items-start transition-all duration-300 delay-${index * 100} ${
                  isHovered ? 'translate-x-1' : ''
                }`}
              >
                <svg
                  className={`flex-shrink-0 w-5 h-5 text-primary mt-0.5 mr-3 transition-transform duration-300 ${
                    isHovered ? 'scale-110' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className={`text-gray-700 ${
                  variant === 'compact' ? 'text-sm' : 'text-base'
                }`}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA Button */}
      <div className="mt-auto">
        <Link
          href={ctaLink}
          className={`group inline-flex items-center justify-center w-full px-6 py-3 text-center font-semibold rounded-lg transition-all duration-300 ${
            variant === 'featured'
              ? 'bg-primary text-white hover:bg-red-700 hover:shadow-lg'
              : 'border-2 border-primary text-primary hover:bg-primary hover:text-white'
          } ${isHovered ? 'transform -translate-y-1 shadow-medium' : ''}`}
        >
          {ctaText}
          <svg
            className={`ml-2 w-4 h-4 transition-transform duration-300 ${
              isHovered ? 'translate-x-1' : ''
            }`}
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
      </div>

      {/* Hover Effect Overlay */}
      <div
        className={`absolute inset-0 rounded-xl pointer-events-none transition-all duration-300 ${
          isHovered ? 'ring-2 ring-primary ring-opacity-50' : ''
        }`}
      />
    </div>
  );
}

// Service Grid Component for displaying multiple service cards
interface ServiceGridProps {
  services: Omit<ServiceCardProps, 'className'>[];
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

export function ServiceGrid({ 
  services, 
  columns = 3, 
  className = '' 
}: ServiceGridProps) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid ${gridClasses[columns]} gap-6 lg:gap-8 ${className}`}>
      {services.map((service, index) => (
        <ServiceCard
          key={index}
          {...service}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 100}ms` } as React.CSSProperties}
        />
      ))}
    </div>
  );
}