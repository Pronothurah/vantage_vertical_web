'use client';

import { useState, useEffect } from 'react';
import { checkPerformanceBudgets } from '@/lib/seoMonitoring';
import { calculatePerformanceScore, generatePerformanceAlerts } from '@/lib/performanceBudgets';

interface PerformanceDashboardProps {
  showInProduction?: boolean;
}

export default function PerformanceDashboard({ showInProduction = false }: PerformanceDashboardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [alerts, setAlerts] = useState<any[]>([]);

  // Only show in development unless explicitly enabled for production
  const shouldShow = process.env.NODE_ENV === 'development' || showInProduction;

  useEffect(() => {
    if (!shouldShow) return;

    const updatePerformanceData = () => {
      const budgets = checkPerformanceBudgets();
      const metrics: Record<string, number> = {};
      
      budgets.forEach(budget => {
        metrics[budget.metric] = budget.current;
      });

      const score = calculatePerformanceScore(metrics);
      const performanceAlerts = generatePerformanceAlerts(metrics);

      setPerformanceData({
        budgets,
        score,
        metrics,
      });
      setAlerts(performanceAlerts);
    };

    // Update performance data after page load
    if (document.readyState === 'complete') {
      setTimeout(updatePerformanceData, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(updatePerformanceData, 1000);
      });
    }

    // Update every 30 seconds
    const interval = setInterval(updatePerformanceData, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [shouldShow]);

  if (!shouldShow || !performanceData) {
    return null;
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'within-budget': return 'text-green-600 bg-green-100';
      case 'over-budget': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    if (score >= 70) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-gray-900 text-white p-3 rounded-full shadow-lg hover:bg-gray-800 transition-colors duration-200"
        title="Performance Dashboard"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </button>

      {/* Dashboard Panel */}
      {isVisible && (
        <div className="absolute bottom-16 right-0 w-96 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Performance Dashboard</h3>
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-bold ${getScoreColor(performanceData.score.score)}`}>
                  {performanceData.score.score}
                </span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(performanceData.score.score)}`}>
                  {performanceData.score.grade}
                </span>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="p-4 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Alerts</h4>
              <div className="space-y-2">
                {alerts.slice(0, 3).map((alert, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-xs ${
                      alert.type === 'critical' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                    }`}
                  >
                    <div className="font-medium">{alert.message}</div>
                    <div className="text-xs opacity-75 mt-1">{alert.recommendation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Performance Budgets */}
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Performance Budgets</h4>
            <div className="space-y-2">
              {performanceData.budgets.map((budget: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{budget.metric}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900">
                      {budget.metric.includes('Size') 
                        ? formatBytes(budget.current)
                        : formatTime(budget.current)
                      }
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(budget.status)}`}>
                      {budget.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex space-x-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-3 py-2 bg-primary text-white text-xs rounded hover:bg-red-700 transition-colors duration-200"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  if (navigator.storage && navigator.storage.estimate) {
                    navigator.storage.estimate().then(estimate => {
                      console.log('Storage estimate:', estimate);
                    });
                  }
                }}
                className="flex-1 px-3 py-2 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors duration-200"
              >
                Check Storage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}