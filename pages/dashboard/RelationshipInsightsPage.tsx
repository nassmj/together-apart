import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  HeartIcon,
  CalendarDaysIcon,
  TrophyIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { AnalyticsDashboard } from '../../components/analytics/AnalyticsDashboard';
import { useAuth } from '../../contexts/AuthContext';

// Insight Card Component
const InsightCard: React.FC<{ 
  title: string; 
  value: string; 
  change?: string; 
  icon: React.ComponentType<any>;
  color: string;
  description?: string;
}> = ({ title, value, change, icon: Icon, color, description }) => {
  return (
    <motion.div
      className="card hover:shadow-md transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-secondary mb-1">{title}</p>
          <p className="text-2xl font-bold text-primary">{value}</p>
          {change && (
            <div className="flex items-center gap-1 mt-1">
              <ArrowTrendingUpIcon className={`w-4 h-4 ${change.startsWith('+') ? 'text-success' : 'text-error'}`} />
              <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-success' : 'text-error'}`}>
                {change}
              </span>
            </div>
          )}
          {description && (
            <p className="text-xs text-muted mt-2">{description}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg bg-${color}-light flex items-center justify-center`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
      </div>
    </motion.div>
  );
};

// Progress Chart Component
const ProgressChart: React.FC<{ 
  title: string; 
  data: { label: string; value: number; color: string }[];
}> = ({ title, data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-semibold text-primary mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-secondary">{item.label}</span>
              <span className="text-sm text-primary">{item.value}%</span>
            </div>
            <div className="w-full bg-surface-alt rounded-full h-2">
              <div
                className={`h-2 rounded-full bg-${item.color}`}
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Milestone Component
const Milestone: React.FC<{ 
  title: string; 
  date: string; 
  description: string; 
  achieved: boolean;
}> = ({ title, date, description, achieved }) => {
  return (
    <motion.div
      className={`flex items-start gap-3 p-4 rounded-lg border ${
        achieved ? 'bg-success-light border-success' : 'bg-surface-alt border-border'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
        achieved ? 'bg-success text-white' : 'bg-muted text-muted'
      }`}>
        {achieved ? (
          <TrophyIcon className="w-4 h-4" />
        ) : (
          <ClockIcon className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-primary">{title}</h4>
        <p className="text-sm text-secondary mb-1">{date}</p>
        <p className="text-sm text-muted">{description}</p>
      </div>
    </motion.div>
  );
};

// Main Relationship Insights Component
const RelationshipInsightsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { user } = useAuth();

  // Sample insights data
  const insights = [
    {
      title: 'Communication Score',
      value: '8.5/10',
      change: '+0.3',
      icon: HeartIcon,
      color: 'primary',
      description: 'Based on daily interactions'
    },
    {
      title: 'Quality Time',
      value: '12.5h',
      change: '+2.1h',
      icon: ClockIcon,
      color: 'secondary',
      description: 'This week'
    },
    {
      title: 'Shared Activities',
      value: '8',
      change: '+3',
      icon: UserGroupIcon,
      color: 'accent',
      description: 'This month'
    },
    {
      title: 'Relationship Streak',
      value: '45 days',
      change: '+5 days',
      icon: FireIcon,
      color: 'warning',
      description: 'Daily connections'
    }
  ];

  const communicationData = [
    { label: 'Daily Check-ins', value: 85, color: 'primary' },
    { label: 'Deep Conversations', value: 65, color: 'secondary' },
    { label: 'Shared Laughter', value: 90, color: 'accent' },
    { label: 'Conflict Resolution', value: 75, color: 'success' }
  ];

  const activityData = [
    { label: 'Date Nights', value: 70, color: 'primary' },
    { label: 'Adventures', value: 45, color: 'secondary' },
    { label: 'Home Activities', value: 85, color: 'accent' },
    { label: 'Learning Together', value: 60, color: 'success' }
  ];

  const milestones = [
    {
      title: 'First Anniversary',
      date: 'December 15, 2024',
      description: 'Celebrated one year of love and growth together',
      achieved: true
    },
    {
      title: '100 Daily Connections',
      date: 'January 20, 2025',
      description: 'Reach 100 consecutive days of daily check-ins',
      achieved: false
    },
    {
      title: 'Travel Goal',
      date: 'March 10, 2025',
      description: 'Visit 5 new places together',
      achieved: false
    },
    {
      title: 'Communication Mastery',
      date: 'February 28, 2025',
      description: 'Achieve 9.0+ communication score for 30 days',
      achieved: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Relationship Insights</h1>
          <p className="text-secondary">
            Track your relationship health and celebrate your growth together
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="btn btn-primary"
          >
            {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
          </button>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Analytics Dashboard */}
      {showAnalytics && user && (
        <div className="mb-8">
          <AnalyticsDashboard userId={user.id} />
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight, index) => (
          <InsightCard
            key={index}
            title={insight.title}
            value={insight.value}
            change={insight.change}
            icon={insight.icon}
            color={insight.color}
            description={insight.description}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProgressChart
          title="Communication Patterns"
          data={communicationData}
        />
        <ProgressChart
          title="Activity Engagement"
          data={activityData}
        />
      </div>

      {/* Milestones Section */}
      <div>
        <h2 className="text-2xl font-bold text-primary mb-4">Relationship Milestones</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {milestones.map((milestone, index) => (
            <Milestone
              key={index}
              title={milestone.title}
              date={milestone.date}
              description={milestone.description}
              achieved={milestone.achieved}
            />
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <motion.div
        className="card bg-gradient-to-r from-primary-light to-secondary-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
            <SparklesIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-primary mb-2">Personalized Recommendations</h3>
            <div className="space-y-2">
              <p className="text-secondary">
                • Try a new activity together this weekend to boost your adventure score
              </p>
              <p className="text-secondary">
                • Schedule a deep conversation night to improve communication patterns
              </p>
              <p className="text-secondary">
                • Plan a surprise date to celebrate your upcoming milestone
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RelationshipInsightsPage;
