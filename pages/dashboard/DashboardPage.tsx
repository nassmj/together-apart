import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../../components/dashboard/BottomNav';

// Icons (using emoji for simplicity)
const HeartIcon = () => <span>💕</span>;
const CalendarIcon = () => <span>📅</span>;
const TrophyIcon = () => <span>🏆</span>;
const MessageIcon = () => <span>💬</span>;
const StarIcon = () => <span>⭐</span>;
const FireIcon = () => <span>🔥</span>;
const ClockIcon = () => <span>⏰</span>;
const CheckIcon = () => <span>✅</span>;
const PlusIcon = () => <span>➕</span>;
const ArrowIcon = () => <span>➡️</span>;

const DashboardPage: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState('happy');
  const [dailyStreak, setDailyStreak] = useState(7);
  const [relationshipScore, setRelationshipScore] = useState(87);

  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy', color: 'var(--mood-happy)' },
    { id: 'romantic', emoji: '💕', label: 'Romantic', color: 'var(--mood-romantic)' },
    { id: 'excited', emoji: '🤩', label: 'Excited', color: 'var(--mood-excited)' },
    { id: 'calm', emoji: '😌', label: 'Calm', color: 'var(--mood-calm)' },
    { id: 'passionate', emoji: '🔥', label: 'Passionate', color: 'var(--mood-passionate)' },
    { id: 'peaceful', emoji: '🌸', label: 'Peaceful', color: 'var(--mood-peaceful)' },
  ];

  const dailyActivities = [
    {
      id: 1,
      title: "Morning Love Note",
      description: "Send a sweet message to start their day",
      category: "Communication",
      time: "9:00 AM",
      completed: true,
      icon: MessageIcon,
    },
    {
      id: 2,
      title: "Virtual Coffee Date",
      description: "15-minute video call over coffee",
      category: "Connection",
      time: "2:00 PM",
      completed: false,
      icon: CalendarIcon,
    },
    {
      id: 3,
      title: "Share Today's Wins",
      description: "Tell each other about your achievements",
      category: "Growth",
      time: "6:00 PM",
      completed: false,
      icon: TrophyIcon,
    },
  ];

  const weeklyGoals = [
    { id: 1, title: "Plan Weekend Adventure", progress: 75, category: "Planning" },
    { id: 2, title: "Learn Something New Together", progress: 40, category: "Growth" },
    { id: 3, title: "Create Shared Playlist", progress: 100, category: "Fun" },
  ];

  const quickActions = [
    { id: 1, title: "Send Love Note", icon: MessageIcon, color: "var(--accent-primary)" },
    { id: 2, title: "Plan Date", icon: CalendarIcon, color: "var(--accent-secondary)" },
    { id: 3, title: "Share Memory", icon: HeartIcon, color: "var(--accent-purple)" },
    { id: 4, title: "Growth Task", icon: TrophyIcon, color: "var(--accent-success)" },
  ];

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1 className="text-display">Together Apart</h1>
            </div>
            <div className="header-right">
              <div className="flex items-center gap-md">
                <span className="text-caption">Day {dailyStreak}</span>
                <div className="progress-ring" style={{ '--progress': relationshipScore } as React.CSSProperties}>
                  <svg>
                    <circle className="bg" cx="30" cy="30" r="25" />
                    <circle className="progress" cx="30" cy="30" r="25" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-caption font-600">{relationshipScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Welcome Section */}
          <section className="card card-accent animate-fade-in">
            <div className="flex items-center justify-between mb-lg">
              <div>
                <h2 className="text-heading mb-sm">Hello, Love! 💕</h2>
                <p className="text-body">How are you feeling about your relationship today?</p>
              </div>
              <div className="flex items-center gap-sm">
                <FireIcon />
                <span className="text-caption">{dailyStreak} day streak</span>
              </div>
            </div>

            {/* Mood Check-in */}
            <div className="mood-grid">
              {moods.map((mood) => (
                <div
                  key={mood.id}
                  className={`mood-item ${selectedMood === mood.id ? 'active' : ''}`}
                  onClick={() => setSelectedMood(mood.id)}
                  style={{ 
                    backgroundColor: selectedMood === mood.id ? mood.color : undefined,
                    color: selectedMood === mood.id ? 'var(--bg-primary)' : undefined
                  }}
                >
                  <span className="mood-emoji">{mood.emoji}</span>
                  <span className="mood-label">{mood.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Today's Activities */}
          <section className="dashboard-section animate-fade-in">
            <div className="section-header">
              <h3 className="section-title">Today's Connection Activities</h3>
              <Link to="/dashboard/planner" className="section-action">
                View All <ArrowIcon />
              </Link>
            </div>

            <div className="dashboard-grid">
              {dailyActivities.map((activity) => (
                <div key={activity.id} className="activity-card">
                  <div className="activity-header">
                    <div className="flex items-center gap-sm">
                      <activity.icon />
                      <h4 className="activity-title">{activity.title}</h4>
                    </div>
                    <span className="activity-time">{activity.time}</span>
                  </div>
                  <p className="activity-description">{activity.description}</p>
                  <div className="activity-meta">
                    <span className="activity-category">{activity.category}</span>
                    <div className="activity-progress">
                      {activity.completed ? (
                        <span className="text-success">✅ Completed</span>
                      ) : (
                        <span className="text-muted">⏰ Pending</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Weekly Goals Progress */}
          <section className="dashboard-section animate-fade-in">
            <div className="section-header">
              <h3 className="section-title">Weekly Growth Goals</h3>
              <Link to="/dashboard/growth-hub" className="section-action">
                View All <ArrowIcon />
              </Link>
            </div>

            <div className="dashboard-grid">
              {weeklyGoals.map((goal) => (
                <div key={goal.id} className="card">
                  <div className="flex items-center justify-between mb-md">
                    <h4 className="text-subtitle">{goal.title}</h4>
                    <span className="text-caption">{goal.progress}%</span>
                  </div>
                  <div className="progress-bar mb-sm">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                  <span className="activity-category">{goal.category}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick Actions */}
          <section className="dashboard-section animate-fade-in">
            <div className="section-header">
              <h3 className="section-title">Quick Actions</h3>
            </div>

            <div className="stats-grid">
              {quickActions.map((action) => (
                <button key={action.id} className="stat-card">
                  <div className="stat-value" style={{ color: action.color }}>
                    <action.icon />
                  </div>
                  <div className="stat-label">{action.title}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Relationship Stats */}
          <section className="dashboard-section animate-fade-in">
            <div className="section-header">
              <h3 className="section-title">Your Relationship Stats</h3>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{dailyStreak}</div>
                <div className="stat-label">Day Streak</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">12</div>
                <div className="stat-label">Shared Memories</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">8</div>
                <div className="stat-label">Growth Tasks</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">24</div>
                <div className="stat-label">Love Notes</div>
              </div>
            </div>
          </section>

          {/* Daily Challenge */}
          <section className="card card-glow animate-fade-in">
            <div className="text-center">
              <div className="mb-md">
                <StarIcon />
              </div>
              <h3 className="text-heading mb-sm">Today's Challenge</h3>
              <p className="text-body mb-lg">
                Share one thing you're grateful for about your partner today
              </p>
              <button className="btn btn-primary">
                <MessageIcon />
                Share Gratitude
              </button>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default DashboardPage;
