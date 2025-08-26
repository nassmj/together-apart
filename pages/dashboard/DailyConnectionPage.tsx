import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { usePartner } from '../../contexts/PartnerContext';
import { useAuth } from '../../contexts/AuthContext';
import { useDailyConnections } from '../../hooks/useDailyConnections';
import { useToast } from '../../components/ToastProvider';
import { LoadingSpinner, SkeletonCard } from '../../components/LoadingSpinner';
import { trackDailyConnectionAnswered, trackPageView } from '../../utils/analytics';
import { recordImpression } from '../../utils/abTesting';
import { notifyConnectionAnswered } from '../../utils/realtime';
import {
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  CheckIcon,
  ClockIcon,
  UserIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

// Today's Question Component
const TodaysQuestion: React.FC<{
  question: string;
  userAnswer: string | null;
  partnerAnswer: string | null;
  onSubmit: (answer: string) => void;
  isSubmitting: boolean;
  partnerName: string;
}> = ({ question, userAnswer, partnerAnswer, onSubmit, isSubmitting, partnerName }) => {
  const [answer, setAnswer] = useState(userAnswer || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      onSubmit(answer.trim());
    }
  };

  return (
    <motion.div
      className="card bg-gradient-to-r from-primary-light to-secondary-light border-primary/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary">Today's Connection</h2>
          <p className="text-secondary">Share your thoughts and stay connected</p>
        </div>
      </div>

      <div className="mb-6 p-6 bg-white/50 rounded-xl border border-primary/10">
        <p className="text-lg font-semibold text-primary italic">"{question}"</p>
      </div>

      {userAnswer ? (
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <UserIcon className="w-4 h-4 text-primary" />
              <span className="font-semibold text-primary">Your Answer</span>
              <CheckIcon className="w-4 h-4 text-success" />
            </div>
            <div className="bg-white/70 p-4 rounded-lg border border-primary/20">
              <p className="text-secondary">{userAnswer}</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <UserIcon className="w-4 h-4 text-secondary" />
              <span className="font-semibold text-secondary">{partnerName}'s Answer</span>
              {partnerAnswer ? (
                <CheckIcon className="w-4 h-4 text-success" />
              ) : (
                <ClockIcon className="w-4 h-4 text-muted" />
              )}
            </div>
            <div className="bg-white/70 p-4 rounded-lg border border-secondary/20">
              {partnerAnswer ? (
                <p className="text-secondary">{partnerAnswer}</p>
              ) : (
                <p className="text-muted italic">Waiting for {partnerName} to answer...</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="answer" className="block text-sm font-semibold text-primary mb-2">
              Your Answer
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Share your thoughts..."
              className="input min-h-[120px] resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting || !answer.trim()}
            className="btn btn-primary w-full"
          >
            {isSubmitting ? (
              <>
                <LoadingSpinner size="sm" />
                Submitting...
              </>
            ) : (
              <>
                <HeartIcon className="w-5 h-5" />
                Share Answer
              </>
            )}
          </button>
        </form>
      )}
    </motion.div>
  );
};

// Connection History Card Component
const ConnectionCard: React.FC<{ 
  connection: any; 
  index: number;
  userAnswer: string | null;
  partnerAnswer: string | null;
  partnerName: string;
}> = ({ connection, index, userAnswer, partnerAnswer, partnerName }) => {
  return (
    <motion.div
      className="card hover:shadow-md transition-all duration-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <CalendarDaysIcon className="w-5 h-5 text-muted" />
        <span className="text-sm font-semibold text-muted">
          {new Date(connection.date + 'T00:00:00').toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </span>
      </div>

      <div className="mb-6 p-4 bg-surface-alt rounded-lg border border-border">
        <p className="font-semibold text-primary text-lg italic">"{connection.question}"</p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UserIcon className="w-4 h-4 text-primary" />
            <span className="font-semibold text-primary">Your Answer</span>
          </div>
          <div className="bg-primary-light p-4 rounded-lg border border-primary/20">
            {userAnswer ? (
              <p className="text-secondary">{userAnswer}</p>
            ) : (
              <p className="text-muted italic">No answer given</p>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <UserIcon className="w-4 h-4 text-secondary" />
            <span className="font-semibold text-secondary">{partnerName}'s Answer</span>
          </div>
          <div className="bg-secondary-light p-4 rounded-lg border border-secondary/20">
            {partnerAnswer ? (
              <p className="text-secondary">{partnerAnswer}</p>
            ) : (
              <p className="text-muted italic">No answer given</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Daily Connection Component
const DailyConnectionPage: React.FC = () => {
  const { couple, partner } = usePartner();
  const { user } = useAuth();
  const toast = useToast();
  const [showHistory, setShowHistory] = useState(false);

  // Analytics tracking
  React.useEffect(() => {
    if (user) {
      trackPageView('daily-connection');
      recordImpression(user.id, 'daily-connection-style');
    }
  }, [user]);

  const {
    connections,
    todayConnection,
    isLoading,
    isError,
    submitAnswer,
    isUpdating,
    refetch
  } = useDailyConnections({
    coupleId: couple?.id || '',
    enabled: !!couple?.id
  });

  const handleSubmitAnswer = async (answer: string) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      await submitAnswer(answer, user.id);
      
      // Analytics tracking
      trackDailyConnectionAnswered('daily-question');
      if (partner && todayConnection) {
        notifyConnectionAnswered(todayConnection, user.id, partner.id);
      }
      
      toast.success('Answer submitted successfully!');
      refetch();
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast.error('Failed to submit answer. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">Daily Connection</h1>
          <p className="text-secondary">Loading your connection...</p>
        </div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-bold text-primary mb-2">Something went wrong</h2>
        <p className="text-secondary mb-6">We couldn't load your daily connections.</p>
        <button onClick={() => refetch()} className="btn btn-primary">
          Try Again
        </button>
      </div>
    );
  }

  const todayAnswers = todayConnection?.answers as Record<string, string> || {};
  const userAnswer = user?.id ? todayAnswers[user.id] : null;
  const partnerAnswer = partner?.id ? todayAnswers[partner.id] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Daily Connection</h1>
        <p className="text-secondary">
          Stay connected with daily questions and meaningful conversations
        </p>
      </div>

      {/* Today's Question */}
      {todayConnection && (
        <TodaysQuestion
          question={todayConnection.question}
          userAnswer={userAnswer}
          partnerAnswer={partnerAnswer}
          onSubmit={handleSubmitAnswer}
          isSubmitting={isUpdating}
          partnerName={partner?.full_name || 'Partner'}
        />
      )}

      {/* Connection Stats */}
      <motion.div
        className="card bg-gradient-to-r from-accent-light to-primary-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-primary">Connection Streak</h3>
              <p className="text-secondary">Keep the conversation going!</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-primary">{connections.length}</div>
            <div className="text-sm text-secondary">Total Connections</div>
          </div>
        </div>
      </motion.div>

      {/* History Toggle */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="btn btn-ghost"
        >
          {showHistory ? 'Hide' : 'Show'} Connection History
        </button>
      </div>

      {/* Connection History */}
      {showHistory && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-primary">Connection History</h2>
          
          {connections.length > 0 ? (
            <div className="space-y-6">
              {connections.slice(1).map((connection, index) => {
                const answers = connection.answers as Record<string, string> || {};
                const userAns = user?.id ? answers[user.id] : null;
                const partnerAns = partner?.id ? answers[partner.id] : null;
                
                return (
                  <ConnectionCard
                    key={connection.id}
                    connection={connection}
                    index={index}
                    userAnswer={userAns}
                    partnerAnswer={partnerAns}
                    partnerName={partner?.full_name || 'Partner'}
                  />
                );
              })}
            </div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="text-6xl mb-4">💕</div>
              <h3 className="text-xl font-semibold text-primary mb-2">Start Your Journey</h3>
              <p className="text-secondary">
                Answer today's question to begin your connection history!
              </p>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyConnectionPage;
