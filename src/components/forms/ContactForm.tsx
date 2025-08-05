'use client';

import { useState, useCallback } from 'react';
import { ContactFormData, ContactFormProps } from '@/types/forms';
import { serviceOptions, urgencyLevels } from '@/data';
import { useFormValidation } from '@/lib/useFormValidation';

export default function ContactForm({ 
  variant = 'full', 
  onSubmit,
  className = '' 
}: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
    urgency: 'medium',
  });

  const {
    formState,
    validateField,
    validateForm,
    setFieldError,
    clearFieldError,
    setSubmitting,
    setSubmitError,
    setSubmitSuccess,
    resetForm,
  } = useFormValidation();

  const handleInputChange = useCallback((
    field: keyof ContactFormData,
    value: string
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formState.errors[field]) {
      clearFieldError(field);
    }
  }, [formState.errors, clearFieldError]);

  const handleBlur = useCallback((field: keyof ContactFormData) => {
    const error = validateField(field, formData[field]);
    if (error) {
      setFieldError(field, error);
    }
  }, [formData, validateField, setFieldError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = validateForm(formData);
    const hasErrors = Object.values(errors).some(error => error !== undefined);
    
    if (hasErrors) {
      Object.keys(errors).forEach(field => {
        if (errors[field]) {
          setFieldError(field, errors[field]!);
        }
      });
      return;
    }

    setSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default API call
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error('Failed to submit form');
        }
      }

      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: '',
        urgency: 'medium',
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'An error occurred while submitting the form. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }, [formData, validateForm, setFieldError, setSubmitting, setSubmitError, setSubmitSuccess, onSubmit]);

  const getFieldClasses = (field: string) => {
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200";
    const errorClasses = formState.errors[field] ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300";
    return `${baseClasses} ${errorClasses}`;
  };

  const renderSuccessMessage = () => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center animate-fade-in">
      <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
      <p className="text-green-700 mb-4">
        Thank you for contacting Vantage Vertical. We've received your inquiry and will respond within 24 hours.
      </p>
      <button
        onClick={resetForm}
        className="text-primary hover:text-red-700 font-medium transition-colors duration-200"
      >
        Send Another Message
      </button>
    </div>
  );

  if (formState.submitSuccess) {
    return renderSuccessMessage();
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {variant === 'full' && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Get Started Today
          </h2>
          <p className="text-lg text-gray-600">
            Ready to elevate your project? Contact us for a free consultation.
          </p>
        </div>
      )}

      {/* Name and Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className={getFieldClasses('name')}
            placeholder="Enter your full name"
            disabled={formState.isSubmitting}
          />
          {formState.errors.name && (
            <p className="mt-1 text-sm text-red-600 animate-slide-down">
              {formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={getFieldClasses('email')}
            placeholder="Enter your email address"
            disabled={formState.isSubmitting}
          />
          {formState.errors.email && (
            <p className="mt-1 text-sm text-red-600 animate-slide-down">
              {formState.errors.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Phone Number */}
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          onBlur={() => handleBlur('phone')}
          className={getFieldClasses('phone')}
          placeholder="Enter your phone number"
          disabled={formState.isSubmitting}
        />
        {formState.errors.phone && (
          <p className="mt-1 text-sm text-red-600 animate-slide-down">
            {formState.errors.phone.message}
          </p>
        )}
      </div>

      {/* Service Selection */}
      <div>
        <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
          Service Needed *
        </label>
        <select
          id="service"
          value={formData.service}
          onChange={(e) => handleInputChange('service', e.target.value)}
          onBlur={() => handleBlur('service')}
          className={getFieldClasses('service')}
          disabled={formState.isSubmitting}
        >
          <option value="">Select a service</option>
          {serviceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {formState.errors.service && (
          <p className="mt-1 text-sm text-red-600 animate-slide-down">
            {formState.errors.service.message}
          </p>
        )}
      </div>

      {/* Urgency Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Project Urgency *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {urgencyLevels.map((level) => (
            <label
              key={level.value}
              className={`relative flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.urgency === level.value
                  ? 'border-primary bg-red-50 ring-2 ring-primary'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="urgency"
                value={level.value}
                checked={formData.urgency === level.value}
                onChange={(e) => handleInputChange('urgency', e.target.value)}
                className="sr-only"
                disabled={formState.isSubmitting}
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    formData.urgency === level.value
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {formData.urgency === level.value && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <span className={`font-medium ${level.color}`}>
                    {level.label}
                  </span>
                </div>
              </div>
            </label>
          ))}
        </div>
        {formState.errors.urgency && (
          <p className="mt-1 text-sm text-red-600 animate-slide-down">
            {formState.errors.urgency.message}
          </p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Project Details *
        </label>
        <textarea
          id="message"
          rows={variant === 'inline' ? 3 : 5}
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          onBlur={() => handleBlur('message')}
          className={getFieldClasses('message')}
          placeholder="Tell us about your project, location, timeline, and any specific requirements..."
          disabled={formState.isSubmitting}
        />
        <div className="flex justify-between items-center mt-1">
          {formState.errors.message ? (
            <p className="text-sm text-red-600 animate-slide-down">
              {formState.errors.message.message}
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Minimum 10 characters required
            </p>
          )}
          <p className="text-sm text-gray-400">
            {formData.message.length}/1000
          </p>
        </div>
      </div>

      {/* Submit Error */}
      {formState.submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-slide-down">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{formState.submitError}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className={`w-full bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
            formState.isSubmitting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {formState.isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending Message...
            </div>
          ) : (
            'Send Message'
          )}
        </button>
      </div>

      {/* Privacy Notice */}
      <div className="text-center text-sm text-gray-500">
        <p>
          By submitting this form, you agree to our{' '}
          <a href="/privacy" className="text-primary hover:text-red-700 transition-colors duration-200">
            Privacy Policy
          </a>
          . We'll respond within 24 hours.
        </p>
      </div>
    </form>
  );
}