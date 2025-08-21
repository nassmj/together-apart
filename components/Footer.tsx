import React from 'react';

const DiamondIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="stroke-current" strokeWidth="1.5">
        <path d="M12 2L2 8.5L12 22L22 8.5L12 2Z" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-black">
      <div className="mx-auto max-w-7xl py-8 px-4 sm:px-6 lg:px-8 border-t border-gray-200 dark:border-white/10">
        <div className="flex flex-col items-center justify-between gap-y-4 md:flex-row">
          <div className="flex items-center text-pink">
            <DiamondIcon />
            <span className="ml-2 text-base font-bold text-gray-900 dark:text-white">Together Apart</span>
          </div>
          <nav className="flex gap-x-6">
            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pink transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-500 dark:text-gray-400 hover:text-pink transition-colors">
              Terms of Service
            </a>
          </nav>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; 2025 Together Apart. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;