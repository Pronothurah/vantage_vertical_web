// Accessibility utilities and helpers

export const ariaAttributes = {
  button: (pressed?: boolean, expanded?: boolean) => ({
    'aria-pressed': pressed !== undefined ? pressed : undefined,
    'aria-expanded': expanded !== undefined ? expanded : undefined,
  }),
  
  textbox: (invalid?: boolean, required?: boolean, describedBy?: string) => ({
    'aria-invalid': invalid || undefined,
    'aria-required': required || undefined,
    'aria-describedby': describedBy || undefined,
  }),
  
  form: (labelledBy?: string, describedBy?: string, invalid?: boolean) => ({
    'aria-labelledby': labelledBy || undefined,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': invalid || undefined,
  }),
  
  link: (isActive?: boolean, describedBy?: string) => ({
    'aria-current': isActive ? ('page' as const) : undefined,
    'aria-describedby': describedBy || undefined,
  }),

  scrollableContainer: (
    isScrollable: boolean,
    canScrollUp: boolean,
    canScrollDown: boolean,
    scrollPercentage: number,
    itemCount?: number,
    currentPosition?: number
  ) => ({
    'aria-live': 'polite' as const,
    'aria-atomic': 'false' as const,
    'aria-relevant': 'additions text' as const,
    'aria-describedby': isScrollable ? 'scroll-instructions' : undefined,
    'data-scrollable': isScrollable.toString(),
    'data-can-scroll-up': canScrollUp.toString(),
    'data-can-scroll-down': canScrollDown.toString(),
    'data-scroll-percentage': Math.round(scrollPercentage).toString(),
    ...(itemCount && { 'aria-setsize': itemCount.toString() }),
    ...(currentPosition && { 'aria-posinset': currentPosition.toString() }),
  }),

  scrollableItem: (
    position: number,
    total: number,
    isVisible: boolean,
    isFocused: boolean
  ) => ({
    'aria-setsize': total.toString(),
    'aria-posinset': position.toString(),
    'aria-hidden': !isVisible ? 'true' : undefined,
    'data-visible': isVisible.toString(),
    'data-focused': isFocused.toString(),
  }),
};

export const keyboardHandlers = {
  button: (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  },
  
  onEnterOrSpace: (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  },
};

export function generateId(prefix: string = 'id'): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

export const focusManagement = {
  trapFocus: (element: HTMLElement) => {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },
  
  restoreFocus: (previousElement: HTMLElement | null) => {
    if (previousElement && typeof previousElement.focus === 'function') {
      previousElement.focus();
    }
  },
};

export const screenReaderUtils = {
  hideFromScreenReader: (element: HTMLElement) => {
    element.setAttribute('aria-hidden', 'true');
  },
  
  showToScreenReader: (element: HTMLElement) => {
    element.removeAttribute('aria-hidden');
  },
  
  setScreenReaderText: (element: HTMLElement, text: string) => {
    element.setAttribute('aria-label', text);
  },

  announceScrollState: (
    isScrollable: boolean,
    canScrollUp: boolean,
    canScrollDown: boolean,
    currentItem?: string,
    position?: number,
    total?: number
  ) => {
    if (!isScrollable) return;

    let message = '';
    
    if (currentItem && position && total) {
      message = `${currentItem}, ${position} of ${total}`;
    }
    
    if (canScrollUp && canScrollDown) {
      message += message ? '. ' : '';
      message += 'Scroll up or down for more items';
    } else if (canScrollDown) {
      message += message ? '. ' : '';
      message += 'Scroll down for more items';
    } else if (canScrollUp) {
      message += message ? '. ' : '';
      message += 'Scroll up for more items';
    }

    if (message) {
      announceToScreenReader(message, 'polite');
    }
  },

  announceScrollBoundary: (boundary: 'top' | 'bottom', itemName?: string) => {
    const messages = {
      top: itemName ? `Reached top of menu at ${itemName}` : 'Reached top of menu',
      bottom: itemName ? `Reached bottom of menu at ${itemName}` : 'Reached bottom of menu',
    };
    
    announceToScreenReader(messages[boundary], 'polite');
  },

  createScrollInstructions: (containerId: string): HTMLElement => {
    const instructions = document.createElement('div');
    instructions.id = 'scroll-instructions';
    instructions.className = 'sr-only';
    instructions.textContent = 'Use arrow keys to navigate menu items. Home and End keys jump to first and last items.';
    
    // Find container and append instructions
    const container = document.getElementById(containerId);
    if (container) {
      container.appendChild(instructions);
    } else {
      document.body.appendChild(instructions);
    }
    
    return instructions;
  },

  removeScrollInstructions: () => {
    const instructions = document.getElementById('scroll-instructions');
    if (instructions) {
      instructions.remove();
    }
  },
};

