import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  UserPlusIcon,
  LinkIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  XMarkIcon,
  HeartIcon,
  UserGroupIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useToast } from '../../components/ToastProvider';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import { usePartner } from '../../contexts/PartnerContext';
import type { Database } from '../../lib/supabaseClient';

const ConnectPartnerPage: React.FC = () => {
  const { user } = useAuth();
  const { couple, partner } = usePartner();
  const [inviteLink, setInviteLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Check for existing invites
  useEffect(() => {
    const checkExistingInvites = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('invites')
          .select('*')
          .eq('inviter_id', user.id)
          .eq('status', 'pending');

        if (error) throw error;
        
        if (data && data.length > 0) {
          const invite = data[0];
          setInviteLink(`${window.location.origin}/join/${invite.code}`);
        }
      } catch (error) {
        console.error('Error checking invites:', error);
      } finally {
        setLoading(false);
      }
    };

    checkExistingInvites();
  }, [user]);

  const generateLink = async () => {
    if (!user) {
      toast.error("You must be logged in to generate an invite.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const uniqueCode = Math.random().toString(36).substring(2, 12);
      const invite: Database['public']['Tables']['invites']['Insert'] = { 
        code: uniqueCode, 
        inviter_id: user.id
      };
      
      const { error } = await supabase
        .from('invites')
        .insert(invite);

      if (error) throw error;
      
      setInviteLink(`${window.location.origin}/join/${uniqueCode}`);
      toast.success('Invite link generated successfully!');
    } catch(error: any) {
      console.error("Error generating link:", error);
      toast.error(error.message || "Failed to generate invite link. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLink = async () => {
    if (!inviteLink) return;
    
    try {
      await navigator.clipboard.writeText(inviteLink);
      setIsCopied(true);
      toast.success('Invite link copied to clipboard!');
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link to clipboard');
    }
  };

  const revokeInvite = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('invites')
        .delete()
        .eq('inviter_id', user.id);

      if (error) throw error;
      
      setInviteLink('');
      toast.success('Invite link revoked successfully');
    } catch (error: any) {
      console.error('Error revoking invite:', error);
      toast.error('Failed to revoke invite link');
    }
  };

  // If already connected, show connected state
  if (couple && partner) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Connected with Partner</h1>
          <p className="text-secondary">
            You're already connected with {partner.full_name}
          </p>
        </div>

        <motion.div
          className="card bg-gradient-to-r from-success-light to-primary-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-success flex items-center justify-center">
              <HeartIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-primary mb-1">Connection Active</h3>
              <p className="text-secondary">
                You and {partner.full_name} are connected and can share memories, activities, and daily connections.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="card text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center mx-auto mb-4">
              <UserGroupIcon className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold text-primary mb-2">Daily Connections</h4>
            <p className="text-secondary text-sm">
              Answer daily questions together and stay connected
            </p>
          </motion.div>

          <motion.div
            className="card text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-12 rounded-lg bg-secondary-light flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-6 h-6 text-secondary" />
            </div>
            <h4 className="font-semibold text-primary mb-2">Shared Memories</h4>
            <p className="text-secondary text-sm">
              Create and cherish memories together
            </p>
          </motion.div>

          <motion.div
            className="card text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-12 h-12 rounded-lg bg-accent-light flex items-center justify-center mx-auto mb-4">
              <HeartIcon className="w-6 h-6 text-accent" />
            </div>
            <h4 className="font-semibold text-primary mb-2">Growth Together</h4>
            <p className="text-secondary text-sm">
              Complete quests and grow your relationship
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Connect with Partner</h1>
          <p className="text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Connect with Partner</h1>
        <p className="text-secondary">
          Invite your partner to join you on this journey together
        </p>
      </div>

      {/* Main Connection Card */}
      <motion.div
        className="card bg-gradient-to-r from-primary-light to-secondary-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <UserPlusIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">Invite Your Partner</h2>
            <p className="text-secondary">
              Generate a unique link to share with your partner
            </p>
          </div>
        </div>

        {!inviteLink ? (
          <button
            onClick={generateLink}
            disabled={isGenerating}
            className="btn btn-primary w-full"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Generating Link...
              </>
            ) : (
              <>
                <LinkIcon className="w-5 h-5" />
                Generate Invite Link
              </>
            )}
          </button>
        ) : (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="relative">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="input text-center font-mono"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={copyLink}
                className="btn btn-primary flex-1"
              >
                {isCopied ? (
                  <>
                    <CheckIcon className="w-5 h-5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="w-5 h-5" />
                    Copy Link
                  </>
                )}
              </button>
              
              <button
                onClick={revokeInvite}
                className="btn btn-ghost"
                title="Revoke invite link"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Instructions */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-xl font-semibold text-primary mb-4">How it works</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-primary">Generate Invite</h4>
              <p className="text-secondary text-sm">
                Click the button above to create a unique invitation link
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary-light flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-secondary">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-primary">Share with Partner</h4>
              <p className="text-secondary text-sm">
                Send the link to your partner via text, email, or any messaging app
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-accent-light flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-accent">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-primary">Partner Joins</h4>
              <p className="text-secondary text-sm">
                Your partner clicks the link, signs up, and you'll be automatically connected
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skip Option */}
      <div className="text-center">
        <p className="text-secondary mb-4">
          You can always connect with your partner later
        </p>
        <Link to="/dashboard" className="btn btn-ghost">
          Skip for now
        </Link>
      </div>
    </div>
  );
};

export default ConnectPartnerPage;
