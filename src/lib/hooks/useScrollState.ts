/**
 * React hook for managing scroll state and indicators
 * 
 * This hook provides scroll state tracking, boundary detection, and accessibility
 * announcements for scrollable containers like the mobile menu.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  announceToScreenReader, 
  screenReaderUtils, 
  motionPreferences,
  ariaAttributes 
} from '@/lib/accessibility';
import { 
  performanceDebounce, 
  addPassiveEventListener, 
  MobileMenuErrorBoundary,
  PerformanceMonitor 
} from '@/lib/performanceUtils';

export interface ScrollState {
  isScrollable: boolean;
  canScrollUp: boolean;
  canScrollDown: boolean;
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
  scrollPercentage: number;
  isAtTop: boolean;
  isAtBottom: boolean;
}

export interface ScrollIndicatorConfig {
  showScrollbar: boolean;
  announceScrollState: boolean;
  scrollThreshold: number; // Pixels from edge to consider "at boundary"
  debounceMs: number;
}

interface UseScrollStateOptions {
  config?: Partial<ScrollIndicatorConfig>;
  onScrollStateChange?: (state: ScrollState) => void;
}

const DEFAULT_CONFIG: ScrollIndicatorConfig = {
  showScrollbar: true,
  announceScrollState: true,
  scrollThreshold: 5,
  debounceMs: 100,
};

/**
 * Hook for managing scroll state with indicators and accessibility
 */
export function useScrollState({
  config = {},
  onScrollStateChange,
}: UseScrollStateOptions = {}) {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const [scrollState, setScrollState] = useState<ScrollState>({
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

  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const lastAnnouncementRef = useRef<string>('');
  const performanceMonitorRef = useRef<PerformanceMonitor | null>(null);
  const errorBoundaryRef = useRef<MobileMenuErrorBoundary | null>(null);
  const removeScrollListenerRef = useRef<(() => void) | null>(null);

  // Initialize performance monitoring and error handling
  useEffect(() => {
    // Initialize performance monitor
    performanceMonitorRef.current = new PerformanceMonitor(
      { minFrameRate: 55, maxFrameTime: 18, maxDroppedFrames: 5 },
      (metrics) => {
        console.warn('Mobile menu scroll performance degradation detected:', metrics);
        // Could trigger fallback behavior here if needed
      }
    );

    // Initialize error boundary
    errorBoundaryRef.current = new MobileMenuErrorBoundary(
      3, // max retries
      (error, errorInfo) => {
        console.error('Mobile menu scroll error:', error, errorInfo);
      }
    );

    return () => {
      performanceMonitorRef.current?.destroy();
      errorBoundaryRef.current?.reset();
    };
  }, []);

  // Calculate scroll state from element with error handling
  const calculateScrollState = useCallback((element: HTMLElement): ScrollState => {
    if (!errorBoundaryRef.current) {
      throw new Error('Error boundary not initialized');
    }

    return errorBoundaryRef.current.wrapFunction(
      (el: HTMLElement) => {
        const scrollTop = el.scrollTop;
        const scrollHeight = el.scrollHeight;
        const clientHeight = el.clientHeight;
        
        const isScrollable = scrollHeight > clientHeight;
        const canScrollUp = scrollTop > finalConfig.scrollThreshold;
        const canScrollDown = scrollTop < (scrollHeight - clientHeight - finalConfig.scrollThreshold);
        const scrollPercentage = isScrollable ? (scrollTop / (scrollHeight - clientHeight)) * 100 : 0;
        const isAtTop = scrollTop <= finalConfig.scrollThreshold;
        const isAtBottom = scrollTop >= (scrollHeight - clientHeight - finalConfig.scrollThreshold);

        return {
          isScrollable,
          canScrollUp,
          canScrollDown,
          scrollTop,
          scrollHeight,
          clientHeight,
          scrollPercentage,
          isAtTop,
          isAtBottom,
        };
      },
      'calculation',
      // Fallback state
      {
        isScrollable: false,
        canScrollUp: false,
        canScrollDown: false,
        scrollTop: 0,
        scrollHeight: 0,
        clientHeight: 0,
        scrollPercentage: 0,
        isAtTop: true,
        isAtBottom: false,
      }
    )(element);
  }, [finalConfig.scrollThreshold]);

  // Store refs for stable callbacks
  const configRef = useRef(finalConfig);
  const onScrollStateChangeRef = useRef(onScrollStateChange);
  
  // Update refs when props change
  useEffect(() => {
    configRef.current = finalConfig;
    onScrollStateChangeRef.current = onScrollStateChange;
  });

  // Store previous state in ref to avoid dependency issues
  const prevScrollStateRef = useRef<ScrollState>(scrollState);
  
  // Update ref when state changes
  useEffect(() => {
    prevScrollStateRef.current = scrollState;
  }, [scrollState]);

  // Enhanced scroll state announcements for screen readers
  const announceScrollStateChange = useCallback((state: ScrollState, prevState: ScrollState) => {
    if (!state.isScrollable) return;

    // Announce boundary reached
    if (state.isAtTop && !prevState.isAtTop) {
      screenReaderUtils.announceScrollBoundary('top');
      lastAnnouncementRef.current = 'top';
    } else if (state.isAtBottom && !prevState.isAtBottom) {
      screenReaderUtils.announceScrollBoundary('bottom');
      lastAnnouncementRef.current = 'bottom';
    } else if (state.canScrollUp && state.canScrollDown && (prevState.isAtTop || prevState.isAtBottom)) {
      // Moving away from boundaries
      screenReaderUtils.announceScrollState(
        state.isScrollable,
        state.canScrollUp,
        state.canScrollDown
      );
      lastAnnouncementRef.current = 'scrolling';
    }
  }, []);

  // Performance-optimized debounced scroll handler
  const debouncedScrollHandler = useRef(
    performanceDebounce(
      (target: HTMLElement) => {
        // Record scroll event for performance monitoring
        performanceMonitorRef.current?.recordScrollEvent();

        const newState = calculateScrollState(target);
        const prevState = prevScrollStateRef.current;
        setScrollState(newState);
        onScrollStateChangeRef.current?.(newState);

        // Announce scroll state changes for accessibility
        if (configRef.current.announceScrollState) {
          announceScrollStateChange(newState, prevState);
        }
      },
      DEFAULT_CONFIG.debounceMs,
      {
        leading: false,
        trailing: true,
        onCall: () => {
          // Start performance monitoring during scroll
          if (!performanceMonitorRef.current?.getMetrics().frameRate) {
            performanceMonitorRef.current?.startMonitoring();
          }
        }
      }
    )
  );

  // Update debounce timing when config changes
  useEffect(() => {
    debouncedScrollHandler.current = performanceDebounce(
      (target: HTMLElement) => {
        performanceMonitorRef.current?.recordScrollEvent();
        const newState = calculateScrollState(target);
        const prevState = prevScrollStateRef.current;
        setScrollState(newState);
        onScrollStateChangeRef.current?.(newState);

        if (configRef.current.announceScrollState) {
          announceScrollStateChange(newState, prevState);
        }
      },
      finalConfig.debounceMs,
      {
        leading: false,
        trailing: true,
        onCall: () => {
          if (!performanceMonitorRef.current?.getMetrics().frameRate) {
            performanceMonitorRef.current?.startMonitoring();
          }
        }
      }
    );
  }, [finalConfig.debounceMs, calculateScrollState, announceScrollStateChange]);

  // Scroll event handler with passive listener support
  const handleScroll = useCallback((event: Event) => {
    const target = event.target as HTMLElement;
    if (!target) return;

    // Use performance-optimized debounced handler
    debouncedScrollHandler.current.debouncedFunction(target);
  }, []);

  // Initialize scroll state when container is set
  const initializeScrollState = useCallback((element: HTMLElement) => {
    const initialState = calculateScrollState(element);
    setScrollState(initialState);
    onScrollStateChangeRef.current?.(initialState);

    // Initial accessibility announcement
    if (configRef.current.announceScrollState && initialState.isScrollable) {
      const message = `Menu is scrollable. ${
        initialState.canScrollDown ? 'Scroll down for more items.' : ''
      }`;
      announceToScreenReader(message, 'polite');
      lastAnnouncementRef.current = message;
    }
  }, [calculateScrollState]);

  // Set scroll container and attach listeners
  const setScrollContainer = useCallback((element: HTMLElement | null) => {
    // Clean up previous container and listener
    if (removeScrollListenerRef.current) {
      removeScrollListenerRef.current();
      removeScrollListenerRef.current = null;
    }

    scrollContainerRef.current = element;

    if (element) {
      // Initialize state
      initializeScrollState(element);
      
      // Add passive scroll listener with cleanup function
      removeScrollListenerRef.current = addPassiveEventListener(
        element,
        'scroll',
        handleScroll,
        { passive: true }
      );
    } else {
      // Reset state when no container
      setScrollState(prevState => {
        // Only update if state is different to prevent infinite loops
        if (prevState.isScrollable === false && prevState.scrollTop === 0) {
          return prevState; // Already in reset state
        }
        return {
          isScrollable: false,
          canScrollUp: false,
          canScrollDown: false,
          scrollTop: 0,
          scrollHeight: 0,
          clientHeight: 0,
          scrollPercentage: 0,
          isAtTop: true,
          isAtBottom: false,
        };
      });
    }
  }, [handleScroll, initializeScrollState]);

  // Update scroll state when container dimensions change
  const updateScrollState = useCallback(() => {
    if (scrollContainerRef.current) {
      const newState = calculateScrollState(scrollContainerRef.current);
      setScrollState(newState);
      onScrollStateChangeRef.current?.(newState);
    }
  }, [calculateScrollState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up scroll listener
      if (removeScrollListenerRef.current) {
        removeScrollListenerRef.current();
        removeScrollListenerRef.current = null;
      }
      
      // Cancel any pending debounced calls
      debouncedScrollHandler.current.cancel();
      
      // Stop performance monitoring
      performanceMonitorRef.current?.stopMonitoring();
    };
  }, []);

  // Scroll to specific position with reduced motion support
  const scrollTo = useCallback((position: number, behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      const finalBehavior = motionPreferences.getScrollBehavior();
      scrollContainerRef.current.scrollTo({
        top: position,
        behavior: behavior === 'smooth' ? finalBehavior : behavior,
      });
    }
  }, []);

  // Scroll to top with reduced motion support
  const scrollToTop = useCallback((behavior: ScrollBehavior = 'smooth') => {
    scrollTo(0, behavior);
  }, [scrollTo]);

  // Scroll to bottom with reduced motion support
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      scrollTo(scrollContainerRef.current.scrollHeight, behavior);
    }
  }, [scrollTo]);

  // Scroll by amount with reduced motion support
  const scrollBy = useCallback((amount: number, behavior: ScrollBehavior = 'smooth') => {
    if (scrollContainerRef.current) {
      const currentTop = scrollContainerRef.current.scrollTop;
      scrollTo(currentTop + amount, behavior);
    }
  }, [scrollTo]);

  return {
    scrollState,
    setScrollContainer,
    updateScrollState,
    scrollTo,
    scrollToTop,
    scrollToBottom,
    scrollBy,
  };
}

/**
 * Hook for scroll indicators with visual feedback
 */
export function useScrollIndicators(scrollState: ScrollState) {
  const getScrollIndicatorClasses = useCallback(() => {
    const classes = ['mobile-menu-scrollable'];
    
    if (scrollState.isScrollable) {
      classes.push('scrollable');
      
      if (!scrollState.isAtTop) {
        classes.push('can-scroll-up');
      }
      
      if (!scrollState.isAtBottom) {
        classes.push('can-scroll-down');
      }
    }
    
    return classes.join(' ');
  }, [scrollState]);

  const getScrollIndicatorStyles = useCallback(() => {
    return {
      '--scroll-percentage': `${scrollState.scrollPercentage}%`,
      '--scroll-top': `${scrollState.scrollTop}px`,
      '--scroll-height': `${scrollState.scrollHeight}px`,
      '--client-height': `${scrollState.clientHeight}px`,
    } as React.CSSProperties;
  }, [scrollState]);

  return {
    getScrollIndicatorClasses,
    getScrollIndicatorStyles,
  };
}