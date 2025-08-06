import { PortfolioProject, BlogPost, BlogCategory, BlogAuthor } from '@/types/forms';

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
    title: 'Aerial Drone Mapping Services',
    description: 'Professional aerial drone mapping services in Kenya using advanced technology for high-precision topographical surveys, land mapping, and 3D modeling. Our KCAA-certified pilots deliver accurate geospatial data for construction, mining, and development projects.',
    iconType: 'mapping',
    features: [
      'High-resolution orthomosaic mapping',
      'Digital elevation models (DEM)',
      '3D point cloud generation',
      'Volumetric calculations and analysis',
      'Construction progress monitoring'
    ],
    ctaText: 'Get Survey Quote',
    ctaLink: '/contact?service=aerial-mapping',
    image: '/aerial_drone.jpg'
  },
  {
    title: 'Agritech Drone Solutions',
    description: 'Advanced precision agriculture Kenya services including NDVI crop health scans, drone crop spraying, and farm monitoring. Our agritech drone solutions help farmers optimize yields, reduce costs, and implement sustainable farming practices.',
    iconType: 'agriculture',
    features: [
      'NDVI crop health scans and analysis',
      'Precision drone crop spraying services',
      'Irrigation system monitoring',
      'Early pest and disease detection',
      'Yield prediction and analytics'
    ],
    ctaText: 'Boost Your Harvest',
    ctaLink: '/contact?service=agritech',
    image: '/drone_on_air.jpg',
    variant: 'featured' as const
  },
  {
    title: 'Drone Surveillance Company Kenya',
    description: 'Leading drone surveillance company in Kenya providing professional security monitoring, perimeter patrol, and asset protection services. Our advanced surveillance drones offer 24/7 monitoring capabilities with thermal imaging technology.',
    iconType: 'surveillance',
    features: [
      '24/7 drone surveillance capabilities',
      'Real-time security monitoring',
      'Thermal imaging surveillance',
      'Perimeter security patrols',
      'Emergency response services'
    ],
    ctaText: 'Secure Your Assets',
    ctaLink: '/contact?service=surveillance'
  },
  {
    title: 'Commercial Drone Services',
    description: 'Professional commercial drone services for aerial photography, videography, and marketing content creation. Our commercial drone services cover real estate showcases, event coverage, and promotional video production across Kenya.',
    iconType: 'photography',
    features: [
      '4K aerial video recording',
      'High-resolution drone photography',
      'Real estate property showcases',
      'Professional event coverage',
      'Marketing content creation'
    ],
    ctaText: 'Capture Your Vision',
    ctaLink: '/contact?service=commercial'
  }
];

