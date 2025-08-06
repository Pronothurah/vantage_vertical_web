import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '@/components/forms/ContactForm';
import DroneInquiryForm from '@/components/forms/DroneInquiryForm';
import EnrollmentForm from '@/components/forms/EnrollmentForm';
import NewsletterForm from '@/components/forms/NewsletterForm';

// Mock form validation hook
jest.mock('@/lib/useFormValidation', () => ({
  useFormValidation: () => ({
    formState: {
      errors: {},
      isSubmitting: false,
      submitError: null,
      submitSuccess: false,
    },
    validateField: jest.fn(() => null),
    validateForm: jest.fn(() => ({})),
    setFieldError: jest.fn(),
    clearFieldError: jest.fn(),
    setSubmitting: jest.fn(),
    setSubmitError: jest.fn(),
    setSubmitSuccess: jest.fn(),
    resetForm: jest.fn(),
  }),
}));

// Mock data
jest.mock('@/data', () => ({
  serviceOptions: [
    { value: 'aerial-mapping', label: 'Aerial Mapping' },
    { value: 'surveillance', label: 'Surveillance' },
    { value: 'agritech', label: 'Agritech Solutions' },
    { value: 'commercial', label: 'Commercial Services' },
    { value: 'training', label: 'Training Programs' }
  ],
  urgencyLevels: [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-800' }
  ],
  droneProducts: [
    {
      id: 'dji-mavic-3',
      name: 'DJI Mavic 3',
      brand: 'DJI',
      price: 250000,
      category: 'commercial'
    },
    {
      id: 'dji-agras-t40',
      name: 'DJI Agras T40',
      brand: 'DJI',
      price: 1500000,
      category: 'agricultural'
    }
  ],
  trainingPrograms: [
    {
      id: 'basic-pilot',
      name: 'Basic Pilot Certification',
      duration: '5 days',
      price: 75000
    },
    {
      id: 'commercial-operations',
      name: 'Commercial Operations',
      duration: '3 days',
      price: 50000
    }
  ]
}));

