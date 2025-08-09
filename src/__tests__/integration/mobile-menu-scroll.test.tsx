/**
 * Integration tests for mobile menu scroll functionality
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

// Mock the accessibility module
jest.mock('@/lib/accessibility', () => ({
  ariaAttributes: {
    link: jest.fn(() => ({})),
    button: jest.fn(() => ({})),
  },
  keyboardHandlers: {
    onEnterOrSpace: jest.fn(() => jest.fn()),
  },
  trapFocus: jest.fn(() => jest.fn()),
  announceToScreenReader: jest.fn(),
}));

describe('Mobile Menu Scroll Integration', () => {
  beforeEach(() => {
    (usePathname as jest.Mock).mockReturnValue('/');
    
    // Mock window dimensions for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 667,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render mobile menu with scroll state management', () => {
    render(<Navbar />);

    // Find mobile menu button
    const menuButton = screen.getByRole('button', { name: /open mobile menu/i });
    expect(menuButton).toBeInTheDocument();

    // Open mobile menu
    act(() => {
      fireEvent.click(menuButton);
    });

    // Check that mobile menu is rendered with scroll classes
    const mobileMenu = screen.getByRole('menu');
    expect(mobileMenu).toBeInTheDocument();
    expect(mobileMenu).toHaveClass('mobile-menu-scrollable');
  });

  it('should apply correct CSS properties for scroll state', () => {
    render(<Navbar />);

    const menuButton = screen.getByRole('button', { name: /open mobile menu/i });
    
    act(() => {
      fireEvent.click(menuButton);
    });

    // Check that the mobile menu container has the expected CSS properties
    const mobileMenuContainer = screen.getByRole('navigation', { name: /mobile navigation/i });
    const style = mobileMenuContainer.getAttribute('style');
    
    expect(style).toContain('--menu-max-height');
    expect(style).toContain('--menu-item-height');
    expect(style).toContain('--menu-total-height');
    expect(style).toContain('--menu-scrollable');
  });

  it('should apply scroll indicator styles to scrollable container', () => {
    render(<Navbar />);

    const menuButton = screen.getByRole('button', { name: /open mobile menu/i });
    
    act(() => {
      fireEvent.click(menuButton);
    });

    // Check that the scrollable container has the expected CSS properties
    const scrollableContainer = screen.getByRole('menu');
    const style = scrollableContainer.getAttribute('style');
    
    expect(style).toContain('--scroll-percentage');
    expect(style).toContain('--scroll-top');
    expect(style).toContain('--scroll-height');
    expect(style).toContain('--client-height');
  });

  it('should have proper accessibility attributes for scrollable menu', () => {
    render(<Navbar />);

    const menuButton = screen.getByRole('button', { name: /open mobile menu/i });
    
    act(() => {
      fireEvent.click(menuButton);
    });

    const scrollableContainer = screen.getByRole('menu');
    
    // Check accessibility attributes
    expect(scrollableContainer).toHaveAttribute('aria-orientation', 'vertical');
    expect(scrollableContainer).toHaveAttribute('aria-live', 'polite');
    expect(scrollableContainer).toHaveAttribute('aria-label');
  });

  it('should render all navigation items in mobile menu', () => {
    render(<Navbar />);

    const menuButton = screen.getByRole('button', { name: /open mobile menu/i });
    
    act(() => {
      fireEvent.click(menuButton);
    });

    // Check that all navigation items are present
    const expectedItems = ['Home', 'About', 'Drones', 'Portfolio', 'Technology', 'Training', 'Blog', 'Contact'];
    
    expectedItems.forEach(item => {
      expect(screen.getByRole('menuitem', { name: item })).toBeInTheDocument();
    });

    // Check that CTA button is present
    expect(screen.getByRole('menuitem', { name: /get quote/i })).toBeInTheDocument();
  });

  it('should close mobile menu when menu item is clicked', () => {
    render(<Navbar />);

    const menuButton = screen.getByRole('button', { name: /open mobile menu/i });
    
    // Open menu
    act(() => {
      fireEvent.click(menuButton);
    });

    expect(screen.getByRole('menu')).toBeInTheDocument();

    // Click on a menu item
    const homeLink = screen.getByRole('menuitem', { name: 'Home' });
    act(() => {
      fireEvent.click(homeLink);
    });

    // Menu should be closed (aria-hidden should be true)
    const mobileMenuContainer = document.getElementById('mobile-menu');
    expect(mobileMenuContainer).toHaveAttribute('aria-hidden', 'true');
  });

  it('should handle window resize events', () => {
    render(<Navbar />);

    const menuButton = screen.getByRole('button', { name: /open mobile menu/i });
    
    act(() => {
      fireEvent.click(menuButton);
    });

    // Simulate window resize
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 1024,
      });

      fireEvent(window, new Event('resize'));
    });

    // Menu should still be functional after resize
    const mobileMenu = screen.getByRole('menu');
    expect(mobileMenu).toBeInTheDocument();
  });
});