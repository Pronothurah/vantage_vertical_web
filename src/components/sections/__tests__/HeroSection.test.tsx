import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HeroSection from '../HeroSection';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock Next.js Link component
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('HeroSection', () => {
  const user = userEvent.setup();

  const defaultProps = {
    title: 'See More. Do More. From Above.',
    subtitle: 'Professional drone services for aerial mapping, surveillance, and agritech solutions',
    backgroundImage: '/images/hero-bg.jpg',
    ctaText: 'Get Started',
    ctaLink: '/contact',
  };

  it('renders with required props', () => {
    render(<HeroSection {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.subtitle)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: defaultProps.ctaText })).toBeInTheDocument();
  });

  it('renders background image correctly', () => {
    render(<HeroSection {...defaultProps} />);

    const backgroundImage = screen.getByAltText('Hero background');
    expect(backgroundImage).toBeInTheDocument();
    expect(backgroundImage).toHaveAttribute('src', defaultProps.backgroundImage);
  });

  it('renders CTA button with correct link', () => {
    render(<HeroSection {...defaultProps} />);

    const ctaButton = screen.getByRole('link', { name: defaultProps.ctaText });
    expect(ctaButton).toHaveAttribute('href', defaultProps.ctaLink);
  });

  it('renders optional tagline when provided', () => {
    const tagline = 'Elevate Your Perspective';
    render(<HeroSection {...defaultProps} tagline={tagline} />);

    expect(screen.getByText(tagline)).toBeInTheDocument();
  });

  it('does not render tagline when not provided', () => {
    render(<HeroSection {...defaultProps} />);

    // Should not find any tagline text
    expect(screen.queryByText('Elevate Your Perspective')).not.toBeInTheDocument();
  });

  it('has proper heading hierarchy', () => {
    render(<HeroSection {...defaultProps} />);

    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toHaveTextContent(defaultProps.title);
  });

  it('applies proper CSS classes for styling', () => {
    const { container } = render(<HeroSection {...defaultProps} />);

    const heroSection = container.firstChild;
    expect(heroSection).toHaveClass('relative', 'h-screen', 'flex', 'flex-col', 'justify-center', 'overflow-hidden');
  });

  it('has proper accessibility attributes', () => {
    const { container } = render(<HeroSection {...defaultProps} />);

    // The section element should be present
    const heroSection = container.querySelector('section');
    expect(heroSection).toBeInTheDocument();

    const ctaButton = screen.getByRole('link', { name: defaultProps.ctaText });
    expect(ctaButton).toHaveClass('btn-primary');
  });

  it('handles long titles gracefully', () => {
    const longTitle = 'This is a very long title that should still render properly and maintain good typography and spacing';
    render(<HeroSection {...defaultProps} title={longTitle} />);

    expect(screen.getByText(longTitle)).toBeInTheDocument();
  });

  it('handles long subtitles gracefully', () => {
    const longSubtitle = 'This is a very long subtitle that describes our comprehensive drone services including aerial mapping, surveillance, agritech solutions, commercial photography, and training programs for various industries';
    render(<HeroSection {...defaultProps} subtitle={longSubtitle} />);

    expect(screen.getByText(longSubtitle)).toBeInTheDocument();
  });

  it('renders multiple CTA buttons when provided', () => {
    const propsWithMultipleCTAs = {
      ...defaultProps,
      secondaryCtaText: 'Learn More',
      secondaryCtaLink: '/about',
    };

    render(<HeroSection {...propsWithMultipleCTAs} />);

    expect(screen.getByRole('link', { name: 'Get Started' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Learn More' })).toBeInTheDocument();
  });

  it('has proper responsive design classes', () => {
    const { container } = render(<HeroSection {...defaultProps} />);

    // Check for responsive text classes on the span inside the h1
    const titleSpan = container.querySelector('h1 span');
    expect(titleSpan).toHaveClass('text-2xl', 'sm:text-2xl', 'md:text-3xl', 'lg:text-3xl', 'xl:text-4xl');
  });
});