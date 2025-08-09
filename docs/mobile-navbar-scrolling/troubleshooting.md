# Troubleshooting Guide

## Common Mobile Scrolling Issues

### 1. Menu Not Scrolling

**Symptoms:**
- Mobile menu opens but content is cut off
- No scrollbar visible
- Touch gestures don't work

**Possible Causes:**
- CSS `overflow` property not set correctly
- JavaScript not calculating dimensions properly
- Container height not being applied

**Solutions:**

```typescript
// Check if scrollable container is properly configured
const debugScrollableContainer = (container: HTMLElement) => {
  console.log('Container dimensions:', {
    scrollHeight: container.scrollHeight,
    clientHeight: container.clientHeight,
    scrollTop: container.scrollTop,
    isScrollable: container.scrollHeight > container.clientHeight,
  });
  
  // Verify CSS properties
  const styles = window.getComputedStyle(container);
  console.log('CSS properties:', {
    overflowY: styles.overflowY,
    maxHeight: styles.maxHeight,
    height: styles.height,
  });
};

// Usage
debugScrollableContainer(mobileMenuRef.current);
```

**Quick Fix:**
```css
/* Ensure proper overflow settings */
.mobile-menu-scrollable {
  overflow-y: auto !important;
  max-height: var(--menu-max-height, 400px) !important;
}
```

### 2. Jerky or Laggy Scrolling

**Symptoms:**
- Scrolling feels choppy
- Frame drops during scroll
- Poor performance on older devices

**Possible Causes:**
- Missing hardware acceleration
- Too many DOM updates during scroll
- Heavy CSS animations running simultaneously

**Solutions:**

```typescript
// Enable performance monitoring
import { PerformanceMonitor } from '@/lib/performanceUtils';

const monitor = new PerformanceMonitor(
  { minFrameRate: 45, maxFrameTime: 22 },
  (metrics) => {
    console.warn('Performance issue detected:', metrics);
    
    // Disable animations if performance is poor
    if (metrics.frameRate < 30) {
      document.body.classList.add('reduce-animations');
    }
  }
);

monitor.startMonitoring();
```

**CSS Optimizations:**
```css
/* Force hardware acceleration */
.mobile-menu-scrollable {
  transform: translateZ(0);
  will-change: scroll-position;
  -webkit-overflow-scrolling: touch;
}

/* Reduce animations on poor performance */
.reduce-animations * {
  animation-duration: 0.01ms !important;
  transition-duration: 0.01ms !important;
}
```

### 3. Touch Gestures Not Working

**Symptoms:**
- Touch scrolling doesn't work
- No momentum scrolling
- Page scrolls instead of menu

**Possible Causes:**
- Touch events not properly handled
- Event listeners not attached
- Touch-action CSS property conflicts

**Solutions:**

```typescript
// Debug touch event handling
const debugTouchEvents = (container: HTMLElement) => {
  container.addEventListener('touchstart', (e) => {
    console.log('Touch start:', e.touches.length, e.touches[0].clientY);
  });
  
  container.addEventListener('touchmove', (e) => {
    console.log('Touch move:', e.touches[0].clientY);
  });
  
  container.addEventListener('touchend', () => {
    console.log('Touch end');
  });
};

// Check if touch is supported
const isTouchSupported = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
console.log('Touch supported:', isTouchSupported);
```

**CSS Fix:**
```css
/* Ensure proper touch handling */
.mobile-menu-scrollable {
  touch-action: pan-y;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
}
```

### 4. Menu Height Issues

**Symptoms:**
- Menu too tall or too short
- Menu doesn't adapt to screen size
- Content gets cut off on small screens

**Possible Causes:**
- Viewport dimensions not calculated correctly
- CSS custom properties not updating
- Orientation change not handled

**Solutions:**

```typescript
// Debug viewport calculations
const debugViewport = () => {
  const viewport = {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    visualViewport: window.visualViewport?.height,
    documentHeight: document.documentElement.clientHeight,
    screenHeight: screen.height,
  };
  
  console.log('Viewport debug:', viewport);
  
  // Check CSS custom properties
  const root = document.documentElement;
  const menuHeight = root.style.getPropertyValue('--menu-max-height');
  console.log('Menu height CSS var:', menuHeight);
};

// Handle orientation changes
window.addEventListener('orientationchange', () => {
  setTimeout(debugViewport, 100); // Delay to get accurate dimensions
});
```

**Manual Height Override:**
```css
/* Emergency height fix */
@media (max-height: 600px) {
  .mobile-menu-scrollable {
    max-height: 300px !important;
  }
}

@media (max-height: 400px) {
  .mobile-menu-scrollable {
    max-height: 200px !important;
  }
}
```

### 5. Keyboard Navigation Problems

**Symptoms:**
- Arrow keys don't work
- Focus gets lost
- Items not scrolling into view

