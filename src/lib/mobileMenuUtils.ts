/**
 * Mobile Menu Height Calculation Utilities
 * 
 * This module provides utilities for calculating responsive heights for the mobile navigation menu,
 * handling viewport detection, device type identification, and dynamic height calculations.
 */

// Types and interfaces
export interface ViewportDimensions {
  height: number;
  width: number;
  isTablet: boolean;
  isMobile: boolean;
}

export interface MenuDimensions {
  maxHeight: number;
  shouldScroll: boolean;
  itemHeight: number;
  totalContentHeight: number;
}

export interface ScrollableMenuConfig {
  maxHeightVh: number;        // Maximum height as viewport percentage
  minVisibleItems: number;    // Minimum items to show without scrolling
  scrollPadding: number;      // Padding for scroll area
  reservedSpaceVh: number;    // Space to reserve below menu
}

export interface MobileMenuConfig {
  breakpoints: {
    mobile: number;      // 768px
    tablet: number;      // 1024px
  };
  heights: {
    mobile: {
      maxVh: number;     // 70vh
      reservedVh: number; // 20vh
    };
    tablet: {
      maxVh: number;     // 80vh
      reservedVh: number; // 15vh
    };
  };
  scrolling: {
    smoothBehavior: boolean;
    showScrollbar: boolean;
    keyboardScrollStep: number;
  };
  animation: {
    openDuration: number;    // 300ms
    closeDuration: number;   // 300ms
    scrollDuration: number;  // 200ms
  };
  fallback: {
    minHeight: number;       // Minimum menu height in px
    maxHeight: number;       // Maximum menu height in px
    itemHeight: number;      // Default item height in px
  };
}

// Default configuration
export const DEFAULT_MOBILE_MENU_CONFIG: MobileMenuConfig = {
  breakpoints: {
    mobile: 768,
    tablet: 1024,
  },
  heights: {
    mobile: {
      maxVh: 70,
      reservedVh: 20,
    },
    tablet: {
      maxVh: 80,
      reservedVh: 15,
    },
  },
  scrolling: {
    smoothBehavior: true,
    showScrollbar: true,
    keyboardScrollStep: 56, // One item height
  },
  animation: {
    openDuration: 300,
    closeDuration: 300,
    scrollDuration: 200,
  },
  fallback: {
    minHeight: 200,
    maxHeight: 600,
    itemHeight: 56, // Approximate height per menu item including padding
  },
};

/**
 * Detects current viewport dimensions and device type
 * Provides fallback values if window is not available (SSR)
 */
export function getViewportDimensions(): ViewportDimensions {
  // Fallback for SSR or when window is not available
  if (typeof window === 'undefined') {
    return {
      height: 800, // Fallback height
      width: 375,  // Fallback mobile width
      isTablet: false,
      isMobile: true,
    };
  }

  try {
    const height = window.innerHeight || document.documentElement.clientHeight || 800;
    const width = window.innerWidth || document.documentElement.clientWidth || 375;
    
    const isTablet = width >= DEFAULT_MOBILE_MENU_CONFIG.breakpoints.mobile && 
                     width < DEFAULT_MOBILE_MENU_CONFIG.breakpoints.tablet;
    const isMobile = width < DEFAULT_MOBILE_MENU_CONFIG.breakpoints.mobile;

    return {
      height,
      width,
      isTablet,
      isMobile,
    };
  } catch (error) {
    console.warn('Error detecting viewport dimensions:', error);
    // Return safe fallback values
    return {
      height: 800,
      width: 375,
      isTablet: false,
      isMobile: true,
    };
  }
}

/**
 * Calculates optimal menu dimensions based on viewport and content
 */
export function calculateMenuDimensions(
  itemCount: number,
  config: MobileMenuConfig = DEFAULT_MOBILE_MENU_CONFIG
): MenuDimensions {
  try {
    const viewport = getViewportDimensions();
    
    // Determine device-specific configuration
    const deviceConfig = viewport.isMobile 
      ? config.heights.mobile 
      : config.heights.tablet;

    // Calculate maximum height based on viewport
    const maxHeightFromVh = Math.floor((viewport.height * deviceConfig.maxVh) / 100);
    
    // Ensure we don't exceed fallback limits
    const maxHeight = Math.min(
      Math.max(maxHeightFromVh, config.fallback.minHeight),
      config.fallback.maxHeight
    );

    // Calculate total content height
    const itemHeight = config.fallback.itemHeight;
    const scrollPadding = 32; // 2rem padding (top + bottom)
    const totalContentHeight = (itemCount * itemHeight) + scrollPadding;

    // Determine if scrolling is needed
    const shouldScroll = totalContentHeight > maxHeight;

    return {
      maxHeight,
      shouldScroll,
      itemHeight,
      totalContentHeight,
    };
  } catch (error) {
    console.warn('Error calculating menu dimensions:', error);
    
    // Return safe fallback dimensions using default config if current config is invalid
    const safeConfig = config?.fallback ? config : DEFAULT_MOBILE_MENU_CONFIG;
    return {
      maxHeight: safeConfig.fallback.maxHeight,
      shouldScroll: itemCount > 8, // Assume scrolling needed for more than 8 items
      itemHeight: safeConfig.fallback.itemHeight,
      totalContentHeight: itemCount * safeConfig.fallback.itemHeight + 32,
    };
  }
}

