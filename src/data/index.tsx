import { ServiceOption, UrgencyLevel } from '@/types/forms';

export const serviceOptions: ServiceOption[] = [
  { value: 'aerial-mapping', label: 'Aerial Mapping' },
  { value: 'surveillance', label: 'Surveillance' },
  { value: 'agritech', label: 'Agritech Solutions' },
  { value: 'commercial', label: 'Commercial Services' },
  { value: 'training', label: 'Training Programs' },
  { value: 'drone-sales', label: 'Drone Sales' },
];

export const urgencyLevels: UrgencyLevel[] = [
  { value: 'low', label: 'Low Priority', color: 'text-green-600' },
  { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
  { value: 'high', label: 'High Priority', color: 'text-red-600' },
];

export const contactFormValidation = {
  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters',
    },
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address',
    },
  },
  phone: {
    required: 'Phone number is required',
    pattern: {
      value: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Please enter a valid phone number',
    },
  },
  service: {
    required: 'Please select a service',
  },
  message: {
    required: 'Message is required',
    minLength: {
      value: 10,
      message: 'Message must be at least 10 characters',
    },
    maxLength: {
      value: 1000,
      message: 'Message must not exceed 1000 characters',
    },
  },
  urgency: {
    required: 'Please select urgency level',
  },
};

// Main services data
export const mainServices = [
  {
    title: 'Aerial Mapping',
    description: 'High-precision aerial mapping and surveying services using advanced drone technology for accurate topographical data.',
    icon: '/images/icons/mapping.svg',
    iconType: 'mapping',
    features: [
      'High-resolution orthomosaic maps',
      'Digital elevation models (DEM)',
      '3D point cloud generation',
      'GPS-accurate surveying',
      'Real-time data processing'
    ],
    ctaText: 'Learn More',
    ctaLink: '/technology#aerial-mapping',
    image: '/survey.jpg'
  },
  {
    title: 'Drone Surveillance',
    description: 'Professional surveillance solutions for security, monitoring, and inspection applications across various industries.',
    icon: '/images/icons/surveillance.svg',
    iconType: 'surveillance',
    features: [
      '24/7 monitoring capabilities',
      'Real-time video streaming',
      'Thermal imaging options',
      'Automated patrol routes',
      'Incident detection alerts'
    ],
    ctaText: 'Learn More',
    ctaLink: '/technology#surveillance',
    image: '/drone_on_air.jpg'
  },
  {
    title: 'Agritech Solutions',
    description: 'Precision agriculture services including crop monitoring, health assessment, and yield optimization using drone technology.',
    icon: '/images/icons/agritech.svg',
    iconType: 'agritech',
    features: [
      'NDVI crop health analysis',
      'Precision spraying services',
      'Yield prediction modeling',
      'Irrigation management',
      'Pest and disease detection'
    ],
    ctaText: 'Learn More',
    ctaLink: '/technology#agritech',
    image: '/spray_drone.jpg'
  },
  {
    title: 'Commercial Services',
    description: 'Comprehensive commercial drone services for real estate, construction, events, and marketing applications.',
    icon: '/images/icons/commercial.svg',
    iconType: 'commercial',
    features: [
      'Real estate photography',
      'Construction progress monitoring',
      'Event coverage',
      'Marketing and promotional content',
      'Infrastructure inspection'
    ],
    ctaText: 'Learn More',
    ctaLink: '/technology#commercial',
    image: '/filming.jpg'
  }
];

// Industries we serve
export const industries = [
  {
    name: 'Agriculture',
    slug: 'agriculture',
    description: 'Precision farming solutions to optimize crop yields and reduce operational costs.',
    services: ['Crop monitoring', 'Precision spraying', 'Yield analysis'],
    benefits: ['Increased productivity', 'Reduced costs', 'Environmental sustainability'],
    image: '/agric-2.jpg',
    icon: 'agriculture',
    iconType: 'agriculture'
  },
  {
    name: 'Security',
    slug: 'security',
    description: 'Advanced surveillance and monitoring solutions for enhanced security operations.',
    services: ['Perimeter monitoring', 'Event surveillance', 'Emergency response'],
    benefits: ['Enhanced security', 'Real-time monitoring', 'Cost-effective coverage'],
    image: '/drone_on_air.jpg',
    icon: 'security',
    iconType: 'security'
  },
  {
    name: 'Construction',
    slug: 'construction',
    description: 'Construction site monitoring, progress tracking, and safety inspection services.',
    services: ['Site surveying', 'Progress monitoring', 'Safety inspections'],
    benefits: ['Improved project management', 'Enhanced safety', 'Accurate documentation'],
    image: '/survey.jpg',
    icon: 'construction',
    iconType: 'construction'
  },
  {
    name: 'Real Estate',
    slug: 'real-estate',
    description: 'Professional aerial photography and videography for property marketing.',
    services: ['Property photography', 'Virtual tours', 'Marketing content'],
    benefits: ['Enhanced marketing', 'Faster sales', 'Professional presentation'],
    image: '/aerial_road.jpg',
    icon: 'real-estate',
    iconType: 'real-estate'
  },
  {
    name: 'Events',
    slug: 'events',
    description: 'Comprehensive event coverage and live streaming services.',
    services: ['Event photography', 'Live streaming', 'Crowd monitoring'],
    benefits: ['Professional coverage', 'Unique perspectives', 'Enhanced documentation'],
    image: '/filming.jpg',
    icon: 'events',
    iconType: 'events'
  }
];

// Why choose us features
export const whyChooseUsFeatures = [
  {
    title: 'KCAA Certified Pilots',
    description: 'All our pilots are certified by the Kenya Civil Aviation Authority, ensuring safe and legal operations.',
    icon: 'certification',
    iconType: 'certification',
    image: '/kcaa.png',
    stats: '100% Certified'
  },
  {
    title: 'Advanced Technology',
    description: 'We use the latest drone technology and sensors to deliver high-quality results for every project.',
    icon: 'technology',
    iconType: 'technology',
    image: '/drone_frame.jpg',
    stats: 'Latest Tech'
  },
  {
    title: 'Customizable Packages',
    description: 'Flexible service packages tailored to meet your specific requirements and budget.',
    icon: 'customization',
    iconType: 'customization',
    image: '/drone_on_ground.jpg',
    stats: 'Flexible Plans'
  },
  {
    title: '24/7 Support',
    description: 'Round-the-clock customer support to ensure your projects are completed on time.',
    icon: 'support',
    iconType: 'support',
    image: '/hands_on_drone.jpg',
    stats: '24/7 Available'
  }
];

// Testimonials
export const testimonials = [
  {
    name: 'John Kamau',
    company: 'Kamau Farms Ltd',
    content: 'Vantage Vertical transformed our farming operations with their precision agriculture services. Our crop yields increased by 30% in the first season.',
    image: '/profile.png',
    metrics: {
      improvement: '30% yield increase',
      value: 'First season results'
    },
    rating: 5,
    service: 'Agritech Solutions'
  },
  {
    name: 'Sarah Wanjiku',
    company: 'Nairobi Security Solutions',
    content: 'Their surveillance drones have revolutionized our security operations. We can now monitor large areas efficiently and respond to incidents faster.',
    image: '/profile.png',
    metrics: {
      improvement: '50% faster response',
      value: 'Enhanced coverage'
    },
    rating: 5,
    service: 'Drone Surveillance'
  },
  {
    name: 'Michael Ochieng',
    company: 'Ochieng Construction',
    content: 'The aerial mapping services provided accurate site surveys that saved us weeks of ground surveying. Highly professional team.',
    image: '/profile.png',
    metrics: {
      improvement: '3 weeks saved',
      value: 'Accurate surveys'
    },
    rating: 5,
    service: 'Aerial Mapping'
  },
  {
    name: 'Grace Muthoni',
    company: 'Prime Properties Kenya',
    content: 'Outstanding aerial photography services that helped us sell properties 40% faster. The quality and professionalism are unmatched.',
    image: '/profile.png',
    metrics: {
      improvement: '40% faster sales',
      value: 'Professional quality'
    },
    rating: 5,
    service: 'Commercial Services'
  }
];

