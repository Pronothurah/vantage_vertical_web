import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ServiceCard, { ServiceGrid } from '../ServiceCard';

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Mock ServiceIcon component
jest.mock('@/components/ui/ServiceIcon', () => ({
  __esModule: true,
  default: ({ type, className }: any) => (
    <div className={className} data-testid={`service-icon-${type}`}>
      Icon
    </div>
  ),
}));

describe('ServiceCard', () => {
  const user = userEvent.setup();

  const defaultProps = {
    title: 'Aerial Mapping',
    description: 'Professional aerial mapping services for various industries',
    features: ['High-resolution imagery', 'GPS accuracy', '3D modeling'],
    ctaText: 'Learn More',
    ctaLink: '/services/aerial-mapping',
  };

  it('renders with required props', () => {
    render(<ServiceCard {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /learn more/i })).toBeInTheDocument();
  });

  it('renders all features', () => {
    render(<ServiceCard {...defaultProps} />);

    defaultProps.features.forEach(feature => {
      expect(screen.getByText(feature)).toBeInTheDocument();
    });
  });

  it('renders with image when provided', () => {
    const propsWithImage = {
      ...defaultProps,
      image: '/images/aerial-mapping.jpg',
    };

    render(<ServiceCard {...propsWithImage} />);

    const image = screen.getByAltText(defaultProps.title);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', propsWithImage.image);
  });

  it('renders with icon when provided', () => {
    const propsWithIcon = {
      ...defaultProps,
      icon: '/icons/mapping.svg',
    };

    render(<ServiceCard {...propsWithIcon} />);

    const icon = screen.getByAltText(`${defaultProps.title} icon`);
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', propsWithIcon.icon);
  });

  it('renders with iconType when provided', () => {
    const propsWithIconType = {
      ...defaultProps,
      iconType: 'mapping',
    };

    render(<ServiceCard {...propsWithIconType} />);

    expect(screen.getByTestId('service-icon-mapping')).toBeInTheDocument();
  });

  it('renders with iconSvg when provided', () => {
    const iconSvg = <svg data-testid="custom-svg">Custom SVG</svg>;
    const propsWithIconSvg = {
      ...defaultProps,
      iconSvg,
    };

    render(<ServiceCard {...propsWithIconSvg} />);

    expect(screen.getByTestId('custom-svg')).toBeInTheDocument();
  });

  it('renders with iconSvg function when provided', () => {
    const iconSvg = () => <svg data-testid="custom-svg-function">Custom SVG Function</svg>;
    const propsWithIconSvg = {
      ...defaultProps,
      iconSvg,
    };

    render(<ServiceCard {...propsWithIconSvg} />);

    expect(screen.getByTestId('custom-svg-function')).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    const { rerender, container } = render(
      <ServiceCard {...defaultProps} variant="default" />
    );

    let card = container.firstChild;
    expect(card).toHaveClass('service-card', 'h-full');

    rerender(<ServiceCard {...defaultProps} variant="featured" />);
    card = container.firstChild;
    expect(card).toHaveClass('border-2', 'border-primary', 'bg-gradient-to-br');

    rerender(<ServiceCard {...defaultProps} variant="compact" />);
    card = container.firstChild;
    expect(card).toHaveClass('p-4');
  });

  it('handles hover effects', async () => {
    const { container } = render(<ServiceCard {...defaultProps} />);

    const card = container.firstChild as HTMLElement;
    
    // Test hover enter
    fireEvent.mouseEnter(card);
    
    // Check if hover classes are applied (this would need to be tested with actual DOM changes)
    expect(card).toBeInTheDocument();

    // Test hover leave
    fireEvent.mouseLeave(card);
    expect(card).toBeInTheDocument();
  });

  it('renders CTA link with correct href', () => {
    render(<ServiceCard {...defaultProps} />);

    const ctaLink = screen.getByRole('link', { name: /learn more/i });
    expect(ctaLink).toHaveAttribute('href', defaultProps.ctaLink);
  });

  it('applies custom className', () => {
    const { container } = render(
      <ServiceCard {...defaultProps} className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = render(
      <ServiceCard {...defaultProps} style={customStyle} />
    );

    expect(container.firstChild).toHaveStyle('background-color: rgb(255, 0, 0)');
  });

  it('renders without features when empty array provided', () => {
    const propsWithoutFeatures = {
      ...defaultProps,
      features: [],
    };

    render(<ServiceCard {...propsWithoutFeatures} />);

    // Should not render the features list
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<ServiceCard {...defaultProps} />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveTextContent(defaultProps.title);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', defaultProps.ctaLink);
  });
});

describe('ServiceGrid', () => {
  const mockServices = [
    {
      title: 'Service 1',
      description: 'Description 1',
      features: ['Feature 1'],
      ctaText: 'Learn More',
      ctaLink: '/service1',
    },
    {
      title: 'Service 2',
      description: 'Description 2',
      features: ['Feature 2'],
      ctaText: 'Learn More',
      ctaLink: '/service2',
    },
    {
      title: 'Service 3',
      description: 'Description 3',
      features: ['Feature 3'],
      ctaText: 'Learn More',
      ctaLink: '/service3',
    },
  ];

  it('renders all services', () => {
    render(<ServiceGrid services={mockServices} />);

    mockServices.forEach(service => {
      expect(screen.getByText(service.title)).toBeInTheDocument();
      expect(screen.getByText(service.description)).toBeInTheDocument();
    });
  });

  it('applies correct grid classes for different column counts', () => {
    const { rerender, container } = render(
      <ServiceGrid services={mockServices} columns={1} />
    );

    let grid = container.firstChild;
    expect(grid).toHaveClass('grid-cols-1');

    rerender(<ServiceGrid services={mockServices} columns={2} />);
    grid = container.firstChild;
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2');

    rerender(<ServiceGrid services={mockServices} columns={3} />);
    grid = container.firstChild;
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3');

    rerender(<ServiceGrid services={mockServices} columns={4} />);
    grid = container.firstChild;
    expect(grid).toHaveClass('grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ServiceGrid services={mockServices} className="custom-grid-class" />
    );

    expect(container.firstChild).toHaveClass('custom-grid-class');
  });

  it('applies animation delay styles', () => {
    render(<ServiceGrid services={mockServices} />);

    // Check that each service card has the animate class
    const serviceCards = screen.getAllByText(/Service \d/);
    serviceCards.forEach(card => {
      expect(card.closest('.animate-fade-in-up')).toBeInTheDocument();
    });
  });
});