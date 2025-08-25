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
    BellIcon,
    Cog6ToothIcon,
    UserCircleIcon,
    ClockIcon,
    CheckCircleIcon,
    PlusIcon
} from '@heroicons/react/24/solid';
import { useToast } from '../../components/ToastProvider';
import { useAuth } from '../../contexts/AuthContext';
import { usePartner } from '../../contexts/PartnerContext';
import { LoadingSpinner, Skeleton } from '../../components/LoadingSpinner';

// --- WIDGET COMPONENTS ---

const HeaderSection: React.FC = () => {
    const { user } = useAuth();
    const { partner } = usePartner();
    const userName = user?.user_metadata?.full_name || user?.email || 'there';
    const partnerName = partner?.full_name || 'your partner';

    return (
        <motion.div 
            className="card mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="card-body">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                                                 <div className="relative">
                             <div className="h-12 w-12 rounded-full bg-primary-light flex items-center justify-center border-2 border-primary">
                                 <UserCircleIcon className="h-8 w-8 text-primary" />
                             </div>
                             {partner && (
                                 <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-secondary-light flex items-center justify-center border-2 border-secondary">
                                     <span className="text-xs font-bold text-secondary">
                                         {partnerName[0]?.toUpperCase()}
                                     </span>
                                 </div>
                             )}
                         </div>
                         <div>
                             <h1 className="text-2xl font-bold text-primary">
                                 Hello, {userName}
                             </h1>
                             <p className="text-secondary">
                                 Ready to connect with {partnerName} today?
                             </p>
                         </div>
                     </div>
                     <div className="flex items-center gap-3">
                         <button className="p-2 rounded-full bg-bg hover:bg-primary-tint transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                             <BellIcon className="h-6 w-6 text-primary" />
                         </button>
                         <Link 
                             to="/dashboard/settings" 
                             className="p-2 rounded-full bg-bg hover:bg-primary-tint transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                         >
                             <Cog6ToothIcon className="h-6 w-6 text-primary" />
                         </Link>
                    </div>
                </div>
            </div>
        </motion.div>
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
        <motion.div 
            className="card mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
        >
            <div className="card-header">
                                 <div className="flex items-center justify-between">
                     <h3 className="text-xl font-bold text-text">Today's Messages</h3>
                     <span className="text-sm text-text-secondary">Share your thoughts</span>
                 </div>
            </div>
            <div className="card-body">
                <div className="space-y-4">
                                         {/* Partner's Message */}
                     <div className="flex items-start gap-3">
                         <div className="h-10 w-10 rounded-full bg-secondary-light flex items-center justify-center border-2 border-secondary flex-shrink-0">
                             <span className="font-bold text-secondary text-sm">
                                 {partner?.full_name?.[0] || 'P'}
                             </span>
                         </div>
                         <div className="bg-secondary-light p-4 rounded-2xl rounded-tl-none max-w-full border border-secondary">
                             <p className="text-sm text-text leading-relaxed">
                                 {sampleMessages.partner}
                             </p>
                             <p className="text-xs text-text-secondary mt-2">2 hours ago</p>
                         </div>
                     </div>

                     {/* User's Message Input */}
                     <form onSubmit={handleSubmit} className="space-y-3">
                         <div className="flex items-start gap-3">
                             <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center border-2 border-primary flex-shrink-0">
                                 <span className="font-bold text-primary text-sm">
                                     {user?.user_metadata?.full_name?.[0] || 'Y'}
                                 </span>
                             </div>
                            <div className="flex-1">
                                <textarea
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    placeholder="Share something with your partner..."
                                    className="input resize-none h-20"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={!userMessage.trim() || isSubmitting}
                                className="btn btn-primary btn-sm"
                            >
                                {isSubmitting ? (
                                    <>
                                        <LoadingSpinner size="sm" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <PaperAirplaneIcon className="h-4 w-4" />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </motion.div>
    );
};

const SharedPlansCard: React.FC = () => {
    const upcomingPlans = [
        {
            id: 1,
            title: "Coffee Date",
            date: "Tomorrow, 3:00 PM",
            location: "Starbucks Downtown",
            type: "Date"
        },
        {
            id: 2,
            title: "Movie Night",
            date: "Saturday, 8:00 PM",
            location: "Home",
            type: "Activity"
        }
    ];

    return (
        <motion.div 
            className="card mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
        >
            <div className="card-header">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-neutral-ink">Shared Plans</h3>
                                         <Link
                         to="/dashboard/planner"
                         className="text-sm text-secondary hover:text-secondary-dark transition-colors"
                     >
                         View All
                     </Link>
                 </div>
             </div>
             <div className="card-body">
                 <div className="space-y-3">
                     {upcomingPlans.map((plan) => (
                         <div key={plan.id} className="flex items-center gap-3 p-3 rounded-lg bg-bg">
                             <div className="h-10 w-10 rounded-full bg-secondary-light flex items-center justify-center">
                                 <CalendarDaysIcon className="h-5 w-5 text-secondary" />
                             </div>
                             <div className="flex-1">
                                 <h4 className="font-semibold text-text">{plan.title}</h4>
                                 <p className="text-sm text-text-secondary">{plan.date} • {plan.location}</p>
                             </div>
                             <span className="badge badge-secondary">{plan.type}</span>
                         </div>
                     ))}
                     <Link
                         to="/dashboard/planner"
                         className="btn btn-secondary w-full"
                     >
                         <PlusIcon className="h-4 w-4" />
                         Plan Something New
                     </Link>
                 </div>
             </div>
        </motion.div>
    );
};

const GrowthTasksCard: React.FC = () => {
    const activeTasks = [
        {
            id: 1,
            title: "Daily Gratitude",
            progress: 75,
            streak: 5,
            type: "Routine"
        },
        {
            id: 2,
            title: "Communication Challenge",
            progress: 30,
            streak: 2,
            type: "Challenge"
        }
    ];

    return (
        <motion.div 
            className="card mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
        >
            <div className="card-header">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-neutral-ink">Growth Hub</h3>
                                         <Link
                         to="/dashboard/growth-hub"
                         className="text-sm text-accent hover:text-accent-dark transition-colors"
                     >
                         View All
                     </Link>
                 </div>
             </div>
             <div className="card-body">
                 <div className="space-y-4">
                     {activeTasks.map((task) => (
                         <div key={task.id} className="space-y-2">
                             <div className="flex items-center justify-between">
                                 <h4 className="font-semibold text-text">{task.title}</h4>
                                 <span className="badge badge-accent">{task.type}</span>
                             </div>
                             <div className="space-y-1">
                                 <div className="flex justify-between text-sm">
                                     <span className="text-text-secondary">Progress</span>
                                     <span className="text-text">{task.progress}%</span>
                                 </div>
                                 <div className="w-full bg-border rounded-full h-2">
                                     <div
                                         className="bg-accent h-2 rounded-full transition-all duration-300"
                                         style={{ width: `${task.progress}%` }}
                                     />
                                 </div>
                             </div>
                             <div className="flex items-center gap-2 text-sm text-text-secondary">
                                 <TrophyIcon className="h-4 w-4" />
                                 <span>{task.streak} day streak</span>
                             </div>
                         </div>
                     ))}
                     <Link
                         to="/dashboard/growth-hub"
                         className="btn btn-accent w-full"
                     >
                         <PlusIcon className="h-4 w-4" />
                         Start New Quest
                     </Link>
                 </div>
             </div>
        </motion.div>
    );
};

const QuickActionsCard: React.FC = () => {
    const quickActions = [
        {
            title: "Add Memory",
            icon: HeartIcon,
            path: "/dashboard/timeline",
            color: "rose"
        },
        {
            title: "Plan Date",
            icon: CalendarDaysIcon,
            path: "/dashboard/planner",
            color: "lavender"
        },
        {
            title: "Discover",
            icon: SparklesIcon,
            path: "/dashboard/discovery",
            color: "peach"
        },
        {
            title: "Growth",
            icon: TrophyIcon,
            path: "/dashboard/growth-hub",
            color: "peach"
        }
    ];

    return (
        <motion.div 
            className="card mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
        >
            <div className="card-header">
                <h3 className="text-xl font-bold text-neutral-ink">Quick Actions</h3>
            </div>
            <div className="card-body">
                                 <div className="grid grid-cols-2 gap-3">
                     {quickActions.map((action) => {
                         const Icon = action.icon;
                         const colorMap = {
                             rose: 'primary',
                             lavender: 'secondary',
                             peach: 'accent'
                         };
                         const color = colorMap[action.color as keyof typeof colorMap] || 'primary';
                         
                         return (
                             <Link
                                 key={action.title}
                                 to={action.path}
                                 className={`flex flex-col items-center p-4 rounded-xl bg-bg hover:bg-border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-${color}`}
                             >
                                 <div className={`h-12 w-12 rounded-full bg-${color}-light flex items-center justify-center mb-2`}>
                                     <Icon className={`h-6 w-6 text-${color}`} />
                                 </div>
                                 <span className="text-sm font-medium text-text text-center">
                                     {action.title}
                                 </span>
                             </Link>
                         );
                     })}
                 </div>
            </div>
        </motion.div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---

const DashboardPage: React.FC = () => {
    const { user, loading } = useAuth();
    const { partner, loading: partnerLoading } = usePartner();

    if (loading || partnerLoading) {
        return (
            <div className="min-h-screen bg-neutral-bg p-4">
                <div className="container">
                    <div className="space-y-6">
                        <Skeleton className="h-32" />
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-bg">
            <div className="container p-4">
                <HeaderSection />
                <DailyMessagesCard />
                <SharedPlansCard />
                <GrowthTasksCard />
                <QuickActionsCard />
            </div>
        </div>
    );
};

export default DashboardPage;
