import { useCallback, useEffect, useRef } from 'react';
import { 
  announceToScreenReader, 
  screenReaderUtils, 
  motionPreferences,
  enhancedFocusManagement 
} from '@/lib/accessibility';

interface UseMobileMenuKeyboardOptions {
  isOpen: boolean;
  onClose: () => void;
  scrollContainer: HTMLElement | null;
  itemCount: number;
  onNavigate?: (direction: 'up' | 'down') => void;
}

interface KeyboardNavigationState {
  currentIndex: number;
  isScrollable: boolean;
}

export function useMobileMenuKeyboard({
  isOpen,
  onClose,
  scrollContainer,
  itemCount,
  onNavigate,
}: UseMobileMenuKeyboardOptions) {
  const navigationStateRef = useRef<KeyboardNavigationState>({
    currentIndex: -1,
    isScrollable: false,
  });

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!scrollContainer) return [];
    
    const elements = scrollContainer.querySelectorAll(
      'a[role="menuitem"], button[role="menuitem"], [tabindex="0"]'
    ) as NodeListOf<HTMLElement>;
    
    return Array.from(elements).filter(el => 
      !el.hasAttribute('disabled') && 
      el.offsetParent !== null // visible elements only
    );
  }, [scrollContainer]);

  const scrollToElement = useCallback((element: HTMLElement) => {
    if (!scrollContainer) return;

    // Use enhanced focus management with reduced motion support
    enhancedFocusManagement.scrollToFocusedElement(element, scrollContainer, {
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
      respectReducedMotion: true,
    });
  }, [scrollContainer]);

  const focusElement = useCallback((index: number) => {
    const elements = getFocusableElements();
    if (index >= 0 && index < elements.length) {
      const element = elements[index];
      element.focus();
      scrollToElement(element);
      navigationStateRef.current.currentIndex = index;
      
      // Enhanced screen reader announcement with scroll state
      const elementText = element.textContent || element.getAttribute('aria-label') || 'Menu item';
      const isScrollable = navigationStateRef.current.isScrollable;
      
      if (isScrollable && scrollContainer) {
        const canScrollUp = scrollContainer.scrollTop > 0;
        const canScrollDown = scrollContainer.scrollTop < (scrollContainer.scrollHeight - scrollContainer.clientHeight);
        
        screenReaderUtils.announceScrollState(
          isScrollable,
          canScrollUp,
          canScrollDown,
          elementText,
          index + 1,
          elements.length
        );
      } else {
        announceToScreenReader(
          `${elementText}, ${index + 1} of ${elements.length}`,
          'polite'
        );
      }
    }
  }, [getFocusableElements, scrollToElement, scrollContainer]);

  const handleArrowNavigation = useCallback((direction: 'up' | 'down') => {
    const elements = getFocusableElements();
    if (elements.length === 0) return;

    let newIndex = navigationStateRef.current.currentIndex;
    
    if (direction === 'down') {
      newIndex = newIndex < elements.length - 1 ? newIndex + 1 : 0; // wrap to first
    } else {
      newIndex = newIndex > 0 ? newIndex - 1 : elements.length - 1; // wrap to last
    }
    
    focusElement(newIndex);
    onNavigate?.(direction);
  }, [getFocusableElements, focusElement, onNavigate]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!isOpen) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        handleArrowNavigation('down');
        break;
        
      case 'ArrowUp':
        event.preventDefault();
        handleArrowNavigation('up');
        break;
        
      case 'Home':
        event.preventDefault();
        focusElement(0);
        break;
        
      case 'End':
        event.preventDefault();
        const elements = getFocusableElements();
        focusElement(elements.length - 1);
        break;
        
      case 'Escape':
        event.preventDefault();
        onClose();
        break;
        
      case 'Tab':
        // Allow normal tab behavior but update our tracking
        setTimeout(() => {
          const elements = getFocusableElements();
          const activeElement = document.activeElement as HTMLElement;
          const currentIndex = elements.indexOf(activeElement);
          if (currentIndex !== -1) {
            navigationStateRef.current.currentIndex = currentIndex;
          }
        }, 0);
        break;
    }
  }, [isOpen, handleArrowNavigation, focusElement, getFocusableElements, onClose]);

  // Set up keyboard event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      
      // Update scrollable state
      if (scrollContainer) {
        const isScrollable = scrollContainer.scrollHeight > scrollContainer.clientHeight;
        navigationStateRef.current.isScrollable = isScrollable;
        
        if (isScrollable) {
          announceToScreenReader(
            'Menu is scrollable. Use arrow keys to navigate and scroll.',
            'polite'
          );
        }
      }
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, handleKeyDown, scrollContainer]);

  // Reset navigation state when menu closes
  useEffect(() => {
    if (!isOpen) {
      navigationStateRef.current.currentIndex = -1;
      navigationStateRef.current.isScrollable = false;
    }
  }, [isOpen]);

  // Focus first element when menu opens
  useEffect(() => {
    if (isOpen && scrollContainer) {
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        focusElement(0);
      }, 100);
    }
  }, [isOpen, scrollContainer, focusElement]);

  return {
    currentIndex: navigationStateRef.current.currentIndex,
    isScrollable: navigationStateRef.current.isScrollable,
    focusElement,
    handleArrowNavigation,
  };
}