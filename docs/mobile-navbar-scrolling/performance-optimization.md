# Performance Optimization Guide

## Maintaining Smooth 60fps Scrolling

### Hardware Acceleration

The mobile menu uses hardware acceleration to ensure smooth scrolling performance:

```css
/* Core hardware acceleration */
.mobile-menu-scrollable {
  /* Enable GPU acceleration */
  transform: translateZ(0);
  will-change: scroll-position;
  backface-visibility: hidden;
  
  /* Optimize for mobile */
  -webkit-overflow-scrolling: touch;
  -webkit-transform: translateZ(0);
}

/* Accelerate menu items */
.mobile-menu-item {
  transform: translateZ(0);
  will-change: background-color, transform;
}
```

### Performance Monitoring

Built-in performance monitoring helps detect and prevent performance issues:

```typescript
import { PerformanceMonitor } from '@/lib/performanceUtils';

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor(
  {
    minFrameRate: 55,        // Target 55+ FPS
    maxFrameTime: 18,        // Max 18ms per frame
    maxDroppedFrames: 3,     // Allow max 3 dropped frames
  },
  (metrics) => {
    console.warn('Performance degradation detected:', metrics);
    
    // Automatic performance adjustments
    if (metrics.frameRate < 30) {
      // Disable animations on severe performance issues
      document.body.classList.add('disable-animations');
    }
  }
);

// Start monitoring during scroll operations
performanceMonitor.startMonitoring();
```

### Optimized Event Handling

#### Passive Event Listeners

Use passive event listeners for better scroll performance:

```typescript
import { addPassiveEventListener } from '@/lib/performanceUtils';

// Passive scroll listener
const removeScrollListener = addPassiveEventListener(
  scrollContainer,
  'scroll',
  handleScroll,
  { passive: true }
);

// Cleanup
removeScrollListener();
```

#### Debounced Operations

Debounce expensive operations to maintain smooth scrolling:

```typescript
import { performanceDebounce } from '@/lib/performanceUtils';

// Debounced resize handler
const debouncedResize = performanceDebounce(
  (dimensions: MenuDimensions) => {
    updateMenuDimensions(dimensions);
  },
  150, // 150ms debounce
  {
    leading: false,
    trailing: true,
    maxWait: 300,
  }
);
```

### Memory Management

#### Automatic Cleanup

The implementation includes automatic memory management:

```typescript
import { MemoryManager } from '@/lib/performanceUtils';

// Initialize memory manager
const memoryManager = new MemoryManager(30000); // 30 second intervals

// Add cleanup tasks
memoryManager.addCleanupTask(() => {
  // Clear cached calculations
  dimensionCache.clear();
  
  // Remove stale event listeners
  cleanupStaleListeners();
});

// Force cleanup when needed
const handleLowMemory = () => {
  memoryManager.forceCleanup();
};
```

#### Preventing Memory Leaks

```typescript
// Proper cleanup in React components
useEffect(() => {
  const touchGestureManager = new TouchGestureManager(containerRef.current);
  const performanceMonitor = new PerformanceMonitor();
  
  return () => {
    // Always cleanup on unmount
    touchGestureManager.destroy();
    performanceMonitor.destroy();
  };
}, []);

// Use AbortController for event listeners
const controller = new AbortController();

element.addEventListener('scroll', handler, {
  signal: controller.signal,
  passive: true,
});

// Cleanup
controller.abort();
```

## Touch Performance Optimization

### Optimized Touch Handling

```typescript
// High-performance touch configuration
const optimizedTouchConfig: TouchGestureConfig = {
  // Momentum settings for smooth scrolling
  momentumEnabled: true,
  momentumDecay: 0.95,
  momentumThreshold: 0.5,
  
  // Optimized for 60fps
  touchSensitivity: 1.0,
  
  // Performance settings
  passiveListeners: true,
  preventPageScroll: true,
};

// Device-specific optimizations
const getDeviceOptimizedConfig = (): Partial<TouchGestureConfig> => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  const isAndroid = /Android/.test(navigator.userAgent);
  
  if (isIOS) {
    return {
      momentumDecay: 0.92,     // iOS-optimized momentum
      bounceEnabled: true,      // iOS users expect bounce
    };
  }
  
  if (isAndroid) {
    return {
      momentumDecay: 0.95,     // Android-optimized momentum
      touchSensitivity: 1.1,   // Slightly more sensitive
    };
  }
  
  return {};
};
```

### Touch Event Optimization

```typescript
// Optimized touch event handling
class OptimizedTouchHandler {
  private rafId: number | null = null;
  private pendingUpdate = false;
  
  handleTouchMove = (event: TouchEvent) => {
    if (this.pendingUpdate) return;
    
    this.pendingUpdate = true;
    
    // Use RAF to throttle updates to 60fps
    this.rafId = requestAnimationFrame(() => {
      this.processTouchMove(event);
      this.pendingUpdate = false;
    });
  };
  
  private processTouchMove(event: TouchEvent) {
    // Actual touch processing here
    const touch = event.touches[0];
    const deltaY = this.lastY - touch.clientY;
    
    // Apply scroll with minimal DOM manipulation
    this.container.scrollTop += deltaY;
    this.lastY = touch.clientY;
  }
  
  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
```

