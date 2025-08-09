import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccessibleButton from '../AccessibleButton';

// Mock the accessibility module
jest.mock('@/lib/accessibility', () => ({
  keyboardHandlers: {
    button: jest.fn(),
  },
  ariaAttributes: {
    button: jest.fn(() => ({})),
  },
}));

describe('AccessibleButton', () => {
  const user = userEvent.setup();

  it('renders with default props', () => {
    render(<AccessibleButton>Click me</AccessibleButton>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary', 'text-white', 'px-4', 'py-2');
  });

  it('applies correct variant classes', () => {
    const { rerender } = render(
      <AccessibleButton variant="secondary">Secondary</AccessibleButton>
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-gray-600', 'text-white');

    rerender(<AccessibleButton variant="outline">Outline</AccessibleButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('border-2', 'border-primary', 'text-primary');

    rerender(<AccessibleButton variant="ghost">Ghost</AccessibleButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('text-primary');

    rerender(<AccessibleButton variant="danger">Danger</AccessibleButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-red-600', 'text-white');
  });

  it('applies correct size classes', () => {
    const { rerender } = render(
      <AccessibleButton size="sm">Small</AccessibleButton>
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('px-3', 'py-2', 'text-sm');

    rerender(<AccessibleButton size="lg">Large</AccessibleButton>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-6', 'py-3', 'text-lg');
  });

  it('handles click events', async () => {
    const handleClick = jest.fn();
    render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles keyboard events', async () => {
    const handleClick = jest.fn();
    render(<AccessibleButton onClick={handleClick}>Click me</AccessibleButton>);
    
    const button = screen.getByRole('button');
    button.focus();
    
    // Test Enter key
    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
    
    // Test Space key
    await user.keyboard(' ');
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('shows loading state correctly', () => {
    render(<AccessibleButton loading>Loading</AccessibleButton>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveClass('cursor-wait');
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Check for loading spinner SVG
    const spinner = button.querySelector('svg');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
  });

  it('prevents clicks when loading', async () => {
    const handleClick = jest.fn();
    render(
      <AccessibleButton loading onClick={handleClick}>
        Loading
      </AccessibleButton>
    );
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('prevents clicks when disabled', async () => {
    const handleClick = jest.fn();
    render(
      <AccessibleButton disabled onClick={handleClick}>
        Disabled
      </AccessibleButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(
      <AccessibleButton className="custom-class">
        Custom
      </AccessibleButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = jest.fn();
    render(<AccessibleButton ref={ref}>Ref test</AccessibleButton>);
    
    expect(ref).toHaveBeenCalledWith(expect.any(HTMLButtonElement));
  });

  it('sets aria attributes correctly', () => {
    render(
      <AccessibleButton 
        pressed={true} 
        expanded={true} 
        describedBy="description"
      >
        ARIA test
      </AccessibleButton>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-describedby', 'description');
  });

  it('handles custom onKeyDown handler', async () => {
    const handleKeyDown = jest.fn();
    const handleClick = jest.fn();
    
    render(
      <AccessibleButton onKeyDown={handleKeyDown} onClick={handleClick}>
        Key test
      </AccessibleButton>
    );
    
    const button = screen.getByRole('button');
    button.focus();
    
    await user.keyboard('{Enter}');
    
    expect(handleKeyDown).toHaveBeenCalled();
    expect(handleClick).toHaveBeenCalled();
  });
});