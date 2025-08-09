# Developer Guide

## Customizing Scroll Behavior

### Configuration Options

The mobile menu scrolling behavior can be customized through the `MobileMenuConfig` interface:

```typescript
interface MobileMenuConfig {
  breakpoints: {
    mobile: number;      // Mobile breakpoint (default: 768px)
    tablet: number;      // Tablet breakpoint (default: 1024px)
  };
  heights: {
    mobile: {
      maxVh: number;     // Max height on mobile (default: 70vh)
      reservedVh: number; // Reserved space below menu (default: 20vh)
    };
    tablet: {
      maxVh: number;     // Max height on tablet (default: 80vh)
      reservedVh: number; // Reserved space below menu (default: 15vh)
    };
  };
  scrolling: {
    smoothBehavior: boolean;      // Enable smooth scrolling
    showScrollbar: boolean;       // Show custom scrollbar
    keyboardScrollStep: number;   // Pixels to scroll per key press
  };
  animation: {
    openDuration: number;    // Menu open animation (ms)
    closeDuration: number;   // Menu close animation (ms)
    scrollDuration: number;  // Scroll animation duration (ms)
  };
  fallback: {
    minHeight: number;       // Minimum menu height (px)
    maxHeight: number;       // Maximum menu height (px)
    itemHeight: number;      // Default item height (px)
  };
}
```

### Custom Configuration Example

```typescript
import { DEFAULT_MOBILE_MENU_CONFIG } from '@/lib/mobileMenuUtils';

const customConfig: MobileMenuConfig = {
  ...DEFAULT_MOBILE_MENU_CONFIG,
  heights: {
    mobile: {
      maxVh: 60,        // Smaller menu on mobile
      reservedVh: 30,   // More space below menu
    },
    tablet: {
      maxVh: 75,        // Slightly smaller on tablet
      reservedVh: 20,
    },
  },
  scrolling: {
    smoothBehavior: true,
    showScrollbar: true,
    keyboardScrollStep: 48,  // Smaller scroll steps
  },
};

// Use in component
const { cssProperties } = useMobileMenuDimensions({
  itemCount: navLinks.length,
  config: customConfig,
  enabled: isMobileMenuOpen,
});
```

## Customizing Heights

### Responsive Height Calculation

Heights are calculated based on viewport dimensions and device type:

```typescript
// Custom height calculation
function calculateCustomHeight(itemCount: number): MenuDimensions {
  const viewport = getViewportDimensions();
  
  // Custom logic for different screen sizes
  let maxVh = 70; // Default
  
  if (viewport.width < 480) {
    maxVh = 60; // Very small screens
  } else if (viewport.width < 768) {
    maxVh = 65; // Small screens
  } else if (viewport.isTablet) {
    maxVh = 80; // Tablets
  }
  
  const maxHeight = (viewport.height * maxVh) / 100;
  
  return calculateMenuDimensions(itemCount, {
    ...DEFAULT_MOBILE_MENU_CONFIG,
    heights: {
      mobile: { maxVh, reservedVh: 100 - maxVh - 10 },
      tablet: { maxVh: maxVh + 5, reservedVh: 100 - maxVh - 15 },
    },
  });
}
```

### CSS Custom Properties

Override default heights using CSS custom properties:

```css
/* Custom height overrides */
.mobile-menu-container {
  --menu-max-height: 500px;
  --menu-item-height: 48px;
}

/* Responsive overrides */
@media (max-width: 480px) {
  .mobile-menu-container {
    --menu-max-height: 300px;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .mobile-menu-container {
    --menu-max-height: 600px;
  }
}
```

## Touch Gesture Customization

### Touch Configuration

Customize touch behavior using the `TouchGestureConfig`:

```typescript
const customTouchConfig: Partial<TouchGestureConfig> = {
  // Momentum settings
  momentumEnabled: true,
  momentumDecay: 0.92,          // Slower momentum decay
  momentumThreshold: 0.3,       // Lower threshold for momentum
  
  // Touch sensitivity
  touchSensitivity: 1.2,        // More sensitive touch
  swipeThreshold: 20,           // Smaller swipe threshold
  
  // Bounce settings
  bounceEnabled: true,
  bounceDistance: 30,           // Smaller bounce
  bounceDecay: 0.9,            // Stronger bounce
  
  // Performance
  preventPageScroll: true,
  passiveListeners: true,
};

// Apply to hook
const { isActive } = useTouchGestures(
  mobileMenuRef,
  customTouchConfig,
  isMobileMenuOpen
);
```

### Device-Specific Optimization

```typescript
import { getOptimalTouchConfig } from '@/lib/touchGestureUtils';

// Get device-optimized config
const baseConfig = getOptimalTouchConfig();

// Customize further
const finalConfig = {
  ...baseConfig,
  touchSensitivity: baseConfig.touchSensitivity || 1.0 * 1.1, // 10% more sensitive
  momentumDecay: 0.94, // Custom momentum
};
```

## Scroll State Management

### Custom Scroll Indicators

```typescript
const { scrollState, setScrollContainer } = useScrollState({
  config: {
    showScrollbar: true,
    announceScrollState: true,
    scrollThreshold: 10,        // Larger threshold
    debounceMs: 150,           // Longer debounce
  },
  onScrollStateChange: (state) => {
    // Custom scroll state handling
    if (state.isAtTop) {
      console.log('Reached top');
    }
    if (state.isAtBottom) {
      console.log('Reached bottom');
    }
  },
});
```

### Custom Scroll Indicators CSS

