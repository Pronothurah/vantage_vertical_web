/**
 * Performance Utilities for Mobile Menu
 * 
 * This module provides performance monitoring, optimization utilities, and error handling
 * for the mobile navigation menu to ensure smooth 60fps operation.
 */

// Performance monitoring interfaces
export interface PerformanceMetrics {
  frameRate: number;
  averageFrameTime: number;
  droppedFrames: number;
  memoryUsage?: number;
  scrollEventCount: number;
  resizeEventCount: number;
}

export interface PerformanceThresholds {
  minFrameRate: number;        // Minimum acceptable FPS (default: 55)
  maxFrameTime: number;        // Maximum acceptable frame time in ms (default: 18)
  maxDroppedFrames: number;    // Maximum dropped frames before degradation (default: 5)
  memoryThreshold?: number;    // Memory usage threshold in MB
}

export interface ErrorBoundaryState {
  hasError: boolean;
  errorType: 'calculation' | 'scroll' | 'resize' | 'touch' | 'unknown';
  errorMessage: string;
  fallbackActive: boolean;
  retryCount: number;
}

// Default performance thresholds
const DEFAULT_THRESHOLDS: PerformanceThresholds = {
  minFrameRate: 55,
  maxFrameTime: 18, // ~60fps = 16.67ms, allow some buffer
  maxDroppedFrames: 5,
  memoryThreshold: 50, // 50MB
};

/**
 * Performance Monitor Class
 * Tracks frame rates, memory usage, and performance metrics
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics;
  private thresholds: PerformanceThresholds;
  private frameStartTime: number = 0;
  private frameCount: number = 0;
  private frameTimes: number[] = [];
  private lastFrameTime: number = 0;
  private monitoringActive: boolean = false;
  private animationId: number | null = null;
  private onPerformanceDegradation?: (metrics: PerformanceMetrics) => void;

  constructor(
    thresholds: Partial<PerformanceThresholds> = {},
    onPerformanceDegradation?: (metrics: PerformanceMetrics) => void
  ) {
    this.thresholds = { ...DEFAULT_THRESHOLDS, ...thresholds };
    this.onPerformanceDegradation = onPerformanceDegradation;
    this.metrics = this.createInitialMetrics();
  }

  private createInitialMetrics(): PerformanceMetrics {
    return {
      frameRate: 60,
      averageFrameTime: 16.67,
      droppedFrames: 0,
      memoryUsage: this.getMemoryUsage(),
      scrollEventCount: 0,
      resizeEventCount: 0,
    };
  }

  private getMemoryUsage(): number | undefined {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
      // @ts-ignore - performance.memory is not in all TypeScript definitions
      const memory = performance.memory;
      return memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
    }
    return undefined;
  }

  /**
   * Start performance monitoring
   */
  public startMonitoring(): void {
    if (this.monitoringActive) return;

    this.monitoringActive = true;
    this.frameStartTime = performance.now();
    this.lastFrameTime = this.frameStartTime;
    this.frameCount = 0;
    this.frameTimes = [];
    
    this.monitorFrame();
  }

  /**
   * Stop performance monitoring
   */
  public stopMonitoring(): void {
    this.monitoringActive = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private monitorFrame(): void {
    if (!this.monitoringActive) return;

    const currentTime = performance.now();
    const frameTime = currentTime - this.lastFrameTime;
    
    this.frameCount++;
    this.frameTimes.push(frameTime);
    
    // Keep only last 60 frame times (1 second at 60fps)
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }
    
    // Calculate metrics every 60 frames
    if (this.frameCount % 60 === 0) {
      this.updateMetrics(currentTime);
      this.checkPerformanceThresholds();
    }
    
    this.lastFrameTime = currentTime;
    this.animationId = requestAnimationFrame(() => this.monitorFrame());
  }

  private updateMetrics(currentTime: number): void {
    const totalTime = currentTime - this.frameStartTime;
    const actualFrameRate = (this.frameCount / totalTime) * 1000;
    
    const averageFrameTime = this.frameTimes.reduce((sum, time) => sum + time, 0) / this.frameTimes.length;
    const droppedFrames = this.frameTimes.filter(time => time > this.thresholds.maxFrameTime).length;
    
    this.metrics = {
      frameRate: Math.round(actualFrameRate * 100) / 100,
      averageFrameTime: Math.round(averageFrameTime * 100) / 100,
      droppedFrames,
      memoryUsage: this.getMemoryUsage(),
      scrollEventCount: this.metrics.scrollEventCount,
      resizeEventCount: this.metrics.resizeEventCount,
    };
  }

  private checkPerformanceThresholds(): void {
    const { frameRate, droppedFrames, memoryUsage } = this.metrics;
    const { minFrameRate, maxDroppedFrames, memoryThreshold } = this.thresholds;
    
    const hasPerformanceIssue = 
      frameRate < minFrameRate ||
      droppedFrames > maxDroppedFrames ||
      (memoryThreshold && memoryUsage && memoryUsage > memoryThreshold);
    
    if (hasPerformanceIssue && this.onPerformanceDegradation) {
      this.onPerformanceDegradation(this.metrics);
    }
  }

  /**
   * Record scroll event for metrics
   */
  public recordScrollEvent(): void {
    this.metrics.scrollEventCount++;
  }

  /**
   * Record resize event for metrics
   */
  public recordResizeEvent(): void {
    this.metrics.resizeEventCount++;
  }

  /**
   * Get current performance metrics
   */
  public getMetrics(): Readonly<PerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * Reset metrics counters
   */
  public resetMetrics(): void {
    this.metrics = this.createInitialMetrics();
    this.frameCount = 0;
    this.frameTimes = [];
    this.frameStartTime = performance.now();
  }

  /**
   * Destroy the performance monitor
   */
  public destroy(): void {
    this.stopMonitoring();
  }
}

