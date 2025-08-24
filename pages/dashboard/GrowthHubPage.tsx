import React, { useState } from 'react';
import BottomNav from '../../components/dashboard/BottomNav';

// Icons
const TrophyIcon = () => <span>🏆</span>;
const PlusIcon = () => <span>➕</span>;
const CheckIcon = () => <span>✅</span>;
const StarIcon = () => <span>⭐</span>;
const FireIcon = () => <span>🔥</span>;
const BookIcon = () => <span>📚</span>;
const HeartIcon = () => <span>💕</span>;
const TargetIcon = () => <span>🎯</span>;

const GrowthHubPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const growthTasks = [
    {
      id: 1,
      title: "Learn Each Other's Love Languages",
      description: "Take the love language quiz and discuss your results",
      category: "Communication",
      difficulty: "Easy",
      duration: "30 min",
      progress: 100,
      completed: true,
      points: 50,
      streak: 3,
    },
    {
      id: 2,
      title: "Practice Active Listening",
      description: "Spend 20 minutes listening without interrupting",
      category: "Communication",
      difficulty: "Medium",
      duration: "20 min",
      progress: 75,
      completed: false,
      points: 30,
      streak: 2,
    },
    {
      id: 3,
      title: "Share Personal Goals",
      description: "Discuss your individual and shared goals for the year",
      category: "Planning",
      difficulty: "Medium",
      duration: "45 min",
      progress: 0,
      completed: false,
      points: 40,
      streak: 0,
    },
    {
      id: 4,
      title: "Try a New Hobby Together",
      description: "Pick something neither of you has tried before",
      category: "Adventure",
      difficulty: "Hard",
      duration: "2 hours",
      progress: 25,
      completed: false,
      points: 60,
      streak: 1,
    },
    {
      id: 5,
      title: "Write Love Letters",
      description: "Write heartfelt letters to each other",
      category: "Romance",
      difficulty: "Easy",
      duration: "1 hour",
      progress: 100,
      completed: true,
      points: 35,
      streak: 5,
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first growth task together",
      icon: "🌱",
      unlocked: true,
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Communication Master",
      description: "Complete 5 communication tasks",
      icon: "💬",
      unlocked: true,
      date: "2024-01-18",
    },
    {
      id: 3,
      title: "Adventure Seeker",
      description: "Try 3 new activities together",
      icon: "🏔️",
      unlocked: false,
      progress: 2,
      total: 3,
    },
    {
      id: 4,
      title: "Love Language Expert",
      description: "Master all 5 love languages",
      icon: "💕",
      unlocked: false,
      progress: 3,
      total: 5,
    },
  ];

  const categories = [
    { id: 'all', label: 'All Tasks', count: growthTasks.length },
    { id: 'communication', label: 'Communication', count: growthTasks.filter(t => t.category === 'Communication').length },
    { id: 'planning', label: 'Planning', count: growthTasks.filter(t => t.category === 'Planning').length },
    { id: 'adventure', label: 'Adventure', count: growthTasks.filter(t => t.category === 'Adventure').length },
    { id: 'romance', label: 'Romance', count: growthTasks.filter(t => t.category === 'Romance').length },
  ];

  const filteredTasks = selectedCategory === 'all' 
    ? growthTasks 
    : growthTasks.filter(task => task.category.toLowerCase() === selectedCategory);

  const totalPoints = growthTasks.reduce((sum, task) => sum + (task.completed ? task.points : 0), 0);
  const completedTasks = growthTasks.filter(task => task.completed).length;
  const currentStreak = Math.max(...growthTasks.map(task => task.streak));

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      Easy: 'var(--accent-success)',
      Medium: 'var(--accent-warning)',
      Hard: 'var(--accent-primary)',
    };
    return colors[difficulty as keyof typeof colors] || colors.Medium;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Communication: <span>💬</span>,
      Planning: <span>📋</span>,
      Adventure: <span>🏔️</span>,
      Romance: <span>💕</span>,
    };
    return icons[category] || <span>📚</span>;
  };

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1 className="text-heading">Growth Hub</h1>
              <p className="text-caption">Grow together, one task at a time</p>
            </div>
            <div className="header-right">
              <button className="btn btn-primary">
                <PlusIcon />
                New Task
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Stats Overview */}
          <section className="card card-accent animate-fade-in">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{totalPoints}</div>
                <div className="stat-label">Total Points</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{completedTasks}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{currentStreak}</div>
                <div className="stat-label">Day Streak</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{achievements.filter(a => a.unlocked).length}</div>
                <div className="stat-label">Achievements</div>
              </div>
            </div>
          </section>

          {/* Categories */}
          <section className="dashboard-section animate-fade-in">
            <div className="section-header">
              <h3 className="section-title">Task Categories</h3>
            </div>
            <div className="flex gap-sm flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`btn ${
                    selectedCategory === category.id ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </section>

          {/* Growth Tasks */}
          <section className="dashboard-section animate-fade-in">
            <div className="section-header">
              <h3 className="section-title">Growth Tasks</h3>
            </div>

            <div className="dashboard-grid">
              {filteredTasks.map((task) => (
                <div key={task.id} className="card">
                  <div className="flex items-start justify-between mb-md">
                    <div className="flex items-center gap-sm">
                      {getCategoryIcon(task.category)}
                      <h4 className="text-subtitle">{task.title}</h4>
                    </div>
                    <div className="flex items-center gap-sm">
                      <span className="text-caption">{task.points} pts</span>
                      {task.completed && <CheckIcon />}
                    </div>
                  </div>
                  
                  <p className="text-body mb-md">{task.description}</p>
                  
                  <div className="space-y-sm mb-md">
                    <div className="flex items-center justify-between">
                      <span className="text-caption">Difficulty</span>
                      <span 
                        className="text-caption font-600"
                        style={{ color: getDifficultyColor(task.difficulty) }}
                      >
                        {task.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-caption">Duration</span>
                      <span className="text-caption">{task.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-caption">Streak</span>
                      <span className="text-caption">{task.streak} days</span>
                    </div>
                  </div>

                  <div className="mb-md">
                    <div className="flex items-center justify-between mb-sm">
                      <span className="text-caption">Progress</span>
                      <span className="text-caption">{task.progress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="activity-category">{task.category}</span>
                    <div className="flex gap-sm">
                      {task.completed ? (
                        <span className="text-success">✅ Completed</span>
                      ) : (
                        <button className="btn btn-primary">
                          <CheckIcon />
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section className="dashboard-section animate-fade-in">
            <div className="section-header">
              <h3 className="section-title">Achievements</h3>
            </div>

            <div className="dashboard-grid">
              {achievements.map((achievement) => (
                <div key={achievement.id} className={`card ${achievement.unlocked ? 'card-accent' : ''}`}>
                  <div className="flex items-center gap-md mb-md">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="text-subtitle mb-sm">{achievement.title}</h4>
                      <p className="text-body">{achievement.description}</p>
                    </div>
                  </div>
                  
                  {achievement.unlocked ? (
                    <div className="flex items-center justify-between">
                      <span className="text-success">🎉 Unlocked!</span>
                      <span className="text-caption">{achievement.date}</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-muted">🔒 Locked</span>
                      <span className="text-caption">
                        {achievement.progress}/{achievement.total}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Growth Challenge */}
          <section className="card card-glow animate-fade-in">
            <div className="text-center">
              <div className="mb-md">
                <TargetIcon />
              </div>
              <h3 className="text-heading mb-sm">Weekly Growth Challenge</h3>
              <p className="text-body mb-lg">
                Complete 3 growth tasks this week to unlock a special achievement
              </p>
              <div className="flex items-center justify-center gap-md mb-lg">
                <span className="text-caption">Progress: {completedTasks}/3</span>
                <div className="progress-bar w-32">
                  <div 
                    className="progress-bar-fill" 
                    style={{ width: `${(completedTasks / 3) * 100}%` }}
                  />
                </div>
              </div>
              <button className="btn btn-primary">
                <TrophyIcon />
                View Challenge
              </button>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default GrowthHubPage;
