// Service options for contact form
export const serviceOptions = [
  { value: 'aerial-mapping', label: 'Aerial Mapping & Surveying' },
  { value: 'agritech', label: 'Agricultural Drone Services' },
  { value: 'surveillance', label: 'Drone Surveillance & Security' },
  { value: 'commercial', label: 'Commercial Photography/Videography' },
  { value: 'training', label: 'Drone Training Programs' },
  { value: 'drone-sales', label: 'Drone Sales & Equipment' },
  { value: 'consultation', label: 'Consultation Services' },
  { value: 'other', label: 'Other Services' },
];

// Main services data for service cards
export const mainServices = [
  {
    title: 'Aerial Mapping & Surveying',
    description: 'High-precision aerial mapping and surveying services using advanced drone technology for accurate topographical data, land surveys, and 3D modeling.',
    iconType: 'mapping',
    features: [
      'High-resolution orthomosaic maps',
      'Digital elevation models (DEM)',
      '3D point cloud generation',
      'Volumetric calculations',
      'Progress monitoring'
    ],
    ctaText: 'Get Survey Quote',
    ctaLink: '/contact?service=aerial-mapping',
    image: '/aerial_drone.jpg'
  },
  {
    title: 'Agricultural Drone Services',
    description: 'Precision agriculture solutions including crop monitoring, health assessment, and targeted spraying to optimize farm productivity and reduce costs.',
    iconType: 'agriculture',
    features: [
      'NDVI crop health analysis',
      'Precision spraying services',
      'Irrigation monitoring',
      'Pest and disease detection',
      'Yield prediction analytics'
    ],
    ctaText: 'Boost Your Harvest',
    ctaLink: '/contact?service=agritech',
    image: '/drone_on_air.jpg',
    variant: 'featured' as const
  },
  {
    title: 'Drone Surveillance & Security',
    description: 'Professional surveillance solutions for security monitoring, perimeter patrol, and asset protection using advanced drone technology.',
    iconType: 'surveillance',
    features: [
      '24/7 surveillance capabilities',
      'Real-time monitoring',
      'Thermal imaging',
      'Perimeter security',
      'Emergency response'
    ],
    ctaText: 'Secure Your Assets',
    ctaLink: '/contact?service=surveillance'
  },
  {
    title: 'Commercial Photography',
    description: 'Professional aerial photography and videography services for real estate, events, marketing, and commercial projects.',
    iconType: 'photography',
    features: [
      '4K video recording',
      'High-resolution photography',
      'Real estate showcases',
      'Event coverage',
      'Marketing content creation'
    ],
    ctaText: 'Capture Your Vision',
    ctaLink: '/contact?service=commercial'
  }
];

// Industries we serve
export const industries = [
  {
    name: 'Agriculture',
    description: 'Precision farming solutions to optimize crop yields and reduce operational costs.',
    iconType: 'agriculture',
    benefits: [
      'Crop health monitoring',
      'Precision spraying',
      'Irrigation optimization',
      'Yield prediction'
    ]
  },
  {
    name: 'Security',
    description: 'Advanced surveillance and monitoring solutions for enhanced security operations.',
    iconType: 'security',
    benefits: [
      'Perimeter monitoring',
      'Real-time alerts',
      'Thermal imaging',
      'Emergency response'
    ]
  },
  {
    name: 'Construction',
    description: 'Site monitoring, progress tracking, and safety compliance for construction projects.',
    iconType: 'construction',
    benefits: [
      'Progress monitoring',
      'Site surveying',
      'Safety inspections',
      'Volume calculations'
    ]
  },
  {
    name: 'Real Estate',
    description: 'Stunning aerial photography and videography to showcase properties effectively.',
    iconType: 'realestate',
    benefits: [
      'Property showcases',
      'Marketing materials',
      'Virtual tours',
      'Land development'
    ]
  },
  {
    name: 'Events',
    description: 'Professional event coverage and live streaming from unique aerial perspectives.',
    iconType: 'events',
    benefits: [
      'Event documentation',
      'Live streaming',
      'Crowd monitoring',
      'Unique perspectives'
    ]
  }
];

