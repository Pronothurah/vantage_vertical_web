import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from '@/components/layout';
import HeroSection from '@/components/sections/HeroSection';
import { ServiceGrid } from '@/components/sections/ServiceCard';
import ContactForm from '@/components/forms/ContactForm';

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(() => '/'),
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
}));

// Mock data
jest.mock('@/data', () => ({
  mainServices: [
    {
      title: 'Aerial Mapping',
      description: 'High-precision aerial mapping services',
      features: ['GPS Accuracy', 'Real-time Processing'],
      ctaText: 'Learn More',
      ctaLink: '/technology',
      iconType: 'mapping'
    },
    {
      title: 'Drone Surveillance',
      description: 'Professional surveillance solutions',
      features: ['24/7 Monitoring', 'HD Video'],
      ctaText: 'Get Quote',
      ctaLink: '/contact',
      iconType: 'surveillance'
    }
  ],
  navigationLinks: [
    { name: 'Home', href: '/', current: true },
    { name: 'About', href: '/about', current: false },
    { name: 'Portfolio', href: '/portfolio', current: false },
    { name: 'Technology', href: '/technology', current: false },
    { name: 'Training', href: '/training', current: false },
    { name: 'Blog', href: '/blog', current: false },
    { name: 'Contact', href: '/contact', current: false }
  ],
  serviceOptions: [
    { value: 'aerial-mapping', label: 'Aerial Mapping' },
    { value: 'surveillance', label: 'Surveillance' }
  ],
  urgencyLevels: [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' }
  ]
}));

// Mock form validation
jest.mock('@/lib/useFormValidation', () => ({
  useFormValidation: () => ({
    formState: {
      errors: {},
      isSubmitting: false,
      submitError: null,
      submitSuccess: false,
    },
    validateField: jest.fn(() => null),
    validateForm: jest.fn(() => ({})),
    setFieldError: jest.fn(),
    clearFieldError: jest.fn(),
    setSubmitting: jest.fn(),
    setSubmitError: jest.fn(),
    setSubmitSuccess: jest.fn(),
    resetForm: jest.fn(),
  }),
}));

// Mock accessibility
jest.mock('@/lib/accessibility', () => ({
  ariaAttributes: {
    form: jest.fn(() => ({})),
    textbox: jest.fn(() => ({})),
    button: jest.fn(() => ({})),
  },
  generateId: jest.fn(() => 'test-id'),
  announceToScreenReader: jest.fn(),
}));

// Viewport size configurations
const viewports = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1024, height: 768 },
  largeDesktop: { width: 1440, height: 900 },
  extraLarge: { width: 1920, height: 1080 }
};

// Helper function to set viewport size
const setViewport = (viewport: keyof typeof viewports) => {
  const { width, height } = viewports[viewport];
  
  // Mock window dimensions
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });

  // Mock matchMedia for responsive queries
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => {
      const matches = (() => {
        if (query.includes('max-width: 640px')) return width <= 640;
        if (query.includes('max-width: 768px')) return width <= 768;
        if (query.includes('max-width: 1024px')) return width <= 1024;
        if (query.includes('min-width: 640px')) return width >= 640;
        if (query.includes('min-width: 768px')) return width >= 768;
        if (query.includes('min-width: 1024px')) return width >= 1024;
        if (query.includes('min-width: 1280px')) return width >= 1280;
        return false;
      })();

      return {
        matches,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      };
    }),
  });

  // Trigger resize event
  fireEvent(window, new Event('resize'));
};