/**
 * Enhanced debounce function with performance monitoring
 */
export function performanceDebounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: {
    leading?: boolean;
    trailing?: boolean;
    maxWait?: number;
    onCall?: () => void;
  } = {}
): {
  debouncedFunction: (...args: Parameters<T>) => void;
  cancel: () => void;
  flush: () => void;
} {
  const { leading = false, trailing = true, maxWait, onCall } = options;
  
  let timeout: NodeJS.Timeout | null = null;
  let maxTimeout: NodeJS.Timeout | null = null;
  let lastCallTime: number = 0;
  let lastInvokeTime: number = 0;
  let lastArgs: Parameters<T> | undefined;
  let result: ReturnType<T>;

  function invokeFunc(time: number): ReturnType<T> {
    const args = lastArgs!;
    lastArgs = undefined;
    lastInvokeTime = time;
    onCall?.();
    result = func(...args);
    return result;
  }

  function leadingEdge(time: number): ReturnType<T> {
    lastInvokeTime = time;
    timeout = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;

    return maxWait !== undefined
      ? Math.min(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === 0 ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWait !== undefined && timeSinceLastInvoke >= maxWait)
    );
  }

  function timerExpired(): void {
    const time = Date.now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timeout = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time: number): ReturnType<T> {
    timeout = null;

    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    return result;
  }

  function cancel(): void {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    if (maxTimeout !== null) {
      clearTimeout(maxTimeout);
    }
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = 0;
    timeout = null;
    maxTimeout = null;
  }

  function flush(): ReturnType<T> {
    return timeout === null ? result : trailingEdge(Date.now());
  }

  function debounced(...args: Parameters<T>): void {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastCallTime = time;

    if (isInvoking) {
      if (timeout === null) {
        return leadingEdge(lastCallTime);
      }
      if (maxWait !== undefined) {
        timeout = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timeout === null) {
      timeout = setTimeout(timerExpired, wait);
    }
  }

  return {
    debouncedFunction: debounced,
    cancel,
    flush,
  };
}

/**
 * Passive event listener utility
 */
export function addPassiveEventListener(
  element: EventTarget,
  event: string,
  handler: EventListener,
  options: AddEventListenerOptions = {}
): () => void {
  const passiveOptions = {
    ...options,
    passive: true,
  };

  element.addEventListener(event, handler, passiveOptions);
  
  return () => {
    element.removeEventListener(event, handler, passiveOptions);
  };
}

/**
 * Error boundary utility for mobile menu operations
 */
export class MobileMenuErrorBoundary {
  private state: ErrorBoundaryState;
  private maxRetries: number;
  private onError?: (error: Error, errorInfo: any) => void;
  private fallbackConfig: any;

  constructor(
    maxRetries: number = 3,
    onError?: (error: Error, errorInfo: any) => void,
    fallbackConfig?: any
  ) {
    this.maxRetries = maxRetries;
    this.onError = onError;
    this.fallbackConfig = fallbackConfig;
    this.state = this.createInitialState();
  }

  private createInitialState(): ErrorBoundaryState {
    return {
      hasError: false,
      errorType: 'unknown',
      errorMessage: '',
      fallbackActive: false,
      retryCount: 0,
    };
  }

  /**
   * Wrap a function with error handling
   */
  public wrapFunction<T extends (...args: any[]) => any>(
    func: T,
    errorType: ErrorBoundaryState['errorType'] = 'unknown',
    fallbackValue?: ReturnType<T>
  ): T {
    return ((...args: Parameters<T>): ReturnType<T> => {
      try {
        if (this.state.hasError && this.state.retryCount >= this.maxRetries) {
          if (fallbackValue !== undefined) {
            return fallbackValue;
          }
          throw new Error(`Max retries exceeded for ${errorType}`);
        }

        const result = func(...args);
        
        // Reset error state on successful execution
        if (this.state.hasError) {
          this.state = this.createInitialState();
        }
        
        return result;
      } catch (error) {
        this.handleError(error as Error, errorType, { args });
        
        if (fallbackValue !== undefined) {
          return fallbackValue;
        }
        
        throw error;
      }
    }) as T;
  }

