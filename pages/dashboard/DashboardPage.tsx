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
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { usePartner } from '../../contexts/PartnerContext';

// Daily Connection Prompt Component
const DailyConnectionPrompt: React.FC = () => {
  return (
    <motion.div
      className="card bg-gradient-to-r from-primary-light to-secondary-light border-primary/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
          <HeartIcon className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-primary mb-2">
            Your Daily Connection Prompt
          </h3>
          <p className="text-secondary mb-4">
            Take a moment to reflect on a shared joyful memory from the past week and tell your partner about it.
          </p>
          <button className="btn btn-primary btn-sm">
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
        <h3 className="text-xl font-semibold text-primary">Latest Notes</h3>
        <Link to="/dashboard/notes" className="text-link hover:text-link-hover text-sm font-medium">
          View All
        </Link>
      </div>
      
      <div className="space-y-3">
        {notes.map((note, index) => (
          <motion.div
            key={note.id}
            className="card hover:shadow-md transition-all duration-200"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold text-primary">{note.title}</h4>
                  <span className="badge badge-primary badge-sm">{note.tag}</span>
                </div>
                <p className="text-secondary text-sm mb-2">{note.content}</p>
                <div className="flex items-center gap-2 text-muted text-xs">
                  <ClockIcon className="w-4 h-4" />
                  {note.time}
                </div>
              </div>
              <button className="btn btn-ghost btn-sm">
                View Note
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Growth Journey Component
const GrowthJourney: React.FC = () => {
  return (
    <motion.div
      className="card bg-gradient-to-r from-accent-light to-primary-light border-accent/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
          <TrophyIcon className="w-6 h-6 text-accent-dark" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-accent-dark mb-2">
            Continue Your Growth Journey
          </h3>
          <p className="text-secondary mb-3">
            You're doing great! Pick up where you left off on 'The Communication Quest'.
          </p>
          <div className="mb-3">
            <div className="flex justify-between text-sm text-secondary mb-1">
              <span>Progress</span>
              <span>65% Complete</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '65%' }} />
            </div>
          </div>
          <button className="btn btn-accent btn-sm">
            Resume Quest
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Upcoming Dates Component
const UpcomingDates: React.FC = () => {
  const dates = [
    {
      id: 1,
      title: "Our Anniversary",
      time: "In 23 days",
      icon: HeartIcon
    },
    {
      id: 2,
      title: "Weekend Getaway",
      time: "In 45 days",
      icon: CalendarDaysIcon
    },
    {
      id: 3,
      title: "Partner's Birthday",
      time: "In 87 days",
      icon: StarIcon
    }
  ];

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-primary">Upcoming Dates</h3>
        <Link to="/dashboard/planner" className="text-link hover:text-link-hover text-sm font-medium">
          View All
        </Link>
      </div>
      
      <div className="space-y-3">
        {dates.map((date, index) => {
          const Icon = date.icon;
          return (
            <motion.div
              key={date.id}
              className="card hover:shadow-md transition-all duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary-light rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">{date.title}</h4>
                    <p className="text-secondary text-sm">{date.time}</p>
                  </div>
                </div>
                <button className="btn btn-ghost btn-sm">
                  View
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Quick Actions Component
const QuickActions: React.FC = () => {
  const actions = [
    {
      title: "Add Memory",
      icon: HeartIcon,
      path: "/dashboard/timeline",
      color: "primary"
    },
    {
      title: "Plan Date",
      icon: CalendarDaysIcon,
      path: "/dashboard/planner",
      color: "secondary"
    },
    {
      title: "Discover",
      icon: SparklesIcon,
      path: "/dashboard/discovery",
      color: "accent"
    },
    {
      title: "Growth",
      icon: TrophyIcon,
      path: "/dashboard/growth-hub",
      color: "primary"
    }
  ];

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <h3 className="text-xl font-semibold text-primary">Quick Actions</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={action.path}
                className="card hover:shadow-md transition-all duration-200 h-full"
              >
                <div className="flex flex-col items-center text-center p-4">
                  <div className={`w-12 h-12 bg-${action.color}-light rounded-xl flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 text-${action.color}`} />
                  </div>
                  <span className="font-medium text-primary">{action.title}</span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// Stats Overview Component
const StatsOverview: React.FC = () => {
  const stats = [
    {
      title: "Connection Strength",
      value: "8.7/10",
      icon: HeartIcon,
      color: "primary"
    },
    {
      title: "Days Together",
      value: "1,247",
      icon: CalendarDaysIcon,
      color: "secondary"
    },
    {
      title: "Shared Memories",
      value: "230",
      icon: StarIcon,
      color: "accent"
    },
    {
      title: "Current Streak",
      value: "7 days",
      icon: FireIcon,
      color: "primary"
    }
  ];

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            className="card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${stat.color}-light rounded-lg flex items-center justify-center`}>
                <Icon className={`w-5 h-5 text-${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-secondary">{stat.title}</p>
                <p className="text-xl font-bold text-primary">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

// Main Dashboard Component
const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();
  const { partner, loading: partnerLoading } = usePartner();

  if (loading || partnerLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-surface-alt rounded-lg w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-surface-alt rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-surface-alt rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const userName = user?.user_metadata?.full_name || 'Partner';
  const partnerName = partner?.full_name || 'your partner';

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-primary mb-2">
          Welcome back, {userName}! 👋
        </h1>
        <p className="text-secondary text-lg">
          Ready to strengthen your connection with {partnerName} today?
        </p>
      </motion.div>

      {/* Stats Overview */}
      <StatsOverview />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <DailyConnectionPrompt />
          <LatestNotes />
          <GrowthJourney />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          <UpcomingDates />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
