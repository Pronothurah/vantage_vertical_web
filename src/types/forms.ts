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