// Company information
export const companyInfo = {
  name: 'Vantage Vertical',
  tagline: 'See More. Do More. From Above.',
  description: 'Leading provider of professional drone services in Kenya, specializing in aerial mapping, surveillance, agritech solutions, and commercial applications.',
  founded: '2020',
  location: 'Nairobi, Kenya',
  employees: '15+',
  projectsCompleted: '500+',
  mission: 'To revolutionize industries through innovative aerial intelligence solutions that enhance productivity, safety, and decision-making.',
  vision: 'To be the leading drone services provider in East Africa, setting the standard for excellence in aerial technology applications.',
  values: [
    {
      title: 'Safety First',
      description: 'We prioritize safety in every operation, maintaining the highest standards of aviation safety and regulatory compliance.',
      icon: 'shield'
    },
    {
      title: 'Innovation',
      description: 'We continuously adopt cutting-edge technology and innovative approaches to deliver superior aerial intelligence solutions.',
      icon: 'lightbulb'
    },
    {
      title: 'Professional Excellence',
      description: 'We maintain the highest standards of professionalism in all our services, ensuring exceptional quality and reliability.',
      icon: 'star'
    },
    {
      title: 'Customer Focus',
      description: 'We put our clients at the center of everything we do, delivering customized solutions that exceed expectations.',
      icon: 'handshake'
    },
    {
      title: 'Environmental Responsibility',
      description: 'We are committed to sustainable practices that protect the environment while delivering effective solutions.',
      icon: 'leaf'
    }
  ],
  certifications: [
    'KCAA Remote Pilot License',
    'ISO 9001:2015 Quality Management',
    'Drone Operations Certificate',
    'Safety Management System',
    'Commercial Aviation Insurance'
  ]
};

// Team members
export const teamMembers = [
  {
    id: 'david-kuria',
    name: 'David Kuria',
    role: 'CEO & Lead Pilot',
    image: '/profile.png',
    bio: 'KCAA certified pilot with over 8 years of experience in aerial operations and business development.',
    experience: '8+ Years',
    projects: '200+',
    certifications: ['KCAA Remote Pilot License', 'Drone Operations Certificate', 'Aviation Safety Management', 'Business Leadership'],
    specialties: ['Strategic Planning', 'Flight Operations', 'Business Development']
  },
  {
    id: 'mary-wanjiku',
    name: 'Mary Wanjiku',
    role: 'Technical Director',
    image: '/profile.png',
    bio: 'Expert in drone technology and data analysis with a background in geospatial engineering.',
    experience: '6+ Years',
    projects: '150+',
    certifications: ['GIS Professional', 'Drone Data Analysis', 'Remote Sensing Specialist', 'Technical Operations'],
    specialties: ['Data Processing', 'Technical Analysis', 'Equipment Management']
  },
  {
    id: 'james-ochieng',
    name: 'James Ochieng',
    role: 'Operations Manager',
    image: '/profile.png',
    bio: 'Experienced operations manager ensuring smooth project execution and client satisfaction.',
    experience: '5+ Years',
    projects: '180+',
    certifications: ['Project Management Professional', 'Safety Operations', 'Quality Assurance', 'Client Relations'],
    specialties: ['Project Management', 'Client Relations', 'Quality Assurance']
  }
];

// Company achievements
export const achievements = [
  {
    title: '500+ Projects Completed',
    description: 'Successfully delivered over 500 drone service projects across various industries',
    icon: 'projects'
  },
  {
    title: 'KCAA Certified',
    description: 'All pilots certified by Kenya Civil Aviation Authority for safe and legal operations',
    icon: 'certification'
  },
  {
    title: '50+ Happy Clients',
    description: 'Trusted by over 50 businesses and organizations across Kenya',
    icon: 'clients'
  },
  {
    title: '99% Success Rate',
    description: 'Maintaining exceptional project success rate with consistent quality delivery',
    icon: 'success'
  }
];

// KCAA information
export const kcaaInfo = {
  title: 'KCAA Certified Operations',
  description: 'Vantage Vertical operates under full compliance with Kenya Civil Aviation Authority regulations, ensuring safe and legal drone operations.',
  certificationNumber: 'RPAS-001-2023',
  validUntil: '2025-12-31',
  coverage: [
    'Visual Line of Sight (VLOS) Operations',
    'Extended Visual Line of Sight (EVLOS)',
    'Commercial Drone Operations',
    'Aerial Photography and Videography',
    'Survey and Mapping Operations',
    'Agricultural Applications'
  ],
  authorizedOperations: [
    'Visual Line of Sight (VLOS) Operations',
    'Extended Visual Line of Sight (EVLOS)',
    'Commercial Drone Operations',
    'Aerial Photography and Videography',
    'Survey and Mapping Operations',
    'Agricultural Applications'
  ],
  safetyRecord: {
    flightHours: '2000+',
    incidents: '0',
    safetyRating: 'Excellent'
  },
  insuranceCoverage: {
    liability: '$2,000,000',
    hull: '$500,000',
    provider: 'Kenya Aviation Insurance Ltd'
  },
  operationalLimits: {
    maxAltitude: '400 feet AGL',
    dayOperations: 'Sunrise to Sunset',
    weatherLimits: 'Wind < 25 knots, Visibility > 3km',
    operatingRadius: '500m from pilot'
  }
};

// Portfolio data
export const portfolioProjects = [
  {
    id: '1',
    title: 'Agricultural Mapping - Kamau Farms',
    category: 'agritech',
    serviceType: 'Agriculture',
    description: 'Comprehensive crop health analysis and yield optimization for 500-acre farm using NDVI imaging.',
    image: '/agric-2.jpg',
    featuredImage: '/agric-2.jpg',
    images: ['/agric-2.jpg', '/spray_drone.jpg'],
    client: 'Kamau Farms Ltd',
    location: 'Nakuru, Kenya',
    date: '2024-01-15',
    duration: '3 months',
    featured: true,
    services: ['NDVI Analysis', 'Crop Monitoring', 'Yield Prediction'],
    challenge: 'The farm needed to optimize crop yields while reducing operational costs and environmental impact.',
    solution: 'We deployed advanced NDVI imaging technology to provide precise crop health analysis and targeted recommendations.',
    technologies: ['NDVI Imaging', 'Multispectral Sensors', 'GPS Mapping', 'Data Analytics'],
    tags: ['agriculture', 'precision-farming', 'ndvi', 'crop-monitoring'],
    results: [
      { value: '30%', metric: 'Yield Increase', improvement: 'vs previous season' },
      { value: '500', metric: 'Acres Covered', improvement: 'complete coverage' },
      { value: '3', metric: 'Months Duration', improvement: 'project timeline' }
    ],
    testimonial: {
      quote: 'Vantage Vertical transformed our farming operations with their precision agriculture services. Our crop yields increased by 30% in the first season.',
      author: 'John Kamau',
      role: 'Farm Owner',
      company: 'Kamau Farms Ltd'
    }
  },
  {
    id: '2',
    title: 'Security Surveillance - Nairobi Mall',
    category: 'surveillance',
    serviceType: 'Surveillance',
    description: 'Real-time security monitoring system for large shopping complex with thermal imaging.',
    image: '/drone_on_air.jpg',
    featuredImage: '/drone_on_air.jpg',
    images: ['/drone_on_air.jpg', '/filming.jpg'],
    client: 'Nairobi Security Solutions',
    location: 'Nairobi, Kenya',
    date: '2024-02-20',
    duration: 'Ongoing',
    featured: true,
    services: ['Perimeter Monitoring', 'Thermal Imaging', 'Real-time Streaming'],
    challenge: 'The shopping complex needed comprehensive security coverage with real-time monitoring capabilities.',
    solution: 'We implemented a drone-based surveillance system with thermal imaging and automated patrol routes.',
    technologies: ['Thermal Imaging', 'Real-time Streaming', 'Automated Patrol', 'Alert Systems'],
    tags: ['surveillance', 'security', 'thermal-imaging', 'real-time'],
    results: [
      { value: '50%', metric: 'Faster Response', improvement: 'vs traditional security' },
      { value: '24/7', metric: 'Monitoring', improvement: 'continuous coverage' },
      { value: '100%', metric: 'Coverage', improvement: 'complete perimeter' }
    ],
    testimonial: {
      quote: 'Their surveillance drones have revolutionized our security operations. We can now monitor large areas efficiently and respond to incidents faster.',
      author: 'Sarah Wanjiku',
      role: 'Security Manager',
      company: 'Nairobi Security Solutions'
    }
  },
  {
    id: '3',
    title: 'Construction Site Survey',
    category: 'mapping',
    serviceType: 'Mapping',
    description: 'Detailed topographical survey and progress monitoring for residential development.',
    image: '/survey.jpg',
    featuredImage: '/survey.jpg',
    images: ['/survey.jpg', '/drone_on_ground.jpg'],
    client: 'Ochieng Construction',
    location: 'Kiambu, Kenya',
    date: '2024-03-10',
    duration: '6 months',
    featured: false,
    services: ['Site Surveying', 'Progress Monitoring', '3D Mapping'],
    challenge: 'The construction project required accurate topographical surveys and regular progress monitoring.',
    solution: 'We provided comprehensive aerial mapping services with 3D modeling and regular progress reports.',
    technologies: ['3D Mapping', 'GPS Surveying', 'Progress Tracking', 'Orthomosaic Maps'],
    tags: ['mapping', 'construction', 'surveying', '3d-modeling'],
    results: [
      { value: '3', metric: 'Weeks Saved', improvement: 'vs ground surveying' },
      { value: '50', metric: 'Hectares', improvement: 'total area covered' },
      { value: '99%', metric: 'Accuracy', improvement: 'survey precision' }
    ],
    testimonial: {
      quote: 'The aerial mapping services provided accurate site surveys that saved us weeks of ground surveying. Highly professional team.',
      author: 'Michael Ochieng',
      role: 'Project Manager',
      company: 'Ochieng Construction'
    }
  },
  {
    id: '4',
    title: 'Real Estate Marketing',
    category: 'commercial',
    serviceType: 'Commercial',
    description: 'Professional aerial photography and videography for luxury property marketing.',
    image: '/aerial_road.jpg',
    featuredImage: '/aerial_road.jpg',
    images: ['/aerial_road.jpg', '/drone_home.jpg'],
    client: 'Prime Properties Kenya',
    location: 'Nairobi, Kenya',
    date: '2024-04-05',
    duration: '2 months',
    featured: false,
    services: ['Aerial Photography', 'Video Production', 'Virtual Tours'],
    challenge: 'The real estate company needed high-quality marketing materials to showcase luxury properties.',
    solution: 'We created stunning aerial photography and videography packages with virtual tour capabilities.',
    technologies: ['4K Video', 'HDR Photography', 'Virtual Tours', 'Drone Cinematography'],
    tags: ['real-estate', 'photography', 'marketing', 'virtual-tours'],
    results: [
      { value: '40%', metric: 'Faster Sales', improvement: 'vs traditional marketing' },
      { value: '20', metric: 'Properties', improvement: 'successfully marketed' },
      { value: '95%', metric: 'Client Satisfaction', improvement: 'customer feedback' }
    ],
    testimonial: {
      quote: 'Outstanding aerial photography services that helped us sell properties 40% faster. The quality and professionalism are unmatched.',
      author: 'Grace Muthoni',
      role: 'Marketing Director',
      company: 'Prime Properties Kenya'
    }
  }
];

export const portfolioStats = [
  { label: 'Projects Completed', value: '500+', icon: 'projects' },
  { label: 'Happy Clients', value: '50+', icon: 'clients' },
  { label: 'Flight Hours', value: '2000+', icon: 'experience' },
  { label: 'Success Rate', value: '99%', icon: 'success' }
];

export const portfolioCategories = [
  { id: 'all', value: 'all', label: 'All Projects', count: 4 },
  { id: 'agritech', value: 'agritech', label: 'Agriculture', count: 1 },
  { id: 'surveillance', value: 'surveillance', label: 'Surveillance', count: 1 },
  { id: 'mapping', value: 'mapping', label: 'Mapping', count: 1 },
  { id: 'commercial', value: 'commercial', label: 'Commercial', count: 1 }
];