```css
/* Custom scroll indicators */
.mobile-menu-scrollable.scrollable::before {
  height: 12px; /* Larger top indicator */
  background: linear-gradient(to bottom, 
    rgba(59, 130, 246, 0.1) 0%, 
    transparent 100%);
}

.mobile-menu-scrollable.scrollable::after {
  height: 12px; /* Larger bottom indicator */
  background: linear-gradient(to top, 
    rgba(59, 130, 246, 0.1) 0%, 
    transparent 100%);
}

/* Custom scrollbar */
.mobile-menu-scrollable::-webkit-scrollbar {
  width: 6px; /* Wider scrollbar */
}

.mobile-menu-scrollable::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.4); /* Blue scrollbar */
  border-radius: 3px;
}
```

## Accessibility Customization

### Screen Reader Announcements

```typescript
import { announceToScreenReader, screenReaderUtils } from '@/lib/accessibility';

// Custom announcements
const customScrollStateChange = (state: ScrollState) => {
  if (state.isScrollable) {
    const message = `Menu has ${state.scrollHeight}px of content in ${state.clientHeight}px container`;
    announceToScreenReader(message, 'polite');
  }
};

// Custom boundary announcements
const customBoundaryReached = (boundary: 'top' | 'bottom') => {
  const messages = {
    top: 'You have reached the beginning of the menu',
    bottom: 'You have reached the end of the menu',
  };
  announceToScreenReader(messages[boundary], 'assertive');
};
```

### Keyboard Navigation Customization

```typescript
const { currentIndex } = useMobileMenuKeyboard({
  isOpen: isMobileMenuOpen,
  onClose: closeMobileMenu,
  scrollContainer: mobileMenuRef.current,
  itemCount: navLinks.length,
  onNavigate: (direction) => {
    // Custom navigation handling
    console.log(`Navigated ${direction}`);
    
    // Custom scroll behavior
    if (direction === 'down') {
      // Scroll slightly ahead of focused item
      mobileMenuRef.current?.scrollBy(10, 'smooth');
    }
  },
});
```

## Performance Optimization

### Custom Performance Monitoring

```typescript
import { PerformanceMonitor } from '@/lib/performanceUtils';

const performanceMonitor = new PerformanceMonitor(
  {
    minFrameRate: 50,        // Lower threshold
    maxFrameTime: 20,        // Higher tolerance
    maxDroppedFrames: 8,     // More tolerance
  },
  (metrics) => {
    // Custom performance degradation handling
    console.warn('Performance issue:', metrics);
    
    // Disable animations if performance is poor
    if (metrics.frameRate < 30) {
      document.body.classList.add('disable-animations');
    }
  }
);
```

### Memory Management

```typescript
import { MemoryManager } from '@/lib/performanceUtils';

const memoryManager = new MemoryManager(60000); // 1 minute cleanup

// Add custom cleanup tasks
memoryManager.addCleanupTask(() => {
  // Clear custom caches
  customCache.clear();
});

// Force cleanup when needed
const handleLowMemory = () => {
  memoryManager.forceCleanup();
};
```

## Error Handling

### Custom Error Boundaries

```typescript
import { MobileMenuErrorBoundary } from '@/lib/performanceUtils';

const errorBoundary = new MobileMenuErrorBoundary(
  5, // Max retries
  (error, errorInfo) => {
    // Custom error handling
    console.error('Mobile menu error:', error);
    
    // Send to error reporting service
    errorReportingService.report(error, {
      component: 'mobile-menu',
      ...errorInfo,
    });
  }
);

// Wrap functions with error handling
const safeCalculateHeight = errorBoundary.wrapFunction(
  calculateMenuDimensions,
  'calculation',
  { maxHeight: 400, shouldScroll: true, itemHeight: 56, totalContentHeight: 400 }
);
```

## Testing Custom Configurations

### Unit Testing

```typescript
import { calculateMenuDimensions, DEFAULT_MOBILE_MENU_CONFIG } from '@/lib/mobileMenuUtils';

describe('Custom Menu Configuration', () => {
  it('should calculate correct dimensions with custom config', () => {
    const customConfig = {
      ...DEFAULT_MOBILE_MENU_CONFIG,
      heights: {
        mobile: { maxVh: 50, reservedVh: 40 },
        tablet: { maxVh: 60, reservedVh: 30 },
      },
    };
    
    const dimensions = calculateMenuDimensions(10, customConfig);
    
    expect(dimensions.maxHeight).toBeLessThan(500);
    expect(dimensions.shouldScroll).toBe(true);
  });
});
```

### Integration Testing

```typescript
import { render, screen } from '@testing-library/react';
import { Navbar } from '@/components/layout/Navbar';

describe('Custom Mobile Menu', () => {
  it('should apply custom configuration', () => {
    render(<Navbar />);
    
    const mobileMenu = screen.getByRole('navigation', { name: /mobile/i });
    const styles = window.getComputedStyle(mobileMenu);
    
    expect(styles.getPropertyValue('--menu-max-height')).toBeDefined();
  });
});
```

## Best Practices

### Configuration Management

1. **Use environment-specific configs**: Different configurations for development, staging, and production
2. **Validate configurations**: Ensure all values are within acceptable ranges
3. **Document changes**: Keep track of configuration changes and their impact
4. **Test thoroughly**: Test custom configurations across different devices and browsers

### Performance Considerations

1. **Monitor performance**: Use built-in performance monitoring
2. **Optimize for target devices**: Focus on devices your users actually use
3. **Progressive enhancement**: Ensure basic functionality works without JavaScript
4. **Lazy load features**: Load advanced features only when needed

### Accessibility Guidelines

1. **Test with screen readers**: Verify announcements work correctly
2. **Keyboard navigation**: Ensure all functionality is keyboard accessible
3. **Reduced motion**: Respect user motion preferences
4. **High contrast**: Test in high contrast mode