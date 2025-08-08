import type { Metadata } from 'next';

// SEO configuration and utilities

export interface PageConfig {
  title: string;
  description: string;
  keywords: string[];
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    type?: string;
  };
  structuredData?: any;
}

export const pageConfigs: Record<string, PageConfig> = {
  home: {
    title: 'Vantage Vertical - Professional Drone Services in Kenya',
    description: 'Leading drone services provider in Kenya offering aerial mapping, surveillance, agritech solutions, and commercial drone services. KCAA certified pilots.',
    keywords: [
      'drone services Kenya',
      'aerial mapping',
      'drone surveillance',
      'agritech solutions',
      'commercial drone services',
      'KCAA certified',
      'precision agriculture',
      'aerial photography'
    ],
    openGraph: {
      title: 'Vantage Vertical - Professional Drone Services',
      description: 'See More. Do More. From Above. Professional drone services for aerial mapping, surveillance, and agritech solutions in Kenya.',
      image: '/og-image.jpg',
      type: 'website'
    }
  },
  about: {
    title: 'About Us - Vantage Vertical Drone Services',
    description: 'Learn about Vantage Vertical, Kenya\'s leading drone services company. Our KCAA certified team provides professional aerial solutions.',
    keywords: ['about vantage vertical', 'drone company Kenya', 'KCAA certified pilots', 'aerial services team'],
  },
  portfolio: {
    title: 'Portfolio - Vantage Vertical Projects',
    description: 'Explore our portfolio of successful drone projects including aerial mapping, surveillance, and agritech solutions across Kenya.',
    keywords: ['drone portfolio', 'aerial mapping projects', 'surveillance projects', 'agritech case studies'],
  },
  technology: {
    title: 'Technology & Services - Vantage Vertical',
    description: 'Discover our advanced drone technology and comprehensive services including aerial mapping, surveillance, agritech, and commercial solutions.',
    keywords: ['drone technology', 'aerial mapping services', 'drone surveillance', 'agritech solutions', 'commercial drone services'],
  },
  training: {
    title: 'Drone Training Programs - Vantage Vertical',
    description: 'Professional drone training programs and certification courses. Learn from KCAA certified instructors and advance your drone skills.',
    keywords: ['drone training Kenya', 'KCAA certification', 'drone pilot training', 'aerial photography course'],
  },
  blog: {
    title: 'Blog - Vantage Vertical Insights',
    description: 'Stay updated with the latest drone technology trends, industry insights, and best practices from Vantage Vertical experts.',
    keywords: ['drone blog', 'aerial technology news', 'drone industry insights', 'precision agriculture tips'],
  },
  contact: {
    title: 'Contact Us - Vantage Vertical',
    description: 'Get in touch with Vantage Vertical for professional drone services. Request a quote or consultation for your aerial project needs.',
    keywords: ['contact drone services', 'drone quote Kenya', 'aerial services consultation', 'drone project inquiry'],
  },
  drones: {
    title: 'Professional Drones for Sale - Vantage Vertical',
    description: 'Buy professional drones in Kenya with expert support, training, and warranty. DJI, Autel, and other commercial-grade drones for agriculture, mapping, and surveillance.',
    keywords: [
      'buy drones Kenya',
      'professional drones for sale',
      'DJI drones Kenya',
      'commercial drones',
      'agricultural drones',
      'mapping drones',
      'surveillance drones',
      'drone sales Kenya',
      'KCAA compliant drones'
    ],
    openGraph: {
      title: 'Professional Drones for Sale in Kenya',
      description: 'Discover our curated selection of commercial-grade drones with expert consultation, training, and comprehensive support.',
      image: '/drone_on_black_background.jpg',
      type: 'website'
    }
  }
};

export function generateMetadata(config: PageConfig): Metadata {
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords.join(', '),
    openGraph: {
      title: config.openGraph?.title || config.title,
      description: config.openGraph?.description || config.description,
      images: config.openGraph?.image ? [config.openGraph.image] : undefined,
      type: config.openGraph?.type as any || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config.openGraph?.title || config.title,
      description: config.openGraph?.description || config.description,
      images: config.openGraph?.image ? [config.openGraph.image] : undefined,
    },
  };
}

export interface ServiceSchemaData {
  name: string;
  description: string;
  serviceType: string;
  areaServed: string;
  provider?: {
    name: string;
    url: string;
  };
}

export function generateServiceSchema(data: ServiceSchemaData) {
  return {
    '@type': 'Service',
    name: data.name,
    description: data.description,
    serviceType: data.serviceType,
    areaServed: {
      '@type': 'Country',
      name: data.areaServed,
    },
    provider: data.provider || {
      '@type': 'Organization',
      name: 'Vantage Vertical',
      url: 'https://vantagevertical.co.ke',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Vantage Vertical',
    url: 'https://vantagevertical.co.ke',
    logo: 'https://vantagevertical.co.ke/vantage-logo.png',
    description: 'Professional drone services provider in Kenya offering aerial mapping, surveillance, agritech solutions, and commercial drone services.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Kenya',
      addressLocality: 'Nairobi',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+254-XXX-XXXX',
      contactType: 'customer service',
      availableLanguage: ['English', 'Swahili'],
    },
    sameAs: [
      'https://facebook.com/vantagevertical',
      'https://twitter.com/vantagevertical',
      'https://linkedin.com/company/vantagevertical',
    ],
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export interface ArticleSchemaData {
  title: string;
  description: string;
  author: string;
  publishedAt: Date;
  modifiedAt?: Date;
  image: string;
  url: string;
  keywords: string[];
}

export function generateArticleSchema(data: ArticleSchemaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: data.title,
    description: data.description,
    image: data.image,
    author: {
      '@type': 'Person',
      name: data.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vantage Vertical',
      logo: {
        '@type': 'ImageObject',
        url: 'https://vantagevertical.co.ke/vantage-logo.png',
      },
    },
    datePublished: data.publishedAt.toISOString(),
    dateModified: (data.modifiedAt || data.publishedAt).toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.url,
    },
    keywords: data.keywords.join(', '),
  };
}

export interface ProductSchemaData {
  name: string;
  description: string;
  brand: string;
  price: number;
  currency: string;
  availability: string;
  condition: string;
  image: string;
  url: string;
  category: string;
  features: string[];
}

export function generateProductSchema(data: ProductSchemaData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: data.name,
    description: data.description,
    brand: {
      '@type': 'Brand',
      name: data.brand,
    },
    offers: {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.currency,
      availability: data.availability,
      itemCondition: data.condition,
      url: data.url,
    },
    image: data.image,
    category: data.category,
    additionalProperty: data.features.map(feature => ({
      '@type': 'PropertyValue',
      name: 'Feature',
      value: feature,
    })),
    manufacturer: {
      '@type': 'Organization',
      name: 'Vantage Vertical',
      url: 'https://vantagevertical.co.ke',
    },
  };
}

export const defaultSEOConfig = {
  siteName: 'Vantage Vertical',
  siteUrl: 'https://vantagevertical.co.ke',
  defaultTitle: 'Vantage Vertical - Professional Drone Services in Kenya',
  defaultDescription: 'Leading drone services provider in Kenya offering aerial mapping, surveillance, agritech solutions, and commercial drone services.',
  defaultImage: '/og-image.jpg',
  twitterHandle: '@vantagevertical',
};