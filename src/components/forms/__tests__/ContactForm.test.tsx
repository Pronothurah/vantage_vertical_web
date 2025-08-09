import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

// Mock the form validation hook
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

// Mock the accessibility module
jest.mock('@/lib/accessibility', () => ({
  ariaAttributes: {
    form: jest.fn(() => ({})),
    textbox: jest.fn(() => ({})),
    button: jest.fn(() => ({})),
  },
  generateId: jest.fn(() => 'test-id'),
  announceToScreenReader: jest.fn(),
}));

// Mock the data module
jest.mock('@/data', () => ({
  serviceOptions: [
    { value: 'aerial-mapping', label: 'Aerial Mapping' },
    { value: 'surveillance', label: 'Surveillance' },
    { value: 'agritech', label: 'Agritech Solutions' },
  ],
  urgencyLevels: [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' },
  ],
}));

// Mock fetch
global.fetch = jest.fn();

describe('ContactForm', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  it('renders all form fields', () => {
    render(<ContactForm />);

    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/service needed/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/project details/i)).toBeInTheDocument();
    expect(screen.getByText(/project urgency/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });

  it('renders with full variant by default', () => {
    render(<ContactForm />);
    
    expect(screen.getByText('Get Started Today')).toBeInTheDocument();
    expect(screen.getByText(/ready to elevate your project/i)).toBeInTheDocument();
  });

  it('allows user to fill out form fields', async () => {
    render(<ContactForm />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const serviceSelect = screen.getByLabelText(/service needed/i);
    const messageTextarea = screen.getByLabelText(/project details/i);

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(phoneInput, '+1234567890');
    await user.selectOptions(serviceSelect, 'aerial-mapping');
    await user.type(messageTextarea, 'I need aerial mapping for my property');

    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(phoneInput).toHaveValue('+1234567890');
    expect(serviceSelect).toHaveValue('aerial-mapping');
    expect(messageTextarea).toHaveValue('I need aerial mapping for my property');
  });

  it('allows user to select urgency level', async () => {
    render(<ContactForm />);

    const highPriorityRadio = screen.getByRole('radio', { name: /high priority/i });
    await user.click(highPriorityRadio);

    expect(highPriorityRadio).toBeChecked();
  });

  it('shows character count for message field', async () => {
    render(<ContactForm />);

    const messageTextarea = screen.getByLabelText(/project details/i);
    await user.type(messageTextarea, 'Test message');

    expect(screen.getByText('12/1000')).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill out form
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await user.selectOptions(screen.getByLabelText(/service needed/i), 'aerial-mapping');
    await user.type(screen.getByLabelText(/project details/i), 'I need aerial mapping for my property');

    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      service: 'aerial-mapping',
      message: 'I need aerial mapping for my property',
      urgency: 'medium',
    });
  });

  it('uses default API endpoint when no onSubmit provided', async () => {
    render(<ContactForm />);

    // Fill out form
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await user.selectOptions(screen.getByLabelText(/service needed/i), 'aerial-mapping');
    await user.type(screen.getByLabelText(/project details/i), 'I need aerial mapping for my property');

    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+1234567890',
          service: 'aerial-mapping',
          message: 'I need aerial mapping for my property',
          urgency: 'medium',
        }),
      });
    });
  });

  it('displays loading state during submission', async () => {
    const mockOnSubmit = jest.fn(() => new Promise<void>(resolve => setTimeout(resolve, 1000)));
    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill out form
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/phone number/i), '+1234567890');
    await user.selectOptions(screen.getByLabelText(/service needed/i), 'aerial-mapping');
    await user.type(screen.getByLabelText(/project details/i), 'I need aerial mapping for my property');

    // Submit form
    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(screen.getByText(/sending message/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies custom className', () => {
    const { container } = render(<ContactForm className="custom-form-class" />);
    
    expect(container.querySelector('form')).toHaveClass('custom-form-class');
  });

  it('has proper accessibility attributes', () => {
    render(<ContactForm />);

    const form = screen.getByRole('form');
    expect(form).toHaveAttribute('novalidate');

    // Check that all required fields have proper labels
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute('required');
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/phone number/i)).toHaveAttribute('type', 'tel');
  });

  it('shows privacy notice', () => {
    render(<ContactForm />);
    
    expect(screen.getByText(/by submitting this form/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy policy/i)).toBeInTheDocument();
    expect(screen.getByText(/we'll respond within 24 hours/i)).toBeInTheDocument();
  });
});