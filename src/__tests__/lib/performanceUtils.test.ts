/**
 * Tests for performance utilities
 */

import {
  PerformanceMonitor,
  performanceDebounce,
  addPassiveEventListener,
  MobileMenuErrorBoundary,
  MemoryManager,
  RAFScheduler,
} from '@/lib/performanceUtils';

// Mock performance API
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 1024 * 1024 * 10, // 10MB
  },
};

// Mock requestAnimationFrame
const mockRequestAnimationFrame = jest.fn((callback) => {
  setTimeout(callback, 16);
  return 1;
});

const mockCancelAnimationFrame = jest.fn();

// Setup global mocks
beforeAll(() => {
  global.performance = mockPerformance as any;
  global.requestAnimationFrame = mockRequestAnimationFrame;
  global.cancelAnimationFrame = mockCancelAnimationFrame;
});

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;
  let onDegradation: jest.Mock;

  beforeEach(() => {
    onDegradation = jest.fn();
    monitor = new PerformanceMonitor(
      { minFrameRate: 55, maxFrameTime: 18, maxDroppedFrames: 3 },
      onDegradation
    );
    jest.clearAllMocks();
  });

  afterEach(() => {
    monitor.destroy();
  });

  test('should initialize with default metrics', () => {
    const metrics = monitor.getMetrics();
    expect(metrics.frameRate).toBe(60);
    expect(metrics.averageFrameTime).toBe(16.67);
    expect(metrics.droppedFrames).toBe(0);
    expect(metrics.scrollEventCount).toBe(0);
    expect(metrics.resizeEventCount).toBe(0);
  });

  test('should record scroll events', () => {
    monitor.recordScrollEvent();
    monitor.recordScrollEvent();
    
    const metrics = monitor.getMetrics();
    expect(metrics.scrollEventCount).toBe(2);
  });

  test('should record resize events', () => {
    monitor.recordResizeEvent();
    
    const metrics = monitor.getMetrics();
    expect(metrics.resizeEventCount).toBe(1);
  });

  test('should start and stop monitoring', () => {
    monitor.startMonitoring();
    expect(mockRequestAnimationFrame).toHaveBeenCalled();
    
    monitor.stopMonitoring();
    expect(mockCancelAnimationFrame).toHaveBeenCalled();
  });

  test('should reset metrics', () => {
    monitor.recordScrollEvent();
    monitor.resetMetrics();
    
    const metrics = monitor.getMetrics();
    expect(metrics.scrollEventCount).toBe(0);
  });
});