## CSS Performance Optimizations

### Efficient Animations

```css
/* Use transform instead of changing layout properties */
.mobile-menu-item {
  /* Good: Uses compositor */
  transform: translateX(0);
  transition: transform 200ms ease;
}

.mobile-menu-item:hover {
  /* Good: Only changes transform */
  transform: translateX(2px);
}

/* Avoid layout-triggering properties */
.mobile-menu-item {
  /* Bad: Triggers layout */
  /* margin-left: 0; */
  /* transition: margin-left 200ms ease; */
}
```

### Optimized Scrollbar Styling

```css
/* Lightweight scrollbar styling */
.mobile-menu-scrollable::-webkit-scrollbar {
  width: 4px; /* Thin scrollbar for better performance */
}

.mobile-menu-scrollable::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 2px;
  
  /* Avoid complex gradients or shadows */
  /* background: linear-gradient(...); */ /* Avoid */
  /* box-shadow: ...; */ /* Avoid */
}
```

### Container Queries Optimization

```css
/* Use container queries efficiently */
.mobile-menu-container {
  container-type: size;
}

/* Minimize container query usage */
@container (max-height: 400px) {
  .mobile-menu-item {
    padding: 8px 24px; /* Reduce padding on small containers */
  }
}
```

## JavaScript Performance Tips

### Efficient DOM Manipulation

```typescript
// Batch DOM updates
const batchDOMUpdates = (updates: (() => void)[]) => {
  requestAnimationFrame(() => {
    // Batch all DOM updates in a single frame
    updates.forEach(update => update());
  });
};

// Use DocumentFragment for multiple insertions
const addMultipleItems = (items: string[]) => {
  const fragment = document.createDocumentFragment();
  
  items.forEach(item => {
    const element = document.createElement('div');
    element.textContent = item;
    fragment.appendChild(element);
  });
  
  container.appendChild(fragment);
};
```

### Optimized Calculations

```typescript
// Cache expensive calculations
const calculationCache = new Map<string, MenuDimensions>();

const getCachedDimensions = (key: string, calculator: () => MenuDimensions): MenuDimensions => {
  if (calculationCache.has(key)) {
    return calculationCache.get(key)!;
  }
  
  const result = calculator();
  calculationCache.set(key, result);
  
  // Clear cache after 5 minutes
  setTimeout(() => calculationCache.delete(key), 300000);
  
  return result;
};

// Use efficient data structures
const visibleItems = new Set<number>(); // O(1) lookup
const itemPositions = new Map<number, number>(); // O(1) lookup
```

### Intersection Observer for Visibility

```typescript
// Efficiently track visible items
const setupVisibilityTracking = (container: HTMLElement) => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const index = parseInt(entry.target.getAttribute('data-index') || '0');
        
        if (entry.isIntersecting) {
          visibleItems.add(index);
        } else {
          visibleItems.delete(index);
        }
      });
    },
    {
      root: container,
      rootMargin: '10px', // Small margin for better UX
      threshold: 0.1,     // 10% visibility threshold
    }
  );
  
  // Observe all menu items
  const items = container.querySelectorAll('.mobile-menu-item');
  items.forEach(item => observer.observe(item));
  
  return () => observer.disconnect();
};
```

## Performance Monitoring and Debugging

### Real-time Performance Metrics

```typescript
// Performance dashboard for development
class PerformanceDashboard {
  private metricsElement: HTMLElement;
  private updateInterval: number;
  
  constructor() {
    this.createDashboard();
    this.startUpdating();
  }
  
  private createDashboard() {
    this.metricsElement = document.createElement('div');
    this.metricsElement.className = 'performance-dashboard';
    this.metricsElement.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(this.metricsElement);
  }
  
  private startUpdating() {
    this.updateInterval = setInterval(() => {
      const metrics = this.getMetrics();
      this.updateDisplay(metrics);
    }, 1000);
  }
  
  private getMetrics() {
    const memory = (performance as any).memory;
    
    return {
      fps: this.calculateFPS(),
      memory: memory ? Math.round(memory.usedJSHeapSize / 1024 / 1024) : 'N/A',
      scrollEvents: this.getScrollEventCount(),
      touchEvents: this.getTouchEventCount(),
    };
  }
  
  private updateDisplay(metrics: any) {
    this.metricsElement.innerHTML = `
      FPS: ${metrics.fps}
      Memory: ${metrics.memory} MB
      Scroll Events: ${metrics.scrollEvents}
      Touch Events: ${metrics.touchEvents}
    `;
    
    // Color coding for performance
    if (metrics.fps < 30) {
      this.metricsElement.style.background = 'rgba(255, 0, 0, 0.8)';
    } else if (metrics.fps < 50) {
      this.metricsElement.style.background = 'rgba(255, 165, 0, 0.8)';
    } else {
      this.metricsElement.style.background = 'rgba(0, 128, 0, 0.8)';
    }
  }
  
  destroy() {
    clearInterval(this.updateInterval);
    this.metricsElement.remove();
  }
}

// Use in development
if (process.env.NODE_ENV === 'development') {
  const dashboard = new PerformanceDashboard();
}
```

