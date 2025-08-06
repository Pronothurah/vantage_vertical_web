import { cn } from '../utils';

describe('utils', () => {
  describe('cn function', () => {
    it('merges class names correctly', () => {
      const result = cn('px-4', 'py-2', 'bg-blue-500');
      expect(result).toBe('px-4 py-2 bg-blue-500');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class active-class');
    });

    it('handles false conditional classes', () => {
      const isActive = false;
      const result = cn('base-class', isActive && 'active-class');
      expect(result).toBe('base-class');
    });

    it('merges conflicting Tailwind classes correctly', () => {
      const result = cn('px-4', 'px-6');
      expect(result).toBe('px-6');
    });

    it('handles arrays of classes', () => {
      const result = cn(['px-4', 'py-2'], 'bg-blue-500');
      expect(result).toBe('px-4 py-2 bg-blue-500');
    });

    it('handles objects with conditional classes', () => {
      const result = cn({
        'px-4': true,
        'py-2': true,
        'bg-blue-500': false,
        'bg-red-500': true,
      });
      expect(result).toBe('px-4 py-2 bg-red-500');
    });

    it('handles undefined and null values', () => {
      const result = cn('px-4', undefined, null, 'py-2');
      expect(result).toBe('px-4 py-2');
    });

    it('handles empty strings', () => {
      const result = cn('px-4', '', 'py-2');
      expect(result).toBe('px-4 py-2');
    });

    it('handles complex combinations', () => {
      const isActive = true;
      const variant = 'primary';
      const result = cn(
        'base-class',
        {
          'active-class': isActive,
          'inactive-class': !isActive,
        },
        variant === 'primary' && 'primary-class',
        ['additional', 'classes']
      );
      expect(result).toBe('base-class active-class primary-class additional classes');
    });

    it('returns empty string for no arguments', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('handles whitespace correctly', () => {
      const result = cn('  px-4  ', '  py-2  ');
      expect(result).toBe('px-4 py-2');
    });
  });
});