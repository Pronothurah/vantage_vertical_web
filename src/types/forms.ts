// Form-related type definitions

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
}

export interface ContactFormProps {
  variant?: 'full' | 'inline' | 'modal';
  onSubmit?: (data: ContactFormData) => Promise<void>;
  className?: string;
}

export interface FormFieldError {
  message: string;
  type: string;
}

export interface FormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Record<string, FormFieldError | undefined>;
  submitError?: string;
  submitSuccess?: boolean;
}

export interface ServiceOption {
  value: string;
  label: string;
}

export interface UrgencyLevel {
  value: 'low' | 'medium' | 'high';
  label: string;
  color: string;
}

export interface NewsletterFormData {
  email: string;
}

export interface NewsletterFormProps {
  variant?: 'inline' | 'footer' | 'modal';
  placeholder?: string;
  buttonText?: string;
  className?: string;
  onSuccess?: (email: string) => void;
}

export interface NewsletterFormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  error?: string;
  success?: boolean;
}

// Portfolio-related types
export interface PortfolioProject {
  id: string;
  title: string;
  category: 'mapping' | 'surveillance' | 'agritech' | 'commercial';
  serviceType: string;
  client: string;
  location: string;
  date: string;
  duration: string;
  description: string;
  challenge: string;
  solution: string;
  results: ProjectResult[];
  images: string[];
  featuredImage: string;
  technologies: string[];
  testimonial: ProjectTestimonial;
  tags: string[];
  featured: boolean;
}

export interface ProjectResult {
  metric: string;
  value: string;
  improvement: string;
}

export interface ProjectTestimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface PortfolioCategory {
  id: string;
  label: string;
  count: number;
}

export interface PortfolioStats {
  label: string;
  value: string;
  icon: string;
}

// Blog-related types
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  category: string;
  featuredImage: string;
  readTime: number;
  seoTitle: string;
  seoDescription: string;
  featured: boolean;
  published: boolean;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export interface BlogAuthor {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  role: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}

export interface BlogSearchParams {
  query?: string;
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
}

export interface BlogPagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNext: boolean;
  hasPrev: boolean;
}