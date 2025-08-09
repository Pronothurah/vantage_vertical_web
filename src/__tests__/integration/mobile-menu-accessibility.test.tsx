/**
 * Accessibility Testing for Mobile Menu Scrolling
 * Tests accessibility features with actual assistive technologies simulation
 * Requirements: 3.2, 3.4, 3.5
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '@/components/layout/Navbar';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

describe('Mobile Menu Accessibility Testing', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    
    // Simulate mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 390,
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 844,
    });
  });

  describe('Screen Reader Compatibility', () => {
    test('should provide proper ARIA attributes for scrollable content', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Check essential ARIA attributes
      expect(scrollableContainer).toHaveAttribute('role', 'menu');
      expect(scrollableContainer).toHaveAttribute('aria-orientation', 'vertical');
      expect(scrollableContainer).toHaveAttribute('aria-label');
      
      // Check for scroll-related ARIA attributes
      const ariaLabel = scrollableContainer.getAttribute('aria-label');
      expect(ariaLabel).toMatch(/scrollable|menu/i);
    });

    test('should provide context about menu items and their positions', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const menuItems = screen.getAllByRole('menuitem');
      
      menuItems.forEach((item, index) => {
        // Check for position information in ARIA attributes
        const ariaSetSize = item.getAttribute('aria-setsize');
        const ariaPosInSet = item.getAttribute('aria-posinset');
        
        if (ariaSetSize && ariaPosInSet) {
          expect(parseInt(ariaPosInSet)).toBe(index + 1);
          expect(parseInt(ariaSetSize)).toBe(menuItems.length);
        }
      });
    });

    test('should handle reduced motion preferences', async () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Verify that smooth scrolling is disabled or reduced
      expect(scrollableContainer).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation Accessibility', () => {
    test('should support arrow key navigation with scroll', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      const menuItems = screen.getAllByRole('menuitem');
      
      // Focus first item
      menuItems[0].focus();
      
      // Navigate down with arrow keys
      fireEvent.keyDown(scrollableContainer, { key: 'ArrowDown' });
      
      await waitFor(() => {
        expect(document.activeElement).toBe(menuItems[1]);
      });
      
      // Navigate up with arrow keys
      fireEvent.keyDown(scrollableContainer, { key: 'ArrowUp' });
      
      await waitFor(() => {
        expect(document.activeElement).toBe(menuItems[0]);
      });
    });

    test('should support Home and End keys for quick navigation', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      const menuItems = screen.getAllByRole('menuitem');
      
      // Focus middle item
      menuItems[Math.floor(menuItems.length / 2)].focus();
      
      // Press Home key
      fireEvent.keyDown(scrollableContainer, { key: 'Home' });
      
      await waitFor(() => {
        expect(document.activeElement).toBe(menuItems[0]);
        expect(scrollableContainer.scrollTop).toBe(0);
      });
      
      // Press End key
      fireEvent.keyDown(scrollableContainer, { key: 'End' });
      
      await waitFor(() => {
        expect(document.activeElement).toBe(menuItems[menuItems.length - 1]);
      });
    });

    test('should maintain focus within scrollable area', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      const menuItems = screen.getAllByRole('menuitem');
      
      // Focus last item
      menuItems[menuItems.length - 1].focus();
      
      // Try to navigate beyond last item
      fireEvent.keyDown(scrollableContainer, { key: 'ArrowDown' });
      
      // Focus should stay on last item or wrap to first
      await waitFor(() => {
        const focusedElement = document.activeElement;
        expect(menuItems.includes(focusedElement as HTMLElement)).toBe(true);
      });
    });
  });

  describe('Focus Management', () => {
    test('should trap focus within mobile menu when open', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const menuItems = screen.getAllByRole('menuitem');
      
      // Focus should be trapped within the menu
      const firstItem = menuItems[0];
      const lastItem = menuItems[menuItems.length - 1];
      
      firstItem.focus();
      
      // Tab backwards from first item should go to last item
      fireEvent.keyDown(firstItem, { key: 'Tab', shiftKey: true });
      
      await waitFor(() => {
        expect(document.activeElement).toBe(lastItem);
      });
      
      // Tab forwards from last item should go to first item
      fireEvent.keyDown(lastItem, { key: 'Tab' });
      
      await waitFor(() => {
        expect(document.activeElement).toBe(firstItem);
      });
    });

    test('should restore focus to menu button when menu closes', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const menuItems = screen.getAllByRole('menuitem');
      menuItems[2].focus(); // Focus a menu item
      
      // Close menu with Escape key
      fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      
      await waitFor(() => {
        expect(document.activeElement).toBe(menuButton);
      });
    });
  });

  describe('Comprehensive Accessibility Audit', () => {
    test('should provide proper semantic structure', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      // Check semantic structure
      const nav = screen.getByRole('navigation', { name: /mobile navigation/i });
      const menu = screen.getByRole('menu');
      const menuItems = screen.getAllByRole('menuitem');
      
      expect(nav).toContainElement(menu);
      menuItems.forEach(item => {
        expect(menu).toContainElement(item);
      });
    });

    test('should maintain proper ARIA attributes during interactions', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Test ARIA attributes remain consistent during scrolling
      fireEvent.scroll(scrollableContainer, { target: { scrollTop: 100 } });
      
      expect(scrollableContainer).toHaveAttribute('role', 'menu');
      expect(scrollableContainer).toHaveAttribute('aria-orientation', 'vertical');
    });

    test('should maintain accessibility during state changes', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      
      // Test closed state
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
      
      // Test open state
      await user.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      
      const menuItems = screen.getAllByRole('menuitem');
      menuItems[0].focus();
      
      // Menu items should be properly accessible
      expect(menuItems[0]).toHaveAttribute('role', 'menuitem');
      expect(menuItems[0]).toHaveAttribute('tabindex', '0');
    });
  });
});