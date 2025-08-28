import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  HeartIcon,
  CalendarDaysIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon,
  FireIcon,
} from '@heroicons/react/24/outline';
import { analytics, UserMetrics, RelationshipInsights } from '../../utils/analytics';
import { abTesting } from '../../utils/abTesting';
import { realtime } from '../../utils/realtime';

interface AnalyticsDashboardProps {
  userId: string;
}

const MetricCard: React.FC<{
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, change, icon, color }) => (
  <motion.div
    className="card p-6"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-secondary">{title}</p>
        <p className="text-2xl font-bold text-primary mt-1">{value}</p>
        {change !== undefined && (
          <div className="flex items-center mt-2">
            {change >= 0 ? (
              <ArrowTrendingUpIcon className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {Math.abs(change)}% from last week
            </span>
          </div>
        )}
      </div>
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

const ProgressBar: React.FC<{ value: number; label: string; color: string }> = ({
  value,
  label,
  color,
}) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="text-sm font-medium text-secondary">{label}</span>
      <span className="text-sm text-primary">{value}%</span>
    </div>
    <div className="w-full bg-surface-alt rounded-full h-2">
      <div
        className={`h-2 rounded-full ${color}`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const ChartPlaceholder: React.FC<{ title: string; description: string }> = ({
  title,
  description,
}) => (
  <div className="card p-6">
    <h3 className="text-lg font-semibold text-primary mb-2">{title}</h3>
    <p className="text-secondary text-sm mb-4">{description}</p>
    <div className="w-full h-48 bg-surface-alt rounded-lg flex items-center justify-center">
      <ChartBarIcon className="w-12 h-12 text-muted" />
    </div>
  </div>
);

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ userId }) => {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [insights, setInsights] = useState<RelationshipInsights | null>(null);
  const [activeTests, setActiveTests] = useState<any[]>([]);
  const [realtimeStatus, setRealtimeStatus] = useState<any>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    // Set user ID for analytics
    analytics.setUserId(userId);

    // Load initial data
    loadAnalyticsData();
    loadABTestData();
    loadRealtimeData();

    // Set up real-time updates
    const unsubscribe = realtime.subscribe('*', (message) => {
      if (message.userId === userId) {
        loadAnalyticsData();
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const loadAnalyticsData = () => {
    const userMetrics = analytics.getUserMetrics();
    const relationshipInsights = analytics.getRelationshipInsights();
    
    setMetrics(userMetrics);
    setInsights(relationshipInsights);
  };

  const loadABTestData = () => {
    const tests = abTesting.getActiveTests();
    setActiveTests(tests);
  };

  const loadRealtimeData = () => {
    const status = realtime.getSystemStatus();
    setRealtimeStatus(status);
  };

  const getEngagementLevel = (score: number): { level: string; color: string; icon: React.ReactNode } => {
    if (score >= 80) return { level: 'Excellent', color: 'text-green-500', icon: <FireIcon className="w-5 h-5" /> };
    if (score >= 60) return { level: 'Good', color: 'text-blue-500', icon: <ArrowTrendingUpIcon className="w-5 h-5" /> };
    if (score >= 40) return { level: 'Fair', color: 'text-yellow-500', icon: <ClockIcon className="w-5 h-5" /> };
    return { level: 'Needs Attention', color: 'text-red-500', icon: <ArrowTrendingDownIcon className="w-5 h-5" /> };
  };

  const getRelationshipHealth = (score: number): { status: string; color: string } => {
    if (score >= 80) return { status: 'Thriving', color: 'text-green-500' };
    if (score >= 60) return { status: 'Strong', color: 'text-blue-500' };
    if (score >= 40) return { status: 'Growing', color: 'text-yellow-500' };
    return { status: 'Needs Care', color: 'text-red-500' };
  };

  if (!metrics || !insights) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const engagement = getEngagementLevel(metrics.engagementScore);
  const relationshipHealth = getRelationshipHealth(insights.overallHealth);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Analytics Dashboard</h1>
          <p className="text-secondary mt-1">
            Insights into your relationship journey and app usage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | '90d')}
            className="input input-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Memories"
          value={metrics.totalMemories}
          change={12}
          icon={<HeartIcon className="w-6 h-6 text-white" />}
          color="bg-primary"
        />
        <MetricCard
          title="Daily Connections"
          value={metrics.totalConnections}
          change={8}
          icon={<CalendarDaysIcon className="w-6 h-6 text-white" />}
          color="bg-secondary"
        />
        <MetricCard
          title="Activities Planned"
          value={metrics.totalActivities}
          change={-3}
          icon={<TrophyIcon className="w-6 h-6 text-white" />}
          color="bg-accent"
        />
        <MetricCard
          title="Current Streak"
          value={`${metrics.streakDays} days`}
          change={15}
          icon={<FireIcon className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />
      </div>

      {/* Relationship Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-primary">Relationship Health</h2>
            <span className={`text-lg font-semibold ${relationshipHealth.color}`}>
              {relationshipHealth.status}
            </span>
          </div>
          
          <div className="space-y-4">
            <ProgressBar
              value={insights.communicationFrequency}
              label="Communication Frequency"
              color="bg-blue-500"
            />
            <ProgressBar
              value={insights.activityDiversity}
              label="Activity Diversity"
              color="bg-green-500"
            />
            <ProgressBar
              value={insights.memoryGrowth}
              label="Memory Growth"
              color="bg-purple-500"
            />
            <ProgressBar
              value={insights.connectionStrength}
              label="Connection Strength"
              color="bg-orange-500"
            />
          </div>

          <div className="mt-6 p-4 bg-surface-alt rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary">Overall Health Score</span>
              <span className={`text-2xl font-bold ${relationshipHealth.color}`}>
                {insights.overallHealth}/100
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-primary">Engagement Overview</h2>
            <div className="flex items-center gap-2">
              {engagement.icon}
              <span className={`font-semibold ${engagement.color}`}>
                {engagement.level}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-secondary">Engagement Score</span>
              <span className="text-lg font-semibold text-primary">
                {metrics.engagementScore}/100
              </span>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-primary">Favorite Features</h4>
              {metrics.favoriteFeatures.length > 0 ? (
                <div className="space-y-2">
                  {metrics.favoriteFeatures.map((feature, index) => (
                    <div key={feature} className="flex items-center justify-between">
                      <span className="text-sm text-secondary">{feature}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-surface-alt rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${100 - index * 20}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted">{100 - index * 20}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted">No feature usage data yet</p>
              )}
            </div>

            <div className="mt-4 p-3 bg-surface-alt rounded-lg">
              <div className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-muted" />
                <span className="text-sm text-secondary">
                  Last active: {new Date(metrics.lastActiveDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartPlaceholder
          title="Activity Trends"
          description="Your relationship activity over time"
        />
        <ChartPlaceholder
          title="Feature Usage"
          description="How you use different app features"
        />
      </div>

      {/* A/B Testing Status */}
      {activeTests.length > 0 && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Active Experiments</h2>
          <div className="space-y-4">
            {activeTests.map((test) => (
              <div key={test.id} className="flex items-center justify-between p-4 bg-surface-alt rounded-lg">
                <div>
                  <h3 className="font-medium text-primary">{test.name}</h3>
                  <p className="text-sm text-secondary">{test.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-secondary">Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Status */}
      {realtimeStatus && (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">System Status</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{realtimeStatus.listeners}</div>
              <div className="text-sm text-secondary">Active Listeners</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{realtimeStatus.typingIndicators}</div>
              <div className="text-sm text-secondary">Typing Indicators</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{realtimeStatus.presenceStatus}</div>
              <div className="text-sm text-secondary">Presence Status</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${realtimeStatus.enabled ? 'text-green-500' : 'text-red-500'}`}>
                {realtimeStatus.enabled ? 'Online' : 'Offline'}
              </div>
              <div className="text-sm text-secondary">Realtime Status</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
