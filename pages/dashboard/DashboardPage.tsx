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
import { GoogleGenAI } from "@google/genai";
import { useToast } from '../../components/ToastProvider';
import { useAuth } from '../../contexts/AuthContext';
import { usePartner } from '../../contexts/PartnerContext';
import { useDailyConnections } from '../../hooks/useDailyConnections';
import { useActivities } from '../../hooks/useActivities';
import { LoadingSpinner, Skeleton } from '../../components/LoadingSpinner';
import type { Database, Json } from '../../lib/supabaseClient';


// --- MOCK DATA & TYPES ---

type DailyConnection = Database['public']['Tables']['daily_connections']['Row'];

interface UpcomingEvent {
    id: string;
    type: 'activity' | 'challenge';
    title: string;
    date: string; // YYYY-MM-DD
    path: string;
}

function getFutureDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
}

const upcomingEvents: UpcomingEvent[] = [
    { id: 'act1', type: 'activity', title: 'Virtual Museum Tour', date: getFutureDate(2), path: '/dashboard/planner' },
    { id: 'chal1', type: 'challenge', title: 'Co-Op Game Challenge', date: getFutureDate(5), path: '/dashboard/growth-hub' },
];

interface JournalEntry {
    id: string;
    type: 'memory' | 'discovery' | 'quest';
    title:string;
    description: string;
    icon: React.ElementType;
    iconBgColor: string;
    timestamp: string;
    path: string;
}

const journalEntries: JournalEntry[] = [
    { id: 'j1', type: 'memory', title: 'Added a new memory', description: '"Our First Date"', icon: HeartIcon, iconBgColor: 'bg-pink/20 text-pink', timestamp: '2 hours ago', path: '/dashboard/timeline'},
    { id: 'j2', type: 'quest', title: 'Quest Completed!', description: '"Memory Lane"', icon: TrophyIcon, iconBgColor: 'bg-blue-400/20 text-blue-400', timestamp: 'Yesterday', path: '/dashboard/growth-hub' },
    { id: 'j3', type: 'discovery', title: 'Alex shared a song', description: '"Punisher" by Phoebe Bridgers', icon: MusicalNoteIcon, iconBgColor: 'bg-purple-400/20 text-purple-400', timestamp: '3 days ago', path: '/dashboard/discovery' }
];


// --- WIDGET COMPONENTS ---

const PartnerStatusHeader: React.FC = () => {
    const { partner } = usePartner();
    const partnerAvatar = partner?.full_name?.[0].toUpperCase() || 'P';

    return (
    <div className="flex items-center justify-between bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/10 h-full">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-pink/20 flex items-center justify-center flex-shrink-0 ring-2 ring-pink/30">
                <span className="font-bold text-pink text-xl">{partnerAvatar}</span>
            </div>
            <div>
                <p className="font-bold text-gray-900 dark:text-white text-lg">{partner?.full_name || 'Your Partner'}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Is feeling happy today</p>
            </div>
        </div>
        <div className="text-4xl" title="Happy">😄</div>
    </div>
)};

