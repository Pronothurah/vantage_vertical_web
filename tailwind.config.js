/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Vantage Vertical Brand Colors
        primary: '#D72638',      // Vantage Red - CTAs, highlights
        secondary: '#000000',    // Black - text, headers
        background: '#FFFFFF',   // White - main background
        gray: {
          50: '#F8F9FA',
          100: '#E9ECEF',
          200: '#DEE2E6',
          300: '#CED4DA',
          400: '#ADB5BD',
          500: '#6C757D',
          600: '#495057',
          700: '#343A40',        // Steel Gray - secondary text
          800: '#212529',        // Charcoal - dark backgrounds, footers
          900: '#000000',
        },
        accent: '#DCCA87',       // Golden - special highlights
        charcoal: '#212529',     // Dark backgrounds, footers
        deepBlue: '#1E3A8A',     // Deep Blue - navbar hover effects
        
        // Semantic colors
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545',
        info: '#17A2B8',
      },
      fontFamily: {
        heading: ['var(--font-urbanist)', 'Urbanist', 'sans-serif'],  // Modern, versatile headings
        body: ['var(--font-urbanist)', 'Urbanist', 'sans-serif'],     // Clean, readable body text
        sans: ['var(--font-urbanist)', 'Urbanist', 'sans-serif'],     // Default sans-serif
      },
      fontSize: {
        'xs': ['12px', { lineHeight: '16px' }],    // Small labels, captions
        'sm': ['14px', { lineHeight: '20px' }],    // Body text, descriptions
        'base': ['16px', { lineHeight: '24px' }],  // Default body text
        'lg': ['18px', { lineHeight: '28px' }],    // Large body text, subheadings
        'xl': ['20px', { lineHeight: '28px' }],    // Section subheadings
        '2xl': ['24px', { lineHeight: '32px' }],   // Page subheadings
        '3xl': ['30px', { lineHeight: '36px' }],   // Section headings
        '4xl': ['36px', { lineHeight: '40px' }],   // Page headings
        '5xl': ['48px', { lineHeight: '1' }],      // Hero headings
        '6xl': ['60px', { lineHeight: '1' }],      // Large hero text
        '7xl': ['72px', { lineHeight: '1' }],      // Extra large hero text
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medium': '0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'large': '0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};