import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  BellIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface HeaderProps {
  title?: string;
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  title = "Dashboard", 
  onMenuToggle,
  showMenuButton = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <motion.header
      className="bg-surface border-b border-border-light px-6 py-4 shadow-sm"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <motion.button
              className="p-2 rounded-lg hover:bg-surface-alt transition-colors lg:hidden"
              onClick={onMenuToggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bars3Icon className="w-6 h-6 text-text-secondary" />
            </motion.button>
          )}
          
          <h1 className="text-2xl font-bold text-text-primary">{title}</h1>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:block flex-1 max-w-md mx-8">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-surface-alt text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <motion.button
            className="relative p-2 rounded-lg hover:bg-surface-alt transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BellIcon className="w-6 h-6 text-text-secondary" />
            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white"></span>
          </motion.button>

          {/* User Profile */}
          <motion.button
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-alt transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">N</span>
            </div>
            <span className="hidden sm:block text-sm font-medium text-text-primary">
              Nasser
            </span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;