**Possible Causes:**
- Event listeners not attached
- Focus management broken
- Scroll-to-focused-element not working

**Solutions:**

```typescript
// Debug keyboard navigation
const debugKeyboardNav = (container: HTMLElement) => {
  document.addEventListener('keydown', (e) => {
    console.log('Key pressed:', e.key, 'Active element:', document.activeElement);
    
    if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key)) {
      console.log('Navigation key detected');
      
      // Check if focused element is visible
      const activeElement = document.activeElement as HTMLElement;
      if (activeElement && container.contains(activeElement)) {
        const rect = activeElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        console.log('Element visibility:', {
          elementTop: rect.top,
          elementBottom: rect.bottom,
          containerTop: containerRect.top,
          containerBottom: containerRect.bottom,
          isVisible: rect.top >= containerRect.top && rect.bottom <= containerRect.bottom,
        });
      }
    }
  });
};
```

**Focus Management Fix:**
```typescript
// Ensure focus stays within menu
const ensureFocusWithinMenu = (container: HTMLElement) => {
  const focusableElements = container.querySelectorAll(
    'a, button, [tabindex]:not([tabindex="-1"])'
  ) as NodeListOf<HTMLElement>;
  
  if (focusableElements.length === 0) {
    console.warn('No focusable elements found in menu');
    return;
  }
  
  // Focus first element if none is focused
  if (!container.contains(document.activeElement)) {
    focusableElements[0].focus();
  }
};
```

## Performance Issues

### 6. Memory Leaks

**Symptoms:**
- Browser becomes slow over time
- Memory usage keeps increasing
- Page crashes on mobile devices

**Debugging:**
```typescript
// Monitor memory usage
const monitorMemory = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('Memory usage:', {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB',
    });
  }
};

// Check for event listener leaks
const checkEventListeners = () => {
  // This requires Chrome DevTools
  console.log('Check DevTools -> Elements -> Event Listeners');
};

setInterval(monitorMemory, 5000);
```

**Solutions:**
```typescript
// Proper cleanup in useEffect
useEffect(() => {
  const cleanup = setupMobileMenu();
  
  return () => {
    cleanup(); // Always clean up
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

### 7. High CPU Usage

**Symptoms:**
- Device gets hot
- Battery drains quickly
- Other apps become slow

**Debugging:**
```typescript
// Monitor frame rate
let frameCount = 0;
let lastTime = performance.now();

const monitorFrameRate = () => {
  frameCount++;
  const currentTime = performance.now();
  
  if (currentTime - lastTime >= 1000) {
    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    console.log('Current FPS:', fps);
    
    if (fps < 30) {
      console.warn('Low frame rate detected');
    }
    
    frameCount = 0;
    lastTime = currentTime;
  }
  
  requestAnimationFrame(monitorFrameRate);
};

monitorFrameRate();
```

**Solutions:**
```typescript
// Throttle expensive operations
import { debounce } from '@/lib/mobileMenuUtils';

const expensiveScrollHandler = debounce((event) => {
  // Expensive operations here
}, 16); // ~60fps

// Use passive listeners
element.addEventListener('scroll', handler, { passive: true });

// Reduce work in scroll handlers
const lightweightScrollHandler = (event) => {
  // Only do essential work
  requestAnimationFrame(() => {
    // Defer heavy work to next frame
    updateScrollIndicators();
  });
};
```

## Browser-Specific Issues

### 8. iOS Safari Issues

**Issue: Viewport height changes**
```typescript
// Handle iOS viewport changes
const handleIOSViewport = () => {
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };
  
  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', () => {
    setTimeout(setVH, 100);
  });
};