describe('Responsive Design Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Mobile Viewport (375px)', () => {
    beforeEach(() => {
      setViewport('mobile');
    });

    it('renders mobile navigation correctly', () => {
      render(<Navbar />);

      // Mobile menu button should be visible
      const mobileMenuButton = screen.getByRole('button', { name: /menu|toggle navigation/i });
      expect(mobileMenuButton).toBeInTheDocument();

      // Desktop navigation links should be hidden or in mobile menu
      const navElement = screen.getByRole('navigation');
      expect(navElement).toBeInTheDocument();
    });

    it('displays hero section with mobile-optimized layout', () => {
      const heroProps = {
        title: 'See More. Do More. From Above.',
        subtitle: 'Professional drone services for all your needs',
        backgroundImage: '/hero-bg.jpg',
        ctaText: 'Get Started',
        ctaLink: '/contact'
      };

      render(<HeroSection {...heroProps} />);

      // Title should be present and readable
      expect(screen.getByText(heroProps.title)).toBeInTheDocument();
      expect(screen.getByText(heroProps.subtitle)).toBeInTheDocument();

      // CTA button should be accessible
      const ctaButton = screen.getByRole('link', { name: heroProps.ctaText });
      expect(ctaButton).toBeInTheDocument();
    });

    it('stacks service cards vertically on mobile', () => {
      const { container } = render(<ServiceGrid services={require('@/data').mainServices} columns={1} />);

      // Service cards should be present
      expect(screen.getByText('Aerial Mapping')).toBeInTheDocument();
      expect(screen.getByText('Drone Surveillance')).toBeInTheDocument();

      // Grid should have mobile-appropriate classes
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('grid-cols-1');
    });

    it('optimizes contact form for mobile input', () => {
      render(<ContactForm variant="full" />);

      // Form should be present and usable
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();

      // Form fields should have mobile-appropriate attributes
      const phoneField = screen.getByLabelText(/phone/i);
      expect(phoneField).toHaveAttribute('type', 'tel');

      const emailField = screen.getByLabelText(/email/i);
      expect(emailField).toHaveAttribute('type', 'email');
    });

    it('handles mobile touch interactions', async () => {
      render(<Navbar />);

      const mobileMenuButton = screen.getByRole('button', { name: /menu|toggle navigation/i });

      // Simulate touch interaction
      fireEvent.touchStart(mobileMenuButton);
      fireEvent.touchEnd(mobileMenuButton);
      await user.click(mobileMenuButton);

      // Menu should respond to touch
      expect(mobileMenuButton).toHaveAttribute('aria-expanded');
    });
  });

  describe('Tablet Viewport (768px)', () => {
    beforeEach(() => {
      setViewport('tablet');
    });

    it('adapts navigation for tablet layout', () => {
      render(<Navbar />);

      // Should have appropriate tablet navigation
      const navElement = screen.getByRole('navigation');
      expect(navElement).toBeInTheDocument();

      // May still have mobile menu or show condensed desktop nav
      const menuButton = screen.queryByRole('button', { name: /menu|toggle navigation/i });
      // Menu button may or may not be present depending on design
    });

    it('displays service grid in tablet-optimized columns', () => {
      const { container } = render(<ServiceGrid services={require('@/data').mainServices} columns={2} />);

      // Should show 2 columns on tablet
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('md:grid-cols-2');

      expect(screen.getByText('Aerial Mapping')).toBeInTheDocument();
      expect(screen.getByText('Drone Surveillance')).toBeInTheDocument();
    });

    it('optimizes form layout for tablet', () => {
      render(<ContactForm variant="full" />);

      // Form should be well-proportioned for tablet
      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();

      // Fields should be accessible and properly sized
      const nameField = screen.getByLabelText(/full name/i);
      const emailField = screen.getByLabelText(/email/i);

      expect(nameField).toBeInTheDocument();
      expect(emailField).toBeInTheDocument();
    });

    it('handles tablet-specific interactions', async () => {
      render(<ContactForm />);

      const serviceSelect = screen.getByLabelText(/service needed/i);
      
      // Should handle tablet touch/click interactions
      await user.click(serviceSelect);
      await user.selectOptions(serviceSelect, 'aerial-mapping');

      expect(serviceSelect).toHaveValue('aerial-mapping');
    });
  });

  describe('Desktop Viewport (1024px)', () => {
    beforeEach(() => {
      setViewport('desktop');
    });

    it('displays full desktop navigation', () => {
      render(<Navbar />);

      // All navigation links should be visible
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /portfolio/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /technology/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /training/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();

      // Mobile menu button should not be visible
      const mobileMenuButton = screen.queryByRole('button', { name: /menu|toggle navigation/i });
      expect(mobileMenuButton).not.toBeInTheDocument();
    });

    it('displays hero section with full desktop layout', () => {
      const heroProps = {
        title: 'See More. Do More. From Above.',
        subtitle: 'Professional drone services for aerial mapping, surveillance, and agritech solutions',
        backgroundImage: '/hero-bg.jpg',
        ctaText: 'Get Started',
        ctaLink: '/contact',
        secondaryCtaText: 'Learn More',
        secondaryCtaLink: '/about'
      };

      render(<HeroSection {...heroProps} />);

      // Both CTAs should be visible on desktop
      expect(screen.getByRole('link', { name: 'Get Started' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'Learn More' })).toBeInTheDocument();

      // Text should be properly sized for desktop
      expect(screen.getByText(heroProps.title)).toBeInTheDocument();
      expect(screen.getByText(heroProps.subtitle)).toBeInTheDocument();
    });

    it('displays service grid in desktop columns', () => {
      const { container } = render(<ServiceGrid services={require('@/data').mainServices} columns={2} />);

      // Should show full grid layout
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toHaveClass('lg:grid-cols-2');

      // All services should be visible
      expect(screen.getByText('Aerial Mapping')).toBeInTheDocument();
      expect(screen.getByText('Drone Surveillance')).toBeInTheDocument();
    });

    it('optimizes form for desktop interaction', () => {
      render(<ContactForm variant="full" />);

      // Form should have desktop-optimized layout
      expect(screen.getByText('Get Started Today')).toBeInTheDocument();

      // All form elements should be properly accessible
      const formElements = [
        screen.getByLabelText(/full name/i),
        screen.getByLabelText(/email/i),
        screen.getByLabelText(/phone/i),
        screen.getByLabelText(/service needed/i),
        screen.getByLabelText(/project details/i)
      ];

      formElements.forEach(element => {
        expect(element).toBeInTheDocument();
      });
    });

    it('supports desktop keyboard navigation', async () => {
      render(<Navbar />);

      const firstLink = screen.getByRole('link', { name: /home/i });
      firstLink.focus();

      // Tab through navigation
      await user.keyboard('{Tab}');
      expect(screen.getByRole('link', { name: /about/i })).toHaveFocus();

      await user.keyboard('{Tab}');
      expect(screen.getByRole('link', { name: /portfolio/i })).toHaveFocus();
    });
  });

  describe('Large Desktop Viewport (1440px)', () => {
    beforeEach(() => {
      setViewport('largeDesktop');
    });

    it('utilizes extra space effectively', () => {
      const heroProps = {
        title: 'See More. Do More. From Above.',
        subtitle: 'Professional drone services for aerial mapping, surveillance, and agritech solutions',
        backgroundImage: '/hero-bg.jpg',
        ctaText: 'Get Started',
        ctaLink: '/contact'
      };

      render(<HeroSection {...heroProps} />);

      // Content should be properly centered and sized
      expect(screen.getByText(heroProps.title)).toBeInTheDocument();
      expect(screen.getByText(heroProps.subtitle)).toBeInTheDocument();
    });

    it('displays expanded service grid layout', () => {
      const { container } = render(<ServiceGrid services={require('@/data').mainServices} columns={2} />);

      // Should utilize available space
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();

      expect(screen.getByText('Aerial Mapping')).toBeInTheDocument();
      expect(screen.getByText('Drone Surveillance')).toBeInTheDocument();
    });
  });

  describe('Cross-Viewport Consistency', () => {
    it('maintains consistent branding across all viewports', () => {
      Object.keys(viewports).forEach(viewport => {
        setViewport(viewport as keyof typeof viewports);
        
        const { container } = render(<Navbar />);
        
        // Logo/brand should be present in all viewports
        const brandElement = screen.getByRole('link', { name: /vantage vertical|home/i });
        expect(brandElement).toBeInTheDocument();
        
        // Clean up for next iteration
        container.remove();
      });
    });

    it('maintains accessibility across all viewports', () => {
      Object.keys(viewports).forEach(viewport => {
        setViewport(viewport as keyof typeof viewports);
        
        const { container } = render(<ContactForm />);
        
        // Form should be accessible in all viewports
        const form = screen.getByRole('form');
        expect(form).toBeInTheDocument();
        
        // Required fields should have proper labels
        const nameField = screen.getByLabelText(/full name/i);
        expect(nameField).toHaveAttribute('required');
        
        container.remove();
      });
    });

    it('provides consistent user experience across viewports', () => {
      Object.keys(viewports).forEach(viewport => {
        setViewport(viewport as keyof typeof viewports);
        
        const heroProps = {
          title: 'See More. Do More. From Above.',
          subtitle: 'Professional drone services',
          backgroundImage: '/hero-bg.jpg',
          ctaText: 'Get Started',
          ctaLink: '/contact'
        };

        const { container } = render(<HeroSection {...heroProps} />);
        
        // Core content should be present in all viewports
        expect(screen.getByText(heroProps.title)).toBeInTheDocument();
        expect(screen.getByRole('link', { name: heroProps.ctaText })).toBeInTheDocument();
        
        container.remove();
      });
    });
  });

  describe('Responsive Image Handling', () => {
    it('handles images appropriately across viewports', () => {
      Object.keys(viewports).forEach(viewport => {
        setViewport(viewport as keyof typeof viewports);
        
        const heroProps = {
          title: 'Test Title',
          subtitle: 'Test Subtitle',
          backgroundImage: '/hero-bg.jpg',
          ctaText: 'Get Started',
          ctaLink: '/contact'
        };

        const { container } = render(<HeroSection {...heroProps} />);
        
        // Background image should be handled properly
        const heroSection = container.querySelector('section');
        expect(heroSection).toBeInTheDocument();
        
        container.remove();
      });
    });
  });

  describe('Performance Across Viewports', () => {
    it('renders efficiently on all viewport sizes', () => {
      Object.keys(viewports).forEach(viewport => {
        setViewport(viewport as keyof typeof viewports);
        
        const startTime = performance.now();
        const { container } = render(<Navbar />);
        const endTime = performance.now();
        
        // Should render quickly regardless of viewport
        expect(endTime - startTime).toBeLessThan(100);
        
        container.remove();
      });
    });

    it('handles viewport changes smoothly', () => {
      const { container } = render(<Navbar />);
      
      // Change viewport sizes
      setViewport('mobile');
      fireEvent(window, new Event('resize'));
      
      setViewport('desktop');
      fireEvent(window, new Event('resize'));
      
      setViewport('tablet');
      fireEvent(window, new Event('resize'));
      
      // Component should still be functional
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });
});