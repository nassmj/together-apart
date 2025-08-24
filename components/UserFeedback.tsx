import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StarIcon, ChatBubbleLeftIcon, LightBulbIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ToastProvider';

interface FeedbackData {
  rating: number;
  comment: string;
  category: 'general' | 'feature' | 'bug' | 'suggestion';
  email?: string;
}

interface UserFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  onFeedbackSubmit?: (feedback: FeedbackData) => void;
  className?: string;
}

const feedbackCategories = [
  { id: 'general', label: 'General Feedback', icon: ChatBubbleLeftIcon },
  { id: 'feature', label: 'Feature Request', icon: LightBulbIcon },
  { id: 'bug', label: 'Bug Report', icon: '🐛' },
  { id: 'suggestion', label: 'Suggestion', icon: '💡' },
];

export const UserFeedback: React.FC<UserFeedbackProps> = ({
  isOpen,
  onClose,
  onFeedbackSubmit,
  className = '',
}) => {
  const { user } = useAuth();
  const toast = useToast();
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    comment: '',
    category: 'general',
    email: user?.email || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingChange = (rating: number) => {
    setFeedback(prev => ({ ...prev, rating }));
  };

  const handleCategoryChange = (category: FeedbackData['category']) => {
    setFeedback(prev => ({ ...prev, category }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedback.comment.trim()) {
      toast.error('Please provide some feedback');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // In a real app, you would send this to your backend
      console.log('Feedback submitted:', feedback);
      
      // Call the callback if provided
      onFeedbackSubmit?.(feedback);
      
      toast.success('Thank you for your feedback!');
      onClose();
      
      // Reset form
      setFeedback({
        rating: 0,
        comment: '',
        category: 'general',
        email: user?.email || '',
      });
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Very Poor';
      case 2: return 'Poor';
      case 3: return 'Fair';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return 'Rate your experience';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden ${className}`}
      >
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Share Your Feedback
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Help us improve Together Apart with your thoughts and suggestions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                How would you rate your experience?
              </label>
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="p-1 transition-colors"
                  >
                    <StarIcon
                      className={`h-8 w-8 ${
                        star <= feedback.rating
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {getRatingText(feedback.rating)}
              </p>
            </div>

            {/* Category Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                What type of feedback is this?
              </label>
              <div className="grid grid-cols-2 gap-2">
                {feedbackCategories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryChange(category.id as FeedbackData['category'])}
                    className={`p-3 rounded-lg border-2 transition-colors text-sm font-medium ${
                      feedback.category === category.id
                        ? 'border-green bg-green/10 text-green'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-green/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      {typeof category.icon === 'string' ? (
                        <span className="text-lg">{category.icon}</span>
                      ) : (
                        <category.icon className="h-4 w-4" />
                      )}
                      <span>{category.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Comment */}
            <div>
              <label htmlFor="feedback-comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tell us more about your experience
              </label>
              <textarea
                id="feedback-comment"
                value={feedback.comment}
                onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                rows={4}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent resize-none"
                placeholder="Share your thoughts, suggestions, or report any issues..."
              />
            </div>

            {/* Email (optional) */}
            {!user && (
              <div>
                <label htmlFor="feedback-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email (optional - for follow-up)
                </label>
                <input
                  type="email"
                  id="feedback-email"
                  value={feedback.email}
                  onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !feedback.comment.trim()}
                className="flex-1 px-4 py-3 bg-green text-black font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

// Quick feedback trigger component
export const FeedbackTrigger: React.FC<{ onOpen: () => void }> = ({ onOpen }) => (
  <button
    onClick={onOpen}
    className="fixed bottom-6 right-6 w-14 h-14 bg-green text-black rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
    aria-label="Share feedback"
  >
    <ChatBubbleLeftIcon className="h-6 w-6" />
    <span className="absolute right-16 bg-gray-900 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
      Share Feedback
    </span>
  </button>
);