/**
 * Debounce utility for resize events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Creates a debounced resize handler for menu height recalculation
 */
export function createResizeHandler(
  onResize: (dimensions: MenuDimensions) => void,
  itemCount: number,
  config: MobileMenuConfig = DEFAULT_MOBILE_MENU_CONFIG,
  debounceMs: number = 150
): () => void {
  const debouncedHandler = debounce(() => {
    try {
      const newDimensions = calculateMenuDimensions(itemCount, config);
      onResize(newDimensions);
    } catch (error) {
      console.warn('Error in resize handler:', error);
    }
  }, debounceMs);

  return debouncedHandler;
}

/**
 * Hook-like function to set up resize listener and cleanup
 * Returns cleanup function
 */
export function setupResizeListener(
  onResize: (dimensions: MenuDimensions) => void,
  itemCount: number,
  config: MobileMenuConfig = DEFAULT_MOBILE_MENU_CONFIG
): () => void {
  if (typeof window === 'undefined') {
    // Return no-op cleanup for SSR
    return () => {};
  }

  const resizeHandler = createResizeHandler(onResize, itemCount, config);
  
  // Add event listeners for both resize and orientation change
  window.addEventListener('resize', resizeHandler, { passive: true });
  window.addEventListener('orientationchange', resizeHandler, { passive: true });
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('orientationchange', resizeHandler);
  };
}

/**
 * Validates menu configuration and provides safe defaults
 */
export function validateMenuConfig(config: Partial<MobileMenuConfig>): MobileMenuConfig {
  const safeConfig = { ...DEFAULT_MOBILE_MENU_CONFIG };
  
  try {
    // Merge provided config with defaults
    if (config.breakpoints) {
      safeConfig.breakpoints = { ...safeConfig.breakpoints, ...config.breakpoints };
    }
    
    if (config.heights) {
      if (config.heights.mobile) {
        safeConfig.heights.mobile = { ...safeConfig.heights.mobile, ...config.heights.mobile };
      }
      if (config.heights.tablet) {
        safeConfig.heights.tablet = { ...safeConfig.heights.tablet, ...config.heights.tablet };
      }
    }
    
    if (config.scrolling) {
      safeConfig.scrolling = { ...safeConfig.scrolling, ...config.scrolling };
    }
    
    if (config.animation) {
      safeConfig.animation = { ...safeConfig.animation, ...config.animation };
    }
    
    if (config.fallback) {
      safeConfig.fallback = { ...safeConfig.fallback, ...config.fallback };
    }
    
    // Validate critical values
    if (safeConfig.heights.mobile.maxVh <= 0 || safeConfig.heights.mobile.maxVh > 100) {
      safeConfig.heights.mobile.maxVh = DEFAULT_MOBILE_MENU_CONFIG.heights.mobile.maxVh;
    }
    
    if (safeConfig.heights.tablet.maxVh <= 0 || safeConfig.heights.tablet.maxVh > 100) {
      safeConfig.heights.tablet.maxVh = DEFAULT_MOBILE_MENU_CONFIG.heights.tablet.maxVh;
    }
    
    if (safeConfig.fallback.itemHeight <= 0) {
      safeConfig.fallback.itemHeight = DEFAULT_MOBILE_MENU_CONFIG.fallback.itemHeight;
    }
    
  } catch (error) {
    console.warn('Error validating menu config, using defaults:', error);
    return DEFAULT_MOBILE_MENU_CONFIG;
  }
  
  return safeConfig;
}

/**
 * Utility to get CSS custom properties for dynamic height management
 */
export function getMenuCSSProperties(dimensions: MenuDimensions): Record<string, string> {
  return {
    '--menu-max-height': `${dimensions.maxHeight}px`,
    '--menu-item-height': `${dimensions.itemHeight}px`,
    '--menu-total-height': `${dimensions.totalContentHeight}px`,
    '--menu-scrollable': dimensions.shouldScroll ? '1' : '0',
  };
}