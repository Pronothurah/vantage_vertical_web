/**
 * Performance budgets and monitoring configuration for Vantage Vertical
 * Defines acceptable performance thresholds and monitoring rules
 */

export interface PerformanceBudgetConfig {
  // Core Web Vitals budgets
  webVitals: {
    LCP: { good: number; poor: number }; // Largest Contentful Paint (ms)
    FID: { good: number; poor: number }; // First Input Delay (ms)
    CLS: { good: number; poor: number }; // Cumulative Layout Shift (score)
    FCP: { good: number; poor: number }; // First Contentful Paint (ms)
    TTFB: { good: number; poor: number }; // Time to First Byte (ms)
  };
  
  // Resource size budgets
  resources: {
    totalSize: number; // Total page size (bytes)
    jsSize: number; // JavaScript bundle size (bytes)
    cssSize: number; // CSS bundle size (bytes)
    imageSize: number; // Total image size (bytes)
    fontSize: number; // Font files size (bytes)
  };
  
  // Network timing budgets
  timing: {
    domContentLoaded: number; // DOM ready time (ms)
    loadComplete: number; // Full page load time (ms)
    firstPaint: number; // First paint time (ms)
  };
  
  // User experience budgets
  userExperience: {
    longTaskThreshold: number; // Long task threshold (ms)
    memoryUsageThreshold: number; // Memory usage threshold (percentage)
    scrollDepthGoal: number; // Target scroll depth (percentage)
    timeOnPageGoal: number; // Target time on page (ms)
  };
}

// Production performance budgets
export const PERFORMANCE_BUDGETS: PerformanceBudgetConfig = {
  webVitals: {
    LCP: { good: 2500, poor: 4000 }, // Google's thresholds
    FID: { good: 100, poor: 300 },
    CLS: { good: 0.1, poor: 0.25 },
    FCP: { good: 1800, poor: 3000 },
    TTFB: { good: 800, poor: 1800 },
  },
  
  resources: {
    totalSize: 2 * 1024 * 1024, // 2MB total page size
    jsSize: 500 * 1024, // 500KB JavaScript
    cssSize: 100 * 1024, // 100KB CSS
    imageSize: 1024 * 1024, // 1MB images
    fontSize: 200 * 1024, // 200KB fonts
  },
  
  timing: {
    domContentLoaded: 2000, // 2 seconds
    loadComplete: 3000, // 3 seconds
    firstPaint: 1500, // 1.5 seconds
  },
  
  userExperience: {
    longTaskThreshold: 50, // 50ms (blocks main thread)
    memoryUsageThreshold: 80, // 80% of available memory
    scrollDepthGoal: 50, // 50% scroll depth indicates engagement
    timeOnPageGoal: 30000, // 30 seconds minimum engagement
  },
};

// Development performance budgets (more lenient)
export const DEV_PERFORMANCE_BUDGETS: PerformanceBudgetConfig = {
  webVitals: {
    LCP: { good: 3000, poor: 5000 },
    FID: { good: 150, poor: 400 },
    CLS: { good: 0.15, poor: 0.3 },
    FCP: { good: 2200, poor: 3500 },
    TTFB: { good: 1200, poor: 2500 },
  },
  
  resources: {
    totalSize: 3 * 1024 * 1024, // 3MB total
    jsSize: 750 * 1024, // 750KB JavaScript
    cssSize: 150 * 1024, // 150KB CSS
    imageSize: 1.5 * 1024 * 1024, // 1.5MB images
    fontSize: 300 * 1024, // 300KB fonts
  },
  
  timing: {
    domContentLoaded: 3000, // 3 seconds
    loadComplete: 5000, // 5 seconds
    firstPaint: 2000, // 2 seconds
  },
  
  userExperience: {
    longTaskThreshold: 100, // 100ms
    memoryUsageThreshold: 85, // 85%
    scrollDepthGoal: 40, // 40%
    timeOnPageGoal: 20000, // 20 seconds
  },
};