// Mock accessibility module
jest.mock('@/lib/accessibility', () => ({
  ariaAttributes: {
    form: jest.fn(() => ({})),
    textbox: jest.fn(() => ({})),
    button: jest.fn(() => ({})),
  },
  generateId: jest.fn(() => 'test-id'),
  announceToScreenReader: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

describe('Forms Integration Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, message: 'Form submitted successfully' }),
    });
  });

  describe('ContactForm Integration', () => {
    it('completes full contact form submission flow', async () => {
      render(<ContactForm />);

      // Fill out all required fields
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '+254700123456');
      await user.selectOptions(screen.getByLabelText(/service needed/i), 'aerial-mapping');
      await user.type(screen.getByLabelText(/project details/i), 'I need aerial mapping for my 100-acre farm to assess crop health and plan irrigation systems.');

      // Select urgency level
      await user.click(screen.getByRole('radio', { name: /high priority/i }));

      // Submit form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Verify API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+254700123456',
            service: 'aerial-mapping',
            message: 'I need aerial mapping for my 100-acre farm to assess crop health and plan irrigation systems.',
            urgency: 'high',
          }),
        });
      });
    });

    it('handles form validation errors gracefully', async () => {
      // Mock validation errors
      const mockUseFormValidation = require('@/lib/useFormValidation').useFormValidation;
      mockUseFormValidation.mockReturnValue({
        formState: {
          errors: {
            email: 'Please enter a valid email address',
            phone: 'Please enter a valid phone number'
          },
          isSubmitting: false,
          submitError: null,
          submitSuccess: false,
        },
        validateField: jest.fn(() => 'Validation error'),
        validateForm: jest.fn(() => ({ email: 'Invalid email' })),
        setFieldError: jest.fn(),
        clearFieldError: jest.fn(),
        setSubmitting: jest.fn(),
        setSubmitError: jest.fn(),
        setSubmitSuccess: jest.fn(),
        resetForm: jest.fn(),
      });

      render(<ContactForm />);

      // Try to submit with invalid data
      await user.type(screen.getByLabelText(/email address/i), 'invalid-email');
      await user.type(screen.getByLabelText(/phone number/i), 'invalid-phone');
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Check that error messages are displayed
      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid phone number')).toBeInTheDocument();
    });

    it('handles API errors appropriately', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<ContactForm />);

      // Fill out form
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone number/i), '+254700123456');
      await user.selectOptions(screen.getByLabelText(/service needed/i), 'aerial-mapping');
      await user.type(screen.getByLabelText(/project details/i), 'Test message');

      // Submit form
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Should handle error gracefully
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });
    });

    it('provides real-time character count for message field', async () => {
      render(<ContactForm />);

      const messageField = screen.getByLabelText(/project details/i);
      const testMessage = 'This is a test message for character counting.';

      await user.type(messageField, testMessage);

      expect(screen.getByText(`${testMessage.length}/1000`)).toBeInTheDocument();
    });

    it('supports different form variants', () => {
      const { rerender } = render(<ContactForm variant="inline" />);

      // Inline variant should have different styling/layout
      expect(screen.getByRole('form')).toBeInTheDocument();

      rerender(<ContactForm variant="modal" />);
      expect(screen.getByRole('form')).toBeInTheDocument();

      rerender(<ContactForm variant="full" />);
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByText('Get Started Today')).toBeInTheDocument();
    });
  });

  describe('DroneInquiryForm Integration', () => {
    it('completes drone purchase inquiry flow', async () => {
      render(<DroneInquiryForm />);

      // Fill out inquiry form
      await user.type(screen.getByLabelText(/full name/i), 'Jane Smith');
      await user.type(screen.getByLabelText(/email/i), 'jane@example.com');
      await user.type(screen.getByLabelText(/phone/i), '+254700123457');
      await user.selectOptions(screen.getByLabelText(/drone model/i), 'dji-mavic-3');
      await user.type(screen.getByLabelText(/intended use/i), 'Commercial photography and videography');

      // Select quantity
      const quantityField = screen.getByLabelText(/quantity/i);
      await user.clear(quantityField);
      await user.type(quantityField, '2');

      // Submit form
      await user.click(screen.getByRole('button', { name: /request quote/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/drone-inquiry', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Jane Smith',
            email: 'jane@example.com',
            phone: '+254700123457',
            droneModel: 'dji-mavic-3',
            quantity: 2,
            intendedUse: 'Commercial photography and videography',
          }),
        });
      });
    });

    it('calculates total price based on quantity', async () => {
      render(<DroneInquiryForm />);

      await user.selectOptions(screen.getByLabelText(/drone model/i), 'dji-mavic-3');
      
      const quantityField = screen.getByLabelText(/quantity/i);
      await user.clear(quantityField);
      await user.type(quantityField, '3');

      // Should show calculated total (250,000 * 3 = 750,000)
      expect(screen.getByText(/750,000|KES 750,000/)).toBeInTheDocument();
    });

    it('shows drone specifications when model is selected', async () => {
      render(<DroneInquiryForm />);

      await user.selectOptions(screen.getByLabelText(/drone model/i), 'dji-agras-t40');

      // Should show agricultural drone specifications
      expect(screen.getByText(/agricultural|spraying|farming/i)).toBeInTheDocument();
    });
  });

  describe('EnrollmentForm Integration', () => {
    it('completes training enrollment flow', async () => {
      render(<EnrollmentForm />);

      // Fill out enrollment form
      await user.type(screen.getByLabelText(/full name/i), 'Mike Johnson');
      await user.type(screen.getByLabelText(/email/i), 'mike@example.com');
      await user.type(screen.getByLabelText(/phone/i), '+254700123458');
      await user.selectOptions(screen.getByLabelText(/training program/i), 'basic-pilot');

      // Select preferred dates
      const startDateField = screen.getByLabelText(/preferred start date/i);
      await user.type(startDateField, '2024-03-15');

      // Add experience level
      await user.selectOptions(screen.getByLabelText(/experience level/i), 'beginner');

      // Submit form
      await user.click(screen.getByRole('button', { name: /enroll now/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/enrollment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'Mike Johnson',
            email: 'mike@example.com',
            phone: '+254700123458',
            program: 'basic-pilot',
            preferredStartDate: '2024-03-15',
            experienceLevel: 'beginner',
          }),
        });
      });
    });

    it('shows program details when selected', async () => {
      render(<EnrollmentForm />);

      await user.selectOptions(screen.getByLabelText(/training program/i), 'basic-pilot');

      // Should show program details
      expect(screen.getByText(/5 days/)).toBeInTheDocument();
      expect(screen.getByText(/75,000|KES 75,000/)).toBeInTheDocument();
    });

    it('validates date selection', async () => {
      render(<EnrollmentForm />);

      const startDateField = screen.getByLabelText(/preferred start date/i);
      
      // Try to select a past date
      const pastDate = '2020-01-01';
      await user.type(startDateField, pastDate);

      // Should show validation error
      await user.click(screen.getByRole('button', { name: /enroll now/i }));
      
      // Validation should prevent submission or show error
      expect(screen.getByText(/date.*future|please select.*future date/i)).toBeInTheDocument();
    });
  });

  describe('NewsletterForm Integration', () => {
    it('completes newsletter subscription flow', async () => {
      render(<NewsletterForm />);

      await user.type(screen.getByLabelText(/email/i), 'subscriber@example.com');
      
      // Select interests
      await user.click(screen.getByLabelText(/drone technology/i));
      await user.click(screen.getByLabelText(/industry insights/i));

      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/newsletter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'subscriber@example.com',
            interests: ['drone-technology', 'industry-insights'],
          }),
        });
      });
    });

    it('prevents duplicate subscriptions', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ error: 'Email already subscribed' }),
      });

      render(<NewsletterForm />);

      await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByText(/already subscribed|email.*exists/i)).toBeInTheDocument();
      });
    });

    it('shows subscription confirmation', async () => {
      render(<NewsletterForm />);

      await user.type(screen.getByLabelText(/email/i), 'new@example.com');
      await user.click(screen.getByRole('button', { name: /subscribe/i }));

      await waitFor(() => {
        expect(screen.getByText(/thank you|subscribed|confirmation/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Accessibility Integration', () => {
    it('provides proper form labeling', () => {
      render(<ContactForm />);

      const formElements = screen.getAllByRole('textbox');
      formElements.forEach(element => {
        expect(element).toHaveAccessibleName();
      });

      const selectElements = screen.getAllByRole('combobox');
      selectElements.forEach(element => {
        expect(element).toHaveAccessibleName();
      });

      const radioElements = screen.getAllByRole('radio');
      radioElements.forEach(element => {
        expect(element).toHaveAccessibleName();
      });
    });

    it('supports keyboard navigation', async () => {
      render(<ContactForm />);

      const nameField = screen.getByLabelText(/full name/i);
      nameField.focus();

      // Tab through form fields
      await user.keyboard('{Tab}');
      expect(screen.getByLabelText(/email/i)).toHaveFocus();

      await user.keyboard('{Tab}');
      expect(screen.getByLabelText(/phone/i)).toHaveFocus();

      await user.keyboard('{Tab}');
      expect(screen.getByLabelText(/service/i)).toHaveFocus();
    });

    it('provides error announcements for screen readers', async () => {
      const mockAnnounce = require('@/lib/accessibility').announceToScreenReader;

      render(<ContactForm />);

      // Submit form with missing required fields
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Should announce errors to screen readers
      expect(mockAnnounce).toHaveBeenCalled();
    });

    it('has proper ARIA attributes for form validation', () => {
      render(<ContactForm />);

      const emailField = screen.getByLabelText(/email/i);
      expect(emailField).toHaveAttribute('aria-describedby');
      expect(emailField).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('Form Performance Integration', () => {
    it('handles rapid user input efficiently', async () => {
      render(<ContactForm />);

      const messageField = screen.getByLabelText(/project details/i);
      
      // Type rapidly
      const longMessage = 'A'.repeat(500);
      await user.type(messageField, longMessage);

      // Character count should update correctly
      expect(screen.getByText(`${longMessage.length}/1000`)).toBeInTheDocument();
    });

    it('prevents multiple form submissions', async () => {
      render(<ContactForm />);

      // Fill out form
      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/phone/i), '+254700123456');
      await user.selectOptions(screen.getByLabelText(/service/i), 'aerial-mapping');
      await user.type(screen.getByLabelText(/project details/i), 'Test message');

      const submitButton = screen.getByRole('button', { name: /send message/i });

      // Click submit multiple times rapidly
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      // Should only make one API call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });
    });

    it('maintains form state during validation', async () => {
      render(<ContactForm />);

      const nameField = screen.getByLabelText(/full name/i);
      const testName = 'John Doe';

      await user.type(nameField, testName);

      // Trigger validation
      await user.click(screen.getByRole('button', { name: /send message/i }));

      // Field value should be preserved
      expect(nameField).toHaveValue(testName);
    });
  });

  describe('Cross-Form Integration', () => {
    it('maintains consistent styling across all forms', () => {
      const { container: contactContainer } = render(<ContactForm />);
      const { container: droneContainer } = render(<DroneInquiryForm />);
      const { container: enrollmentContainer } = render(<EnrollmentForm />);
      const { container: newsletterContainer } = render(<NewsletterForm />);

      // All forms should have consistent button styling
      const contactButton = contactContainer.querySelector('button[type="submit"]');
      const droneButton = droneContainer.querySelector('button[type="submit"]');
      const enrollmentButton = enrollmentContainer.querySelector('button[type="submit"]');
      const newsletterButton = newsletterContainer.querySelector('button[type="submit"]');

      [contactButton, droneButton, enrollmentButton, newsletterButton].forEach(button => {
        expect(button).toHaveClass(/btn-primary|bg-primary/);
      });
    });

    it('uses consistent validation patterns', () => {
      render(<ContactForm />);
      render(<DroneInquiryForm />);
      render(<EnrollmentForm />);

      // All forms should have email fields with same validation
      const emailFields = screen.getAllByLabelText(/email/i);
      emailFields.forEach(field => {
        expect(field).toHaveAttribute('type', 'email');
        expect(field).toHaveAttribute('required');
      });
    });
  });
});