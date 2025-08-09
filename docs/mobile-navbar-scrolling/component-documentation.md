# Component Documentation

## Navbar Component

The main navigation component that includes the mobile menu with scrolling functionality.

### Props

The Navbar component doesn't accept props as it's a self-contained navigation solution.

### Features

- Responsive design with mobile/tablet breakpoints
- Automatic height calculation based on viewport
- Smooth scrolling with momentum
- Touch gesture support
- Keyboard navigation
- Screen reader accessibility
- Performance monitoring

### Usage

```tsx
import { Navbar } from '@/components/layout';

export default function Layout() {
  return (
    <header id="navigation">
      <Navbar />
    </header>
  );
}
```

## React Hooks

### useMobileMenuDimensions

Manages responsive menu dimensions with automatic resize handling.

#### Parameters

```typescript
interface UseMobileMenuDimensionsOptions {
  itemCount: number;           // Number of menu items
  config?: MobileMenuConfig;   // Optional configuration
  enabled?: boolean;           // Enable/disable hook
}
```

#### Returns

```typescript
interface UseMobileMenuDimensionsReturn {
  dimensions: MenuDimensions;     // Calculated dimensions
  cssProperties: Record<string, string>; // CSS custom properties
  isScrollable: boolean;          // Whether scrolling is needed
  maxHeight: number;              // Maximum menu height
  itemHeight: number;             // Height per menu item
}
```

#### Example

```tsx
const { cssProperties, isScrollable } = useMobileMenuDimensions({
  itemCount: navLinks.length,
  enabled: isMobileMenuOpen,
});
```

### useScrollState

Tracks scroll state and provides scroll indicators.

#### Parameters

```typescript
interface UseScrollStateOptions {
  config?: Partial<ScrollIndicatorConfig>;
  onScrollStateChange?: (state: ScrollState) => void;
}
```

#### Returns

```typescript
interface UseScrollStateReturn {
  scrollState: ScrollState;
  setScrollContainer: (element: HTMLElement | null) => void;
  updateScrollState: () => void;
  scrollTo: (position: number, behavior?: ScrollBehavior) => void;
  scrollToTop: (behavior?: ScrollBehavior) => void;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  scrollBy: (amount: number, behavior?: ScrollBehavior) => void;
}
```

#### Example

```tsx
const { scrollState, setScrollContainer } = useScrollState({
  config: {
    announceScrollState: true,
    scrollThreshold: 5,
  },
});

useEffect(() => {
  if (mobileMenuRef.current) {
    setScrollContainer(mobileMenuRef.current);
  }
}, [setScrollContainer]);
```

### useMobileMenuKeyboard

Enhanced keyboard navigation for scrollable menu.

#### Parameters

```typescript
interface UseMobileMenuKeyboardOptions {
  isOpen: boolean;                    // Menu open state
  onClose: () => void;               // Close callback
  scrollContainer: HTMLElement | null; // Scrollable container
  itemCount: number;                 // Number of menu items
  onNavigate?: (direction: 'up' | 'down') => void; // Navigation callback
}
```

#### Returns

```typescript
interface KeyboardNavigationReturn {
  currentIndex: number;      // Currently focused item index
  isScrollable: boolean;     // Whether container is scrollable
  focusElement: (index: number) => void;
  handleArrowNavigation: (direction: 'up' | 'down') => void;
}
```

#### Example

```tsx
const { currentIndex } = useMobileMenuKeyboard({
  isOpen: isMobileMenuOpen,
  onClose: closeMobileMenu,
  scrollContainer: mobileMenuRef.current,
  itemCount: navLinks.length,
});
```

### useTouchGestures

Touch gesture support for mobile menu scrolling.

#### Parameters

```typescript
interface TouchGestureConfig {
  momentumEnabled: boolean;
  momentumDecay: number;
  touchSensitivity: number;
  preventPageScroll: boolean;
  // ... other config options
}
```

#### Returns

```typescript
interface TouchGestureReturn {
  getTouchState: () => TouchState | null;
  getMomentumState: () => MomentumState | null;
  isActive: () => boolean;
}
```

#### Example

```tsx
const { isActive: isTouchActive } = useTouchGestures(
  mobileMenuRef,
  {
    preventPageScroll: true,
    momentumEnabled: true,
  },
  isMobileMenuOpen
);
```

## Utility Functions

### calculateMenuDimensions

Calculates optimal menu dimensions based on viewport and content.

```typescript
function calculateMenuDimensions(
  itemCount: number,
  config?: MobileMenuConfig
): MenuDimensions
```

### getViewportDimensions

Detects current viewport dimensions and device type.

```typescript
function getViewportDimensions(): ViewportDimensions
```

### getOptimalTouchConfig

Returns optimal touch configuration based on device.

```typescript
function getOptimalTouchConfig(): Partial<TouchGestureConfig>
```

## CSS Classes

### Container Classes

- `.mobile-menu-container`: Outer container with backdrop effects
- `.mobile-menu-scrollable`: Inner scrollable container
- `.mobile-menu-content`: Content wrapper with padding

### State Classes

- `.scrollable`: Applied when content is scrollable
- `.can-scroll-up`: Applied when can scroll up
- `.can-scroll-down`: Applied when can scroll down

### Performance Classes

- `.gpu-accelerated`: Enables hardware acceleration
- `.smooth-scroll`: Enables smooth scrolling
- `.touch-optimized`: Optimizes for touch interactions
- `.no-select`: Prevents text selection

## CSS Custom Properties

The component uses CSS custom properties for dynamic styling:

```css
:root {
  --menu-max-height: 400px;      /* Maximum menu height */
  --menu-item-height: 56px;      /* Height per menu item */
  --menu-total-height: 480px;    /* Total content height */
  --menu-scrollable: 1;          /* Whether scrolling is enabled */
  --scroll-percentage: 25%;      /* Current scroll percentage */
}
```

## Accessibility Features

### ARIA Attributes

- `aria-live="polite"`: Announces scroll state changes
- `aria-describedby`: Links to scroll instructions
- `aria-setsize` / `aria-posinset`: Indicates item position
- `role="menu"` / `role="menuitem"`: Proper menu semantics

### Screen Reader Support

- Automatic announcements for scroll state changes
- Position announcements during keyboard navigation
- Boundary detection announcements
- Scroll instructions for keyboard users

### Keyboard Navigation

- Arrow keys: Navigate between items
- Home/End: Jump to first/last item
- Tab: Standard tab navigation
- Escape: Close menu
- Automatic scrolling to keep focused items visible

## Performance Features

### Hardware Acceleration

- GPU-accelerated transforms and animations
- Optimized CSS properties for smooth rendering
- Efficient scroll event handling

### Memory Management

- Automatic cleanup of event listeners
- Debounced resize calculations
- Performance monitoring and degradation detection

### Error Handling

- Error boundaries for calculation failures
- Fallback values for edge cases
- Retry mechanisms for transient errors