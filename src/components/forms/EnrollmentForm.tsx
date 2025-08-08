'use client';

import { useState } from 'react';
import { trainingPrograms } from '@/data';

interface EnrollmentFormData {
  name: string;
  email: string;
  phone: string;
  program: string;
  session: string;
  experience: string;
  motivation: string;
  accommodation: boolean;
  terms: boolean;
}

interface EnrollmentFormProps {
  selectedProgram?: string;
  onSubmit?: (data: EnrollmentFormData) => Promise<void>;
  className?: string;
}

export default function EnrollmentForm({ 
  selectedProgram, 
  onSubmit,
  className = '' 
}: EnrollmentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState<EnrollmentFormData>({
    name: '',
    email: '',
    phone: '',
    program: selectedProgram || '',
    session: '',
    experience: '',
    motivation: '',
    accommodation: false,
    terms: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^(\+254|0)[17]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
    }
    if (!formData.program) newErrors.program = 'Please select a training program';
    if (!formData.session) newErrors.session = 'Please select a training session';
    if (!formData.experience) newErrors.experience = 'Please indicate your experience level';
    if (!formData.motivation.trim()) newErrors.motivation = 'Please tell us about your motivation';
    else if (formData.motivation.length < 50) {
      newErrors.motivation = 'Please provide at least 50 characters';
    }
    if (!formData.terms) newErrors.terms = 'You must accept the terms and conditions';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        const response = await fetch('/api/enrollment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Submission failed');
      }
      
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedProgramData = trainingPrograms.find(p => p.id === formData.program);
  const availableSessions = selectedProgramData?.schedule || [];

  if (submitStatus === 'success') {
    return (
      <div className={`bg-green-50 border border-green-200 rounded-lg p-8 text-center ${className}`}>
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-heading font-bold text-green-800 mb-2">
          Enrollment Submitted Successfully!
        </h3>
        <p className="text-green-700 mb-4">
          Thank you for your interest in our training programs. We'll contact you within 24 hours to confirm your enrollment and provide additional details.
        </p>
        <button
          onClick={() => setSubmitStatus('idle')}
          className="text-green-600 hover:text-green-800 font-semibold"
        >
          Submit Another Enrollment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      <div className="grid md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              errors.phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="+254 7XX XXX XXX"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>

        <div>
          <label htmlFor="experience" className="block text-sm font-semibold text-gray-700 mb-2">
            Experience Level *
          </label>
          <select
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              errors.experience ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select your experience level</option>
            <option value="complete-beginner">Complete Beginner</option>
            <option value="some-experience">Some Experience</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          {errors.experience && (
            <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
          )}
        </div>
      </div>

      {/* Program Selection */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="program" className="block text-sm font-semibold text-gray-700 mb-2">
            Training Program *
          </label>
          <select
            id="program"
            name="program"
            value={formData.program}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              errors.program ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select a training program</option>
            {trainingPrograms.map(program => (
              <option key={program.id} value={program.id}>
                {program.title} - {program.price} ({program.duration})
              </option>
            ))}
          </select>
          {errors.program && (
            <p className="mt-1 text-sm text-red-600">{errors.program}</p>
          )}
        </div>

        <div>
          <label htmlFor="session" className="block text-sm font-semibold text-gray-700 mb-2">
            Preferred Session *
          </label>
          <select
            id="session"
            name="session"
            value={formData.session}
            onChange={handleChange}
            disabled={!formData.program}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
              errors.session ? 'border-red-500' : 'border-gray-300'
            } ${!formData.program ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          >
            <option value="">Select a session</option>
            {availableSessions.map((session, index) => (
              <option key={index} value={`${session.startDate}-${session.endDate}`}>
                {new Date(session.startDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })} - {new Date(session.endDate).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })} ({session.slots} slots available)
              </option>
            ))}
          </select>
          {errors.session && (
            <p className="mt-1 text-sm text-red-600">{errors.session}</p>
          )}
        </div>
      </div>

      {/* Motivation */}
      <div>
        <label htmlFor="motivation" className="block text-sm font-semibold text-gray-700 mb-2">
          Why do you want to join this training program? *
        </label>
        <textarea
          id="motivation"
          name="motivation"
          value={formData.motivation}
          onChange={handleChange}
          rows={4}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-vertical ${
            errors.motivation ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Tell us about your goals, career aspirations, or how you plan to use your drone skills..."
        />
        {errors.motivation && (
          <p className="mt-1 text-sm text-red-600">{errors.motivation}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {formData.motivation.length}/50 characters minimum
        </p>
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        <div className="flex items-start">
          <input
            type="checkbox"
            id="accommodation"
            name="accommodation"
            checked={formData.accommodation}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="accommodation" className="ml-3 text-sm text-gray-700">
            I need assistance with accommodation arrangements
            <span className="block text-xs text-gray-500 mt-1">
              We can help arrange nearby hotels or homestay options
            </span>
          </label>
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            className="mt-1 w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label htmlFor="terms" className="ml-3 text-sm text-gray-700">
            I agree to the{' '}
            <a href="/terms" className="text-primary hover:underline" target="_blank">
              terms and conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-primary hover:underline" target="_blank">
              privacy policy
            </a>
            *
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-red-600">{errors.terms}</p>
        )}
      </div>

      {/* Program Details Display */}
      {selectedProgramData && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="font-semibold text-lg mb-3">Program Details</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Duration:</span> {selectedProgramData.duration}
            </div>
            <div>
              <span className="font-medium">Price:</span> {selectedProgramData.price}
            </div>
            <div>
              <span className="font-medium">Level:</span> {selectedProgramData.level}
            </div>

          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`flex-1 px-8 py-4 rounded-lg font-semibold transition-all duration-300 ${
            !isSubmitting
              ? 'bg-primary text-white hover:bg-red-700 hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Submitting Enrollment...
            </span>
          ) : (
            'Submit Enrollment'
          )}
        </button>
        
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:border-gray-400 transition-colors duration-300"
        >
          Back to Programs
        </button>
      </div>

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 text-sm">
              There was an error submitting your enrollment. Please try again or contact us directly.
            </p>
          </div>
        </div>
      )}
    </form>
  );
}