'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveLink = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
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
            className="flex items-center space-x-2 group"
            onClick={closeMobileMenu}
          >
            <div className="relative w-10 h-10 lg:w-12 lg:h-12">
              <Image
                src="/logo.svg"
                alt="Vantage Vertical Logo"
                fill
                className="object-contain transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold font-heading text-gray-900">
                Vantage Vertical
              </span>
              <span className="text-xs text-gray-600 hidden sm:block">
                Aerial Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActiveLink(link.href)
                    ? 'text-primary'
                    : isScrolled
                    ? 'text-gray-700 hover:text-primary'
                    : 'text-white hover:text-accent'
                } group`}
              >
                {link.label}
                <span
                  className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-200 ${
                    isActiveLink(link.href)
                      ? 'scale-x-100'
                      : 'scale-x-0 group-hover:scale-x-100'
                  }`}
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
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Toggle mobile menu"
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
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-2 bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-large">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={`block px-6 py-3 text-base font-medium transition-colors duration-200 ${
                  isActiveLink(link.href)
                    ? 'text-primary bg-primary/5 border-r-4 border-primary'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="px-6 py-3">
              <Link
                href="/contact"
                onClick={closeMobileMenu}
                className="btn-primary w-full text-center block"
              >
                Get Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}