/**
 * React hook for managing mobile menu dimensions
 * 
 * This hook provides reactive mobile menu dimensions that update on window resize
 * and orientation changes, using the mobile menu utilities.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  calculateMenuDimensions,
  setupResizeListener,
  getMenuCSSProperties,
  type MenuDimensions,
  type MobileMenuConfig,
  DEFAULT_MOBILE_MENU_CONFIG,
} from '../mobileMenuUtils';
import { 
  performanceDebounce, 
  addPassiveEventListener, 
  MobileMenuErrorBoundary,
  PerformanceMonitor,
  MemoryManager 
} from '../performanceUtils';

interface UseMobileMenuDimensionsOptions {
  itemCount: number;
  config?: MobileMenuConfig;
  enabled?: boolean;
}

interface UseMobileMenuDimensionsReturn {
  dimensions: MenuDimensions;
  cssProperties: Record<string, string>;
  isScrollable: boolean;
  maxHeight: number;
  itemHeight: number;
}

/**
 * Hook for managing mobile menu dimensions with automatic resize handling
 */
export function useMobileMenuDimensions({
  itemCount,
  config = DEFAULT_MOBILE_MENU_CONFIG,
  enabled = true,
}: UseMobileMenuDimensionsOptions): UseMobileMenuDimensionsReturn {
  const performanceMonitorRef = useRef<PerformanceMonitor | null>(null);
  const errorBoundaryRef = useRef<MobileMenuErrorBoundary | null>(null);
  const memoryManagerRef = useRef<MemoryManager | null>(null);
  const removeResizeListenerRef = useRef<(() => void) | null>(null);
  const removeOrientationListenerRef = useRef<(() => void) | null>(null);

  // Initialize performance monitoring and error handling
  useEffect(() => {
    performanceMonitorRef.current = new PerformanceMonitor(
      { minFrameRate: 55, maxFrameTime: 18, maxDroppedFrames: 3 },
      (metrics) => {
        console.warn('Mobile menu dimensions performance degradation:', metrics);
      }
    );

    errorBoundaryRef.current = new MobileMenuErrorBoundary(
      3,
      (error, errorInfo) => {
        console.error('Mobile menu dimensions error:', error, errorInfo);
      }
    );

    memoryManagerRef.current = new MemoryManager(30000); // 30 second cleanup interval

    return () => {
      performanceMonitorRef.current?.destroy();
      errorBoundaryRef.current?.reset();
      memoryManagerRef.current?.destroy();
    };
  }, []);

  // Initialize dimensions with error handling
  const [dimensions, setDimensions] = useState<MenuDimensions>(() => {
    try {
      return calculateMenuDimensions(itemCount, config);
    } catch (error) {
      console.warn('Error calculating initial menu dimensions:', error);
      return {
        maxHeight: config.fallback.maxHeight,
        shouldScroll: itemCount > 8,
        itemHeight: config.fallback.itemHeight,
        totalContentHeight: itemCount * config.fallback.itemHeight + 32,
      };
    }
  });

  // Performance-optimized dimension update handler
  const debouncedDimensionUpdate = useRef(
    performanceDebounce(
      (newDimensions: MenuDimensions) => {
        performanceMonitorRef.current?.recordResizeEvent();
        setDimensions(newDimensions);
      },
      150, // 150ms debounce for resize events
      {
        leading: false,
        trailing: true,
        maxWait: 300, // Maximum wait time
        onCall: () => {
          performanceMonitorRef.current?.startMonitoring();
        }
      }
    )
  );

  // Handle dimension updates with error boundary
  const handleDimensionUpdate = useCallback((newDimensions: MenuDimensions) => {
    if (!errorBoundaryRef.current) return;

    const safeUpdate = errorBoundaryRef.current.wrapFunction(
      (dims: MenuDimensions) => {
        debouncedDimensionUpdate.current.debouncedFunction(dims);
      },
      'calculation',
      undefined
    );

    safeUpdate(newDimensions);
  }, []);

  // Performance-optimized resize handler
  const handleResize = useCallback(() => {
    if (!enabled || !errorBoundaryRef.current) return;

    const safeCalculation = errorBoundaryRef.current.wrapFunction(
      () => {
        const newDimensions = calculateMenuDimensions(itemCount, config);
        handleDimensionUpdate(newDimensions);
      },
      'resize',
      undefined
    );

    safeCalculation();
  }, [enabled, itemCount, config, handleDimensionUpdate]);

  // Set up passive resize and orientation listeners
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Add passive resize listener
    removeResizeListenerRef.current = addPassiveEventListener(
      window,
      'resize',
      handleResize,
      { passive: true }
    );

    // Add passive orientation change listener
    removeOrientationListenerRef.current = addPassiveEventListener(
      window,
      'orientationchange',
      handleResize,
      { passive: true }
    );

    // Add cleanup tasks to memory manager
    const cleanupTask = () => {
      debouncedDimensionUpdate.current.cancel();
    };
    memoryManagerRef.current?.addCleanupTask(cleanupTask);

    return () => {
      removeResizeListenerRef.current?.();
      removeOrientationListenerRef.current?.();
      memoryManagerRef.current?.removeCleanupTask(cleanupTask);
      // Capture the current ref value to avoid stale closure issues
      const currentDebouncedUpdate = debouncedDimensionUpdate.current;
      if (currentDebouncedUpdate) {
        currentDebouncedUpdate.cancel();
      }
    };
  }, [enabled, handleResize]);

  // Recalculate dimensions when itemCount changes with error handling
  useEffect(() => {
    if (!enabled || !errorBoundaryRef.current) return;

    const safeRecalculation = errorBoundaryRef.current.wrapFunction(
      () => {
        const newDimensions = calculateMenuDimensions(itemCount, config);
        setDimensions(newDimensions);
      },
      'calculation',
      undefined
    );

    safeRecalculation();
  }, [itemCount, config, enabled]);

  // Generate CSS properties with error handling
  const cssProperties = errorBoundaryRef.current?.wrapFunction(
    () => getMenuCSSProperties(dimensions),
    'calculation',
    {
      '--menu-max-height': `${config.fallback.maxHeight}px`,
      '--menu-item-height': `${config.fallback.itemHeight}px`,
      '--menu-total-height': `${itemCount * config.fallback.itemHeight + 32}px`,
      '--menu-scrollable': dimensions.shouldScroll ? '1' : '0',
    }
  )() || {};

  return {
    dimensions,
    cssProperties,
    isScrollable: dimensions.shouldScroll,
    maxHeight: dimensions.maxHeight,
    itemHeight: dimensions.itemHeight,
  };
}

/**
 * Simplified hook for basic mobile menu dimensions without resize handling
 */
export function useStaticMobileMenuDimensions(
  itemCount: number,
  config: MobileMenuConfig = DEFAULT_MOBILE_MENU_CONFIG
): UseMobileMenuDimensionsReturn {
  const dimensions = calculateMenuDimensions(itemCount, config);
  const cssProperties = getMenuCSSProperties(dimensions);

  return {
    dimensions,
    cssProperties,
    isScrollable: dimensions.shouldScroll,
    maxHeight: dimensions.maxHeight,
    itemHeight: dimensions.itemHeight,
  };
}