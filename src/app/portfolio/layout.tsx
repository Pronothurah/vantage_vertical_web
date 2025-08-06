import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portfolio - Vantage Vertical | Drone Services Kenya',
  description: 'View our comprehensive portfolio of drone photography, aerial mapping, surveillance, and agritech projects across Kenya. See case studies with measurable results and client testimonials.',
  keywords: [
    'drone portfolio Kenya',
    'aerial photography projects',
    'drone mapping case studies',
    'agricultural drone services',
    'surveillance projects Kenya',
    'commercial drone photography',
    'precision agriculture results',
    'drone service testimonials'
  ],
  openGraph: {
    title: 'Portfolio - Vantage Vertical Drone Services',
    description: 'Explore our portfolio of successful drone projects across Kenya including aerial mapping, agritech solutions, surveillance, and commercial photography.',
    type: 'website',
    url: 'https://vantagevertical.co.ke/portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Vantage Vertical Portfolio - Drone Services Kenya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio - Vantage Vertical Drone Services',
    description: 'Explore our portfolio of successful drone projects across Kenya including aerial mapping, agritech solutions, surveillance, and commercial photography.',
    images: ['/og-image.jpg'],
  },
  alternates: {
    canonical: 'https://vantagevertical.co.ke/portfolio',
  },
};

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}