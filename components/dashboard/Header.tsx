import React, { useState, Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon, Bars3Icon, UserCircleIcon, Cog8ToothIcon, ArrowRightOnRectangleIcon, ChevronDoubleLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const DiamondIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current" strokeWidth="1.5">
        <path d="M12 2L2 8.5L12 22L22 8.5L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

interface HeaderProps {
    onMenuClick: () => void;
    onCollapseToggle: () => void;
    isSidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, onCollapseToggle, isSidebarCollapsed }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const userInitials = user?.user_metadata?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || user?.email?.[0].toUpperCase() || 'U';

  return (
    <header className="relative z-10 flex-shrink-0 flex h-16 bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-md border-b border-gray-200 dark:border-white/10">
      <div className="flex-1 px-4 flex justify-between">
        <div className="flex items-center">
            {/* Mobile menu button */}
            <button
                type="button"
                className="p-2 mr-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-pink md:hidden"
                onClick={onMenuClick}
            >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          
            {/* Desktop sidebar toggle */}
            <button
                type="button"
                className="hidden md:inline-flex p-2 mr-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-pink"
                onClick={onCollapseToggle}>
                <span className="sr-only">Toggle sidebar</span>
                <ChevronDoubleLeftIcon className={`h-6 w-6 transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : ''}`}/>
            </button>
          <Link to="/dashboard" className="flex-shrink-0 flex items-center text-pink">
            <DiamondIcon />
            <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white hidden sm:inline">Together Apart</span>
          </Link>
        </div>
        <div className="ml-4 flex items-center md:ml-6">
          <button
            type="button"
            className="p-1 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-pink"
          >
            <span className="sr-only">View notifications</span>
            <div className="relative">
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-green ring-2 ring-white dark:ring-black" />
            </div>
          </button>

          {/* Profile dropdown */}
          <div className="ml-3 relative">
            <div>
              <button
                type="button"
                className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-pink"
                id="user-menu-button"
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-pink/20 flex items-center justify-center">
                    <span className="font-bold text-pink">{userInitials}</span>
                </div>
              </button>
            </div>
            {userMenuOpen && (
              <div
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-[#2f2828] ring-1 ring-black/5 dark:ring-white/10 focus:outline-none"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <div className="p-2 border-b border-white/10">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{user?.user_metadata?.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                </div>
                <div className="py-1">
                  <Link to="/dashboard/settings" role="menuitem" className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10" onClick={() => setUserMenuOpen(false)}>
                      <Cog8ToothIcon className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400"/> Settings
                  </Link>
                  <button onClick={handleLogout} role="menuitem" className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10">
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-gray-500 dark:text-gray-400"/> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;