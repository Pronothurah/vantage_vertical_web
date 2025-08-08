'use client';

import { useState, useCallback, useId } from 'react';
import { DroneInquiryData } from '@/types/forms';
import { useFormValidation } from '@/lib/useFormValidation';
import { ariaAttributes } from '@/lib/accessibility';

interface DroneInquiryFormProps {
  variant?: 'full' | 'inline' | 'modal';
  onSubmit?: (data: DroneInquiryData) => Promise<void>;
  className?: string;
  preselectedDroneId?: string;
}

const inquiryTypeOptions = [
  { value: 'consultation', label: 'Free Consultation', description: 'Get expert advice on the best drone for your needs' },
  { value: 'quote', label: 'Price Quote', description: 'Request detailed pricing information' },
  { value: 'purchase', label: 'Ready to Purchase', description: 'I know what I want and ready to buy' },
  { value: 'bulk', label: 'Bulk Order', description: 'Multiple units or fleet purchase' }
];

const budgetOptions = [
  { value: 'under-200k', label: 'Under KES 200,000' },
  { value: '200k-500k', label: 'KES 200,000 - 500,000' },
  { value: '500k-1m', label: 'KES 500,000 - 1,000,000' },
  { value: '1m-2m', label: 'KES 1,000,000 - 2,000,000' },
  { value: 'above-2m', label: 'Above KES 2,000,000' },
  { value: 'flexible', label: 'Flexible based on value' }
];

const timelineOptions = [
  { value: 'immediate', label: 'Immediate (1-2 weeks)' },
  { value: 'short', label: 'Short term (1 month)' },
  { value: 'medium', label: 'Medium term (2-3 months)' },
  { value: 'long', label: 'Long term (3+ months)' },
  { value: 'planning', label: 'Just planning/researching' }
];

const experienceOptions = [
  { value: 'beginner', label: 'Beginner', description: 'New to drone operations' },
  { value: 'intermediate', label: 'Intermediate', description: 'Some drone experience' },
  { value: 'advanced', label: 'Advanced', description: 'Experienced drone operator' }
];

// Common drone models - in a real app, this would come from your data
const droneModels = [
  { id: 'dji-mavic-3-enterprise', name: 'DJI Mavic 3 Enterprise' },
  { id: 'dji-phantom-4-rtk', name: 'DJI Phantom 4 RTK' },
  { id: 'dji-matrice-300-rtk', name: 'DJI Matrice 300 RTK' },
  { id: 'dji-agras-t40', name: 'DJI Agras T40' },
  { id: 'autel-evo-max-4t', name: 'Autel EVO Max 4T' },
  { id: 'other', name: 'Other / Not Sure' }
];

