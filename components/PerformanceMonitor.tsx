import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
}

interface PerformanceMonitorProps {
  onMetrics?: (metrics: PerformanceMetrics) => void;
  enabled?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  onMetrics,
  enabled = true
}) => {
  const observerRef = useRef<PerformanceObserver | null>(null);
  const metricsRef = useRef<PerformanceMetrics>({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
  });

  useEffect(() => {
    if (!enabled || !window.performance) return;

    // Track page load time
    const trackPageLoad = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        metricsRef.current.pageLoadTime = navigation.loadEventEnd - navigation.loadEventStart;
      }
    };

    // Track First Contentful Paint (FCP)
    const trackFCP = () => {
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        metricsRef.current.firstContentfulPaint = fcpEntry.startTime;
      }
    };

    // Track Largest Contentful Paint (LCP)
    const trackLCP = () => {
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lastEntry = lcpEntries[lcpEntries.length - 1];
        metricsRef.current.largestContentfulPaint = lastEntry.startTime;
      }
    };

    // Track Cumulative Layout Shift (CLS)
    const trackCLS = () => {
      let clsValue = 0;
      const clsEntries: any[] = [];

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!clsEntries.includes(entry)) {
            clsEntries.push(entry);
            clsValue += (entry as any).value;
          }
        }
      });

      observer.observe({ entryTypes: ['layout-shift'] });
      metricsRef.current.cumulativeLayoutShift = clsValue;
    };

    // Track First Input Delay (FID)
    const trackFID = () => {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          metricsRef.current.firstInputDelay = (entry as any).processingStart - entry.startTime;
          observer.disconnect();
          break;
        }
      });

      observer.observe({ entryTypes: ['first-input'] });
    };

    // Set up observers
    if ('PerformanceObserver' in window) {
      // FCP Observer
      try {
        const fcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            metricsRef.current.firstContentfulPaint = entries[0].startTime;
            fcpObserver.disconnect();
          }
        });
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('FCP tracking not supported');
      }

      // LCP Observer
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const lastEntry = entries[entries.length - 1];
            metricsRef.current.largestContentfulPaint = lastEntry.startTime;
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP tracking not supported');
      }

      // CLS Observer
      try {
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          metricsRef.current.cumulativeLayoutShift = clsValue;
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS tracking not supported');
      }

      // FID Observer
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            const entry = entries[0];
            metricsRef.current.firstInputDelay = (entry as any).processingStart - entry.startTime;
            fidObserver.disconnect();
          }
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID tracking not supported');
      }
    }

    // Track page load when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', trackPageLoad);
    } else {
      trackPageLoad();
    }

    // Track FCP and LCP
    trackFCP();
    trackLCP();

    // Track CLS
    trackCLS();

    // Track FID
    trackFID();

    // Report metrics after a delay to allow for all metrics to be collected
    const reportTimer = setTimeout(() => {
      if (onMetrics) {
        onMetrics(metricsRef.current);
      }

      // Log metrics in development
      if (import.meta.env.DEV) {
        console.log('Performance Metrics:', {
          'Page Load Time': `${metricsRef.current.pageLoadTime.toFixed(2)}ms`,
          'First Contentful Paint': `${metricsRef.current.firstContentfulPaint.toFixed(2)}ms`,
          'Largest Contentful Paint': `${metricsRef.current.largestContentfulPaint.toFixed(2)}ms`,
          'Cumulative Layout Shift': metricsRef.current.cumulativeLayoutShift.toFixed(3),
          'First Input Delay': `${metricsRef.current.firstInputDelay.toFixed(2)}ms`,
        });
      }
    }, 5000);

    return () => {
      clearTimeout(reportTimer);
      document.removeEventListener('DOMContentLoaded', trackPageLoad);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [enabled, onMetrics]);

  return null; // This component doesn't render anything
};

// Hook for easy performance monitoring
export const usePerformanceMonitoring = (onMetrics?: (metrics: PerformanceMetrics) => void) => {
  useEffect(() => {
    if (!onMetrics) return;

    // Track navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigation) {
      const metrics: PerformanceMetrics = {
        pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        cumulativeLayoutShift: 0,
        firstInputDelay: 0,
      };

      // Get FCP if available
      const fcpEntry = performance.getEntriesByName('first-contentful-paint')[0];
      if (fcpEntry) {
        metrics.firstContentfulPaint = fcpEntry.startTime;
      }

      // Get LCP if available
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lastEntry = lcpEntries[lcpEntries.length - 1];
        metrics.largestContentfulPaint = lastEntry.startTime;
      }

      onMetrics(metrics);
    }
  }, [onMetrics]);
};






