// Analytics System - Comprehensive Event Tracking & Performance Monitoring

// Event Types for TypeScript Safety
export type EventType = 
  | 'page_view'
  | 'user_action'
  | 'performance'
  | 'error'
  | 'business'
  | 'accessibility'
  | 'security';

// Base Event Interface
interface BaseEvent {
  event_type: EventType;
  timestamp: number;
  session_id: string;
  user_id?: string;
  page_url: string;
  user_agent: string;
  viewport: {
    width: number;
    height: number;
  };
  device_info: {
    type: 'desktop' | 'mobile' | 'tablet';
    platform: string;
    browser: string;
    version: string;
  };
}

// Page View Events
export interface PageViewEvent extends BaseEvent {
  event_type: 'page_view';
  page_title: string;
  page_category: string;
  referrer?: string;
  load_time?: number;
  core_web_vitals?: {
    lcp?: number;
    fid?: number;
    cls?: number;
    ttfb?: number;
    fcp?: number;
  };
}

// User Action Events
export interface UserActionEvent extends BaseEvent {
  event_type: 'user_action';
  action: string;
  element_type: string;
  element_id?: string;
  element_text?: string;
  interaction_type: 'click' | 'hover' | 'focus' | 'blur' | 'input' | 'scroll';
  duration?: number;
  success?: boolean;
  error_message?: string;
}

// Performance Events
export interface PerformanceEvent extends BaseEvent {
  event_type: 'performance';
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  threshold?: number;
  status: 'good' | 'needs-improvement' | 'poor';
  context?: {
    page_load?: boolean;
    user_interaction?: boolean;
    resource_loading?: boolean;
  };
}

// Error Events
export interface ErrorEvent extends BaseEvent {
  event_type: 'error';
  error_type: 'javascript' | 'network' | 'resource' | 'validation' | 'accessibility';
  error_message: string;
  error_stack?: string;
  error_code?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  user_impact: 'none' | 'minor' | 'major' | 'blocking';
  recovery_action?: string;
}

// Business Events
export interface BusinessEvent extends BaseEvent {
  event_type: 'business';
  business_action: string;
  category: 'engagement' | 'conversion' | 'retention' | 'monetization';
  value?: number;
  currency?: string;
  properties?: Record<string, any>;
}

// Accessibility Events
export interface AccessibilityEvent extends BaseEvent {
  event_type: 'accessibility';
  accessibility_feature: string;
  action: 'enabled' | 'disabled' | 'changed';
  previous_value?: any;
  new_value?: any;
  impact: 'low' | 'medium' | 'high';
}

// Security Events
export interface SecurityEvent extends BaseEvent {
  event_type: 'security';
  security_action: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  ip_address?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  threat_type?: 'suspicious_activity' | 'authentication_failure' | 'data_access' | 'malware';
}

// Union type for all events
export type AnalyticsEvent = 
  | PageViewEvent 
  | UserActionEvent 
  | PerformanceEvent 
  | ErrorEvent 
  | BusinessEvent 
  | AccessibilityEvent 
  | SecurityEvent;

// Analytics Configuration
interface AnalyticsConfig {
  enabled: boolean;
  endpoint: string;
  batch_size: number;
  flush_interval: number;
  debug: boolean;
  sample_rate: number;
  privacy_mode: boolean;
}

// Default Configuration
const DEFAULT_CONFIG: AnalyticsConfig = {
  enabled: true,
  endpoint: '/api/analytics',
  batch_size: 10,
  flush_interval: 5000, // 5 seconds
  debug: false,
  sample_rate: 1.0, // 100% of events
  privacy_mode: true, // Respect user privacy
};

