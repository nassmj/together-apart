import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, HeartIcon, CalendarIcon, StarIcon, MusicalNoteIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface EmptyStateProps {
  type: 'memories' | 'activities' | 'quests' | 'discoveries' | 'connections' | 'general';
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  showIllustration?: boolean;
  className?: string;
}

const emptyStateConfig = {
  memories: {
    icon: HeartIcon,
    title: "No memories yet",
    description: "Start capturing your special moments together. Every memory you share becomes a part of your unique story.",
    actionText: "Add First Memory",
    illustration: "💕",
    color: "pink",
  },
  activities: {
    icon: CalendarIcon,
    title: "No activities planned",
    description: "Plan your next adventure together. From virtual dates to shared experiences, create moments that bring you closer.",
    actionText: "Plan Activity",
    illustration: "🎯",
    color: "green",
  },
  quests: {
    icon: StarIcon,
    title: "No quests yet",
    description: "Embark on challenges and build routines together. Grow stronger as a couple through shared goals and achievements.",
    actionText: "Add Quest",
    illustration: "⭐",
    color: "yellow",
  },
  discoveries: {
    icon: MusicalNoteIcon,
    title: "Your exchange is empty",
    description: "Share something you love to get the conversation started. Music, movies, books, and places that move you.",
    actionText: "Share Discovery",
    illustration: "🎵",
    color: "purple",
  },
  connections: {
    icon: SparklesIcon,
    title: "No connections yet",
    description: "Start your daily connection ritual. Answer thoughtful questions and learn more about each other every day.",
    actionText: "Start Connecting",
    illustration: "💭",
    color: "blue",
  },
  general: {
    icon: SparklesIcon,
    title: "Nothing here yet",
    description: "This space is waiting for your first contribution. Start building your shared experience together.",
    actionText: "Get Started",
    illustration: "✨",
    color: "gray",
  },
};

const colorClasses = {
  pink: {
    bg: 'bg-pink/10',
    text: 'text-pink',
    border: 'border-pink/20',
    icon: 'text-pink',
  },
  green: {
    bg: 'bg-green/10',
    text: 'text-green',
    border: 'border-green/20',
    icon: 'text-green',
  },
  yellow: {
    bg: 'bg-yellow-400/10',
    text: 'text-yellow-600 dark:text-yellow-400',
    border: 'border-yellow-400/20',
    icon: 'text-yellow-600 dark:text-yellow-400',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-600 dark:text-purple-400',
    border: 'border-purple-500/20',
    icon: 'text-purple-600 dark:text-purple-400',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-500/20',
    icon: 'text-blue-600 dark:text-blue-400',
  },
  gray: {
    bg: 'bg-gray-500/10',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-500/20',
    icon: 'text-gray-600 dark:text-gray-400',
  },
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  actionText,
  onAction,
  showIllustration = true,
  className = '',
}) => {
  const config = emptyStateConfig[type];
  const colors = colorClasses[config.color as keyof typeof colorClasses];
  const IconComponent = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`text-center py-12 px-6 ${className}`}
    >
      {showIllustration && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-6"
        >
          <div className={`w-24 h-24 mx-auto rounded-full ${colors.bg} ${colors.border} border-2 flex items-center justify-center mb-4`}>
            <span className="text-4xl">{config.illustration}</span>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        <div>
          <h3 className={`text-xl font-bold ${colors.text} mb-2`}>
            {title || config.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto leading-relaxed">
            {description || config.description}
          </p>
        </div>

        {onAction && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={onAction}
            className={`inline-flex items-center px-6 py-3 ${colors.bg} ${colors.text} font-semibold rounded-lg hover:opacity-80 transition-all duration-200 border ${colors.border}`}
          >
            <IconComponent className="h-5 w-5 mr-2" />
            {actionText || config.actionText}
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
};

// Specialized empty state components for specific use cases
export const MemoriesEmptyState: React.FC<{ onAddMemory: () => void }> = ({ onAddMemory }) => (
  <EmptyState
    type="memories"
    onAction={onAddMemory}
    className="bg-gradient-to-br from-pink/5 to-pink/10 rounded-2xl border border-pink/20"
  />
);

export const ActivitiesEmptyState: React.FC<{ onAddActivity: () => void }> = ({ onAddActivity }) => (
  <EmptyState
    type="activities"
    onAction={onAddActivity}
    className="bg-gradient-to-br from-green/5 to-green/10 rounded-2xl border border-green/20"
  />
);

export const QuestsEmptyState: React.FC<{ onAddQuest: () => void }> = ({ onAddQuest }) => (
  <EmptyState
    type="quests"
    onAction={onAddQuest}
    className="bg-gradient-to-br from-yellow-400/5 to-yellow-400/10 rounded-2xl border border-yellow-400/20"
  />
);

export const DiscoveriesEmptyState: React.FC<{ onShareDiscovery: () => void }> = ({ onShareDiscovery }) => (
  <EmptyState
    type="discoveries"
    onAction={onShareDiscovery}
    className="bg-gradient-to-br from-purple-500/5 to-purple-500/10 rounded-2xl border border-purple-500/20"
  />
);

export const ConnectionsEmptyState: React.FC<{ onStartConnecting: () => void }> = ({ onStartConnecting }) => (
  <EmptyState
    type="connections"
    onAction={onStartConnecting}
    className="bg-gradient-to-br from-blue-500/5 to-blue-500/10 rounded-2xl border border-blue-500/20"
  />
);

// Loading empty state
export const LoadingEmptyState: React.FC = () => (
  <div className="text-center py-12 px-6">
    <div className="animate-spin w-12 h-12 mx-auto mb-4 border-4 border-green border-t-transparent rounded-full"></div>
    <p className="text-gray-600 dark:text-gray-400">Loading your content...</p>
  </div>
);

// Error empty state
export const ErrorEmptyState: React.FC<{ 
  title?: string; 
  description?: string; 
  onRetry?: () => void; 
}> = ({ 
  title = "Something went wrong", 
  description = "We couldn't load your content. Please try again.", 
  onRetry 
}) => (
  <div className="text-center py-12 px-6">
    <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl">⚠️</span>
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 mb-6">{description}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center px-4 py-2 bg-green text-black font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
      >
        <PlusIcon className="h-4 w-4 mr-2" />
        Try Again
      </button>
    )}
  </div>
);






