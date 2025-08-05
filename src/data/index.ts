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