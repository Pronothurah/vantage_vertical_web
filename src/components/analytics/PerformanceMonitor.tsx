'use client';

import { useEffect } from 'react';
import { initializeMonitoring } from '@/lib/seoMonitoring';

interface PerformanceMonitorProps {
  enabled?: boolean;
}

export default function PerformanceMonitor({ enabled = true }: PerformanceMonitorProps) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Initialize monitoring after component mounts
    initializeMonitoring();

    // Performance observer for additional metrics
    if ('PerformanceObserver' in window) {
      try {
        // Observe long tasks (> 50ms)
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              if (window.gtag) {
                window.gtag('event', 'long_task', {
                  event_category: 'Performance',
                  event_label: entry.name,
                  value: Math.round(entry.duration),
                  custom_map: {
                    task_duration: entry.duration,
                    task_start: entry.startTime,
                  },
                });
              }

              if (process.env.NODE_ENV === 'development') {
                console.warn(`[Performance] Long task detected: ${entry.name} (${entry.duration}ms)`);
              }
            }
          });
        });

        longTaskObserver.observe({ entryTypes: ['longtask'] });

        // Observe layout shifts
        const layoutShiftObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          
          list.getEntries().forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });

          if (clsValue > 0.1) { // CLS threshold
            if (window.gtag) {
              window.gtag('event', 'layout_shift', {
                event_category: 'Performance',
                value: Math.round(clsValue * 1000),
                custom_map: {
                  cls_value: clsValue,
                  page_url: window.location.href,
                },
              });
            }

            if (process.env.NODE_ENV === 'development') {
              console.warn(`[Performance] Layout shift detected: ${clsValue}`);
            }
          }
        });

        layoutShiftObserver.observe({ entryTypes: ['layout-shift'] });

        // Observe resource loading
        const resourceObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry: any) => {
            // Track slow resources (> 2s)
            if (entry.duration > 2000) {
              if (window.gtag) {
                window.gtag('event', 'slow_resource', {
                  event_category: 'Performance',
                  event_label: entry.name,
                  value: Math.round(entry.duration),
                  custom_map: {
                    resource_type: entry.initiatorType,
                    resource_size: entry.transferSize,
                    resource_duration: entry.duration,
                  },
                });
              }

              if (process.env.NODE_ENV === 'development') {
                console.warn(`[Performance] Slow resource: ${entry.name} (${entry.duration}ms)`);
              }
            }

            // Track large resources (> 1MB)
            if (entry.transferSize > 1024 * 1024) {
              if (window.gtag) {
                window.gtag('event', 'large_resource', {
                  event_category: 'Performance',
                  event_label: entry.name,
                  value: Math.round(entry.transferSize / 1024), // KB
                  custom_map: {
                    resource_type: entry.initiatorType,
                    resource_size: entry.transferSize,
                  },
                });
              }

              if (process.env.NODE_ENV === 'development') {
                console.warn(`[Performance] Large resource: ${entry.name} (${Math.round(entry.transferSize / 1024)}KB)`);
              }
            }
          });
        });

        resourceObserver.observe({ entryTypes: ['resource'] });

        // Cleanup observers on unmount
        return () => {
          longTaskObserver.disconnect();
          layoutShiftObserver.disconnect();
          resourceObserver.disconnect();
        };
      } catch (error) {
        console.warn('Performance Observer not supported or failed to initialize:', error);
      }
    }

    // Memory usage monitoring (if available)
    if ('memory' in performance) {
      const checkMemoryUsage = () => {
        const memory = (performance as any).memory;
        const memoryUsage = {
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
        };

        // Alert if memory usage is high (> 80% of limit)
        if (memoryUsage.used / memoryUsage.limit > 0.8) {
          if (window.gtag) {
            window.gtag('event', 'high_memory_usage', {
              event_category: 'Performance',
              value: Math.round((memoryUsage.used / memoryUsage.limit) * 100),
              custom_map: {
                memory_used: memoryUsage.used,
                memory_total: memoryUsage.total,
                memory_limit: memoryUsage.limit,
              },
            });
          }

          if (process.env.NODE_ENV === 'development') {
            console.warn('[Performance] High memory usage:', memoryUsage);
          }
        }
      };

      // Check memory usage every 30 seconds
      const memoryInterval = setInterval(checkMemoryUsage, 30000);
      
      return () => {
        clearInterval(memoryInterval);
      };
    }
  }, [enabled]);

  // This component doesn't render anything
  return null;
}

// Hook for tracking custom performance metrics
export function usePerformanceTracking() {
  const trackCustomMetric = (name: string, value: number, unit: string = 'ms') => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'custom_metric', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        custom_map: {
          metric_name: name,
          metric_value: value,
          metric_unit: unit,
        },
      });
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] Custom metric: ${name} = ${value}${unit}`);
    }
  };

  const trackUserTiming = (name: string, startTime?: number) => {
    if (typeof window === 'undefined') return;

    if (startTime) {
      const duration = performance.now() - startTime;
      performance.mark(`${name}-end`);
      performance.measure(name, `${name}-start`, `${name}-end`);
      trackCustomMetric(name, duration);
    } else {
      performance.mark(`${name}-start`);
      return performance.now();
    }
  };

  const trackComponentRender = (componentName: string) => {
    const startTime = performance.now();
    
    return () => {
      const renderTime = performance.now() - startTime;
      trackCustomMetric(`${componentName}_render`, renderTime);
    };
  };

  return {
    trackCustomMetric,
    trackUserTiming,
    trackComponentRender,
  };
}