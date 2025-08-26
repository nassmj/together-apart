import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BellIcon,
  HeartIcon,
  CalendarDaysIcon,
  TrophyIcon,
  SparklesIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon,
  UserGroupIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Notification Item Component
const NotificationItem: React.FC<{
  id: string;
  type: 'memory' | 'activity' | 'quest' | 'connection' | 'reminder' | 'achievement';
  title: string;
  message: string;
  time: string;
  read: boolean;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ id, type, title, message, time, read, onMarkAsRead, onDelete }) => {
  const getTypeIcon = () => {
    switch (type) {
      case 'memory': return HeartIcon;
      case 'activity': return CalendarDaysIcon;
      case 'quest': return TrophyIcon;
      case 'connection': return UserGroupIcon;
      case 'reminder': return ClockIcon;
      case 'achievement': return SparklesIcon;
      default: return BellIcon;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case 'memory': return 'primary';
      case 'activity': return 'secondary';
      case 'quest': return 'accent';
      case 'connection': return 'info';
      case 'reminder': return 'warning';
      case 'achievement': return 'success';
      default: return 'muted';
    }
  };

  const Icon = getTypeIcon();
  const color = getTypeColor();

  return (
    <motion.div
      className={`card transition-all duration-200 cursor-pointer ${
        read ? 'opacity-60' : 'border-l-4 border-l-primary'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ y: -2 }}
      onClick={() => !read && onMarkAsRead(id)}
    >
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg bg-${color}-light flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-5 h-5 text-${color}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className={`font-semibold ${read ? 'text-secondary' : 'text-primary'}`}>
                {title}
              </h4>
              <p className="text-sm text-secondary mt-1">{message}</p>
              <p className="text-xs text-muted mt-2">{time}</p>
            </div>
            
            <div className="flex items-center gap-2 ml-4">
              {!read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(id);
                  }}
                  className="p-1 rounded-full hover:bg-surface-alt transition-colors"
                  title="Mark as read"
                >
                  <CheckIcon className="w-4 h-4 text-success" />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(id);
                }}
                className="p-1 rounded-full hover:bg-surface-alt transition-colors"
                title="Delete notification"
              >
                <XMarkIcon className="w-4 h-4 text-muted hover:text-error" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Notifications Component
const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'memory' as const,
      title: 'New Memory Shared',
      message: 'Your partner shared a new memory: "Sunset at Santorini"',
      time: '2 minutes ago',
      read: false
    },
    {
      id: '2',
      type: 'activity' as const,
      title: 'Upcoming Date Reminder',
      message: 'You have a romantic dinner planned tomorrow at 7:00 PM',
      time: '1 hour ago',
      read: false
    },
    {
      id: '3',
      type: 'quest' as const,
      title: 'Quest Completed!',
      message: 'Congratulations! You completed the "Daily Gratitude Ritual" quest',
      time: '3 hours ago',
      read: true
    },
    {
      id: '4',
      type: 'connection' as const,
      title: 'Daily Connection Available',
      message: 'Your partner answered today\'s question. Check it out!',
      time: '5 hours ago',
      read: false
    },
    {
      id: '5',
      type: 'reminder' as const,
      title: 'Weekly Check-in Due',
      message: 'Don\'t forget to complete your weekly relationship check-in',
      time: '1 day ago',
      read: true
    },
    {
      id: '6',
      type: 'achievement' as const,
      title: 'New Achievement Unlocked',
      message: 'You earned the "Communication Master" badge!',
      time: '2 days ago',
      read: true
    },
    {
      id: '7',
      type: 'memory' as const,
      title: 'Memory Anniversary',
      message: 'Today marks 1 year since your first date!',
      time: '3 days ago',
      read: true
    },
    {
      id: '8',
      type: 'activity' as const,
      title: 'Activity Suggestion',
      message: 'Based on your preferences, we suggest trying a cooking class together',
      time: '1 week ago',
      read: true
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedType, setSelectedType] = useState('all');

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== id)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         (filter === 'read' && notification.read);
    
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    
    return matchesFilter && matchesType;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Notifications</h1>
          <p className="text-secondary">
            Stay updated with your relationship activities and achievements
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="btn btn-ghost btn-sm"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-primary text-white' 
                : 'bg-surface-alt text-secondary hover:text-primary'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unread' 
                ? 'bg-primary text-white' 
                : 'bg-surface-alt text-secondary hover:text-primary'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'read' 
                ? 'bg-primary text-white' 
                : 'bg-surface-alt text-secondary hover:text-primary'
            }`}
          >
            Read ({notifications.length - unreadCount})
          </button>
        </div>
        
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="input"
        >
          <option value="all">All Types</option>
          <option value="memory">Memories</option>
          <option value="activity">Activities</option>
          <option value="quest">Quests</option>
          <option value="connection">Connections</option>
          <option value="reminder">Reminders</option>
          <option value="achievement">Achievements</option>
        </select>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                id={notification.id}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                time={notification.time}
                read={notification.read}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <BellIcon className="w-16 h-16 text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-primary mb-2">No notifications</h3>
              <p className="text-secondary">
                {filter === 'unread' 
                  ? 'You\'re all caught up! No unread notifications.'
                  : 'You\'ll see notifications here when there\'s activity in your relationship.'
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Notification Settings Preview */}
      <motion.div
        className="card bg-gradient-to-r from-secondary-light to-primary-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
            <BellIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-primary mb-2">Notification Preferences</h3>
            <p className="text-secondary mb-4">
              Customize which notifications you receive and when
            </p>
            <button className="btn btn-primary btn-sm">
              Manage Settings
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationsPage;
