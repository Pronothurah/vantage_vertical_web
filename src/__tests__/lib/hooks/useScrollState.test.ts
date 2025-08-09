/**
 * Unit tests for useScrollState hook
 * Tests scroll state management, boundary detection, and accessibility features
 */

import { renderHook, act } from '@testing-library/react';
import { useScrollState, useScrollIndicators } from '@/lib/hooks/useScrollState';

// Mock accessibility utilities
jest.mock('@/lib/accessibility', () => ({
  announceToScreenReader: jest.fn(),
  screenReaderUtils: {
    announceScrollBoundary: jest.fn(),
    announceScrollState: jest.fn(),
  },
  motionPreferences: {
    getScrollBehavior: jest.fn(() => 'smooth'),
  },
}));

// Mock performance utilities
jest.mock('@/lib/performanceUtils', () => ({
  performanceDebounce: jest.fn((fn, delay, options) => ({
    debouncedFunction: fn,
    cancel: jest.fn(),
    flush: jest.fn(),
  })),
  addPassiveEventListener: jest.fn(() => jest.fn()),
  MobileMenuErrorBoundary: jest.fn().mockImplementation(() => ({
    wrapFunction: jest.fn((fn, type, fallback) => (...args: any[]) => {
      try {
        return fn(...args);
      } catch (error) {
        return fallback;
      }
    }),
    reset: jest.fn(),
  })),
  PerformanceMonitor: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    recordScrollEvent: jest.fn(),
    startMonitoring: jest.fn(),
    stopMonitoring: jest.fn(),
    getMetrics: jest.fn(() => ({ frameRate: 60 })),
  })),
}));

const mockAnnounceToScreenReader = jest.mocked(require('@/lib/accessibility').announceToScreenReader);
const mockScreenReaderUtils = jest.mocked(require('@/lib/accessibility').screenReaderUtils);
const mockMotionPreferences = jest.mocked(require('@/lib/accessibility').motionPreferences);

