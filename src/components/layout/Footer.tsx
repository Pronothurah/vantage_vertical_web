'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface FooterLink {
  href: string;
  label: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const footerSections: FooterSection[] = [
  {
    title: 'Services',
    links: [
      { href: '/technology#aerial-mapping', label: 'Aerial Mapping' },
      { href: '/technology#surveillance', label: 'Drone Surveillance' },
      { href: '/technology#agritech', label: 'Agritech Solutions' },
      { href: '/technology#commercial', label: 'Commercial Photography' },
      { href: '/training', label: 'Drone Training' },
    ],
  },
  {
    title: 'Industries',
    links: [
      { href: '/portfolio#agriculture', label: 'Agriculture' },
      { href: '/portfolio#security', label: 'Security' },
      { href: '/portfolio#construction', label: 'Construction' },
      { href: '/portfolio#real-estate', label: 'Real Estate' },
      { href: '/portfolio#events', label: 'Events' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/portfolio', label: 'Portfolio' },
      { href: '/blog', label: 'Blog' },
      { href: '/contact', label: 'Contact' },
      { href: '/technology#drones', label: 'Buy Drones' },
    ],
  },
];

const socialLinks = [
  {
    href: 'https://facebook.com/vantagevertical',
    label: 'Facebook',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
  },
  {
    href: 'https://twitter.com/vantagevertical',
    label: 'Twitter',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
  },
  {
    href: 'https://linkedin.com/company/vantagevertical',
    label: 'LinkedIn',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    href: 'https://instagram.com/vantagevertical',
    label: 'Instagram',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.418-3.323C6.001 8.198 7.152 7.708 8.449 7.708s2.448.49 3.323 1.416c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323c-.875.807-2.026 1.218-3.323 1.218zm7.718-1.297c-.875.807-2.026 1.297-3.323 1.297s-2.448-.49-3.323-1.297c-.875-.875-1.365-2.026-1.365-3.323s.49-2.448 1.365-3.323c.875-.926 2.026-1.416 3.323-1.416s2.448.49 3.323 1.416c.875.875 1.365 2.026 1.365 3.323s-.49 2.448-1.365 3.323z"/>
      </svg>
    ),
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSubmitMessage('Thank you for subscribing!');
        setEmail('');
      } else {
        setSubmitMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-charcoal text-white">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center mb-6">
                <div className="relative w-32 h-32">
                  <Image
                    src="/vantage-logo-white.jpg"
                    alt="Vantage Vertical Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                Leading drone services company in Kenya offering aerial mapping, 
                surveillance, agritech solutions, commercial photography, and 
                professional drone training programs.
              </p>

              {/* Contact Information */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <span className="text-gray-300">Nairobi, Kenya</span>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <a href="tel:+254704277687" className="text-gray-300 hover:text-white transition-colors">
                    +254704277687
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <svg className="w-5 h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <a href="mailto:vantagevarticalltd@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                    vantagevarticalltd@gmail.com
                  </a>
                </div>
              </div>

              {/* KCAA Certification */}
              <div className="bg-gray-800 rounded-xl p-6 mb-6">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="flex-1 mb-4 sm:mb-0 sm:mr-6">
                    <h4 className="font-heading font-semibold text-lg text-white mb-2">
                      KCAA Certified & Compliant
                    </h4>
                    <p className="text-gray-300 text-sm leading-relaxed mb-3">
                      We are fully certified by the Kenya Civil Aviation Authority (KCAA) and maintain 
                      strict compliance with all aviation regulations.
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-xs">
                      <div className="flex items-center text-green-400">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Licensed Operators
                      </div>
                      <div className="flex items-center text-green-400">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Insured Operations
                      </div>
                      <div className="flex items-center text-green-400">
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Safety Compliant
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="relative w-20 h-20 bg-white rounded-lg shadow-medium p-2">
                      <Image
                        src="/kcaa.png"
                        alt="KCAA Certification"
                        fill
                        className="object-contain p-1"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-semibold font-heading mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-700 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold font-heading mb-2">
                Stay Updated
              </h3>
              <p className="text-gray-300">
                Get the latest news about drone technology and our services.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 lg:min-w-96">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary whitespace-nowrap disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
          {submitMessage && (
            <p className={`mt-3 text-sm ${
              submitMessage.includes('Thank you') ? 'text-green-400' : 'text-red-400'
            }`}>
              {submitMessage}
            </p>
          )}
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-400">
              <p>&copy; 2024 Vantage Vertical. All rights reserved.</p>
              <div className="flex items-center space-x-4">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-all duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}