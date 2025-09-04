import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HeartIcon,
  CalendarDaysIcon,
  TrophyIcon,
  SparklesIcon,
  PlusIcon,
  ArrowRightIcon,
  FireIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { usePartner } from '../../contexts/PartnerContext';

// Daily Connection Prompt Component
const DailyConnectionPrompt: React.FC = () => {
  return (
    <motion.div
      className="card bg-white border-primary/20 p-8 shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <HeartIcon className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-black mb-3">
            Your Daily Connection Prompt
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Take a moment to reflect on a shared joyful memory from the past week and tell your partner about it.
          </p>
          <button className="btn btn-primary btn-lg shadow-md hover:shadow-lg transition-all duration-200">
            Answer Today's Connection
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Latest Notes Component
const LatestNotes: React.FC = () => {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Remembering our first date",
      content: "Just re-read the note from our first date. It's amazing how far we've come! Thinking about that little cafe in the city...",
      time: "Today, 10:30 AM",
      tag: "New",
      isUnread: true,
      isPinned: false
    },
    {
      id: 2,
      title: "Movie night suggestion for Friday",
      content: "Found a highly-rated romantic comedy that's streaming. It looks like something we'd both enjoy. Let me know what you think!",
      time: "Yesterday, 03:15 PM",
      tag: "New",
      isUnread: true,
      isPinned: false
    },
    {
      id: 3,
      title: "Thought about our future plans",
      content: "Had a little moment of reflection this morning about our shared dreams. Feeling so grateful for our journey together.",
      time: "2 days ago, 08:00 PM",
      tag: "New",
      isUnread: false,
      isPinned: true
    }
  ]);

  const togglePin = (noteId: number) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const markAsRead = (noteId: number) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, isUnread: false } : note
    ));
  };

  const markAllAsRead = () => {
    setNotes(notes.map(note => ({ ...note, isUnread: false })));
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
              <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-black">Latest Notes</h3>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllAsRead}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors hover:underline"
              aria-label="Mark all notes as read"
            >
              Mark all as read
            </button>
            <Link to="/dashboard/notes" className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
              View All
            </Link>
          </div>
        </div>
      
      <div className="space-y-3">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            className={`card bg-white hover:shadow-md hover:bg-gray-50 transition-all duration-200 p-6 relative ${
              note.isUnread ? 'border-l-4 border-l-blue-500' : 'border-l-4 border-l-gray-200'
            } ${note.isPinned ? 'ring-2 ring-yellow-200 bg-yellow-50' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
          >
            {/* Pin Icon */}
            <button
              onClick={() => togglePin(note.id)}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                note.isPinned 
                  ? 'text-yellow-600 bg-yellow-100 hover:bg-yellow-200' 
                  : 'text-gray-400 hover:text-yellow-600 hover:bg-yellow-50'
              }`}
              aria-label={note.isPinned ? 'Unpin note' : 'Pin note'}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
            </button>

            <div className="flex items-start justify-between pr-12">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-black">{note.title}</h4>
                  {note.isUnread && (
                    <span className="badge badge-primary text-xs">NEW</span>
                  )}
                  {note.isPinned && (
                    <span className="badge badge-secondary text-xs">PINNED</span>
                  )}
                </div>
                <p className="text-gray-700 text-sm mb-2">{note.content}</p>
                <span className="text-gray-500 text-xs">{note.time}</span>
              </div>
            </div>

            {/* Mark as Read Button */}
            {note.isUnread && (
              <button
                onClick={() => markAsRead(note.id)}
                className="absolute bottom-3 right-3 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                aria-label="Mark as read"
              >
                Mark as read
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Quick Actions Component
const QuickActions: React.FC = () => {
  const actions = [
    {
      name: 'Add Memory',
      icon: PlusIcon,
      path: '/dashboard/timeline',
      color: 'bg-primary',
      description: 'Capture a special moment'
    },
    {
      name: 'Plan Date',
      icon: CalendarDaysIcon,
      path: '/dashboard/planner',
      color: 'bg-secondary',
      description: 'Schedule time together'
    },
    {
      name: 'Share Discovery',
      icon: SparklesIcon,
      path: '/dashboard/discovery',
      color: 'bg-accent',
      description: 'Share something new'
    },
    {
      name: 'View Insights',
      icon: ChartBarIcon,
      path: '/dashboard/insights',
      color: 'bg-success',
      description: 'See your progress'
    }
  ];

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h3 className="text-xl font-semibold text-black">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
          >
            <Link
              to={action.path}
              className="card bg-white p-4 text-center hover:shadow-md hover:bg-gray-50 transition-all duration-200 group aspect-square flex flex-col justify-center"
            >
              <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-black mb-2 text-sm">{action.name}</h4>
              <p className="text-gray-600 text-xs leading-tight">{action.description}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Relationship Stats Component
const RelationshipStats: React.FC = () => {
  const stats = [
    {
      name: 'Days Together',
      value: '365',
      icon: HeartIcon,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      path: '/dashboard/insights',
      tooltip: 'Total days since you started your relationship journey together'
    },
    {
      name: 'Memories Shared',
      value: '127',
      icon: StarIcon,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
      path: '/dashboard/timeline',
      tooltip: 'Number of special moments and memories you\'ve captured together'
    },
    {
      name: 'Plans Made',
      value: '89',
      icon: CalendarDaysIcon,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      path: '/dashboard/planner',
      tooltip: 'Future adventures and activities you\'ve planned as a couple'
    },
    {
      name: 'Goals Achieved',
      value: '23',
      icon: TrophyIcon,
      color: 'text-success',
      bgColor: 'bg-success/10',
      path: '/dashboard/growth-hub',
      tooltip: 'Relationship goals and challenges you\'ve successfully completed'
    }
  ];

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <h3 className="text-xl font-semibold text-black">Relationship Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
          >
            <Link
              to={stat.path}
              className="card bg-white p-6 text-center hover:shadow-md hover:bg-gray-50 transition-all duration-200 cursor-pointer group relative"
              aria-label={`View ${stat.name} details`}
            >
              <div className="relative">
                <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                {/* Tooltip */}
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-gray-800 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs">?</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-black mb-2 group-hover:text-primary transition-colors">{stat.value}</div>
              <div className="text-gray-600 text-sm font-medium">{stat.name}</div>
              
              {/* Tooltip Content */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {stat.tooltip}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { partner } = usePartner();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [onboardingSteps, setOnboardingSteps] = useState([
    { id: 1, text: 'Invite your partner', completed: false, path: '/dashboard/connect' },
    { id: 2, text: 'Answer today\'s connection prompt', completed: false, path: '/dashboard/daily-connection' },
    { id: 3, text: 'Add your first memory', completed: false, path: '/dashboard/timeline' }
  ]);

  const completeStep = (stepId: number) => {
    setOnboardingSteps(steps => 
      steps.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  };

  const dismissOnboarding = () => {
    setShowOnboarding(false);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-black mb-2">
          Welcome back, {user?.user_metadata?.full_name || 'Partner'}!
        </h1>
        <p className="text-gray-700">
          Ready to make today special? ✨
        </p>
      </motion.div>

      {/* Onboarding for First-Time Users */}
      {showOnboarding && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 shadow-sm"
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Welcome to Together Apart! 🎉</h3>
              <p className="text-blue-700 text-sm">Complete these steps to get started with your relationship journey:</p>
            </div>
            <button
              onClick={dismissOnboarding}
              className="text-blue-500 hover:text-blue-700 text-sm font-medium"
              aria-label="Dismiss onboarding"
            >
              Dismiss
            </button>
          </div>
          
          <div className="space-y-3">
            {onboardingSteps.map((step) => (
              <div key={step.id} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : 'bg-blue-200 text-blue-700'
                }`}>
                  {step.completed ? '✓' : step.id}
                </div>
                <span className={`text-sm ${
                  step.completed ? 'text-green-700 line-through' : 'text-blue-800'
                }`}>
                  {step.text}
                </span>
                {!step.completed && (
                  <Link
                    to={step.path}
                    className="ml-auto text-blue-600 hover:text-blue-800 text-sm font-medium underline"
                    onClick={() => completeStep(step.id)}
                  >
                    Get Started
                  </Link>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Search with Scope */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-black mb-3">Search Everything</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search memories, plans, notes, and more..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
            />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Search Scope Chips */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Memories', 'Plans', 'Quests', 'Notes'].map((scope) => (
            <button
              key={scope}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                scope === 'All' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-label={`Search in ${scope}`}
            >
              {scope}
            </button>
          ))}
        </div>
      </div>

      {/* Daily Connection Prompt */}
      <DailyConnectionPrompt />

      {/* Quick Actions */}
      <QuickActions />

      {/* Relationship Stats */}
      <RelationshipStats />

      {/* Latest Notes */}
      <LatestNotes />
    </div>
  );
};

export default DashboardPage;
