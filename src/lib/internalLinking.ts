// Internal Linking Strategy Utilities

export interface InternalLink {
  text: string;
  url: string;
  keywords: string[];
  context: string;
}

// Define internal links for target keywords
export const keywordLinks: InternalLink[] = [
  {
    text: 'aerial drone mapping services',
    url: '/technology',
    keywords: ['aerial drone mapping services', 'mapping', 'surveying'],
    context: 'services'
  },
  {
    text: 'agritech drone solutions',
    url: '/technology',
    keywords: ['agritech drone solutions', 'precision agriculture', 'farming'],
    context: 'agriculture'
  },
  {
    text: 'drone crop spraying',
    url: '/technology',
    keywords: ['drone crop spraying', 'precision spraying', 'agricultural spraying'],
    context: 'agriculture'
  },
  {
    text: 'drone surveillance company Kenya',
    url: '/technology',
    keywords: ['drone surveillance company Kenya', 'surveillance', 'security'],
    context: 'surveillance'
  },
  {
    text: 'precision agriculture Kenya',
    url: '/technology',
    keywords: ['precision agriculture Kenya', 'smart farming', 'agricultural technology'],
    context: 'agriculture'
  },
  {
    text: 'buy drones in Kenya',
    url: '/drones',
    keywords: ['buy drones in Kenya', 'drone sales', 'purchase drones'],
    context: 'sales'
  },
  {
    text: 'commercial drone services',
    url: '/technology',
    keywords: ['commercial drone services', 'business drone services', 'professional drones'],
    context: 'commercial'
  },
  {
    text: 'NDVI crop health scans',
    url: '/technology',
    keywords: ['NDVI crop health scans', 'crop monitoring', 'agricultural analysis'],
    context: 'agriculture'
  },
  {
    text: 'drone training in Kenya',
    url: '/training',
    keywords: ['drone training in Kenya', 'pilot certification', 'drone courses'],
    context: 'training'
  },
  {
    text: 'KCAA certified drone pilots',
    url: '/about',
    keywords: ['KCAA certified drone pilots', 'certified pilots', 'professional pilots'],
    context: 'certification'
  }
];

// Service-specific internal links
export const serviceLinks = {
  mapping: [
    { text: 'aerial drone mapping services', url: '/technology' },
    { text: 'construction progress monitoring', url: '/portfolio' },
    { text: 'topographical surveys', url: '/contact?service=aerial-mapping' }
  ],
  agriculture: [
    { text: 'precision agriculture Kenya', url: '/technology' },
    { text: 'NDVI crop health scans', url: '/technology' },
    { text: 'drone crop spraying', url: '/technology' },
    { text: 'agritech drone solutions', url: '/technology' }
  ],
  surveillance: [
    { text: 'drone surveillance company Kenya', url: '/technology' },
    { text: 'security monitoring services', url: '/portfolio' },
    { text: 'thermal imaging surveillance', url: '/contact?service=surveillance' }
  ],
  commercial: [
    { text: 'commercial drone services', url: '/technology' },
    { text: 'aerial photography', url: '/portfolio' },
    { text: 'real estate showcases', url: '/contact?service=commercial' }
  ],
  training: [
    { text: 'drone training in Kenya', url: '/training' },
    { text: 'KCAA pilot certification', url: '/training' },
    { text: 'professional drone courses', url: '/training' }
  ],
  sales: [
    { text: 'buy drones in Kenya', url: '/drones' },
    { text: 'professional drone equipment', url: '/drones' },
    { text: 'drone sales consultation', url: '/contact?service=drone-sales' }
  ]
};

