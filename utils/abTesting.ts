export interface ABTest {
  id: string;
  name: string;
  description: string;
  variants: ABVariant[];
  trafficSplit: number; // Percentage of users to include in test (0-100)
  startDate: string;
  endDate?: string;
  isActive: boolean;
  metrics: string[];
}

export interface ABVariant {
  id: string;
  name: string;
  weight: number; // Percentage of traffic for this variant (0-100)
  config: Record<string, any>;
}

export interface ABTestResult {
  testId: string;
  variantId: string;
  userId: string;
  timestamp: number;
}

export interface ABTestMetrics {
  testId: string;
  variantId: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
  averageSessionDuration: number;
  bounceRate: number;
}

class ABTesting {
  private tests: Map<string, ABTest> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map(); // userId -> testId -> variantId
  private results: ABTestResult[] = [];
  private isEnabled: boolean = true;

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultTests();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('together-apart-ab-tests');
      if (stored) {
        const data = JSON.parse(stored);
        this.userAssignments = new Map(data.userAssignments || []);
        this.results = data.results || [];
      }
    } catch (error) {
      console.warn('Failed to load A/B test data from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        userAssignments: Array.from(this.userAssignments.entries()),
        results: this.results.slice(-1000), // Keep last 1000 results
      };
      localStorage.setItem('together-apart-ab-tests', JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save A/B test data to storage:', error);
    }
  }

  private initializeDefaultTests(): void {
    // Onboarding flow test
    this.addTest({
      id: 'onboarding-flow',
      name: 'Onboarding Flow Optimization',
      description: 'Testing different onboarding flows to improve user engagement',
      variants: [
        {
          id: 'control',
          name: 'Current Flow',
          weight: 50,
          config: {
            steps: ['welcome', 'partner-connection', 'preferences', 'first-activity'],
            showProgressBar: true,
            allowSkip: true,
          },
        },
        {
          id: 'simplified',
          name: 'Simplified Flow',
          weight: 50,
          config: {
            steps: ['welcome', 'partner-connection', 'first-activity'],
            showProgressBar: false,
            allowSkip: false,
          },
        },
      ],
      trafficSplit: 100,
      startDate: new Date().toISOString(),
      isActive: true,
      metrics: ['onboarding_completion', 'time_to_complete', 'user_retention'],
    });

    // Daily connection question style test
    this.addTest({
      id: 'daily-connection-style',
      name: 'Daily Connection Question Style',
      description: 'Testing different question styles for daily connections',
      variants: [
        {
          id: 'control',
          name: 'Standard Questions',
          weight: 50,
          config: {
            questionStyle: 'standard',
            questionLength: 'medium',
            includeFollowUp: false,
          },
        },
        {
          id: 'conversational',
          name: 'Conversational Questions',
          weight: 50,
          config: {
            questionStyle: 'conversational',
            questionLength: 'long',
            includeFollowUp: true,
          },
        },
      ],
      trafficSplit: 80,
      startDate: new Date().toISOString(),
      isActive: true,
      metrics: ['answer_rate', 'answer_length', 'engagement_score'],
    });

    // Memory creation interface test
    this.addTest({
      id: 'memory-creation-interface',
      name: 'Memory Creation Interface',
      description: 'Testing different interfaces for memory creation',
      variants: [
        {
          id: 'control',
          name: 'Standard Form',
          weight: 50,
          config: {
            layout: 'form',
            imageUpload: 'separate',
            tags: 'manual',
          },
        },
        {
          id: 'guided',
          name: 'Guided Creation',
          weight: 50,
          config: {
            layout: 'guided',
            imageUpload: 'integrated',
            tags: 'suggested',
          },
        },
      ],
      trafficSplit: 60,
      startDate: new Date().toISOString(),
      isActive: true,
      metrics: ['creation_completion', 'time_to_create', 'memory_quality'],
    });
  }

  addTest(test: ABTest): void {
    this.tests.set(test.id, test);
  }

  getTest(testId: string): ABTest | undefined {
    return this.tests.get(testId);
  }

  getAllTests(): ABTest[] {
    return Array.from(this.tests.values());
  }

  getActiveTests(): ABTest[] {
    return Array.from(this.tests.values()).filter(test => test.isActive);
  }

  assignUserToTest(userId: string, testId: string): string | null {
    if (!this.isEnabled) return null;

    const test = this.tests.get(testId);
    if (!test || !test.isActive) return null;

    // Check if user is already assigned
    const userTests = this.userAssignments.get(userId) || new Map();
    if (userTests.has(testId)) {
      return userTests.get(testId) || null;
    }

    // Determine if user should be included in test
    const userHash = this.hashUserId(userId);
    const shouldInclude = (userHash % 100) < test.trafficSplit;

    if (!shouldInclude) {
      return null;
    }

    // Assign user to variant based on weights
    const variant = this.selectVariant(test.variants, userHash);
    
    // Store assignment
    userTests.set(testId, variant.id);
    this.userAssignments.set(userId, userTests);
    this.saveToStorage();

    return variant.id;
  }

  getUserVariant(userId: string, testId: string): string | null {
    if (!this.isEnabled) return null;

    const userTests = this.userAssignments.get(userId);
    if (!userTests) return null;

    return userTests.get(testId) || null;
  }

  getVariantConfig(userId: string, testId: string): Record<string, any> | null {
    const variantId = this.getUserVariant(userId, testId);
    if (!variantId) return null;

    const test = this.tests.get(testId);
    if (!test) return null;

    const variant = test.variants.find(v => v.id === variantId);
    return variant?.config || null;
  }

  recordImpression(userId: string, testId: string): void {
    if (!this.isEnabled) return;

    const variantId = this.getUserVariant(userId, testId);
    if (!variantId) return;

    this.results.push({
      testId,
      variantId,
      userId,
      timestamp: Date.now(),
    });

    this.saveToStorage();
  }

  recordConversion(userId: string, testId: string, conversionType: string): void {
    if (!this.isEnabled) return;

    const variantId = this.getUserVariant(userId, testId);
    if (!variantId) return;

    // In a real implementation, you would track conversion metrics
    // For now, we'll just log the conversion
    if (import.meta.env.DEV) {
      console.log('A/B Test Conversion:', {
        testId,
        variantId,
        userId,
        conversionType,
        timestamp: new Date().toISOString(),
      });
    }
  }

  getTestResults(testId: string): ABTestMetrics[] {
    const test = this.tests.get(testId);
    if (!test) return [];

    const testResults = this.results.filter(result => result.testId === testId);
    const metrics: ABTestMetrics[] = [];

    for (const variant of test.variants) {
      const variantResults = testResults.filter(result => result.variantId === variant.id);
      const impressions = variantResults.length;
      const conversions = variantResults.length; // Simplified - in real implementation, you'd track actual conversions
      const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;

      metrics.push({
        testId,
        variantId: variant.id,
        impressions,
        conversions,
        conversionRate,
        averageSessionDuration: 0, // Would be calculated from actual session data
        bounceRate: 0, // Would be calculated from actual session data
      });
    }

    return metrics;
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  private selectVariant(variants: ABVariant[], userHash: number): ABVariant {
    const hashMod = userHash % 100;
    let cumulativeWeight = 0;

    for (const variant of variants) {
      cumulativeWeight += variant.weight;
      if (hashMod < cumulativeWeight) {
        return variant;
      }
    }

    // Fallback to first variant
    return variants[0];
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  clearResults(): void {
    this.results = [];
    this.saveToStorage();
  }

  // Helper methods for common test scenarios
  isUserInTest(userId: string, testId: string): boolean {
    return this.getUserVariant(userId, testId) !== null;
  }

  getTestConfig(userId: string, testId: string, key: string): any {
    const config = this.getVariantConfig(userId, testId);
    return config?.[key];
  }

  // Export test data
  exportTestData(): {
    tests: ABTest[];
    userAssignments: Map<string, Map<string, string>>;
    results: ABTestResult[];
  } {
    return {
      tests: Array.from(this.tests.values()),
      userAssignments: this.userAssignments,
      results: [...this.results],
    };
  }
}

// Create singleton instance
export const abTesting = new ABTesting();

// Export convenience functions
export const assignUserToTest = (userId: string, testId: string): string | null =>
  abTesting.assignUserToTest(userId, testId);

export const getUserVariant = (userId: string, testId: string): string | null =>
  abTesting.getUserVariant(userId, testId);

export const getVariantConfig = (userId: string, testId: string): Record<string, any> | null =>
  abTesting.getVariantConfig(userId, testId);

export const recordImpression = (userId: string, testId: string): void =>
  abTesting.recordImpression(userId, testId);

export const recordConversion = (userId: string, testId: string, conversionType: string): void =>
  abTesting.recordConversion(userId, testId, conversionType);

export const isUserInTest = (userId: string, testId: string): boolean =>
  abTesting.isUserInTest(userId, testId);

export const getTestConfig = (userId: string, testId: string, key: string): any =>
  abTesting.getTestConfig(userId, testId, key);
