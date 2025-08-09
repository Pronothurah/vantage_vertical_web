import { renderHook, act } from '@testing-library/react';
import { useMobileMenuKeyboard } from '@/lib/hooks/useMobileMenuKeyboard';

// Mock the accessibility module
jest.mock('@/lib/accessibility', () => ({
  announceToScreenReader: jest.fn(),
}));

describe('useMobileMenuKeyboard', () => {
  let mockContainer: HTMLDivElement;
  let mockElements: HTMLAnchorElement[];
  let mockOnClose: jest.Mock;
  let mockOnNavigate: jest.Mock;

  beforeEach(() => {
    // Create mock DOM elements
    mockContainer = document.createElement('div');
    mockElements = [];
    
    // Create mock menu items
    for (let i = 0; i < 3; i++) {
      const element = document.createElement('a');
      element.setAttribute('role', 'menuitem');
      element.setAttribute('tabindex', '0');
      element.textContent = `Menu Item ${i + 1}`;
      element.focus = jest.fn();
      element.scrollIntoView = jest.fn();
      
      // Mock offsetParent to make element visible
      Object.defineProperty(element, 'offsetParent', {
        get: () => mockContainer,
        configurable: true,
      });
      
      mockElements.push(element);
      mockContainer.appendChild(element);
    }

    // Mock getBoundingClientRect
    mockContainer.getBoundingClientRect = jest.fn(() => ({
      top: 0,
      bottom: 100,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
    }));

    mockElements.forEach(el => {
      el.getBoundingClientRect = jest.fn(() => ({
        top: 10,
        bottom: 30,
        left: 0,
        right: 100,
        width: 100,
        height: 20,
      }));
    });

    mockOnClose = jest.fn();
    mockOnNavigate = jest.fn();

    // Mock document.activeElement
    Object.defineProperty(document, 'activeElement', {
      writable: true,
      value: mockElements[0],
    });

    // Add container to document body for proper DOM queries
    document.body.appendChild(mockContainer);
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clean up DOM
    if (mockContainer && document.body.contains(mockContainer)) {
      document.body.removeChild(mockContainer);
    }
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() =>
      useMobileMenuKeyboard({
        isOpen: false,
        onClose: mockOnClose,
        scrollContainer: null,
        itemCount: 3,
        onNavigate: mockOnNavigate,
      })
    );

    expect(result.current.currentIndex).toBe(-1);
    expect(result.current.isScrollable).toBe(false);
  });

  it('should focus first element when menu opens', () => {
    jest.useFakeTimers();
    
    const { rerender } = renderHook(
      ({ isOpen }) =>
        useMobileMenuKeyboard({
          isOpen,
          onClose: mockOnClose,
          scrollContainer: isOpen ? mockContainer : null,
          itemCount: 3,
          onNavigate: mockOnNavigate,
        }),
      { initialProps: { isOpen: false } }
    );

    rerender({ isOpen: true });

    act(() => {
      jest.advanceTimersByTime(100);
    });

    expect(mockElements[0].focus).toHaveBeenCalled();
    
    jest.useRealTimers();
  });

  it('should handle arrow down navigation', () => {
    const { result } = renderHook(() =>
      useMobileMenuKeyboard({
        isOpen: true,
        onClose: mockOnClose,
        scrollContainer: mockContainer,
        itemCount: 3,
        onNavigate: mockOnNavigate,
      })
    );

    // Simulate arrow down key press
    const keydownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    keydownEvent.preventDefault = jest.fn();

    act(() => {
      document.dispatchEvent(keydownEvent);
    });

    expect(keydownEvent.preventDefault).toHaveBeenCalled();
    expect(mockOnNavigate).toHaveBeenCalledWith('down');
  });

  it('should handle arrow up navigation', () => {
    const { result } = renderHook(() =>
      useMobileMenuKeyboard({
        isOpen: true,
        onClose: mockOnClose,
        scrollContainer: mockContainer,
        itemCount: 3,
        onNavigate: mockOnNavigate,
      })
    );

    // Simulate arrow up key press
    const keydownEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    keydownEvent.preventDefault = jest.fn();

    act(() => {
      document.dispatchEvent(keydownEvent);
    });

    expect(keydownEvent.preventDefault).toHaveBeenCalled();
    expect(mockOnNavigate).toHaveBeenCalledWith('up');
  });

  it('should handle Home key to focus first element', () => {
    const { result } = renderHook(() =>
      useMobileMenuKeyboard({
        isOpen: true,
        onClose: mockOnClose,
        scrollContainer: mockContainer,
        itemCount: 3,
        onNavigate: mockOnNavigate,
      })
    );

    // Simulate Home key press
    const keydownEvent = new KeyboardEvent('keydown', { key: 'Home' });
    keydownEvent.preventDefault = jest.fn();

    act(() => {
      document.dispatchEvent(keydownEvent);
    });

    expect(keydownEvent.preventDefault).toHaveBeenCalled();
    expect(mockElements[0].focus).toHaveBeenCalled();
  });

  it('should handle End key to focus last element', () => {
    const { result } = renderHook(() =>
      useMobileMenuKeyboard({
        isOpen: true,
        onClose: mockOnClose,
        scrollContainer: mockContainer,
        itemCount: 3,
        onNavigate: mockOnNavigate,
      })
    );

    // Simulate End key press
    const keydownEvent = new KeyboardEvent('keydown', { key: 'End' });
    keydownEvent.preventDefault = jest.fn();

    act(() => {
      document.dispatchEvent(keydownEvent);
    });

    expect(keydownEvent.preventDefault).toHaveBeenCalled();
    expect(mockElements[2].focus).toHaveBeenCalled();
  });

  it('should handle Escape key to close menu', () => {
    const { result } = renderHook(() =>
      useMobileMenuKeyboard({
        isOpen: true,
        onClose: mockOnClose,
        scrollContainer: mockContainer,
        itemCount: 3,
        onNavigate: mockOnNavigate,
      })
    );

    // Simulate Escape key press
    const keydownEvent = new KeyboardEvent('keydown', { key: 'Escape' });
    keydownEvent.preventDefault = jest.fn();

    act(() => {
      document.dispatchEvent(keydownEvent);
    });

    expect(keydownEvent.preventDefault).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not handle keyboard events when menu is closed', () => {
    const { result } = renderHook(() =>
      useMobileMenuKeyboard({
        isOpen: false,
        onClose: mockOnClose,
        scrollContainer: mockContainer,
        itemCount: 3,
        onNavigate: mockOnNavigate,
      })
    );

    // Simulate arrow down key press
    const keydownEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });
    keydownEvent.preventDefault = jest.fn();

    act(() => {
      document.dispatchEvent(keydownEvent);
    });

    expect(keydownEvent.preventDefault).not.toHaveBeenCalled();
    expect(mockOnNavigate).not.toHaveBeenCalled();
  });

  it('should scroll element into view when needed', () => {
    // Mock element being out of view
    mockElements[1].getBoundingClientRect = jest.fn(() => ({
      top: 150, // Below container view
      bottom: 170,
      left: 0,
      right: 100,
      width: 100,
      height: 20,
    }));

    const { result } = renderHook(() =>
      useMobileMenuKeyboard({
        isOpen: true,
        onClose: mockOnClose,
        scrollContainer: mockContainer,
        itemCount: 3,
        onNavigate: mockOnNavigate,
      })
    );

    act(() => {
      result.current.focusElement(1);
    });

    expect(mockElements[1].focus).toHaveBeenCalled();
    expect(mockElements[1].scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest'
    });
  });

  it('should wrap navigation at boundaries', () => {
    const { result } = renderHook(() =>
      useMobileMenuKeyboard({
        isOpen: true,
        onClose: mockOnClose,
        scrollContainer: mockContainer,
        itemCount: 3,
        onNavigate: mockOnNavigate,
      })
    );

    // Test wrapping from last to first with down arrow
    act(() => {
      result.current.focusElement(2); // Focus last element
    });

    act(() => {
      result.current.handleArrowNavigation('down');
    });

    expect(mockElements[0].focus).toHaveBeenCalled(); // Should wrap to first

    // Test wrapping from first to last with up arrow
    act(() => {
      result.current.focusElement(0); // Focus first element
    });

    act(() => {
      result.current.handleArrowNavigation('up');
    });

    expect(mockElements[2].focus).toHaveBeenCalled(); // Should wrap to last
  });
});