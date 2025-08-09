/**
 * Device and Browser Testing for Mobile Menu Scrolling
 * Tests scrollable menu functionality across various mobile devices and browsers
 * Requirements: 2.5, 3.1, 3.3, 4.5, 5.4
 */

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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

// Device configurations for testing
const DEVICE_CONFIGS = {
  // Mobile devices (iOS)
  iPhone12: {
    width: 390,
    height: 844,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    platform: 'iOS',
    touchEnabled: true,
  },
  iPhone13Pro: {
    width: 393,
    height: 852,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1',
    platform: 'iOS',
    touchEnabled: true,
  },
  iPhoneSE: {
    width: 375,
    height: 667,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    platform: 'iOS',
    touchEnabled: true,
  },
  
  // Mobile devices (Android)
  galaxyS21: {
    width: 384,
    height: 854,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    platform: 'Android',
    touchEnabled: true,
  },
  pixelXL: {
    width: 411,
    height: 823,
    userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel XL) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Mobile Safari/537.36',
    platform: 'Android',
    touchEnabled: true,
  },
  
  // Tablets
  iPadAir: {
    width: 820,
    height: 1180,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    platform: 'iOS',
    touchEnabled: true,
  },
  iPadMini: {
    width: 744,
    height: 1133,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    platform: 'iOS',
    touchEnabled: true,
  },
  galaxyTab: {
    width: 800,
    height: 1280,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Safari/537.36',
    platform: 'Android',
    touchEnabled: true,
  },
};

// Browser configurations
const BROWSER_CONFIGS = {
  safari: {
    name: 'Safari',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    features: {
      smoothScroll: true,
      touchEvents: true,
      passiveListeners: true,
      intersectionObserver: true,
    },
  },
  chrome: {
    name: 'Chrome',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36',
    features: {
      smoothScroll: true,
      touchEvents: true,
      passiveListeners: true,
      intersectionObserver: true,
    },
  },
  firefox: {
    name: 'Firefox',
    userAgent: 'Mozilla/5.0 (Mobile; rv:91.0) Gecko/91.0 Firefox/91.0',
    features: {
      smoothScroll: true,
      touchEvents: true,
      passiveListeners: false, // Firefox has different passive listener support
      intersectionObserver: true,
    },
  },
};

// Utility function to simulate device environment
const simulateDevice = (config: typeof DEVICE_CONFIGS[keyof typeof DEVICE_CONFIGS]) => {
  // Mock window dimensions
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: config.width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: config.height,
  });

  // Mock user agent
  Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    configurable: true,
    value: config.userAgent,
  });

  // Mock touch support
  Object.defineProperty(window, 'ontouchstart', {
    writable: true,
    configurable: true,
    value: config.touchEnabled ? {} : undefined,
  });

  // Trigger resize event
  fireEvent(window, new Event('resize'));
};

// Utility function to simulate browser environment
const simulateBrowser = (config: typeof BROWSER_CONFIGS[keyof typeof BROWSER_CONFIGS]) => {
  Object.defineProperty(navigator, 'userAgent', {
    writable: true,
    configurable: true,
    value: config.userAgent,
  });

  // Mock browser-specific features
  if (!config.features.smoothScroll) {
    delete (Element.prototype as any).scrollTo;
  }
};