  /**
   * Wrap an async function with error handling
   */
  public wrapAsyncFunction<T extends (...args: any[]) => Promise<any>>(
    func: T,
    errorType: ErrorBoundaryState['errorType'] = 'unknown',
    fallbackValue?: Awaited<ReturnType<T>>
  ): T {
    return (async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
      try {
        if (this.state.hasError && this.state.retryCount >= this.maxRetries) {
          if (fallbackValue !== undefined) {
            return fallbackValue;
          }
          throw new Error(`Max retries exceeded for ${errorType}`);
        }

        const result = await func(...args);
        
        // Reset error state on successful execution
        if (this.state.hasError) {
          this.state = this.createInitialState();
        }
        
        return result;
      } catch (error) {
        this.handleError(error as Error, errorType, { args });
        
        if (fallbackValue !== undefined) {
          return fallbackValue;
        }
        
        throw error;
      }
    }) as T;
  }

  private handleError(error: Error, errorType: ErrorBoundaryState['errorType'], errorInfo: any): void {
    this.state = {
      hasError: true,
      errorType,
      errorMessage: error.message,
      fallbackActive: this.state.retryCount >= this.maxRetries,
      retryCount: this.state.retryCount + 1,
    };

    // Log error for debugging
    console.warn(`Mobile menu error (${errorType}):`, error.message, errorInfo);

    // Call error handler if provided
    if (this.onError) {
      this.onError(error, { ...errorInfo, errorType, retryCount: this.state.retryCount });
    }
  }

  /**
   * Get current error state
   */
  public getState(): Readonly<ErrorBoundaryState> {
    return { ...this.state };
  }

  /**
   * Reset error state
   */
  public reset(): void {
    this.state = this.createInitialState();
  }

  /**
   * Check if fallback should be used
   */
  public shouldUseFallback(): boolean {
    return this.state.fallbackActive;
  }
}

/**
 * Memory cleanup utility
 */
export class MemoryManager {
  private cleanupTasks: (() => void)[] = [];
  private intervalId: NodeJS.Timeout | null = null;
  private isDestroyed: boolean = false;

  constructor(cleanupInterval: number = 30000) { // 30 seconds
    this.startCleanupInterval(cleanupInterval);
  }

  /**
   * Add a cleanup task
   */
  public addCleanupTask(task: () => void): void {
    if (!this.isDestroyed) {
      this.cleanupTasks.push(task);
    }
  }

  /**
   * Remove a cleanup task
   */
  public removeCleanupTask(task: () => void): void {
    const index = this.cleanupTasks.indexOf(task);
    if (index > -1) {
      this.cleanupTasks.splice(index, 1);
    }
  }

  private startCleanupInterval(interval: number): void {
    this.intervalId = setInterval(() => {
      this.runCleanup();
    }, interval);
  }

  private runCleanup(): void {
    if (this.isDestroyed) return;

    // Run all cleanup tasks
    this.cleanupTasks.forEach(task => {
      try {
        task();
      } catch (error) {
        console.warn('Error in cleanup task:', error);
      }
    });

    // Force garbage collection if available (development only)
    if (typeof window !== 'undefined' && 'gc' in window && process.env.NODE_ENV === 'development') {
      // @ts-ignore
      window.gc();
    }
  }

  /**
   * Force immediate cleanup
   */
  public forceCleanup(): void {
    this.runCleanup();
  }

  /**
   * Destroy the memory manager
   */
  public destroy(): void {
    if (this.isDestroyed) return;

    this.isDestroyed = true;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    // Run final cleanup
    this.runCleanup();
    this.cleanupTasks = [];
  }
}

/**
 * Performance-optimized RAF scheduler
 */
export class RAFScheduler {
  private tasks: Map<string, () => void> = new Map();
  private isRunning: boolean = false;
  private animationId: number | null = null;

  /**
   * Schedule a task to run on the next animation frame
   */
  public schedule(id: string, task: () => void): void {
    this.tasks.set(id, task);
    
    if (!this.isRunning) {
      this.start();
    }
  }

  /**
   * Cancel a scheduled task
   */
  public cancel(id: string): void {
    this.tasks.delete(id);
    
    if (this.tasks.size === 0 && this.isRunning) {
      this.stop();
    }
  }

  private start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.tick();
  }

  private stop(): void {
    this.isRunning = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  private tick(): void {
    if (!this.isRunning) return;

    // Execute all scheduled tasks
    const tasksToRun = Array.from(this.tasks.values());
    this.tasks.clear();

    tasksToRun.forEach(task => {
      try {
        task();
      } catch (error) {
        console.warn('Error in RAF scheduled task:', error);
      }
    });

    // Continue if there are more tasks
    if (this.tasks.size > 0) {
      this.animationId = requestAnimationFrame(() => this.tick());
    } else {
      this.stop();
    }
  }

  /**
   * Destroy the scheduler
   */
  public destroy(): void {
    this.stop();
    this.tasks.clear();
  }
}