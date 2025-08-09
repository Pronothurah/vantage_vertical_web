/**
 * Unit tests for useMobileMenuDimensions hook
 * Tests height calculation utilities and responsive dimension management
 */

import { renderHook, act } from '@testing-library/react';
import { useMobileMenuDimensions, useStaticMobileMenuDimensions } from '@/lib/hooks/useMobileMenuDimensions';
import { DEFAULT_MOBILE_MENU_CONFIG } from '@/lib/mobileMenuUtils';

// Mock the mobile menu utils
jest.mock('@/lib/mobileMenuUtils', () => ({
  calculateMenuDimensions: jest.fn(),
  setupResizeListener: jest.fn(),
  getMenuCSSProperties: jest.fn(),
  DEFAULT_MOBILE_MENU_CONFIG: {
    breakpoints: { mobile: 768, tablet: 1024 },
    heights: {
      mobile: { maxVh: 70, reservedVh: 20 },
      tablet: { maxVh: 80, reservedVh: 15 }
    },
    fallback: {
      maxHeight: 400,
      itemHeight: 56,
    },
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
    wrapFunction: jest.fn((fn) => fn),
    reset: jest.fn(),
  })),
  PerformanceMonitor: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    recordResizeEvent: jest.fn(),
    startMonitoring: jest.fn(),
  })),
  MemoryManager: jest.fn().mockImplementation(() => ({
    destroy: jest.fn(),
    addCleanupTask: jest.fn(),
    removeCleanupTask: jest.fn(),
  })),
}));

const mockCalculateMenuDimensions = jest.mocked(require('@/lib/mobileMenuUtils').calculateMenuDimensions);
const mockGetMenuCSSProperties = jest.mocked(require('@/lib/mobileMenuUtils').getMenuCSSProperties);

