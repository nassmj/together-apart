import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BellIcon, ClockIcon, CalendarIcon, HeartIcon, StarIcon, MusicalNoteIcon } from '@heroicons/react/24/outline';

interface NotificationPreference {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  enabled: boolean;
  category: 'daily' | 'activity' | 'social' | 'reminder';
}

interface NotificationSchedule {
  dailyReminder: string;
  weeklyInsights: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface NotificationPreferencesProps {
  onPreferencesChange: (preferences: NotificationPreference[]) => void;
  onScheduleChange: (schedule: NotificationSchedule) => void;
  initialPreferences?: NotificationPreference[];
  initialSchedule?: NotificationSchedule;
  className?: string;
}

const defaultPreferences: NotificationPreference[] = [
  {
    id: 'daily-connection',
    title: 'Daily Connection Reminders',
    description: 'Get reminded to answer your daily connection question',
    icon: HeartIcon,
    enabled: true,
    category: 'daily',
  },
  {
    id: 'activity-reminders',
    title: 'Activity Reminders',
    description: 'Get notified about upcoming activities and events',
    icon: CalendarIcon,
    enabled: true,
    category: 'activity',
  },
  {
    id: 'partner-activity',
    title: 'Partner Activity',
    description: 'Get notified when your partner adds memories or activities',
    icon: StarIcon,
    enabled: true,
    category: 'social',
  },
  {
    id: 'quest-updates',
    title: 'Quest Progress',
    description: 'Get updates on quest progress and achievements',
    icon: StarIcon,
    enabled: true,
    category: 'activity',
  },
  {
    id: 'discovery-share',
    title: 'Discovery Sharing',
    description: 'Get notified when your partner shares new discoveries',
    icon: MusicalNoteIcon,
    enabled: true,
    category: 'social',
  },
  {
    id: 'weekly-insights',
    title: 'Weekly Insights',
    description: 'Receive weekly relationship insights and tips',
    icon: BellIcon,
    enabled: false,
    category: 'reminder',
  },
  {
    id: 'memory-anniversary',
    title: 'Memory Anniversaries',
    description: 'Get reminded of special memories on their anniversaries',
    icon: HeartIcon,
    enabled: true,
    category: 'reminder',
  },
  {
    id: 'achievement-celebration',
    title: 'Achievement Celebrations',
    description: 'Celebrate relationship milestones and achievements',
    icon: StarIcon,
    enabled: true,
    category: 'social',
  },
];

const defaultSchedule: NotificationSchedule = {
  dailyReminder: '20:00',
  weeklyInsights: true,
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00',
  },
};

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({
  onPreferencesChange,
  onScheduleChange,
  initialPreferences = defaultPreferences,
  initialSchedule = defaultSchedule,
  className = '',
}) => {
  const [preferences, setPreferences] = useState<NotificationPreference[]>(initialPreferences);
  const [schedule, setSchedule] = useState<NotificationSchedule>(initialSchedule);
  const [activeTab, setActiveTab] = useState<'preferences' | 'schedule'>('preferences');

  useEffect(() => {
    onPreferencesChange(preferences);
  }, [preferences, onPreferencesChange]);

  useEffect(() => {
    onScheduleChange(schedule);
  }, [schedule, onScheduleChange]);

  const togglePreference = (id: string) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const updateSchedule = (updates: Partial<NotificationSchedule>) => {
    setSchedule(prev => ({ ...prev, ...updates }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily':
        return '🌅';
      case 'activity':
        return '🎯';
      case 'social':
        return '💬';
      case 'reminder':
        return '⏰';
      default:
        return '🔔';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'daily':
        return 'text-blue-600 dark:text-blue-400';
      case 'activity':
        return 'text-green';
      case 'social':
        return 'text-pink';
      case 'reminder':
        return 'text-yellow-600 dark:text-yellow-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const groupedPreferences = preferences.reduce((acc, pref) => {
    if (!acc[pref.category]) {
      acc[pref.category] = [];
    }
    acc[pref.category].push(pref);
    return acc;
  }, {} as Record<string, NotificationPreference[]>);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green/10 rounded-lg flex items-center justify-center">
            <BellIcon className="h-6 w-6 text-green" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Notification Preferences</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Customize how and when you receive notifications</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => setActiveTab('preferences')}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'preferences'
              ? 'text-green border-b-2 border-green'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Notifications
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'schedule'
              ? 'text-green border-b-2 border-green'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          Schedule
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'preferences' ? (
          <div className="space-y-6">
            {Object.entries(groupedPreferences).map(([category, prefs]) => (
              <div key={category} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getCategoryIcon(category)}</span>
                  <h3 className={`font-semibold capitalize ${getCategoryColor(category)}`}>
                    {category} Notifications
                  </h3>
                </div>
                
                <div className="space-y-3">
                  {prefs.map((preference) => (
                    <motion.div
                      key={preference.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center">
                          <preference.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {preference.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {preference.description}
                          </p>
                        </div>
                      </div>
                      
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preference.enabled}
                          onChange={() => togglePreference(preference.id)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green"></div>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Daily Reminder Time */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-green" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Daily Reminder Time</h3>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="time"
                  value={schedule.dailyReminder}
                  onChange={(e) => updateSchedule({ dailyReminder: e.target.value })}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  When to remind you about daily connections
                </span>
              </div>
            </div>

            {/* Weekly Insights */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-green" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Weekly Insights</h3>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Weekly Relationship Insights</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Receive weekly insights and tips for your relationship
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={schedule.weeklyInsights}
                    onChange={(e) => updateSchedule({ weeklyInsights: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green"></div>
                </label>
              </div>
            </div>

            {/* Quiet Hours */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-green" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Quiet Hours</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Enable Quiet Hours</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Pause notifications during specific hours
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={schedule.quietHours.enabled}
                      onChange={(e) => updateSchedule({
                        quietHours: { ...schedule.quietHours, enabled: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green"></div>
                  </label>
                </div>

                {schedule.quietHours.enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <span className="text-sm text-gray-600 dark:text-gray-400">From:</span>
                    <input
                      type="time"
                      value={schedule.quietHours.start}
                      onChange={(e) => updateSchedule({
                        quietHours: { ...schedule.quietHours, start: e.target.value }
                      })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent"
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">To:</span>
                    <input
                      type="time"
                      value={schedule.quietHours.end}
                      onChange={(e) => updateSchedule({
                        quietHours: { ...schedule.quietHours, end: e.target.value }
                      })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent"
                    />
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};