// Blog data
export const blogPosts = [
  {
    id: '1',
    slug: 'future-of-precision-agriculture',
    title: 'The Future of Precision Agriculture in Kenya',
    excerpt: 'Exploring how drone technology is revolutionizing farming practices across Kenya.',
    content: 'Full blog post content here...',
    author: 'david-kuria',
    publishedAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    published: true,
    featured: true,
    readTime: 5,
    tags: ['agriculture', 'technology', 'kenya'],
    category: 'agriculture',
    featuredImage: '/agric-2.jpg',
    seoTitle: 'Future of Precision Agriculture in Kenya | Vantage Vertical',
    seoDescription: 'Discover how drone technology is transforming agriculture in Kenya.'
  },
  {
    id: '2',
    slug: 'drone-surveillance-security',
    title: 'Enhancing Security with Drone Surveillance',
    excerpt: 'How modern surveillance drones are improving security operations.',
    content: 'Full blog post content here...',
    author: 'mary-wanjiku',
    publishedAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    published: true,
    featured: false,
    readTime: 7,
    tags: ['surveillance', 'security', 'technology'],
    category: 'security',
    featuredImage: '/drone_on_air.jpg',
    seoTitle: 'Drone Surveillance for Enhanced Security | Vantage Vertical',
    seoDescription: 'Learn how drone surveillance is revolutionizing security operations.'
  }
];

export const blogCategories = [
  { id: 'all', value: 'all', label: 'All Categories', name: 'All Categories', count: 2 },
  { id: 'agriculture', value: 'agriculture', label: 'Agriculture', name: 'Agriculture', count: 1 },
  { id: 'security', value: 'security', label: 'Security', name: 'Security', count: 1 },
  { id: 'technology', value: 'technology', label: 'Technology', name: 'Technology', count: 2 },
  { id: 'mapping', value: 'mapping', label: 'Mapping', name: 'Mapping', count: 0 }
];

export const blogTags = [
  { id: 'agriculture', name: 'Agriculture', slug: 'agriculture', count: 5 },
  { id: 'technology', name: 'Technology', slug: 'technology', count: 8 },
  { id: 'kenya', name: 'Kenya', slug: 'kenya', count: 3 },
  { id: 'surveillance', name: 'Surveillance', slug: 'surveillance', count: 4 },
  { id: 'security', name: 'Security', slug: 'security', count: 3 },
  { id: 'mapping', name: 'Mapping', slug: 'mapping', count: 6 },
  { id: 'drones', name: 'Drones', slug: 'drones', count: 10 },
  { id: 'precision-farming', name: 'Precision Farming', slug: 'precision-farming', count: 4 },
  { id: 'aerial-photography', name: 'Aerial Photography', slug: 'aerial-photography', count: 7 }
];

export const blogAuthors = [
  {
    id: 'david-kuria',
    name: 'David Kuria',
    role: 'CEO & Lead Pilot',
    bio: 'KCAA certified pilot with expertise in aerial operations.',
    avatar: '/profile.png',
    image: '/profile.png',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/david-kuria',
      email: 'david@vantagevertical.co.ke',
      twitter: '@davidkuria'
    }
  },
  {
    id: 'mary-wanjiku',
    name: 'Mary Wanjiku',
    role: 'Technical Director',
    bio: 'Expert in drone technology and data analysis.',
    avatar: '/profile.png',
    image: '/profile.png',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/mary-wanjiku',
      email: 'mary@vantagevertical.co.ke',
      twitter: '@marywanjiku'
    }
  }
];

