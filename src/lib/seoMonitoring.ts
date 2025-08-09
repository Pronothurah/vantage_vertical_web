/**
 * SEO and Performance Monitoring for Vantage Vertical website
 * Tracks Core Web Vitals, user experience metrics, and SEO performance
 */

// Core Web Vitals tracking
interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

// Performance thresholds based on Google's recommendations
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
};

// Get performance rating
function getPerformanceRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const thresholds = PERFORMANCE_THRESHOLDS[metric as keyof typeof PERFORMANCE_THRESHOLDS];
  if (!thresholds) return 'good';
  
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

// Track Core Web Vitals
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  // Dynamic import of web-vitals library
  import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
    // Largest Contentful Paint
    onLCP((metric) => {
      const webVitalsMetric: WebVitalsMetric = {
        name: 'LCP',
        value: metric.value,
        rating: getPerformanceRating('LCP', metric.value),
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      };
      
      reportWebVital(webVitalsMetric);
    });

    // Interaction to Next Paint (replaces FID)
    onINP((metric) => {
      const webVitalsMetric: WebVitalsMetric = {
        name: 'INP',
        value: metric.value,
        rating: getPerformanceRating('FID', metric.value), // Use FID thresholds for now
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      };
      
      reportWebVital(webVitalsMetric);
    });

    // Cumulative Layout Shift
    onCLS((metric) => {
      const webVitalsMetric: WebVitalsMetric = {
        name: 'CLS',
        value: metric.value,
        rating: getPerformanceRating('CLS', metric.value),
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      };
      
      reportWebVital(webVitalsMetric);
    });

    // First Contentful Paint
    onFCP((metric) => {
      const webVitalsMetric: WebVitalsMetric = {
        name: 'FCP',
        value: metric.value,
        rating: getPerformanceRating('FCP', metric.value),
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      };
      
      reportWebVital(webVitalsMetric);
    });

    // Time to First Byte
    onTTFB((metric) => {
      const webVitalsMetric: WebVitalsMetric = {
        name: 'TTFB',
        value: metric.value,
        rating: getPerformanceRating('TTFB', metric.value),
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
      };
      
      reportWebVital(webVitalsMetric);
    });
  }).catch((error) => {
    console.warn('Failed to load web-vitals library:', error);
  });
}

// Report Web Vital to analytics
function reportWebVital(metric: WebVitalsMetric) {
  // Send to Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
      custom_map: {
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        navigation_type: metric.navigationType,
      },
    });
  }

  // Send to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}:`, {
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
    });
  }

  // Send to external monitoring service (if configured)
  if (process.env.NEXT_PUBLIC_PERFORMANCE_ENDPOINT) {
    fetch(process.env.NEXT_PUBLIC_PERFORMANCE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        metric: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      }),
    }).catch((error) => {
      console.warn('Failed to send performance data:', error);
    });
  }
}

// Performance budget monitoring
interface PerformanceBudget {
  metric: string;
  budget: number;
  current: number;
  status: 'within-budget' | 'over-budget' | 'critical';
}

export function checkPerformanceBudgets(): PerformanceBudget[] {
  if (typeof window === 'undefined') return [];

  const budgets: PerformanceBudget[] = [];
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;

  if (navigation) {
    // Time to First Byte budget
    const ttfb = navigation.responseStart - navigation.requestStart;
    budgets.push({
      metric: 'TTFB',
      budget: 800, // 800ms budget
      current: ttfb,
      status: ttfb <= 800 ? 'within-budget' : ttfb <= 1200 ? 'over-budget' : 'critical',
    });

    // DOM Content Loaded budget
    const dcl = navigation.domContentLoadedEventEnd - navigation.fetchStart;
    budgets.push({
      metric: 'DCL',
      budget: 2000, // 2s budget
      current: dcl,
      status: dcl <= 2000 ? 'within-budget' : dcl <= 3000 ? 'over-budget' : 'critical',
    });

    // Load Complete budget
    const loadComplete = navigation.loadEventEnd - navigation.fetchStart;
    budgets.push({
      metric: 'Load',
      budget: 3000, // 3s budget
      current: loadComplete,
      status: loadComplete <= 3000 ? 'within-budget' : loadComplete <= 5000 ? 'over-budget' : 'critical',
    });
  }

  // Resource size budgets
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  let totalSize = 0;
  let jsSize = 0;
  let cssSize = 0;
  let imageSize = 0;

  resources.forEach((resource) => {
    const size = resource.transferSize || 0;
    totalSize += size;

    if (resource.name.includes('.js')) {
      jsSize += size;
    } else if (resource.name.includes('.css')) {
      cssSize += size;
    } else if (resource.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
      imageSize += size;
    }
  });

  // Total page size budget (2MB)
  budgets.push({
    metric: 'Total Size',
    budget: 2 * 1024 * 1024, // 2MB
    current: totalSize,
    status: totalSize <= 2 * 1024 * 1024 ? 'within-budget' : totalSize <= 3 * 1024 * 1024 ? 'over-budget' : 'critical',
  });

  // JavaScript size budget (500KB)
  budgets.push({
    metric: 'JS Size',
    budget: 500 * 1024, // 500KB
    current: jsSize,
    status: jsSize <= 500 * 1024 ? 'within-budget' : jsSize <= 750 * 1024 ? 'over-budget' : 'critical',
  });

  // CSS size budget (100KB)
  budgets.push({
    metric: 'CSS Size',
    budget: 100 * 1024, // 100KB
    current: cssSize,
    status: cssSize <= 100 * 1024 ? 'within-budget' : cssSize <= 150 * 1024 ? 'over-budget' : 'critical',
  });

  // Image size budget (1MB)
  budgets.push({
    metric: 'Image Size',
    budget: 1024 * 1024, // 1MB
    current: imageSize,
    status: imageSize <= 1024 * 1024 ? 'within-budget' : imageSize <= 1.5 * 1024 * 1024 ? 'over-budget' : 'critical',
  });

  return budgets;
}

