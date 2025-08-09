/**
 * Integration tests for mobile menu touch gesture support
 * 
 * Tests the integration of touch gesture utilities with the mobile navigation menu,
 * ensuring smooth touch interactions and momentum scrolling work correctly.
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import Navbar from '@/components/layout/Navbar';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock Image component
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />;
  };
});

// Mock touch gesture utilities
jest.mock('@/lib/touchGestureUtils', () => ({
  useTouchGestures: jest.fn(),
  isTouchDevice: jest.fn(),
  getOptimalTouchConfig: jest.fn(),
}));

const mockUseTouchGestures = jest.mocked(require('@/lib/touchGestureUtils').useTouchGestures);
const mockIsTouchDevice = jest.mocked(require('@/lib/touchGestureUtils').isTouchDevice);
const mockGetOptimalTouchConfig = jest.mocked(require('@/lib/touchGestureUtils').getOptimalTouchConfig);

// Mock accessibility utilities
jest.mock('@/lib/accessibility', () => ({
  ariaAttributes: {
    link: jest.fn(() => ({})),
    button: jest.fn(() => ({})),
  },
  keyboardHandlers: {
    onEnterOrSpace: jest.fn(() => jest.fn()),
  },
  trapFocus: jest.fn(() => jest.fn()),
  announceToScreenReader: jest.fn(),
}));

// Mock mobile menu hooks
jest.mock('@/lib/hooks/useMobileMenuDimensions', () => ({
  useMobileMenuDimensions: () => ({
    cssProperties: { '--menu-max-height': '400px' },
    isScrollable: true,
  }),
}));

jest.mock('@/lib/hooks/useScrollState', () => ({
  useScrollState: () => ({
    scrollState: {
      isScrollable: true,
      canScrollUp: false,
      canScrollDown: true,
      scrollTop: 0,
      scrollHeight: 800,
      clientHeight: 400,
      scrollPercentage: 0,
      isAtTop: true,
      isAtBottom: false,
    },
    setScrollContainer: jest.fn(),
    updateScrollState: jest.fn(),
  }),
  useScrollIndicators: () => ({
    getScrollIndicatorClasses: () => 'mobile-menu-scrollable scrollable can-scroll-down',
    getScrollIndicatorStyles: () => ({ '--scroll-percentage': '0%' }),
  }),
}));

jest.mock('@/lib/hooks/useMobileMenuKeyboard', () => ({
  useMobileMenuKeyboard: () => ({
    currentIndex: -1,
    isScrollable: true,
  }),
}));

describe('Mobile Menu Touch Gestures Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementations
    mockIsTouchDevice.mockReturnValue(true);
    mockGetOptimalTouchConfig.mockReturnValue({
      momentumEnabled: true,
      touchSensitivity: 1.0,
      preventPageScroll: true,
    });
    mockUseTouchGestures.mockReturnValue({
      getTouchState: () => ({ isActive: false, velocity: 0 }),
      getMomentumState: () => ({ isActive: false }),
      isActive: () => false,
    });
  });

  it('should initialize touch gestures when mobile menu is opened on touch device', async () => {
    render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText(/open mobile menu/i);
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(mockUseTouchGestures).toHaveBeenCalledWith(
        expect.any(Object), // ref object
        expect.objectContaining({
          preventPageScroll: true,
          momentumEnabled: true,
          bounceEnabled: false,
          touchSensitivity: 1.2,
        }),
        true // enabled when menu is open and touch device
      );
    });
  });

  it('should not initialize touch gestures on non-touch devices', async () => {
    mockIsTouchDevice.mockReturnValue(false);
    
    render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText(/open mobile menu/i);
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(mockUseTouchGestures).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        false // disabled on non-touch devices
      );
    });
  });

  it('should disable touch gestures when mobile menu is closed', async () => {
    render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText(/open mobile menu/i);
    fireEvent.click(menuButton);
    
    // Close mobile menu
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      // Should be called at least twice - once for open (enabled), once for close (disabled)
      expect(mockUseTouchGestures).toHaveBeenCalledWith(
        expect.any(Object),
        expect.any(Object),
        false // disabled when menu is closed
      );
    });
  });

  it('should use optimal touch configuration for the device', async () => {
    const mockOptimalConfig = {
      momentumDecay: 0.92,
      bounceEnabled: true,
      touchActionNone: false,
    };
    mockGetOptimalTouchConfig.mockReturnValue(mockOptimalConfig);
    
    render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText(/open mobile menu/i);
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(mockGetOptimalTouchConfig).toHaveBeenCalled();
      expect(mockUseTouchGestures).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          ...mockOptimalConfig,
          preventPageScroll: true,
          momentumEnabled: true,
          bounceEnabled: false, // Overridden for menu
          touchSensitivity: 1.2,
        }),
        true
      );
    });
  });

  it('should handle touch events on mobile menu container', async () => {
    render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText(/open mobile menu/i);
    fireEvent.click(menuButton);
    
    // Find the mobile menu container
    const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
    const scrollableContainer = mobileMenu.querySelector('.mobile-menu-scrollable');
    
    expect(scrollableContainer).toBeInTheDocument();
    expect(scrollableContainer).toHaveClass('mobile-menu-scrollable');
    expect(scrollableContainer).toHaveClass('scrollable');
  });

  it('should apply correct CSS classes for touch optimization', async () => {
    render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText(/open mobile menu/i);
    fireEvent.click(menuButton);
    
    const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
    const scrollableContainer = mobileMenu.querySelector('.mobile-menu-scrollable');
    
    expect(scrollableContainer).toHaveClass('mobile-menu-scrollable');
    expect(scrollableContainer).toHaveClass('scrollable');
    expect(scrollableContainer).toHaveClass('can-scroll-down');
  });

  it('should handle touch start events without errors', async () => {
    render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText(/open mobile menu/i);
    fireEvent.click(menuButton);
    
    const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
    const scrollableContainer = mobileMenu.querySelector('.mobile-menu-scrollable');
    
    // Simulate touch start
    expect(() => {
      fireEvent.touchStart(scrollableContainer!, {
        touches: [{ clientY: 100 }],
      });
    }).not.toThrow();
  });

  it('should handle touch move events without errors', async () => {
    render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText(/open mobile menu/i);
    fireEvent.click(menuButton);
    
    const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
    const scrollableContainer = mobileMenu.querySelector('.mobile-menu-scrollable');
    
    // Simulate touch sequence
    expect(() => {
      fireEvent.touchStart(scrollableContainer!, {
        touches: [{ clientY: 100 }],
      });
      fireEvent.touchMove(scrollableContainer!, {
        touches: [{ clientY: 150 }],
      });
    }).not.toThrow();
  });

  it('should handle touch end events without errors', async () => {
    render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText(/open mobile menu/i);
    fireEvent.click(menuButton);
    
    const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
    const scrollableContainer = mobileMenu.querySelector('.mobile-menu-scrollable');
    
    // Simulate complete touch sequence
    expect(() => {
      fireEvent.touchStart(scrollableContainer!, {
        touches: [{ clientY: 100 }],
      });
      fireEvent.touchMove(scrollableContainer!, {
        touches: [{ clientY: 150 }],
      });
      fireEvent.touchEnd(scrollableContainer!, {
        touches: [],
      });
    }).not.toThrow();
  });

  it('should maintain accessibility during touch interactions', async () => {
    render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText(/open mobile menu/i);
    fireEvent.click(menuButton);
    
    const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
    const scrollableContainer = mobileMenu.querySelector('.mobile-menu-scrollable');
    
    // Check ARIA attributes are preserved
    expect(scrollableContainer).toHaveAttribute('role', 'menu');
    expect(scrollableContainer).toHaveAttribute('aria-orientation', 'vertical');
    expect(scrollableContainer).toHaveAttribute('aria-live', 'polite');
    
    // Check menu items are still accessible
    const menuItems = screen.getAllByRole('menuitem');
    expect(menuItems.length).toBeGreaterThan(0);
    
    menuItems.forEach(item => {
      expect(item).toHaveAttribute('tabIndex', '0');
    });
  });

  it('should handle rapid touch events without performance issues', async () => {
    render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText(/open mobile menu/i);
    fireEvent.click(menuButton);
    
    const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
    const scrollableContainer = mobileMenu.querySelector('.mobile-menu-scrollable');
    
    // Simulate rapid touch events
    const startTime = performance.now();
    
    expect(() => {
      for (let i = 0; i < 50; i++) {
        fireEvent.touchStart(scrollableContainer!, {
          touches: [{ clientY: 100 + i }],
        });
        fireEvent.touchMove(scrollableContainer!, {
          touches: [{ clientY: 150 + i }],
        });
        fireEvent.touchEnd(scrollableContainer!, {
          touches: [],
        });
      }
    }).not.toThrow();
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // Should complete within reasonable time (less than 1 second)
    expect(duration).toBeLessThan(1000);
  });

  it('should clean up touch gestures when component unmounts', async () => {
    const { unmount } = render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText(/open mobile menu/i);
    fireEvent.click(menuButton);
    
    // Unmount component
    expect(() => {
      unmount();
    }).not.toThrow();
  });

  it('should handle window resize during touch interactions', async () => {
    render(<Navbar />);
    
    // Open mobile menu
    const menuButton = screen.getByLabelText(/open mobile menu/i);
    fireEvent.click(menuButton);
    
    const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
    const scrollableContainer = mobileMenu.querySelector('.mobile-menu-scrollable');
    
    // Start touch interaction
    fireEvent.touchStart(scrollableContainer!, {
      touches: [{ clientY: 100 }],
    });
    
    // Simulate window resize
    act(() => {
      global.innerWidth = 500;
      global.innerHeight = 800;
      fireEvent(window, new Event('resize'));
    });
    
    // Continue touch interaction
    expect(() => {
      fireEvent.touchMove(scrollableContainer!, {
        touches: [{ clientY: 150 }],
      });
      fireEvent.touchEnd(scrollableContainer!, {
        touches: [],
      });
    }).not.toThrow();
  });
});