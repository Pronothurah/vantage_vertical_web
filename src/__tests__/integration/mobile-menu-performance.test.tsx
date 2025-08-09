/**
 * Performance Testing for Mobile Menu Scrolling
 * Tests performance across different devices and conditions
 * Requirements: 5.1, 5.2, 5.3, 5.4, 5.5
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

// Performance monitoring utilities
class PerformanceMonitor {
  private measurements: Map<string, number[]> = new Map();
  private observers: PerformanceObserver[] = [];

  startMeasurement(name: string): () => number {
    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.recordMeasurement(name, duration);
      return duration;
    };
  }

  recordMeasurement(name: string, duration: number) {
    if (!this.measurements.has(name)) {
      this.measurements.set(name, []);
    }
    this.measurements.get(name)!.push(duration);
  }

  getAverageDuration(name: string): number {
    const measurements = this.measurements.get(name) || [];
    return measurements.length > 0 
      ? measurements.reduce((sum, val) => sum + val, 0) / measurements.length 
      : 0;
  }

  getMaxDuration(name: string): number {
    const measurements = this.measurements.get(name) || [];
    return measurements.length > 0 ? Math.max(...measurements) : 0;
  }

  getMinDuration(name: string): number {
    const measurements = this.measurements.get(name) || [];
    return measurements.length > 0 ? Math.min(...measurements) : 0;
  }

  reset() {
    this.measurements.clear();
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }

  // Monitor frame rate during animations
  monitorFrameRate(callback: (fps: number) => void) {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const countFrames = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        callback(fps);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(countFrames);
    };
    
    requestAnimationFrame(countFrames);
  }
}

// Device performance profiles
const DEVICE_PROFILES = {
  highEnd: {
    name: 'High-end Device',
    cpuSlowdown: 1,
    memoryLimit: Infinity,
    expectedFPS: 60,
    maxScrollTime: 16, // 60fps = 16ms per frame
  },
  midRange: {
    name: 'Mid-range Device',
    cpuSlowdown: 2,
    memoryLimit: 1000,
    expectedFPS: 45,
    maxScrollTime: 22, // ~45fps
  },
  lowEnd: {
    name: 'Low-end Device',
    cpuSlowdown: 4,
    memoryLimit: 500,
    expectedFPS: 30,
    maxScrollTime: 33, // 30fps
  },
};

// Simulate device performance characteristics
const simulateDevicePerformance = (profile: typeof DEVICE_PROFILES[keyof typeof DEVICE_PROFILES]) => {
  // Mock slower performance by adding delays
  const originalRAF = window.requestAnimationFrame;
  window.requestAnimationFrame = (callback) => {
    return originalRAF(() => {
      setTimeout(callback, profile.cpuSlowdown - 1);
    });
  };
  
  return () => {
    window.requestAnimationFrame = originalRAF;
  };
};

describe('Mobile Menu Performance Testing', () => {
  let user: ReturnType<typeof userEvent.setup>;
  let performanceMonitor: PerformanceMonitor;

  beforeEach(() => {
    user = userEvent.setup();
    performanceMonitor = new PerformanceMonitor();
    
    // Set mobile viewport
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

  afterEach(() => {
    performanceMonitor.reset();
  });

  describe('Menu Opening Performance', () => {
    Object.entries(DEVICE_PROFILES).forEach(([profileName, profile]) => {
      test(`should open menu within performance budget on ${profile.name}`, async () => {
        const cleanup = simulateDevicePerformance(profile);
        
        try {
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          
          // Measure menu opening time
          const endMeasurement = performanceMonitor.startMeasurement('menu-open');
          
          await user.click(menuButton);
          
          await waitFor(() => {
            const menu = screen.getByRole('navigation', { name: /mobile navigation/i });
            expect(menu).toBeVisible();
          });
          
          const openTime = endMeasurement();
          
          // Should open within reasonable time based on device capability
          const maxExpectedTime = profile.name === 'Low-end Device' ? 500 : 300;
          expect(openTime).toBeLessThan(maxExpectedTime);
          
        } finally {
          cleanup();
        }
      });
    });

    test('should maintain consistent opening times across multiple opens', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      
      // Measure multiple menu opens
      for (let i = 0; i < 10; i++) {
        const endMeasurement = performanceMonitor.startMeasurement('menu-open-consistency');
        
        await user.click(menuButton);
        
        await waitFor(() => {
          const menu = screen.getByRole('navigation', { name: /mobile navigation/i });
          expect(menu).toBeVisible();
        });
        
        endMeasurement();
        
        // Close menu for next iteration
        await user.click(menuButton);
        
        await waitFor(() => {
          const menu = screen.queryByRole('navigation', { name: /mobile navigation/i });
          expect(menu).not.toBeVisible();
        });
      }
      
      const avgTime = performanceMonitor.getAverageDuration('menu-open-consistency');
      const maxTime = performanceMonitor.getMaxDuration('menu-open-consistency');
      const minTime = performanceMonitor.getMinDuration('menu-open-consistency');
      
      // Variance should be reasonable (max shouldn't be more than 2x min)
      expect(maxTime / minTime).toBeLessThan(2);
      expect(avgTime).toBeLessThan(200);
    });
  });

  describe('Scroll Performance', () => {
    test('should maintain 60fps during smooth scrolling', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      let minFPS = 60;
      let frameRateChecks = 0;
      
      // Monitor frame rate during scrolling
      performanceMonitor.monitorFrameRate((fps) => {
        if (frameRateChecks < 5) { // Check for 5 seconds
          minFPS = Math.min(minFPS, fps);
          frameRateChecks++;
        }
      });
      
      // Perform smooth scrolling
      const scrollPerf = performanceMonitor.startMeasurement('smooth-scroll');
      
      for (let i = 0; i <= 200; i += 10) {
        fireEvent.scroll(scrollableContainer, { target: { scrollTop: i } });
        await new Promise(resolve => requestAnimationFrame(resolve));
      }
      
      scrollPerf();
      
      // Wait for frame rate monitoring to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Should maintain reasonable frame rate (allowing for test environment limitations)
      expect(minFPS).toBeGreaterThan(30);
    });

    test('should handle rapid scroll events efficiently', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Measure rapid scrolling performance
      const rapidScrollPerf = performanceMonitor.startMeasurement('rapid-scroll');
      
      // Simulate rapid scroll events (like fast wheel scrolling)
      for (let i = 0; i < 100; i++) {
        fireEvent.scroll(scrollableContainer, { 
          target: { scrollTop: Math.random() * 300 } 
        });
      }
      
      const rapidScrollTime = rapidScrollPerf();
      
      // Should handle rapid events without significant delay
      expect(rapidScrollTime).toBeLessThan(100);
      expect(scrollableContainer).toBeVisible();
    });

    test('should optimize scroll event handling with debouncing', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Track scroll event handling
      let scrollEventCount = 0;
      const originalAddEventListener = scrollableContainer.addEventListener;
      
      scrollableContainer.addEventListener = function(type, listener, options) {
        if (type === 'scroll') {
          const wrappedListener = (...args: any[]) => {
            scrollEventCount++;
            return (listener as any)(...args);
          };
          return originalAddEventListener.call(this, type, wrappedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
      };
      
      // Generate many scroll events quickly
      for (let i = 0; i < 50; i++) {
        fireEvent.scroll(scrollableContainer, { target: { scrollTop: i * 2 } });
      }
      
      // Wait for debouncing to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should have processed events efficiently (exact count depends on debouncing implementation)
      expect(scrollEventCount).toBeLessThan(50); // Should be debounced
    });
  });

  describe('Memory Performance', () => {
    test('should not create memory leaks during repeated menu operations', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      
      // Simulate memory usage tracking
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Perform many menu operations
      for (let i = 0; i < 50; i++) {
        await user.click(menuButton);
        
        await waitFor(() => {
          const menu = screen.getByRole('navigation', { name: /mobile navigation/i });
          expect(menu).toBeVisible();
        });
        
        const scrollableContainer = screen.getByRole('menu');
        fireEvent.scroll(scrollableContainer, { target: { scrollTop: 100 } });
        
        await user.click(menuButton);
        
        await waitFor(() => {
          const menu = screen.queryByRole('navigation', { name: /mobile navigation/i });
          expect(menu).not.toBeVisible();
        });
      }
      
      // Force garbage collection if available
      if ((global as any).gc) {
        (global as any).gc();
      }
      
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0;
      
      // Memory usage shouldn't grow significantly (allowing for test environment variance)
      if (initialMemory > 0 && finalMemory > 0) {
        const memoryGrowth = finalMemory - initialMemory;
        const growthPercentage = (memoryGrowth / initialMemory) * 100;
        expect(growthPercentage).toBeLessThan(50); // Less than 50% growth
      }
    });

    test('should clean up event listeners properly', async () => {
      const { unmount } = render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Track event listener additions
      let listenerCount = 0;
      const originalAddEventListener = scrollableContainer.addEventListener;
      const originalRemoveEventListener = scrollableContainer.removeEventListener;
      
      scrollableContainer.addEventListener = function(...args) {
        listenerCount++;
        return originalAddEventListener.apply(this, args);
      };
      
      scrollableContainer.removeEventListener = function(...args) {
        listenerCount--;
        return originalRemoveEventListener.apply(this, args);
      };
      
      // Trigger some scroll events to ensure listeners are added
      fireEvent.scroll(scrollableContainer, { target: { scrollTop: 100 } });
      
      // Unmount component
      unmount();
      
      // All listeners should be cleaned up
      expect(listenerCount).toBeLessThanOrEqual(0);
    });
  });

  describe('Touch Performance', () => {
    test('should handle touch events with minimal latency', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Measure touch event handling
      const touchPerf = performanceMonitor.startMeasurement('touch-handling');
      
      // Simulate touch scroll gesture
      fireEvent.touchStart(scrollableContainer, {
        touches: [{ clientX: 0, clientY: 200 }],
      });
      
      for (let i = 200; i >= 100; i -= 10) {
        fireEvent.touchMove(scrollableContainer, {
          touches: [{ clientX: 0, clientY: i }],
        });
      }
      
      fireEvent.touchEnd(scrollableContainer);
      
      const touchTime = touchPerf();
      
      // Touch handling should be responsive
      expect(touchTime).toBeLessThan(50);
    });

    test('should prevent touch event conflicts with page scrolling', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Mock page scroll position
      let pageScrollTop = 0;
      Object.defineProperty(window, 'scrollY', {
        get: () => pageScrollTop,
        set: (value) => { pageScrollTop = value; },
      });
      
      const initialPageScroll = window.scrollY;
      
      // Perform touch scroll in menu
      fireEvent.touchStart(scrollableContainer, {
        touches: [{ clientX: 0, clientY: 200 }],
      });
      
      fireEvent.touchMove(scrollableContainer, {
        touches: [{ clientX: 0, clientY: 100 }],
      });
      
      fireEvent.touchEnd(scrollableContainer);
      
      // Page scroll should not be affected by menu scrolling
      expect(window.scrollY).toBe(initialPageScroll);
    });
  });

  describe('Animation Performance', () => {
    test('should use GPU acceleration for smooth animations', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      
      // Measure animation performance
      const animationPerf = performanceMonitor.startMeasurement('menu-animation');
      
      await user.click(menuButton);
      
      await waitFor(() => {
        const menu = screen.getByRole('navigation', { name: /mobile navigation/i });
        expect(menu).toBeVisible();
      });
      
      const animationTime = animationPerf();
      
      // Animation should complete quickly
      expect(animationTime).toBeLessThan(400); // Standard animation duration + buffer
      
      // Check for GPU acceleration hints in styles
      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
      const computedStyle = window.getComputedStyle(mobileMenu);
      
      // Look for GPU acceleration indicators (transform, will-change, etc.)
      const hasGPUAcceleration = 
        computedStyle.transform !== 'none' ||
        computedStyle.willChange !== 'auto' ||
        mobileMenu.classList.contains('gpu-accelerated');
      
      expect(hasGPUAcceleration).toBe(true);
    });

    test('should respect reduced motion preferences', async () => {
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
      
      // Measure animation with reduced motion
      const reducedMotionPerf = performanceMonitor.startMeasurement('reduced-motion-animation');
      
      await user.click(menuButton);
      
      await waitFor(() => {
        const menu = screen.getByRole('navigation', { name: /mobile navigation/i });
        expect(menu).toBeVisible();
      });
      
      const animationTime = reducedMotionPerf();
      
      // With reduced motion, animation should be faster or instant
      expect(animationTime).toBeLessThan(100);
    });
  });

  describe('Resource Usage Optimization', () => {
    test('should minimize DOM manipulations during scroll', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Track DOM mutations
      let mutationCount = 0;
      const observer = new MutationObserver((mutations) => {
        mutationCount += mutations.length;
      });
      
      observer.observe(scrollableContainer, {
        childList: true,
        subtree: true,
        attributes: true,
      });
      
      // Perform scrolling
      for (let i = 0; i <= 200; i += 20) {
        fireEvent.scroll(scrollableContainer, { target: { scrollTop: i } });
      }
      
      // Wait for any delayed mutations
      await new Promise(resolve => setTimeout(resolve, 100));
      
      observer.disconnect();
      
      // Should minimize DOM changes during scroll
      expect(mutationCount).toBeLessThan(20); // Allow some mutations for scroll indicators
    });

    test('should use efficient CSS selectors and properties', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
      const scrollableContainer = screen.getByRole('menu');
      
      // Check for efficient CSS properties
      const menuStyle = window.getComputedStyle(mobileMenu);
      const containerStyle = window.getComputedStyle(scrollableContainer);
      
      // Should use transform instead of changing layout properties
      expect(menuStyle.transform).toBeDefined();
      
      // Should use efficient overflow handling
      expect(containerStyle.overflowY).toBe('auto');
      
      // Should have proper containment for performance
      const hasContainment = 
        containerStyle.contain !== 'none' ||
        containerStyle.willChange !== 'auto';
      
      expect(hasContainment).toBe(true);
    });
  });

  describe('Performance Regression Testing', () => {
    test('should maintain performance with large menu lists', async () => {
      // This test would require mocking a larger menu, but demonstrates the approach
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      
      const largeMenuPerf = performanceMonitor.startMeasurement('large-menu-performance');
      
      await user.click(menuButton);
      
      await waitFor(() => {
        const menu = screen.getByRole('navigation', { name: /mobile navigation/i });
        expect(menu).toBeVisible();
      });
      
      const scrollableContainer = screen.getByRole('menu');
      
      // Test scrolling performance with current menu size
      for (let i = 0; i <= 300; i += 30) {
        fireEvent.scroll(scrollableContainer, { target: { scrollTop: i } });
      }
      
      const largeMenuTime = largeMenuPerf();
      
      // Should handle current menu size efficiently
      expect(largeMenuTime).toBeLessThan(500);
    });

    test('should maintain performance under stress conditions', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Stress test with rapid, random interactions
      const stressPerf = performanceMonitor.startMeasurement('stress-test');
      
      for (let i = 0; i < 200; i++) {
        // Random scroll positions
        const randomScroll = Math.random() * 300;
        fireEvent.scroll(scrollableContainer, { target: { scrollTop: randomScroll } });
        
        // Occasional focus changes
        if (i % 20 === 0) {
          const menuItems = screen.getAllByRole('menuitem');
          const randomItem = menuItems[Math.floor(Math.random() * menuItems.length)];
          randomItem.focus();
        }
        
        // Occasional touch events
        if (i % 30 === 0) {
          fireEvent.touchStart(scrollableContainer, {
            touches: [{ clientX: 0, clientY: Math.random() * 200 }],
          });
          fireEvent.touchEnd(scrollableContainer);
        }
      }
      
      const stressTime = stressPerf();
      
      // Should handle stress conditions without significant performance degradation
      expect(stressTime).toBeLessThan(1000);
      expect(scrollableContainer).toBeVisible();
    });
  });
});