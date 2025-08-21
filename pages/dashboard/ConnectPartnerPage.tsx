import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlusIcon, LinkIcon, ClipboardDocumentIcon } from '@heroicons/react/24/solid';
import { useToast } from '../../components/ToastProvider';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import type { Database } from '../../lib/supabaseClient';

const ConnectPartnerPage: React.FC = () => {
    const { user } = useAuth();
    const [inviteLink, setInviteLink] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const toast = useToast();

    const generateLink = async () => {
        if (!user) {
            toast.error("You must be logged in to generate an invite.");
            return;
        }
        setIsGenerating(true);
        try {
            const uniqueCode = Math.random().toString(36).substring(2, 12);
            const invite: Database['public']['Tables']['invites']['Insert'] = { code: uniqueCode, inviter_id: user.id };
            
            const { error } = await supabase
                .from('invites')
                .insert(invite);

            if (error) throw error;
            
            setInviteLink(`${window.location.origin}/#/join/${uniqueCode}`);
        } catch(error: any) {
            console.error("Error generating link:", error);
            toast.error(error.message || "Failed to generate invite link. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const copyLink = () => {
        if (!inviteLink) return;
        navigator.clipboard.writeText(inviteLink);
        toast.success('Invite link copied to clipboard!');
    };

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl space-y-8 bg-white/5 p-10 rounded-xl shadow-2xl border border-white/10 text-center"
            >
                <UserPlusIcon className="mx-auto h-16 w-16 text-pink" />
                <div>
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">
                        Let's Connect with Your Partner
                    </h2>
                    <p className="mt-2 text-lg text-gray-400">
                        "Together Apart" is built for two. Share this unique link with your partner so they can join you.
                    </p>
                </div>
                
                <div className="mt-8 space-y-6">
                    {!inviteLink ? (
                        <button
                            onClick={generateLink}
                            disabled={isGenerating}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-green py-3 px-4 text-md font-bold text-black hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating Link...
                                </>
                            ) : (
                                <>
                                    <LinkIcon className="h-6 w-6 mr-2" />
                                    Generate Invite Link
                                </>
                            )}
                        </button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            <div className="relative">
                                <input
                                    type="text"
                                    readOnly
                                    value={inviteLink}
                                    className="w-full rounded-md border-gray-600 bg-black/50 text-white shadow-sm focus:border-pink focus:ring-pink text-center p-3 font-mono"
                                />
                            </div>
                            <button
                                onClick={copyLink}
                                className="group relative flex w-full justify-center rounded-md border border-transparent bg-pink py-3 px-4 text-md font-bold text-black hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-pink focus:ring-offset-2 focus:ring-offset-black"
                            >
                                <ClipboardDocumentIcon className="h-6 w-6 mr-2" />
                                Copy Link
                            </button>
                        </motion.div>
                    )}

                    <div className="text-center">
                        <p className="text-sm text-gray-500">Once your partner signs up, your accounts will be linked.</p>
                        <Link to="/dashboard" className="font-medium text-green hover:text-green/80 mt-2 inline-block">
                            Skip for now &rarr;
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default ConnectPartnerPage;
