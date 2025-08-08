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
  type: 'required' | 'pattern' | 'minLength' | 'maxLength' | 'custom';
}

export interface FormState {
  isSubmitting: boolean;
  isSubmitted: boolean;
  errors: Record<string, FormFieldError | undefined>;
  submitError?: string;
  submitSuccess: boolean;
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

export interface DroneInquiryData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  droneId: string;
  inquiryType: 'purchase' | 'quote' | 'bulk' | 'consultation';
  quantity: number;
  budget: string;
  timeline: string;
  intendedUse: string;
  experience: 'beginner' | 'intermediate' | 'advanced';
  trainingNeeded: boolean;
  financingInterest: boolean;
  message: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  published: boolean;
  featured: boolean;
  readTime: number;
  tags: string[];
  category: string;
  featuredImage: string;
  seoTitle: string;
  seoDescription: string;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
}

export interface EnrollmentData {
  name: string;
  email: string;
  phone: string;
  program: string;
  session: string;
  experience: string;
  motivation: string;
  accommodation?: boolean;
  terms: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface BlogAuthor {
  id: string;
  name: string;
  bio: string;
  avatar: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    email?: string;
  };
}