if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
  handleIOSViewport();
}
```

**Issue: Momentum scrolling stops**
```css
/* Force iOS momentum scrolling */
.mobile-menu-scrollable {
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
}
```

### 9. Android Chrome Issues

**Issue: Touch events interfere with page scroll**
```typescript
// Better touch event handling for Android
const handleAndroidTouch = (container: HTMLElement) => {
  let startY = 0;
  let isScrolling = false;
  
  container.addEventListener('touchstart', (e) => {
    startY = e.touches[0].clientY;
    isScrolling = false;
  }, { passive: true });
  
  container.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY;
    const deltaY = startY - currentY;
    
    // Only prevent default if we're actually scrolling the menu
    if (Math.abs(deltaY) > 5) {
      isScrolling = true;
      const { scrollTop, scrollHeight, clientHeight } = container;
      
      if ((deltaY > 0 && scrollTop < scrollHeight - clientHeight) ||
          (deltaY < 0 && scrollTop > 0)) {
        e.preventDefault();
      }
    }
  }, { passive: false });
};
```

### 10. Firefox Mobile Issues

**Issue: Custom scrollbar not working**
```css
/* Firefox-specific scrollbar styling */
.mobile-menu-scrollable {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

/* Hide webkit scrollbar properties in Firefox */
@-moz-document url-prefix() {
  .mobile-menu-scrollable::-webkit-scrollbar {
    display: none;
  }
}
```

## Accessibility Issues

### 11. Screen Reader Problems

**Issue: Scroll state not announced**
```typescript
// Debug screen reader announcements
const debugScreenReader = () => {
  const announcements = document.querySelectorAll('[aria-live]');
  console.log('Live regions:', announcements);
  
  // Test announcement
  const testAnnouncement = document.createElement('div');
  testAnnouncement.setAttribute('aria-live', 'polite');
  testAnnouncement.className = 'sr-only';
  testAnnouncement.textContent = 'Test announcement';
  document.body.appendChild(testAnnouncement);
  
  setTimeout(() => {
    document.body.removeChild(testAnnouncement);
  }, 1000);
};
```

**Solution:**
```typescript
// Ensure proper screen reader support
const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    if (document.body.contains(announcement)) {
      document.body.removeChild(announcement);
    }
  }, 1000);
};
```

### 12. Focus Management Issues

**Issue: Focus gets lost during scrolling**
```typescript
// Robust focus management
const maintainFocus = (container: HTMLElement) => {
  const observer = new MutationObserver(() => {
    const activeElement = document.activeElement;
    if (activeElement && container.contains(activeElement)) {
      // Ensure focused element is visible
      activeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  });
  
  observer.observe(container, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['tabindex', 'aria-hidden'],
  });
  
  return () => observer.disconnect();
};
```

## Debugging Tools

### Development Console Commands

```typescript
// Add to browser console for debugging
window.debugMobileMenu = {
  // Check current state
  getState: () => {
    const container = document.querySelector('.mobile-menu-scrollable');
    if (!container) return 'Menu not found';
    
    return {
      isScrollable: container.scrollHeight > container.clientHeight,
      scrollTop: container.scrollTop,
      scrollHeight: container.scrollHeight,
      clientHeight: container.clientHeight,
      cssMaxHeight: getComputedStyle(container).maxHeight,
    };
  },
  
  // Force scroll to position
  scrollTo: (position: number) => {
    const container = document.querySelector('.mobile-menu-scrollable');
    if (container) container.scrollTop = position;
  },
  
  // Test touch events
  simulateTouch: (startY: number, endY: number) => {
    const container = document.querySelector('.mobile-menu-scrollable');
    if (!container) return;
    
    const touchStart = new TouchEvent('touchstart', {
      touches: [{ clientY: startY } as Touch],
    });
    const touchEnd = new TouchEvent('touchend', {
      touches: [{ clientY: endY } as Touch],
    });
    
    container.dispatchEvent(touchStart);
    setTimeout(() => container.dispatchEvent(touchEnd), 100);
  },
  
  // Monitor performance
  startPerformanceMonitor: () => {
    let frameCount = 0;
    let lastTime = performance.now();
    
    const monitor = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        console.log('FPS:', Math.round((frameCount * 1000) / (currentTime - lastTime)));
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(monitor);
    };
    
    monitor();
  },
};
```

### CSS Debug Styles

```css
/* Add to temporarily debug layout issues */
.debug-mobile-menu .mobile-menu-container {
  border: 2px solid red !important;
}

.debug-mobile-menu .mobile-menu-scrollable {
  border: 2px solid blue !important;
  background: rgba(0, 0, 255, 0.1) !important;
}

.debug-mobile-menu .mobile-menu-content {
  border: 2px solid green !important;
}

.debug-mobile-menu .mobile-menu-item {
  border: 1px solid orange !important;
  margin: 1px !important;
}

/* Show scroll indicators */
.debug-mobile-menu .mobile-menu-scrollable::before,
.debug-mobile-menu .mobile-menu-scrollable::after {
  background: rgba(255, 0, 0, 0.5) !important;
  opacity: 1 !important;
}
```

### Testing Checklist

When troubleshooting, go through this checklist:

#### Basic Functionality
- [ ] Menu opens and closes properly
- [ ] Content is visible and not cut off
- [ ] Scrolling works with touch
- [ ] Scrolling works with mouse wheel (desktop)
- [ ] Keyboard navigation works

#### Performance
- [ ] Scrolling is smooth (no jank)
- [ ] No memory leaks after repeated use
- [ ] CPU usage is reasonable
- [ ] Battery usage is acceptable

#### Accessibility
- [ ] Screen reader announces scroll state
- [ ] Focus management works correctly
- [ ] High contrast mode supported
- [ ] Reduced motion preferences respected

#### Browser Compatibility
- [ ] Works on target iOS Safari versions
- [ ] Works on target Android Chrome versions
- [ ] Fallbacks work on older browsers
- [ ] No console errors

#### Edge Cases
- [ ] Works with very long menu lists
- [ ] Works with very short menu lists
- [ ] Handles orientation changes
- [ ] Handles window resizing
- [ ] Works offline (if applicable)