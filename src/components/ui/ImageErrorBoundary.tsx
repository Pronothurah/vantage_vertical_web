'use client';

import React, { Component, ReactNode } from 'react';

interface ImageErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ImageErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * ImageErrorBoundary Component
 * 
 * A React error boundary specifically designed for handling image loading failures
 * and other image-related errors gracefully. Provides fallback UI and error reporting.
 */
export default class ImageErrorBoundary extends Component<
  ImageErrorBoundaryProps,
  ImageErrorBoundaryState
> {
  constructor(props: ImageErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ImageErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error for monitoring/analytics
    console.error('ImageErrorBoundary caught an error:', error, errorInfo);
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo);
    
    // In production, you might want to send this to an error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Send to error reporting service
      // errorReportingService.captureException(error, { extra: errorInfo });
    }
  }

  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI for image errors
      return (
        <div 
          className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200"
          role="img"
          aria-label="Image failed to load"
        >
          <div className="w-16 h-16 mb-4 text-gray-400" aria-hidden="true">
            <svg 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
              className="w-full h-full"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Image Loading Error
          </h3>
          <p className="text-sm text-gray-600 text-center max-w-sm leading-relaxed">
            We encountered an issue loading this image. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors duration-200 focus:ring-2 focus:ring-primary focus:ring-offset-2"
            aria-label="Refresh page to retry loading image"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}