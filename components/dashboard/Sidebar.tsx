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

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
  const location = useLocation();

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
      className="sidebar"
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Logo Section */}
      <div className="p-6 border-b border-border-light">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <StarIcon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-primary">Together Apart</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Main Navigation */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-4">
            Main
          </h3>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.path}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    title={item.description}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-primary rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* More Navigation */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 px-4">
            More
          </h3>
          <div className="space-y-1">
            {moreNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.name}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.path}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    title={item.description}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                    {isActive && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-primary rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-auto pt-6 border-t border-border-light">
          <motion.button
            className="w-full sidebar-nav-item text-error hover:bg-error/10 hover:text-error"
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // Handle logout
              console.log('Logout clicked');
            }}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </motion.button>
        </div>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;