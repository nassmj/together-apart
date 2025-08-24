// Analytics system for tracking user behavior and performance metrics

export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp?: number;
  userId?: string;
  sessionId?: string;
}

export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  cls: number; // Cumulative Layout Shift
  fid: number; // First Input Delay
  ttfb: number; // Time to First Byte
  pageLoadTime: number;
}

export interface UserBehavior {
  pageViews: number;
  sessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  featureUsage: Record<string, number>;
}

export interface BusinessMetrics {
  userRetention: number;
  userEngagement: number;
  featureAdoption: number;
  errorRate: number;
  performanceScore: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeAnalytics();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeAnalytics() {
    // Initialize session tracking
    this.trackEvent('session_start', {
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      language: navigator.language,
    });

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.trackEvent('page_visibility_change', {
        isVisible: !document.hidden,
        timestamp: Date.now(),
      });
    });

    // Track beforeunload for session end
    window.addEventListener('beforeunload', () => {
      this.trackEvent('session_end', {
        sessionId: this.sessionId,
        sessionDuration: this.getSessionDuration(),
      });
    });
  }

  setUserId(userId: string) {
    this.userId = userId;
    this.trackEvent('user_identified', { userId });
  }

  trackEvent(event: string, properties: Record<string, any> = {}) {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        url: window.location.href,
        referrer: document.referrer,
      },
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
    };

    this.events.push(analyticsEvent);
    this.sendEvent(analyticsEvent);
  }

  private sendEvent(event: AnalyticsEvent) {
    // In production, send to your analytics service
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', event);
    }

    // Example: Send to your backend
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event),
    // }).catch(console.error);
  }

  // User Behavior Tracking
  trackPageView(page: string, properties: Record<string, any> = {}) {
    this.trackEvent('page_view', {
      page,
      ...properties,
    });
  }

  trackFeatureUsage(feature: string, properties: Record<string, any> = {}) {
    this.trackEvent('feature_used', {
      feature,
      ...properties,
    });
  }

  trackConversion(conversionType: string, value?: number) {
    this.trackEvent('conversion', {
      type: conversionType,
      value,
    });
  }

  trackError(error: Error, context?: Record<string, any>) {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  // Performance Tracking
  trackPerformance(metrics: PerformanceMetrics) {
    this.trackEvent('performance_metrics', {
      ...metrics,
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection?.effectiveType || 'unknown',
    });
  }

  // Business Metrics
  trackUserEngagement(engagementType: string, value: number) {
    this.trackEvent('user_engagement', {
      type: engagementType,
      value,
    });
  }

  trackRetention(dayNumber: number, isRetained: boolean) {
    this.trackEvent('retention', {
      day: dayNumber,
      retained: isRetained,
    });
  }

  // Custom Event Tracking
  trackCustomEvent(eventName: string, properties: Record<string, any> = {}) {
    this.trackEvent(eventName, properties);
  }

  // Utility Methods
  private getSessionDuration(): number {
    return Date.now() - parseInt(this.sessionId.split('-')[0]);
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  clearEvents() {
    this.events = [];
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  // Batch Events
  batchEvents(events: AnalyticsEvent[]) {
    if (!this.isEnabled) return;

    events.forEach(event => {
      this.events.push({
        ...event,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: event.timestamp || Date.now(),
      });
    });

    // Send batch to backend
    this.sendBatchEvents(events);
  }

  private sendBatchEvents(events: AnalyticsEvent[]) {
    if (import.meta.env.DEV) {
      console.log('Batch Analytics Events:', events);
    }

    // Example: Send batch to your backend
    // fetch('/api/analytics/batch', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(events),
    // }).catch(console.error);
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Convenience functions for common tracking
export const trackPageView = (page: string, properties?: Record<string, any>) => {
  analytics.trackPageView(page, properties);
};

export const trackFeatureUsage = (feature: string, properties?: Record<string, any>) => {
  analytics.trackFeatureUsage(feature, properties);
};

export const trackConversion = (conversionType: string, value?: number) => {
  analytics.trackConversion(conversionType, value);
};

export const trackError = (error: Error, context?: Record<string, any>) => {
  analytics.trackError(error, context);
};

export const trackPerformance = (metrics: PerformanceMetrics) => {
  analytics.trackPerformance(metrics);
};

export const trackUserEngagement = (engagementType: string, value: number) => {
  analytics.trackUserEngagement(engagementType, value);
};

export const trackRetention = (dayNumber: number, isRetained: boolean) => {
  analytics.trackRetention(dayNumber, isRetained);
};

export const trackCustomEvent = (eventName: string, properties?: Record<string, any>) => {
  analytics.trackCustomEvent(eventName, properties);
};

export default analytics;



