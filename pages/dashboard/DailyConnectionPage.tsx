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
            className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-white/10"
        >
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
                {new Date(connection.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <div className="mb-4 p-4 bg-green/10 rounded-lg">
                <p className="font-semibold text-green italic">"{connection.question}"</p>
            </div>
            <div className="space-y-4">
                <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">Your Answer</p>
                    <div className="bg-green/10 p-3 rounded-lg text-green/90 text-sm">
                        {userAnswer || <span className="italic text-gray-400">No answer given.</span>}
                    </div>
                </div>
                <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-2">{partner?.full_name || 'Partner'}'s Answer</p>
                    <div className="bg-pink/10 p-3 rounded-lg text-pink/90 text-sm">
                        {partnerAnswer || <span className="italic text-gray-400">Waiting for an answer...</span>}
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
            const { data, error } = await supabase
                .from('daily_connections')
                .select('*')
                .eq('couple_id', couple.id)
                .order('date', { ascending: false });
            
            if (error) {
                toast.error(error.message);
            } else {
                setHistory(data || []);
            }
            setLoading(false);
        };
        fetchHistory();
    }, [couple, toast]);

    return (
        <div className="space-y-8 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">📜 Connection History</h1>
                <p className="mt-1 text-gray-500 dark:text-gray-400">A look back at your shared moments and conversations.</p>
            </div>
            
            <div className="space-y-6">
                {loading ? (
                    <div className="space-y-6">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                ) : history.length > 0 ? (
                    history.map((conn, index) => (
                        <ConnectionCard key={conn.id} connection={conn} index={index} />
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500">Your connection history is empty.</div>
                )}
            </div>
        </div>
    );
};

export default DailyConnectionPage;
