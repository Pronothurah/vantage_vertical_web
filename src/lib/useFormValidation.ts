import { useState, useCallback } from 'react';
import { ContactFormData, FormState, FormFieldError } from '@/types/forms';
import { contactFormValidation } from '@/data';

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

export function useFormValidation() {
  const [formState, setFormState] = useState<FormState>({
    isSubmitting: false,
    isSubmitted: false,
    errors: {},
    submitError: undefined,
    submitSuccess: false,
  });

  const validateField = useCallback((name: keyof ContactFormData, value: string): FormFieldError | null => {
    const rules = contactFormValidation[name] as ValidationRule;
    if (!rules) return null;

    // Required validation
    if (rules.required && (!value || value.trim() === '')) {
      return { message: rules.required, type: 'required' };
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') return null;

    // Pattern validation
    if (rules.pattern && !rules.pattern.value.test(value)) {
      return { message: rules.pattern.message, type: 'pattern' };
    }

    // Min length validation
    if (rules.minLength && value.length < rules.minLength.value) {
      return { message: rules.minLength.message, type: 'minLength' };
    }

    // Max length validation
    if (rules.maxLength && value.length > rules.maxLength.value) {
      return { message: rules.maxLength.message, type: 'maxLength' };
    }

    return null;
  }, []);

  const validateForm = useCallback((data: ContactFormData): Record<string, FormFieldError | undefined> => {
    const errors: Record<string, FormFieldError | undefined> = {};

    Object.keys(data).forEach((key) => {
      const fieldName = key as keyof ContactFormData;
      const error = validateField(fieldName, data[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    });

    return errors;
  }, [validateField]);

  const setFieldError = useCallback((field: string, error: FormFieldError | null) => {
    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error || undefined,
      },
    }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setFormState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: undefined,
      },
    }));
  }, []);

  const setSubmitting = useCallback((isSubmitting: boolean) => {
    setFormState(prev => ({
      ...prev,
      isSubmitting,
      submitError: isSubmitting ? undefined : prev.submitError,
    }));
  }, []);

  const setSubmitError = useCallback((error: string) => {
    setFormState(prev => ({
      ...prev,
      submitError: error,
      submitSuccess: false,
    }));
  }, []);

  const setSubmitSuccess = useCallback((success: boolean) => {
    setFormState(prev => ({
      ...prev,
      submitSuccess: success,
      submitError: success ? undefined : prev.submitError,
      isSubmitted: success,
      errors: success ? {} : prev.errors,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormState({
      isSubmitting: false,
      isSubmitted: false,
      errors: {},
      submitError: undefined,
      submitSuccess: false,
    });
  }, []);

  return {
    formState,
    validateField,
    validateForm,
    setFieldError,
    clearFieldError,
    setSubmitting,
    setSubmitError,
    setSubmitSuccess,
    resetForm,
  };
}