### Performance Profiling

```typescript
// Profile specific operations
const profileOperation = <T>(name: string, operation: () => T): T => {
  const start = performance.now();
  const result = operation();
  const end = performance.now();
  
  console.log(`${name} took ${end - start} milliseconds`);
  
  if (end - start > 16.67) { // More than one frame at 60fps
    console.warn(`${name} is taking too long and may cause jank`);
  }
  
  return result;
};

// Usage
const dimensions = profileOperation('calculateMenuDimensions', () => {
  return calculateMenuDimensions(itemCount, config);
});
```

## Performance Best Practices

### Do's

1. **Use Hardware Acceleration**
   ```css
   transform: translateZ(0);
   will-change: scroll-position;
   ```

2. **Implement Passive Listeners**
   ```typescript
   element.addEventListener('scroll', handler, { passive: true });
   ```

3. **Debounce Expensive Operations**
   ```typescript
   const debouncedHandler = debounce(expensiveOperation, 150);
   ```

4. **Cache Calculations**
   ```typescript
   const cachedResult = cache.get(key) || calculateAndCache(key);
   ```

5. **Use RequestAnimationFrame**
   ```typescript
   requestAnimationFrame(() => {
     // DOM updates here
   });
   ```

### Don'ts

1. **Don't Use Layout-Triggering Properties in Animations**
   ```css
   /* Avoid */
   transition: width 200ms, height 200ms, margin 200ms;
   
   /* Use instead */
   transition: transform 200ms, opacity 200ms;
   ```

2. **Don't Perform Heavy Operations in Scroll Handlers**
   ```typescript
   // Avoid
   element.addEventListener('scroll', () => {
     heavyCalculation(); // Bad
   });
   
   // Use instead
   element.addEventListener('scroll', debounce(() => {
     heavyCalculation(); // Good
   }, 100));
   ```

3. **Don't Forget to Clean Up**
   ```typescript
   // Always clean up
   useEffect(() => {
     const cleanup = setupFeature();
     return cleanup; // Important!
   }, []);
   ```

4. **Don't Use Synchronous Operations**
   ```typescript
   // Avoid
   const result = synchronousHeavyOperation();
   
   // Use instead
   setTimeout(() => {
     const result = heavyOperation();
   }, 0);
   ```

## Performance Testing

### Automated Performance Tests

```typescript
// Performance test suite
describe('Mobile Menu Performance', () => {
  it('should maintain 60fps during scrolling', async () => {
    const performanceMonitor = new PerformanceMonitor();
    performanceMonitor.startMonitoring();
    
    // Simulate scrolling
    await simulateScrolling(1000); // 1 second of scrolling
    
    const metrics = performanceMonitor.getMetrics();
    expect(metrics.frameRate).toBeGreaterThan(55);
  });
  
  it('should not leak memory', async () => {
    const initialMemory = getMemoryUsage();
    
    // Open and close menu 100 times
    for (let i = 0; i < 100; i++) {
      await openMobileMenu();
      await closeMobileMenu();
    }
    
    // Force garbage collection
    if (global.gc) global.gc();
    
    const finalMemory = getMemoryUsage();
    const memoryIncrease = finalMemory - initialMemory;
    
    expect(memoryIncrease).toBeLessThan(5 * 1024 * 1024); // Less than 5MB
  });
});
```

### Manual Performance Testing

1. **Use Chrome DevTools Performance Tab**
   - Record performance while scrolling
   - Look for frame drops and long tasks
   - Check memory usage over time

2. **Test on Real Devices**
   - Use older/slower devices for testing
   - Test on different network conditions
   - Monitor battery usage

3. **Use Lighthouse**
   - Run Lighthouse performance audits
   - Focus on mobile performance scores
   - Address specific recommendations

### Performance Checklist

- [ ] Scrolling maintains 60fps on target devices
- [ ] No memory leaks after repeated use
- [ ] Touch events respond within 100ms
- [ ] Menu opens/closes within 300ms
- [ ] No layout thrashing during scroll
- [ ] Passive event listeners used where possible
- [ ] Hardware acceleration enabled
- [ ] Expensive operations are debounced
- [ ] Proper cleanup implemented
- [ ] Performance monitoring in place