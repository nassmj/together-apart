import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
            name: 'Dashboard', 
            icon: HomeIcon, 
            path: '/dashboard',
            color: 'rose'
        },
        { 
            name: 'Memory', 
            icon: HeartIcon, 
            path: '/dashboard/timeline',
            color: 'rose'
        },
        { 
            name: 'Shared Plans', 
            icon: CalendarDaysIcon, 
            path: '/dashboard/planner',
            color: 'lavender'
        },
        { 
            name: 'Growth Hub', 
            icon: TrophyIcon, 
            path: '/dashboard/growth-hub',
            color: 'peach'
        },
        { 
            name: 'Discovery', 
            icon: SparklesIcon, 
            path: '/dashboard/discovery',
            color: 'lavender'
        }
    ];

    return (
                 <motion.nav
             className="bottom-nav"
             initial={{ y: 100 }}
             animate={{ y: 0 }}
             transition={{ duration: 0.3, ease: "easeOut" }}
         >
             <div className="container max-w-md mx-auto">
                 <div className="flex items-center justify-between px-4 py-2">
                     {navItems.map((item) => {
                         const Icon = item.icon;
                         const isActive = location.pathname === item.path;
 
                         return (
                             <Link
                                 key={item.name}
                                 to={item.path}
                                 className="flex flex-col items-center py-3 px-2 rounded-xl transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2"
                                 aria-label={`${item.name}${isActive ? ', selected' : ''}`}
                             >
                                 <motion.div
                                     className="relative"
                                     whileHover={{ scale: 1.1 }}
                                     whileTap={{ scale: 0.95 }}
                                 >
                                     <Icon
                                         className={`h-6 w-6 transition-colors duration-200 ${
                                             isActive
                                                 ? 'text-primary'
                                                 : 'text-text-muted'
                                         }`}
                                     />
                                     {isActive && (
                                         <motion.div
                                             className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full"
                                             initial={{ scale: 0 }}
                                             animate={{ scale: 1 }}
                                             transition={{ duration: 0.2 }}
                                         />
                                     )}
                                 </motion.div>
                                 <span
                                     className={`text-xs font-medium mt-1 transition-colors duration-200 ${
                                         isActive
                                             ? 'text-primary'
                                             : 'text-text-muted'
                                     }`}
                                 >
                                     {item.name}
                                 </span>
                             </Link>
                         );
                     })}
                 </div>
             </div>
         </motion.nav>
    );
};

export default BottomNav;