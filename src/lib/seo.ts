import type { Metadata } from 'next';

// SEO Configuration and Utilities

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  noindex?: boolean;
  nofollow?: boolean;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: 'website' | 'article' | 'product';
    publishedTime?: string;
    modifiedTime?: string;
    author?: string;
    section?: string;
    tags?: string[];
  };
  twitter?: {
    title?: string;
    description?: string;
    image?: string;
    creator?: string;
  };
  structuredData?: any;
}

// Base site configuration
export const siteConfig = {
  name: 'Vantage Vertical',
  description: 'Leading drone services company in Kenya offering aerial mapping, surveillance, agritech solutions, commercial photography, and drone training programs. KCAA certified pilots with advanced technology.',
  url: 'https://vantagevertical.co.ke',
  ogImage: '/og-image.jpg',
  twitterHandle: '@vantagevertical',
  keywords: [
    'drone services Kenya',
    'aerial mapping Kenya',
    'drone surveillance company Kenya',
    'agritech drone solutions',
    'precision agriculture Kenya',
    'commercial drone photography',
    'drone training Kenya',
    'NDVI crop health scans',
    'buy drones Kenya',
    'drone crop spraying',
    'KCAA certified drone pilots',
    'aerial intelligence Kenya',
    'construction drone surveys',
    'real estate drone photography',
    'security drone surveillance'
  ]
};