// Drone products data
export const droneProducts = [
  {
    id: '1',
    name: 'DJI Mavic 3 Enterprise',
    brand: 'DJI',
    price: 450000,
    category: 'commercial',
    description: 'Professional drone for commercial applications with advanced camera system.',
    specifications: [
      { name: 'Flight Time', value: '45 minutes' },
      { name: 'Camera', value: '20MP Hasselblad' },
      { name: 'Video', value: '5.1K/50fps' },
      { name: 'Range', value: '15km' }
    ],
    images: ['/drone_frame.jpg', '/drone_on_ground.jpg'],
    inStock: true,
    features: [
      'Obstacle avoidance',
      'RTK positioning',
      'Thermal imaging',
      'Long flight time'
    ]
  },
  {
    id: '2',
    name: 'DJI Agras T40',
    brand: 'DJI',
    price: 850000,
    category: 'agricultural',
    description: 'Agricultural drone for precision spraying and crop monitoring.',
    specifications: [
      { name: 'Payload', value: '40L tank' },
      { name: 'Spray Width', value: '9 meters' },
      { name: 'Flight Time', value: '25 minutes' },
      { name: 'Coverage', value: '18 hectares/hour' }
    ],
    images: ['/spray_drone.jpg', '/agric-2.jpg'],
    inStock: true,
    features: [
      'Precision spraying',
      'Crop monitoring',
      'Weather resistance',
      'Auto-return'
    ]
  }
];

// Training data exports
export const trainingPrograms = [
  {
    id: 'basic-pilot',
    title: 'Basic Drone Pilot Certification',
    level: 'Beginner',
    duration: '2 weeks',
    price: 'KSh 45,000',
    description: 'Comprehensive introduction to drone operations, safety protocols, and basic flight skills for aspiring pilots.',
    objectives: [
      'Understand drone technology and components',
      'Learn KCAA regulations and safety protocols',
      'Master basic flight maneuvers and controls',
      'Practice emergency procedures and risk management',
      'Complete written and practical examinations'
    ],
    featured: true,
    schedule: [
      {
        startDate: '2024-02-15',
        endDate: '2024-02-28',
        status: 'available',
        slots: 8
      },
      {
        startDate: '2024-03-15',
        endDate: '2024-03-28',
        status: 'filling-fast',
        slots: 3
      }
    ]
  },
  {
    id: 'commercial-operations',
    title: 'Commercial Drone Operations',
    level: 'Intermediate',
    duration: '3 weeks',
    price: 'KSh 75,000',
    description: 'Advanced training for commercial drone operations including aerial photography, mapping, and surveillance applications.',
    objectives: [
      'Advanced flight techniques and precision control',
      'Commercial application methodologies',
      'Data collection and processing workflows',
      'Client management and project planning',
      'Equipment maintenance and troubleshooting'
    ],
    featured: false,
    schedule: [
      {
        startDate: '2024-02-20',
        endDate: '2024-03-12',
        status: 'available',
        slots: 6
      },
      {
        startDate: '2024-03-20',
        endDate: '2024-04-10',
        status: 'available',
        slots: 10
      }
    ]
  },
  {
    id: 'agricultural-specialist',
    title: 'Agricultural Drone Specialist',
    level: 'Advanced',
    duration: '4 weeks',
    price: 'KSh 95,000',
    description: 'Specialized training in precision agriculture applications including crop monitoring, spraying, and data analysis.',
    objectives: [
      'Precision agriculture principles and practices',
      'NDVI and multispectral imaging techniques',
      'Crop health assessment and monitoring',
      'Precision spraying operations and calibration',
      'Agricultural data analysis and reporting'
    ],
    featured: false,
    schedule: [
      {
        startDate: '2024-03-01',
        endDate: '2024-03-28',
        status: 'available',
        slots: 5
      }
    ]
  },
  {
    id: 'instructor-certification',
    title: 'Drone Instructor Certification',
    level: 'Professional',
    duration: '6 weeks',
    price: 'KSh 150,000',
    description: 'Train-the-trainer program for experienced pilots looking to become certified drone instructors.',
    objectives: [
      'Advanced teaching methodologies and techniques',
      'Curriculum development and lesson planning',
      'Student assessment and evaluation methods',
      'Safety management and risk assessment',
      'Regulatory compliance and certification processes'
    ],
    featured: false,
    schedule: [
      {
        startDate: '2024-04-01',
        endDate: '2024-05-15',
        status: 'available',
        slots: 4
      }
    ]
  }
];

export const trainingMetrics = [
  {
    value: '500+',
    label: 'Graduates',
    description: 'Successful pilot certifications'
  },
  {
    value: '98%',
    label: 'Pass Rate',
    description: 'KCAA certification success'
  },
  {
    value: '50+',
    label: 'Instructors',
    description: 'Expert training staff'
  },
  {
    value: '5',
    label: 'Years',
    description: 'Training experience'
  }
];