// Get current environment budgets
export function getPerformanceBudgets(): PerformanceBudgetConfig {
  return process.env.NODE_ENV === 'production' 
    ? PERFORMANCE_BUDGETS 
    : DEV_PERFORMANCE_BUDGETS;
}

// Performance monitoring alerts
export interface PerformanceAlert {
  type: 'warning' | 'critical';
  metric: string;
  current: number;
  budget: number;
  message: string;
  impact: 'user-experience' | 'seo' | 'conversion' | 'technical';
  recommendation: string;
}

export function generatePerformanceAlerts(
  metrics: Record<string, number>
): PerformanceAlert[] {
  const budgets = getPerformanceBudgets();
  const alerts: PerformanceAlert[] = [];

  // Check Core Web Vitals
  if (metrics.LCP > budgets.webVitals.LCP.poor) {
    alerts.push({
      type: 'critical',
      metric: 'LCP',
      current: metrics.LCP,
      budget: budgets.webVitals.LCP.good,
      message: 'Largest Contentful Paint is too slow',
      impact: 'user-experience',
      recommendation: 'Optimize images, reduce server response time, eliminate render-blocking resources',
    });
  } else if (metrics.LCP > budgets.webVitals.LCP.good) {
    alerts.push({
      type: 'warning',
      metric: 'LCP',
      current: metrics.LCP,
      budget: budgets.webVitals.LCP.good,
      message: 'Largest Contentful Paint needs improvement',
      impact: 'seo',
      recommendation: 'Consider image optimization and CDN implementation',
    });
  }

  if (metrics.FID > budgets.webVitals.FID.poor) {
    alerts.push({
      type: 'critical',
      metric: 'FID',
      current: metrics.FID,
      budget: budgets.webVitals.FID.good,
      message: 'First Input Delay is too high',
      impact: 'user-experience',
      recommendation: 'Reduce JavaScript execution time, split code bundles, use web workers',
    });
  }

  if (metrics.CLS > budgets.webVitals.CLS.poor) {
    alerts.push({
      type: 'critical',
      metric: 'CLS',
      current: metrics.CLS,
      budget: budgets.webVitals.CLS.good,
      message: 'Cumulative Layout Shift is too high',
      impact: 'user-experience',
      recommendation: 'Set dimensions for images and ads, avoid inserting content above existing content',
    });
  }

  // Check resource sizes
  if (metrics.totalSize > budgets.resources.totalSize) {
    alerts.push({
      type: metrics.totalSize > budgets.resources.totalSize * 1.5 ? 'critical' : 'warning',
      metric: 'totalSize',
      current: metrics.totalSize,
      budget: budgets.resources.totalSize,
      message: 'Total page size exceeds budget',
      impact: 'user-experience',
      recommendation: 'Compress images, minify CSS/JS, enable gzip compression',
    });
  }

  if (metrics.jsSize > budgets.resources.jsSize) {
    alerts.push({
      type: 'warning',
      metric: 'jsSize',
      current: metrics.jsSize,
      budget: budgets.resources.jsSize,
      message: 'JavaScript bundle size is too large',
      impact: 'technical',
      recommendation: 'Implement code splitting, tree shaking, and lazy loading',
    });
  }

  // Check timing metrics
  if (metrics.loadComplete > budgets.timing.loadComplete) {
    alerts.push({
      type: metrics.loadComplete > budgets.timing.loadComplete * 2 ? 'critical' : 'warning',
      metric: 'loadComplete',
      current: metrics.loadComplete,
      budget: budgets.timing.loadComplete,
      message: 'Page load time is too slow',
      impact: 'conversion',
      recommendation: 'Optimize critical rendering path, reduce server response time',
    });
  }

  return alerts;
}

