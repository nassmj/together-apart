import React from 'react';
import { Link } from 'react-router-dom';
import { 
    UserCircleIcon,
    Cog6ToothIcon,
    BellIcon,
    ShieldCheckIcon,
    QuestionMarkCircleIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import BottomNav from '../../components/dashboard/BottomNav';

const ProfilePage: React.FC = () => {
    const { user, signOut } = useAuth();
    const userName = user?.user_metadata?.full_name || user?.email || 'User';

    const profileOptions = [
        { 
            title: 'Account Settings', 
            icon: UserCircleIcon, 
            path: '/dashboard/settings',
            color: 'text-rose'
        },
        { 
            title: 'Notifications', 
            icon: BellIcon, 
            path: '/dashboard/notifications',
            color: 'text-lavender'
        },
        { 
            title: 'Privacy & Security', 
            icon: ShieldCheckIcon, 
            path: '/dashboard/privacy',
            color: 'text-coral'
        },
        { 
            title: 'Help & Support', 
            icon: QuestionMarkCircleIcon, 
            path: '/dashboard/help',
            color: 'text-purple-400'
        },
    ];

    return (
        <div className="max-w-md mx-auto bg-soft-white dark:bg-gray-900 min-h-screen">
            <div className="p-4 pb-24">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/dashboard" className="p-2 rounded-full bg-white dark:bg-white/5 hover:bg-rose/10 transition-colors">
                        <ArrowLeftIcon className="h-6 w-6 text-charcoal dark:text-white" />
                    </Link>
                    <h1 className="text-2xl font-bold text-charcoal dark:text-white">Profile</h1>
                </div>

                {/* User Info Card */}
                <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-rose/10 mb-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-16 w-16 rounded-full bg-rose/20 flex items-center justify-center border-2 border-rose/30">
                            <UserCircleIcon className="h-12 w-12 text-rose" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-charcoal dark:text-white">{userName}</h2>
                            <p className="text-cool-gray dark:text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Profile Options */}
                <div className="bg-white dark:bg-white/5 rounded-2xl shadow-sm border border-rose/10 mb-6">
                    {profileOptions.map((option, index) => {
                        const Icon = option.icon;
                        return (
                            <Link
                                key={option.title}
                                to={option.path}
                                className={`flex items-center gap-4 p-4 border-b border-rose/10 last:border-b-0 hover:bg-soft-white dark:hover:bg-white/5 transition-colors ${
                                    index === 0 ? 'rounded-t-2xl' : ''
                                } ${index === profileOptions.length - 1 ? 'rounded-b-2xl' : ''}`}
                            >
                                <div className={`p-2 rounded-lg ${option.color.replace('text-', 'bg-')}/20`}>
                                    <Icon className={`h-6 w-6 ${option.color}`} />
                                </div>
                                <span className="font-medium text-charcoal dark:text-white">{option.title}</span>
                                <div className="ml-auto">
                                    <ArrowLeftIcon className="h-5 w-5 text-cool-gray rotate-180" />
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/* Sign Out Button */}
                <button
                    onClick={signOut}
                    className="w-full bg-rose/10 text-rose p-4 rounded-2xl font-medium hover:bg-rose/20 transition-colors border border-rose/20"
                >
                    Sign Out
                </button>
            </div>
            <BottomNav />
        </div>
    );
};

export default ProfilePage;