export const trainingInstructors = [
  {
    id: 'david-kuria',
    name: 'David Kuria',
    title: 'Chief Flight Instructor',
    image: '/profile.png',
    bio: 'KCAA certified chief instructor with over 10 years of aviation experience and 5 years specializing in drone operations.',
    experience: '10+ years',
    studentsTrained: '200+',
    passRate: '99%',
    specialties: ['Commercial Operations', 'Safety Management', 'Regulatory Compliance']
  },
  {
    id: 'mary-wanjiku',
    name: 'Mary Wanjiku',
    title: 'Technical Training Specialist',
    image: '/profile.png',
    bio: 'Expert in drone technology and data analysis with extensive experience in agricultural and mapping applications.',
    experience: '8 years',
    studentsTrained: '150+',
    passRate: '97%',
    specialties: ['Agricultural Applications', 'Data Analysis', 'Mapping Technology']
  },
  {
    id: 'james-ochieng',
    name: 'James Ochieng',
    title: 'Flight Operations Instructor',
    image: '/profile.png',
    bio: 'Former military pilot with expertise in surveillance and security applications of drone technology.',
    experience: '12 years',
    studentsTrained: '180+',
    passRate: '98%',
    specialties: ['Surveillance Operations', 'Security Applications', 'Advanced Flight Techniques']
  },
  {
    id: 'grace-muthoni',
    name: 'Grace Muthoni',
    title: 'Safety and Compliance Instructor',
    image: '/profile.png',
    bio: 'Aviation safety expert specializing in KCAA regulations and drone safety management systems.',
    experience: '6 years',
    studentsTrained: '120+',
    passRate: '100%',
    specialties: ['Safety Management', 'KCAA Regulations', 'Risk Assessment']
  }
];

export const trainingFacilities = {
  classroom: {
    name: 'Modern Training Classroom',
    capacity: '30 students',
    features: [
      'Interactive smart boards',
      'High-speed internet',
      'Audio-visual equipment',
      'Climate controlled environment',
      'Comfortable seating'
    ],
    equipment: [
      'Flight simulators',
      'Drone components display',
      'Technical manuals library',
      'Testing equipment',
      'Safety gear'
    ]
  },
  flightArea: {
    name: 'Dedicated Flight Training Area',
    size: '5-hectare',
    features: [
      'KCAA approved airspace',
      'Multiple landing zones',
      'Obstacle course setup',
      'Weather monitoring station',
      'Emergency response protocols'
    ],
    equipment: [
      'Training drones fleet',
      'Ground control stations',
      'Safety equipment',
      'Communication systems',
      'First aid stations'
    ]
  }
};

export const trainingTestimonials = [
  {
    id: '1',
    name: 'Peter Kamau',
    currentRole: 'Commercial Drone Pilot',
    company: 'Skyview Aerial Services',
    image: '/profile.png',
    content: 'The training at Vantage Vertical was comprehensive and practical. I gained the confidence and skills needed to start my own drone services business.',
    graduationDate: '2023-06-15',
    achievements: [
      'Started successful drone services company',
      'Completed 100+ commercial projects',
      'Achieved 99% client satisfaction rate',
      'Expanded to team of 5 pilots'
    ],
    beforeAfter: {
      before: 'No drone experience',
      after: 'Successful business owner'
    }
  },
  {
    id: '2',
    name: 'Sarah Wanjiku',
    currentRole: 'Agricultural Drone Specialist',
    company: 'AgriTech Solutions Kenya',
    image: '/profile.png',
    content: 'The agricultural specialization program opened up amazing career opportunities. I now help farmers across Kenya improve their crop yields using drone technology.',
    graduationDate: '2023-09-20',
    achievements: [
      'Joined leading agritech company',
      'Trained 50+ farmers in precision agriculture',
      'Contributed to 25% average yield increase',
      'Published research on NDVI applications'
    ],
    beforeAfter: {
      before: 'Agricultural student',
      after: 'Drone technology specialist'
    }
  }
];