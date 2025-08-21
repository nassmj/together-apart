import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Cog8ToothIcon, ChevronDoubleLeftIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Connection History', href: '/dashboard/daily-connection', icon: '📜' },
  { name: 'Memory Timeline', href: '/dashboard/timeline', icon: '📅' },
  { name: 'Activity Planner', href: '/dashboard/planner', icon: '🎯' },
  { name: 'Growth Hub', href: '/dashboard/growth-hub', icon: '🌱' },
  { name: 'Discovery Exchange', href: '/dashboard/discovery', icon: '🎵' },
];

interface SidebarProps {
  isCollapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setCollapsed }) => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
      isActive
        ? 'bg-green text-black font-bold'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white'
    } ${isCollapsed ? 'justify-center' : ''}`;

  return (
    <div
      className={`hidden md:flex md:flex-shrink-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      <div className="flex flex-col w-full">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 dark:border-white/10 bg-white dark:bg-black">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              <NavLink to="/dashboard" className={navLinkClasses} end>
                  <span className={`text-xl ${isCollapsed ? '' : 'mr-4'}`}>🏠</span>
                  {!isCollapsed && <span className="truncate">Dashboard</span>}
              </NavLink>
              {navigation.map((item) => (
                <NavLink key={item.name} to={item.href} className={navLinkClasses}>
                  <span className={`text-xl ${isCollapsed ? '' : 'mr-4'}`}>{item.icon}</span>
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </NavLink>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 dark:border-white/10 p-4">
            <div className="flex-shrink-0 w-full group block">
                <div className="flex items-center">
                    <Link to="/dashboard/settings" className={`w-full group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white ${isCollapsed ? 'justify-center' : ''}`}>
                         <Cog8ToothIcon className={`h-6 w-6 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-400 ${isCollapsed ? '' : 'mr-3'}`} />
                         {!isCollapsed && <span className="truncate">Settings</span>}
                    </Link>
                    <button onClick={() => setCollapsed(!isCollapsed)} className="ml-2 p-1 rounded-full hover:bg-gray-200/50 dark:hover:bg-white/10">
                        <ChevronDoubleLeftIcon className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;