// Page-specific internal linking suggestions
export const pageInternalLinks = {
  home: [
    'Learn more about our <a href="/technology" class="text-primary hover:text-red-700 font-medium">aerial drone mapping services</a> and advanced technology.',
    'Discover our <a href="/training" class="text-primary hover:text-red-700 font-medium">drone training in Kenya</a> programs for aspiring pilots.',
    'Explore our <a href="/drones" class="text-primary hover:text-red-700 font-medium">professional drone equipment</a> available for purchase.',
    'View our <a href="/portfolio" class="text-primary hover:text-red-700 font-medium">successful projects</a> across various industries.'
  ],
  about: [
    'Our <a href="/technology" class="text-primary hover:text-red-700 font-medium">agritech drone solutions</a> help farmers optimize yields.',
    'We offer comprehensive <a href="/training" class="text-primary hover:text-red-700 font-medium">drone training in Kenya</a> programs.',
    'Browse our <a href="/drones" class="text-primary hover:text-red-700 font-medium">professional drone equipment</a> for sale.',
    'Contact us for <a href="/contact" class="text-primary hover:text-red-700 font-medium">project consultation</a> and quotes.'
  ],
  technology: [
    'See our <a href="/portfolio" class="text-primary hover:text-red-700 font-medium">portfolio of successful projects</a> using these technologies.',
    'Learn to operate these systems through our <a href="/training" class="text-primary hover:text-red-700 font-medium">drone training in Kenya</a> programs.',
    'Purchase professional equipment from our <a href="/drones" class="text-primary hover:text-red-700 font-medium">drone sales</a> section.',
    'Get started with our services by <a href="/contact" class="text-primary hover:text-red-700 font-medium">contacting our team</a>.'
  ],
  training: [
    'Apply your skills with our <a href="/technology" class="text-primary hover:text-red-700 font-medium">professional drone services</a>.',
    'View <a href="/portfolio" class="text-primary hover:text-red-700 font-medium">real-world applications</a> of drone technology.',
    'Purchase training equipment from our <a href="/drones" class="text-primary hover:text-red-700 font-medium">drone sales</a> section.',
    'Learn about our <a href="/about" class="text-primary hover:text-red-700 font-medium">KCAA certified instructors</a>.'
  ],
  portfolio: [
    'Learn more about our <a href="/technology" class="text-primary hover:text-red-700 font-medium">service capabilities</a> and technology.',
    'Get similar results for your project by <a href="/contact" class="text-primary hover:text-red-700 font-medium">contacting us</a>.',
    'Master these techniques through our <a href="/training" class="text-primary hover:text-red-700 font-medium">training programs</a>.',
    'Explore our <a href="/drones" class="text-primary hover:text-red-700 font-medium">equipment options</a> for your needs.'
  ],
  contact: [
    'Learn about our <a href="/technology" class="text-primary hover:text-red-700 font-medium">service offerings</a> and capabilities.',
    'View our <a href="/portfolio" class="text-primary hover:text-red-700 font-medium">previous work</a> and success stories.',
    'Consider our <a href="/training" class="text-primary hover:text-red-700 font-medium">training programs</a> for your team.',
    'Browse our <a href="/drones" class="text-primary hover:text-red-700 font-medium">equipment catalog</a> for purchases.'
  ],
  drones: [
    'Learn about our <a href="/technology" class="text-primary hover:text-red-700 font-medium">professional services</a> using this equipment.',
    'See these drones in action in our <a href="/portfolio" class="text-primary hover:text-red-700 font-medium">project portfolio</a>.',
    'Get trained on this equipment through our <a href="/training" class="text-primary hover:text-red-700 font-medium">certification programs</a>.',
    'Contact us for <a href="/contact" class="text-primary hover:text-red-700 font-medium">consultation and support</a>.'
  ]
};

// Function to get relevant internal links for a page
export function getInternalLinksForPage(pageName: string): string[] {
  return pageInternalLinks[pageName as keyof typeof pageInternalLinks] || [];
}

// Function to get keyword-specific links
export function getKeywordLinks(keywords: string[]): InternalLink[] {
  return keywordLinks.filter(link => 
    keywords.some(keyword => 
      link.keywords.some(linkKeyword => 
        linkKeyword.toLowerCase().includes(keyword.toLowerCase()) ||
        keyword.toLowerCase().includes(linkKeyword.toLowerCase())
      )
    )
  );
}

// Function to generate contextual internal links
export function generateContextualLinks(context: string): InternalLink[] {
  return keywordLinks.filter(link => link.context === context);
}

// SEO-optimized anchor text variations
export const anchorTextVariations = {
  'aerial drone mapping services': [
    'aerial drone mapping services',
    'professional aerial mapping',
    'drone surveying services',
    'aerial topographical surveys'
  ],
  'agritech drone solutions': [
    'agritech drone solutions',
    'precision agriculture services',
    'agricultural drone technology',
    'smart farming solutions'
  ],
  'drone crop spraying': [
    'drone crop spraying',
    'precision spraying services',
    'agricultural spraying solutions',
    'targeted crop application'
  ],
  'drone surveillance company Kenya': [
    'drone surveillance company Kenya',
    'professional surveillance services',
    'security drone operations',
    'aerial monitoring solutions'
  ],
  'precision agriculture Kenya': [
    'precision agriculture Kenya',
    'smart farming Kenya',
    'agricultural technology services',
    'crop optimization solutions'
  ],
  'buy drones in Kenya': [
    'buy drones in Kenya',
    'purchase professional drones',
    'drone equipment sales',
    'commercial drone purchases'
  ],
  'commercial drone services': [
    'commercial drone services',
    'business drone solutions',
    'professional aerial services',
    'enterprise drone operations'
  ],
  'NDVI crop health scans': [
    'NDVI crop health scans',
    'crop health monitoring',
    'agricultural health analysis',
    'vegetation index scanning'
  ],
  'drone training in Kenya': [
    'drone training in Kenya',
    'pilot certification courses',
    'professional drone education',
    'KCAA training programs'
  ]
};

// Function to get varied anchor text
export function getAnchorTextVariation(keyword: string): string {
  const variations = anchorTextVariations[keyword as keyof typeof anchorTextVariations];
  if (variations && variations.length > 0) {
    return variations[Math.floor(Math.random() * variations.length)];
  }
  return keyword;
}