// Industries we serve
export const industries = [
  {
    name: 'Precision Agriculture Kenya',
    description: 'Advanced precision agriculture Kenya solutions including NDVI crop health scans, drone crop spraying, and farm optimization to maximize yields and reduce costs.',
    iconType: 'agriculture',
    benefits: [
      'NDVI crop health monitoring',
      'Precision drone crop spraying',
      'Smart irrigation optimization',
      'Agricultural yield prediction'
    ]
  },
  {
    name: 'Security & Surveillance',
    description: 'Professional drone surveillance company Kenya services with advanced monitoring solutions for enhanced security operations and asset protection.',
    iconType: 'security',
    benefits: [
      'Drone perimeter monitoring',
      'Real-time security alerts',
      'Thermal imaging surveillance',
      '24/7 emergency response'
    ]
  },
  {
    name: 'Construction & Mapping',
    description: 'Comprehensive aerial drone mapping services for construction site monitoring, progress tracking, and safety compliance with high-precision surveying.',
    iconType: 'construction',
    benefits: [
      'Construction progress monitoring',
      'Aerial site surveying',
      'Safety compliance inspections',
      'Volumetric calculations'
    ]
  },
  {
    name: 'Real Estate',
    description: 'Professional commercial drone services for stunning aerial photography and videography to showcase properties effectively and enhance marketing campaigns.',
    iconType: 'realestate',
    benefits: [
      'Aerial property showcases',
      'Professional marketing materials',
      'Virtual property tours',
      'Land development documentation'
    ]
  },
  {
    name: 'Events & Media',
    description: 'Commercial drone services for professional event coverage and live streaming from unique aerial perspectives, creating engaging content for audiences.',
    iconType: 'events',
    benefits: [
      'Professional event documentation',
      'Aerial live streaming',
      'Crowd monitoring services',
      'Unique aerial perspectives'
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

// Company information
export const companyInfo = {
  name: 'Vantage Vertical',
  tagline: 'See More. Do More. From Above.',
  mission: 'To revolutionize industries through innovative aerial intelligence solutions, empowering businesses and communities across Kenya with cutting-edge drone technology.',
  vision: 'To be East Africa\'s leading provider of drone services, setting the standard for excellence in aerial mapping, surveillance, and agricultural technology.',
  founded: '2019',
  headquarters: 'Nairobi, Kenya',
  employees: '25+',
  projectsCompleted: '500+',
  certifications: [
    'KCAA Remote Pilot License (RPL)',
    'KCAA Operator Certificate (ROC)',
    'ISO 9001:2015 Quality Management',
    'Professional Drone Pilot Certification'
  ],
  values: [
    {
      title: 'Safety First',
      description: 'We prioritize safety in every operation, maintaining the highest standards of aviation safety and regulatory compliance.',
      icon: 'shield'
    },
    {
      title: 'Innovation',
      description: 'We continuously adopt cutting-edge technology and innovative approaches to deliver superior results for our clients.',
      icon: 'lightbulb'
    },
    {
      title: 'Excellence',
      description: 'We are committed to delivering exceptional quality in every project, exceeding client expectations consistently.',
      icon: 'star'
    },
    {
      title: 'Integrity',
      description: 'We conduct business with honesty, transparency, and ethical practices, building trust with clients and partners.',
      icon: 'handshake'
    },
    {
      title: 'Sustainability',
      description: 'We promote environmentally responsible practices and help clients optimize resource usage through precision technology.',
      icon: 'leaf'
    },
    {
      title: 'Community Impact',
      description: 'We are dedicated to contributing to Kenya\'s economic growth and technological advancement through our services.',
      icon: 'heart'
    }
  ]
};

// Team members
export const teamMembers = [
  {
    id: '1',
    name: 'David Kimani',
    role: 'Chief Executive Officer & Lead Pilot',
    bio: 'David is a certified KCAA pilot with over 8 years of experience in aviation and drone operations. He founded Vantage Vertical with a vision to transform industries through aerial intelligence.',
    image: '/profile.png',
    certifications: [
      'KCAA Remote Pilot License (RPL)',
      'KCAA Operator Certificate (ROC)',
      'Commercial Pilot License',
      'Drone Safety Management Certification'
    ],
    specialties: ['Aerial Mapping', 'Commercial Operations', 'Safety Management'],
    experience: '8+ years',
    projects: '200+'
  },
  {
    id: '2',
    name: 'Grace Wanjiku',
    role: 'Head of Agricultural Services',
    bio: 'Grace specializes in precision agriculture and agritech solutions. With a background in agricultural engineering, she leads our agricultural drone services division.',
    image: '/profile.png',
    certifications: [
      'KCAA Remote Pilot License (RPL)',
      'Precision Agriculture Certification',
      'Agricultural Engineering Degree',
      'NDVI Analysis Specialist'
    ],
    specialties: ['Precision Agriculture', 'Crop Monitoring', 'NDVI Analysis'],
    experience: '6+ years',
    projects: '150+'
  },
  {
    id: '3',
    name: 'Michael Ochieng',
    role: 'Technical Operations Manager',
    bio: 'Michael oversees technical operations and equipment maintenance. His expertise in drone technology and data analysis ensures optimal performance in all missions.',
    image: '/profile.png',
    certifications: [
      'KCAA Remote Pilot License (RPL)',
      'Drone Maintenance Certification',
      'GIS Analysis Certification',
      'Technical Operations Management'
    ],
    specialties: ['Technical Operations', 'Data Analysis', 'Equipment Maintenance'],
    experience: '7+ years',
    projects: '180+'
  },
  {
    id: '4',
    name: 'Sarah Muthoni',
    role: 'Surveillance & Security Specialist',
    bio: 'Sarah leads our surveillance and security operations with extensive experience in security systems and drone-based monitoring solutions.',
    image: '/profile.png',
    certifications: [
      'KCAA Remote Pilot License (RPL)',
      'Security Operations Certification',
      'Thermal Imaging Specialist',
      'Emergency Response Training'
    ],
    specialties: ['Drone Surveillance', 'Security Operations', 'Thermal Imaging'],
    experience: '5+ years',
    projects: '120+'
  }
];

// Company achievements and milestones
export const achievements = [
  {
    year: '2019',
    title: 'Company Founded',
    description: 'Vantage Vertical established with a mission to revolutionize aerial services in Kenya.'
  },
  {
    year: '2020',
    title: 'KCAA Certification',
    description: 'Obtained full KCAA certification for commercial drone operations across Kenya.'
  },
  {
    year: '2021',
    title: '100+ Projects Milestone',
    description: 'Successfully completed over 100 projects across agriculture, security, and commercial sectors.'
  },
  {
    year: '2022',
    title: 'Agricultural Innovation Award',
    description: 'Recognized for outstanding contribution to precision agriculture in Kenya.'
  },
  {
    year: '2023',
    title: 'Team Expansion',
    description: 'Expanded team to 25+ certified professionals and opened training academy.'
  },
  {
    year: '2024',
    title: '500+ Projects Completed',
    description: 'Reached milestone of 500+ successful projects with 98% client satisfaction rate.'
  }
];

// KCAA licensing information
export const kcaaInfo = {
  operatorCertificate: 'ROC-2020-VV-001',
  validUntil: '2025-12-31',
  authorizedOperations: [
    'Aerial Work Operations',
    'Commercial Photography/Videography',
    'Surveillance and Monitoring',
    'Agricultural Applications',
    'Survey and Mapping',
    'Training Operations'
  ],
  operationalLimits: {
    maxAltitude: '400 feet AGL',
    dayOperations: 'Authorized',
    nightOperations: 'Authorized with special approval',
    beyondVisualLineOfSight: 'Authorized with special approval',
    overPeople: 'Authorized with risk assessment'
  },
  insuranceCoverage: {
    liability: 'KES 50,000,000',
    hull: 'KES 10,000,000',
    provider: 'Kenya Aviation Insurance'
  }
};

// Portfolio project data
export const portfolioProjects: PortfolioProject[] = [
  {
    id: '1',
    title: 'Kuria Tea Estate Precision Mapping',
    category: 'mapping',
    serviceType: 'Aerial Mapping & Surveying',
    client: 'Kuria Tea Estate Ltd',
    location: 'Kericho, Kenya',
    date: '2024-01-15',
    duration: '3 days',
    description: 'Comprehensive aerial mapping and surveying of 500-hectare tea plantation for precision agriculture planning and irrigation optimization.',
    challenge: 'The client needed accurate topographical data and crop health analysis to optimize irrigation systems and improve tea yield across their large plantation.',
    solution: 'We deployed advanced mapping drones with NDVI sensors to create detailed orthomosaic maps, digital elevation models, and crop health analysis reports.',
    results: [
      { metric: 'Area Mapped', value: '500 hectares', improvement: 'Complete coverage' },
      { metric: 'Accuracy', value: '2cm GSD', improvement: '99.5% precision' },
      { metric: 'Time Saved', value: '75%', improvement: 'vs traditional surveying' },
      { metric: 'Cost Reduction', value: '60%', improvement: 'vs ground survey' }
    ],
    images: [
      '/aerial_drone.jpg',
      '/drone_on_teafarm.jpg',
      '/aerial_road.jpg'
    ],
    featuredImage: '/aerial_drone.jpg',
    technologies: ['DJI Phantom 4 RTK', 'NDVI Camera', 'Pix4D Mapping', 'GIS Analysis'],
    testimonial: {
      quote: 'The precision mapping provided by Vantage Vertical transformed our plantation management. We now have accurate data for every section of our farm.',
      author: 'James Kuria',
      role: 'Estate Manager',
      company: 'Kuria Tea Estate Ltd'
    },
    tags: ['precision-agriculture', 'mapping', 'ndvi', 'irrigation'],
    featured: true
  },
  {
    id: '2',
    title: 'Nairobi Industrial Security Surveillance',
    category: 'surveillance',
    serviceType: 'Drone Surveillance & Security',
    client: 'SecureGuard Kenya',
    location: 'Nairobi Industrial Area',
    date: '2024-02-20',
    duration: '6 months ongoing',
    description: 'Comprehensive drone surveillance system for industrial complex security monitoring with real-time threat detection and response capabilities.',
    challenge: 'The client required 24/7 perimeter security for a large industrial complex with multiple entry points and blind spots that traditional cameras couldn\'t cover.',
    solution: 'Implemented automated drone patrol system with thermal imaging, real-time monitoring, and AI-powered threat detection for comprehensive security coverage.',
    results: [
      { metric: 'Coverage Area', value: '50 hectares', improvement: '100% perimeter coverage' },
      { metric: 'Response Time', value: '2 minutes', improvement: '80% faster response' },
      { metric: 'Incident Detection', value: '95%', improvement: 'accuracy rate' },
      { metric: 'Security Costs', value: '40%', improvement: 'reduction vs guards' }
    ],
    images: [
      '/drone_on_black_background.jpg',
      '/camera_dark_background.jpg',
      '/black_drone_back_background.jpg'
    ],
    featuredImage: '/drone_on_black_background.jpg',
    technologies: ['DJI Matrice 300 RTK', 'Thermal Camera', 'AI Detection', 'Real-time Streaming'],
    testimonial: {
      quote: 'The drone surveillance system has revolutionized our security operations. We now have complete visibility and faster response times.',
      author: 'Sarah Wanjiku',
      role: 'Security Director',
      company: 'SecureGuard Kenya'
    },
    tags: ['surveillance', 'security', 'thermal-imaging', 'ai-detection'],
    featured: true
  },
  {
    id: '3',
    title: 'Precision Crop Spraying - Mwea Rice Scheme',
    category: 'agritech',
    serviceType: 'Agricultural Drone Services',
    client: 'Mwea Rice Farmers Cooperative',
    location: 'Mwea, Kirinyaga County',
    date: '2024-03-10',
    duration: '2 weeks',
    description: 'Large-scale precision crop spraying operation for rice farms using advanced agricultural drones to optimize pesticide application and reduce environmental impact.',
    challenge: 'Traditional spraying methods were inefficient, costly, and resulted in uneven pesticide distribution across the rice paddies, leading to crop damage and environmental concerns.',
    solution: 'Deployed precision agricultural drones with variable rate application technology to ensure optimal pesticide distribution while minimizing environmental impact.',
    results: [
      { metric: 'Area Treated', value: '1,200 hectares', improvement: 'Complete coverage' },
      { metric: 'Pesticide Savings', value: '35%', improvement: 'reduced usage' },
      { metric: 'Application Time', value: '70%', improvement: 'faster than traditional' },
      { metric: 'Crop Yield', value: '20%', improvement: 'increase in harvest' }
    ],
    images: [
      '/spray_drone.jpg',
      '/agric-2.jpg',
      '/agricultural_drone_on_air.jpg'
    ],
    featuredImage: '/spray_drone.jpg',
    technologies: ['DJI Agras T40', 'Variable Rate Technology', 'GPS Precision', 'Weather Monitoring'],
    testimonial: {
      quote: 'The precision spraying service increased our yield significantly while reducing our pesticide costs. Excellent service from Vantage Vertical.',
      author: 'Peter Mwangi',
      role: 'Cooperative Chairman',
      company: 'Mwea Rice Farmers Cooperative'
    },
    tags: ['precision-spraying', 'agriculture', 'rice-farming', 'environmental'],
    featured: false
  },
  {
    id: '4',
    title: 'Luxury Resort Aerial Photography',
    category: 'commercial',
    serviceType: 'Commercial Photography',
    client: 'Diani Beach Resort',
    location: 'Diani Beach, Kwale County',
    date: '2024-01-25',
    duration: '2 days',
    description: 'Professional aerial photography and videography for luxury beach resort marketing campaign, showcasing the property from unique aerial perspectives.',
    challenge: 'The resort needed high-quality aerial content for their international marketing campaign to showcase the property\'s beachfront location and luxury amenities.',
    solution: 'Conducted comprehensive aerial photography and 4K videography sessions during golden hour to capture stunning visuals of the resort and surrounding coastline.',
    results: [
      { metric: 'Content Delivered', value: '200+ photos', improvement: '4K resolution' },
      { metric: 'Video Content', value: '15 minutes', improvement: 'cinematic quality' },
      { metric: 'Marketing ROI', value: '150%', improvement: 'booking increase' },
      { metric: 'Social Engagement', value: '300%', improvement: 'increase in shares' }
    ],
    images: [
      '/drone_on_river.jpg',
      '/filming.jpg',
      '/film-d.jpg'
    ],
    featuredImage: '/drone_on_river.jpg',
    technologies: ['DJI Mavic 3 Cine', '4K Video', 'Gimbal Stabilization', 'Color Grading'],
    testimonial: {
      quote: 'The aerial footage captured by Vantage Vertical exceeded our expectations. The quality and creativity have significantly enhanced our marketing materials.',
      author: 'Maria Santos',
      role: 'Marketing Director',
      company: 'Diani Beach Resort'
    },
    tags: ['aerial-photography', 'tourism', 'marketing', 'luxury'],
    featured: false
  },
  {
    id: '5',
    title: 'Construction Site Progress Monitoring',
    category: 'mapping',
    serviceType: 'Aerial Mapping & Surveying',
    client: 'Nairobi Metro Construction',
    location: 'Nairobi CBD',
    date: '2024-02-01',
    duration: '12 months ongoing',
    description: 'Monthly aerial surveys and 3D modeling for large-scale construction project to monitor progress, ensure compliance, and optimize resource allocation.',
    challenge: 'The construction company needed regular, accurate progress monitoring for a complex multi-story development to ensure project timeline adherence and quality control.',
    solution: 'Implemented monthly drone surveys with 3D modeling and progress comparison analysis to provide detailed construction progress reports and identify potential issues.',
    results: [
      { metric: 'Survey Frequency', value: 'Monthly', improvement: 'consistent monitoring' },
      { metric: 'Progress Accuracy', value: '98%', improvement: 'vs manual inspection' },
      { metric: 'Issue Detection', value: '2 weeks earlier', improvement: 'problem identification' },
      { metric: 'Project Efficiency', value: '15%', improvement: 'time savings' }
    ],
    images: [
      '/survey.jpg',
      '/drone_frame.jpg',
      '/hands_on_drone.jpg'
    ],
    featuredImage: '/survey.jpg',
    technologies: ['DJI Phantom 4 Pro', '3D Modeling', 'Progress Analytics', 'CAD Integration'],
    testimonial: {
      quote: 'Regular drone surveys have been invaluable for our project management. We can identify and address issues before they become costly problems.',
      author: 'Michael Ochieng',
      role: 'Project Manager',
      company: 'Nairobi Metro Construction'
    },
    tags: ['construction', 'progress-monitoring', '3d-modeling', 'project-management'],
    featured: false
  },
  {
    id: '6',
    title: 'Wildlife Conservation Monitoring',
    category: 'surveillance',
    serviceType: 'Drone Surveillance & Security',
    client: 'Kenya Wildlife Service',
    location: 'Maasai Mara National Reserve',
    date: '2024-03-05',
    duration: '3 months',
    description: 'Anti-poaching surveillance and wildlife monitoring using thermal imaging drones to protect endangered species and monitor animal populations.',
    challenge: 'Traditional ground-based anti-poaching efforts were limited by terrain and visibility, making it difficult to monitor large areas effectively and respond to threats quickly.',
    solution: 'Deployed thermal imaging drones for night surveillance and population monitoring, providing real-time data to rangers and enabling rapid response to poaching activities.',
    results: [
      { metric: 'Area Monitored', value: '10,000 hectares', improvement: 'daily coverage' },
      { metric: 'Poaching Incidents', value: '60%', improvement: 'reduction detected' },
      { metric: 'Response Time', value: '15 minutes', improvement: 'average response' },
      { metric: 'Wildlife Count', value: '95%', improvement: 'accuracy improvement' }
    ],
    images: [
      '/drone_free.jpg',
      '/drone_on_ground.jpg',
      '/aerial_road.jpg'
    ],
    featuredImage: '/drone_free.jpg',
    technologies: ['DJI Matrice 300', 'Thermal Imaging', 'Night Vision', 'GPS Tracking'],
    testimonial: {
      quote: 'The drone surveillance program has significantly enhanced our conservation efforts. We can now monitor vast areas and respond to threats much more effectively.',
      author: 'Dr. Jane Wanjiru',
      role: 'Conservation Director',
      company: 'Kenya Wildlife Service'
    },
    tags: ['wildlife-conservation', 'anti-poaching', 'thermal-surveillance', 'conservation'],
    featured: true
  },
  {
    id: '7',
    title: 'Real Estate Development Showcase',
    category: 'commercial',
    serviceType: 'Commercial Photography',
    client: 'Kiambu Heights Development',
    location: 'Kiambu County',
    date: '2024-02-15',
    duration: '1 day',
    description: 'Comprehensive aerial photography and virtual tour creation for luxury residential development to enhance sales and marketing efforts.',
    challenge: 'The real estate developer needed compelling visual content to showcase the development\'s location, amenities, and surrounding landscape to potential buyers.',
    solution: 'Created stunning aerial photography, 360-degree virtual tours, and promotional video content highlighting the development\'s key features and prime location.',
    results: [
      { metric: 'Photo Deliverables', value: '150+ images', improvement: 'high-resolution' },
      { metric: 'Virtual Tours', value: '5 complete tours', improvement: '360-degree coverage' },
      { metric: 'Sales Inquiries', value: '200%', improvement: 'increase after launch' },
      { metric: 'Marketing Reach', value: '500K views', improvement: 'social media engagement' }
    ],
    images: [
      '/drone_photo_aerial_farmland.jpg',
      '/home-drones-02.jpg',
      '/drone_home.jpg'
    ],
    featuredImage: '/drone_photo_aerial_farmland.jpg',
    technologies: ['DJI Air 2S', '360 Camera', 'Virtual Tour Software', 'HDR Photography'],
    testimonial: {
      quote: 'The aerial content created by Vantage Vertical has been instrumental in our sales success. The quality and perspective are outstanding.',
      author: 'Robert Kamau',
      role: 'Sales Director',
      company: 'Kiambu Heights Development'
    },
    tags: ['real-estate', 'virtual-tours', 'sales-marketing', 'residential'],
    featured: false
  },
  {
    id: '8',
    title: 'Coffee Farm Health Assessment',
    category: 'agritech',
    serviceType: 'Agricultural Drone Services',
    client: 'Nyeri Coffee Cooperative',
    location: 'Nyeri County',
    date: '2024-01-30',
    duration: '1 week',
    description: 'Comprehensive crop health assessment using NDVI analysis to identify disease patterns and optimize coffee plantation management.',
    challenge: 'Coffee farmers were experiencing declining yields and needed to identify diseased areas and optimize their farming practices to improve crop health and productivity.',
    solution: 'Conducted detailed NDVI analysis and multispectral imaging to create crop health maps, identify problem areas, and provide actionable recommendations for treatment.',
    results: [
      { metric: 'Farms Assessed', value: '50 farms', improvement: '2,000 hectares total' },
      { metric: 'Disease Detection', value: '90%', improvement: 'early identification' },
      { metric: 'Treatment Efficiency', value: '45%', improvement: 'targeted application' },
      { metric: 'Yield Improvement', value: '25%', improvement: 'following season' }
    ],
    images: [
      '/agric_.jpg',
      '/drone_on_teafarm.jpg',
      '/agricultural_drone_on_air.jpg'
    ],
    featuredImage: '/agric_.jpg',
    technologies: ['Multispectral Camera', 'NDVI Analysis', 'Crop Health Mapping', 'Data Analytics'],
    testimonial: {
      quote: 'The crop health analysis helped us identify and treat problem areas early, resulting in our best harvest in five years.',
      author: 'Grace Wanjiku',
      role: 'Cooperative Manager',
      company: 'Nyeri Coffee Cooperative'
    },
    tags: ['coffee-farming', 'crop-health', 'ndvi-analysis', 'disease-detection'],
    featured: false
  }
];

// Portfolio categories for filtering
export const portfolioCategories = [
  { id: 'all', label: 'All Projects', count: portfolioProjects.length },
  { id: 'mapping', label: 'Aerial Mapping', count: portfolioProjects.filter(p => p.category === 'mapping').length },
  { id: 'surveillance', label: 'Surveillance', count: portfolioProjects.filter(p => p.category === 'surveillance').length },
  { id: 'agritech', label: 'AgriTech', count: portfolioProjects.filter(p => p.category === 'agritech').length },
  { id: 'commercial', label: 'Commercial', count: portfolioProjects.filter(p => p.category === 'commercial').length }
];

// Portfolio statistics
export const portfolioStats = [
  { label: 'Projects Completed', value: '500+', icon: 'projects' },
  { label: 'Hectares Mapped', value: '50,000+', icon: 'area' },
  { label: 'Client Satisfaction', value: '98%', icon: 'satisfaction' },
  { label: 'Years Experience', value: '5+', icon: 'experience' }
];

// Training program data
export const trainingPrograms = [
  {
    id: 'basic-pilot',
    title: 'Basic Drone Training in Kenya - KCAA Certification',
    level: 'Beginner',
    duration: '5 days',
    price: 'KES 45,000',
    description: 'Comprehensive drone training in Kenya program covering drone operations, safety protocols, and basic flight techniques. Our KCAA-approved drone training in Kenya is perfect for beginners looking to enter the professional drone industry.',
    objectives: [
      'Understand drone technology and components',
      'Master basic flight operations and controls',
      'Learn aviation safety and regulations',
      'Practice emergency procedures',
      'Prepare for KCAA RPL examination'
    ],
    curriculum: [
      {
        day: 1,
        title: 'Introduction to Drone Technology',
        topics: [
          'Drone types and applications',
          'Understanding flight systems',
          'Battery management and safety',
          'Pre-flight inspection procedures'
        ]
      },
      {
        day: 2,
        title: 'Aviation Regulations and Safety',
        topics: [
          'KCAA regulations and compliance',
          'Airspace classification',
          'Flight planning and permissions',
          'Risk assessment procedures'
        ]
      },
      {
        day: 3,
        title: 'Basic Flight Operations',
        topics: [
          'Controller operation and setup',
          'Basic flight maneuvers',
          'Altitude and distance management',
          'Landing and takeoff procedures'
        ]
      },
      {
        day: 4,
        title: 'Advanced Flight Techniques',
        topics: [
          'Precision flying and positioning',
          'Weather considerations',
          'Emergency procedures',
          'Equipment troubleshooting'
        ]
      },
      {
        day: 5,
        title: 'Practical Assessment',
        topics: [
          'Flight skills demonstration',
          'Written examination',
          'Scenario-based testing',
          'Certification ceremony'
        ]
      }
    ],
    prerequisites: [
      'Minimum age of 18 years',
      'Basic English literacy',
      'No prior drone experience required',
      'Valid national ID'
    ],
    certification: 'KCAA Remote Pilot License (RPL) preparation',
    includes: [
      'Training materials and manuals',
      'Drone equipment for training',
      'KCAA examination fees',
      'Certificate of completion',
      'Post-training support'
    ],
    schedule: [
      {
        startDate: '2024-04-15',
        endDate: '2024-04-19',
        status: 'available',
        slots: 8
      },
      {
        startDate: '2024-05-20',
        endDate: '2024-05-24',
        status: 'available',
        slots: 12
      },
      {
        startDate: '2024-06-17',
        endDate: '2024-06-21',
        status: 'filling-fast',
        slots: 3
      }
    ],
    featured: true
  },
  {
    id: 'commercial-operations',
    title: 'Commercial Drone Services Training Kenya',
    level: 'Intermediate',
    duration: '7 days',
    price: 'KES 75,000',
    description: 'Advanced drone training in Kenya for commercial drone services including aerial photography, aerial drone mapping services, and surveillance applications. Master professional commercial drone operations across Kenya.',
    objectives: [
      'Master commercial flight operations',
      'Learn advanced camera and sensor operations',
      'Understand data collection and processing',
      'Develop business and client management skills',
      'Obtain commercial operator certification'
    ],
    curriculum: [
      {
        day: 1,
        title: 'Commercial Aviation Regulations',
        topics: [
          'KCAA commercial operations requirements',
          'Insurance and liability considerations',
          'Client contract management',
          'Operational risk assessment'
        ]
      },
      {
        day: 2,
        title: 'Advanced Flight Systems',
        topics: [
          'GPS and navigation systems',
          'Automated flight planning',
          'Waypoint navigation',
          'Return-to-home procedures'
        ]
      },
      {
        day: 3,
        title: 'Aerial Photography and Videography',
        topics: [
          'Camera settings and composition',
          'Gimbal operation and stabilization',
          'Lighting and weather considerations',
          'Post-processing basics'
        ]
      },
      {
        day: 4,
        title: 'Mapping and Surveying',
        topics: [
          'Photogrammetry principles',
          'Ground control points',
          'Flight planning for mapping',
          'Data processing software'
        ]
      },
      {
        day: 5,
        title: 'Surveillance and Inspection',
        topics: [
          'Thermal imaging applications',
          'Infrastructure inspection techniques',
          'Security surveillance protocols',
          'Data analysis and reporting'
        ]
      },
      {
        day: 6,
        title: 'Business Operations',
        topics: [
          'Starting a drone service business',
          'Pricing and proposal development',
          'Client communication',
          'Equipment maintenance'
        ]
      },
      {
        day: 7,
        title: 'Practical Projects and Assessment',
        topics: [
          'Real-world project simulation',
          'Portfolio development',
          'Final examination',
          'Business plan presentation'
        ]
      }
    ],
    prerequisites: [
      'Valid KCAA RPL license',
      'Minimum 50 hours flight experience',
      'Basic photography knowledge helpful',
      'Own laptop for software training'
    ],
    certification: 'Commercial Drone Operations Certificate',
    includes: [
      'Advanced training materials',
      'Professional drone equipment access',
      'Software licenses for training',
      'Business development resources',
      '6 months mentorship support'
    ],
    schedule: [
      {
        startDate: '2024-04-22',
        endDate: '2024-04-28',
        status: 'available',
        slots: 6
      },
      {
        startDate: '2024-05-27',
        endDate: '2024-06-02',
        status: 'available',
        slots: 8
      }
    ],
    featured: true
  },
  {
    id: 'agricultural-specialist',
    title: 'Agricultural Drone Specialist - Precision Agriculture Kenya',
    level: 'Advanced',
    duration: '10 days',
    price: 'KES 120,000',
    description: 'Specialized drone training in Kenya for precision agriculture, NDVI crop health scans, drone crop spraying, and agricultural drone applications. Master agritech drone solutions for farming professionals across Kenya.',
    objectives: [
      'Master agricultural drone applications',
      'Learn precision spraying techniques',
      'Understand crop health analysis',
      'Develop farm management solutions',
      'Obtain agricultural specialist certification'
    ],
    curriculum: [
      {
        day: 1,
        title: 'Precision Agriculture Fundamentals',
        topics: [
          'Precision agriculture principles',
          'Crop growth and health indicators',
          'Soil analysis and mapping',
          'Variable rate application concepts'
        ]
      },
      {
        day: 2,
        title: 'Agricultural Drone Systems',
        topics: [
          'Agricultural drone platforms',
          'Spraying system components',
          'Sensor technologies (NDVI, thermal)',
          'GPS and RTK systems'
        ]
      },
      {
        day: 3,
        title: 'Crop Monitoring and Analysis',
        topics: [
          'Multispectral imaging',
          'NDVI analysis and interpretation',
          'Disease and pest detection',
          'Growth stage monitoring'
        ]
      },
      {
        day: 4,
        title: 'Precision Spraying Operations',
        topics: [
          'Spray system calibration',
          'Chemical handling and safety',
          'Application rate calculations',
          'Weather considerations'
        ]
      },
      {
        day: 5,
        title: 'Data Processing and Analysis',
        topics: [
          'Agricultural software platforms',
          'Data interpretation and reporting',
          'Prescription map creation',
          'ROI analysis and reporting'
        ]
      },
      {
        day: 6,
        title: 'Irrigation Management',
        topics: [
          'Irrigation system assessment',
          'Water stress detection',
          'Efficiency optimization',
          'Scheduling recommendations'
        ]
      },
      {
        day: 7,
        title: 'Livestock Monitoring',
        topics: [
          'Pasture assessment',
          'Animal counting and tracking',
          'Health monitoring applications',
          'Grazing management'
        ]
      },
      {
        day: 8,
        title: 'Farm Management Integration',
        topics: [
          'Farm management software',
          'Data integration workflows',
          'Decision support systems',
          'Farmer training and adoption'
        ]
      },
      {
        day: 9,
        title: 'Business Development',
        topics: [
          'Agricultural service business models',
          'Farmer engagement strategies',
          'Pricing for agricultural services',
          'Seasonal planning and operations'
        ]
      },
      {
        day: 10,
        title: 'Practical Projects and Certification',
        topics: [
          'Real farm project implementation',
          'Data analysis and recommendations',
          'Client presentation skills',
          'Final assessment and certification'
        ]
      }
    ],
    prerequisites: [
      'Valid KCAA RPL license',
      'Commercial operations experience',
      'Agricultural background preferred',
      'Minimum 100 hours flight experience'
    ],
    certification: 'Agricultural Drone Specialist Certificate',
    includes: [
      'Specialized agricultural training materials',
      'Access to agricultural drone equipment',
      'Software licenses and training',
      'Field trip to operational farms',
      '12 months technical support'
    ],
    schedule: [
      {
        startDate: '2024-05-06',
        endDate: '2024-05-15',
        status: 'available',
        slots: 4
      },
      {
        startDate: '2024-07-08',
        endDate: '2024-07-17',
        status: 'available',
        slots: 6
      }
    ],
    featured: false
  },
  {
    id: 'maintenance-repair',
    title: 'Drone Maintenance and Repair',
    level: 'Technical',
    duration: '5 days',
    price: 'KES 55,000',
    description: 'Technical training focused on drone maintenance, troubleshooting, and repair procedures for operators and technicians.',
    objectives: [
      'Understand drone mechanical systems',
      'Learn diagnostic and troubleshooting skills',
      'Master repair and maintenance procedures',
      'Develop preventive maintenance programs',
      'Obtain maintenance technician certification'
    ],
    curriculum: [
      {
        day: 1,
        title: 'Drone Systems Overview',
        topics: [
          'Mechanical components and systems',
          'Electronic systems and wiring',
          'Propulsion and motor systems',
          'Control and navigation systems'
        ]
      },
      {
        day: 2,
        title: 'Diagnostic Procedures',
        topics: [
          'System testing and diagnostics',
          'Error code interpretation',
          'Performance monitoring',
          'Troubleshooting methodologies'
        ]
      },
      {
        day: 3,
        title: 'Mechanical Repairs',
        topics: [
          'Frame and structural repairs',
          'Propeller and motor replacement',
          'Gimbal maintenance and calibration',
          'Landing gear and accessories'
        ]
      },
      {
        day: 4,
        title: 'Electronic System Maintenance',
        topics: [
          'Circuit board inspection and repair',
          'Sensor calibration and replacement',
          'Battery maintenance and testing',
          'Firmware updates and configuration'
        ]
      },
      {
        day: 5,
        title: 'Preventive Maintenance Programs',
        topics: [
          'Maintenance scheduling and planning',
          'Record keeping and documentation',
          'Parts inventory management',
          'Quality control procedures'
        ]
      }
    ],
    prerequisites: [
      'Basic electronics knowledge',
      'Mechanical aptitude',
      'Drone operation experience helpful',
      'Own basic tools preferred'
    ],
    certification: 'Drone Maintenance Technician Certificate',
    includes: [
      'Technical manuals and documentation',
      'Access to repair tools and equipment',
      'Spare parts for training',
      'Diagnostic software access',
      'Technical support network access'
    ],
    schedule: [
      {
        startDate: '2024-04-29',
        endDate: '2024-05-03',
        status: 'available',
        slots: 10
      },
      {
        startDate: '2024-06-24',
        endDate: '2024-06-28',
        status: 'available',
        slots: 12
      }
    ],
    featured: false
  }
];

// Training instructors
export const trainingInstructors = [
  {
    id: '1',
    name: 'Captain David Kimani',
    title: 'Chief Flight Instructor',
    specialties: ['Basic Flight Training', 'Commercial Operations', 'Safety Management'],
    experience: '8+ years',
    certifications: [
      'KCAA Chief Flight Instructor',
      'Commercial Pilot License',
      'Drone Safety Management System',
      'Aviation English Proficiency'
    ],
    bio: 'Captain Kimani brings extensive aviation experience to drone training, having transitioned from traditional aviation to unmanned systems. His comprehensive understanding of aviation principles and safety culture ensures students receive world-class training.',
    image: '/profile.png',
    studentsTrained: '500+',
    passRate: '98%',
    languages: ['English', 'Swahili'],
    achievements: [
      'KCAA Outstanding Instructor Award 2023',
      'Zero accident record in training',
      'Developed KCAA-approved curriculum'
    ]
  },
  {
    id: '2',
    name: 'Dr. Grace Wanjiku',
    title: 'Agricultural Specialist Instructor',
    specialties: ['Precision Agriculture', 'Crop Monitoring', 'Data Analysis'],
    experience: '6+ years',
    certifications: [
      'PhD in Agricultural Engineering',
      'KCAA Remote Pilot License',
      'Precision Agriculture Certification',
      'GIS and Remote Sensing Specialist'
    ],
    bio: 'Dr. Wanjiku combines academic expertise with practical field experience in precision agriculture. Her research background and hands-on farming experience provide students with both theoretical knowledge and real-world applications.',
    image: '/profile.png',
    studentsTrained: '200+',
    passRate: '95%',
    languages: ['English', 'Swahili', 'Kikuyu'],
    achievements: [
      'Published 15+ research papers on precision agriculture',
      'Kenya Agricultural Innovation Award 2022',
      'Consultant to FAO on drone applications'
    ]
  },
  {
    id: '3',
    name: 'Engineer Michael Ochieng',
    title: 'Technical Systems Instructor',
    specialties: ['Drone Maintenance', 'Technical Systems', 'Troubleshooting'],
    experience: '7+ years',
    certifications: [
      'Mechanical Engineering Degree',
      'KCAA Maintenance Authorization',
      'Electronics Repair Certification',
      'Quality Management Systems'
    ],
    bio: 'Engineer Ochieng specializes in the technical aspects of drone systems, from mechanical components to electronic systems. His engineering background and hands-on maintenance experience provide comprehensive technical training.',
    image: '/profile.png',
    studentsTrained: '150+',
    passRate: '97%',
    languages: ['English', 'Swahili', 'Luo'],
    achievements: [
      'Developed proprietary diagnostic procedures',
      'Reduced equipment downtime by 40%',
      'Technical consultant for major drone manufacturers'
    ]
  },
  {
    id: '4',
    name: 'Sarah Muthoni',
    title: 'Commercial Operations Instructor',
    specialties: ['Commercial Photography', 'Business Development', 'Client Relations'],
    experience: '5+ years',
    certifications: [
      'KCAA Remote Pilot License',
      'Professional Photography Certification',
      'Business Management Diploma',
      'Marketing and Sales Certification'
    ],
    bio: 'Sarah brings a unique combination of technical drone skills and business acumen to training. Her experience in building successful drone service businesses helps students understand both the technical and commercial aspects of the industry.',
    image: '/profile.png',
    studentsTrained: '180+',
    passRate: '96%',
    languages: ['English', 'Swahili'],
    achievements: [
      'Built 3 successful drone service companies',
      'Mentored 50+ drone entrepreneurs',
      'Featured speaker at industry conferences'
    ]
  }
];

// Training facilities
export const trainingFacilities = {
  classroom: {
    name: 'Modern Training Classroom',
    capacity: 20,
    features: [
      'Interactive smart boards',
      'High-speed internet connectivity',
      'Audio-visual equipment',
      'Air conditioning',
      'Comfortable seating',
      'Individual workstations'
    ],
    equipment: [
      'Laptops for each student',
      'Drone simulators',
      'Technical training aids',
      'Reference materials library'
    ]
  },
  flightArea: {
    name: 'Dedicated Flight Training Area',
    size: '5 hectares',
    features: [
      'KCAA-approved training airspace',
      'Multiple takeoff and landing zones',
      'Obstacle course for skill development',
      'Weather monitoring station',
      'Safety barriers and signage',
      'Emergency response equipment'
    ],
    equipment: [
      'Training drones (various models)',
      'Safety equipment',
      'Ground control stations',
      'Communication systems'
    ]
  },
  workshop: {
    name: 'Technical Workshop',
    size: '200 sqm',
    features: [
      'Fully equipped repair stations',
      'Component testing equipment',
      'Parts inventory storage',
      'Clean room environment',
      'Safety equipment',
      'Documentation systems'
    ],
    equipment: [
      'Diagnostic tools and software',
      'Repair tools and equipment',
      'Spare parts inventory',
      'Testing and calibration equipment'
    ]
  },
  accommodation: {
    name: 'Student Accommodation',
    type: 'Partner hotels nearby',
    features: [
      'Comfortable rooms',
      'Meals included',
      'Transportation to training center',
      'Study areas',
      'WiFi access'
    ],
    options: [
      'Single occupancy rooms',
      'Shared accommodation',
      'Local homestay options'
    ]
  }
};

// Training testimonials
export const trainingTestimonials = [
  {
    id: '1',
    name: 'Peter Mwangi',
    course: 'Basic Drone Pilot Certification',
    graduationDate: '2024-02-15',
    currentRole: 'Freelance Drone Pilot',
    company: 'Self-employed',
    content: 'The training at Vantage Vertical was exceptional. The instructors were knowledgeable and patient, and the hands-on approach helped me gain confidence quickly. I passed my KCAA exam on the first try and now run my own drone service business.',
    image: '/profile.png',
    rating: 5,
    achievements: [
      'Passed KCAA RPL exam with 95%',
      'Started successful drone business',
      'Completed 50+ commercial projects'
    ],
    beforeAfter: {
      before: 'Complete beginner with no aviation experience',
      after: 'Licensed pilot running profitable drone business'
    }
  },
  {
    id: '2',
    name: 'Mary Wanjiru',
    course: 'Agricultural Drone Specialist',
    graduationDate: '2024-01-20',
    currentRole: 'Agricultural Consultant',
    company: 'AgriTech Solutions Kenya',
    content: 'The agricultural drone training opened up a whole new career path for me. The combination of agricultural knowledge and drone technology has made me invaluable to farming clients. My income has increased by 300% since completing the course.',
    image: '/profile.png',
    rating: 5,
    achievements: [
      'Increased income by 300%',
      'Serves 20+ commercial farms',
      'Reduced crop losses by 25% for clients'
    ],
    beforeAfter: {
      before: 'Traditional agricultural extension officer',
      after: 'High-tech precision agriculture specialist'
    }
  },
  {
    id: '3',
    name: 'John Kiprotich',
    course: 'Commercial Drone Operations',
    graduationDate: '2023-11-10',
    currentRole: 'Drone Operations Manager',
    company: 'Kenya Construction Ltd',
    content: 'The commercial operations training gave me the skills and confidence to manage drone operations for our construction company. We now use drones for site surveys, progress monitoring, and safety inspections, saving time and money.',
    image: '/profile.png',
    rating: 5,
    achievements: [
      'Promoted to Operations Manager',
      'Reduced survey costs by 60%',
      'Improved project efficiency by 40%'
    ],
    beforeAfter: {
      before: 'Site supervisor with basic drone interest',
      after: 'Drone operations manager leading digital transformation'
    }
  },
  {
    id: '4',
    name: 'Grace Nyokabi',
    course: 'Drone Maintenance and Repair',
    graduationDate: '2024-03-05',
    currentRole: 'Technical Support Specialist',
    company: 'Drone Services East Africa',
    content: 'The maintenance training was exactly what I needed to advance my technical career. The hands-on approach and expert instruction gave me the confidence to handle complex repairs. I\'m now the go-to person for technical issues in our company.',
    image: '/profile.png',
    rating: 5,
    achievements: [
      'Became lead technical specialist',
      'Reduced equipment downtime by 50%',
      'Trained 10+ junior technicians'
    ],
    beforeAfter: {
      before: 'Basic electronics technician',
      after: 'Specialized drone maintenance expert'
    }
  }
];

// Training success metrics
export const trainingMetrics = [
  {
    label: 'Students Trained',
    value: '1,000+',
    icon: 'students',
    description: 'Successful graduates across all programs'
  },
  {
    label: 'Pass Rate',
    value: '97%',
    icon: 'success',
    description: 'KCAA examination success rate'
  },
  {
    label: 'Employment Rate',
    value: '85%',
    icon: 'employment',
    description: 'Graduates employed within 6 months'
  },
  {
    label: 'Business Success',
    value: '60%',
    icon: 'business',
    description: 'Graduates who started their own businesses'
  }
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

// Blog authors
export const blogAuthors: BlogAuthor[] = [
  {
    id: 'david-kimani',
    name: 'David Kimani',
    bio: 'CEO and Lead Pilot at Vantage Vertical with over 8 years of experience in drone operations and aerial intelligence.',
    avatar: '/profile.png',
    role: 'CEO & Lead Pilot',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/david-kimani',
      email: 'david@vantagevertical.co.ke'
    }
  },
  {
    id: 'grace-wanjiku',
    name: 'Grace Wanjiku',
    bio: 'Head of Agricultural Services specializing in precision agriculture and agritech solutions.',
    avatar: '/profile.png',
    role: 'Head of Agricultural Services',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/grace-wanjiku',
      email: 'grace@vantagevertical.co.ke'
    }
  },
  {
    id: 'michael-ochieng',
    name: 'Michael Ochieng',
    bio: 'Technical Operations Manager with expertise in drone technology and data analysis.',
    avatar: '/profile.png',
    role: 'Technical Operations Manager',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/michael-ochieng',
      email: 'michael@vantagevertical.co.ke'
    }
  }
];

// Blog categories
export const blogCategories: BlogCategory[] = [
  {
    id: 'all',
    name: 'All Posts',
    slug: 'all',
    description: 'All blog posts and insights',
    count: 0 // Will be calculated dynamically
  },
  {
    id: 'drone-technology',
    name: 'Drone Technology',
    slug: 'drone-technology',
    description: 'Latest developments in drone technology and equipment',
    count: 0
  },
  {
    id: 'precision-agriculture',
    name: 'Precision Agriculture',
    slug: 'precision-agriculture',
    description: 'Agricultural drone applications and farming insights',
    count: 0
  },
  {
    id: 'aerial-mapping',
    name: 'Aerial Mapping',
    slug: 'aerial-mapping',
    description: 'Surveying, mapping, and GIS applications',
    count: 0
  },
  {
    id: 'industry-insights',
    name: 'Industry Insights',
    slug: 'industry-insights',
    description: 'Market trends and industry analysis',
    count: 0
  },
  {
    id: 'case-studies',
    name: 'Case Studies',
    slug: 'case-studies',
    description: 'Real-world project examples and success stories',
    count: 0
  },
  {
    id: 'regulations',
    name: 'Regulations',
    slug: 'regulations',
    description: 'Aviation regulations and compliance updates',
    count: 0
  }
];

// Blog posts data
export const blogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'future-of-precision-agriculture-kenya',
    title: 'The Future of Precision Agriculture in Kenya: How Drones Are Revolutionizing Farming',
    excerpt: 'Discover how drone technology is transforming Kenyan agriculture through precision farming techniques, crop monitoring, and data-driven decision making.',
    content: `# The Future of Precision Agriculture in Kenya: How Drones Are Revolutionizing Farming

Kenya's agricultural sector, which employs over 75% of the rural population and contributes significantly to the country's GDP, is undergoing a technological revolution. At the forefront of this transformation is precision agriculture powered by drone technology.

## The Current State of Agriculture in Kenya

Traditional farming methods in Kenya face numerous challenges:
- Unpredictable weather patterns due to climate change
- Limited access to real-time crop health data
- Inefficient use of water and fertilizers
- Difficulty monitoring large farm areas

## How Drones Are Changing the Game

### 1. Crop Health Monitoring
Using NDVI (Normalized Difference Vegetation Index) sensors, drones can identify crop stress, disease outbreaks, and nutrient deficiencies before they become visible to the naked eye.

### 2. Precision Spraying
Agricultural drones can apply pesticides and fertilizers with pinpoint accuracy, reducing chemical usage by up to 35% while improving crop yields.

### 3. Irrigation Management
Thermal imaging cameras on drones help farmers identify areas with water stress, enabling more efficient irrigation scheduling.

## Success Stories from Kenyan Farms

Our work with tea estates in Kericho and rice farms in Mwea has demonstrated remarkable results:
- 25% increase in crop yields
- 30% reduction in water usage
- 40% decrease in pesticide application

## The Road Ahead

As drone technology becomes more accessible and affordable, we expect to see widespread adoption across Kenya's agricultural sector. The integration of AI and machine learning will further enhance the capabilities of agricultural drones.

*Ready to transform your farming operations? Contact Vantage Vertical to learn how precision agriculture can benefit your farm.*`,
    author: 'grace-wanjiku',
    publishedAt: '2024-03-15',
    tags: ['precision-agriculture', 'ndvi', 'crop-monitoring', 'kenya-agriculture'],
    category: 'precision-agriculture',
    featuredImage: '/agric-2.jpg',
    readTime: 8,
    seoTitle: 'Future of Precision Agriculture in Kenya | Drone Technology for Farming',
    seoDescription: 'Learn how drone technology is revolutionizing Kenyan agriculture through precision farming, crop monitoring, and data-driven farming decisions.',
    featured: true,
    published: true
  },
  {
    id: '2',
    slug: 'kcaa-drone-regulations-2024-update',
    title: 'KCAA Drone Regulations 2024: What Commercial Operators Need to Know',
    excerpt: 'Stay compliant with the latest KCAA drone regulations. A comprehensive guide for commercial drone operators in Kenya.',
    content: `# KCAA Drone Regulations 2024: What Commercial Operators Need to Know

The Kenya Civil Aviation Authority (KCAA) has updated its drone regulations for 2024, introducing new requirements and clarifications for commercial drone operations. Here's what you need to know to stay compliant.

## Key Updates in 2024

### 1. Enhanced Pilot Certification Requirements
- All commercial pilots must now complete annual recertification
- New medical certificate requirements for certain operations
- Mandatory safety management system training

### 2. Operational Limitations
- Maximum altitude remains at 400 feet AGL
- New restrictions for operations near airports
- Enhanced requirements for beyond visual line of sight (BVLOS) operations

### 3. Insurance Requirements
- Minimum liability coverage increased to KES 50 million
- Hull insurance now mandatory for commercial operations
- Proof of insurance must be carried during all flights

## Compliance Checklist for Commercial Operators

✅ Valid Remote Pilot License (RPL)
✅ Current Operator Certificate (ROC)
✅ Updated insurance coverage
✅ Completed annual safety training
✅ Proper flight planning and documentation

## Impact on Different Industries

### Agriculture
- New guidelines for pesticide application
- Enhanced environmental protection measures
- Simplified approval process for routine agricultural operations

### Surveillance and Security
- Stricter privacy protection requirements
- New protocols for emergency response operations
- Enhanced coordination with law enforcement

### Mapping and Surveying
- Streamlined approval for routine mapping operations
- New accuracy standards for commercial surveys
- Integration with national mapping initiatives

## How Vantage Vertical Ensures Compliance

At Vantage Vertical, we maintain full compliance with all KCAA regulations:
- All pilots hold current RPL certifications
- Our ROC is valid until 2025
- We carry comprehensive insurance coverage
- Regular safety training and equipment maintenance

*Need help with KCAA compliance? Our team can guide you through the certification process.*`,
    author: 'david-kimani',
    publishedAt: '2024-03-10',
    tags: ['kcaa-regulations', 'drone-compliance', 'commercial-operations', 'aviation-law'],
    category: 'regulations',
    featuredImage: '/kcaa.png',
    readTime: 6,
    seoTitle: 'KCAA Drone Regulations 2024 Update | Commercial Drone Compliance Kenya',
    seoDescription: 'Complete guide to KCAA drone regulations 2024. Stay compliant with updated requirements for commercial drone operations in Kenya.',
    featured: true,
    published: true
  },
  {
    id: '3',
    slug: 'thermal-imaging-drones-security-applications',
    title: 'Thermal Imaging Drones: Revolutionizing Security and Surveillance Operations',
    excerpt: 'Explore how thermal imaging technology is enhancing security operations, from perimeter monitoring to search and rescue missions.',
    content: `# Thermal Imaging Drones: Revolutionizing Security and Surveillance Operations

Thermal imaging technology has transformed the capabilities of security drones, enabling 24/7 surveillance operations regardless of lighting conditions. This technology is proving invaluable across various security applications in Kenya.

## Understanding Thermal Imaging Technology

Thermal cameras detect heat signatures rather than visible light, making them effective in:
- Complete darkness
- Adverse weather conditions
- Camouflaged or hidden targets
- Long-range detection scenarios

## Key Applications in Security

### 1. Perimeter Security
- Automated patrol routes
- Intrusion detection
- Real-time alerts for security breaches
- Integration with existing security systems

### 2. Search and Rescue Operations
- Locating missing persons in wilderness areas
- Emergency response in disaster zones
- Medical emergency detection
- Wildlife conservation efforts

### 3. Industrial Security
- Equipment monitoring and maintenance
- Fire prevention and detection
- Critical infrastructure protection
- Environmental monitoring

## Case Study: Industrial Complex Security

Our recent deployment at a Nairobi industrial complex demonstrated the effectiveness of thermal imaging drones:

**Challenge**: 50-hectare facility with multiple blind spots and security vulnerabilities

**Solution**: Automated thermal imaging drone patrols with AI-powered threat detection

**Results**:
- 95% improvement in threat detection accuracy
- 80% faster response times
- 40% reduction in security personnel costs
- 100% perimeter coverage achieved

## Technical Specifications

### Camera Capabilities
- Temperature range: -40°C to +550°C
- Thermal sensitivity: <50mK
- Resolution: 640×512 pixels
- Digital zoom: Up to 8x

### Flight Performance
- Flight time: Up to 55 minutes
- Operating range: 15km
- Wind resistance: Up to 15 m/s
- Operating temperature: -20°C to +50°C

## Integration with Security Systems

Modern thermal imaging drones can integrate with:
- Video management systems (VMS)
- Access control systems
- Alarm monitoring platforms
- Command and control centers

## Future Developments

Emerging technologies enhancing thermal imaging capabilities:
- AI-powered object recognition
- Predictive analytics
- Multi-sensor fusion
- Autonomous response systems

*Interested in upgrading your security operations with thermal imaging drones? Contact our security specialists for a consultation.*`,
    author: 'michael-ochieng',
    publishedAt: '2024-03-05',
    tags: ['thermal-imaging', 'security-drones', 'surveillance', 'technology'],
    category: 'drone-technology',
    featuredImage: '/camera_dark_background.jpg',
    readTime: 7,
    seoTitle: 'Thermal Imaging Drones for Security | Advanced Surveillance Technology',
    seoDescription: 'Discover how thermal imaging drones are revolutionizing security operations with 24/7 surveillance capabilities and advanced threat detection.',
    featured: false,
    published: true
  },
  {
    id: '4',
    slug: 'aerial-mapping-construction-project-management',
    title: 'Aerial Mapping for Construction: Streamlining Project Management and Progress Monitoring',
    excerpt: 'Learn how aerial mapping and 3D modeling are transforming construction project management, from site surveys to progress tracking.',
    content: `# Aerial Mapping for Construction: Streamlining Project Management and Progress Monitoring

The construction industry in Kenya is embracing drone technology for project management, with aerial mapping leading the transformation. From initial site surveys to final inspections, drones are providing unprecedented visibility and control over construction projects.

## Traditional Construction Challenges

Construction projects face numerous management challenges:
- Inaccurate initial surveys leading to cost overruns
- Difficulty tracking progress across large sites
- Safety risks during manual inspections
- Limited documentation for stakeholder reporting

## How Aerial Mapping Solves These Problems

### 1. Accurate Site Surveys
High-resolution orthomosaic maps and digital elevation models provide:
- Centimeter-level accuracy
- Complete site coverage
- Detailed topographical data
- Volumetric calculations

### 2. Progress Monitoring
Regular drone surveys enable:
- Visual progress documentation
- Comparison with project timelines
- Early identification of issues
- Automated progress reporting

### 3. Safety Improvements
Drone inspections reduce risks by:
- Eliminating need for workers in dangerous areas
- Providing detailed visual documentation
- Enabling remote quality assessments
- Reducing insurance liabilities

## Case Study: Nairobi Metro Construction

**Project**: 20-story commercial development in Nairobi CBD

**Challenge**: Complex multi-phase construction requiring precise progress monitoring

**Solution**: Monthly drone surveys with 3D modeling and progress analysis

**Results**:
- 98% accuracy in progress reporting
- 2 weeks earlier problem identification
- 15% improvement in project efficiency
- Significant reduction in safety incidents

## Technical Capabilities

### Survey Accuracy
- Ground Sample Distance (GSD): 1-2cm
- Horizontal accuracy: ±5cm
- Vertical accuracy: ±10cm
- Coverage: Up to 500 hectares per day

### Data Products
- Orthomosaic maps
- Digital Surface Models (DSM)
- Digital Terrain Models (DTM)
- 3D point clouds
- Volumetric calculations
- Progress comparison reports

## Integration with Construction Workflows

### BIM Integration
- Import drone data into BIM software
- Compare as-built vs. design models
- Automated clash detection
- Progress visualization

### Project Management
- Integration with project management software
- Automated reporting dashboards
- Stakeholder communication tools
- Quality assurance documentation

## ROI Analysis

Construction companies using aerial mapping report:
- 60% reduction in survey costs
- 75% faster data collection
- 50% improvement in accuracy
- 25% reduction in project delays

## Best Practices for Implementation

### Planning Phase
- Define survey requirements
- Establish accuracy standards
- Plan flight schedules
- Set up data management workflows

### Execution Phase
- Regular survey intervals
- Consistent flight patterns
- Quality control procedures
- Timely data processing

### Analysis Phase
- Progress comparison analysis
- Issue identification and reporting
- Stakeholder communication
- Documentation management

*Ready to streamline your construction projects with aerial mapping? Contact Vantage Vertical for a project consultation.*`,
    author: 'david-kimani',
    publishedAt: '2024-02-28',
    tags: ['aerial-mapping', 'construction', 'project-management', '3d-modeling'],
    category: 'aerial-mapping',
    featuredImage: '/survey.jpg',
    readTime: 9,
    seoTitle: 'Aerial Mapping for Construction Projects | Drone Surveying Kenya',
    seoDescription: 'Transform construction project management with aerial mapping. Accurate surveys, progress monitoring, and 3D modeling for better project outcomes.',
    featured: false,
    published: true
  },
  {
    id: '5',
    slug: 'drone-industry-trends-2024-kenya',
    title: 'Drone Industry Trends 2024: What to Expect in Kenya\'s Growing Market',
    excerpt: 'Analyze the latest trends shaping Kenya\'s drone industry, from regulatory changes to emerging applications and market opportunities.',
    content: `# Drone Industry Trends 2024: What to Expect in Kenya's Growing Market

Kenya's drone industry is experiencing rapid growth, driven by technological advances, regulatory improvements, and increasing adoption across various sectors. Here are the key trends shaping the market in 2024.

## Market Growth Projections

The Kenyan drone market is expected to grow by:
- 35% annual growth rate
- KES 15 billion market value by 2025
- 500+ registered commercial operators
- 2,000+ certified pilots

## Key Industry Trends

### 1. Regulatory Maturation
- Streamlined certification processes
- Clear operational guidelines
- International harmonization efforts
- Enhanced safety standards

### 2. Technology Advancement
- Improved battery life and range
- Enhanced sensor capabilities
- AI-powered autonomous operations
- Better data processing tools

### 3. Sector Diversification
- Healthcare delivery applications
- Environmental monitoring
- Infrastructure inspection
- Emergency response services

## Emerging Applications

### Healthcare Delivery
- Medical supply delivery to remote areas
- Emergency medical response
- Blood and vaccine transport
- Telemedicine support

### Environmental Monitoring
- Wildlife conservation
- Forest monitoring
- Water quality assessment
- Climate change research

### Smart Cities
- Traffic monitoring
- Urban planning
- Infrastructure inspection
- Emergency response

## Investment and Funding Trends

### Local Investment
- Government support programs
- Private sector partnerships
- International development funding
- Venture capital interest

### Technology Transfer
- International partnerships
- Local manufacturing initiatives
- Skills development programs
- Research collaborations

## Challenges and Opportunities

### Challenges
- Skills shortage in technical roles
- Limited local manufacturing
- Infrastructure constraints
- Public awareness gaps

### Opportunities
- Large addressable market
- Government support
- Growing digital economy
- Regional expansion potential

## Sector-Specific Outlook

### Agriculture
- Precision farming adoption
- Crop monitoring services
- Pesticide application
- Livestock management

### Security
- Border surveillance
- Critical infrastructure protection
- Event security
- Anti-poaching efforts

### Construction
- Site surveying and mapping
- Progress monitoring
- Safety inspections
- Quality control

### Mining
- Exploration and mapping
- Environmental monitoring
- Safety inspections
- Stockpile management

## Skills Development Needs

### Technical Skills
- Drone piloting and operations
- Data analysis and interpretation
- Maintenance and repair
- Software development

### Business Skills
- Project management
- Client relationship management
- Regulatory compliance
- Business development

## Recommendations for Industry Players

### For New Entrants
- Focus on niche applications
- Invest in training and certification
- Build strategic partnerships
- Develop local expertise

### For Existing Operators
- Diversify service offerings
- Invest in advanced technology
- Expand geographical coverage
- Develop specialized capabilities

## Future Outlook

The next five years will see:
- Increased automation and AI integration
- Expansion into new sectors
- Regional market development
- Enhanced regulatory framework

*Want to capitalize on these industry trends? Contact Vantage Vertical to discuss partnership opportunities and market entry strategies.*`,
    author: 'david-kimani',
    publishedAt: '2024-02-20',
    tags: ['industry-trends', 'market-analysis', 'kenya-drones', 'business-insights'],
    category: 'industry-insights',
    featuredImage: '/drone_on_air.jpg',
    readTime: 10,
    seoTitle: 'Drone Industry Trends 2024 Kenya | Market Analysis and Opportunities',
    seoDescription: 'Comprehensive analysis of Kenya\'s drone industry trends for 2024. Market growth, emerging applications, and business opportunities.',
    featured: true,
    published: true
  },
  {
    id: '6',
    slug: 'coffee-farm-ndvi-analysis-case-study',
    title: 'Case Study: Using NDVI Analysis to Boost Coffee Farm Productivity by 25%',
    excerpt: 'Detailed case study of how NDVI crop health analysis helped Nyeri coffee farmers identify disease patterns and optimize farming practices.',
    content: `# Case Study: Using NDVI Analysis to Boost Coffee Farm Productivity by 25%

This case study examines how Vantage Vertical's NDVI analysis services helped the Nyeri Coffee Cooperative improve crop health monitoring and achieve a 25% increase in productivity.

## Background

### The Challenge
The Nyeri Coffee Cooperative, representing 50 small-scale coffee farmers across 2,000 hectares, was experiencing:
- Declining coffee yields over three consecutive seasons
- Unidentified disease patterns affecting crop quality
- Inefficient use of fertilizers and pesticides
- Limited visibility into crop health across scattered farms

### The Client
- **Organization**: Nyeri Coffee Cooperative
- **Location**: Nyeri County, Kenya
- **Farm Size**: 2,000 hectares across 50 farms
- **Crop**: Arabica coffee
- **Challenge**: Declining yields and crop health issues

## Our Approach

### 1. Initial Assessment
We conducted a comprehensive baseline survey using:
- High-resolution RGB cameras for visual documentation
- Multispectral sensors for NDVI analysis
- Thermal imaging for stress detection
- GPS mapping for precise location data

### 2. Data Collection Protocol
- **Flight Schedule**: Weekly flights during growing season
- **Coverage**: Complete farm coverage with 80% overlap
- **Resolution**: 2cm ground sample distance
- **Sensors**: Multispectral camera with 5 bands

### 3. Analysis Methodology
- NDVI calculation for vegetation health
- Temporal analysis for trend identification
- Spatial analysis for disease pattern mapping
- Correlation analysis with environmental factors

## Key Findings

### Crop Health Patterns
- 30% of farms showed signs of coffee berry disease
- Nutrient deficiency patterns in 40% of surveyed areas
- Water stress indicators in elevated areas
- Optimal growth zones identified for expansion

### Disease Distribution
- Disease clusters correlated with drainage patterns
- Higher infection rates in densely planted areas
- Seasonal variations in disease pressure
- Early detection 3-4 weeks before visual symptoms

## Intervention Strategies

### 1. Targeted Treatment
- Precision application of fungicides in affected areas
- Selective pruning recommendations
- Drainage improvement suggestions
- Replanting strategies for severely affected areas

### 2. Nutrient Management
- Variable rate fertilizer application maps
- Soil testing recommendations for deficient areas
- Organic matter improvement strategies
- pH adjustment protocols

### 3. Water Management
- Irrigation scheduling optimization
- Drainage system improvements
- Mulching recommendations
- Water conservation strategies

## Results Achieved

### Quantitative Outcomes
- **Yield Increase**: 25% improvement in coffee production
- **Disease Reduction**: 60% decrease in coffee berry disease
- **Input Efficiency**: 35% reduction in pesticide usage
- **Cost Savings**: 20% reduction in input costs

### Qualitative Benefits
- Improved crop quality and market prices
- Enhanced farmer knowledge and skills
- Better decision-making capabilities
- Increased confidence in farming practices

## Technology Implementation

### Equipment Used
- **Drone Platform**: DJI Phantom 4 Multispectral
- **Sensors**: 5-band multispectral camera
- **Software**: Pix4D Agriculture, QGIS
- **Analysis Tools**: Custom NDVI algorithms

### Data Processing Workflow
1. Raw image collection and quality control
2. Orthomosaic generation and georeferencing
3. NDVI calculation and classification
4. Temporal analysis and change detection
5. Report generation and recommendations

## Farmer Training and Adoption

### Training Program
- NDVI interpretation workshops
- Smartphone app for field verification
- Best practices sharing sessions
- Ongoing technical support

### Adoption Metrics
- 90% of farmers actively using recommendations
- 80% improvement in treatment timing
- 70% increase in precision application
- 95% satisfaction with service quality

## Economic Impact

### Cost-Benefit Analysis
- **Investment**: KES 500,000 for season-long monitoring
- **Returns**: KES 2.5 million in increased revenue
- **ROI**: 400% return on investment
- **Payback Period**: 6 months

### Long-term Benefits
- Sustainable farming practices
- Reduced environmental impact
- Improved market competitiveness
- Enhanced food security

## Lessons Learned

### Success Factors
- Regular monitoring schedule
- Farmer engagement and training
- Integration with existing practices
- Timely intervention based on data

### Challenges Overcome
- Initial skepticism from traditional farmers
- Technical complexity of NDVI interpretation
- Coordination across multiple small farms
- Weather-dependent flight operations

## Recommendations for Similar Projects

### Best Practices
- Start with baseline assessment
- Establish regular monitoring schedule
- Provide comprehensive farmer training
- Integrate with existing agricultural practices

### Critical Success Factors
- Strong farmer buy-in and participation
- Timely data processing and reporting
- Clear, actionable recommendations
- Ongoing technical support

## Future Opportunities

### Expansion Plans
- Additional crops and farming systems
- Integration with weather data
- Predictive analytics development
- Mobile app for real-time monitoring

### Technology Enhancements
- AI-powered disease detection
- Automated prescription mapping
- Integration with farm management systems
- Satellite data fusion

*Interested in implementing NDVI analysis for your agricultural operations? Contact Vantage Vertical to discuss how we can help optimize your crop management.*`,
    author: 'grace-wanjiku',
    publishedAt: '2024-02-15',
    tags: ['case-study', 'ndvi-analysis', 'coffee-farming', 'precision-agriculture'],
    category: 'case-studies',
    featuredImage: '/agric_.jpg',
    readTime: 12,
    seoTitle: 'Coffee Farm NDVI Analysis Case Study | 25% Productivity Increase',
    seoDescription: 'Detailed case study showing how NDVI crop health analysis helped Nyeri coffee farmers achieve 25% productivity increase through precision agriculture.',
    featured: true,
    published: true
  }
];