// Analytics Class
class Analytics {
  private config: AnalyticsConfig;
  private eventQueue: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private flushTimer?: NodeJS.Timeout;
  private isInitialized = false;

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sessionId = this.generateSessionId();
    this.init();
  }

  // Initialize analytics
  private init() {
    if (this.isInitialized) return;

    // Set up periodic flushing
    this.setupFlushTimer();

    // Track page views automatically
    this.trackPageView();

    // Set up performance monitoring
    this.setupPerformanceMonitoring();

    // Set up error tracking
    this.setupErrorTracking();

    // Set up user interaction tracking
    this.setupInteractionTracking();

    this.isInitialized = true;
  }

  // Generate unique session ID
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Set user ID for tracking
  setUserId(userId: string) {
    this.userId = userId;
  }

  // Get device information
  private getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Detect device type
    let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      deviceType = /iPad/.test(userAgent) ? 'tablet' : 'mobile';
    }

    // Detect browser and platform
    const platform = navigator.platform;
    let browser = 'Unknown';
    let version = 'Unknown';

    if (/Chrome/.test(userAgent)) {
      browser = 'Chrome';
      version = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    } else if (/Firefox/.test(userAgent)) {
      browser = 'Firefox';
      version = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    } else if (/Safari/.test(userAgent)) {
      browser = 'Safari';
      version = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    } else if (/Edge/.test(userAgent)) {
      browser = 'Edge';
      version = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
    }

    return {
      type: deviceType,
      platform,
      browser,
      version,
    };
  }

  // Get base event data
  private getBaseEvent(): Omit<BaseEvent, 'event_type'> {
    return {
      timestamp: Date.now(),
      session_id: this.sessionId,
      user_id: this.userId,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      device_info: this.getDeviceInfo(),
    };
  }

  // Track page view
  trackPageView() {
    const event: PageViewEvent = {
      ...this.getBaseEvent(),
      event_type: 'page_view',
      page_title: document.title,
      page_category: this.getPageCategory(),
      referrer: document.referrer,
    };

    // Add performance metrics if available
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        event.load_time = Math.round(navigation.loadEventEnd - navigation.loadEventStart);
      }

      // Core Web Vitals
      const coreWebVitals: any = {};
      
      // LCP
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        coreWebVitals.lcp = Math.round(lcpEntries[lcpEntries.length - 1].startTime);
      }

      // FID
      const fidEntries = performance.getEntriesByType('first-input');
      if (fidEntries.length > 0) {
        coreWebVitals.fid = Math.round((fidEntries[0] as any).processingStart - fidEntries[0].startTime);
      }

      // CLS
      let clsValue = 0;
      const clsEntries = performance.getEntriesByType('layout-shift');
      clsEntries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      if (clsValue > 0) {
        coreWebVitals.cls = Math.round(clsValue * 1000) / 1000;
      }

      // TTFB
      if (navigation) {
        coreWebVitals.ttfb = Math.round(navigation.responseStart - navigation.requestStart);
      }

      // FCP
      const fcpEntries = performance.getEntriesByType('first-contentful-paint');
      if (fcpEntries.length > 0) {
        coreWebVitals.fcp = Math.round(fcpEntries[0].startTime);
      }

      if (Object.keys(coreWebVitals).length > 0) {
        event.core_web_vitals = coreWebVitals;
      }
    }

    this.track(event);
  }

  // Get page category
  private getPageCategory(): string {
    const path = window.location.pathname;
    if (path.startsWith('/dashboard')) return 'dashboard';
    if (path.startsWith('/auth')) return 'authentication';
    if (path.startsWith('/profile')) return 'profile';
    if (path.startsWith('/settings')) return 'settings';
    if (path === '/') return 'home';
    return 'other';
  }

  // Track user action
  trackUserAction(
    action: string,
    elementType: string,
    interactionType: UserActionEvent['interaction_type'],
    options: Partial<Omit<UserActionEvent, keyof BaseEvent | 'event_type'>> = {}
  ) {
    const event: UserActionEvent = {
      ...this.getBaseEvent(),
      event_type: 'user_action',
      action,
      element_type: elementType,
      interaction_type: interactionType,
      ...options,
    };

    this.track(event);
  }

  // Track performance metric
  trackPerformance(
    metricName: string,
    metricValue: number,
    metricUnit: string,
    status: PerformanceEvent['status'],
    threshold?: number
  ) {
    const event: PerformanceEvent = {
      ...this.getBaseEvent(),
      event_type: 'performance',
      metric_name: metricName,
      metric_value: metricValue,
      metric_unit: metricUnit,
      threshold,
      status,
    };

    this.track(event);
  }

  // Track error
  trackError(
    errorType: ErrorEvent['error_type'],
    errorMessage: string,
    severity: ErrorEvent['severity'],
    userImpact: ErrorEvent['user_impact'],
    options: Partial<Omit<ErrorEvent, keyof BaseEvent | 'event_type'>> = {}
  ) {
    const event: ErrorEvent = {
      ...this.getBaseEvent(),
      event_type: 'error',
      error_type: errorType,
      error_message: errorMessage,
      severity,
      user_impact: userImpact,
      ...options,
    };

    this.track(event);
  }

  // Track business event
  trackBusiness(
    businessAction: string,
    category: BusinessEvent['category'],
    value?: number,
    currency?: string,
    properties?: Record<string, any>
  ) {
    const event: BusinessEvent = {
      ...this.getBaseEvent(),
      event_type: 'business',
      business_action: businessAction,
      category,
      value,
      currency,
      properties,
    };

    this.track(event);
  }

  // Track accessibility event
  trackAccessibility(
    feature: string,
    action: AccessibilityEvent['action'],
    impact: AccessibilityEvent['impact'],
    previousValue?: any,
    newValue?: any
  ) {
    const event: AccessibilityEvent = {
      ...this.getBaseEvent(),
      event_type: 'accessibility',
      accessibility_feature: feature,
      action,
      impact,
      previous_value: previousValue,
      new_value: newValue,
    };

    this.track(event);
  }

  // Track security event
  trackSecurity(
    action: string,
    riskLevel: SecurityEvent['risk_level'],
    threatType?: SecurityEvent['threat_type'],
    options: Partial<Omit<SecurityEvent, keyof BaseEvent | 'event_type'>> = {}
  ) {
    const event: SecurityEvent = {
      ...this.getBaseEvent(),
      event_type: 'security',
      security_action: action,
      risk_level: riskLevel,
      threat_type: threatType,
      ...options,
    };

    this.track(event);
  }

  // Add event to queue
  private track(event: AnalyticsEvent) {
    if (!this.config.enabled) return;

    // Apply sampling
    if (Math.random() > this.config.sample_rate) return;

    // Apply privacy mode
    if (this.config.privacy_mode) {
      event = this.applyPrivacyMode(event);
    }

    this.eventQueue.push(event);

    // Flush if queue is full
    if (this.eventQueue.length >= this.config.batch_size) {
      this.flush();
    }
  }

  // Apply privacy mode to events
  private applyPrivacyMode(event: AnalyticsEvent): AnalyticsEvent {
    const privateEvent = { ...event };
    
    // Remove or hash sensitive information
    if ('user_agent' in privateEvent) {
      privateEvent.user_agent = this.hashString(privateEvent.user_agent);
    }
    
    if ('ip_address' in privateEvent) {
      privateEvent.ip_address = this.hashString(privateEvent.ip_address || '');
    }

    return privateEvent;
  }

  // Simple string hashing
  private hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return `hash_${Math.abs(hash)}`;
  }

  // Set up performance monitoring
  private setupPerformanceMonitoring() {
    if (!('PerformanceObserver' in window)) return;

    // Monitor long tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (entry.duration > 50) { // 50ms threshold
          this.trackPerformance(
            'long_task',
            entry.duration,
            'ms',
            entry.duration > 100 ? 'poor' : 'needs-improvement',
            50
          );
        }
      });
    });

    try {
      longTaskObserver.observe({ entryTypes: ['longtask'] });
    } catch (e) {
      // Long task observer not supported
    }

    // Monitor resource loading
    const resourceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (entry.duration > 3000) { // 3s threshold
          this.trackPerformance(
            'slow_resource',
            entry.duration,
            'ms',
            'poor',
            3000
          );
        }
      });
    });

    try {
      resourceObserver.observe({ entryTypes: ['resource'] });
    } catch (e) {
      // Resource observer not supported
    }
  }

  // Set up error tracking
  private setupErrorTracking() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError(
        'javascript',
        event.message,
        'medium',
        'minor',
        {
          error_stack: event.error?.stack,
          error_code: event.filename,
        }
      );
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(
        'javascript',
        event.reason?.message || 'Unhandled Promise Rejection',
        'high',
        'major',
        {
          error_stack: event.reason?.stack,
        }
      );
    });
  }

  // Set up interaction tracking
  private setupInteractionTracking() {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target) {
        this.trackUserAction(
          'click',
          target.tagName.toLowerCase(),
          'click',
          {
            element_id: target.id,
            element_text: target.textContent?.substring(0, 100),
          }
        );
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      if (form) {
        this.trackUserAction(
          'form_submit',
          'form',
          'click',
          {
            element_id: form.id,
            element_text: form.getAttribute('action') || 'unknown',
          }
        );
      }
    });
  }

  // Set up flush timer
  private setupFlushTimer() {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flush_interval);
  }

  // Flush events to server
  private async flush() {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (this.config.debug) {
        console.log(`Analytics: Flushed ${events.length} events`);
      }
    } catch (error) {
      // Re-queue events on failure
      this.eventQueue.unshift(...events);
      
      if (this.config.debug) {
        console.error('Analytics: Failed to flush events:', error);
      }
    }
  }

  // Manual flush
  async flushEvents() {
    await this.flush();
  }

  // Get queue status
  getQueueStatus() {
    return {
      queueLength: this.eventQueue.length,
      isInitialized: this.isInitialized,
      config: this.config,
    };
  }

  // Update configuration
  updateConfig(newConfig: Partial<AnalyticsConfig>) {
    this.config = { ...this.config, ...newConfig };
    
    // Restart flush timer if interval changed
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.setupFlushTimer();
    }
  }

  // Cleanup
  destroy() {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush(); // Final flush
    this.isInitialized = false;
  }
}