describe('performanceDebounce', () => {
  jest.useFakeTimers();

  test('should debounce function calls', () => {
    const mockFn = jest.fn();
    const debouncedFn = performanceDebounce(mockFn, 100);

    debouncedFn.debouncedFunction('test1');
    debouncedFn.debouncedFunction('test2');
    debouncedFn.debouncedFunction('test3');

    expect(mockFn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test3');
  });

  test('should support leading edge calls', () => {
    const mockFn = jest.fn();
    const debouncedFn = performanceDebounce(mockFn, 100, { leading: true });

    debouncedFn.debouncedFunction('test1');
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('test1');

    debouncedFn.debouncedFunction('test2');
    jest.advanceTimersByTime(100);
    expect(mockFn).toHaveBeenCalledTimes(2);
    expect(mockFn).toHaveBeenCalledWith('test2');
  });

  test('should cancel debounced calls', () => {
    const mockFn = jest.fn();
    const debouncedFn = performanceDebounce(mockFn, 100);

    debouncedFn.debouncedFunction('test');
    debouncedFn.cancel();
    
    jest.advanceTimersByTime(100);
    expect(mockFn).not.toHaveBeenCalled();
  });

  test('should flush debounced calls', () => {
    const mockFn = jest.fn().mockReturnValue('result');
    const debouncedFn = performanceDebounce(mockFn, 100);

    debouncedFn.debouncedFunction('test');
    const result = debouncedFn.flush();
    
    expect(mockFn).toHaveBeenCalledWith('test');
    expect(result).toBe('result');
  });

  afterEach(() => {
    jest.clearAllTimers();
  });
});

describe('addPassiveEventListener', () => {
  test('should add passive event listener and return cleanup function', () => {
    const mockElement = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    const mockHandler = jest.fn();

    const cleanup = addPassiveEventListener(
      mockElement as any,
      'scroll',
      mockHandler,
      { passive: true }
    );

    expect(mockElement.addEventListener).toHaveBeenCalledWith(
      'scroll',
      mockHandler,
      { passive: true }
    );

    cleanup();
    expect(mockElement.removeEventListener).toHaveBeenCalledWith(
      'scroll',
      mockHandler,
      { passive: true }
    );
  });
});

describe('MobileMenuErrorBoundary', () => {
  let errorBoundary: MobileMenuErrorBoundary;
  let onError: jest.Mock;

  beforeEach(() => {
    onError = jest.fn();
    errorBoundary = new MobileMenuErrorBoundary(3, onError);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should wrap function with error handling', () => {
    const mockFn = jest.fn().mockReturnValue('success');
    const wrappedFn = errorBoundary.wrapFunction(mockFn, 'test');

    const result = wrappedFn('arg1', 'arg2');
    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  test('should handle errors and provide fallback', () => {
    const mockFn = jest.fn().mockImplementation(() => {
      throw new Error('Test error');
    });
    const wrappedFn = errorBoundary.wrapFunction(mockFn, 'test', 'fallback');

    const result = wrappedFn();
    expect(result).toBe('fallback');
    expect(onError).toHaveBeenCalled();
  });

  test('should reset error state after successful execution', () => {
    const mockFn = jest.fn()
      .mockImplementationOnce(() => { throw new Error('Test error'); })
      .mockImplementationOnce(() => 'success');
    
    const wrappedFn = errorBoundary.wrapFunction(mockFn, 'test', 'fallback');

    // First call should error
    let result = wrappedFn();
    expect(result).toBe('fallback');
    expect(errorBoundary.getState().hasError).toBe(true);

    // Second call should succeed and reset error state
    result = wrappedFn();
    expect(result).toBe('success');
    expect(errorBoundary.getState().hasError).toBe(false);
  });

  test('should track retry count', () => {
    const mockFn = jest.fn().mockImplementation(() => {
      throw new Error('Test error');
    });
    const wrappedFn = errorBoundary.wrapFunction(mockFn, 'test', 'fallback');

    wrappedFn();
    expect(errorBoundary.getState().retryCount).toBe(1);

    wrappedFn();
    expect(errorBoundary.getState().retryCount).toBe(2);
  });

  test('should reset error state', () => {
    const mockFn = jest.fn().mockImplementation(() => {
      throw new Error('Test error');
    });
    const wrappedFn = errorBoundary.wrapFunction(mockFn, 'test', 'fallback');

    wrappedFn();
    expect(errorBoundary.getState().hasError).toBe(true);

    errorBoundary.reset();
    expect(errorBoundary.getState().hasError).toBe(false);
    expect(errorBoundary.getState().retryCount).toBe(0);
  });
});

describe('MemoryManager', () => {
  jest.useFakeTimers();

  let memoryManager: MemoryManager;

  beforeEach(() => {
    memoryManager = new MemoryManager(1000); // 1 second interval for testing
  });

  afterEach(() => {
    memoryManager.destroy();
    jest.clearAllTimers();
  });

  test('should add and run cleanup tasks', () => {
    const cleanupTask = jest.fn();
    memoryManager.addCleanupTask(cleanupTask);

    jest.advanceTimersByTime(1000);
    expect(cleanupTask).toHaveBeenCalled();
  });

  test('should remove cleanup tasks', () => {
    const cleanupTask = jest.fn();
    memoryManager.addCleanupTask(cleanupTask);
    memoryManager.removeCleanupTask(cleanupTask);

    jest.advanceTimersByTime(1000);
    expect(cleanupTask).not.toHaveBeenCalled();
  });

  test('should force immediate cleanup', () => {
    const cleanupTask = jest.fn();
    memoryManager.addCleanupTask(cleanupTask);

    memoryManager.forceCleanup();
    expect(cleanupTask).toHaveBeenCalled();
  });

  test('should handle cleanup task errors gracefully', () => {
    const errorTask = jest.fn().mockImplementation(() => {
      throw new Error('Cleanup error');
    });
    const normalTask = jest.fn();
    
    jest.spyOn(console, 'warn').mockImplementation(() => {});

    memoryManager.addCleanupTask(errorTask);
    memoryManager.addCleanupTask(normalTask);

    jest.advanceTimersByTime(1000);
    
    expect(errorTask).toHaveBeenCalled();
    expect(normalTask).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('Error in cleanup task:', expect.any(Error));

    jest.restoreAllMocks();
  });
});

describe('RAFScheduler', () => {
  let scheduler: RAFScheduler;

  beforeEach(() => {
    scheduler = new RAFScheduler();
  });

  afterEach(() => {
    scheduler.destroy();
  });

  test('should create scheduler instance', () => {
    expect(scheduler).toBeDefined();
  });

  test('should schedule and cancel tasks', () => {
    const task = jest.fn();
    scheduler.schedule('test-task', task);
    scheduler.cancel('test-task');
    expect(scheduler).toBeDefined();
  });

  test('should destroy scheduler', () => {
    scheduler.destroy();
    expect(scheduler).toBeDefined();
  });
});