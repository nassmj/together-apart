import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

// Performance Metrics Interface
interface PerformanceMetrics {
  lcp: number | null;        // Largest Contentful Paint
  fid: number | null;        // First Input Delay
  cls: number | null;        // Cumulative Layout Shift
  ttfb: number | null;       // Time to First Byte
  fcp: number | null;        // First Contentful Paint
  lcpScore: 'good' | 'needs-improvement' | 'poor' | null;
  fidScore: 'good' | 'needs-improvement' | 'poor' | null;
  clsScore: 'good' | 'needs-improvement' | 'poor' | null;
}

// Performance Budgets (Core Web Vitals)
const PERFORMANCE_BUDGETS = {
  lcp: { good: 2500, poor: 4000 },      // 2.5s good, 4s poor
  fid: { good: 100, poor: 300 },        // 100ms good, 300ms poor
  cls: { good: 0.1, poor: 0.25 },      // 0.1 good, 0.25 poor
  ttfb: { good: 800, poor: 1800 },     // 800ms good, 1.8s poor
  fcp: { good: 1800, poor: 3000 },     // 1.8s good, 3s poor
};

// Performance Monitor Component
const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    ttfb: null,
    fcp: null,
    lcpScore: null,
    fidScore: null,
    clsScore: null,
  });

  const [isVisible, setIsVisible] = useState(false);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  // Calculate performance score based on budget
  const calculateScore = useCallback((value: number, metric: keyof typeof PERFORMANCE_BUDGETS): 'good' | 'needs-improvement' | 'poor' => {
    const budget = PERFORMANCE_BUDGETS[metric];
    if (value <= budget.good) return 'good';
    if (value <= budget.poor) return 'needs-improvement';
    return 'poor';
  }, []);

  // Get score color
  const getScoreColor = (score: 'good' | 'needs-improvement' | 'poor' | null) => {
    switch (score) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Get score icon
  const getScoreIcon = (score: 'good' | 'needs-improvement' | 'poor' | null) => {
    switch (score) {
      case 'good': return '✅';
      case 'needs-improvement': return '⚠️';
      case 'poor': return '❌';
      default: return '❓';
    }
  };

  // Measure Core Web Vitals
  useEffect(() => {
    if ('PerformanceObserver' in window) {
      // LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1] as PerformanceEntry;
        if (lastEntry) {
          const lcp = Math.round(lastEntry.startTime);
          setMetrics(prev => ({
            ...prev,
            lcp,
            lcpScore: calculateScore(lcp, 'lcp'),
          }));
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          const fid = Math.round(entry.processingStart - entry.startTime);
          setMetrics(prev => ({
            ...prev,
            fid,
            fidScore: calculateScore(fid, 'fid'),
          }));
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // CLS (Cumulative Layout Shift)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            setMetrics(prev => ({
              ...prev,
              cls: Math.round(clsValue * 1000) / 1000,
              clsScore: calculateScore(clsValue, 'cls'),
            }));
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      // FCP (First Contentful Paint)
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0] as PerformanceEntry;
        if (firstEntry) {
          const fcp = Math.round(firstEntry.startTime);
          setMetrics(prev => ({
            ...prev,
            fcp,
            fcpScore: calculateScore(fcp, 'fcp'),
          }));
        }
      });
      fcpObserver.observe({ entryTypes: ['first-contentful-paint'] });

      // TTFB (Time to First Byte)
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        const ttfb = Math.round(navigationEntry.responseStart - navigationEntry.requestStart);
        setMetrics(prev => ({
          ...prev,
          ttfb,
        }));
      }

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
        clsObserver.disconnect();
        fcpObserver.disconnect();
      };
    }
  }, [calculateScore]);

  // Collect performance data for analysis
  useEffect(() => {
    const collectPerformanceData = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const resources = performance.getEntriesByType('resource');
      
      const data = {
        timestamp: Date.now(),
        navigation: {
          domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
          loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
          domInteractive: navigation?.domInteractive,
          firstPaint: performance.getEntriesByName('first-paint')[0]?.startTime,
          firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
        },
        resources: resources.map(resource => ({
          name: resource.name,
          duration: resource.duration,
          size: (resource as any).transferSize || 0,
          type: resource.entryType,
        })),
        memory: (performance as any).memory ? {
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        } : null,
      };

      setPerformanceData(prev => [...prev.slice(-9), data]);
    };

    // Collect data every 5 seconds
    const interval = setInterval(collectPerformanceData, 5000);
    collectPerformanceData(); // Initial collection

    return () => clearInterval(interval);
  }, []);

  // Toggle visibility
  const toggleVisibility = () => setIsVisible(!isVisible);

  // Export performance data
  const exportPerformanceData = () => {
    const dataStr = JSON.stringify(performanceData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Clear performance data
  const clearPerformanceData = () => {
    setPerformanceData([]);
    if ('performance' in window && 'clearResourceTimings' in performance) {
      performance.clearResourceTimings();
    }
  };

  return (
    <>
      {/* Performance Toggle Button */}
      <button
        onClick={toggleVisibility}
        className="fixed bottom-4 left-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        aria-label="Toggle performance monitor"
        title="Performance Monitor"
      >
        📊
      </button>

      {/* Performance Monitor Panel */}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-4 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm w-full"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Performance Monitor</h3>
            <button
              onClick={toggleVisibility}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close performance monitor"
            >
              ✕
            </button>
          </div>

          {/* Core Web Vitals */}
          <div className="space-y-3 mb-4">
            <h4 className="font-medium text-gray-700 text-sm">Core Web Vitals</h4>
            
            {/* LCP */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">LCP</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">
                  {metrics.lcp ? `${metrics.lcp}ms` : '--'}
                </span>
                {metrics.lcpScore && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(metrics.lcpScore)}`}>
                    {getScoreIcon(metrics.lcpScore)}
                  </span>
                )}
              </div>
            </div>

            {/* FID */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">FID</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">
                  {metrics.fid ? `${metrics.fid}ms` : '--'}
                </span>
                {metrics.fidScore && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(metrics.fidScore)}`}>
                    {getScoreIcon(metrics.fidScore)}
                  </span>
                )}
              </div>
            </div>

            {/* CLS */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">CLS</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono">
                  {metrics.cls ? metrics.cls.toFixed(3) : '--'}
                </span>
                {metrics.clsScore && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(metrics.clsScore)}`}>
                    {getScoreIcon(metrics.clsScore)}
                  </span>
                )}
              </div>
            </div>

            {/* TTFB */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">TTFB</span>
              <span className="text-sm font-mono">
                {metrics.ttfb ? `${metrics.ttfb}ms` : '--'}
              </span>
            </div>

            {/* FCP */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">FCP</span>
              <span className="text-sm font-mono">
                {metrics.fcp ? `${metrics.fcp}ms` : '--'}
              </span>
            </div>
          </div>

          {/* Performance Budgets */}
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 text-sm mb-2">Performance Budgets</h4>
            <div className="text-xs text-gray-500 space-y-1">
              <div>LCP: &lt;2.5s (good), &lt;4s (poor)</div>
              <div>FID: &lt;100ms (good), &lt;300ms (poor)</div>
              <div>CLS: &lt;0.1 (good), &lt;0.25 (poor)</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={exportPerformanceData}
              className="flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Export Data
            </button>
            <button
              onClick={clearPerformanceData}
              className="flex-1 bg-gray-600 text-white text-sm px-3 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Data Points Count */}
          <div className="text-xs text-gray-500 text-center mt-2">
            {performanceData.length} data points collected
          </div>
        </motion.div>
      )}
    </>
  );
};

export default PerformanceMonitor;