// Generate metadata for Next.js pages
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    noindex = false,
    nofollow = false,
    openGraph,
    twitter,
  } = config;

  const fullTitle = title.includes(siteConfig.name) ? title : `${title} | ${siteConfig.name}`;
  const canonicalUrl = canonical ? `${siteConfig.url}${canonical}` : undefined;

  return {
    title: fullTitle,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    robots: {
      index: !noindex,
      follow: !nofollow,
      nocache: false,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        noimageindex: false,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: canonicalUrl ? {
      canonical: canonicalUrl,
    } : undefined,
    openGraph: {
      type: (openGraph?.type === 'product' ? 'website' : openGraph?.type) || 'website',
      locale: 'en_KE',
      url: canonicalUrl || siteConfig.url,
      title: openGraph?.title || fullTitle,
      description: openGraph?.description || description,
      siteName: siteConfig.name,
      images: [
        {
          url: openGraph?.image || siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: openGraph?.title || fullTitle,
        },
      ],
      ...(openGraph?.type === 'article' && {
        publishedTime: openGraph.publishedTime,
        modifiedTime: openGraph.modifiedTime,
        authors: openGraph.author ? [openGraph.author] : undefined,
        section: openGraph.section,
        tags: openGraph.tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitterHandle,
      creator: twitter?.creator || siteConfig.twitterHandle,
      title: twitter?.title || fullTitle,
      description: twitter?.description || description,
      images: [twitter?.image || openGraph?.image || siteConfig.ogImage],
    },
  };
}

// Page-specific SEO configurations
export const pageConfigs = {
  home: {
    title: 'Vantage Vertical - Professional Drone Services in Kenya',
    description: 'Leading drone services company in Kenya offering aerial mapping, surveillance, agritech solutions, commercial photography, and drone training programs. KCAA certified pilots with advanced technology.',
    keywords: [
      'drone services Kenya',
      'aerial mapping',
      'drone surveillance',
      'agritech solutions',
      'commercial drone photography',
      'KCAA certified pilots'
    ],
    canonical: '/',
  },
  about: {
    title: 'About Vantage Vertical - Kenya\'s Leading Drone Services Company',
    description: 'Learn about Vantage Vertical\'s mission, KCAA-certified team, and commitment to excellence in aerial mapping, surveillance, and agricultural drone services across Kenya.',
    keywords: [
      'about vantage vertical',
      'drone company kenya',
      'KCAA certified pilots',
      'aerial services team',
      'drone technology experts'
    ],
    canonical: '/about',
  },
  portfolio: {
    title: 'Portfolio - Drone Projects & Case Studies | Vantage Vertical',
    description: 'Explore our portfolio of successful drone projects including aerial mapping, agricultural surveys, surveillance operations, and commercial photography across Kenya.',
    keywords: [
      'drone portfolio Kenya',
      'aerial mapping projects',
      'drone case studies',
      'agricultural drone surveys',
      'commercial drone photography'
    ],
    canonical: '/portfolio',
  },
  technology: {
    title: 'Technology & Services - Advanced Drone Solutions | Vantage Vertical',
    description: 'Discover our advanced drone technology, aerial mapping services, surveillance solutions, and agritech capabilities. Professional equipment and certified operations.',
    keywords: [
      'drone technology Kenya',
      'aerial mapping services',
      'drone surveillance solutions',
      'agritech drone capabilities',
      'professional drone equipment'
    ],
    canonical: '/technology',
  },
  training: {
    title: 'Professional Drone Training Programs | Vantage Vertical',
    description: 'Master drone operations with KCAA-certified training programs. From basic pilot certification to advanced agricultural and commercial operations. Expert instructors, modern facilities.',
    keywords: [
      'drone training Kenya',
      'KCAA drone certification',
      'pilot training programs',
      'drone operator courses',
      'aerial photography training'
    ],
    canonical: '/training',
  },
  blog: {
    title: 'Blog - Drone Industry Insights & News | Vantage Vertical',
    description: 'Stay updated with the latest drone technology trends, industry insights, project case studies, and agricultural innovation news from Kenya\'s leading drone experts.',
    keywords: [
      'drone blog Kenya',
      'aerial technology news',
      'agritech insights',
      'drone industry trends',
      'precision agriculture news'
    ],
    canonical: '/blog',
  },
  contact: {
    title: 'Contact Vantage Vertical - Get Professional Drone Services Quote',
    description: 'Contact Kenya\'s leading drone services company for aerial mapping, surveillance, agritech solutions, and training. KCAA certified pilots ready to help with your project.',
    keywords: [
      'contact drone services Kenya',
      'drone services quote',
      'aerial mapping consultation',
      'drone project inquiry',
      'KCAA certified drone operators'
    ],
    canonical: '/contact',
  },
  drones: {
    title: 'Professional Drones for Sale - Vantage Vertical Kenya',
    description: 'Buy professional drones in Kenya. Commercial, agricultural, and surveillance drones with specifications, pricing, and expert consultation. KCAA compliant equipment.',
    keywords: [
      'buy drones Kenya',
      'professional drones for sale',
      'commercial drones Kenya',
      'agricultural drones',
      'surveillance drones',
      'drone equipment Kenya'
    ],
    canonical: '/drones',
  },
};

// Structured data generators
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vantage Vertical',
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/vantage_logo_whitebg.jpg`,
    image: `${siteConfig.url}/og-image.jpg`,
    telephone: '+254 700 123 456',
    email: 'info@vantagevertical.co.ke',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Westlands Business Park, Suite 402, Waiyaki Way',
      addressLocality: 'Westlands',
      addressRegion: 'Nairobi',
      addressCountry: 'Kenya',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -1.2634,
      longitude: 36.8063,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Kenya',
    },
    serviceType: [
      'Aerial Mapping',
      'Drone Surveillance',
      'Agricultural Drone Services',
      'Commercial Drone Photography',
      'Drone Training',
      'Drone Sales'
    ],
    foundingDate: '2019',
    numberOfEmployees: '15',
    sameAs: [
      'https://linkedin.com/company/vantage-vertical',
      'https://twitter.com/vantagevertical',
      'https://facebook.com/vantagevertical',
      'https://instagram.com/vantagevertical',
    ],
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'KCAA Drone Operator Certificate',
      credentialCategory: 'Aviation License',
      recognizedBy: {
        '@type': 'Organization',
        name: 'Kenya Civil Aviation Authority',
      },
    },
  };
}

export function generateServiceSchema(service: {
  name: string;
  description: string;
  serviceType: string;
  areaServed?: string;
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
  };
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    serviceType: service.serviceType,
    provider: {
      '@type': 'Organization',
      name: 'Vantage Vertical',
      url: siteConfig.url,
    },
    areaServed: service.areaServed || 'Kenya',
    ...(service.offers && {
      offers: {
        '@type': 'Offer',
        price: service.offers.price,
        priceCurrency: service.offers.priceCurrency || 'KES',
        availability: service.offers.availability || 'https://schema.org/InStock',
      },
    }),
  };
}

export function generateArticleSchema(article: {
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  modifiedAt?: string;
  image: string;
  url: string;
  keywords?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    url: article.url,
    datePublished: article.publishedAt,
    dateModified: article.modifiedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vantage Vertical',
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/vantage_logo_whitebg.jpg`,
      },
    },
    keywords: article.keywords?.join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url,
    },
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  brand: string;
  model?: string;
  price?: number;
  currency?: string;
  availability?: string;
  condition?: string;
  sku?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    model: product.model,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'KES',
      availability: product.availability || 'https://schema.org/InStock',
      itemCondition: product.condition || 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: 'Vantage Vertical',
      },
    },
  };
}

// SEO utility functions
export function generatePageTitle(title: string, includeCompany: boolean = true): string {
  return includeCompany && !title.includes(siteConfig.name) 
    ? `${title} | ${siteConfig.name}` 
    : title;
}

export function truncateDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description;
  return description.substring(0, maxLength - 3).trim() + '...';
}

export function generateKeywords(baseKeywords: string[], additionalKeywords: string[] = []): string[] {
  const combined = [...baseKeywords, ...additionalKeywords];
  return Array.from(new Set(combined));
}

export function generateCanonicalUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}