// Update blog categories with actual counts
blogCategories.forEach(category => {
  if (category.id === 'all') {
    category.count = blogPosts.filter(post => post.published).length;
  } else {
    category.count = blogPosts.filter(post => post.published && post.category === category.id).length;
  }
});

// Blog tags (extracted from posts)
export const blogTags = [
  { id: 'precision-agriculture', name: 'Precision Agriculture', slug: 'precision-agriculture', count: 3 },
  { id: 'ndvi', name: 'NDVI', slug: 'ndvi', count: 2 },
  { id: 'kcaa-regulations', name: 'KCAA Regulations', slug: 'kcaa-regulations', count: 1 },
  { id: 'thermal-imaging', name: 'Thermal Imaging', slug: 'thermal-imaging', count: 1 },
  { id: 'aerial-mapping', name: 'Aerial Mapping', slug: 'aerial-mapping', count: 1 },
  { id: 'construction', name: 'Construction', slug: 'construction', count: 1 },
  { id: 'industry-trends', name: 'Industry Trends', slug: 'industry-trends', count: 1 },
  { id: 'case-study', name: 'Case Studies', slug: 'case-study', count: 1 },
  { id: 'security-drones', name: 'Security Drones', slug: 'security-drones', count: 1 },
  { id: 'drone-technology', name: 'Drone Technology', slug: 'drone-technology', count: 2 }
];

