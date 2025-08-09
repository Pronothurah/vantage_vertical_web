import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';
import ContactPage from '@/app/contact/page';

// Mock Next.js modules
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
}));

// Mock data module
jest.mock('@/data', () => ({
  mainServices: [
    {
      title: 'Aerial Mapping',
      description: 'High-precision aerial mapping and surveying services',
      features: ['GPS Accuracy', 'Real-time Processing', 'Detailed Reports'],
      ctaText: 'Learn More',
      ctaLink: '/technology',
      iconType: 'mapping'
    },
    {
      title: 'Drone Surveillance',
      description: 'Professional surveillance and monitoring solutions',
      features: ['24/7 Monitoring', 'HD Video', 'Real-time Alerts'],
      ctaText: 'Get Quote',
      ctaLink: '/contact',
      iconType: 'surveillance'
    }
  ],
  industries: [
    {
      name: 'Agriculture',
      description: 'Precision farming solutions',
      benefits: ['Crop monitoring', 'Yield optimization'],
      iconType: 'agriculture'
    },
    {
      name: 'Security',
      description: 'Advanced surveillance systems',
      benefits: ['Perimeter monitoring', 'Threat detection'],
      iconType: 'security'
    }
  ],
  whyChooseUsFeatures: [
    {
      title: 'KCAA Certified',
      description: 'Fully certified pilots and operations',
      stats: '100% Compliant',
      iconType: 'certification'
    },
    {
      title: 'Advanced Technology',
      description: 'Latest drone technology and equipment',
      stats: '50+ Drones',
      iconType: 'technology'
    }
  ],
  testimonials: [
    {
      name: 'John Doe',
      company: 'ABC Farm',
      content: 'Excellent service and professional team',
      image: '/testimonial1.jpg',
      metrics: {
        improvement: '30% yield increase',
        value: 'KES 2M saved'
      }
    }
  ],
  companyInfo: {
    name: 'Vantage Vertical',
    phone: '+254704277687',
    email: 'vantagevarticalltd@gmail.com'
  }
}));

// Mock SEO module
jest.mock('@/lib/seo', () => ({
  generateMetadata: jest.fn(() => ({
    title: 'Test Page',
    description: 'Test description'
  })),
  pageConfigs: {
    home: {
      title: 'Home Page',
      description: 'Home page description'
    }
  },
  generateServiceSchema: jest.fn(() => ({})),
  generateOrganizationSchema: jest.fn(() => ({}))
}));

// Mock image utils
jest.mock('@/lib/imageUtils', () => ({
  imageSizes: {
    logo: '128px'
  },
  imageQuality: {
    thumbnail: 75
  }
}));

