import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrophyIcon,
  StarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  FireIcon,
  ClockIcon,
  CheckCircleIcon,
  LightBulbIcon,
  HeartIcon,
  SparklesIcon,
  ChartBarIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

// Quest Interface
interface Quest {
  id: string;
  title: string;
  description: string;
  category: 'communication' | 'romance' | 'adventure' | 'learning' | 'wellness' | 'creativity';
  difficulty: 'easy' | 'medium' | 'hard';
  duration: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
  streak: number;
  maxStreak: number;
  rewards: string[];
  isFavorite: boolean;
  participants: string[];
  dueDate?: string;
}

// Quest Card Component
const QuestCard: React.FC<{ quest: Quest; onStart?: (quest: Quest) => void; onView?: (quest: Quest) => void }> = ({ quest, onStart, onView }) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'communication': return 'primary';
      case 'romance': return 'primary';
      case 'adventure': return 'secondary';
      case 'learning': return 'accent';
      case 'wellness': return 'secondary';
      case 'creativity': return 'accent';
      default: return 'primary';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'error';
      default: return 'success';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started': return 'muted';
      case 'in_progress': return 'success';
      case 'completed': return 'primary';
      default: return 'muted';
    }
  };

  const categoryColor = getCategoryColor(quest.category);
  const difficultyColor = getDifficultyColor(quest.difficulty);
  const statusColor = getStatusColor(quest.status);

  return (
    <motion.div
      className="card hover:shadow-md transition-all duration-200 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={() => onView?.(quest)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-${categoryColor}-light rounded-xl flex items-center justify-center`}>
            <TrophyIcon className={`w-6 h-6 text-${categoryColor}`} />
          </div>
          <div>
            <h3 className="font-semibold text-primary">{quest.title}</h3>
            <p className="text-secondary text-sm">{quest.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {quest.isFavorite && (
            <StarIcon className="w-5 h-5 text-accent fill-current" />
          )}
          <span className={`badge badge-${statusColor}`}>
            {quest.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      {quest.status === 'in_progress' && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-secondary mb-1">
            <span>Progress</span>
            <span>{quest.progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${quest.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-secondary">
          <ClockIcon className="w-4 h-4" />
          {quest.duration}
        </div>
        <div className="flex items-center gap-2 text-sm text-secondary">
          <FireIcon className="w-4 h-4" />
          {quest.streak} day streak
        </div>
        <div className="flex items-center gap-2 text-sm text-secondary">
          <UserGroupIcon className="w-4 h-4" />
          {quest.participants.length} participants
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <span className={`badge badge-${categoryColor} badge-sm`}>
            {quest.category}
          </span>
          <span className={`badge badge-${difficultyColor} badge-sm`}>
            {quest.difficulty}
          </span>
        </div>
        
        {quest.status === 'not_started' && (
          <button 
            className="btn btn-primary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onStart?.(quest);
            }}
          >
            Start Quest
          </button>
        )}
        
        {quest.status === 'in_progress' && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(quest);
            }}
          >
            Continue
          </button>
        )}
        
        {quest.status === 'completed' && (
          <div className="flex items-center gap-1 text-success">
            <CheckCircleIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Completed!</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// Quest Details Modal
const QuestDetailsModal: React.FC<{ 
  quest: Quest | null; 
  isOpen: boolean; 
  onClose: () => void;
  onQuestStart?: (quest: Quest) => void;
  onQuestContinue?: (quest: Quest) => void;
}> = ({ quest, isOpen, onClose, onQuestStart, onQuestContinue }) => {
  if (!quest) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <motion.div
            className="relative bg-surface rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-primary">{quest.title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-surface-alt transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-primary mb-2">Description</h3>
                  <p className="text-secondary">{quest.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Category</h3>
                    <span className="badge badge-primary">{quest.category}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Difficulty</h3>
                    <span className="badge badge-warning">{quest.difficulty}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Duration</h3>
                    <p className="text-secondary">{quest.duration}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Current Streak</h3>
                    <p className="text-secondary">{quest.streak} days</p>
                  </div>
                </div>

                {quest.status === 'in_progress' && (
                  <div>
                    <h3 className="font-semibold text-primary mb-2">Progress</h3>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill" 
                        style={{ width: `${quest.progress}%` }}
                      />
                    </div>
                    <p className="text-sm text-secondary mt-1">{quest.progress}% complete</p>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-primary mb-2">Rewards</h3>
                  <div className="flex flex-wrap gap-2">
                    {quest.rewards.map((reward, index) => (
                      <span key={index} className="badge badge-accent">
                        {reward}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={onClose}
                    className="btn btn-ghost flex-1"
                  >
                    Close
                  </button>
                  {quest.status === 'not_started' && (
                    <button 
                      className="btn btn-primary flex-1"
                      onClick={() => {
                        onQuestStart?.(quest);
                        onClose();
                      }}
                    >
                      Start Quest
                    </button>
                  )}
                  {quest.status === 'in_progress' && (
                    <button 
                      className="btn btn-secondary flex-1"
                      onClick={() => {
                        onQuestContinue?.(quest);
                        onClose();
                      }}
                    >
                      Continue Quest
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Growth Hub Component
const GrowthHubPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'in_progress' | 'not_started' | 'completed'>('in_progress');

  // Sample quests data
  const quests: Quest[] = [
    {
      id: '1',
      title: 'Daily Gratitude Ritual',
      description: 'Start each day by sharing three things you are grateful for with your partner. This simple practice can transform your relationship.',
      category: 'communication',
      difficulty: 'easy',
      duration: '5 minutes daily',
      progress: 65,
      status: 'in_progress',
      streak: 7,
      maxStreak: 30,
      rewards: ['Improved Communication', 'Gratitude Badge', 'Relationship Points'],
      isFavorite: true,
      participants: ['Nasser', 'Partner']
    },
    {
      id: '2',
      title: 'Weekly Date Night Planning',
      description: 'Collaborate to plan a meaningful date night each week, ensuring quality time together and shared decision-making.',
      category: 'romance',
      difficulty: 'medium',
      duration: '1 hour weekly',
      progress: 30,
      status: 'in_progress',
      streak: 3,
      maxStreak: 12,
      rewards: ['Romance Badge', 'Planning Skills', 'Quality Time'],
      isFavorite: false,
      participants: ['Nasser', 'Partner']
    },
    {
      id: '3',
      title: 'Learn Something New Together',
      description: 'Choose a skill or hobby you both want to learn and practice it together. Great for bonding and personal growth.',
      category: 'learning',
      difficulty: 'medium',
      duration: '2 hours weekly',
      progress: 0,
      status: 'not_started',
      streak: 0,
      maxStreak: 8,
      rewards: ['Learning Badge', 'New Skills', 'Shared Achievement'],
      isFavorite: true,
      participants: ['Nasser', 'Partner']
    },
    {
      id: '4',
      title: 'Adventure Challenge',
      description: 'Try something new and adventurous together - whether it\'s hiking, cooking a new cuisine, or exploring a new place.',
      category: 'adventure',
      difficulty: 'hard',
      duration: '4 hours monthly',
      progress: 0,
      status: 'not_started',
      streak: 0,
      maxStreak: 6,
      rewards: ['Adventure Badge', 'Courage Points', 'Memories'],
      isFavorite: false,
      participants: ['Nasser', 'Partner']
    },
    {
      id: '5',
      title: 'Mindfulness Practice',
      description: 'Practice mindfulness or meditation together to improve emotional connection and reduce stress.',
      category: 'wellness',
      difficulty: 'easy',
      duration: '10 minutes daily',
      progress: 100,
      status: 'completed',
      streak: 21,
      maxStreak: 21,
      rewards: ['Wellness Badge', 'Peace Badge', 'Stress Reduction'],
      isFavorite: true,
      participants: ['Nasser', 'Partner']
    },
    {
      id: '6',
      title: 'Creative Expression',
      description: 'Engage in creative activities together - painting, writing, music, or any form of artistic expression.',
      category: 'creativity',
      difficulty: 'medium',
      duration: '1 hour weekly',
      progress: 0,
      status: 'not_started',
      streak: 0,
      maxStreak: 10,
      rewards: ['Creativity Badge', 'Artistic Skills', 'Self-Expression'],
      isFavorite: false,
      participants: ['Nasser', 'Partner']
    }
  ];

  const filteredQuests = quests.filter(quest => {
    const matchesSearch = quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || quest.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || quest.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const inProgressQuests = filteredQuests.filter(quest => quest.status === 'in_progress');
  const completedQuests = filteredQuests.filter(quest => quest.status === 'completed');
  const notStartedQuests = filteredQuests.filter(quest => quest.status === 'not_started');

  const handleQuestView = (quest: Quest) => {
    setSelectedQuest(quest);
    setIsDetailsModalOpen(true);
  };

  const handleQuestStart = (quest: Quest) => {
    // Update quest status to in_progress
    const updatedQuest = { ...quest, status: 'in_progress' as const };
    setSelectedQuest(updatedQuest);
    
    // Update the quest in the local state
    const updatedQuests = quests.map(q => 
      q.id === quest.id ? updatedQuest : q
    );
    
    // In a real app, this would be saved to the database
    console.log('Quest started:', updatedQuest);
    
    // Show success message
    alert('Quest started successfully!');
  };

  const handleQuestContinue = (quest: Quest) => {
    // Increment progress and potentially complete the quest
    const newProgress = Math.min(quest.progress + 10, 100);
    const newStatus = newProgress >= 100 ? 'completed' as const : 'in_progress' as const;
    
    const updatedQuest = { 
      ...quest, 
      progress: newProgress, 
      status: newStatus,
      streak: quest.streak + 1
    };
    
    setSelectedQuest(updatedQuest);
    
    // Update the quest in the local state
    const updatedQuests = quests.map(q => 
      q.id === quest.id ? updatedQuest : q
    );
    
    // In a real app, this would be saved to the database
    console.log('Quest progress updated:', updatedQuest);
    
    if (newStatus === 'completed') {
      alert('Congratulations! Quest completed!');
    } else {
      alert('Great progress! Keep it up!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Growth Hub</h1>
          <p className="text-secondary">
            Grow together through challenges, quests, and relationship development
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost">
            <ChartBarIcon className="w-5 h-5" />
            View Progress
          </button>
          <button className="btn btn-primary">
            <PlusIcon className="w-5 h-5" />
            Create Quest
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
              <TrophyIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-secondary">Active Quests</p>
              <p className="text-xl font-bold text-primary">{inProgressQuests.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-light rounded-lg flex items-center justify-center">
              <CheckCircleIcon className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-secondary">Completed</p>
              <p className="text-xl font-bold text-primary">{completedQuests.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-light rounded-lg flex items-center justify-center">
              <FireIcon className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-secondary">Current Streak</p>
              <p className="text-xl font-bold text-primary">7 days</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary-light rounded-lg flex items-center justify-center">
              <StarIcon className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <p className="text-sm text-secondary">Total Points</p>
              <p className="text-xl font-bold text-primary">1,247</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search quests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input"
          >
            <option>All Categories</option>
            <option>communication</option>
            <option>romance</option>
            <option>adventure</option>
            <option>learning</option>
            <option>wellness</option>
            <option>creativity</option>
          </select>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input"
          >
            <option>All</option>
            <option>not_started</option>
            <option>in_progress</option>
            <option>completed</option>
          </select>
        </div>
      </div>

      {/* Quests Tabs */}
      <div className="flex gap-1 p-1 bg-surface-alt rounded-lg">
        <button 
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'in_progress' 
              ? 'bg-primary text-white font-medium' 
              : 'text-secondary hover:text-primary'
          }`}
          onClick={() => setActiveTab('in_progress')}
        >
          In Progress ({inProgressQuests.length})
        </button>
        <button 
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'not_started' 
              ? 'bg-primary text-white font-medium' 
              : 'text-secondary hover:text-primary'
          }`}
          onClick={() => setActiveTab('not_started')}
        >
          Available ({notStartedQuests.length})
        </button>
        <button 
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            activeTab === 'completed' 
              ? 'bg-primary text-white font-medium' 
              : 'text-secondary hover:text-primary'
          }`}
          onClick={() => setActiveTab('completed')}
        >
          Completed ({completedQuests.length})
        </button>
      </div>

      {/* Quests Grid */}
      {(() => {
        const currentQuests = activeTab === 'in_progress' ? inProgressQuests :
                             activeTab === 'not_started' ? notStartedQuests :
                             completedQuests;
        
        return currentQuests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentQuests.map((quest, index) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onStart={handleQuestStart}
                onView={handleQuestView}
              />
            ))}
          </div>
        ) : (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <TrophyIcon className="w-16 h-16 text-muted mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-primary mb-2">No active quests</h3>
          <p className="text-secondary mb-6">
            {searchQuery || selectedCategory !== 'All Categories' || selectedStatus !== 'All'
              ? 'Try adjusting your search or filters'
              : 'Start your growth journey together with exciting quests'}
          </p>
          {!searchQuery && selectedCategory === 'All Categories' && selectedStatus === 'All' && (
            <button className="btn btn-primary">
              <PlusIcon className="w-5 h-5" />
              Start Your First Quest
            </button>
          )}
        </motion.div>
      );
      })()}

      {/* Quest Details Modal */}
      <QuestDetailsModal
        quest={selectedQuest}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedQuest(null);
        }}
        onQuestStart={handleQuestStart}
        onQuestContinue={handleQuestContinue}
      />
    </div>
  );
};

export default GrowthHubPage;