describe('useScrollState', () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create mock element
    mockElement = document.createElement('div');
    Object.defineProperties(mockElement, {
      scrollTop: { value: 0, writable: true },
      scrollHeight: { value: 800, writable: true },
      clientHeight: { value: 400, writable: true },
      scrollTo: { value: jest.fn(), writable: true },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Initial State', () => {
    it('should initialize with default scroll state', () => {
      const { result } = renderHook(() => useScrollState());

      expect(result.current.scrollState).toEqual({
        isScrollable: false,
        canScrollUp: false,
        canScrollDown: false,
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
        scrollPercentage: 0,
        isAtTop: true,
        isAtBottom: false,
      });
    });

    it('should accept custom configuration', () => {
      const customConfig = {
        showScrollbar: false,
        announceScrollState: false,
        scrollThreshold: 10,
        debounceMs: 200,
      };

      const { result } = renderHook(() => 
        useScrollState({ config: customConfig })
      );

      expect(result.current.scrollState).toBeDefined();
    });
  });

  describe('Scroll Container Management', () => {
    it('should calculate scroll state when container is set', () => {
      const { result } = renderHook(() => useScrollState());

      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      expect(result.current.scrollState).toEqual({
        isScrollable: true, // 800 > 400
        canScrollUp: false, // scrollTop = 0
        canScrollDown: true, // scrollTop < scrollHeight - clientHeight
        scrollTop: 0,
        scrollHeight: 800,
        clientHeight: 400,
        scrollPercentage: 0,
        isAtTop: true,
        isAtBottom: false,
      });
    });

    it('should reset state when container is removed', () => {
      const { result } = renderHook(() => useScrollState());

      // Set container first
      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      // Remove container
      act(() => {
        result.current.setScrollContainer(null);
      });

      expect(result.current.scrollState).toEqual({
        isScrollable: false,
        canScrollUp: false,
        canScrollDown: false,
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
        scrollPercentage: 0,
        isAtTop: true,
        isAtBottom: false,
      });
    });

    it('should announce scroll availability for screen readers', () => {
      const { result } = renderHook(() => useScrollState());

      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      expect(mockAnnounceToScreenReader).toHaveBeenCalledWith(
        'Menu is scrollable. Scroll down for more items.',
        'polite'
      );
    });
  });

  describe('Scroll State Calculation', () => {
    it('should calculate scroll state correctly at different positions', () => {
      const { result } = renderHook(() => useScrollState());

      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      // Test middle position
      act(() => {
        mockElement.scrollTop = 200;
        result.current.updateScrollState();
      });

      expect(result.current.scrollState).toEqual({
        isScrollable: true,
        canScrollUp: true,
        canScrollDown: true,
        scrollTop: 200,
        scrollHeight: 800,
        clientHeight: 400,
        scrollPercentage: 50, // 200 / (800 - 400) * 100
        isAtTop: false,
        isAtBottom: false,
      });

      // Test bottom position
      act(() => {
        mockElement.scrollTop = 400; // scrollHeight - clientHeight
        result.current.updateScrollState();
      });

      expect(result.current.scrollState).toEqual({
        isScrollable: true,
        canScrollUp: true,
        canScrollDown: false,
        scrollTop: 400,
        scrollHeight: 800,
        clientHeight: 400,
        scrollPercentage: 100,
        isAtTop: false,
        isAtBottom: true,
      });
    });

    it('should handle non-scrollable content', () => {
      const { result } = renderHook(() => useScrollState());
      
      // Create non-scrollable element
      const nonScrollableElement = document.createElement('div');
      Object.defineProperties(nonScrollableElement, {
        scrollTop: { value: 0, writable: true },
        scrollHeight: { value: 300, writable: true },
        clientHeight: { value: 400, writable: true }, // clientHeight > scrollHeight
        scrollTo: { value: jest.fn(), writable: true },
      });

      act(() => {
        result.current.setScrollContainer(nonScrollableElement);
      });

      expect(result.current.scrollState).toEqual({
        isScrollable: false,
        canScrollUp: false,
        canScrollDown: false,
        scrollTop: 0,
        scrollHeight: 300,
        clientHeight: 400,
        scrollPercentage: 0,
        isAtTop: true,
        isAtBottom: false,
      });
    });

    it('should respect scroll threshold for boundary detection', () => {
      const { result } = renderHook(() => 
        useScrollState({ config: { scrollThreshold: 10 } })
      );

      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      // Test near-top position (within threshold)
      act(() => {
        mockElement.scrollTop = 5; // Less than threshold
        result.current.updateScrollState();
      });

      expect(result.current.scrollState.isAtTop).toBe(true);
      expect(result.current.scrollState.canScrollUp).toBe(false);

      // Test just outside threshold
      act(() => {
        mockElement.scrollTop = 15; // Greater than threshold
        result.current.updateScrollState();
      });

      expect(result.current.scrollState.isAtTop).toBe(false);
      expect(result.current.scrollState.canScrollUp).toBe(true);
    });
  });

  describe('Scroll Event Handling', () => {
    it('should handle scroll events with debouncing', () => {
      const mockPerformanceDebounce = jest.mocked(require('@/lib/performanceUtils').performanceDebounce);
      const onScrollStateChange = jest.fn();
      
      const { result } = renderHook(() => 
        useScrollState({ onScrollStateChange })
      );

      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      expect(mockPerformanceDebounce).toHaveBeenCalledWith(
        expect.any(Function),
        100, // Default debounce
        expect.objectContaining({
          leading: false,
          trailing: true,
        })
      );
    });

    it('should call onScrollStateChange callback', () => {
      const onScrollStateChange = jest.fn();
      const { result } = renderHook(() => 
        useScrollState({ onScrollStateChange })
      );

      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      expect(onScrollStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isScrollable: true,
          scrollTop: 0,
          scrollHeight: 800,
          clientHeight: 400,
        })
      );
    });
  });

  describe('Accessibility Announcements', () => {
    it('should announce scroll boundary changes', () => {
      const { result } = renderHook(() => useScrollState());

      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      // Move to bottom
      act(() => {
        mockElement.scrollTop = 400;
        result.current.updateScrollState();
      });

      expect(mockScreenReaderUtils.announceScrollBoundary).toHaveBeenCalledWith('bottom');

      // Move back to top
      act(() => {
        mockElement.scrollTop = 0;
        result.current.updateScrollState();
      });

      expect(mockScreenReaderUtils.announceScrollBoundary).toHaveBeenCalledWith('top');
    });

    it('should not announce when announcements are disabled', () => {
      const { result } = renderHook(() => 
        useScrollState({ config: { announceScrollState: false } })
      );

      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      act(() => {
        mockElement.scrollTop = 400;
        result.current.updateScrollState();
      });

      expect(mockScreenReaderUtils.announceScrollBoundary).not.toHaveBeenCalled();
    });
  });

  describe('Scroll Control Methods', () => {
    it('should scroll to specific position', () => {
      const { result } = renderHook(() => useScrollState());

      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      act(() => {
        result.current.scrollTo(200);
      });

      expect(mockElement.scrollTo).toHaveBeenCalledWith({
        top: 200,
        behavior: 'smooth',
      });
    });

    it('should scroll to top', () => {
      const { result } = renderHook(() => useScrollState());

      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      act(() => {
        result.current.scrollToTop();
      });

      expect(mockElement.scrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    });

    it('should scroll to bottom', () => {
      const { result } = renderHook(() => useScrollState());

      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      act(() => {
        result.current.scrollToBottom();
      });

      expect(mockElement.scrollTo).toHaveBeenCalledWith({
        top: 800, // scrollHeight
        behavior: 'smooth',
      });
    });

    it('should scroll by amount', () => {
      const { result } = renderHook(() => useScrollState());

      act(() => {
        result.current.setScrollContainer(mockElement);
        mockElement.scrollTop = 100;
      });

      act(() => {
        result.current.scrollBy(50);
      });

      expect(mockElement.scrollTo).toHaveBeenCalledWith({
        top: 150, // current + amount
        behavior: 'smooth',
      });
    });

    it('should respect reduced motion preferences', () => {
      mockMotionPreferences.getScrollBehavior.mockReturnValue('auto');
      
      const { result } = renderHook(() => useScrollState());

      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      act(() => {
        result.current.scrollTo(200);
      });

      expect(mockElement.scrollTo).toHaveBeenCalledWith({
        top: 200,
        behavior: 'auto', // Reduced motion
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle calculation errors gracefully', () => {
      const { result } = renderHook(() => useScrollState());

      // Create element that throws on property access
      const errorElement = {
        get scrollTop() { throw new Error('Access denied'); },
        get scrollHeight() { throw new Error('Access denied'); },
        get clientHeight() { throw new Error('Access denied'); },
        scrollTo: jest.fn(),
      } as any;

      act(() => {
        result.current.setScrollContainer(errorElement);
      });

      // Should use fallback state
      expect(result.current.scrollState).toEqual({
        isScrollable: false,
        canScrollUp: false,
        canScrollDown: false,
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
        scrollPercentage: 0,
        isAtTop: true,
        isAtBottom: false,
      });
    });
  });

  describe('Performance Monitoring', () => {
    it('should initialize performance monitor', () => {
      const MockPerformanceMonitor = jest.mocked(require('@/lib/performanceUtils').PerformanceMonitor);
      
      renderHook(() => useScrollState());

      expect(MockPerformanceMonitor).toHaveBeenCalledWith(
        { minFrameRate: 55, maxFrameTime: 18, maxDroppedFrames: 5 },
        expect.any(Function)
      );
    });

    it('should record scroll events', () => {
      const mockPerformanceMonitor = {
        destroy: jest.fn(),
        recordScrollEvent: jest.fn(),
        startMonitoring: jest.fn(),
        stopMonitoring: jest.fn(),
        getMetrics: jest.fn(() => ({ frameRate: 60 })),
      };
      
      jest.mocked(require('@/lib/performanceUtils').PerformanceMonitor)
        .mockImplementation(() => mockPerformanceMonitor);

      const { result } = renderHook(() => useScrollState());

      act(() => {
        result.current.setScrollContainer(mockElement);
        result.current.updateScrollState();
      });

      expect(mockPerformanceMonitor.recordScrollEvent).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('should clean up on unmount', () => {
      const mockCleanup = jest.fn();
      const mockCancel = jest.fn();
      const mockPerformanceMonitor = {
        destroy: jest.fn(),
        stopMonitoring: jest.fn(),
        recordScrollEvent: jest.fn(),
        getMetrics: jest.fn(() => ({ frameRate: 60 })),
      };

      jest.mocked(require('@/lib/performanceUtils').addPassiveEventListener)
        .mockReturnValue(mockCleanup);
      jest.mocked(require('@/lib/performanceUtils').performanceDebounce)
        .mockReturnValue({ debouncedFunction: jest.fn(), cancel: mockCancel, flush: jest.fn() });
      jest.mocked(require('@/lib/performanceUtils').PerformanceMonitor)
        .mockImplementation(() => mockPerformanceMonitor);

      const { result, unmount } = renderHook(() => useScrollState());

      act(() => {
        result.current.setScrollContainer(mockElement);
      });

      unmount();

      expect(mockCleanup).toHaveBeenCalled();
      expect(mockCancel).toHaveBeenCalled();
      expect(mockPerformanceMonitor.stopMonitoring).toHaveBeenCalled();
    });
  });
});

describe('useScrollIndicators', () => {
  const mockScrollState = {
    isScrollable: true,
    canScrollUp: true,
    canScrollDown: true,
    scrollTop: 200,
    scrollHeight: 800,
    clientHeight: 400,
    scrollPercentage: 50,
    isAtTop: false,
    isAtBottom: false,
  };

  it('should generate correct CSS classes for scrollable state', () => {
    const { result } = renderHook(() => useScrollIndicators(mockScrollState));

    const classes = result.current.getScrollIndicatorClasses();
    expect(classes).toBe('mobile-menu-scrollable scrollable can-scroll-up can-scroll-down');
  });

  it('should generate correct CSS classes for non-scrollable state', () => {
    const nonScrollableState = {
      ...mockScrollState,
      isScrollable: false,
      canScrollUp: false,
      canScrollDown: false,
    };

    const { result } = renderHook(() => useScrollIndicators(nonScrollableState));

    const classes = result.current.getScrollIndicatorClasses();
    expect(classes).toBe('mobile-menu-scrollable');
  });

  it('should generate correct CSS classes at top boundary', () => {
    const topState = {
      ...mockScrollState,
      canScrollUp: false,
      isAtTop: true,
    };

    const { result } = renderHook(() => useScrollIndicators(topState));

    const classes = result.current.getScrollIndicatorClasses();
    expect(classes).toBe('mobile-menu-scrollable scrollable can-scroll-down');
  });

  it('should generate correct CSS classes at bottom boundary', () => {
    const bottomState = {
      ...mockScrollState,
      canScrollDown: false,
      isAtBottom: true,
    };

    const { result } = renderHook(() => useScrollIndicators(bottomState));

    const classes = result.current.getScrollIndicatorClasses();
    expect(classes).toBe('mobile-menu-scrollable scrollable can-scroll-up');
  });

  it('should generate correct CSS custom properties', () => {
    const { result } = renderHook(() => useScrollIndicators(mockScrollState));

    const styles = result.current.getScrollIndicatorStyles();
    expect(styles).toEqual({
      '--scroll-percentage': '50%',
      '--scroll-top': '200px',
      '--scroll-height': '800px',
      '--client-height': '400px',
    });
  });

  it('should update when scroll state changes', () => {
    const { result, rerender } = renderHook(
      ({ scrollState }) => useScrollIndicators(scrollState),
      { initialProps: { scrollState: mockScrollState } }
    );

    const initialClasses = result.current.getScrollIndicatorClasses();
    expect(initialClasses).toContain('can-scroll-up');

    // Update to top position
    const topState = {
      ...mockScrollState,
      canScrollUp: false,
      isAtTop: true,
      scrollPercentage: 0,
    };

    rerender({ scrollState: topState });

    const updatedClasses = result.current.getScrollIndicatorClasses();
    expect(updatedClasses).not.toContain('can-scroll-up');
    
    const updatedStyles = result.current.getScrollIndicatorStyles();
    expect((updatedStyles as any)['--scroll-percentage']).toBe('0%');
  });
});