const DailyConnectionWidget: React.FC = () => {
    const { user } = useAuth();
    const { couple, partner } = usePartner();
    
    const {
        todayConnection: dailyConnection,
        isLoading,
        submitAnswer,
        isUpdating
    } = useDailyConnections({
        coupleId: couple?.id || '',
        enabled: !!couple?.id
    });

    const [userAnswerText, setUserAnswerText] = useState('');

    const userAvatar = user?.user_metadata?.full_name?.[0].toUpperCase() || 'Y';
    const partnerAvatar = partner?.full_name?.[0].toUpperCase() || 'P';
    
    const partnerAnswer = (partner && dailyConnection?.answers && (dailyConnection.answers as any)[partner.id]) || "Waiting for your partner's answer...";
    const isAnswered = !!(user && dailyConnection?.answers && (dailyConnection.answers as any)[user.id]);

    // Set user's answer when connection loads
    useEffect(() => {
        if (dailyConnection && user && dailyConnection.answers) {
            const userAnswer = (dailyConnection.answers as any)[user.id];
            if (userAnswer) {
                setUserAnswerText(userAnswer);
            }
        }
    }, [dailyConnection, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userAnswerText.trim() || !user) return;
        
        try {
            await submitAnswer(userAnswerText);
        } catch (error) {
            // Error is handled by the hook
        }
    };

    return (
        <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-white/10">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Daily Connection</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Your shared question for today.</p>

            <div className="mb-4 p-4 bg-green/10 rounded-lg min-h-[60px] flex items-center">
                {isLoading || !dailyConnection ? (
                    <Skeleton lines={1} className="w-3/4" />
                ) : (
                    <p className="font-semibold text-green">{dailyConnection.question}</p>
                )}
            </div>

            <div className="space-y-4">
                {/* Partner's Answer */}
                <div className="flex items-end gap-3">
                    <div className="h-8 w-8 rounded-full bg-pink/20 flex items-center justify-center flex-shrink-0"><span className="font-bold text-pink text-sm">{partnerAvatar}</span></div>
                    <div className="bg-gray-100 dark:bg-black/40 p-3 rounded-lg rounded-bl-none max-w-md">
                        <p className="text-sm text-gray-800 dark:text-gray-200">{partnerAnswer}</p>
                    </div>
                </div>

                {/* Your Answer */}
                <AnimatePresence>
                {isAnswered ? (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex items-end gap-3 justify-end">
                        <div className="bg-green p-3 rounded-lg rounded-br-none max-w-md">
                            <p className="text-sm text-black">{userAnswerText}</p>
                        </div>
                        <div className="h-8 w-8 rounded-full bg-green/20 flex items-center justify-center flex-shrink-0"><span className="font-bold text-green text-sm">{userAvatar}</span></div>
                    </motion.div>
                ) : (
                    <motion.form exit={{ opacity: 0, height: 0, marginTop: 0 }} onSubmit={handleSubmit}>
                        <div className="relative">
                            <textarea
                                value={userAnswerText}
                                onChange={(e) => setUserAnswerText(e.target.value)}
                                rows={2}
                                className="block w-full rounded-lg border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-black/50 text-gray-900 dark:text-white shadow-sm focus:border-pink focus:ring-pink sm:text-sm pr-12 resize-none"
                                placeholder="Your answer..."
                                disabled={isLoading}
                            />
                            <button type="submit" disabled={!userAnswerText || isLoading} className="absolute bottom-2 right-2 p-2 rounded-full bg-green text-black hover:bg-opacity-90 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed">
                                <PaperAirplaneIcon className="h-5 w-5" />
                            </button>
                        </div>
                    </motion.form>
                )}
                </AnimatePresence>
            </div>
            <Link to="/dashboard/daily-connection" className="text-sm text-gray-500 hover:text-green text-center block mt-4">View connection history</Link>
        </div>
    );
};

const OnOurRadarWidget: React.FC = () => {
    const { couple } = usePartner();
    
    const { activities, isLoading } = useActivities({
        coupleId: couple?.id || '',
        filter: 'upcoming',
        enabled: !!couple?.id
    });

    const nextEvent = activities[0]; // First upcoming activity

    const getDaysUntil = (dateString: string) => {
        const diff = new Date(dateString).getTime() - new Date().getTime();
        const days = Math.ceil(diff / (1000 * 3600 * 24));
        if (days < 1) return 'Today';
        if (days === 1) return 'Tomorrow';
        return `In ${days} days`;
    };

    return (
        <div className="bg-gradient-to-br from-pink/10 to-pink/5 p-6 rounded-xl shadow-xl border border-pink/20 relative h-full">
            <SparklesIcon className="absolute top-2 right-2 h-20 w-20 text-pink/10 opacity-50" />
            <div className="relative z-10 flex flex-col justify-between h-full">
                 <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">On Our Radar</h3>
                    {isLoading ? (
                        <Skeleton lines={1} className="w-3/4" />
                    ) : nextEvent ? (
                        <div>
                            <p className="text-xl font-bold text-pink">{nextEvent.title}</p>
                        </div>
                    ) : (
                         <p className="text-gray-500 dark:text-gray-300">Nothing planned. Time for an adventure!</p>
                    )}
                 </div>
                 {nextEvent && (
                    <div className="flex items-center justify-between mt-3">
                        <p className="font-semibold text-gray-800 dark:text-white">{getDaysUntil(nextEvent.date!)}</p>
                        <Link to="/dashboard/planner" className="inline-flex items-center gap-1 text-sm font-bold text-pink hover:text-opacity-80">
                            View <ArrowUpRightIcon className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};


const SharedJournalWidget: React.FC = () => (
    <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-white/10">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Shared Journal</h3>
        <ul className="space-y-4">
            {journalEntries.map(({ id, icon: Icon, iconBgColor, title, description, timestamp, path }) => (
                <li key={id} className="group">
                    <Link to={path} className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                        <div className={`flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center ${iconBgColor}`}>
                            <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{title}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{description}</p>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{timestamp}</p>
                    </Link>
                </li>
            ))}
        </ul>
    </div>
);


const DashboardPage: React.FC = () => {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.div variants={itemVariants}>
                <PartnerStatusHeader />
            </motion.div>
            <motion.div variants={itemVariants}>
                <OnOurRadarWidget />
            </motion.div>
            <motion.div className="md:col-span-2" variants={itemVariants}>
                <DailyConnectionWidget />
            </motion.div>
            <motion.div className="md:col-span-2" variants={itemVariants}>
                <SharedJournalWidget />
            </motion.div>
        </motion.div>
    );
};

export default DashboardPage;
