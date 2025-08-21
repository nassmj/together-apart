import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

const DiamondIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current" strokeWidth="1.5">
        <path d="M12 2L2 8.5L12 22L22 8.5L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-green text-black'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-900/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
    }`;
  
  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }): string =>
  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
    isActive
      ? 'bg-green text-black'
      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-900/5 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
  }`;

  return (
    <nav className="bg-white/70 dark:bg-black/70 backdrop-blur-md shadow-lg sticky top-0 z-30 border-b border-gray-200 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center text-pink">
              <DiamondIcon />
              <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">Together Apart</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={navLinkClasses}>
                Home
              </NavLink>
              <NavLink to="/login" className={navLinkClasses}>
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="ml-4 px-4 py-2 rounded-md text-sm font-bold text-black bg-green hover:bg-opacity-90 transition-colors"
              >
                Sign Up
              </NavLink>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="bg-gray-100/10 dark:bg-white/10 inline-flex items-center justify-center p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-200/20 dark:hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black focus:ring-pink"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={mobileNavLinkClasses} onClick={() => setIsOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/login" className={mobileNavLinkClasses} onClick={() => setIsOpen(false)}>
              Login
            </NavLink>
            <NavLink to="/signup" className={mobileNavLinkClasses} onClick={() => setIsOpen(false)}>
              Sign Up
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;