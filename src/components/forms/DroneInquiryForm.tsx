'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { droneProducts } from '@/data';

interface DroneInquiryFormData {
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

interface DroneInquiryFormProps {
  droneId?: string;
  onSubmit?: (data: DroneInquiryFormData) => Promise<void>;
  className?: string;
}

export default function DroneInquiryForm({ 
  droneId = '', 
  onSubmit,
  className = '' 
}: DroneInquiryFormProps) {
  const [formData, setFormData] = useState<DroneInquiryFormData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    droneId: droneId,
    inquiryType: 'quote',
    quantity: 1,
    budget: '',
    timeline: '',
    intendedUse: '',
    experience: 'intermediate',
    trainingNeeded: false,
    financingInterest: false,
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const selectedDrone = droneProducts.find(p => p.id === formData.droneId);

  const budgetRanges = [
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

  const inquiryTypes = [
    { value: 'quote', label: 'Get Price Quote', description: 'Get detailed pricing for specific drone' },
    { value: 'consultation', label: 'Free Consultation', description: 'Discuss needs and get recommendations' },
    { value: 'bulk', label: 'Bulk Order', description: 'Multiple units or fleet purchase' },
    { value: 'purchase', label: 'Ready to Purchase', description: 'Ready to buy with financing options' }
  ];

  const handleInputChange = useCallback((
    field: keyof DroneInquiryFormData,
    value: string | number | boolean
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.droneId) {
      newErrors.droneId = 'Please select a drone';
    }

    if (!formData.intendedUse.trim()) {
      newErrors.intendedUse = 'Please describe your intended use';
    }

    if (formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

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
          throw new Error('Failed to submit inquiry');
        }
      }

      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError(
        error instanceof Error 
          ? error.message 
          : 'An error occurred while submitting your inquiry. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, onSubmit, validateForm]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const resetForm = () => {
    setSubmitSuccess(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      droneId: droneId,
      inquiryType: 'quote',
      quantity: 1,
      budget: '',
      timeline: '',
      intendedUse: '',
      experience: 'intermediate',
      trainingNeeded: false,
      financingInterest: false,
      message: '',
    });
  };

  if (submitSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-green-800 mb-2">Inquiry Submitted Successfully!</h3>
        <p className="text-green-700 mb-6">
          Thank you for your interest in our drones. Our sales team will contact you within 24 hours 
          with detailed information and pricing.
        </p>
        <div className="space-y-2 text-sm text-green-600 mb-6">
          <p>• Free consultation included</p>
          <p>• KCAA compliance assistance</p>
          <p>• Training and support options</p>
          <p>• Flexible payment terms available</p>
        </div>
        <button
          onClick={resetForm}
          className="btn-primary px-6 py-2 text-sm font-semibold rounded-lg"
        >
          Submit Another Inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-gray-900 mb-2">
          Drone Inquiry Form
        </h2>
        <p className="text-gray-600">
          Get personalized recommendations and pricing for your drone needs
        </p>
      </div>

      {/* Selected Drone Display */}
      {selectedDrone && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white">
              <Image
                src={selectedDrone.featuredImage}
                alt={selectedDrone.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{selectedDrone.name}</h3>
              <p className="text-sm text-gray-600">{selectedDrone.brand}</p>
              <p className="text-lg font-bold text-primary">{formatPrice(selectedDrone.price)}</p>
            </div>
            <button
              type="button"
              onClick={() => handleInputChange('droneId', '')}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Drone Selection */}
      {!selectedDrone && (
        <div>
          <label htmlFor="droneId" className="block text-sm font-medium text-gray-700 mb-2">
            Select Drone *
          </label>
          <select
            id="droneId"
            value={formData.droneId}
            onChange={(e) => handleInputChange('droneId', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
            required
          >
            <option value="">Choose a drone model</option>
            {droneProducts.map(drone => (
              <option key={drone.id} value={drone.id}>
                {drone.name} - {formatPrice(drone.price)}
              </option>
            ))}
          </select>
          {errors.droneId && (
            <p className="mt-1 text-sm text-red-600">{errors.droneId}</p>
          )}
        </div>
      )}

      {/* Inquiry Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Type of Inquiry *
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {inquiryTypes.map((type) => (
            <label
              key={type.value}
              className={`relative flex items-start p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                formData.inquiryType === type.value
                  ? 'border-primary bg-primary/5 ring-2 ring-primary'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="inquiryType"
                value={type.value}
                checked={formData.inquiryType === type.value}
                onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex items-center mb-1">
                  <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                    formData.inquiryType === type.value
                      ? 'border-primary bg-primary'
                      : 'border-gray-300'
                  }`}>
                    {formData.inquiryType === type.value && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                    )}
                  </div>
                  <span className="font-medium text-gray-900">
                    {type.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 ml-7">
                  {type.description}
                </p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Personal Information */}
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
            placeholder="Enter your full name"
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
            placeholder="Enter your email address"
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
            placeholder="Enter your phone number"
            required
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
            Company/Organization
          </label>
          <input
            type="text"
            id="company"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
            placeholder="Enter company name (optional)"
          />
        </div>
      </div>

      {/* Quantity and Budget */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
            Quantity Needed
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
          />
          {errors.quantity && (
            <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
          )}
        </div>

        <div>
          <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
            Budget Range
          </label>
          <select
            id="budget"
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
          >
            <option value="">Select budget range</option>
            {budgetRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline and Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
            Purchase Timeline
          </label>
          <select
            id="timeline"
            value={formData.timeline}
            onChange={(e) => handleInputChange('timeline', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
          >
            <option value="">Select timeline</option>
            {timelineOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
            Drone Experience Level
          </label>
          <select
            id="experience"
            value={formData.experience}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Intended Use */}
      <div>
        <label htmlFor="intendedUse" className="block text-sm font-medium text-gray-700 mb-2">
          Intended Use *
        </label>
        <textarea
          id="intendedUse"
          rows={3}
          value={formData.intendedUse}
          onChange={(e) => handleInputChange('intendedUse', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
          placeholder="Describe how you plan to use the drone (e.g., aerial photography, mapping, agriculture, surveillance)"
          required
        />
        {errors.intendedUse && (
          <p className="mt-1 text-sm text-red-600">{errors.intendedUse}</p>
        )}
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="trainingNeeded"
            checked={formData.trainingNeeded}
            onChange={(e) => handleInputChange('trainingNeeded', e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <label htmlFor="trainingNeeded" className="ml-2 text-sm text-gray-700">
            I'm interested in drone training and certification programs
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="financingInterest"
            checked={formData.financingInterest}
            onChange={(e) => handleInputChange('financingInterest', e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
          />
          <label htmlFor="financingInterest" className="ml-2 text-sm text-gray-700">
            I'm interested in financing options and payment plans
          </label>
        </div>
      </div>

      {/* Additional Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Information
        </label>
        <textarea
          id="message"
          rows={4}
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200"
          placeholder="Any additional questions or requirements..."
        />
      </div>

      {/* Submit Error */}
      {submitError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700">{submitError}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
            isSubmitting
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-red-700 hover:shadow-lg transform hover:-translate-y-0.5'
          }`}
        >
          {isSubmitting ? (
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
          . Our sales team will contact you within 24 hours.
        </p>
      </div>
    </form>
  );
}