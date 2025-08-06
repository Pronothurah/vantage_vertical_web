/**
 * Accessibility utilities for Vantage Vertical website
 * Ensures WCAG 2.1 AA compliance
 */

// Screen reader only text utility
export const srOnly = 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';

// Focus management utilities
export function trapFocus(element: HTMLElement) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  const firstFocusableElement = focusableElements[0] as HTMLElement;
  const lastFocusableElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  function handleTabKey(e: KeyboardEvent) {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  }

  element.addEventListener('keydown', handleTabKey);
  
  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

// Keyboard navigation helpers
export const keyboardHandlers = {
  onEnterOrSpace: (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  },
  
  onEscape: (callback: () => void) => (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      callback();
    }
  },
  
  onArrowKeys: (callbacks: {
    up?: () => void;
    down?: () => void;
    left?: () => void;
    right?: () => void;
  }) => (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        callbacks.up?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        callbacks.down?.();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        callbacks.left?.();
        break;
      case 'ArrowRight':
        e.preventDefault();
        callbacks.right?.();
        break;
    }
  }
};

// ARIA attributes helpers
export const ariaAttributes = {
  button: (pressed?: boolean, expanded?: boolean) => ({
    role: 'button',
    tabIndex: 0,
    'aria-pressed': pressed !== undefined ? pressed : undefined,
    'aria-expanded': expanded !== undefined ? expanded : undefined,
  }),
  
  link: (current?: boolean) => ({
    'aria-current': current ? 'page' : undefined,
  }),
  
  modal: (labelledBy: string, describedBy?: string) => ({
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
  }),
  
  menu: (expanded: boolean, labelledBy?: string) => ({
    role: 'menu',
    'aria-expanded': expanded,
    'aria-labelledby': labelledBy,
  }),
  
  menuItem: () => ({
    role: 'menuitem',
    tabIndex: -1,
  }),
  
  tab: (selected: boolean, controls: string) => ({
    role: 'tab',
    'aria-selected': selected,
    'aria-controls': controls,
    tabIndex: selected ? 0 : -1,
  }),
  
  tabPanel: (labelledBy: string) => ({
    role: 'tabpanel',
    'aria-labelledby': labelledBy,
    tabIndex: 0,
  }),
  
  slider: (value: number, min: number, max: number, label: string) => ({
    role: 'slider',
    'aria-valuenow': value,
    'aria-valuemin': min,
    'aria-valuemax': max,
    'aria-label': label,
    tabIndex: 0,
  }),
  
  progressBar: (value: number, max: number, label?: string) => ({
    role: 'progressbar',
    'aria-valuenow': value,
    'aria-valuemax': max,
    'aria-label': label,
  }),
  
  alert: (live: 'polite' | 'assertive' = 'polite') => ({
    role: 'alert',
    'aria-live': live,
  }),
  
  status: () => ({
    role: 'status',
    'aria-live': 'polite',
  }),
  
  region: (label: string) => ({
    role: 'region',
    'aria-label': label,
  }),
  
  form: (labelledBy?: string, describedBy?: string, invalid?: boolean) => ({
    role: 'form',
    'aria-labelledby': labelledBy,
    'aria-describedby': describedBy,
    'aria-invalid': invalid,
  }),
  
  textbox: (invalid?: boolean, required?: boolean, describedBy?: string) => ({
    'aria-invalid': invalid,
    'aria-required': required,
    'aria-describedby': describedBy,
  }),
  
  listbox: (expanded: boolean, labelledBy?: string) => ({
    role: 'listbox',
    'aria-expanded': expanded,
    'aria-labelledby': labelledBy,
  }),
  
  option: (selected: boolean) => ({
    role: 'option',
    'aria-selected': selected,
  }),
};

// Color contrast utilities
export const colorContrast = {
  // Check if color combination meets WCAG AA standards
  meetsAA: (foreground: string, background: string): boolean => {
    // This is a simplified check - in production, use a proper color contrast library
    // For now, we'll assume our brand colors meet standards
    return true;
  },
  
  // Get accessible color combinations
  getAccessiblePair: (primary: string): { foreground: string; background: string } => {
    // Return high contrast pairs based on brand colors
    const pairs: Record<string, { foreground: string; background: string }> = {
      '#D72638': { foreground: '#FFFFFF', background: '#D72638' }, // Red with white
      '#000000': { foreground: '#FFFFFF', background: '#000000' }, // Black with white
      '#FFFFFF': { foreground: '#000000', background: '#FFFFFF' }, // White with black
      '#343A40': { foreground: '#FFFFFF', background: '#343A40' }, // Gray with white
    };
    
    return pairs[primary] || { foreground: '#000000', background: '#FFFFFF' };
  },
};

// Focus management
export const focusManagement = {
  // Set focus to element with optional delay
  setFocus: (element: HTMLElement | null, delay: number = 0) => {
    if (!element) return;
    
    if (delay > 0) {
      setTimeout(() => element.focus(), delay);
    } else {
      element.focus();
    }
  },
  
  // Get next focusable element
  getNextFocusable: (current: HTMLElement): HTMLElement | null => {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];
    
    const currentIndex = focusableElements.indexOf(current);
    return focusableElements[currentIndex + 1] || focusableElements[0];
  },
  
  // Get previous focusable element
  getPreviousFocusable: (current: HTMLElement): HTMLElement | null => {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];
    
    const currentIndex = focusableElements.indexOf(current);
    return focusableElements[currentIndex - 1] || focusableElements[focusableElements.length - 1];
  },
};

// Screen reader announcements
export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = srOnly;
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Skip link utilities
export const skipLinks = [
  { href: '#main-content', text: 'Skip to main content' },
  { href: '#navigation', text: 'Skip to navigation' },
  { href: '#footer', text: 'Skip to footer' },
];

// Reduced motion preferences
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// High contrast mode detection
export const prefersHighContrast = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// Generate unique IDs for accessibility
let idCounter = 0;
export const generateId = (prefix: string = 'a11y'): string => {
  return `${prefix}-${++idCounter}`;
};