// Skip links for keyboard navigation
export const skipLinks = [
  { href: '#main-content', text: 'Skip to main content' },
  { href: '#navigation', text: 'Skip to navigation' },
  { href: '#footer', text: 'Skip to footer' },
];

// Reduced motion preferences utilities
export const motionPreferences = {
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  getScrollBehavior: (): ScrollBehavior => {
    return motionPreferences.prefersReducedMotion() ? 'auto' : 'smooth';
  },

  getAnimationDuration: (defaultDuration: number): number => {
    return motionPreferences.prefersReducedMotion() ? 0 : defaultDuration;
  },

  respectMotionPreference: <T extends Record<string, any>>(
    normalConfig: T,
    reducedConfig: Partial<T>
  ): T => {
    return motionPreferences.prefersReducedMotion() 
      ? { ...normalConfig, ...reducedConfig }
      : normalConfig;
  },

  addMotionListener: (callback: (prefersReduced: boolean) => void): (() => void) => {
    if (typeof window === 'undefined') return () => {};
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e: MediaQueryListEvent) => callback(e.matches);
    
    mediaQuery.addEventListener('change', handler);
    
    return () => mediaQuery.removeEventListener('change', handler);
  },
};

// Enhanced focus management with scroll support
export const enhancedFocusManagement = {
  ...focusManagement,

  scrollToFocusedElement: (
    element: HTMLElement,
    container: HTMLElement,
    options: {
      behavior?: ScrollBehavior;
      block?: ScrollLogicalPosition;
      inline?: ScrollLogicalPosition;
      respectReducedMotion?: boolean;
    } = {}
  ) => {
    const {
      behavior = 'smooth',
      block = 'nearest',
      inline = 'nearest',
      respectReducedMotion = true,
    } = options;

    const finalBehavior = respectReducedMotion 
      ? motionPreferences.getScrollBehavior()
      : behavior;

    // Check if element is within container bounds
    const containerRect = container.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    const isVisible = (
      elementRect.top >= containerRect.top &&
      elementRect.bottom <= containerRect.bottom &&
      elementRect.left >= containerRect.left &&
      elementRect.right <= containerRect.right
    );

    if (!isVisible) {
      element.scrollIntoView({
        behavior: finalBehavior,
        block,
        inline,
      });

      // Announce scroll action for screen readers
      const elementText = element.textContent || element.getAttribute('aria-label') || 'item';
      announceToScreenReader(`Scrolled to ${elementText}`, 'polite');
    }
  },

  manageFocusWithScroll: (
    container: HTMLElement,
    options: {
      respectReducedMotion?: boolean;
      announcePosition?: boolean;
    } = {}
  ) => {
    const { respectReducedMotion = true, announcePosition = true } = options;
    
    const handleFocusChange = (event: FocusEvent) => {
      const target = event.target as HTMLElement;
      if (!target || !container.contains(target)) return;

      // Scroll to focused element if needed
      enhancedFocusManagement.scrollToFocusedElement(target, container, {
        respectReducedMotion,
      });

      // Announce position if requested
      if (announcePosition) {
        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const currentIndex = Array.from(focusableElements).indexOf(target);
        
        if (currentIndex !== -1) {
          const elementText = target.textContent || target.getAttribute('aria-label') || 'item';
          screenReaderUtils.announceScrollState(
            true,
            true,
            true,
            elementText,
            currentIndex + 1,
            focusableElements.length
          );
        }
      }
    };

    container.addEventListener('focusin', handleFocusChange);
    
    return () => {
      container.removeEventListener('focusin', handleFocusChange);
    };
  },
};

// Screen reader only class
export const srOnly = 'sr-only';

// Export trapFocus from focusManagement
export const trapFocus = focusManagement.trapFocus;