// Drone product data for shop
export const droneProducts = [
  {
    id: 'dji-mavic-3-enterprise',
    name: 'DJI Mavic 3 Enterprise',
    brand: 'DJI',
    category: 'commercial',
    price: 850000,
    originalPrice: 950000,
    inStock: true,
    stockLevel: 5,
    rating: 4.8,
    reviewCount: 24,
    description: 'Professional-grade drone perfect for commercial photography, mapping, and inspection work. Features advanced obstacle avoidance and extended flight time.',
    shortDescription: 'Professional commercial drone with 4K camera and advanced features',
    images: [
      '/drone_on_black_background.jpg',
      '/camera_dark_background.jpg',
      '/drone_frame.jpg',
      '/hands_on_drone.jpg'
    ],
    featuredImage: '/drone_on_black_background.jpg',
    specifications: {
      flightTime: '46 minutes',
      maxSpeed: '75 km/h',
      maxRange: '15 km',
      camera: '4K/120fps',
      gimbal: '3-axis mechanical',
      sensors: 'Omnidirectional obstacle sensing',
      weight: '915g',
      maxAltitude: '6000m',
      operatingTemp: '-10°C to 40°C',
      transmissionRange: '15 km (FCC)',
      videoResolution: '5.1K at 50fps',
      photoResolution: '20MP',
      storageOptions: 'Internal 8GB + microSD',
      chargingTime: '96 minutes'
    },
    features: [
      'Hasselblad L2D-20c camera',
      'Omnidirectional obstacle sensing',
      'Advanced RTH (Return to Home)',
      'Intelligent flight modes',
      'Professional editing software included',
      'Weather resistance IP54',
      'Dual control support',
      'Live streaming capabilities'
    ],
    applications: [
      'Commercial photography',
      'Real estate marketing',
      'Construction monitoring',
      'Infrastructure inspection',
      'Event coverage',
      'Content creation'
    ],
    included: [
      'DJI Mavic 3 Enterprise',
      'DJI RC Pro Enterprise',
      'Intelligent Flight Battery (3 units)',
      'Battery Charging Hub',
      '65W Portable Charger',
      'Storage Case',
      'Propellers (3 pairs)',
      'Gimbal Protector',
      'User Manual',
      'Warranty Card'
    ],
    tags: ['commercial', 'photography', 'mapping', 'inspection'],
    featured: true,
    bestSeller: true
  },
  {
    id: 'dji-agras-t40',
    name: 'DJI Agras T40',
    brand: 'DJI',
    category: 'agricultural',
    price: 1200000,
    originalPrice: 1350000,
    inStock: true,
    stockLevel: 3,
    rating: 4.9,
    reviewCount: 18,
    description: 'Advanced agricultural drone designed for precision spraying, seeding, and crop monitoring. Features dual atomized spraying system and intelligent operation modes.',
    shortDescription: 'Professional agricultural drone for precision farming applications',
    images: [
      '/spray_drone.jpg',
      '/agricultural_drone_on_air.jpg',
      '/agric-2.jpg',
      '/drone_on_teafarm.jpg'
    ],
    featuredImage: '/spray_drone.jpg',
    specifications: {
      flightTime: '25 minutes (full load)',
      maxSpeed: '10 m/s',
      sprayingWidth: '9 meters',
      tankCapacity: '40L (spraying) / 50kg (spreading)',
      camera: 'FPV camera + RGB camera',
      gimbal: 'Single-axis',
      sensors: 'Dual radar + binocular vision',
      weight: '24.5kg (empty)',
      maxPayload: '40kg',
      operatingTemp: '-10°C to 45°C',
      sprayRate: '7.2 L/min',
      efficiency: '25 hectares/hour',
      nozzles: '8 centrifugal nozzles',
      pumpPressure: '0.15-0.4 MPa'
    },
    features: [
      'Dual atomized spraying system',
      'Intelligent operation planning',
      'Terrain following radar',
      'Variable rate application',
      'Real-time monitoring',
      'Weather resistance IP67',
      'Modular design',
      'Smart battery management'
    ],
    applications: [
      'Crop spraying',
      'Fertilizer application',
      'Seed spreading',
      'Pest control',
      'Growth regulation',
      'Crop monitoring'
    ],
    included: [
      'DJI Agras T40 Aircraft',
      'Spraying System',
      'Spreading System',
      'DJI RC Plus',
      'Intelligent Flight Battery (4 units)',
      'Battery Station',
      'Radar Module',
      'FPV Gimbal and Camera',
      'Maintenance Kit',
      'User Manual'
    ],
    tags: ['agricultural', 'spraying', 'precision-farming', 'crop-monitoring'],
    featured: true,
    certification: 'KCAA Agricultural Operations Approved'
  },
  {
    id: 'dji-matrice-300-rtk',
    name: 'DJI Matrice 300 RTK',
    brand: 'DJI',
    category: 'surveillance',
    price: 2100000,
    originalPrice: 2300000,
    inStock: true,
    stockLevel: 2,
    rating: 4.9,
    reviewCount: 12,
    description: 'Enterprise-grade drone platform designed for industrial inspections, surveillance, and mapping missions. Features advanced AI capabilities and modular payload system.',
    shortDescription: 'Enterprise drone platform for surveillance and industrial applications',
    images: [
      '/black_drone_back_background.jpg',
      '/drone_on_black_background.jpg',
      '/camera_dark_background.jpg',
      '/survey.jpg'
    ],
    featuredImage: '/black_drone_back_background.jpg',
    specifications: {
      flightTime: '55 minutes',
      maxSpeed: '82.8 km/h',
      maxRange: '15 km',
      camera: 'Multiple payload options',
      gimbal: 'Dual gimbal support',
      sensors: '6-directional sensing + positioning',
      weight: '6.3kg (with batteries)',
      maxPayload: '2.7kg',
      operatingTemp: '-20°C to 50°C',
      transmissionRange: '15 km (FCC)',
      ipRating: 'IP45',
      maxAltitude: '7000m',
      windResistance: '15 m/s',
      hovAccuracy: '±0.1m (RTK enabled)'
    },
    features: [
      'Dual operator control',
      'AI Spot-Check',
      'Advanced RTK positioning',
      'Hot-swappable batteries',
      'IP45 weather protection',
      'Night vision capabilities',
      'Automated flight missions',
      'Real-time data transmission'
    ],
    applications: [
      'Industrial inspection',
      'Security surveillance',
      'Search and rescue',
      'Infrastructure monitoring',
      'Mapping and surveying',
      'Emergency response'
    ],
    included: [
      'Matrice 300 RTK Aircraft',
      'DJI Smart Controller Enterprise',
      'TB60 Intelligent Flight Battery (2 units)',
      'BS60 Battery Station',
      'Battery Charger',
      'Propellers (3 pairs)',
      'Storage Case',
      'PSDK Development Kit',
      'User Manual'
    ],
    tags: ['surveillance', 'enterprise', 'inspection', 'mapping'],
    featured: true,
    certification: 'KCAA Commercial Operations Certified'
  },
  {
    id: 'dji-phantom-4-rtk',
    name: 'DJI Phantom 4 RTK',
    brand: 'DJI',
    category: 'mapping',
    price: 680000,
    originalPrice: 750000,
    inStock: true,
    stockLevel: 4,
    rating: 4.7,
    reviewCount: 31,
    description: 'Precision mapping drone with RTK positioning system for centimeter-level accuracy. Ideal for surveying, construction monitoring, and precision agriculture.',
    shortDescription: 'RTK mapping drone with centimeter-level accuracy',
    images: [
      '/aerial_drone.jpg',
      '/survey.jpg',
      '/drone_frame.jpg',
      '/hands_on_drone.jpg'
    ],
    featuredImage: '/aerial_drone.jpg',
    specifications: {
      flightTime: '30 minutes',
      maxSpeed: '58 km/h',
      maxRange: '7 km',
      camera: '20MP 1" CMOS',
      gimbal: '3-axis mechanical',
      sensors: '5-direction obstacle sensing',
      weight: '1391g',
      rtkAccuracy: '1cm+1ppm (horizontal)',
      operatingTemp: '0°C to 40°C',
      transmissionRange: '7 km (FCC)',
      videoResolution: '4K at 60fps',
      photoResolution: '20MP',
      storageOptions: 'microSD card',
      positioningAccuracy: '1cm + 1ppm'
    },
    features: [
      'RTK centimeter-level positioning',
      'TimeSync 2.0',
      'Mechanical shutter',
      'PPK post-processing',
      'Intelligent flight modes',
      'Obstacle avoidance',
      'Professional mapping software',
      'Real-time kinematic positioning'
    ],
    applications: [
      'Land surveying',
      'Construction monitoring',
      'Mining operations',
      'Agriculture mapping',
      'Infrastructure inspection',
      'Topographic mapping'
    ],
    included: [
      'Phantom 4 RTK Aircraft',
      'Remote Controller',
      'Intelligent Flight Battery',
      'Battery Charger',
      'Propellers (4 pairs)',
      'Gimbal Clamp',
      'microSD Card (16GB)',
      'Mobile Device Holder',
      'User Manual'
    ],
    tags: ['mapping', 'surveying', 'rtk', 'precision'],
    featured: false,
    certification: 'Survey Grade Accuracy'
  },
  {
    id: 'dji-mini-3-pro',
    name: 'DJI Mini 3 Pro',
    brand: 'DJI',
    category: 'photography',
    price: 180000,
    originalPrice: 200000,
    inStock: true,
    stockLevel: 8,
    rating: 4.6,
    reviewCount: 45,
    description: 'Compact and lightweight drone perfect for content creators and hobbyists. Features professional camera capabilities in a portable package.',
    shortDescription: 'Compact drone with professional camera capabilities',
    images: [
      '/drone_home.jpg',
      '/filming.jpg',
      '/film-d.jpg',
      '/grey_drone.png'
    ],
    featuredImage: '/drone_home.jpg',
    specifications: {
      flightTime: '34 minutes',
      maxSpeed: '57.6 km/h',
      maxRange: '12 km',
      camera: '4K/60fps',
      gimbal: '3-axis mechanical',
      sensors: 'Tri-directional obstacle sensing',
      weight: '249g',
      maxAltitude: '4000m',
      operatingTemp: '-10°C to 40°C',
      transmissionRange: '12 km (FCC)',
      videoResolution: '4K at 60fps',
      photoResolution: '48MP',
      storageOptions: 'microSD card',
      chargingTime: '64 minutes'
    },
    features: [
      'Under 249g weight',
      'True vertical shooting',
      'Intelligent flight modes',
      'ActiveTrack 4.0',
      'MasterShots',
      'QuickShots',
      'Panorama modes',
      'Long battery life'
    ],
    applications: [
      'Content creation',
      'Travel photography',
      'Real estate',
      'Social media',
      'Personal projects',
      'Learning platform'
    ],
    included: [
      'DJI Mini 3 Pro',
      'DJI RC-N1 Remote Controller',
      'Intelligent Flight Battery',
      'Battery Charger',
      'Propellers (3 pairs)',
      'Gimbal Protector',
      'RC-N1 Control Sticks',
      'Type-C Cable',
      'User Manual'
    ],
    tags: ['photography', 'compact', 'content-creation', 'beginner-friendly'],
    featured: false,
    bestSeller: true
  },
  {
    id: 'dji-air-2s',
    name: 'DJI Air 2S',
    brand: 'DJI',
    category: 'photography',
    price: 220000,
    originalPrice: 250000,
    inStock: true,
    stockLevel: 6,
    rating: 4.7,
    reviewCount: 38,
    description: 'Advanced camera drone with 1-inch CMOS sensor delivering professional image quality. Perfect balance of portability and performance.',
    shortDescription: 'Advanced camera drone with 1-inch sensor',
    images: [
      '/drone_on_air.jpg',
      '/camera_dark_background.jpg',
      '/filming.jpg',
      '/drone_front.jpg'
    ],
    featuredImage: '/drone_on_air.jpg',
    specifications: {
      flightTime: '31 minutes',
      maxSpeed: '68.4 km/h',
      maxRange: '12 km',
      camera: '5.4K video, 20MP photos',
      gimbal: '3-axis mechanical',
      sensors: '4-direction obstacle sensing',
      weight: '595g',
      maxAltitude: '5000m',
      operatingTemp: '-10°C to 40°C',
      transmissionRange: '12 km (FCC)',
      videoResolution: '5.4K at 30fps',
      photoResolution: '20MP',
      storageOptions: 'Internal 8GB + microSD',
      sensorSize: '1-inch CMOS'
    },
    features: [
      '1-inch CMOS sensor',
      '5.4K video recording',
      'MasterShots',
      'FocusTrack',
      'SmartPhoto',
      'Hyperlapse',
      'Panorama modes',
      'Advanced safety features'
    ],
    applications: [
      'Professional photography',
      'Videography',
      'Real estate',
      'Events',
      'Travel',
      'Commercial projects'
    ],
    included: [
      'DJI Air 2S',
      'DJI RC-N1 Remote Controller',
      'Intelligent Flight Battery',
      'Battery Charger',
      'Propellers (3 pairs)',
      'Gimbal Protector',
      'RC-N1 Control Sticks',
      'USB-C Cable',
      'User Manual'
    ],
    tags: ['photography', 'videography', 'professional', '1-inch-sensor'],
    featured: false
  }
];

