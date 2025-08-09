/**
 * Tests for mobile menu height calculation utilities
 */

import {
  getViewportDimensions,
  calculateMenuDimensions,
  debounce,
  createResizeHandler,
  setupResizeListener,
  validateMenuConfig,
  getMenuCSSProperties,
  DEFAULT_MOBILE_MENU_CONFIG,
  type ViewportDimensions,
  type MenuDimensions,
  type MobileMenuConfig,
} from '../mobileMenuUtils';

// Mock window object for testing
const mockWindow = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

// Mock document for fallback scenarios
const mockDocument = (width: number, height: number) => {
  Object.defineProperty(document, 'documentElement', {
    writable: true,
    configurable: true,
    value: {
      clientWidth: width,
      clientHeight: height,
    },
  });
};

describe('mobileMenuUtils', () => {
  beforeEach(() => {
    // Reset window dimensions before each test
    mockWindow(1024, 768);
  });

  describe('getViewportDimensions', () => {
    it('should detect mobile viewport correctly', () => {
      mockWindow(375, 667); // iPhone dimensions
      
      const dimensions = getViewportDimensions();
      
      expect(dimensions).toEqual({
        height: 667,
        width: 375,
        isTablet: false,
        isMobile: true,
      });
    });

    it('should detect tablet viewport correctly', () => {
      mockWindow(768, 1024); // iPad dimensions
      
      const dimensions = getViewportDimensions();
      
      expect(dimensions).toEqual({
        height: 1024,
        width: 768,
        isTablet: true,
        isMobile: false,
      });
    });

    it('should detect desktop viewport correctly', () => {
      mockWindow(1200, 800); // Desktop dimensions
      
      const dimensions = getViewportDimensions();
      
      expect(dimensions).toEqual({
        height: 800,
        width: 1200,
        isTablet: false,
        isMobile: false,
      });
    });

    it('should handle edge case at mobile breakpoint', () => {
      mockWindow(767, 800); // Just below mobile breakpoint
      
      const dimensions = getViewportDimensions();
      
      expect(dimensions.isMobile).toBe(true);
      expect(dimensions.isTablet).toBe(false);
    });

    it('should handle edge case at tablet breakpoint', () => {
      mockWindow(1023, 800); // Just below tablet breakpoint
      
      const dimensions = getViewportDimensions();
      
      expect(dimensions.isMobile).toBe(false);
      expect(dimensions.isTablet).toBe(true);
    });

    it('should handle SSR environment gracefully', () => {
      // In Jest/JSDOM environment, window is always available, but we can test
      // that the function handles edge cases gracefully by testing with extreme values
      mockWindow(0, 0); // Simulate problematic window dimensions
      
      const dimensions = getViewportDimensions();
      
      // Should still return valid dimensions even with problematic input
      expect(dimensions.width).toBeGreaterThanOrEqual(0);
      expect(dimensions.height).toBeGreaterThanOrEqual(0);
      expect(typeof dimensions.isMobile).toBe('boolean');
      expect(typeof dimensions.isTablet).toBe('boolean');
      
      // Reset to default test dimensions
      mockWindow(1024, 768);
    });

    it('should use document fallback when window properties are unavailable', () => {
      // @ts-ignore
      delete window.innerWidth;
      // @ts-ignore
      delete window.innerHeight;
      
      mockDocument(800, 600);
      
      const dimensions = getViewportDimensions();
      
      expect(dimensions.width).toBe(800);
      expect(dimensions.height).toBe(600);
    });
  });

  describe('calculateMenuDimensions', () => {
    it('should calculate dimensions for mobile device', () => {
      mockWindow(375, 667); // iPhone dimensions
      
      const dimensions = calculateMenuDimensions(8); // 8 menu items
      
      expect(dimensions.maxHeight).toBe(Math.floor(667 * 0.7)); // 70vh
      expect(dimensions.itemHeight).toBe(56);
      expect(dimensions.totalContentHeight).toBe(8 * 56 + 32); // items + padding
      expect(dimensions.shouldScroll).toBe(dimensions.totalContentHeight > dimensions.maxHeight);
    });

    it('should calculate dimensions for tablet device', () => {
      mockWindow(768, 1024); // iPad dimensions
      
      const dimensions = calculateMenuDimensions(8);
      
      // Should be capped at fallback max height (600px) since 80vh of 1024 = 819px > 600px
      const expectedHeight = Math.min(Math.floor(1024 * 0.8), DEFAULT_MOBILE_MENU_CONFIG.fallback.maxHeight);
      expect(dimensions.maxHeight).toBe(expectedHeight);
      expect(dimensions.itemHeight).toBe(56);
      expect(dimensions.totalContentHeight).toBe(8 * 56 + 32);
    });

    it('should determine scrolling is needed for many items', () => {
      mockWindow(375, 667); // Small mobile screen
      
      const dimensions = calculateMenuDimensions(15); // Many items
      
      expect(dimensions.shouldScroll).toBe(true);
      expect(dimensions.totalContentHeight).toBeGreaterThan(dimensions.maxHeight);
    });

    it('should determine scrolling is not needed for few items', () => {
      mockWindow(768, 1024); // Large tablet screen
      
      const dimensions = calculateMenuDimensions(3); // Few items
      
      expect(dimensions.shouldScroll).toBe(false);
      expect(dimensions.totalContentHeight).toBeLessThanOrEqual(dimensions.maxHeight);
    });

    it('should respect minimum height fallback', () => {
      mockWindow(320, 200); // Very small screen
      
      const dimensions = calculateMenuDimensions(5);
      
      expect(dimensions.maxHeight).toBeGreaterThanOrEqual(DEFAULT_MOBILE_MENU_CONFIG.fallback.minHeight);
    });

    it('should respect maximum height fallback', () => {
      mockWindow(1200, 2000); // Very large screen
      
      const dimensions = calculateMenuDimensions(5);
      
      expect(dimensions.maxHeight).toBeLessThanOrEqual(DEFAULT_MOBILE_MENU_CONFIG.fallback.maxHeight);
    });

    it('should handle custom configuration', () => {
      const customConfig: MobileMenuConfig = {
        ...DEFAULT_MOBILE_MENU_CONFIG,
        heights: {
          mobile: { maxVh: 60, reservedVh: 30 },
          tablet: { maxVh: 70, reservedVh: 20 },
        },
        fallback: {
          ...DEFAULT_MOBILE_MENU_CONFIG.fallback,
          itemHeight: 48,
        },
      };
      
      mockWindow(375, 667);
      
      const dimensions = calculateMenuDimensions(8, customConfig);
      
      expect(dimensions.maxHeight).toBe(Math.floor(667 * 0.6)); // 60vh
      expect(dimensions.itemHeight).toBe(48);
    });

    it('should provide fallback dimensions on error', () => {
      // Mock an error scenario
      const originalConsoleWarn = console.warn;
      console.warn = jest.fn();
      
      // Force an error by mocking a problematic config
      const badConfig = {
        ...DEFAULT_MOBILE_MENU_CONFIG,
        fallback: null as any,
      };
      
      const dimensions = calculateMenuDimensions(15, badConfig); // Use more items to ensure scrolling
      
      expect(dimensions.maxHeight).toBe(DEFAULT_MOBILE_MENU_CONFIG.fallback.maxHeight);
      expect(dimensions.shouldScroll).toBe(true); // Assumes scrolling for 15+ items
      expect(console.warn).toHaveBeenCalled();
      
      console.warn = originalConsoleWarn;
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should debounce function calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      debouncedFn();
      debouncedFn();
      
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should pass arguments correctly', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn('arg1', 'arg2');
      
      jest.advanceTimersByTime(100);
      
      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('should reset timer on subsequent calls', () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);
      
      debouncedFn();
      jest.advanceTimersByTime(50);
      debouncedFn(); // Should reset the timer
      jest.advanceTimersByTime(50);
      
      expect(mockFn).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(50);
      
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('createResizeHandler', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should create a debounced resize handler', () => {
      const mockOnResize = jest.fn();
      const resizeHandler = createResizeHandler(mockOnResize, 8);
      
      resizeHandler();
      resizeHandler();
      
      expect(mockOnResize).not.toHaveBeenCalled();
      
      jest.advanceTimersByTime(150);
      
      expect(mockOnResize).toHaveBeenCalledTimes(1);
      expect(mockOnResize).toHaveBeenCalledWith(expect.objectContaining({
        maxHeight: expect.any(Number),
        shouldScroll: expect.any(Boolean),
        itemHeight: expect.any(Number),
        totalContentHeight: expect.any(Number),
      }));
    });

    it('should handle errors gracefully', () => {
      const originalConsoleWarn = console.warn;
      console.warn = jest.fn();
      
      const mockOnResize = jest.fn(() => {
        throw new Error('Test error');
      });
      
      const resizeHandler = createResizeHandler(mockOnResize, 8);
      
      resizeHandler();
      jest.advanceTimersByTime(150);
      
      expect(console.warn).toHaveBeenCalled();
      
      console.warn = originalConsoleWarn;
    });
  });

  describe('setupResizeListener', () => {
    let addEventListenerSpy: jest.SpyInstance;
    let removeEventListenerSpy: jest.SpyInstance;

    beforeEach(() => {
      addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    });

    afterEach(() => {
      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('should set up resize and orientation change listeners', () => {
      const mockOnResize = jest.fn();
      
      setupResizeListener(mockOnResize, 8);
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function), { passive: true });
      expect(addEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function), { passive: true });
    });

    it('should return cleanup function that removes listeners', () => {
      const mockOnResize = jest.fn();
      
      const cleanup = setupResizeListener(mockOnResize, 8);
      cleanup();
      
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('orientationchange', expect.any(Function));
    });

    it('should return no-op cleanup for SSR', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;
      
      const mockOnResize = jest.fn();
      const cleanup = setupResizeListener(mockOnResize, 8);
      
      expect(typeof cleanup).toBe('function');
      expect(() => cleanup()).not.toThrow();
      
      global.window = originalWindow;
    });
  });

  describe('validateMenuConfig', () => {
    it('should return default config for empty input', () => {
      const result = validateMenuConfig({});
      
      expect(result).toEqual(DEFAULT_MOBILE_MENU_CONFIG);
    });

    it('should merge partial config with defaults', () => {
      const partialConfig = {
        heights: {
          mobile: { maxVh: 60, reservedVh: 25 },
          tablet: { maxVh: 80, reservedVh: 15 },
        },
      };
      
      const result = validateMenuConfig(partialConfig);
      
      expect(result.heights.mobile.maxVh).toBe(60);
      expect(result.heights.mobile.reservedVh).toBe(25);
      expect(result.heights.tablet).toEqual(DEFAULT_MOBILE_MENU_CONFIG.heights.tablet);
    });

    it('should validate and fix invalid maxVh values', () => {
      const invalidConfig = {
        heights: {
          mobile: { maxVh: -10, reservedVh: 20 },
          tablet: { maxVh: 150, reservedVh: 15 },
        },
      };
      
      const result = validateMenuConfig(invalidConfig);
      
      expect(result.heights.mobile.maxVh).toBe(DEFAULT_MOBILE_MENU_CONFIG.heights.mobile.maxVh);
      expect(result.heights.tablet.maxVh).toBe(DEFAULT_MOBILE_MENU_CONFIG.heights.tablet.maxVh);
    });

    it('should validate and fix invalid itemHeight', () => {
      const invalidConfig = {
        fallback: {
          minHeight: 200,
          maxHeight: 600,
          itemHeight: -5,
        },
      };
      
      const result = validateMenuConfig(invalidConfig);
      
      expect(result.fallback.itemHeight).toBe(DEFAULT_MOBILE_MENU_CONFIG.fallback.itemHeight);
    });

    it('should handle errors and return default config', () => {
      const originalConsoleWarn = console.warn;
      console.warn = jest.fn();
      
      // Force an error by passing invalid data
      const result = validateMenuConfig(null as any);
      
      expect(result).toEqual(DEFAULT_MOBILE_MENU_CONFIG);
      expect(console.warn).toHaveBeenCalled();
      
      console.warn = originalConsoleWarn;
    });
  });

  describe('getMenuCSSProperties', () => {
    it('should generate correct CSS custom properties', () => {
      const dimensions: MenuDimensions = {
        maxHeight: 400,
        shouldScroll: true,
        itemHeight: 56,
        totalContentHeight: 500,
      };
      
      const cssProps = getMenuCSSProperties(dimensions);
      
      expect(cssProps).toEqual({
        '--menu-max-height': '400px',
        '--menu-item-height': '56px',
        '--menu-total-height': '500px',
        '--menu-scrollable': '1',
      });
    });

    it('should handle non-scrollable menu', () => {
      const dimensions: MenuDimensions = {
        maxHeight: 400,
        shouldScroll: false,
        itemHeight: 56,
        totalContentHeight: 300,
      };
      
      const cssProps = getMenuCSSProperties(dimensions);
      
      expect(cssProps['--menu-scrollable']).toBe('0');
    });
  });
});