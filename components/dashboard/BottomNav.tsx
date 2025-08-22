import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    HomeIcon, 
    HeartIcon, 
    CalendarDaysIcon, 
    TrophyIcon,
    SparklesIcon
} from '@heroicons/react/24/solid';

const BottomNav: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { 
            name: 'Home', 
            icon: HomeIcon, 
            path: '/dashboard'
        },
        { 
            name: 'Memories', 
            icon: HeartIcon, 
            path: '/dashboard/timeline'
        },
        { 
            name: 'Plans', 
            icon: CalendarDaysIcon, 
            path: '/dashboard/planner'
        },
        { 
            name: 'Growth', 
            icon: TrophyIcon, 
            path: '/dashboard/growth-hub'
        },
        { 
            name: 'Chat', 
            icon: SparklesIcon, 
            path: '/dashboard/daily-connection'
        }
    ];

    return (
        <div className="bottom-nav">
            <div className="bottom-nav-content">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon className="w-6 h-6" />
                            <span className="text-xs font-medium mt-1">{item.name}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNav;