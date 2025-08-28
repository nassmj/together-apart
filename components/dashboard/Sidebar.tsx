import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  HeartIcon,
  CalendarDaysIcon,
  TrophyIcon,
  SparklesIcon,
  ChartBarIcon,
  BellIcon,
  UserIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();
  const { signOut } = useAuth();

  const mainNavItems = [
    {
      name: 'Dashboard',
      icon: HomeIcon,
      path: '/dashboard',
      description: 'Your relationship overview'
    },
    {
      name: 'Memory Timeline',
      icon: HeartIcon,
      path: '/dashboard/timeline',
      description: 'Cherish your shared moments'
    },
    {
      name: 'Shared Plans',
      icon: CalendarDaysIcon,
      path: '/dashboard/planner',
      description: 'Plan your adventures together'
    },
    {
      name: 'Growth Hub',
      icon: TrophyIcon,
      path: '/dashboard/growth-hub',
      description: 'Grow together through challenges'
    },
    {
      name: 'Discovery',
      icon: SparklesIcon,
      path: '/dashboard/discovery',
      description: 'Discover new experiences'
    },
    {
      name: 'Relationship Insights',
      icon: ChartBarIcon,
      path: '/dashboard/insights',
      description: 'Track your relationship health'
    }
  ];

  const moreNavItems = [
    {
      name: 'Notifications',
      icon: BellIcon,
      path: '/dashboard/notifications',
      description: 'Stay updated'
    },
    {
      name: 'Profile',
      icon: UserIcon,
      path: '/dashboard/profile',
      description: 'Manage your account'
    },
    {
      name: 'Settings',
      icon: Cog6ToothIcon,
      path: '/dashboard/settings',
      description: 'Customize your experience'
    },
    {
      name: 'Help & Support',
      icon: QuestionMarkCircleIcon,
      path: '/dashboard/help',
      description: 'Get help when needed'
    }
  ];

  return (
    <motion.aside
      className="fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border-light shadow-lg"
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <Link to="/dashboard" className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <StarIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-text-primary">Together Apart</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Main
            </h3>
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* More Navigation */}
          <div className="space-y-1 pt-6 border-t border-border-light">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              More
            </h3>
            {moreNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border-light">
          <button
            onClick={signOut}
            className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:bg-surface-alt hover:text-text-primary transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;