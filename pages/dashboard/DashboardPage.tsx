import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    PaperAirplaneIcon, 
    SparklesIcon,
    ArrowUpRightIcon,
    HeartIcon,
    CalendarDaysIcon,
    TrophyIcon,
    MusicalNoteIcon
} from '@heroicons/react/24/solid';
import { useToast } from '../../components/ToastProvider';
import { useAuth } from '../../contexts/AuthContext';
import { usePartner } from '../../contexts/PartnerContext';
import { LoadingSpinner, Skeleton } from '../../components/LoadingSpinner';

// --- WIDGET COMPONENTS ---

const WelcomeHeader: React.FC = () => {
    const { user } = useAuth();
    const userName = user?.user_metadata?.full_name || user?.email || 'there';

    return (
        <div className="bg-gradient-to-r from-pink/10 to-green/10 p-6 rounded-xl border border-gray-200 dark:border-white/10">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {userName}! 👋
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
                Ready to strengthen your relationship today?
            </p>
        </div>
    );
};

const DailyConnectionWidget: React.FC = () => {
    const { user } = useAuth();
    const { partner } = usePartner();
    
    const [userAnswerText, setUserAnswerText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswerText.trim()) return;
        
        setIsSubmitting(true);
        // Simulate submission
        setTimeout(() => {
            setIsSubmitting(false);
            setUserAnswerText('');
        }, 1000);
    };

    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Daily Connection</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your shared question for today.</p>

            <div className="mb-4 p-4 bg-green/10 rounded-lg">
                <p className="font-semibold text-green">
                    "What's one thing you're grateful for about your relationship today?"
                </p>
            </div>

            <div className="space-y-4">
                {/* Partner's Answer */}
                <div className="flex items-end gap-3">
                    <div className="h-8 w-8 rounded-full bg-pink/20 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-pink text-sm">{partner?.full_name?.[0] || 'P'}</span>
                    </div>
                    <div className="bg-gray-100 dark:bg-black/40 p-3 rounded-lg rounded-bl-none max-w-md">
                        <p className="text-sm text-gray-800 dark:text-gray-200">
                            {partner ? "Waiting for your partner's answer..." : "Connect with your partner to see their answer"}
                        </p>
                    </div>
                </div>

                {/* Your Answer */}
                <form onSubmit={handleSubmit}>
                    <div className="relative">
                        <textarea
                            value={userAnswerText}
                            onChange={(e) => setUserAnswerText(e.target.value)}
                            rows={2}
                            className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-black/50 text-gray-900 dark:text-white shadow-sm focus:border-pink focus:ring-pink sm:text-sm pr-12 resize-none"
                            placeholder="Share your thoughts..."
                            disabled={isSubmitting}
                        />
                        <button 
                            type="submit" 
                            disabled={!userAnswerText.trim() || isSubmitting} 
                            className="absolute bottom-2 right-2 p-2 rounded-full bg-green text-black hover:bg-opacity-90 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
            
            <Link to="/dashboard/daily-connection" className="text-sm text-gray-500 hover:text-green text-center block mt-4">
                View connection history
            </Link>
        </div>
    );
};

const QuickActionsWidget: React.FC = () => {
    const actions = [
        { title: 'Add Memory', icon: HeartIcon, color: 'bg-pink/20 text-pink', path: '/dashboard/timeline' },
        { title: 'Plan Activity', icon: CalendarDaysIcon, color: 'bg-green/20 text-green', path: '/dashboard/planner' },
        { title: 'Growth Hub', icon: TrophyIcon, color: 'bg-blue-400/20 text-blue-400', path: '/dashboard/growth-hub' },
        { title: 'Discover', icon: SparklesIcon, color: 'bg-purple-400/20 text-purple-400', path: '/dashboard/discovery' },
    ];

    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                {actions.map((action) => (
                    <Link
                        key={action.title}
                        to={action.path}
                        className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                    >
                        <div className={`p-2 rounded-lg ${action.color}`}>
                            <action.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{action.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const RecentActivityWidget: React.FC = () => {
    const activities = [
        { title: 'Our First Date', icon: HeartIcon, color: 'bg-pink/20 text-pink', time: '2 hours ago' },
        { title: 'Memory Lane', icon: TrophyIcon, color: 'bg-blue-400/20 text-blue-400', time: 'Yesterday' },
        { title: 'Punisher by Phoebe Bridgers', icon: MusicalNoteIcon, color: 'bg-purple-400/20 text-purple-400', time: '3 days ago' },
    ];

    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <div className={`p-2 rounded-lg ${activity.color}`}>
                            <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-gray-900 dark:text-white">{activity.title}</p>
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { partner } = usePartner();

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <WelcomeHeader />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <DailyConnectionWidget />
                <QuickActionsWidget />
            </div>
            
            <RecentActivityWidget />
        </div>
    );
};

export default DashboardPage;