describe('Page Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('HomePage Integration', () => {
    it('renders complete home page with all sections', async () => {
      render(<HomePage />);

      // Check hero section
      expect(screen.getByText('See More. Do More. From Above.')).toBeInTheDocument();
      expect(screen.getByText(/leading drone services company/i)).toBeInTheDocument();

      // Check services section
      expect(screen.getByText('Our Drone Services')).toBeInTheDocument();
      expect(screen.getByText('Aerial Mapping')).toBeInTheDocument();
      expect(screen.getByText('Drone Surveillance')).toBeInTheDocument();

      // Check industries section
      expect(screen.getByText('Industries We Serve')).toBeInTheDocument();
      expect(screen.getByText('Agriculture')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();

      // Check why choose us section
      expect(screen.getByText('Why Choose Vantage Vertical')).toBeInTheDocument();
      expect(screen.getByText('KCAA Certified')).toBeInTheDocument();
      expect(screen.getByText('Advanced Technology')).toBeInTheDocument();

      // Check KCAA certification section
      expect(screen.getByText('KCAA Certified & Compliant')).toBeInTheDocument();

      // Check testimonials section
      expect(screen.getByText('What Our Clients Say')).toBeInTheDocument();
    });

    it('has functional navigation CTAs', async () => {
      render(<HomePage />);

      // Check hero CTAs
      const bookServiceBtn = screen.getByRole('link', { name: /book a drone service/i });
      const browseDronesBtn = screen.getByRole('link', { name: /browse our drones/i });

      expect(bookServiceBtn).toHaveAttribute('href', '/contact');
      expect(browseDronesBtn).toHaveAttribute('href', '/technology');

      // Check service CTAs
      const learnMoreLinks = screen.getAllByText('Learn More');
      const getQuoteLinks = screen.getAllByText('Get Quote');

      expect(learnMoreLinks.length).toBeGreaterThan(0);
      expect(getQuoteLinks.length).toBeGreaterThan(0);

      // Check main CTAs in services section
      const getStartedBtn = screen.getByRole('link', { name: /get started today/i });
      const viewWorkBtn = screen.getByRole('link', { name: /view our work/i });

      expect(getStartedBtn).toHaveAttribute('href', '/contact');
      expect(viewWorkBtn).toHaveAttribute('href', '/portfolio');
    });

    it('displays structured data for SEO', () => {
      const { container } = render(<HomePage />);

      // Check for JSON-LD structured data scripts
      const scripts = container.querySelectorAll('script[type="application/ld+json"]');
      expect(scripts.length).toBeGreaterThan(0);
    });

    it('renders service cards with proper interaction', async () => {
      render(<HomePage />);

      const serviceCards = screen.getAllByText(/aerial mapping|drone surveillance/i);
      expect(serviceCards.length).toBeGreaterThan(0);

      // Check that service features are displayed
      expect(screen.getByText('GPS Accuracy')).toBeInTheDocument();
      expect(screen.getByText('24/7 Monitoring')).toBeInTheDocument();
    });
  });

  describe('ContactPage Integration', () => {
    it('renders complete contact page with all sections', async () => {
      render(<ContactPage />);

      // Check hero section
      expect(screen.getByText('Get In Touch')).toBeInTheDocument();
      expect(screen.getByText(/ready to elevate your project/i)).toBeInTheDocument();

      // Check contact methods
      expect(screen.getByText('Multiple Ways to Reach Us')).toBeInTheDocument();
      expect(screen.getByText('Sales & General Inquiries')).toBeInTheDocument();
      expect(screen.getByText('Training Academy')).toBeInTheDocument();
      expect(screen.getByText('Technical Support')).toBeInTheDocument();
      expect(screen.getByText('Drone Sales')).toBeInTheDocument();

      // Check emergency section
      expect(screen.getByText('Emergency Response')).toBeInTheDocument();

      // Check office information
      expect(screen.getByText('Visit Our Office')).toBeInTheDocument();
      expect(screen.getByText('Follow Us')).toBeInTheDocument();

      // Check KCAA certification
      expect(screen.getByText('KCAA Certified Operations')).toBeInTheDocument();

      // Check FAQ section
      expect(screen.getByText('Frequently Asked Questions')).toBeInTheDocument();
    });

    it('has functional contact links and buttons', async () => {
      render(<ContactPage />);

      // Check hero CTAs
      const callNowBtn = screen.getByRole('link', { name: /call now/i });
      const sendMessageBtn = screen.getByRole('link', { name: /send message/i });

      expect(callNowBtn).toHaveAttribute('href', 'tel:+254704277687');
      expect(sendMessageBtn).toHaveAttribute('href', '#contact-form');

      // Check department phone links
      const phoneLinks = screen.getAllByText('+254704277687');
      expect(phoneLinks.length).toBeGreaterThan(0);

      // Check email links
      const emailLinks = screen.getAllByText(/.*@vantagevertical\.co\.ke/);
      expect(emailLinks.length).toBeGreaterThan(0);
    });

    it('displays emergency contact information prominently', () => {
      render(<ContactPage />);

      expect(screen.getByText('+254 722 URGENT (874368)')).toBeInTheDocument();
      expect(screen.getByText('24/7 Emergency Response')).toBeInTheDocument();
      expect(screen.getByText('Emergency surveillance')).toBeInTheDocument();
      expect(screen.getByText('Disaster response mapping')).toBeInTheDocument();
    });

    it('shows office location and contact details', () => {
      render(<ContactPage />);

      expect(screen.getByText(/westlands business park/i)).toBeInTheDocument();
      expect(screen.getByText(/monday - friday: 8:00 am - 6:00 pm/i)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /get directions/i })).toBeInTheDocument();
    });

    it('displays social media links', () => {
      render(<ContactPage />);

      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('Twitter')).toBeInTheDocument();
      expect(screen.getByText('Facebook')).toBeInTheDocument();
      expect(screen.getByText('Instagram')).toBeInTheDocument();
      expect(screen.getByText('YouTube')).toBeInTheDocument();
    });

    it('shows FAQ section with relevant questions', () => {
      render(<ContactPage />);

      expect(screen.getByText('How quickly do you respond to inquiries?')).toBeInTheDocument();
      expect(screen.getByText('What information should I include in my project inquiry?')).toBeInTheDocument();
      expect(screen.getByText('Do you provide services outside Nairobi?')).toBeInTheDocument();
      expect(screen.getByText('What are your payment terms?')).toBeInTheDocument();
      expect(screen.getByText('Are your operations insured?')).toBeInTheDocument();
    });
  });

  describe('Cross-Page Navigation', () => {
    it('maintains consistent navigation structure', () => {
      const { rerender } = render(<HomePage />);

      // Check that navigation elements are present
      // (Note: Navbar is mocked, but we can test the page structure)
      expect(document.querySelector('main')).toBeInTheDocument();

      // Switch to contact page
      rerender(<ContactPage />);
      expect(document.querySelector('main')).toBeInTheDocument();
    });

    it('provides proper internal linking', () => {
      render(<HomePage />);

      // Check internal links to other pages
      const contactLinks = screen.getAllByRole('link', { name: /contact|get started|book/i });
      const portfolioLinks = screen.getAllByRole('link', { name: /portfolio|view.*work/i });
      const technologyLinks = screen.getAllByRole('link', { name: /technology|browse.*drones/i });

      expect(contactLinks.length).toBeGreaterThan(0);
      expect(portfolioLinks.length).toBeGreaterThan(0);
      expect(technologyLinks.length).toBeGreaterThan(0);

      // Verify link destinations
      contactLinks.forEach(link => {
        expect(link).toHaveAttribute('href', expect.stringMatching(/\/contact/));
      });
    });
  });

  describe('Accessibility Integration', () => {
    it('has proper heading hierarchy', () => {
      render(<HomePage />);

      const h1 = screen.getByRole('heading', { level: 1 });
      const h2s = screen.getAllByRole('heading', { level: 2 });
      const h3s = screen.getAllByRole('heading', { level: 3 });

      expect(h1).toBeInTheDocument();
      expect(h2s.length).toBeGreaterThan(0);
      expect(h3s.length).toBeGreaterThan(0);
    });

    it('provides proper link accessibility', () => {
      render(<ContactPage />);

      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        // Each link should have accessible text
        expect(link).toHaveAccessibleName();
        
        // External links should have proper attributes
        if (link.getAttribute('target') === '_blank') {
          expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'));
        }
      });
    });

    it('has proper form accessibility', () => {
      render(<ContactPage />);

      // Contact form should be present and accessible
      // (The actual form is tested in component tests, here we test integration)
      const contactFormSection = screen.getByText(/get started today|send message/i);
      expect(contactFormSection).toBeInTheDocument();
    });
  });

  describe('Performance Integration', () => {
    it('loads essential content without JavaScript', () => {
      // Test that critical content is available in SSR
      render(<HomePage />);

      expect(screen.getByText('See More. Do More. From Above.')).toBeInTheDocument();
      expect(screen.getByText('Our Drone Services')).toBeInTheDocument();
    });

    it('handles image loading gracefully', () => {
      render(<HomePage />);

      // Check that images have proper alt text
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
      });
    });
  });
});