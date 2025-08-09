import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navbar } from '@/components/layout';
import { Footer } from '@/components/layout';

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
  companyInfo: {
    name: 'Vantage Vertical',
    phone: '+254704277687',
    email: 'vantagevarticalltd@gmail.com',
    address: 'Westlands Business Park, Nairobi',
    socialMedia: {
      linkedin: 'https://linkedin.com/company/vantage-vertical',
      twitter: 'https://twitter.com/vantagevertical',
      facebook: 'https://facebook.com/vantagevertical',
      instagram: 'https://instagram.com/vantagevertical',
      youtube: 'https://youtube.com/vantagevertical'
    }
  },
  navigationLinks: [
    { name: 'Home', href: '/', current: true },
    { name: 'About', href: '/about', current: false },
    { name: 'Portfolio', href: '/portfolio', current: false },
    { name: 'Technology', href: '/technology', current: false },
    { name: 'Training', href: '/training', current: false },
    { name: 'Blog', href: '/blog', current: false },
    { name: 'Contact', href: '/contact', current: false }
  ],
  footerLinks: {
    services: [
      { name: 'Aerial Mapping', href: '/technology#mapping' },
      { name: 'Drone Surveillance', href: '/technology#surveillance' },
      { name: 'Agritech Solutions', href: '/technology#agritech' },
      { name: 'Commercial Services', href: '/technology#commercial' }
    ],
    company: [
      { name: 'About Us', href: '/about' },
      { name: 'Our Team', href: '/about#team' },
      { name: 'Careers', href: '/about#careers' },
      { name: 'KCAA Certification', href: '/about#certification' }
    ],
    resources: [
      { name: 'Blog', href: '/blog' },
      { name: 'Case Studies', href: '/portfolio' },
      { name: 'Training Programs', href: '/training' },
      { name: 'Support', href: '/contact#support' }
    ]
  }
}));

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('Navigation Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Navbar Integration', () => {
    it('renders all navigation links', () => {
      render(<Navbar />);

      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /portfolio/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /technology/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /training/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
    });

    it('has correct link destinations', () => {
      render(<Navbar />);

      expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute('href', '/about');
      expect(screen.getByRole('link', { name: /portfolio/i })).toHaveAttribute('href', '/portfolio');
      expect(screen.getByRole('link', { name: /technology/i })).toHaveAttribute('href', '/technology');
      expect(screen.getByRole('link', { name: /training/i })).toHaveAttribute('href', '/training');
      expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute('href', '/blog');
      expect(screen.getByRole('link', { name: /contact/i })).toHaveAttribute('href', '/contact');
    });

    it('displays company logo with home link', () => {
      render(<Navbar />);

      const logoLink = screen.getByRole('link', { name: /vantage vertical/i });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute('href', '/');
    });

    it('has prominent CTA button', () => {
      render(<Navbar />);

      const ctaButton = screen.getByRole('link', { name: /get quote|book service|contact us/i });
      expect(ctaButton).toBeInTheDocument();
      expect(ctaButton).toHaveClass(expect.stringMatching(/btn-primary|bg-primary/));
    });

    it('handles mobile menu toggle', async () => {
      render(<Navbar />);

      // Find mobile menu button
      const mobileMenuButton = screen.getByRole('button', { name: /menu|toggle navigation/i });
      expect(mobileMenuButton).toBeInTheDocument();

      // Click to open mobile menu
      await user.click(mobileMenuButton);

      // Mobile menu should be accessible
      const mobileMenu = screen.getByRole('navigation', { name: /mobile/i }) || 
                        document.querySelector('[data-testid="mobile-menu"]') ||
                        document.querySelector('.mobile-menu');
      
      if (mobileMenu) {
        expect(mobileMenu).toBeInTheDocument();
      }
    });

    it('shows active page highlighting', () => {
      const { rerender } = render(<Navbar />);

      // Mock different pathnames
      const mockUsePathname = require('next/navigation').usePathname;
      
      mockUsePathname.mockReturnValue('/about');
      rerender(<Navbar />);

      const aboutLink = screen.getByRole('link', { name: /about/i });
      expect(aboutLink).toHaveClass(expect.stringMatching(/active|current/));
    });

    it('has proper accessibility attributes', () => {
      render(<Navbar />);

      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();

      // Check that navigation is properly labeled
      expect(nav).toHaveAttribute('aria-label', expect.any(String));

      // Check that mobile menu button has proper ARIA attributes
      const mobileMenuButton = screen.getByRole('button', { name: /menu|toggle navigation/i });
      expect(mobileMenuButton).toHaveAttribute('aria-expanded');
    });

    it('handles keyboard navigation', async () => {
      render(<Navbar />);

      const firstLink = screen.getByRole('link', { name: /home/i });
      firstLink.focus();

      // Tab through navigation links
      await user.keyboard('{Tab}');
      expect(screen.getByRole('link', { name: /about/i })).toHaveFocus();

      await user.keyboard('{Tab}');
      expect(screen.getByRole('link', { name: /portfolio/i })).toHaveFocus();
    });
  });

  describe('Footer Integration', () => {
    it('renders all footer sections', () => {
      render(<Footer />);

      // Check company information
      expect(screen.getByText(/vantage vertical/i)).toBeInTheDocument();
      expect(screen.getByText(/\+254704277687/)).toBeInTheDocument();
      expect(screen.getByText(/vantagevarticalltd@gmail\.com/)).toBeInTheDocument();

      // Check footer link sections
      expect(screen.getByText(/services/i)).toBeInTheDocument();
      expect(screen.getByText(/company/i)).toBeInTheDocument();
      expect(screen.getByText(/resources/i)).toBeInTheDocument();
    });

    it('has functional service links', () => {
      render(<Footer />);

      expect(screen.getByRole('link', { name: /aerial mapping/i })).toHaveAttribute('href', '/technology#mapping');
      expect(screen.getByRole('link', { name: /drone surveillance/i })).toHaveAttribute('href', '/technology#surveillance');
      expect(screen.getByRole('link', { name: /agritech solutions/i })).toHaveAttribute('href', '/technology#agritech');
      expect(screen.getByRole('link', { name: /commercial services/i })).toHaveAttribute('href', '/technology#commercial');
    });

    it('has functional company links', () => {
      render(<Footer />);

      expect(screen.getByRole('link', { name: /about us/i })).toHaveAttribute('href', '/about');
      expect(screen.getByRole('link', { name: /our team/i })).toHaveAttribute('href', '/about#team');
      expect(screen.getByRole('link', { name: /careers/i })).toHaveAttribute('href', '/about#careers');
      expect(screen.getByRole('link', { name: /kcaa certification/i })).toHaveAttribute('href', '/about#certification');
    });

    it('has functional resource links', () => {
      render(<Footer />);

      expect(screen.getByRole('link', { name: /^blog$/i })).toHaveAttribute('href', '/blog');
      expect(screen.getByRole('link', { name: /case studies/i })).toHaveAttribute('href', '/portfolio');
      expect(screen.getByRole('link', { name: /training programs/i })).toHaveAttribute('href', '/training');
      expect(screen.getByRole('link', { name: /support/i })).toHaveAttribute('href', '/contact#support');
    });

    it('displays social media links', () => {
      render(<Footer />);

      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
      const twitterLink = screen.getByRole('link', { name: /twitter/i });
      const facebookLink = screen.getByRole('link', { name: /facebook/i });
      const instagramLink = screen.getByRole('link', { name: /instagram/i });
      const youtubeLink = screen.getByRole('link', { name: /youtube/i });

      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/company/vantage-vertical');
      expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/vantagevertical');
      expect(facebookLink).toHaveAttribute('href', 'https://facebook.com/vantagevertical');
      expect(instagramLink).toHaveAttribute('href', 'https://instagram.com/vantagevertical');
      expect(youtubeLink).toHaveAttribute('href', 'https://youtube.com/vantagevertical');

      // Check that external links have proper attributes
      [linkedinLink, twitterLink, facebookLink, instagramLink, youtubeLink].forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
      });
    });

    it('includes newsletter signup', () => {
      render(<Footer />);

      // Look for newsletter signup form or CTA
      const newsletterSection = screen.getByText(/newsletter|subscribe|stay updated/i);
      expect(newsletterSection).toBeInTheDocument();
    });

    it('displays copyright and legal information', () => {
      render(<Footer />);

      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
      expect(screen.getByText(/copyright|©/i)).toBeInTheDocument();
    });

    it('shows KCAA certification information', () => {
      render(<Footer />);

      expect(screen.getByText(/kcaa|certified|licensed/i)).toBeInTheDocument();
    });
  });

  describe('Navigation Consistency', () => {
    it('maintains consistent navigation structure across components', () => {
      const { container: navbarContainer } = render(<Navbar />);
      const { container: footerContainer } = render(<Footer />);

      // Both should have navigation elements
      expect(navbarContainer.querySelector('nav')).toBeInTheDocument();
      expect(footerContainer.querySelector('nav') || footerContainer.querySelector('footer')).toBeInTheDocument();

      // Both should link to main pages
      const navbarLinks = Array.from(navbarContainer.querySelectorAll('a')).map(a => a.getAttribute('href'));
      const footerLinks = Array.from(footerContainer.querySelectorAll('a')).map(a => a.getAttribute('href'));

      const commonPages = ['/', '/about', '/portfolio', '/technology', '/training', '/blog', '/contact'];
      commonPages.forEach(page => {
        expect(navbarLinks).toContain(page);
        expect(footerLinks.some(link => link?.includes(page.replace('/', '')) || link === page)).toBe(true);
      });
    });

    it('provides consistent branding across navigation elements', () => {
      render(<Navbar />);
      render(<Footer />);

      // Both should reference Vantage Vertical
      const vantageReferences = screen.getAllByText(/vantage vertical/i);
      expect(vantageReferences.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Responsive Navigation', () => {
    it('adapts to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('max-width: 768px'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(<Navbar />);

      // Mobile menu button should be present
      const mobileMenuButton = screen.getByRole('button', { name: /menu|toggle navigation/i });
      expect(mobileMenuButton).toBeInTheDocument();
    });

    it('handles tablet viewport appropriately', () => {
      // Mock tablet viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('max-width: 1024px') && !query.includes('max-width: 768px'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(<Navbar />);

      // Navigation should still be functional
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('provides full desktop navigation', () => {
      // Mock desktop viewport
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query.includes('min-width: 1024px'),
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(<Navbar />);

      // All navigation links should be visible
      expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /portfolio/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /technology/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /training/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
    });
  });

  describe('Navigation Performance', () => {
    it('loads navigation elements efficiently', () => {
      const startTime = performance.now();
      render(<Navbar />);
      const endTime = performance.now();

      // Navigation should render quickly (under 100ms in test environment)
      expect(endTime - startTime).toBeLessThan(100);
    });

    it('handles navigation state changes smoothly', async () => {
      render(<Navbar />);

      const mobileMenuButton = screen.getByRole('button', { name: /menu|toggle navigation/i });
      
      // Multiple rapid clicks should be handled gracefully
      await user.click(mobileMenuButton);
      await user.click(mobileMenuButton);
      await user.click(mobileMenuButton);

      // Component should still be functional
      expect(mobileMenuButton).toBeInTheDocument();
    });
  });
});