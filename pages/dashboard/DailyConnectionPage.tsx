import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePartner } from '../../contexts/PartnerContext';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import type { Database } from '../../lib/supabaseClient';
import { useToast } from '../../components/ToastProvider';
import { LoadingSpinner, SkeletonCard } from '../../components/LoadingSpinner';

type Connection = Database['public']['Tables']['daily_connections']['Row'];

const ConnectionCard: React.FC<{ connection: Connection, index: number }> = ({ connection, index }) => {
    const { user } = useAuth();
    const { partner } = usePartner();

    const answers = connection.answers as { [key: string]: string } || {};
    const userAnswer = user ? answers[user.id] : "Your answer isn't available.";
    const partnerAnswer = partner ? answers[partner.id] : "Partner's answer isn't available.";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-white/5 p-8 rounded-2xl shadow-lg border border-rose/10"
        >
            <p className="text-sm font-semibold text-cool-gray dark:text-gray-400 mb-4">
                {new Date(connection.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="mb-6 p-5 bg-lavender/10 rounded-xl border border-lavender/20">
                <p className="font-semibold text-lavender-600 dark:text-lavender-400 text-lg italic">"{connection.question}"</p>
            </div>
            <div className="space-y-6">
                <div>
                    <p className="text-sm font-bold text-charcoal dark:text-white mb-3">Your Answer</p>
                    <div className="bg-coral/10 p-4 rounded-xl border border-coral/20 text-coral/90 text-sm">
                        {userAnswer || <span className="italic text-cool-gray">No answer given.</span>}
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold text-charcoal dark:text-white mb-3">{partner?.full_name || 'Partner'}'s Answer</p>
                    <div className="bg-rose/10 p-4 rounded-xl border border-rose/20 text-rose/90 text-sm">
                        {partnerAnswer || <span className="italic text-cool-gray">Waiting for an answer...</span>}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const DailyConnectionPage: React.FC = () => {
    const { couple } = usePartner();
    const toast = useToast();
    const [history, setHistory] = useState<Connection[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!couple) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('daily_connections')
                    .select('*')
                    .eq('couple_id', couple.id)
                    .order('date', { ascending: false });
                
                if (error) {
                    console.error('Database error:', error);
                    toast.error('Failed to load connection history');
                } else {
                    setHistory(data || []);
                }
            } catch (err) {
                console.error('Fetch error:', err);
                toast.error('Network error loading history');
            }
            setLoading(false);
        };
        fetchHistory();
    }, [couple, toast]);

    return (
        <div className="space-y-8 max-w-4xl mx-auto p-6">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-charcoal dark:text-white tracking-tight mb-3">📜 Connection History</h1>
                <p className="text-lg text-cool-gray dark:text-gray-400">A look back at your shared moments and conversations.</p>
            </div>
            
            <div className="space-y-8">
                {loading ? (
                    <div className="space-y-8">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : history.length > 0 ? (
                    history.map((conn, index) => (
                        <ConnectionCard key={conn.id} connection={conn} index={index} />
                    ))
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-16"
                    >
                        <div className="bg-white dark:bg-white/5 p-12 rounded-2xl shadow-lg border border-rose/10">
                            <div className="text-8xl mb-6">💕</div>
                            <h3 className="text-2xl font-semibold text-charcoal dark:text-white mb-4">
                                Start Your Journey Together
                            </h3>
                            <p className="text-cool-gray dark:text-gray-400 mb-8 text-lg">
                                Your connection history will appear here once you start sharing daily questions and answers with your partner.
                            </p>
                            <div className="bg-lavender/10 p-6 rounded-xl border border-lavender/20">
                                <p className="text-lavender-600 dark:text-lavender-400 font-medium text-lg">
                                    💡 Tip: Check the "Daily Connection" page to start your first conversation!
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default DailyConnectionPage;
