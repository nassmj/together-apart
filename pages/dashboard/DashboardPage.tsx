import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    PaperAirplaneIcon, 
    SparklesIcon,
    ArrowUpRightIcon,
    HeartIcon,
    CalendarDaysIcon,
    TrophyIcon,
    MusicalNoteIcon,
    BellIcon,
    Cog6ToothIcon,
    UserCircleIcon
} from '@heroicons/react/24/solid';
import { useToast } from '../../components/ToastProvider';
import { useAuth } from '../../contexts/AuthContext';
import { usePartner } from '../../contexts/PartnerContext';
import { LoadingSpinner, Skeleton } from '../../components/LoadingSpinner';
import BottomNav from '../../components/dashboard/BottomNav';

// --- WIDGET COMPONENTS ---

const HeaderSection: React.FC = () => {
    const { user } = useAuth();
    const userName = user?.user_metadata?.full_name || user?.email || 'there';

    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-rose/10 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-rose/20 flex items-center justify-center border-2 border-rose/30">
                        <UserCircleIcon className="h-8 w-8 text-rose" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-charcoal dark:text-white">
                            Hello, {userName}
                        </h1>
                        <p className="text-cool-gray dark:text-gray-400">
                            Ready to connect today?
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 rounded-full bg-soft-white dark:bg-white/10 hover:bg-rose/10 transition-colors">
                        <BellIcon className="h-6 w-6 text-charcoal dark:text-white" />
                    </button>
                    <Link to="/dashboard/settings" className="p-2 rounded-full bg-soft-white dark:bg-white/10 hover:bg-rose/10 transition-colors">
                        <Cog6ToothIcon className="h-6 w-6 text-charcoal dark:text-white" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

const DailyConnectionCard: React.FC = () => {
    const { user } = useAuth();
    const { partner } = usePartner();
    
    const [userAnswerText, setUserAnswerText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswerText.trim()) return;
        
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setUserAnswerText('');
        }, 1000);
    };

    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-rose/10 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-charcoal dark:text-white">How do you feel today?</h3>
                    <p className="text-cool-gray dark:text-gray-400">Submit today by 11:00 am</p>
                </div>
                <button className="px-4 py-2 bg-charcoal text-white rounded-xl font-medium hover:bg-charcoal/90 transition-colors">
                    Start
                </button>
            </div>

            <div className="mb-6 p-4 bg-lavender/10 rounded-xl border border-lavender/20">
                <p className="font-semibold text-lavender-600 dark:text-lavender-400">
                    "What's one thing you're grateful for about your relationship today?"
                </p>
            </div>

            <div className="space-y-4">
                {/* Partner's Answer */}
                <div className="flex items-end gap-3">
                    <div className="h-10 w-10 rounded-full bg-rose/20 flex items-center justify-center border-2 border-rose/30">
                        <span className="font-bold text-rose text-sm">{partner?.full_name?.[0] || 'P'}</span>
                    </div>
                    <div className="bg-lavender/10 p-4 rounded-2xl rounded-bl-none max-w-md border border-lavender/20">
                        <p className="text-sm text-charcoal dark:text-white">
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
                            rows={3}
                            className="block w-full rounded-xl border-rose/20 dark:border-rose/30 bg-soft-white dark:bg-white/10 text-charcoal dark:text-white shadow-sm focus:border-rose focus:ring-rose/20 sm:text-sm pr-12 resize-none"
                            placeholder="Share your thoughts..."
                            disabled={isSubmitting}
                        />
                        <button 
                            type="submit" 
                            disabled={!userAnswerText.trim() || isSubmitting} 
                            className="absolute bottom-3 right-3 p-2 rounded-full bg-coral text-white hover:bg-coral/90 disabled:bg-cool-gray disabled:cursor-not-allowed shadow-md"
                        >
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProgressCard: React.FC = () => {
    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-rose/10 mb-6">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="text-xl font-bold text-charcoal dark:text-white">Improve relationship strength</h3>
                    <p className="text-cool-gray dark:text-gray-400">Your current goal</p>
                </div>
                <div className="p-2 rounded-lg bg-lavender/10">
                    <ArrowUpRightIcon className="h-5 w-5 text-lavender" />
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative">
                    <div className="h-20 w-20 rounded-full border-4 border-lavender/20 flex items-center justify-center">
                        <div className="h-16 w-16 rounded-full border-4 border-lavender bg-lavender/10 flex items-center justify-center">
                            <span className="text-lg font-bold text-lavender">79%</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <div className="mb-2">
                        <p className="text-sm text-cool-gray dark:text-gray-400">Connection score</p>
                        <p className="text-xl font-bold text-charcoal dark:text-white">24.6 / 30</p>
                    </div>
                    <div>
                        <p className="text-sm text-cool-gray dark:text-gray-400">Goal score</p>
                        <p className="text-xl font-bold text-charcoal dark:text-white">30.0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ScheduleCard: React.FC = () => {
    const activities = [
        { title: 'Daily Check-in', time: '10:00 am - 11:00 am', type: 'current', participants: 2 },
        { title: 'Memory Sharing', time: '12:00 pm - 1:00 pm', type: 'upcoming', participants: 2 },
        { title: 'Evening Reflection', time: '8:00 pm - 9:00 pm', type: 'upcoming', participants: 2 },
    ];

    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-rose/10 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-charcoal dark:text-white">Today's Schedule</h3>
                <Link to="/dashboard/planner" className="text-lavender font-medium hover:text-lavender/80">
                    View all
                </Link>
            </div>

            <div className="space-y-3">
                {activities.map((activity, index) => (
                    <div key={index} className={`p-4 rounded-xl border-l-4 ${
                        activity.type === 'current' 
                            ? 'bg-rose/5 border-rose' 
                            : 'bg-lavender/5 border-lavender'
                    }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    <div className="h-8 w-8 rounded-full bg-rose/20 border-2 border-white flex items-center justify-center">
                                        <span className="text-xs font-bold text-rose">Y</span>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-lavender/20 border-2 border-white flex items-center justify-center">
                                        <span className="text-xs font-bold text-lavender">P</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-semibold text-charcoal dark:text-white">{activity.title}</p>
                                    <p className="text-sm text-cool-gray dark:text-gray-400">{activity.time}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const QuickActionsCard: React.FC = () => {
    const actions = [
        { title: 'Add Memory', icon: HeartIcon, color: 'bg-rose/20 text-rose', path: '/dashboard/timeline' },
        { title: 'Plan Activity', icon: CalendarDaysIcon, color: 'bg-lavender/20 text-lavender', path: '/dashboard/planner' },
        { title: 'Growth Hub', icon: TrophyIcon, color: 'bg-coral/20 text-coral', path: '/dashboard/growth-hub' },
        { title: 'Discover', icon: SparklesIcon, color: 'bg-purple-400/20 text-purple-400', path: '/dashboard/discovery' },
    ];

    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-rose/10 mb-6">
            <h3 className="text-xl font-bold text-charcoal dark:text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                {actions.map((action) => (
                    <Link
                        key={action.title}
                        to={action.path}
                        className="flex items-center gap-3 p-4 rounded-xl border border-rose/10 hover:shadow-md transition-all duration-200 hover:scale-105"
                    >
                        <div className={`p-3 rounded-lg ${action.color}`}>
                            <action.icon className="h-6 w-6" />
                        </div>
                        <span className="font-semibold text-charcoal dark:text-white">{action.title}</span>
                    </Link>
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
            <div className="min-h-screen flex items-center justify-center bg-romantic-gradient">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto bg-soft-white dark:bg-gray-900 min-h-screen">
            <div className="p-4 pb-24">
                <HeaderSection />
                <DailyConnectionCard />
                <ProgressCard />
                <ScheduleCard />
                <QuickActionsCard />
            </div>
            <BottomNav />
        </div>
    );
};

export default DashboardPage;