// SEO monitoring
export function trackSEOMetrics() {
  if (typeof window === 'undefined') return;

  const seoMetrics = {
    // Page title length
    titleLength: document.title.length,
    titleOptimal: document.title.length >= 30 && document.title.length <= 60,

    // Meta description
    metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') || '',
    metaDescriptionLength: document.querySelector('meta[name="description"]')?.getAttribute('content')?.length || 0,
    metaDescriptionOptimal: (() => {
      const length = document.querySelector('meta[name="description"]')?.getAttribute('content')?.length || 0;
      return length >= 120 && length <= 160;
    })(),

    // Heading structure
    h1Count: document.querySelectorAll('h1').length,
    h1Optimal: document.querySelectorAll('h1').length === 1,

    // Images without alt text
    imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
    imagesTotal: document.querySelectorAll('img').length,

    // Internal links
    internalLinks: document.querySelectorAll('a[href^="/"], a[href^="#"]').length,
    externalLinks: document.querySelectorAll('a[href^="http"]:not([href*="vantagevertical.co.ke"])').length,

    // Page load time
    loadTime: performance.timing ? performance.timing.loadEventEnd - performance.timing.navigationStart : 0,

    // Viewport meta tag
    hasViewportMeta: !!document.querySelector('meta[name="viewport"]'),

    // Structured data
    hasStructuredData: !!document.querySelector('script[type="application/ld+json"]'),
  };

  // Send SEO metrics to analytics
  if (window.gtag) {
    window.gtag('event', 'seo_audit', {
      event_category: 'SEO',
      custom_map: seoMetrics,
    });
  }

  // Log SEO issues in development
  if (process.env.NODE_ENV === 'development') {
    const issues = [];
    
    if (!seoMetrics.titleOptimal) {
      issues.push(`Title length (${seoMetrics.titleLength}) should be 30-60 characters`);
    }
    
    if (!seoMetrics.metaDescriptionOptimal) {
      issues.push(`Meta description length (${seoMetrics.metaDescriptionLength}) should be 120-160 characters`);
    }
    
    if (!seoMetrics.h1Optimal) {
      issues.push(`Page should have exactly 1 H1 tag (found ${seoMetrics.h1Count})`);
    }
    
    if (seoMetrics.imagesWithoutAlt > 0) {
      issues.push(`${seoMetrics.imagesWithoutAlt} images missing alt text`);
    }
    
    if (!seoMetrics.hasViewportMeta) {
      issues.push('Missing viewport meta tag');
    }
    
    if (!seoMetrics.hasStructuredData) {
      issues.push('Missing structured data');
    }

    if (issues.length > 0) {
      console.warn('[SEO Issues]:', issues);
    } else {
      console.log('[SEO] All checks passed ✓');
    }
  }

  return seoMetrics;
}

// Error tracking
export function trackError(error: Error, context?: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      custom_map: {
        error_context: context,
        error_stack: error.stack,
        user_agent: navigator.userAgent,
        url: window.location.href,
      },
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('[Error Tracking]', { error, context });
  }
}

// User engagement tracking
export function trackUserEngagement() {
  if (typeof window === 'undefined') return;

  let startTime = Date.now();
  let isActive = true;
  let scrollDepth = 0;
  let maxScrollDepth = 0;

  // Track scroll depth
  const trackScroll = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    scrollDepth = Math.round((scrollTop / docHeight) * 100);
    maxScrollDepth = Math.max(maxScrollDepth, scrollDepth);
  };

  // Track user activity
  const trackActivity = () => {
    isActive = true;
  };

  // Track inactivity
  const trackInactivity = () => {
    isActive = false;
  };

  // Event listeners
  window.addEventListener('scroll', trackScroll, { passive: true });
  window.addEventListener('mousemove', trackActivity, { passive: true });
  window.addEventListener('keydown', trackActivity, { passive: true });
  window.addEventListener('click', trackActivity, { passive: true });
  window.addEventListener('blur', trackInactivity);
  window.addEventListener('focus', trackActivity);

  // Send engagement data before page unload
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Date.now() - startTime;
    
    if (window.gtag) {
      window.gtag('event', 'user_engagement', {
        event_category: 'Engagement',
        custom_map: {
          time_on_page: timeOnPage,
          max_scroll_depth: maxScrollDepth,
          was_active: isActive,
          page_url: window.location.href,
        },
      });
    }
  });
}

// Initialize all monitoring
export function initializeMonitoring() {
  if (typeof window === 'undefined') return;

  // Wait for page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      trackWebVitals();
      trackSEOMetrics();
      trackUserEngagement();
    });
  } else {
    trackWebVitals();
    trackSEOMetrics();
    trackUserEngagement();
  }

  // Track performance budgets after load
  window.addEventListener('load', () => {
    setTimeout(() => {
      const budgets = checkPerformanceBudgets();
      const overBudget = budgets.filter(b => b.status !== 'within-budget');
      
      if (overBudget.length > 0 && window.gtag) {
        window.gtag('event', 'performance_budget_exceeded', {
          event_category: 'Performance',
          custom_map: {
            over_budget_metrics: overBudget.map(b => b.metric).join(','),
            critical_metrics: overBudget.filter(b => b.status === 'critical').map(b => b.metric).join(','),
          },
        });
      }
    }, 1000);
  });

  // Global error handling
  window.addEventListener('error', (event) => {
    trackError(new Error(event.message), 'global_error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error(event.reason), 'unhandled_promise_rejection');
  });
}