// Performance score calculation
export function calculatePerformanceScore(metrics: Record<string, number>): {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  breakdown: Record<string, number>;
} {
  const budgets = getPerformanceBudgets();
  let totalScore = 0;
  let maxScore = 0;
  const breakdown: Record<string, number> = {};

  // Core Web Vitals scoring (60% of total score)
  const webVitalsWeight = 0.6;
  const webVitalsMetrics = ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'];
  
  webVitalsMetrics.forEach(metric => {
    if (metrics[metric] !== undefined) {
      const budget = budgets.webVitals[metric as keyof typeof budgets.webVitals];
      let score = 100;
      
      if (metrics[metric] > budget.good) {
        const range = budget.poor - budget.good;
        const excess = metrics[metric] - budget.good;
        score = Math.max(0, 100 - (excess / range) * 50);
      }
      
      if (metrics[metric] > budget.poor) {
        score = Math.max(0, 50 - ((metrics[metric] - budget.poor) / budget.poor) * 50);
      }
      
      breakdown[metric] = score;
      totalScore += score * webVitalsWeight / webVitalsMetrics.length;
      maxScore += 100 * webVitalsWeight / webVitalsMetrics.length;
    }
  });

  // Resource size scoring (25% of total score)
  const resourceWeight = 0.25;
  const resourceMetrics = ['totalSize', 'jsSize', 'cssSize', 'imageSize'];
  
  resourceMetrics.forEach(metric => {
    if (metrics[metric] !== undefined) {
      const budget = budgets.resources[metric as keyof typeof budgets.resources];
      let score = 100;
      
      if (metrics[metric] > budget) {
        score = Math.max(0, 100 - ((metrics[metric] - budget) / budget) * 100);
      }
      
      breakdown[metric] = score;
      totalScore += score * resourceWeight / resourceMetrics.length;
      maxScore += 100 * resourceWeight / resourceMetrics.length;
    }
  });

  // Timing scoring (15% of total score)
  const timingWeight = 0.15;
  const timingMetrics = ['domContentLoaded', 'loadComplete', 'firstPaint'];
  
  timingMetrics.forEach(metric => {
    if (metrics[metric] !== undefined) {
      const budget = budgets.timing[metric as keyof typeof budgets.timing];
      let score = 100;
      
      if (metrics[metric] > budget) {
        score = Math.max(0, 100 - ((metrics[metric] - budget) / budget) * 100);
      }
      
      breakdown[metric] = score;
      totalScore += score * timingWeight / timingMetrics.length;
      maxScore += 100 * timingWeight / timingMetrics.length;
    }
  });

  const finalScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  
  let grade: 'A' | 'B' | 'C' | 'D' | 'F';
  if (finalScore >= 90) grade = 'A';
  else if (finalScore >= 80) grade = 'B';
  else if (finalScore >= 70) grade = 'C';
  else if (finalScore >= 60) grade = 'D';
  else grade = 'F';

  return {
    score: Math.round(finalScore),
    grade,
    breakdown,
  };
}

// Export budget checking utilities
export function checkBudgetCompliance(
  metric: string,
  value: number
): 'within-budget' | 'over-budget' | 'critical' {
  const budgets = getPerformanceBudgets();
  
  // Check web vitals
  if (metric in budgets.webVitals) {
    const budget = budgets.webVitals[metric as keyof typeof budgets.webVitals];
    if (value <= budget.good) return 'within-budget';
    if (value <= budget.poor) return 'over-budget';
    return 'critical';
  }
  
  // Check resources
  if (metric in budgets.resources) {
    const budget = budgets.resources[metric as keyof typeof budgets.resources];
    if (value <= budget) return 'within-budget';
    if (value <= budget * 1.5) return 'over-budget';
    return 'critical';
  }
  
  // Check timing
  if (metric in budgets.timing) {
    const budget = budgets.timing[metric as keyof typeof budgets.timing];
    if (value <= budget) return 'within-budget';
    if (value <= budget * 1.5) return 'over-budget';
    return 'critical';
  }
  
  return 'within-budget';
}