import React from 'react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
  { name: 'History', href: '/dashboard/daily-connection', icon: '📜' },
  { name: 'Timeline', href: '/dashboard/timeline', icon: '📅' },
  { name: 'Planner', href: '/dashboard/planner', icon: '🎯' },
  { name: 'Discovery', href: '/dashboard/discovery', icon: '🎵' },
  { name: 'Growth', href: '/dashboard/growth-hub', icon: '🌱' },
];

const BottomNav: React.FC = () => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors ${
      isActive ? 'text-green' : 'text-gray-500 dark:text-gray-400 hover:text-green'
    }`;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-md border-t border-gray-200 dark:border-white/10 shadow-lg z-20 flex">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={navLinkClasses}
          end={item.href === '/dashboard'}
        >
          <span className="text-2xl">{item.icon}</span>
          <span className="mt-1 truncate">{item.name}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNav;