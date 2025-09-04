// Simple Analytics Mock for Build Compatibility

// Event Types
export type EventType = 
  | 'page_view'
  | 'user_action'
  | 'performance'
  | 'error'
  | 'business'
  | 'accessibility'
  | 'security';

// Simple Analytics Class
class Analytics {
  private isInitialized = false;

  constructor(config: any = {}) {
    this.init();
  }

  private init() {
    this.isInitialized = true;
  }

  setUserId(userId: string) {
    // Mock implementation
  }

  trackPageView() {
    // Mock implementation
  }

  trackUserAction(action: string, elementType: string, interactionType: string, options: any = {}) {
    // Mock implementation
  }

  trackPerformance(metricName: string, metricValue: number, metricUnit: string, status: string, threshold?: number) {
    // Mock implementation
  }

  trackError(errorType: string, errorMessage: string, severity: string, userImpact: string, options: any = {}) {
    // Mock implementation
  }

  trackBusiness(businessAction: string, category: string, value?: number, currency?: string, properties?: Record<string, any>) {
    // Mock implementation
  }

  trackAccessibility(feature: string, action: string, impact: string, previousValue?: any, newValue?: any) {
    // Mock implementation
  }

  trackSecurity(action: string, riskLevel: string, threatType?: string, options: any = {}) {
    // Mock implementation
  }

  async flushEvents() {
    // Mock implementation
  }

  getQueueStatus() {
    return { queueLength: 0, isFlushing: false };
  }

  updateConfig(newConfig: any) {
    // Mock implementation
  }

  destroy() {
    // Mock implementation
  }
}

// Create and export analytics instance
const analytics = new Analytics();

export default analytics;
export { Analytics };

// Convenience functions
export const trackPageView = () => analytics.trackPageView();
export const trackUserAction = (action: string, elementType: string, interactionType: string, options?: any) => 
  analytics.trackUserAction(action, elementType, interactionType, options);
export const trackPerformance = (metricName: string, metricValue: number, metricUnit: string, status: string, threshold?: number) => 
  analytics.trackPerformance(metricName, metricValue, metricUnit, status, threshold);
export const trackError = (errorType: string, errorMessage: string, severity: string, userImpact: string, options?: any) => 
  analytics.trackError(errorType, errorMessage, severity, userImpact, options);
export const trackBusiness = (businessAction: string, category: string, value?: number, currency?: string, properties?: Record<string, any>) => 
  analytics.trackBusiness(businessAction, category, value, currency, properties);
export const trackAccessibility = (feature: string, action: string, impact: string, previousValue?: any, newValue?: any) => 
  analytics.trackAccessibility(feature, action, impact, previousValue, newValue);
export const trackSecurity = (action: string, riskLevel: string, threatType?: string, options?: any) => 
  analytics.trackSecurity(action, riskLevel, threatType, options);