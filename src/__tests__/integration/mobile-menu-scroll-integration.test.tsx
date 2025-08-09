/**
 * Integration tests for mobile menu scroll functionality across different screen sizes
 * Tests the complete scrolling system including dimensions, scroll state, and touch gestures
 */

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navbar from '@/components/layout/Navbar';

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
}));

// Mock Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock accessibility utilities
jest.mock('@/lib/accessibility', () => ({
  ariaAttributes: {
    link: jest.fn(() => ({})),
    button: jest.fn(() => ({})),
    scrollableContainer: jest.fn(() => ({})),
    scrollableItem: jest.fn(() => ({})),
  },
  keyboardHandlers: {
    onEnterOrSpace: jest.fn(() => jest.fn()),
  },
  trapFocus: jest.fn(() => jest.fn()),
  announceToScreenReader: jest.fn(),
  screenReaderUtils: {
    createScrollInstructions: jest.fn(() => document.createElement('div')),
    removeScrollInstructions: jest.fn(),
    announceScrollBoundary: jest.fn(),
    announceScrollState: jest.fn(),
  },
  motionPreferences: {
    getScrollBehavior: jest.fn(() => 'smooth'),
  },
  enhancedFocusManagement: {
    manageFocusWithScroll: jest.fn(() => jest.fn()),
  },
}));

// Mock performance utilities
jest.mock('@/lib/performanceUtils', () => ({
  performanceDebounce: jest.fn((fn) => ({
    debouncedFunction: fn,
    cancel: jest.fn(),
    flush: jest.fn(),
  })),
  addPassiveEventListener: jest.fn(() => jest.fn()),
  MobileMenuErrorBoundary: jest.fn().mockImplementation(() => ({
    wrapFunction: jest.fn((fn) => fn),
    reset: jest.fn(),
  })),
  PerformanceMonitor: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    recordScrollEvent: jest.fn(),
    startMonitoring: jest.fn(),
    stopMonitoring: jest.fn(),
    getMetrics: jest.fn(() => ({ frameRate: 60 })),
  })),
  MemoryManager: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    addCleanupTask: jest.fn(),
    removeCleanupTask: jest.fn(),
  })),
}));

// Mock mobile menu utilities
jest.mock('@/lib/mobileMenuUtils', () => ({
  calculateMenuDimensions: jest.fn(),
  getMenuCSSProperties: jest.fn(),
  DEFAULT_MOBILE_MENU_CONFIG: {
    breakpoints: { mobile: 768, tablet: 1024 },
    heights: {
      mobile: { maxVh: 70, reservedVh: 20 },
      tablet: { maxVh: 80, reservedVh: 15 }
    },
    fallback: { maxHeight: 400, itemHeight: 56 },
  },
}));

// Mock touch gesture utilities
jest.mock('@/lib/touchGestureUtils', () => ({
  useTouchGestures: jest.fn(() => ({
    getTouchState: () => ({ isActive: false, velocity: 0 }),
    getMomentumState: () => ({ isActive: false }),
    isActive: () => false,
  })),
  getOptimalTouchConfig: jest.fn(() => ({
    momentumEnabled: true,
    touchSensitivity: 1.0,
    preventPageScroll: true,
  })),
  isTouchDevice: jest.fn(() => true),
}));

// Mock hooks
jest.mock('@/lib/hooks/useMobileMenuDimensions', () => ({
  useMobileMenuDimensions: jest.fn(() => ({
    cssProperties: { '--menu-max-height': '400px' },
    isScrollable: true,
    dimensions: { maxHeight: 400, shouldScroll: true },
  })),
}));

jest.mock('@/lib/hooks/useScrollState', () => ({
  useScrollState: jest.fn(() => ({
    scrollState: {
      isScrollable: true,
      canScrollUp: false,
      canScrollDown: true,
      scrollTop: 0,
      scrollHeight: 800,
      clientHeight: 400,
      scrollPercentage: 0,
      isAtTop: true,
      isAtBottom: false,
    },
    setScrollContainer: jest.fn(),
    updateScrollState: jest.fn(),
    scrollTo: jest.fn(),
    scrollToTop: jest.fn(),
    scrollToBottom: jest.fn(),
    scrollBy: jest.fn(),
  })),
  useScrollIndicators: jest.fn(() => ({
    getScrollIndicatorClasses: () => 'mobile-menu-scrollable scrollable can-scroll-down',
    getScrollIndicatorStyles: () => ({ '--scroll-percentage': '0%' }),
  })),
}));