// Drone categories for filtering
export const droneCategories = [
  {
    id: 'commercial',
    name: 'Commercial',
    description: 'Professional drones for business applications, photography, and content creation.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    productCount: droneProducts.filter(p => p.category === 'commercial').length
  },
  {
    id: 'agricultural',
    name: 'Agricultural',
    description: 'Specialized drones for precision farming, crop monitoring, and agricultural applications.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    productCount: droneProducts.filter(p => p.category === 'agricultural').length
  },
  {
    id: 'surveillance',
    name: 'Surveillance',
    description: 'Enterprise-grade drones for security, monitoring, and industrial inspection applications.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    productCount: droneProducts.filter(p => p.category === 'surveillance').length
  },
  {
    id: 'mapping',
    name: 'Mapping',
    description: 'High-precision drones for surveying, mapping, and geospatial data collection.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    productCount: droneProducts.filter(p => p.category === 'mapping').length
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'Camera drones optimized for aerial photography and videography projects.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    productCount: droneProducts.filter(p => p.category === 'photography').length
  }
];

// Drone specifications for comparison
export const droneSpecs = [
  { key: 'flightTime', label: 'Flight Time', unit: 'minutes' },
  { key: 'maxSpeed', label: 'Max Speed', unit: 'km/h' },
  { key: 'maxRange', label: 'Max Range', unit: 'km' },
  { key: 'camera', label: 'Camera', unit: '' },
  { key: 'weight', label: 'Weight', unit: 'g' },
  { key: 'maxAltitude', label: 'Max Altitude', unit: 'm' },
  { key: 'operatingTemp', label: 'Operating Temperature', unit: '' },
  { key: 'transmissionRange', label: 'Transmission Range', unit: 'km' }
];