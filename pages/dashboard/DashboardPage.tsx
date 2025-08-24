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
    UserCircleIcon,
    ClockIcon,
    CheckCircleIcon
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

const DailyMessagesCard: React.FC = () => {
    const { user } = useAuth();
    const { partner } = usePartner();
    
    const [userMessage, setUserMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sample daily messages (in real app, these would come from database)
    const sampleMessages = {
        user: "I'm thinking about our coffee date last weekend. Your smile when you tried that new pastry was everything. Can't wait to see you again! 💕",
        partner: "Missing your morning texts already. The way you always remember the little things about my day makes me feel so special. Love you! ❤️"
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userMessage.trim()) return;
        
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setUserMessage('');
        }, 1000);
    };

    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-rose/10 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-charcoal dark:text-white">Today's Messages</h3>
                <span className="text-sm text-cool-gray dark:text-gray-400">Share your thoughts</span>
            </div>

            <div className="space-y-4">
                {/* Partner's Message */}
                <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-rose/20 flex items-center justify-center border-2 border-rose/30 flex-shrink-0">
                        <span className="font-bold text-rose text-sm">{partner?.full_name?.[0] || 'P'}</span>
                    </div>
                    <div className="bg-lavender/10 p-4 rounded-2xl rounded-tl-none max-w-full border border-lavender/20">
                        <p className="text-sm text-charcoal dark:text-white leading-relaxed">
                            {sampleMessages.partner}
                        </p>
                        <p className="text-xs text-cool-gray dark:text-gray-400 mt-2">2 hours ago</p>
                    </div>
                </div>

                {/* Your Message */}
                <div className="flex items-start gap-3 justify-end">
                    <div className="bg-coral/10 p-4 rounded-2xl rounded-tr-none max-w-full border border-coral/20">
                        <p className="text-sm text-charcoal dark:text-white leading-relaxed">
                            {sampleMessages.user}
                        </p>
                        <p className="text-xs text-cool-gray dark:text-gray-400 mt-2">1 hour ago</p>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-coral/20 flex items-center justify-center border-2 border-coral/30 flex-shrink-0">
                        <span className="font-bold text-coral text-sm">{user?.user_metadata?.full_name?.[0] || 'Y'}</span>
                    </div>
                </div>

                {/* New Message Input */}
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="relative">
                        <textarea
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            rows={3}
                            className="block w-full rounded-xl border-rose/20 dark:border-rose/30 bg-soft-white dark:bg-white/10 text-charcoal dark:text-white shadow-sm focus:border-rose focus:ring-rose/20 sm:text-sm pr-12 resize-none"
                            placeholder="Share what's on your mind today..."
                            disabled={isSubmitting}
                        />
                        <button 
                            type="submit" 
                            disabled={!userMessage.trim() || isSubmitting} 
                            className="absolute bottom-3 right-3 p-2 rounded-full bg-rose text-white hover:bg-rose/90 disabled:bg-cool-gray disabled:cursor-not-allowed shadow-md"
                        >
                            <PaperAirplaneIcon className="h-5 w-5" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SharedPlansCard: React.FC = () => {
    const upcomingPlans = [
        { 
            title: 'Weekend Getaway', 
            date: 'This Saturday', 
            time: '2:00 PM',
            type: 'trip',
            participants: 2
        },
        { 
            title: 'Cooking Class', 
            date: 'Next Tuesday', 
            time: '7:00 PM',
            type: 'activity',
            participants: 2
        },
        { 
            title: 'Movie Night', 
            date: 'Tomorrow', 
            time: '8:00 PM',
            type: 'entertainment',
            participants: 2
        },
    ];

    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-rose/10 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-charcoal dark:text-white">Shared Plans</h3>
                <Link to="/dashboard/planner" className="text-lavender font-medium hover:text-lavender/80">
                    View all
                </Link>
            </div>

            <div className="space-y-3">
                {upcomingPlans.map((plan, index) => (
                    <div key={index} className="p-4 rounded-xl border border-lavender/20 hover:bg-lavender/5 transition-colors">
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
                                    <p className="font-semibold text-charcoal dark:text-white">{plan.title}</p>
                                    <div className="flex items-center gap-2 text-sm text-cool-gray dark:text-gray-400">
                                        <CalendarDaysIcon className="h-4 w-4" />
                                        <span>{plan.date} • {plan.time}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const GrowthTasksCard: React.FC = () => {
    const growthTasks = [
        { 
            title: 'Learn each other\'s love languages', 
            progress: 75,
            dueDate: 'This week',
            type: 'communication'
        },
        { 
            title: 'Create a shared bucket list', 
            progress: 30,
            dueDate: 'Next week',
            type: 'planning'
        },
        { 
            title: 'Practice active listening', 
            progress: 90,
            dueDate: 'Ongoing',
            type: 'skill'
        },
    ];

    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-2xl shadow-sm border border-rose/10 mb-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-charcoal dark:text-white">Growth Hub Tasks</h3>
                <Link to="/dashboard/growth-hub" className="text-coral font-medium hover:text-coral/80">
                    View all
                </Link>
            </div>

            <div className="space-y-4">
                {growthTasks.map((task, index) => (
                    <div key={index} className="p-4 rounded-xl border border-coral/20 hover:bg-coral/5 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-charcoal dark:text-white">{task.title}</h4>
                            <span className="text-sm text-cool-gray dark:text-gray-400">{task.dueDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex-1 bg-coral/20 rounded-full h-2">
                                <div 
                                    className="bg-coral h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${task.progress}%` }}
                                ></div>
                            </div>
                            <span className="text-sm font-medium text-coral">{task.progress}%</span>
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
                <DailyMessagesCard />
                <SharedPlansCard />
                <GrowthTasksCard />
                <QuickActionsCard />
            </div>
            <BottomNav />
        </div>
    );
};

export default DashboardPage;
