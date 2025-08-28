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
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary text-white shadow-sm'
        : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary'
    }`;
  
  const mobileNavLinkClasses = ({ isActive }: { isActive: boolean }): string =>
    `block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary text-white'
        : 'text-text-secondary hover:bg-surface-alt hover:text-text-primary'
    }`;

  return (
    <nav className="bg-surface/80 backdrop-blur-md shadow-sm sticky top-0 z-30 border-b border-border-light">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-primary hover:scale-105 transition-transform">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <DiamondIcon />
              </div>
              <span className="ml-3 text-xl font-bold text-text-primary">Together Apart</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/login" className={navLinkClasses}>
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="ml-2 px-6 py-2 rounded-lg text-sm font-semibold text-white bg-primary hover:bg-primary-hover hover:scale-105 transition-all duration-200 shadow-sm"
            >
              Sign Up
            </NavLink>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              aria-controls="mobile-menu"
              aria-expanded={isOpen}
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
        <div className="md:hidden bg-surface border-t border-border-light" id="mobile-menu">
          <div className="px-4 py-3 space-y-2">
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