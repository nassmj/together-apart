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
      className="header"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {showMenuButton && (
          <motion.button
            className="p-2 rounded-lg hover:bg-surface-alt transition-colors lg:hidden"
            onClick={onMenuToggle}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Open navigation menu"
            aria-expanded="false"
            aria-controls="sidebar-navigation"
          >
            <Bars3Icon className="w-6 h-6 text-text-secondary" />
          </motion.button>
        )}
        
        <h1 className="header-title">{title}</h1>
      </div>

      {/* Center Section - Search */}
      <div className="hidden md:block flex-1 max-w-md mx-8">
        <div className="search-bar">
          <MagnifyingGlassIcon className="search-icon w-5 h-5" />
          <input
            type="text"
            placeholder="Search memories, plans, or activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
            aria-label="Search"
            role="searchbox"
          />
        </div>
      </div>

      {/* Right Section - Actions */}
      <div className="header-actions">
        {/* Notifications */}
        <motion.button
          className="relative p-2 rounded-lg hover:bg-surface-alt transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Notifications"
        >
          <BellIcon className="w-6 h-6 text-text-secondary" />
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white" aria-label="3 new notifications"></span>
        </motion.button>

        {/* User Profile */}
        <motion.button
          className="flex items-center gap-2 p-2 rounded-lg hover:bg-surface-alt transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label="User profile menu"
        >
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">N</span>
          </div>
          <span className="hidden sm:block text-sm font-medium text-text-primary">
            Nasser
          </span>
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;