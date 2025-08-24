import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Icons using emoji for simplicity
const HomeIcon = () => <span>🏠</span>;
const HeartIcon = () => <span>💕</span>;
const CalendarIcon = () => <span>📅</span>;
const TrophyIcon = () => <span>🏆</span>;
const SparklesIcon = () => <span>✨</span>;

const BottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    {
      path: '/dashboard',
      label: 'Home',
      icon: HomeIcon,
    },
    {
      path: '/dashboard/timeline',
      label: 'Memories',
      icon: HeartIcon,
    },
    {
      path: '/dashboard/planner',
      label: 'Plans',
      icon: CalendarIcon,
    },
    {
      path: '/dashboard/growth-hub',
      label: 'Growth',
      icon: TrophyIcon,
    },
    {
      path: '/dashboard/daily-connection',
      label: 'Connect',
      icon: SparklesIcon,
    },
  ];

  return (
    <nav className="bottom-nav">
      <div className="nav-items">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">
                <Icon />
              </span>
              <span className="nav-label">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;