import { renderHook, act } from '@testing-library/react';
import { useFormValidation } from '../useFormValidation';
import { ContactFormData } from '@/types/forms';

// Mock the data module
jest.mock('@/data', () => ({
  contactFormValidation: {
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
  },
}));

describe('useFormValidation', () => {
  it('initializes with default state', () => {
    const { result } = renderHook(() => useFormValidation());

    expect(result.current.formState).toEqual({
      isSubmitting: false,
      isSubmitted: false,
      errors: {},
      submitError: undefined,
      submitSuccess: false,
    });
  });

  describe('validateField', () => {
    it('validates required fields', () => {
      const { result } = renderHook(() => useFormValidation());

      const error = result.current.validateField('name', '');
      expect(error).toEqual({
        message: 'Name is required',
        type: 'required',
      });
    });

    it('validates minimum length', () => {
      const { result } = renderHook(() => useFormValidation());

      const error = result.current.validateField('name', 'A');
      expect(error).toEqual({
        message: 'Name must be at least 2 characters',
        type: 'minLength',
      });
    });

    it('validates maximum length', () => {
      const { result } = renderHook(() => useFormValidation());

      const longMessage = 'A'.repeat(1001);
      const error = result.current.validateField('message', longMessage);
      expect(error).toEqual({
        message: 'Message must not exceed 1000 characters',
        type: 'maxLength',
      });
    });

    it('validates email pattern', () => {
      const { result } = renderHook(() => useFormValidation());

      const error = result.current.validateField('email', 'invalid-email');
      expect(error).toEqual({
        message: 'Please enter a valid email address',
        type: 'pattern',
      });
    });

    it('validates phone pattern', () => {
      const { result } = renderHook(() => useFormValidation());

      const error = result.current.validateField('phone', 'invalid-phone');
      expect(error).toEqual({
        message: 'Please enter a valid phone number',
        type: 'pattern',
      });
    });

    it('returns null for valid fields', () => {
      const { result } = renderHook(() => useFormValidation());

      expect(result.current.validateField('name', 'John Doe')).toBeNull();
      expect(result.current.validateField('email', 'john@example.com')).toBeNull();
      expect(result.current.validateField('phone', '+1234567890')).toBeNull();
      expect(result.current.validateField('message', 'This is a valid message')).toBeNull();
    });

    it('returns null for unknown fields', () => {
      const { result } = renderHook(() => useFormValidation());

      const error = result.current.validateField('unknownField' as any, 'value');
      expect(error).toBeNull();
    });
  });

  describe('validateForm', () => {
    it('validates all form fields', () => {
      const { result } = renderHook(() => useFormValidation());

      const formData: ContactFormData = {
        name: '',
        email: 'invalid-email',
        phone: '',
        service: '',
        message: 'short',
        urgency: 'medium',
      };

      const errors = result.current.validateForm(formData);

      expect(errors.name).toEqual({
        message: 'Name is required',
        type: 'required',
      });
      expect(errors.email).toEqual({
        message: 'Please enter a valid email address',
        type: 'pattern',
      });
      expect(errors.phone).toEqual({
        message: 'Phone number is required',
        type: 'required',
      });
      expect(errors.service).toEqual({
        message: 'Please select a service',
        type: 'required',
      });
      expect(errors.message).toEqual({
        message: 'Message must be at least 10 characters',
        type: 'minLength',
      });
    });

    it('returns empty errors for valid form', () => {
      const { result } = renderHook(() => useFormValidation());

      const formData: ContactFormData = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1234567890',
        service: 'aerial-mapping',
        message: 'This is a valid message with enough characters',
        urgency: 'medium',
      };

      const errors = result.current.validateForm(formData);

      expect(Object.values(errors).every(error => error === undefined)).toBe(true);
    });
  });

  describe('form state management', () => {
    it('sets field error', () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.setFieldError('name', {
          message: 'Name is required',
          type: 'required',
        });
      });

      expect(result.current.formState.errors.name).toEqual({
        message: 'Name is required',
        type: 'required',
      });
    });

    it('clears field error', () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.setFieldError('name', {
          message: 'Name is required',
          type: 'required',
        });
      });

      act(() => {
        result.current.clearFieldError('name');
      });

      expect(result.current.formState.errors.name).toBeUndefined();
    });

    it('sets submitting state', () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.setSubmitting(true);
      });

      expect(result.current.formState.isSubmitting).toBe(true);
    });

    it('sets submit error', () => {
      const { result } = renderHook(() => useFormValidation());

      act(() => {
        result.current.setSubmitError('Network error');
      });

      expect(result.current.formState.submitError).toBe('Network error');
      expect(result.current.formState.submitSuccess).toBe(false);
    });

    it('sets submit success', () => {
      const { result } = renderHook(() => useFormValidation());

      // First set some errors
      act(() => {
        result.current.setFieldError('name', {
          message: 'Name is required',
          type: 'required',
        });
        result.current.setSubmitError('Network error');
      });

      act(() => {
        result.current.setSubmitSuccess(true);
      });

      expect(result.current.formState.submitSuccess).toBe(true);
      expect(result.current.formState.submitError).toBeUndefined();
      expect(result.current.formState.isSubmitted).toBe(true);
      expect(result.current.formState.errors).toEqual({});
    });

    it('resets form state', () => {
      const { result } = renderHook(() => useFormValidation());

      // Set some state
      act(() => {
        result.current.setFieldError('name', {
          message: 'Name is required',
          type: 'required',
        });
        result.current.setSubmitting(true);
        result.current.setSubmitError('Network error');
      });

      act(() => {
        result.current.resetForm();
      });

      expect(result.current.formState).toEqual({
        isSubmitting: false,
        isSubmitted: false,
        errors: {},
        submitError: undefined,
        submitSuccess: false,
      });
    });
  });
});