export default function DroneInquiryForm({ 
  variant = 'full', 
  onSubmit,
  className = '',
  preselectedDroneId
}: DroneInquiryFormProps) {
  const [formData, setFormData] = useState<DroneInquiryData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    droneId: preselectedDroneId || '',
    inquiryType: 'consultation',
    quantity: 1,
    budget: '',
    timeline: '',
    intendedUse: '',
    experience: 'beginner',
    trainingNeeded: false,
    financingInterest: false,
    message: ''
  });

  // Generate unique IDs for accessibility
  const formId = useId();
  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const phoneId = `${formId}-phone`;
  const companyId = `${formId}-company`;
  const droneId = `${formId}-drone`;
  const inquiryTypeId = `${formId}-inquiry-type`;
  const quantityId = `${formId}-quantity`;
  const budgetId = `${formId}-budget`;
  const timelineId = `${formId}-timeline`;
  const intendedUseId = `${formId}-intended-use`;
  const experienceId = `${formId}-experience`;
  const messageId = `${formId}-message`;
  const errorId = `${formId}-error`;
  const successId = `${formId}-success`;

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
    field: keyof DroneInquiryData,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (formState.errors[field]) {
      clearFieldError(field);
    }
  }, [formState.errors, clearFieldError]);

  const handleBlur = useCallback((field: keyof DroneInquiryData) => {
    // Basic validation for drone inquiry form
    const value = formData[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      setFieldError(field, { message: 'This field is required', type: 'required' });
    } else {
      clearFieldError(field);
    }
  }, [formData, setFieldError, clearFieldError]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Custom validation for drone inquiry form
    const errors: Record<string, any> = {};
    
    if (!formData.name.trim()) {
      errors.name = { message: 'Name is required' };
    }
    
    if (!formData.email.trim()) {
      errors.email = { message: 'Email is required' };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = { message: 'Please enter a valid email address' };
    }
    
    if (!formData.phone.trim()) {
      errors.phone = { message: 'Phone number is required' };
    }
    
    if (!formData.droneId) {
      errors.droneId = { message: 'Please select a drone model' };
    }
    
    if (!formData.intendedUse.trim()) {
      errors.intendedUse = { message: 'Please describe your intended use' };
    } else if (formData.intendedUse.trim().length < 10) {
      errors.intendedUse = { message: 'Please provide more details (minimum 10 characters)' };
    }
    
    const hasErrors = Object.keys(errors).length > 0;
    
    if (hasErrors) {
      Object.keys(errors).forEach(field => {
        setFieldError(field, errors[field]);
      });
      return;
    }

    setSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        // Default API call
        const response = await fetch('/api/drone-inquiry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit inquiry');
        }
      }

      setSubmitSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        droneId: preselectedDroneId || '',
        inquiryType: 'consultation',
        quantity: 1,
        budget: '',
        timeline: '',
        intendedUse: '',
        experience: 'beginner',
        trainingNeeded: false,
        financingInterest: false,
        message: ''
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'An error occurred while submitting your inquiry. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }, [formData, setFieldError, setSubmitting, setSubmitError, setSubmitSuccess, onSubmit, preselectedDroneId]);

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
      <h3 className="text-lg font-semibold text-green-800 mb-2">Inquiry Submitted Successfully!</h3>
      <p className="text-green-700 mb-4">
        Thank you for your interest in our drone solutions. Our sales team will contact you within 24 hours with personalized recommendations and pricing.
      </p>
      <button
        onClick={resetForm}
        className="text-primary hover:text-red-700 font-medium transition-colors duration-200"
      >
        Submit Another Inquiry
      </button>
    </div>
  );

  if (formState.submitSuccess) {
    return renderSuccessMessage();
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`space-y-6 ${className}`}
      {...ariaAttributes.form(undefined, formState.submitError ? errorId : undefined, !!formState.submitError)}
      noValidate
    >
      {variant === 'full' && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-heading font-bold text-gray-900 mb-2">
            Get Your Drone Quote
          </h2>
          <p className="text-lg text-gray-600">
            Tell us about your needs and we'll recommend the perfect drone solution for you.
          </p>
        </div>
      )}

      {/* Inquiry Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          What type of inquiry is this? *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {inquiryTypeOptions.map((option) => (
            <label
              key={option.value}
              className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.inquiryType === option.value
                  ? 'border-primary bg-red-50 ring-2 ring-primary'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="inquiryType"
                value={option.value}
                checked={formData.inquiryType === option.value}
                onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                className="sr-only"
                disabled={formState.isSubmitting}
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    formData.inquiryType === option.value
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {formData.inquiryType === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 ml-7 mt-1">
                  {option.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor={nameId} className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id={nameId}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            className={getFieldClasses('name')}
            placeholder="Enter your full name"
            disabled={formState.isSubmitting}
          />
          {formState.errors.name && (
            <p className="mt-1 text-sm text-red-600 animate-slide-down" role="alert">
              {formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={emailId} className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id={emailId}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            className={getFieldClasses('email')}
            placeholder="Enter your email address"
            disabled={formState.isSubmitting}
          />
          {formState.errors.email && (
            <p className="mt-1 text-sm text-red-600 animate-slide-down" role="alert">
              {formState.errors.email.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor={phoneId} className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id={phoneId}
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            onBlur={() => handleBlur('phone')}
            className={getFieldClasses('phone')}
            placeholder="Enter your phone number"
            disabled={formState.isSubmitting}
          />
          {formState.errors.phone && (
            <p className="mt-1 text-sm text-red-600 animate-slide-down" role="alert">
              {formState.errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor={companyId} className="block text-sm font-medium text-gray-700 mb-2">
            Company/Organization
          </label>
          <input
            type="text"
            id={companyId}
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className={getFieldClasses('company')}
            placeholder="Enter company name (optional)"
            disabled={formState.isSubmitting}
          />
        </div>
      </div>

      {/* Drone Selection */}
      <div>
        <label htmlFor={droneId} className="block text-sm font-medium text-gray-700 mb-2">
          Drone Model of Interest *
        </label>
        <select
          id={droneId}
          value={formData.droneId}
          onChange={(e) => handleInputChange('droneId', e.target.value)}
          onBlur={() => handleBlur('droneId')}
          className={getFieldClasses('droneId')}
          disabled={formState.isSubmitting}
        >
          <option value="">Select a drone model</option>
          {droneModels.map((drone) => (
            <option key={drone.id} value={drone.id}>
              {drone.name}
            </option>
          ))}
        </select>
        {formState.errors.droneId && (
          <p className="mt-1 text-sm text-red-600 animate-slide-down" role="alert">
            {formState.errors.droneId.message}
          </p>
        )}
      </div>

      {/* Quantity and Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor={quantityId} className="block text-sm font-medium text-gray-700 mb-2">
            Quantity Needed
          </label>
          <input
            type="number"
            id={quantityId}
            min="1"
            max="100"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
            className={getFieldClasses('quantity')}
            disabled={formState.isSubmitting}
          />
        </div>

        <div>
          <label htmlFor={budgetId} className="block text-sm font-medium text-gray-700 mb-2">
            Budget Range
          </label>
          <select
            id={budgetId}
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            className={getFieldClasses('budget')}
            disabled={formState.isSubmitting}
          >
            <option value="">Select budget range</option>
            {budgetOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <label htmlFor={timelineId} className="block text-sm font-medium text-gray-700 mb-2">
          Timeline
        </label>
        <select
          id={timelineId}
          value={formData.timeline}
          onChange={(e) => handleInputChange('timeline', e.target.value)}
          className={getFieldClasses('timeline')}
          disabled={formState.isSubmitting}
        >
          <option value="">Select timeline</option>
          {timelineOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Your Drone Experience Level
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {experienceOptions.map((option) => (
            <label
              key={option.value}
              className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.experience === option.value
                  ? 'border-primary bg-red-50 ring-2 ring-primary'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="experience"
                value={option.value}
                checked={formData.experience === option.value}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="sr-only"
                disabled={formState.isSubmitting}
              />
              <div className="flex-1">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    formData.experience === option.value
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {formData.experience === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-900">
                    {option.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 ml-7 mt-1">
                  {option.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Intended Use */}
      <div>
        <label htmlFor={intendedUseId} className="block text-sm font-medium text-gray-700 mb-2">
          Intended Use *
        </label>
        <textarea
          id={intendedUseId}
          rows={3}
          value={formData.intendedUse}
          onChange={(e) => handleInputChange('intendedUse', e.target.value)}
          onBlur={() => handleBlur('intendedUse')}
          className={getFieldClasses('intendedUse')}
          placeholder="Describe how you plan to use the drone (e.g., aerial photography, mapping, agriculture, surveillance, etc.)"
          disabled={formState.isSubmitting}
        />
        {formState.errors.intendedUse && (
          <p className="mt-1 text-sm text-red-600 animate-slide-down" role="alert">
            {formState.errors.intendedUse.message}
          </p>
        )}
      </div>

      {/* Additional Services */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Additional Services
        </label>
        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.trainingNeeded}
              onChange={(e) => handleInputChange('trainingNeeded', e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              disabled={formState.isSubmitting}
            />
            <span className="ml-3 text-gray-700">
              I'm interested in drone pilot training
            </span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.financingInterest}
              onChange={(e) => handleInputChange('financingInterest', e.target.checked)}
              className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
              disabled={formState.isSubmitting}
            />
            <span className="ml-3 text-gray-700">
              I'm interested in financing options
            </span>
          </label>
        </div>
      </div>

      {/* Additional Message */}
      <div>
        <label htmlFor={messageId} className="block text-sm font-medium text-gray-700 mb-2">
          Additional Information
        </label>
        <textarea
          id={messageId}
          rows={4}
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          className={getFieldClasses('message')}
          placeholder="Any additional questions or specific requirements you'd like to discuss..."
          disabled={formState.isSubmitting}
        />
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
              Submitting Inquiry...
            </div>
          ) : (
            'Submit Inquiry'
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
          . Our sales team will respond within 24 hours.
        </p>
      </div>
    </form>
  );
}