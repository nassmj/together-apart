import React from 'react';
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
      className="card bg-dark-card border-primary/20 p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
          <HeartIcon className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white-shadow mb-3">
            Your Daily Connection Prompt
          </h3>
          <p className="text-white/90 text-lg leading-relaxed text-shadow-sm mb-6">
            Take a moment to reflect on a shared joyful memory from the past week and tell your partner about it.
          </p>
          <button className="btn btn-primary btn-lg shadow-md hover:shadow-lg transition-all duration-200">
            Share Memory
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Latest Notes Component
const LatestNotes: React.FC = () => {
  const notes = [
    {
      id: 1,
      title: "Remembering our first date",
      content: "Just re-read the note from our first date. It's amazing how far we've come! Thinking about that little cafe in the city...",
      time: "Today, 10:30 AM",
      tag: "New"
    },
    {
      id: 2,
      title: "Movie night suggestion for Friday",
      content: "Found a highly-rated romantic comedy that's streaming. It looks like something we'd both enjoy. Let me know what you think!",
      time: "Yesterday, 03:15 PM",
      tag: "New"
    },
    {
      id: 3,
      title: "Thought about our future plans",
      content: "Had a little moment of reflection this morning about our shared dreams. Feeling so grateful for our journey together.",
      time: "2 days ago, 08:00 PM",
      tag: "New"
    }
  ];

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-white-shadow">Latest Notes</h3>
        <Link to="/dashboard/notes" className="text-white/90 hover:text-white text-sm font-medium transition-colors">
          View All
        </Link>
      </div>
      
      <div className="space-y-3">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            className="card bg-dark-card hover:shadow-md hover:bg-dark-card-hover transition-all duration-200 p-6 border-l-4 border-l-primary/20"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-white-shadow">{note.title}</h4>
                  <span className="badge badge-primary">{note.tag}</span>
                </div>
                <p className="text-white/90 text-sm mb-2 text-shadow-sm">{note.content}</p>
                <span className="text-white/70 text-xs text-shadow-sm">{note.time}</span>
              </div>
            </div>
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
      <h3 className="text-xl font-semibold text-white-shadow">Quick Actions</h3>
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
              className="card bg-dark-card p-4 text-center hover:shadow-md hover:bg-dark-card-hover transition-all duration-200 group aspect-square flex flex-col justify-center"
            >
              <div className={`w-16 h-16 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-white-shadow mb-2 text-sm">{action.name}</h4>
              <p className="text-white/80 text-xs leading-tight text-shadow-sm">{action.description}</p>
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
      bgColor: 'bg-primary/10'
    },
    {
      name: 'Memories Shared',
      value: '127',
      icon: StarIcon,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10'
    },
    {
      name: 'Plans Made',
      value: '89',
      icon: CalendarDaysIcon,
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    },
    {
      name: 'Goals Achieved',
      value: '23',
      icon: TrophyIcon,
      color: 'text-success',
      bgColor: 'bg-success/10'
    }
  ];

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <h3 className="text-xl font-semibold text-white-shadow">Relationship Stats</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            className="card bg-dark-card p-6 text-center hover:shadow-md hover:bg-dark-card-hover transition-all duration-200"
          >
            <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div className="text-3xl font-bold text-white-shadow mb-2">{stat.value}</div>
            <div className="text-white/80 text-sm font-medium text-shadow-sm">{stat.name}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { partner } = usePartner();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold text-white-shadow mb-2">
          Welcome back, {user?.user_metadata?.full_name || 'Partner'}!
        </h1>
        <p className="text-white/90 text-shadow-sm">
          Ready to make today special? ✨
        </p>
      </motion.div>

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
