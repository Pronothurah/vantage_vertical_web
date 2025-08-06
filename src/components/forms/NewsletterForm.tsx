'use client';

import { useState, useCallback } from 'react';
import { NewsletterFormData, NewsletterFormProps, NewsletterFormState } from '@/types/forms';

export default function NewsletterForm({
  variant = 'inline',
  placeholder = 'Enter your email address',
  buttonText = 'Subscribe',
  className = '',
  onSuccess
}: NewsletterFormProps) {
  const [email, setEmail] = useState('');
  const [formState, setFormState] = useState<NewsletterFormState>({
    isSubmitting: false,
    isSubmitted: false,
    error: undefined,
    success: false,
  });

  const validateEmail = useCallback((email: string): string | null => {
    if (!email || email.trim() === '') {
      return 'Email is required';
    }

    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address';
    }

    return null;
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email
    const emailError = validateEmail(email);
    if (emailError) {
      setFormState(prev => ({
        ...prev,
        error: emailError,
        success: false,
      }));
      return;
    }

    setFormState(prev => ({
      ...prev,
      isSubmitting: true,
      error: undefined,
    }));

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      // Success
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        isSubmitted: true,
        success: true,
        error: undefined,
      }));

      // Call success callback if provided
      if (onSuccess) {
        onSuccess(email.trim());
      }

      // Clear email field
      setEmail('');

    } catch (error) {
      setFormState(prev => ({
        ...prev,
        isSubmitting: false,
        error: error instanceof Error ? error.message : 'An error occurred. Please try again.',
        success: false,
      }));
    }
  }, [email, validateEmail, onSuccess]);

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    
    // Clear error when user starts typing
    if (formState.error) {
      setFormState(prev => ({
        ...prev,
        error: undefined,
      }));
    }
  }, [formState.error]);

  const resetForm = useCallback(() => {
    setFormState({
      isSubmitting: false,
      isSubmitted: false,
      error: undefined,
      success: false,
    });
    setEmail('');
  }, []);

  // Success message component
  const renderSuccessMessage = () => (
    <div className="text-center animate-fade-in">
      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full">
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-green-800 mb-2">
        Subscription Successful!
      </h3>
      <p className="text-green-700 mb-4">
        Please check your email to confirm your subscription.
      </p>
      <button
        onClick={resetForm}
        className="text-primary hover:text-red-700 font-medium transition-colors duration-200"
      >
        Subscribe Another Email
      </button>
    </div>
  );

  // Render success state
  if (formState.success && variant !== 'footer') {
    return (
      <div className={className}>
        {renderSuccessMessage()}
      </div>
    );
  }

  // Get variant-specific styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'footer':
        return {
          container: 'flex flex-col sm:flex-row gap-3',
          input: 'flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200',
          button: 'px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 whitespace-nowrap',
          error: 'text-red-400 text-sm mt-2',
          success: 'text-green-400 text-sm mt-2'
        };
      case 'modal':
        return {
          container: 'space-y-4',
          input: 'w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200',
          button: 'w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200',
          error: 'text-red-600 text-sm',
          success: 'text-green-600 text-sm'
        };
      default: // inline
        return {
          container: 'flex gap-3',
          input: 'flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200',
          button: 'px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 whitespace-nowrap',
          error: 'text-red-600 text-sm mt-2',
          success: 'text-green-600 text-sm mt-2'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={className}>
      <form onSubmit={handleSubmit} className={styles.container}>
        <div className={variant === 'footer' || variant === 'inline' ? 'flex-1' : ''}>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder={placeholder}
            className={`${styles.input} ${formState.error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
            disabled={formState.isSubmitting}
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={formState.isSubmitting || !email.trim()}
          className={`${styles.button} ${
            formState.isSubmitting || !email.trim()
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {formState.isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </div>
          ) : (
            buttonText
          )}
        </button>
      </form>

      {/* Error message */}
      {formState.error && (
        <div className={`${styles.error} animate-slide-down`}>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formState.error}
          </div>
        </div>
      )}

      {/* Success message for footer variant */}
      {formState.success && variant === 'footer' && (
        <div className={`${styles.success} animate-slide-down`}>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Thank you for subscribing! Please check your email to confirm.
          </div>
        </div>
      )}

      {/* Privacy notice */}
      {variant !== 'footer' && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          By subscribing, you agree to our{' '}
          <a href="/privacy" className="text-primary hover:text-red-700 transition-colors duration-200">
            Privacy Policy
          </a>
          . Unsubscribe at any time.
        </p>
      )}
    </div>
  );
}