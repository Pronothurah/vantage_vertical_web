/**
 * Visual Regression Testing for Mobile Menu Scrolling
 * Tests visual consistency across devices and browsers
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5
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

// Visual testing utilities
class VisualTester {
  private snapshots: Map<string, any> = new Map();

  captureSnapshot(element: Element, name: string) {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    const snapshot = {
      dimensions: {
        width: rect.width,
        height: rect.height,
      },
      styles: {
        backgroundColor: computedStyle.backgroundColor,
        color: computedStyle.color,
        fontSize: computedStyle.fontSize,
        fontFamily: computedStyle.fontFamily,
        padding: computedStyle.padding,
        margin: computedStyle.margin,
        borderRadius: computedStyle.borderRadius,
        boxShadow: computedStyle.boxShadow,
        opacity: computedStyle.opacity,
        transform: computedStyle.transform,
        transition: computedStyle.transition,
        overflowY: computedStyle.overflowY,
      },
      classes: Array.from(element.classList),
      attributes: this.getRelevantAttributes(element),
    };
    
    this.snapshots.set(name, snapshot);
    return snapshot;
  }

  compareSnapshots(name1: string, name2: string, tolerance = 0.1) {
    const snapshot1 = this.snapshots.get(name1);
    const snapshot2 = this.snapshots.get(name2);
    
    if (!snapshot1 || !snapshot2) {
      throw new Error(`Snapshots not found: ${name1}, ${name2}`);
    }
    
    const differences = [];
    
    // Compare dimensions
    if (Math.abs(snapshot1.dimensions.width - snapshot2.dimensions.width) > tolerance) {
      differences.push(`Width: ${snapshot1.dimensions.width} vs ${snapshot2.dimensions.width}`);
    }
    
    // Compare key styles
    const stylesToCompare = ['backgroundColor', 'color', 'fontSize', 'borderRadius'];
    stylesToCompare.forEach(style => {
      if (snapshot1.styles[style] !== snapshot2.styles[style]) {
        differences.push(`${style}: ${snapshot1.styles[style]} vs ${snapshot2.styles[style]}`);
      }
    });
    
    return {
      identical: differences.length === 0,
      differences,
    };
  }

  private getRelevantAttributes(element: Element) {
    const relevantAttrs = ['role', 'aria-label', 'aria-expanded', 'tabindex'];
    const attributes: Record<string, string> = {};
    
    relevantAttrs.forEach(attr => {
      const value = element.getAttribute(attr);
      if (value !== null) {
        attributes[attr] = value;
      }
    });
    
    return attributes;
  }
}

// Device configurations for visual testing
const VISUAL_TEST_DEVICES = {
  mobile: { width: 375, height: 667 },
  mobileLarge: { width: 414, height: 896 },
  tablet: { width: 768, height: 1024 },
  tabletLarge: { width: 820, height: 1180 },
};

describe('Mobile Menu Visual Regression Testing', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let visualTester: VisualTester;

  beforeEach(() => {
    user = userEvent.setup();
    visualTester = new VisualTester();
  });

  describe('Visual Consistency Across Devices', () => {
    Object.entries(VISUAL_TEST_DEVICES).forEach(([deviceName, dimensions]) => {
      describe(`${deviceName} (${dimensions.width}x${dimensions.height})`, () => {
        beforeEach(() => {
          // Set device dimensions
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: dimensions.width,
          });
          
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: dimensions.height,
          });
          
          fireEvent(window, new Event('resize'));
        });

        test('should maintain consistent menu button styling', async () => {
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          
          // Capture menu button appearance
          const buttonSnapshot = visualTester.captureSnapshot(
            menuButton, 
            `menu-button-${deviceName}`
          );
          
          // Verify button has consistent styling
          expect(buttonSnapshot.styles.padding).toBeTruthy();
          expect(buttonSnapshot.styles.borderRadius).toBeTruthy();
          expect(buttonSnapshot.classes).toContain('lg:hidden');
          
          // Test button in different states
          menuButton.focus();
          const focusedSnapshot = visualTester.captureSnapshot(
            menuButton, 
            `menu-button-focused-${deviceName}`
          );
          
          // Focus should add visual indicators
          expect(focusedSnapshot.attributes.tabindex).toBe('0');
        });

        test('should maintain consistent menu container styling', async () => {
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
          const menuContainer = mobileMenu.querySelector('.mobile-menu-container');
          
          expect(menuContainer).toBeInTheDocument();
          
          // Capture menu container appearance
          const containerSnapshot = visualTester.captureSnapshot(
            menuContainer!,
            `menu-container-${deviceName}`
          );
          
          // Verify consistent styling
          expect(containerSnapshot.styles.backgroundColor).toMatch(/rgba?\(255,\s*255,\s*255/);
          expect(containerSnapshot.styles.borderRadius).toBeTruthy();
          expect(containerSnapshot.styles.boxShadow).toBeTruthy();
        });

        test('should maintain consistent scrollable area styling', async () => {
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          const scrollableContainer = screen.getByRole('menu');
          
          // Capture scrollable container appearance
          const scrollSnapshot = visualTester.captureSnapshot(
            scrollableContainer,
            `scrollable-container-${deviceName}`
          );
          
          // Verify scrollable styling
          expect(scrollSnapshot.styles.overflowY).toBe('auto');
          expect(scrollSnapshot.attributes.role).toBe('menu');
          expect(scrollSnapshot.attributes['aria-orientation']).toBe('vertical');
        });

        test('should maintain consistent menu item styling', async () => {
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          const menuItems = screen.getAllByRole('menuitem');
          
          // Test first menu item styling
          const firstItemSnapshot = visualTester.captureSnapshot(
            menuItems[0],
            `menu-item-${deviceName}`
          );
          
          // Verify menu item styling
          expect(firstItemSnapshot.styles.padding).toBeTruthy();
          expect(firstItemSnapshot.styles.fontSize).toBeTruthy();
          expect(firstItemSnapshot.classes).toContain('mobile-menu-item');
          
          // Test hover/focus state
          menuItems[0].focus();
          const focusedItemSnapshot = visualTester.captureSnapshot(
            menuItems[0],
            `menu-item-focused-${deviceName}`
          );
          
          expect(focusedItemSnapshot.attributes.tabindex).toBe('0');
        });
      });
    });
  });

  describe('Visual State Consistency', () => {
    beforeEach(() => {
      // Use mobile viewport for state testing
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

    test('should maintain visual consistency during menu opening animation', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      const mobileMenuContainer = document.querySelector('#mobile-menu');
      
      expect(mobileMenuContainer).toBeInTheDocument();
      
      // Capture closed state
      const closedSnapshot = visualTester.captureSnapshot(
        mobileMenuContainer!,
        'menu-closed'
      );
      
      // Open menu
      await user.click(menuButton);
      
      await waitFor(() => {
        const menu = screen.getByRole('navigation', { name: /mobile navigation/i });
        expect(menu).toBeVisible();
      });
      
      // Capture opened state
      const openedSnapshot = visualTester.captureSnapshot(
        mobileMenuContainer!,
        'menu-opened'
      );
      
      // Verify state changes are as expected
      expect(closedSnapshot.styles.opacity).toBe('0');
      expect(openedSnapshot.styles.opacity).toBe('1');
    });

    test('should maintain visual consistency during scrolling', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Capture initial scroll state
      const initialScrollSnapshot = visualTester.captureSnapshot(
        scrollableContainer,
        'scroll-initial'
      );
      
      // Scroll and capture
      fireEvent.scroll(scrollableContainer, { target: { scrollTop: 100 } });
      
      const scrolledSnapshot = visualTester.captureSnapshot(
        scrollableContainer,
        'scroll-moved'
      );
      
      // Visual appearance should remain consistent during scroll
      const comparison = visualTester.compareSnapshots('scroll-initial', 'scroll-moved');
      
      // Only scroll position should change, not visual styling
      expect(comparison.differences.filter(diff => 
        !diff.includes('transform') && !diff.includes('scrollTop')
      )).toHaveLength(0);
    });

    test('should maintain visual consistency with scroll indicators', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Check if content is scrollable
      const isScrollable = scrollableContainer.scrollHeight > scrollableContainer.clientHeight;
      
      if (isScrollable) {
        // Capture with scroll indicators
        const withIndicatorsSnapshot = visualTester.captureSnapshot(
          scrollableContainer,
          'with-scroll-indicators'
        );
        
        // Scroll indicators should be visually present
        expect(withIndicatorsSnapshot.classes.some(cls => cls.includes('scroll'))).toBe(true);
      }
    });
  });

  describe('Cross-Browser Visual Consistency', () => {
    const browserStyles = {
      webkit: {
        scrollbarWidth: 'auto',
        scrollbarColor: 'auto',
      },
      firefox: {
        scrollbarWidth: 'thin',
        scrollbarColor: 'rgba(59, 130, 246, 0.5) transparent',
      },
    };

    Object.entries(browserStyles).forEach(([browser, styles]) => {
      test(`should maintain consistent appearance in ${browser}`, async () => {
        // Mock browser-specific styles
        Object.defineProperty(document.documentElement.style, 'scrollbarWidth', {
          value: styles.scrollbarWidth,
          writable: true,
        });
        
        render(<Navbar />);
        
        const menuButton = screen.getByLabelText(/open mobile menu/i);
        await user.click(menuButton);

        const scrollableContainer = screen.getByRole('menu');
        
        // Capture browser-specific appearance
        const browserSnapshot = visualTester.captureSnapshot(
          scrollableContainer,
          `browser-${browser}`
        );
        
        // Core styling should be consistent regardless of browser
        expect(browserSnapshot.styles.backgroundColor).toBeTruthy();
        expect(browserSnapshot.styles.borderRadius).toBeTruthy();
        expect(browserSnapshot.attributes.role).toBe('menu');
      });
    });
  });

  describe('Responsive Design Consistency', () => {
    test('should maintain proportional scaling across screen sizes', async () => {
      const testSizes = [
        { name: 'small', width: 320, height: 568 },
        { name: 'medium', width: 375, height: 667 },
        { name: 'large', width: 414, height: 896 },
      ];
      
      const snapshots: Record<string, any> = {};
      
      for (const size of testSizes) {
        // Set screen size
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: size.width,
        });
        
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: size.height,
        });
        
        fireEvent(window, new Event('resize'));
        
        render(<Navbar />);
        
        const menuButton = screen.getByLabelText(/open mobile menu/i);
        await user.click(menuButton);

        const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
        
        snapshots[size.name] = visualTester.captureSnapshot(
          mobileMenu,
          `responsive-${size.name}`
        );
      }
      
      // Verify proportional scaling
      const smallWidth = snapshots.small.dimensions.width;
      const mediumWidth = snapshots.medium.dimensions.width;
      const largeWidth = snapshots.large.dimensions.width;
      
      // Width should scale with screen size
      expect(mediumWidth).toBeGreaterThan(smallWidth);
      expect(largeWidth).toBeGreaterThan(mediumWidth);
      
      // But styling should remain consistent
      expect(snapshots.small.styles.backgroundColor).toBe(snapshots.medium.styles.backgroundColor);
      expect(snapshots.medium.styles.backgroundColor).toBe(snapshots.large.styles.backgroundColor);
    });
  });

  describe('Accessibility Visual Indicators', () => {
    test('should provide visual focus indicators', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const menuItems = screen.getAllByRole('menuitem');
      
      // Test focus indicators
      const unfocusedSnapshot = visualTester.captureSnapshot(
        menuItems[0],
        'menu-item-unfocused'
      );
      
      menuItems[0].focus();
      
      const focusedSnapshot = visualTester.captureSnapshot(
        menuItems[0],
        'menu-item-focused'
      );
      
      // Focus should create visual difference
      const comparison = visualTester.compareSnapshots('menu-item-unfocused', 'menu-item-focused');
      expect(comparison.identical).toBe(false);
    });

    test('should maintain high contrast mode compatibility', async () => {
      // Mock high contrast mode
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-contrast: high)',
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
      const menuItems = screen.getAllByRole('menuitem');
      
      // Capture high contrast appearance
      const highContrastSnapshot = visualTester.captureSnapshot(
        scrollableContainer,
        'high-contrast-menu'
      );
      
      // Elements should remain visible and accessible
      expect(highContrastSnapshot.styles.backgroundColor).toBeTruthy();
      expect(highContrastSnapshot.styles.color).toBeTruthy();
      
      menuItems.forEach((item, index) => {
        const itemSnapshot = visualTester.captureSnapshot(
          item,
          `high-contrast-item-${index}`
        );
        expect(itemSnapshot.styles.color).toBeTruthy();
      });
    });
  });

  describe('Animation Visual Consistency', () => {
    test('should maintain smooth visual transitions', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      const mobileMenuContainer = document.querySelector('#mobile-menu');
      
      // Capture transition properties
      const transitionSnapshot = visualTester.captureSnapshot(
        mobileMenuContainer!,
        'menu-transition'
      );
      
      // Should have transition properties for smooth animation
      expect(transitionSnapshot.styles.transition).toMatch(/duration|all/);
    });

    test('should respect reduced motion preferences visually', async () => {
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
      const mobileMenuContainer = document.querySelector('#mobile-menu');
      
      // Capture reduced motion appearance
      const reducedMotionSnapshot = visualTester.captureSnapshot(
        mobileMenuContainer!,
        'reduced-motion-menu'
      );
      
      // Transitions should be minimal or instant
      const transition = reducedMotionSnapshot.styles.transition;
      if (transition && transition !== 'none') {
        // If transitions exist, they should be very fast
        expect(transition).toMatch(/0s|0\.1s/);
      }
    });
  });

  describe('Error State Visual Handling', () => {
    test('should maintain visual consistency during error conditions', async () => {
      // Mock a viewport calculation error
      const originalInnerHeight = window.innerHeight;
      Object.defineProperty(window, 'innerHeight', {
        get: () => { throw new Error('Viewport error'); },
        configurable: true,
      });
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      
      // Should still render without crashing
      await user.click(menuButton);
      
      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
      expect(mobileMenu).toBeVisible();
      
      // Capture error state appearance
      const errorStateSnapshot = visualTester.captureSnapshot(
        mobileMenu,
        'error-state-menu'
      );
      
      // Should maintain basic styling even in error state
      expect(errorStateSnapshot.styles.backgroundColor).toBeTruthy();
      
      // Restore original property
      Object.defineProperty(window, 'innerHeight', {
        value: originalInnerHeight,
        writable: true,
        configurable: true,
      });
    });
  });
});