// Create singleton instance
const analytics = new Analytics();

// Export instance and class
export default analytics;
export { Analytics };

// Convenience functions for common events
export const trackPageView = () => analytics.trackPageView();
export const trackUserAction = (
  action: string,
  elementType: string,
  interactionType: UserActionEvent['interaction_type'],
  options?: Partial<Omit<UserActionEvent, keyof BaseEvent | 'event_type'>>
) => analytics.trackUserAction(action, elementType, interactionType, options);

export const trackPerformance = (
  metricName: string,
  metricValue: number,
  metricUnit: string,
  status: PerformanceEvent['status'],
  threshold?: number
) => analytics.trackPerformance(metricName, metricValue, metricUnit, status, threshold);

export const trackError = (
  errorType: ErrorEvent['error_type'],
  errorMessage: string,
  severity: ErrorEvent['severity'],
  userImpact: ErrorEvent['user_impact'],
  options?: Partial<Omit<ErrorEvent, keyof BaseEvent | 'event_type'>>
) => analytics.trackError(errorType, errorMessage, severity, userImpact, options);

export const trackBusiness = (
  businessAction: string,
  category: BusinessEvent['category'],
  value?: number,
  currency?: string,
  properties?: Record<string, any>
) => analytics.trackBusiness(businessAction, category, value, currency, properties);

export const trackAccessibility = (
  feature: string,
  action: AccessibilityEvent['action'],
  impact: AccessibilityEvent['impact'],
  previousValue?: any,
  newValue?: any
) => analytics.trackAccessibility(feature, action, impact, previousValue, newValue);

export const trackSecurity = (
  action: string,
  riskLevel: SecurityEvent['risk_level'],
  threatType?: SecurityEvent['threat_type'],
  options?: Partial<Omit<SecurityEvent, keyof BaseEvent | 'event_type'>>
) => analytics.trackSecurity(action, riskLevel, threatType, options);