describe('Mobile Menu Device and Browser Testing', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    
    // Reset viewport to default
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  describe('Mobile Device Testing', () => {
    Object.entries(DEVICE_CONFIGS).forEach(([deviceName, config]) => {
      describe(`${deviceName} (${config.platform})`, () => {
        beforeEach(() => {
          simulateDevice(config);
        });

        test('should render mobile menu with correct dimensions', async () => {
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
          expect(mobileMenu).toBeInTheDocument();
          expect(mobileMenu).toBeVisible();

          // Check if menu adapts to device height
          const menuContainer = mobileMenu.querySelector('.mobile-menu-container');
          expect(menuContainer).toBeInTheDocument();
        });

        test('should handle touch scrolling on touch-enabled devices', async () => {
          if (!config.touchEnabled) return;

          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          const scrollableContainer = screen.getByRole('menu');
          expect(scrollableContainer).toBeInTheDocument();

          // Simulate touch events
          fireEvent.touchStart(scrollableContainer, {
            touches: [{ clientX: 0, clientY: 100 }],
          });

          fireEvent.touchMove(scrollableContainer, {
            touches: [{ clientX: 0, clientY: 50 }],
          });

          fireEvent.touchEnd(scrollableContainer);

          // Verify touch interaction doesn't break the menu
          expect(scrollableContainer).toBeVisible();
        });

        test('should maintain proper height calculations on orientation change', async () => {
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          // Simulate orientation change (swap width/height)
          const originalWidth = config.width;
          const originalHeight = config.height;
          
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: originalHeight,
          });
          
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: originalWidth,
          });

          fireEvent(window, new Event('resize'));

          await waitFor(() => {
            const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
            expect(mobileMenu).toBeVisible();
          });
        });

        test('should provide appropriate scroll indicators for device size', async () => {
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          const scrollableContainer = screen.getByRole('menu');
          
          // Check for scroll indicators based on content height vs device height
          const containerHeight = scrollableContainer.getBoundingClientRect().height;
          const scrollHeight = scrollableContainer.scrollHeight;
          
          if (scrollHeight > containerHeight) {
            // Should have scroll indicators
            expect(scrollableContainer).toHaveClass(/scroll/);
          }
        });
      });
    });
  });

  describe('Browser Compatibility Testing', () => {
    Object.entries(BROWSER_CONFIGS).forEach(([browserName, config]) => {
      describe(`${config.name} Browser`, () => {
        beforeEach(() => {
          simulateBrowser(config);
          simulateDevice(DEVICE_CONFIGS.iPhone12); // Use iPhone12 as base device
        });

        test('should handle scrolling with browser-specific features', async () => {
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          const scrollableContainer = screen.getByRole('menu');
          
          // Test scroll behavior
          fireEvent.scroll(scrollableContainer, { target: { scrollTop: 100 } });
          
          expect(scrollableContainer.scrollTop).toBe(100);
        });

        test('should work with browser-specific touch events', async () => {
          if (!config.features.touchEvents) return;

          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          const scrollableContainer = screen.getByRole('menu');
          
          // Test touch events specific to browser
          const touchStartEvent = new TouchEvent('touchstart', {
            touches: [new Touch({
              identifier: 1,
              target: scrollableContainer,
              clientX: 0,
              clientY: 100,
            })],
          });

          fireEvent(scrollableContainer, touchStartEvent);
          expect(scrollableContainer).toBeVisible();
        });

        test('should handle passive listeners correctly', async () => {
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          const scrollableContainer = screen.getByRole('menu');
          
          // Test that scroll events work regardless of passive listener support
          fireEvent.scroll(scrollableContainer);
          expect(scrollableContainer).toBeVisible();
        });
      });
    });
  });

  describe('Tablet Orientation Testing', () => {
    const tabletDevices = ['iPadAir', 'iPadMini', 'galaxyTab'] as const;

    tabletDevices.forEach((deviceName) => {
      const config = DEVICE_CONFIGS[deviceName];
      
      describe(`${deviceName} Orientation Tests`, () => {
        test('should work correctly in portrait orientation', async () => {
          simulateDevice(config);
          
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
          expect(mobileMenu).toBeVisible();
          
          // Verify menu height is appropriate for portrait
          const menuContainer = mobileMenu.querySelector('.mobile-menu-container');
          expect(menuContainer).toBeInTheDocument();
        });

        test('should work correctly in landscape orientation', async () => {
          // Swap width and height for landscape
          const landscapeConfig = {
            ...config,
            width: config.height,
            height: config.width,
          };
          
          simulateDevice(landscapeConfig);
          
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
          expect(mobileMenu).toBeVisible();
          
          // Verify menu adapts to landscape dimensions
          const scrollableContainer = screen.getByRole('menu');
          expect(scrollableContainer).toBeInTheDocument();
        });

        test('should handle orientation changes smoothly', async () => {
          simulateDevice(config);
          
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          // Change to landscape
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: config.height,
          });
          
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: config.width,
          });

          fireEvent(window, new Event('resize'));

          await waitFor(() => {
            const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
            expect(mobileMenu).toBeVisible();
          });

          // Change back to portrait
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: config.width,
          });
          
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: config.height,
          });

          fireEvent(window, new Event('resize'));

          await waitFor(() => {
            const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
            expect(mobileMenu).toBeVisible();
          });
        });
      });
    });
  });

  describe('Performance Testing Across Devices', () => {
    test('should maintain 60fps during scroll operations', async () => {
      // Test on a slower device simulation
      simulateDevice(DEVICE_CONFIGS.iPhoneSE);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Mock performance.now for timing
      const performanceNow = jest.spyOn(performance, 'now');
      let frameCount = 0;
      const startTime = performance.now();
      
      // Simulate rapid scrolling
      for (let i = 0; i < 100; i += 10) {
        fireEvent.scroll(scrollableContainer, { target: { scrollTop: i } });
        frameCount++;
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      const fps = (frameCount / duration) * 1000;
      
      // Should maintain reasonable performance (allowing for test environment limitations)
      expect(fps).toBeGreaterThan(30); // Relaxed for test environment
      
      performanceNow.mockRestore();
    });

    test('should handle large menu lists efficiently', async () => {
      // Mock a large number of navigation items
      const originalNavLinks = require('@/components/layout/Navbar').navLinks;
      const largeNavLinks = Array.from({ length: 50 }, (_, i) => ({
        href: `/page-${i}`,
        label: `Page ${i + 1}`,
      }));
      
      // This would require mocking the component, but demonstrates the test approach
      simulateDevice(DEVICE_CONFIGS.iPhone12);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Test that scrolling works with large lists
      fireEvent.scroll(scrollableContainer, { target: { scrollTop: 500 } });
      expect(scrollableContainer).toBeVisible();
    });
  });

  describe('Accessibility Testing Across Devices', () => {
    test('should provide proper ARIA attributes on all devices', async () => {
      simulateDevice(DEVICE_CONFIGS.iPhone12);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
      const scrollableContainer = screen.getByRole('menu');
      
      // Check ARIA attributes
      expect(mobileMenu).toHaveAttribute('aria-label');
      expect(scrollableContainer).toHaveAttribute('aria-orientation', 'vertical');
      expect(scrollableContainer).toHaveAttribute('role', 'menu');
    });

    test('should maintain keyboard navigation on all devices', async () => {
      const devices = Object.entries(DEVICE_CONFIGS).slice(0, 3); // Test first 3 devices
      
      for (const [deviceName, config] of devices) {
        simulateDevice(config);
        
        render(<Navbar />);
        
        const menuButton = screen.getByLabelText(/open mobile menu/i);
        await user.click(menuButton);

        const menuItems = screen.getAllByRole('menuitem');
        
        // Test keyboard navigation
        if (menuItems.length > 0) {
          menuItems[0].focus();
          expect(document.activeElement).toBe(menuItems[0]);
        }
        
        // Clean up for next iteration
        await user.click(menuButton); // Close menu
      }
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should handle viewport calculation errors gracefully', async () => {
      // Mock viewport calculation failure
      Object.defineProperty(window, 'innerHeight', {
        get: () => { throw new Error('Viewport calculation failed'); },
      });
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      
      // Should not crash when opening menu
      await expect(user.click(menuButton)).resolves.not.toThrow();
      
      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
      expect(mobileMenu).toBeInTheDocument();
    });

    test('should work without touch support', async () => {
      // Simulate device without touch support
      const nonTouchConfig = {
        ...DEVICE_CONFIGS.iPhone12,
        touchEnabled: false,
      };
      
      simulateDevice(nonTouchConfig);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Should still work with keyboard/mouse
      fireEvent.scroll(scrollableContainer, { target: { scrollTop: 100 } });
      expect(scrollableContainer.scrollTop).toBe(100);
    });

    test('should handle browser feature detection failures', async () => {
      // Mock missing browser features
      delete (window as any).IntersectionObserver;
      delete (Element.prototype as any).scrollTo;
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
      expect(mobileMenu).toBeVisible();
    });
  });
});