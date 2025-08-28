export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  properties?: Record<string, any>;
  timestamp: number;
  userId?: string;
  sessionId: string;
}

export interface UserMetrics {
  totalMemories: number;
  totalConnections: number;
  totalActivities: number;
  streakDays: number;
  lastActiveDate: string;
  favoriteFeatures: string[];
  engagementScore: number;
}

export interface RelationshipInsights {
  communicationFrequency: number;
  activityDiversity: number;
  memoryGrowth: number;
  connectionStrength: number;
  overallHealth: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId?: string;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadFromStorage();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const stored = localStorage.getItem('together-apart-analytics');
        if (stored) {
          const data = JSON.parse(stored);
          this.events = data.events || [];
          this.sessionId = data.sessionId || this.sessionId;
          this.userId = data.userId;
        }
      }
    } catch (error) {
      console.warn('Failed to load analytics from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const data = {
          events: this.events.slice(-1000), // Keep last 1000 events
          sessionId: this.sessionId,
          userId: this.userId,
        };
        localStorage.setItem('together-apart-analytics', JSON.stringify(data));
      }
    } catch (error) {
      console.warn('Failed to save analytics to storage:', error);
    }
  }

  setUserId(userId: string): void {
    this.userId = userId;
    this.saveToStorage();
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  track(
    event: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    properties?: Record<string, any>
  ): void {
    if (!this.isEnabled) return;

    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      action,
      label,
      value,
      properties,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
    };

    this.events.push(analyticsEvent);
    this.saveToStorage();

    // In production, you would send this to your analytics service
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', analyticsEvent);
    }
  }

  // Relationship-specific tracking methods
  trackMemoryCreated(memoryType: string, hasImage: boolean): void {
    this.track('memory_created', 'memories', 'create', memoryType, 1, {
      hasImage,
      timestamp: new Date().toISOString(),
    });
  }

  trackDailyConnectionAnswered(questionType: string): void {
    this.track('daily_connection_answered', 'connections', 'answer', questionType, 1);
  }

  trackActivityPlanned(activityType: string, category: string): void {
    this.track('activity_planned', 'activities', 'plan', activityType, 1, {
      category,
    });
  }

  trackQuestCompleted(questType: string, difficulty: string): void {
    this.track('quest_completed', 'growth', 'complete', questType, 1, {
      difficulty,
    });
  }

  trackPageView(page: string): void {
    this.track('page_view', 'navigation', 'view', page, 1);
  }

  trackFeatureUsed(feature: string): void {
    this.track('feature_used', 'engagement', 'use', feature, 1);
  }

  trackError(error: string, context: string): void {
    this.track('error', 'system', 'error', error, 1, {
      context,
    });
  }

  // Analytics methods
  getUserMetrics(): UserMetrics {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const recentEvents = this.events.filter(
      event => event.timestamp > thirtyDaysAgo.getTime()
    );

    const memoryEvents = recentEvents.filter(
      event => event.category === 'memories' && event.action === 'create'
    );

    const connectionEvents = recentEvents.filter(
      event => event.category === 'connections' && event.action === 'answer'
    );

    const activityEvents = recentEvents.filter(
      event => event.category === 'activities' && event.action === 'plan'
    );

    // Calculate engagement score (0-100)
    const totalEvents = recentEvents.length;
    const engagementScore = Math.min(100, Math.max(0, totalEvents * 2));

    // Get favorite features
    const featureUsage = recentEvents
      .filter(event => event.category === 'engagement')
      .reduce((acc, event) => {
        const feature = event.label || 'unknown';
        acc[feature] = (acc[feature] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const favoriteFeatures = Object.entries(featureUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([feature]) => feature);

    // Calculate streak days
    const connectionDates = connectionEvents.map(event => 
      new Date(event.timestamp).toDateString()
    );
    const uniqueDates = [...new Set(connectionDates)];
    const streakDays = this.calculateStreakDays(uniqueDates);

    return {
      totalMemories: memoryEvents.length,
      totalConnections: connectionEvents.length,
      totalActivities: activityEvents.length,
      streakDays,
      lastActiveDate: recentEvents.length > 0 
        ? new Date(recentEvents[recentEvents.length - 1].timestamp).toISOString()
        : now.toISOString(),
      favoriteFeatures,
      engagementScore,
    };
  }

  getRelationshipInsights(): RelationshipInsights {
    const metrics = this.getUserMetrics();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentEvents = this.events.filter(
      event => event.timestamp > sevenDaysAgo.getTime()
    );

    // Communication frequency (daily connections answered)
    const dailyConnections = recentEvents.filter(
      event => event.category === 'connections' && event.action === 'answer'
    );
    const communicationFrequency = Math.min(100, (dailyConnections.length / 7) * 100);

    // Activity diversity (different types of activities)
    const activities = recentEvents.filter(
      event => event.category === 'activities'
    );
    const activityTypes = new Set(activities.map(event => event.label));
    const activityDiversity = Math.min(100, activityTypes.size * 20);

    // Memory growth (memories created)
    const memories = recentEvents.filter(
      event => event.category === 'memories' && event.action === 'create'
    );
    const memoryGrowth = Math.min(100, (memories.length / 5) * 100);

    // Connection strength (based on streak and consistency)
    const connectionStrength = Math.min(100, metrics.streakDays * 10);

    // Overall health (weighted average)
    const overallHealth = Math.round(
      (communicationFrequency * 0.3 +
       activityDiversity * 0.2 +
       memoryGrowth * 0.2 +
       connectionStrength * 0.3)
    );

    return {
      communicationFrequency,
      activityDiversity,
      memoryGrowth,
      connectionStrength,
      overallHealth,
    };
  }

  private calculateStreakDays(dates: string[]): number {
    if (dates.length === 0) return 0;

    const sortedDates = dates
      .map(date => new Date(date))
      .sort((a, b) => b.getTime() - a.getTime());

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < sortedDates.length; i++) {
      const expectedDate = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const hasActivity = sortedDates.some(date => 
        date.getTime() === expectedDate.getTime()
      );

      if (hasActivity) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  // Export analytics data
  exportAnalytics(): AnalyticsEvent[] {
    return [...this.events];
  }

  // Clear analytics data
  clearAnalytics(): void {
    this.events = [];
    this.saveToStorage();
  }

  // Get analytics summary
  getAnalyticsSummary(): {
    totalEvents: number;
    sessionDuration: number;
    mostUsedFeatures: string[];
    errorCount: number;
  } {
    const totalEvents = this.events.length;
    const sessionDuration = this.events.length > 0 
      ? (this.events[this.events.length - 1].timestamp - this.events[0].timestamp) / 1000
      : 0;

    const featureUsage = this.events
      .filter(event => event.category === 'engagement')
      .reduce((acc, event) => {
        const feature = event.label || 'unknown';
        acc[feature] = (acc[feature] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const mostUsedFeatures = Object.entries(featureUsage)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([feature]) => feature);

    const errorCount = this.events.filter(
      event => event.category === 'system' && event.action === 'error'
    ).length;

    return {
      totalEvents,
      sessionDuration,
      mostUsedFeatures,
      errorCount,
    };
  }
}

// Create singleton instance
export const analytics = new Analytics();

// Export individual tracking functions for convenience
export const trackEvent = (
  event: string,
  category: string,
  action: string,
  label?: string,
  value?: number,
  properties?: Record<string, any>
) => analytics.track(event, category, action, label, value, properties);

export const trackMemoryCreated = (memoryType: string, hasImage: boolean) =>
  analytics.trackMemoryCreated(memoryType, hasImage);

export const trackDailyConnectionAnswered = (questionType: string) =>
  analytics.trackDailyConnectionAnswered(questionType);

export const trackActivityPlanned = (activityType: string, category: string) =>
  analytics.trackActivityPlanned(activityType, category);

export const trackQuestCompleted = (questType: string, difficulty: string) =>
  analytics.trackQuestCompleted(questType, difficulty);

export const trackPageView = (page: string) => analytics.trackPageView(page);

export const trackFeatureUsed = (feature: string) => analytics.trackFeatureUsed(feature);

export const trackError = (error: string, context: string) => analytics.trackError(error, context);