jest.mock('@/lib/hooks/useMobileMenuKeyboard', () => ({
  useMobileMenuKeyboard: jest.fn(() => ({
    currentIndex: -1,
    isScrollable: true,
  })),
}));

const mockCalculateMenuDimensions = jest.mocked(require('@/lib/mobileMenuUtils').calculateMenuDimensions);
const mockGetMenuCSSProperties = jest.mocked(require('@/lib/mobileMenuUtils').getMenuCSSProperties);
const mockUseMobileMenuDimensions = jest.mocked(require('@/lib/hooks/useMobileMenuDimensions').useMobileMenuDimensions);
const mockUseScrollState = jest.mocked(require('@/lib/hooks/useScrollState').useScrollState);
const mockUseTouchGestures = jest.mocked(require('@/lib/touchGestureUtils').useTouchGestures);
const mockIsTouchDevice = jest.mocked(require('@/lib/touchGestureUtils').isTouchDevice);

describe('Mobile Menu Scroll Integration', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    jest.clearAllMocks();
    
    // Default mock implementations
    mockCalculateMenuDimensions.mockReturnValue({
      maxHeight: 400,
      shouldScroll: true,
      itemHeight: 56,
      totalContentHeight: 500,
    });
    
    mockGetMenuCSSProperties.mockReturnValue({
      '--menu-max-height': '400px',
      '--menu-item-height': '56px',
      '--menu-total-height': '500px',
      '--menu-scrollable': '1',
    });
  });

  describe('Mobile Screen Size (375x667)', () => {
    beforeEach(() => {
      // Set mobile viewport
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
      
      mockUseMobileMenuDimensions.mockReturnValue({
        cssProperties: { '--menu-max-height': '467px' }, // 70% of 667px
        isScrollable: true,
        dimensions: { maxHeight: 467, shouldScroll: true, itemHeight: 56, totalContentHeight: 500 },
        maxHeight: 467,
        itemHeight: 56,
      });
    });

    it('should calculate correct dimensions for mobile screen', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      expect(mockUseMobileMenuDimensions).toHaveBeenCalledWith({
        itemCount: 9, // 8 nav links + 1 CTA
        enabled: true,
      });
      
      expect(mockCalculateMenuDimensions).toHaveBeenCalledWith(
        9,
        expect.objectContaining({
          heights: expect.objectContaining({
            mobile: { maxVh: 70, reservedVh: 20 }
          })
        })
      );
    });

    it('should apply mobile-specific CSS properties', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
      expect(mobileMenu).toHaveStyle('--menu-max-height: 467px');
    });

    it('should enable scrolling when content exceeds mobile viewport', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      expect(scrollableContainer).toHaveClass('mobile-menu-scrollable');
      expect(scrollableContainer).toHaveClass('scrollable');
      expect(scrollableContainer).toHaveClass('can-scroll-down');
    });

    it('should handle touch gestures on mobile', async () => {
      mockIsTouchDevice.mockReturnValue(true);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      expect(mockUseTouchGestures).toHaveBeenCalledWith(
        expect.any(Object), // ref
        expect.objectContaining({
          preventPageScroll: true,
          momentumEnabled: true,
          bounceEnabled: false,
          touchSensitivity: 1.2,
        }),
        true // enabled for touch device
      );
    });
  });

  describe('Tablet Screen Size (768x1024)', () => {
    beforeEach(() => {
      // Set tablet viewport
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
      
      mockUseMobileMenuDimensions.mockReturnValue({
        cssProperties: { '--menu-max-height': '819px' }, // 80% of 1024px
        isScrollable: false, // More space available
        dimensions: { maxHeight: 819, shouldScroll: false, itemHeight: 56, totalContentHeight: 500 },
        maxHeight: 819,
        itemHeight: 56,
      });
    });

    it('should calculate correct dimensions for tablet screen', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      expect(mockCalculateMenuDimensions).toHaveBeenCalledWith(
        9,
        expect.objectContaining({
          heights: expect.objectContaining({
            tablet: { maxVh: 80, reservedVh: 15 }
          })
        })
      );
    });

    it('should not require scrolling on tablet when content fits', async () => {
      mockUseMobileMenuDimensions.mockReturnValue({
        cssProperties: { '--menu-max-height': '819px' },
        isScrollable: false,
        dimensions: { maxHeight: 819, shouldScroll: false, itemHeight: 56, totalContentHeight: 500 },
        maxHeight: 819,
        itemHeight: 56,
      });

      const mockScrollState = {
        isScrollable: false,
        canScrollUp: false,
        canScrollDown: false,
        scrollTop: 0,
        scrollHeight: 500,
        clientHeight: 819,
        scrollPercentage: 0,
        isAtTop: true,
        isAtBottom: false,
      };

      mockUseScrollState.mockReturnValue({
        scrollState: mockScrollState,
        setScrollContainer: jest.fn(),
        updateScrollState: jest.fn(),
        scrollTo: jest.fn(),
        scrollToTop: jest.fn(),
        scrollToBottom: jest.fn(),
        scrollBy: jest.fn(),
      });

      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      expect(scrollableContainer).toHaveClass('mobile-menu-scrollable');
      expect(scrollableContainer).not.toHaveClass('scrollable');
    });
  });

  describe('Large Tablet/Small Desktop (1024x768 - Landscape)', () => {
    beforeEach(() => {
      // Set landscape tablet viewport
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
      
      mockUseMobileMenuDimensions.mockReturnValue({
        cssProperties: { '--menu-max-height': '614px' }, // 80% of 768px
        isScrollable: true, // Less height in landscape
        dimensions: { maxHeight: 614, shouldScroll: true, itemHeight: 56, totalContentHeight: 500 },
        maxHeight: 614,
        itemHeight: 56,
      });
    });

    it('should handle landscape orientation correctly', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      expect(mockCalculateMenuDimensions).toHaveBeenCalledWith(9, expect.any(Object));
      
      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
      expect(mobileMenu).toHaveStyle('--menu-max-height: 614px');
    });

    it('should enable scrolling in landscape when needed', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      expect(scrollableContainer).toHaveClass('scrollable');
    });
  });

  describe('Orientation Changes', () => {
    it('should recalculate dimensions on orientation change', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      // Initial call
      expect(mockUseMobileMenuDimensions).toHaveBeenCalledTimes(1);

      // Simulate orientation change
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 667,
        });
        
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: 375,
        });

        fireEvent(window, new Event('orientationchange'));
      });

      await waitFor(() => {
        expect(mockCalculateMenuDimensions).toHaveBeenCalledTimes(2);
      });
    });

    it('should update scroll state after orientation change', async () => {
      const mockUpdateScrollState = jest.fn();
      mockUseScrollState.mockReturnValue({
        scrollState: {
          isScrollable: true,
          canScrollUp: false,
          canScrollDown: true,
          scrollTop: 0,
          scrollHeight: 800,
          clientHeight: 400,
          scrollPercentage: 0,
          isAtTop: true,
          isAtBottom: false,
        },
        setScrollContainer: jest.fn(),
        updateScrollState: mockUpdateScrollState,
        scrollTo: jest.fn(),
        scrollToTop: jest.fn(),
        scrollToBottom: jest.fn(),
        scrollBy: jest.fn(),
      });

      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      // Simulate orientation change
      act(() => {
        fireEvent(window, new Event('orientationchange'));
      });

      await waitFor(() => {
        expect(mockUpdateScrollState).toHaveBeenCalled();
      });
    });
  });

  describe('Window Resize Handling', () => {
    it('should handle window resize events', async () => {
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      // Initial calculation
      expect(mockCalculateMenuDimensions).toHaveBeenCalledTimes(1);

      // Simulate window resize
      act(() => {
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: 500,
        });
        
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: 800,
        });

        fireEvent(window, new Event('resize'));
      });

      await waitFor(() => {
        expect(mockCalculateMenuDimensions).toHaveBeenCalledTimes(2);
      });
    });

    it('should debounce resize events for performance', async () => {
      const mockPerformanceDebounce = jest.mocked(require('@/lib/performanceUtils').performanceDebounce);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      expect(mockPerformanceDebounce).toHaveBeenCalledWith(
        expect.any(Function),
        150, // 150ms debounce for resize
        expect.objectContaining({
          leading: false,
          trailing: true,
          maxWait: 300,
        })
      );
    });
  });

  describe('Touch Device Detection', () => {
    it('should enable touch gestures on touch devices', async () => {
      mockIsTouchDevice.mockReturnValue(true);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      expect(mockUseTouchGestures).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        true // enabled
      );
    });

    it('should disable touch gestures on non-touch devices', async () => {
      mockIsTouchDevice.mockReturnValue(false);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      expect(mockUseTouchGestures).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        false // disabled
      );
    });
  });

  describe('Scroll State Integration', () => {
    it('should set scroll container when menu opens', async () => {
      const mockSetScrollContainer = jest.fn();
      mockUseScrollState.mockReturnValue({
        scrollState: {
          isScrollable: true,
          canScrollUp: false,
          canScrollDown: true,
          scrollTop: 0,
          scrollHeight: 800,
          clientHeight: 400,
          scrollPercentage: 0,
          isAtTop: true,
          isAtBottom: false,
        },
        setScrollContainer: mockSetScrollContainer,
        updateScrollState: jest.fn(),
        scrollTo: jest.fn(),
        scrollToTop: jest.fn(),
        scrollToBottom: jest.fn(),
        scrollBy: jest.fn(),
      });

      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      expect(mockSetScrollContainer).toHaveBeenCalledWith(expect.any(HTMLElement));
    });

    it('should clear scroll container when menu closes', async () => {
      const mockSetScrollContainer = jest.fn();
      mockUseScrollState.mockReturnValue({
        scrollState: {
          isScrollable: true,
          canScrollUp: false,
          canScrollDown: true,
          scrollTop: 0,
          scrollHeight: 800,
          clientHeight: 400,
          scrollPercentage: 0,
          isAtTop: true,
          isAtBottom: false,
        },
        setScrollContainer: mockSetScrollContainer,
        updateScrollState: jest.fn(),
        scrollTo: jest.fn(),
        scrollToTop: jest.fn(),
        scrollToBottom: jest.fn(),
        scrollBy: jest.fn(),
      });

      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      
      // Open menu
      await user.click(menuButton);
      expect(mockSetScrollContainer).toHaveBeenCalledWith(expect.any(HTMLElement));
      
      // Close menu
      await user.click(menuButton);
      expect(mockSetScrollContainer).toHaveBeenCalledWith(null);
    });

    it('should update scroll state when dimensions change', async () => {
      const mockUpdateScrollState = jest.fn();
      mockUseScrollState.mockReturnValue({
        scrollState: {
          isScrollable: true,
          canScrollUp: false,
          canScrollDown: true,
          scrollTop: 0,
          scrollHeight: 800,
          clientHeight: 400,
          scrollPercentage: 0,
          isAtTop: true,
          isAtBottom: false,
        },
        setScrollContainer: jest.fn(),
        updateScrollState: mockUpdateScrollState,
        scrollTo: jest.fn(),
        scrollToTop: jest.fn(),
        scrollToBottom: jest.fn(),
        scrollBy: jest.fn(),
      });

      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      expect(mockUpdateScrollState).toHaveBeenCalled();
    });
  });

  describe('Performance Monitoring', () => {
    it('should initialize performance monitoring', async () => {
      const MockPerformanceMonitor = jest.mocked(require('@/lib/performanceUtils').PerformanceMonitor);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      expect(MockPerformanceMonitor).toHaveBeenCalled();
    });

    it('should use passive event listeners for performance', async () => {
      const mockAddPassiveEventListener = jest.mocked(require('@/lib/performanceUtils').addPassiveEventListener);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      expect(mockAddPassiveEventListener).toHaveBeenCalledWith(
        window,
        'resize',
        expect.any(Function),
        { passive: true }
      );
    });
  });

  describe('Error Handling', () => {
    it('should handle dimension calculation errors gracefully', async () => {
      mockCalculateMenuDimensions.mockImplementationOnce(() => {
        throw new Error('Calculation failed');
      });

      // Should not crash
      expect(() => {
        render(<Navbar />);
      }).not.toThrow();
    });

    it('should handle scroll state errors gracefully', async () => {
      mockUseScrollState.mockImplementationOnce(() => {
        throw new Error('Scroll state failed');
      });

      // Should not crash
      expect(() => {
        render(<Navbar />);
      }).not.toThrow();
    });
  });
});