// React extensions for better TypeScript support

import { EffectCallback } from 'react';

declare global {
  // Enhanced useEffect hook type that allows void return
  interface UseEffectCallback extends EffectCallback {
    (): void | (() => void | undefined);
  }

  // Performance monitoring types
  interface PerformanceEntry {
    name: string;
    entryType: string;
    startTime: number;
    duration: number;
  }

  interface PerformanceObserver {
    observe(options: { entryTypes: string[] }): void;
    disconnect(): void;
  }

  interface PerformanceObserverConstructor {
    new (callback: (list: { getEntries(): PerformanceEntry[] }) => void): PerformanceObserver;
  }

  // Extend Window interface for performance monitoring
  interface Window {
    PerformanceObserver?: PerformanceObserverConstructor;
  }

  // Navigation timing types
  interface NavigationTiming {
    loadEventEnd: number;
    navigationStart: number;
  }

  // Performance timing interface
  interface Performance {
    timing: NavigationTiming;
    mark(name: string): void;
    measure(name: string, startMark?: string, endMark?: string): void;
    getEntriesByName(name: string, type?: string): PerformanceEntry[];
    getEntriesByType(type: string): PerformanceEntry[];
    clearMarks(name?: string): void;
    clearMeasures(name?: string): void;
  }
}

export {};