// Why Choose Us data
export const whyChooseUsFeatures = [
  {
    title: 'KCAA Certified Pilots',
    description: 'All our pilots are certified by the Kenya Civil Aviation Authority (KCAA), ensuring compliance with aviation regulations and safety standards.',
    iconType: 'certified',
    stats: '100% Certified'
  },
  {
    title: 'Advanced Technology',
    description: 'We use cutting-edge drone technology including thermal imaging, NDVI sensors, and high-resolution cameras for superior results.',
    iconType: 'technology',
    stats: 'Latest Equipment'
  },
  {
    title: 'Customizable Packages',
    description: 'Flexible service packages tailored to your specific needs and budget, from one-time projects to ongoing monitoring contracts.',
    iconType: 'customizable',
    stats: 'Flexible Solutions'
  },
  {
    title: 'Proven Results',
    description: 'Track record of successful projects across agriculture, security, construction, and commercial sectors with measurable outcomes.',
    iconType: 'results',
    stats: '500+ Projects'
  }
];

// Client testimonials
export const testimonials = [
  {
    id: '1',
    name: 'James Kuria',
    company: 'Kuria Farms Ltd',
    role: 'Farm Manager',
    content: 'Vantage Vertical transformed our farming operations with their precision agriculture services. The NDVI analysis helped us identify crop stress early and optimize our irrigation, resulting in a 25% increase in yield.',
    image: '/profile.png',
    rating: 5,
    metrics: [
      {
        label: 'Yield Increase',
        value: '25%',
        improvement: '↑ vs previous season'
      },
      {
        label: 'Water Savings',
        value: '30%',
        improvement: '↓ irrigation costs'
      }
    ]
  },
  {
    id: '2',
    name: 'Sarah Wanjiku',
    company: 'Nairobi Security Solutions',
    role: 'Operations Director',
    content: 'The drone surveillance services provided by Vantage Vertical have significantly enhanced our security operations. Real-time monitoring and thermal imaging capabilities have improved our response times by 40%.',
    image: '/profile.png',
    rating: 5,
    metrics: [
      {
        label: 'Response Time',
        value: '40%',
        improvement: '↓ faster response'
      },
      {
        label: 'Coverage Area',
        value: '300%',
        improvement: '↑ expanded coverage'
      }
    ]
  },
  {
    id: '3',
    name: 'Michael Ochieng',
    company: 'Ochieng Construction',
    role: 'Project Manager',
    content: 'The aerial mapping and progress monitoring services have been invaluable for our construction projects. Accurate site surveys and regular progress reports help us stay on schedule and within budget.',
    image: '/profile.png',
    rating: 5,
    metrics: [
      {
        label: 'Time Savings',
        value: '50%',
        improvement: '↓ survey time'
      },
      {
        label: 'Accuracy',
        value: '99.5%',
        improvement: '↑ precision mapping'
      }
    ]
  }
];

// Urgency levels for contact form
export const urgencyLevels = [
  { value: 'low', label: 'Standard (1-2 weeks)', color: 'text-green-600' },
  { value: 'medium', label: 'Priority (3-5 days)', color: 'text-yellow-600' },
  { value: 'high', label: 'Urgent (24-48 hours)', color: 'text-red-600' },
];

// Validation rule types
interface ValidationRule {
  required?: string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
}

// Contact form validation rules
export const contactFormValidation: Record<string, ValidationRule> = {
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    maxLength: { value: 50, message: 'Name must be less than 50 characters' },
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
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
    minLength: { value: 10, message: 'Message must be at least 10 characters' },
    maxLength: { value: 1000, message: 'Message must be less than 1000 characters' },
  },
  urgency: {
    required: 'Please select urgency level',
  },
};