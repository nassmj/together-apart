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
        <div className="bg-sunset-gradient p-8 rounded-2xl border border-rose/20 shadow-lg">
            <h1 className="text-3xl font-bold text-white mb-3">
                Welcome back, {userName}! 💕
            </h1>
            <p className="text-white/90 text-lg">
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
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-lg border border-rose/10">
            <h3 className="text-xl font-bold text-charcoal dark:text-white mb-2">Daily Connection</h3>
            <p className="text-cool-gray dark:text-gray-400 mb-6">Your shared question for today.</p>

            <div className="mb-6 p-5 bg-lavender/10 rounded-xl border border-lavender/20">
                <p className="font-semibold text-lavender-600 dark:text-lavender-400 text-lg">
                    "What's one thing you're grateful for about your relationship today?"
                </p>
            </div>

            <div className="space-y-4">
                {/* Partner's Answer */}
                <div className="flex items-end gap-3">
                    <div className="h-10 w-10 rounded-full bg-rose/20 flex items-center justify-center flex-shrink-0 border-2 border-rose/30">
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
            
            <Link to="/dashboard/daily-connection" className="text-sm text-rose hover:text-rose/80 text-center block mt-6 font-medium">
                View connection history →
            </Link>
        </div>
    );
};

const QuickActionsWidget: React.FC = () => {
    const actions = [
        { title: 'Add Memory', icon: HeartIcon, color: 'bg-rose/20 text-rose border-rose/20', path: '/dashboard/timeline' },
        { title: 'Plan Activity', icon: CalendarDaysIcon, color: 'bg-lavender/20 text-lavender border-lavender/20', path: '/dashboard/planner' },
        { title: 'Growth Hub', icon: TrophyIcon, color: 'bg-coral/20 text-coral border-coral/20', path: '/dashboard/growth-hub' },
        { title: 'Discover', icon: SparklesIcon, color: 'bg-purple-400/20 text-purple-400 border-purple-400/20', path: '/dashboard/discovery' },
    ];

    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-lg border border-rose/10">
            <h3 className="text-xl font-bold text-charcoal dark:text-white mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
                {actions.map((action) => (
                    <Link
                        key={action.title}
                        to={action.path}
                        className="flex items-center gap-3 p-4 rounded-xl border hover:shadow-md transition-all duration-200 hover:scale-105"
                        style={{ borderColor: action.color.split(' ')[2]?.replace('border-', '').replace('/20', '') + '/20' }}
                    >
                        <div className={`p-3 rounded-lg ${action.color.split(' ').slice(0, 2).join(' ')}`}>
                            <action.icon className="h-6 w-6" />
                        </div>
                        <span className="font-semibold text-charcoal dark:text-white">{action.title}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const RecentActivityWidget: React.FC = () => {
    const activities = [
        { title: 'Our First Date', icon: HeartIcon, color: 'bg-rose/20 text-rose', time: '2 hours ago' },
        { title: 'Memory Lane', icon: TrophyIcon, color: 'bg-lavender/20 text-lavender', time: 'Yesterday' },
        { title: 'Punisher by Phoebe Bridgers', icon: MusicalNoteIcon, color: 'bg-coral/20 text-coral', time: '3 days ago' },
    ];

    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-lg border border-rose/10">
            <h3 className="text-xl font-bold text-charcoal dark:text-white mb-6">Recent Activity</h3>
            <div className="space-y-4">
                {activities.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-soft-white dark:hover:bg-white/5 transition-colors border border-transparent hover:border-rose/10">
                        <div className={`p-3 rounded-xl ${activity.color}`}>
                            <activity.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-charcoal dark:text-white">{activity.title}</p>
                        </div>
                        <span className="text-sm text-cool-gray dark:text-gray-400">{activity.time}</span>
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
            <div className="min-h-screen flex items-center justify-center bg-romantic-gradient">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-6">
            <WelcomeHeader />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <DailyConnectionWidget />
                <QuickActionsWidget />
            </div>
            
            <RecentActivityWidget />
        </div>
    );
};

export default DashboardPage;
