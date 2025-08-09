'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { 
  ariaAttributes, 
  keyboardHandlers, 
  trapFocus, 
  announceToScreenReader
} from '@/lib/accessibility';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/drones', label: 'Drones' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/technology', label: 'Technology' },
  { href: '/training', label: 'Training' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle focus trapping and accessibility setup in mobile menu
  useEffect(() => {
    if (isMobileMenuOpen && mobileMenuRef.current) {
      const cleanup = trapFocus(mobileMenuRef.current);
      
      return () => {
        cleanup();
      };
    }
  }, [isMobileMenuOpen]);



  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    
    // Announce to screen readers
    announceToScreenReader(
      newState ? 'Mobile menu opened' : 'Mobile menu closed',
      'polite'
    );
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    announceToScreenReader('Mobile menu closed', 'polite');
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-medium'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center group"
            onClick={closeMobileMenu}
          >
            <div className="relative w-30 h-30 lg:w-36 lg:h-36">
              <Image
                src="/vantage-logo.png"
                alt="Vantage Vertical Logo"
                fill
                className="object-contain transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8" role="navigation" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActiveLink(link.href)
                    ? 'text-primary'
                    : isScrolled
                    ? 'text-gray-700 hover:text-deepBlue'
                    : 'text-white hover:text-deepBlue'
                } group`}
                {...ariaAttributes.link(isActiveLink(link.href))}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-200 ${
                    isActiveLink(link.href)
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/contact"
              className="btn-primary text-sm px-6 py-2.5"
            >
              Get Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            ref={menuButtonRef}
            onClick={toggleMobileMenu}
            onKeyDown={keyboardHandlers.onEnterOrSpace(toggleMobileMenu)}
            className="lg:hidden p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label={isMobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
            {...ariaAttributes.button(undefined, isMobileMenuOpen)}
            aria-controls="mobile-menu"
          >
            <div className="w-6 h-6 relative">
              <span
                className={`absolute top-0 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''
                } ${isScrolled ? 'bg-gray-900' : 'bg-white'}`}
              />
              <span
                className={`absolute top-2.5 left-0 w-full h-0.5 bg-current transition-opacity duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                } ${isScrolled ? 'bg-gray-900' : 'bg-white'}`}
              />
              <span
                className={`absolute top-5 left-0 w-full h-0.5 bg-current transform transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''
                } ${isScrolled ? 'bg-gray-900' : 'bg-white'}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          id="mobile-menu"
          className={`lg:hidden overflow-hidden transition-all duration-300 gpu-accelerated ${
            isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
          aria-hidden={!isMobileMenuOpen}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {/* Outer container - handles positioning and backdrop effects */}
          <div className="mobile-menu-container">
            {/* Inner container - show all items without scrolling */}
            <div 
              ref={mobileMenuRef}
              className="mobile-menu-scrollable"
              role="menu"
              aria-orientation="vertical"
              aria-label="Mobile navigation menu"
            >
              {/* Content wrapper - maintains padding and spacing */}
              <div className="mobile-menu-content">
                {navLinks.map((link, index) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMobileMenu}
                    className={`mobile-menu-item no-select ${
                      isActiveLink(link.href) ? 'active' : ''
                    }`}
                    {...ariaAttributes.link(isActiveLink(link.href))}
                    tabIndex={isMobileMenuOpen ? 0 : -1}
                    role="menuitem"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={closeMobileMenu}
                  className="mobile-menu-cta no-select"
                  tabIndex={isMobileMenuOpen ? 0 : -1}
                  role="menuitem"
                >
                  Get Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}