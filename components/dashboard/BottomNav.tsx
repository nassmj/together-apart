import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    HomeIcon, 
    CalendarDaysIcon, 
    HeartIcon, 
    TrophyIcon,
    SparklesIcon
} from '@heroicons/react/24/solid';

const BottomNav: React.FC = () => {
    const location = useLocation();

    const navItems = [
        { 
            name: 'Dashboard', 
            icon: HomeIcon, 
            path: '/dashboard',
            color: 'text-rose'
        },
        { 
            name: 'Memory', 
            icon: HeartIcon, 
            path: '/dashboard/timeline',
            color: 'text-rose'
        },
        { 
            name: 'Shared Plans', 
            icon: CalendarDaysIcon, 
            path: '/dashboard/planner',
            color: 'text-lavender'
        },
        { 
            name: 'Growth Hub', 
            icon: TrophyIcon, 
            path: '/dashboard/growth-hub',
            color: 'text-coral'
        },
        { 
            name: 'Discovery', 
            icon: SparklesIcon, 
            path: '/dashboard/discovery',
            color: 'text-purple-400'
        }
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-white/5 border-t border-rose/10 shadow-lg">
            <div className="max-w-md mx-auto px-4 py-2">
                <div className="flex items-center justify-between">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                                    isActive 
                                        ? `${item.color} bg-rose/10` 
                                        : 'text-cool-gray hover:text-charcoal dark:hover:text-white'
                                }`}
                            >
                                <Icon className={`h-6 w-6 ${isActive ? item.color : ''}`} />
                                <span className={`text-xs font-medium mt-1 ${isActive ? item.color : ''}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BottomNav;