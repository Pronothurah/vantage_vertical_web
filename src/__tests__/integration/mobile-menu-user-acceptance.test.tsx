/**
 * User Acceptance Testing for Mobile Menu Scrolling
 * Simulates real user scenarios and acceptance criteria
 * Requirements: 2.5, 3.1, 3.3, 4.5, 5.4
 */

import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

// User personas for testing
const USER_PERSONAS = {
  mobileUser: {
    name: 'Sarah - Mobile User',
    device: { width: 375, height: 667 },
    expectations: [
      'Can access all menu items without horizontal scrolling',
      'Menu opens quickly and smoothly',
      'Can scroll through menu items easily',
      'Menu closes when selecting an item',
    ],
  },
  tabletUser: {
    name: 'Mike - Tablet User',
    device: { width: 768, height: 1024 },
    expectations: [
      'Menu utilizes tablet screen space efficiently',
      'Touch scrolling works smoothly',
      'Can see more menu items at once',
      'Works in both portrait and landscape',
    ],
  },
  accessibilityUser: {
    name: 'Alex - Screen Reader User',
    device: { width: 390, height: 844 },
    assistiveTech: 'screen-reader',
    expectations: [
      'Can navigate menu with keyboard only',
      'Receives audio feedback about menu state',
      'Can understand scroll position',
      'Focus management works correctly',
    ],
  },
  seniorUser: {
    name: 'Dorothy - Senior User',
    device: { width: 414, height: 896 },
    preferences: { reducedMotion: true, largeText: true },
    expectations: [
      'Menu animations are subtle or disabled',
      'Text is readable and well-spaced',
      'Touch targets are large enough',
      'No unexpected motion or changes',
    ],
  },
};

// User scenarios
const USER_SCENARIOS = [
  {
    name: 'First-time visitor navigation',
    steps: [
      'Open mobile menu',
      'Scroll through all menu items',
      'Select a menu item',
      'Verify navigation works',
    ],
  },
  {
    name: 'Quick navigation to specific page',
    steps: [
      'Open mobile menu',
      'Quickly scroll to desired item',
      'Select item',
      'Verify quick access',
    ],
  },
  {
    name: 'Exploration of all menu options',
    steps: [
      'Open mobile menu',
      'Scroll to see all options',
      'Read through menu items',
      'Close menu without selecting',
    ],
  },
  {
    name: 'Accidental menu opening',
    steps: [
      'Accidentally open menu',
      'Quickly close menu',
      'Continue with original task',
    ],
  },
];

// Utility function to simulate user persona
const simulateUserPersona = (persona: typeof USER_PERSONAS[keyof typeof USER_PERSONAS]) => {
  // Set device dimensions
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: persona.device.width,
  });
  
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: persona.device.height,
  });

  // Set user preferences
  if (persona.preferences?.reducedMotion) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  }

  // Trigger resize event
  fireEvent(window, new Event('resize'));
};

// Performance measurement utilities
const measurePerformance = () => {
  const startTime = performance.now();
  return {
    end: () => performance.now() - startTime,
  };
};

describe('Mobile Menu User Acceptance Testing', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
  });

  describe('User Persona Testing', () => {
    Object.entries(USER_PERSONAS).forEach(([personaKey, persona]) => {
      describe(`${persona.name} Experience`, () => {
        beforeEach(() => {
          simulateUserPersona(persona);
        });

        test('should meet user expectations for menu functionality', async () => {
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          
          // Test menu opening
          const openPerf = measurePerformance();
          await user.click(menuButton);
          const openTime = openPerf.end();
          
          // Menu should open quickly (under 300ms for good UX)
          expect(openTime).toBeLessThan(300);
          
          const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
          expect(mobileMenu).toBeVisible();
          
          // Test scrolling capability
          const scrollableContainer = screen.getByRole('menu');
          const menuItems = screen.getAllByRole('menuitem');
          
          // Verify all menu items are accessible
          expect(menuItems.length).toBeGreaterThan(0);
          
          // Test scrolling if needed
          if (scrollableContainer.scrollHeight > scrollableContainer.clientHeight) {
            fireEvent.scroll(scrollableContainer, { target: { scrollTop: 100 } });
            expect(scrollableContainer.scrollTop).toBe(100);
          }
          
          // Test menu item selection
          const firstMenuItem = menuItems[0];
          await user.click(firstMenuItem);
          
          // Menu should close after selection
          await waitFor(() => {
            expect(mobileMenu).not.toBeVisible();
          });
        });

        test('should handle touch interactions naturally', async () => {
          if (persona.assistiveTech === 'screen-reader') return; // Skip for screen reader users
          
          render(<Navbar />);
          
          const menuButton = screen.getByLabelText(/open mobile menu/i);
          await user.click(menuButton);

          const scrollableContainer = screen.getByRole('menu');
          
          // Simulate touch scrolling
          fireEvent.touchStart(scrollableContainer, {
            touches: [{ clientX: 0, clientY: 200 }],
          });

          fireEvent.touchMove(scrollableContainer, {
            touches: [{ clientX: 0, clientY: 100 }],
          });

          fireEvent.touchEnd(scrollableContainer);
          
          // Touch interaction should not break the menu
          expect(scrollableContainer).toBeVisible();
        });

        if (persona.assistiveTech === 'screen-reader') {
          test('should provide excellent keyboard navigation experience', async () => {
            render(<Navbar />);
            
            const menuButton = screen.getByLabelText(/open mobile menu/i);
            
            // Open menu with keyboard
            menuButton.focus();
            fireEvent.keyDown(menuButton, { key: 'Enter' });
            
            await waitFor(() => {
              const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
              expect(mobileMenu).toBeVisible();
            });
            
            const menuItems = screen.getAllByRole('menuitem');
            
            // Navigate through menu with arrow keys
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
            
            await waitFor(() => {
              expect(document.activeElement).toBe(menuItems[0]);
            });
            
            // Continue navigation
            fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
            
            await waitFor(() => {
              expect(document.activeElement).toBe(menuItems[1]);
            });
            
            // Close menu with Escape
            fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
            
            await waitFor(() => {
              expect(document.activeElement).toBe(menuButton);
            });
          });
        }
      });
    });
  });

  describe('User Scenario Testing', () => {
    USER_SCENARIOS.forEach((scenario) => {
      test(`should handle "${scenario.name}" scenario successfully`, async () => {
        // Use mobile user as default for scenarios
        simulateUserPersona(USER_PERSONAS.mobileUser);
        
        render(<Navbar />);
        
        const menuButton = screen.getByLabelText(/open mobile menu/i);
        
        switch (scenario.name) {
          case 'First-time visitor navigation':
            // Open mobile menu
            await user.click(menuButton);
            
            const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
            expect(mobileMenu).toBeVisible();
            
            // Scroll through all menu items
            const scrollableContainer = screen.getByRole('menu');
            const menuItems = screen.getAllByRole('menuitem');
            
            // Simulate scrolling to see all items
            if (scrollableContainer.scrollHeight > scrollableContainer.clientHeight) {
              fireEvent.scroll(scrollableContainer, { 
                target: { scrollTop: scrollableContainer.scrollHeight } 
              });
            }
            
            // Select a menu item
            await user.click(menuItems[2]); // Select "Drones" or similar
            
            // Verify navigation works (menu closes)
            await waitFor(() => {
              expect(mobileMenu).not.toBeVisible();
            });
            break;
            
          case 'Quick navigation to specific page':
            // Open mobile menu
            await user.click(menuButton);
            
            // Quickly scroll to desired item (simulate user knowing what they want)
            const quickScrollContainer = screen.getByRole('menu');
            fireEvent.scroll(quickScrollContainer, { target: { scrollTop: 200 } });
            
            // Select item quickly
            const quickMenuItems = screen.getAllByRole('menuitem');
            await user.click(quickMenuItems[4]); // Select middle item
            
            // Verify quick access
            await waitFor(() => {
              const menu = screen.queryByRole('navigation', { name: /mobile navigation/i });
              expect(menu).not.toBeVisible();
            });
            break;
            
          case 'Exploration of all menu options':
            // Open mobile menu
            await user.click(menuButton);
            
            const exploreContainer = screen.getByRole('menu');
            const exploreItems = screen.getAllByRole('menuitem');
            
            // Scroll to see all options
            fireEvent.scroll(exploreContainer, { target: { scrollTop: 50 } });
            fireEvent.scroll(exploreContainer, { target: { scrollTop: 100 } });
            fireEvent.scroll(exploreContainer, { target: { scrollTop: 0 } });
            
            // Read through menu items (simulate hover/focus)
            for (let i = 0; i < Math.min(3, exploreItems.length); i++) {
              exploreItems[i].focus();
              await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Close menu without selecting
            await user.click(menuButton);
            
            await waitFor(() => {
              const menu = screen.queryByRole('navigation', { name: /mobile navigation/i });
              expect(menu).not.toBeVisible();
            });
            break;
            
          case 'Accidental menu opening':
            // Accidentally open menu
            await user.click(menuButton);
            
            const accidentalMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
            expect(accidentalMenu).toBeVisible();
            
            // Quickly close menu (user realizes mistake)
            await user.click(menuButton);
            
            // Continue with original task (menu should be closed)
            await waitFor(() => {
              expect(accidentalMenu).not.toBeVisible();
            });
            
            // Verify user can continue normally
            expect(menuButton).toBeVisible();
            expect(menuButton).toHaveAttribute('aria-expanded', 'false');
            break;
        }
      });
    });
  });

  describe('Real-world Usage Patterns', () => {
    test('should handle rapid menu open/close cycles', async () => {
      simulateUserPersona(USER_PERSONAS.mobileUser);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      
      // Simulate user rapidly opening and closing menu
      for (let i = 0; i < 5; i++) {
        await user.click(menuButton);
        
        await waitFor(() => {
          const menu = screen.getByRole('navigation', { name: /mobile navigation/i });
          expect(menu).toBeVisible();
        });
        
        await user.click(menuButton);
        
        await waitFor(() => {
          const menu = screen.queryByRole('navigation', { name: /mobile navigation/i });
          expect(menu).not.toBeVisible();
        });
      }
      
      // Menu should still work correctly after rapid cycles
      await user.click(menuButton);
      const finalMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
      expect(finalMenu).toBeVisible();
    });

    test('should maintain performance during extended scrolling sessions', async () => {
      simulateUserPersona(USER_PERSONAS.tabletUser);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Simulate extended scrolling session
      const scrollPerf = measurePerformance();
      
      for (let i = 0; i < 50; i++) {
        fireEvent.scroll(scrollableContainer, { 
          target: { scrollTop: (i % 10) * 20 } 
        });
      }
      
      const scrollTime = scrollPerf.end();
      
      // Should maintain good performance even with extended scrolling
      expect(scrollTime).toBeLessThan(1000); // Should complete in under 1 second
      expect(scrollableContainer).toBeVisible();
    });

    test('should work correctly with interrupted interactions', async () => {
      simulateUserPersona(USER_PERSONAS.mobileUser);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      const menuItems = screen.getAllByRole('menuitem');
      
      // Start scrolling
      fireEvent.scroll(scrollableContainer, { target: { scrollTop: 100 } });
      
      // Interrupt with focus change
      menuItems[2].focus();
      
      // Continue scrolling
      fireEvent.scroll(scrollableContainer, { target: { scrollTop: 200 } });
      
      // Interrupt with outside click (simulate phone call notification)
      fireEvent.click(document.body);
      
      // Menu should handle interruptions gracefully
      expect(scrollableContainer).toBeVisible();
      
      // User should be able to continue normally
      await user.click(menuItems[1]);
      
      await waitFor(() => {
        const menu = screen.queryByRole('navigation', { name: /mobile navigation/i });
        expect(menu).not.toBeVisible();
      });
    });
  });

  describe('Error Recovery and Edge Cases', () => {
    test('should recover from scroll position errors', async () => {
      simulateUserPersona(USER_PERSONAS.mobileUser);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Simulate invalid scroll position
      Object.defineProperty(scrollableContainer, 'scrollTop', {
        get: () => NaN,
        set: () => {},
      });
      
      // Should not crash when handling invalid scroll
      fireEvent.scroll(scrollableContainer, { target: { scrollTop: 100 } });
      
      expect(scrollableContainer).toBeVisible();
    });

    test('should handle viewport changes during menu usage', async () => {
      simulateUserPersona(USER_PERSONAS.tabletUser);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      // Simulate device rotation during menu usage
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024, // Landscape
      });
      
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 768,
      });
      
      fireEvent(window, new Event('resize'));
      
      // Menu should adapt to new dimensions
      await waitFor(() => {
        const menu = screen.getByRole('navigation', { name: /mobile navigation/i });
        expect(menu).toBeVisible();
      });
      
      const scrollableContainer = screen.getByRole('menu');
      expect(scrollableContainer).toBeInTheDocument();
    });

    test('should maintain usability with slow network conditions', async () => {
      // Simulate slow network by adding delays to interactions
      simulateUserPersona(USER_PERSONAS.mobileUser);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      
      // Add artificial delay to simulate slow response
      const originalClick = menuButton.click;
      menuButton.click = function() {
        setTimeout(() => originalClick.call(this), 100);
      };
      
      await user.click(menuButton);
      
      // Even with delays, menu should eventually work
      await waitFor(() => {
        const menu = screen.getByRole('navigation', { name: /mobile navigation/i });
        expect(menu).toBeVisible();
      }, { timeout: 2000 });
    });
  });

  describe('User Satisfaction Metrics', () => {
    test('should meet performance expectations for menu opening', async () => {
      simulateUserPersona(USER_PERSONAS.mobileUser);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      
      // Measure menu opening time
      const openPerf = measurePerformance();
      await user.click(menuButton);
      
      await waitFor(() => {
        const menu = screen.getByRole('navigation', { name: /mobile navigation/i });
        expect(menu).toBeVisible();
      });
      
      const openTime = openPerf.end();
      
      // Should open within acceptable time for good UX (under 200ms)
      expect(openTime).toBeLessThan(200);
    });

    test('should provide smooth scrolling experience', async () => {
      simulateUserPersona(USER_PERSONAS.tabletUser);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const scrollableContainer = screen.getByRole('menu');
      
      // Test smooth scrolling
      const scrollPerf = measurePerformance();
      
      // Simulate smooth scroll gesture
      for (let i = 0; i <= 100; i += 10) {
        fireEvent.scroll(scrollableContainer, { target: { scrollTop: i } });
      }
      
      const scrollTime = scrollPerf.end();
      
      // Should handle smooth scrolling efficiently
      expect(scrollTime).toBeLessThan(100);
      expect(scrollableContainer.scrollTop).toBe(100);
    });

    test('should maintain visual consistency throughout interaction', async () => {
      simulateUserPersona(USER_PERSONAS.mobileUser);
      
      render(<Navbar />);
      
      const menuButton = screen.getByLabelText(/open mobile menu/i);
      await user.click(menuButton);

      const mobileMenu = screen.getByRole('navigation', { name: /mobile navigation/i });
      const scrollableContainer = screen.getByRole('menu');
      
      // Check initial visual state
      expect(mobileMenu).toBeVisible();
      expect(scrollableContainer).toBeVisible();
      
      // Scroll and check visual consistency
      fireEvent.scroll(scrollableContainer, { target: { scrollTop: 50 } });
      
      expect(mobileMenu).toBeVisible();
      expect(scrollableContainer).toBeVisible();
      
      // Menu items should remain properly styled
      const menuItems = screen.getAllByRole('menuitem');
      menuItems.forEach(item => {
        expect(item).toBeVisible();
      });
    });
  });
});