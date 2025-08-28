import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  UserPlusIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { supabase } from '../lib/supabaseClient';
import { useToast } from '../components/ToastProvider';

const JoinPage: React.FC = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const [invite, setInvite] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const validateInvite = async () => {
      if (!inviteCode) {
        setError('Invalid invite code');
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('invites')
          .select('*')
          .eq('code', inviteCode)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            setError('Invite code not found or already used');
          } else {
            setError('Failed to validate invite code');
          }
        } else {
          setInvite(data);
        }
      } catch (err) {
        setError('Failed to validate invite code');
      } finally {
        setLoading(false);
      }
    };

    validateInvite();
  }, [inviteCode]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-secondary">Validating invite...</p>
        </div>
      </div>
    );
  }

  if (error || !invite) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <motion.div
          className="w-full max-w-md space-y-8 p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-error flex items-center justify-center mx-auto mb-4">
              <XMarkIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Invalid Invite</h2>
            <p className="text-secondary mb-6">
              {error || 'This invite link is no longer valid or has already been used.'}
            </p>
            <Link to="/signup" className="btn btn-primary">
              Sign Up Anyway
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <motion.div
        className="w-full max-w-md space-y-8 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <HeartIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-2">You've been invited!</h2>
          <p className="text-secondary mb-6">
            Your partner has invited you to join Together Apart and start your journey together.
          </p>
        </div>

        <motion.div
          className="card bg-gradient-to-r from-primary-light to-secondary-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-center p-6">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mx-auto mb-4">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-primary mb-2">Join Together Apart</h3>
            <p className="text-secondary text-sm mb-4">
              Create your account and automatically connect with your partner
            </p>
            <div className="bg-white/50 p-3 rounded-lg mb-4">
              <p className="text-xs text-muted mb-1">Invite Code</p>
              <p className="text-lg font-mono text-primary font-bold tracking-widest">
                {inviteCode}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/signup"
            state={{ inviteCode: inviteCode }}
            className="btn btn-primary w-full"
          >
            <UserPlusIcon className="w-5 h-5" />
            Sign Up to Connect
          </Link>
          
          <Link
            to="/login"
            state={{ inviteCode: inviteCode }}
            className="btn btn-ghost w-full"
          >
            Already have an account? Sign In
          </Link>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-xs text-muted">
            By joining, you'll be automatically connected with your partner and can start sharing memories, 
            answering daily questions, and growing together.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JoinPage;