describe('useMobileMenuDimensions', () => {
  beforeEach(() => {
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
    
    // Mock window dimensions
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
    jest.restoreAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should calculate initial dimensions correctly', () => {
      const { result } = renderHook(() =>
        useMobileMenuDimensions({
          itemCount: 8,
          enabled: true,
        })
      );

      expect(mockCalculateMenuDimensions).toHaveBeenCalledWith(8, DEFAULT_MOBILE_MENU_CONFIG);
      expect(result.current.dimensions).toEqual({
        maxHeight: 400,
        shouldScroll: true,
        itemHeight: 56,
        totalContentHeight: 500,
      });
      expect(result.current.isScrollable).toBe(true);
      expect(result.current.maxHeight).toBe(400);
      expect(result.current.itemHeight).toBe(56);
    });

    it('should generate CSS properties correctly', () => {
      const { result } = renderHook(() =>
        useMobileMenuDimensions({
          itemCount: 8,
          enabled: true,
        })
      );

      expect(mockGetMenuCSSProperties).toHaveBeenCalledWith({
        maxHeight: 400,
        shouldScroll: true,
        itemHeight: 56,
        totalContentHeight: 500,
      });
      
      expect(result.current.cssProperties).toEqual({
        '--menu-max-height': '400px',
        '--menu-item-height': '56px',
        '--menu-total-height': '500px',
        '--menu-scrollable': '1',
      });
    });

    it('should handle disabled state', () => {
      const { result } = renderHook(() =>
        useMobileMenuDimensions({
          itemCount: 8,
          enabled: false,
        })
      );

      // Should still calculate dimensions but not set up listeners
      expect(mockCalculateMenuDimensions).toHaveBeenCalled();
      expect(result.current.dimensions).toBeDefined();
    });
  });

  describe('Responsive Behavior', () => {
    it('should recalculate dimensions when itemCount changes', () => {
      const { result, rerender } = renderHook(
        ({ itemCount }) => useMobileMenuDimensions({ itemCount, enabled: true }),
        { initialProps: { itemCount: 5 } }
      );

      expect(mockCalculateMenuDimensions).toHaveBeenCalledWith(5, DEFAULT_MOBILE_MENU_CONFIG);

      // Change itemCount
      rerender({ itemCount: 10 });

      expect(mockCalculateMenuDimensions).toHaveBeenCalledWith(10, DEFAULT_MOBILE_MENU_CONFIG);
    });

    it('should handle window resize events', () => {
      const { result } = renderHook(() =>
        useMobileMenuDimensions({
          itemCount: 8,
          enabled: true,
        })
      );

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

        // Trigger resize event
        window.dispatchEvent(new Event('resize'));
      });

      // Should recalculate dimensions
      expect(mockCalculateMenuDimensions).toHaveBeenCalledTimes(2); // Initial + resize
    });

    it('should handle orientation change events', () => {
      const { result } = renderHook(() =>
        useMobileMenuDimensions({
          itemCount: 8,
          enabled: true,
        })
      );

      // Simulate orientation change
      act(() => {
        window.dispatchEvent(new Event('orientationchange'));
      });

      // Should recalculate dimensions
      expect(mockCalculateMenuDimensions).toHaveBeenCalledTimes(2); // Initial + orientation change
    });
  });

  describe('Error Handling', () => {
    it('should handle calculation errors gracefully', () => {
      mockCalculateMenuDimensions.mockImplementationOnce(() => {
        throw new Error('Calculation failed');
      });

      const { result } = renderHook(() =>
        useMobileMenuDimensions({
          itemCount: 8,
          enabled: true,
        })
      );

      // Should use fallback values
      expect(result.current.dimensions).toEqual({
        maxHeight: 400,
        shouldScroll: true, // 8 items > 8 fallback threshold
        itemHeight: 56,
        totalContentHeight: 8 * 56 + 32,
      });
    });

    it('should handle CSS property generation errors', () => {
      mockGetMenuCSSProperties.mockImplementationOnce(() => {
        throw new Error('CSS generation failed');
      });

      const { result } = renderHook(() =>
        useMobileMenuDimensions({
          itemCount: 8,
          enabled: true,
        })
      );

      // Should provide fallback CSS properties
      expect(result.current.cssProperties).toEqual({
        '--menu-max-height': '400px',
        '--menu-item-height': '56px',
        '--menu-total-height': `${8 * 56 + 32}px`,
        '--menu-scrollable': '1',
      });
    });
  });

  describe('Performance Optimization', () => {
    it('should debounce resize events', () => {
      const mockPerformanceDebounce = jest.mocked(require('@/lib/performanceUtils').performanceDebounce);
      
      renderHook(() =>
        useMobileMenuDimensions({
          itemCount: 8,
          enabled: true,
        })
      );

      expect(mockPerformanceDebounce).toHaveBeenCalledWith(
        expect.any(Function),
        150, // 150ms debounce
        expect.objectContaining({
          leading: false,
          trailing: true,
          maxWait: 300,
        })
      );
    });

    it('should use passive event listeners', () => {
      const mockAddPassiveEventListener = jest.mocked(require('@/lib/performanceUtils').addPassiveEventListener);
      
      renderHook(() =>
        useMobileMenuDimensions({
          itemCount: 8,
          enabled: true,
        })
      );

      expect(mockAddPassiveEventListener).toHaveBeenCalledWith(
        window,
        'resize',
        expect.any(Function),
        { passive: true }
      );
      
      expect(mockAddPassiveEventListener).toHaveBeenCalledWith(
        window,
        'orientationchange',
        expect.any(Function),
        { passive: true }
      );
    });

    it('should clean up event listeners on unmount', () => {
      const mockCleanup = jest.fn();
      jest.mocked(require('@/lib/performanceUtils').addPassiveEventListener).mockReturnValue(mockCleanup);

      const { unmount } = renderHook(() =>
        useMobileMenuDimensions({
          itemCount: 8,
          enabled: true,
        })
      );

      unmount();

      expect(mockCleanup).toHaveBeenCalledTimes(2); // resize + orientationchange
    });
  });

  describe('Custom Configuration', () => {
    it('should use custom configuration', () => {
      const customConfig = {
        ...DEFAULT_MOBILE_MENU_CONFIG,
        heights: {
          mobile: { maxVh: 60, reservedVh: 25 },
          tablet: { maxVh: 75, reservedVh: 20 },
        },
      };

      renderHook(() =>
        useMobileMenuDimensions({
          itemCount: 8,
          config: customConfig,
          enabled: true,
        })
      );

      expect(mockCalculateMenuDimensions).toHaveBeenCalledWith(8, customConfig);
    });
  });

  describe('Memory Management', () => {
    it('should initialize memory manager', () => {
      const MockMemoryManager = jest.mocked(require('@/lib/performanceUtils').MemoryManager);
      
      renderHook(() =>
        useMobileMenuDimensions({
          itemCount: 8,
          enabled: true,
        })
      );

      expect(MockMemoryManager).toHaveBeenCalledWith(30000); // 30 second cleanup interval
    });

    it('should add cleanup tasks to memory manager', () => {
      const mockMemoryManager = {
        destroy: jest.fn(),
        addCleanupTask: jest.fn(),
        removeCleanupTask: jest.fn(),
      };
      
      jest.mocked(require('@/lib/performanceUtils').MemoryManager).mockImplementation(() => mockMemoryManager);

      renderHook(() =>
        useMobileMenuDimensions({
          itemCount: 8,
          enabled: true,
        })
      );

      expect(mockMemoryManager.addCleanupTask).toHaveBeenCalledWith(expect.any(Function));
    });
  });
});

describe('useStaticMobileMenuDimensions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    mockCalculateMenuDimensions.mockReturnValue({
      maxHeight: 300,
      shouldScroll: false,
      itemHeight: 48,
      totalContentHeight: 200,
    });
    
    mockGetMenuCSSProperties.mockReturnValue({
      '--menu-max-height': '300px',
      '--menu-item-height': '48px',
      '--menu-total-height': '200px',
      '--menu-scrollable': '0',
    });
  });

  it('should calculate static dimensions without resize handling', () => {
    const { result } = renderHook(() =>
      useStaticMobileMenuDimensions(4)
    );

    expect(mockCalculateMenuDimensions).toHaveBeenCalledWith(4, DEFAULT_MOBILE_MENU_CONFIG);
    expect(result.current.dimensions).toEqual({
      maxHeight: 300,
      shouldScroll: false,
      itemHeight: 48,
      totalContentHeight: 200,
    });
    expect(result.current.isScrollable).toBe(false);
  });

  it('should use custom configuration', () => {
    const customConfig = {
      ...DEFAULT_MOBILE_MENU_CONFIG,
      fallback: { maxHeight: 350, itemHeight: 50 },
    };

    renderHook(() =>
      useStaticMobileMenuDimensions(4, customConfig)
    );

    expect(mockCalculateMenuDimensions).toHaveBeenCalledWith(4, customConfig);
  });

  it('should not set up event listeners', () => {
    const mockAddPassiveEventListener = jest.mocked(require('@/lib/performanceUtils').addPassiveEventListener);
    
    renderHook(() =>
      useStaticMobileMenuDimensions(4)
    );

    expect(mockAddPassiveEventListener).not.toHaveBeenCalled();
  });
});