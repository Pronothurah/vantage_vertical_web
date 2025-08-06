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
    'aria-current': isActive ? 'page' : undefined,
    'aria-describedby': describedBy || undefined,
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
};

// Skip links for keyboard navigation
export const skipLinks = [
  { href: '#main-content', text: 'Skip to main content' },
  { href: '#navigation', text: 'Skip to navigation' },
  { href: '#footer', text: 'Skip to footer' },
];

// Screen reader only class
export const srOnly = 'sr-only';

// Export trapFocus from focusManagement
export const trapFocus = focusManagement.trapFocus;