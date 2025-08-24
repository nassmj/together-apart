import React, { useState } from 'react';
import BottomNav from '../../components/dashboard/BottomNav';

// Icons
const CalendarIcon = () => <span>📅</span>;
const PlusIcon = () => <span>➕</span>;
const CheckIcon = () => <span>✅</span>;
const ClockIcon = () => <span>⏰</span>;
const LocationIcon = () => <span>📍</span>;
const HeartIcon = () => <span>💕</span>;
const StarIcon = () => <span>⭐</span>;

const ActivityPlannerPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('upcoming');

  const upcomingPlans = [
    {
      id: 1,
      title: "Weekend Getaway",
      description: "A romantic weekend trip to the mountains",
      date: "2024-01-27",
      time: "2:00 PM",
      location: "Mountain Lodge",
      category: "Adventure",
      priority: "high",
      participants: ["You", "Partner"],
      status: "planned",
    },
    {
      id: 2,
      title: "Cooking Class Together",
      description: "Learn to make pasta from scratch",
      date: "2024-01-25",
      time: "6:00 PM",
      location: "Culinary Institute",
      category: "Learning",
      priority: "medium",
      participants: ["You", "Partner"],
      status: "planned",
    },
    {
      id: 3,
      title: "Movie Night",
      description: "Watch the new romantic comedy",
      date: "2024-01-23",
      time: "8:00 PM",
      location: "Home",
      category: "Relaxation",
      priority: "low",
      participants: ["You", "Partner"],
      status: "planned",
    },
  ];

  const completedPlans = [
    {
      id: 4,
      title: "Coffee Date",
      description: "Morning coffee at our favorite café",
      date: "2024-01-20",
      time: "9:00 AM",
      location: "Downtown Café",
      category: "Social",
      priority: "medium",
      participants: ["You", "Partner"],
      status: "completed",
      rating: 5,
    },
    {
      id: 5,
      title: "Sunset Walk",
      description: "Evening walk by the beach",
      date: "2024-01-18",
      time: "6:30 PM",
      location: "Beach Promenade",
      category: "Outdoor",
      priority: "low",
      participants: ["You", "Partner"],
      status: "completed",
      rating: 4,
    },
  ];

  const suggestedActivities = [
    {
      id: 1,
      title: "Virtual Wine Tasting",
      description: "Experience different wines together online",
      duration: "2 hours",
      category: "Social",
      difficulty: "Easy",
      cost: "Medium",
    },
    {
      id: 2,
      title: "DIY Craft Night",
      description: "Create something beautiful together",
      duration: "3 hours",
      category: "Creative",
      difficulty: "Medium",
      cost: "Low",
    },
    {
      id: 3,
      title: "Language Learning Date",
      description: "Learn a new language together",
      duration: "1 hour",
      category: "Learning",
      difficulty: "Easy",
      cost: "Free",
    },
  ];

  const tabs = [
    { id: 'upcoming', label: 'Upcoming', count: upcomingPlans.length },
    { id: 'completed', label: 'Completed', count: completedPlans.length },
    { id: 'suggestions', label: 'Suggestions', count: suggestedActivities.length },
  ];

  const getPriorityColor = (priority: string) => {
    const colors = {
      high: 'var(--accent-primary)',
      medium: 'var(--accent-warning)',
      low: 'var(--accent-success)',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: React.ReactNode } = {
      Adventure: <span>🏔️</span>,
      Learning: <span>📚</span>,
      Relaxation: <span>😌</span>,
      Social: <span>👥</span>,
      Outdoor: <span>🌳</span>,
      Creative: <span>🎨</span>,
    };
    return icons[category] || <span>📅</span>;
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'upcoming':
        return (
          <div className="dashboard-grid">
            {upcomingPlans.map((plan) => (
              <div key={plan.id} className="card">
                <div className="flex items-start justify-between mb-md">
                  <div className="flex items-center gap-sm">
                    {getCategoryIcon(plan.category)}
                    <h4 className="text-subtitle">{plan.title}</h4>
                  </div>
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getPriorityColor(plan.priority) }}
                  />
                </div>
                
                <p className="text-body mb-md">{plan.description}</p>
                
                <div className="space-y-sm mb-md">
                  <div className="flex items-center gap-sm">
                    <CalendarIcon />
                    <span className="text-caption">{plan.date}</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <ClockIcon />
                    <span className="text-caption">{plan.time}</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <LocationIcon />
                    <span className="text-caption">{plan.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="activity-category">{plan.category}</span>
                  <div className="flex gap-sm">
                    <button className="btn btn-secondary">Edit</button>
                    <button className="btn btn-primary">Complete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'completed':
        return (
          <div className="dashboard-grid">
            {completedPlans.map((plan) => (
              <div key={plan.id} className="card">
                <div className="flex items-start justify-between mb-md">
                  <div className="flex items-center gap-sm">
                    {getCategoryIcon(plan.category)}
                    <h4 className="text-subtitle">{plan.title}</h4>
                  </div>
                  <div className="flex items-center gap-xs">
                    {[...Array(plan.rating)].map((_, i) => (
                      <StarIcon key={i} />
                    ))}
                  </div>
                </div>
                
                <p className="text-body mb-md">{plan.description}</p>
                
                <div className="space-y-sm mb-md">
                  <div className="flex items-center gap-sm">
                    <CalendarIcon />
                    <span className="text-caption">{plan.date}</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <ClockIcon />
                    <span className="text-caption">{plan.time}</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <LocationIcon />
                    <span className="text-caption">{plan.location}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="activity-category">{plan.category}</span>
                  <span className="text-success">✅ Completed</span>
                </div>
              </div>
            ))}
          </div>
        );

      case 'suggestions':
        return (
          <div className="dashboard-grid">
            {suggestedActivities.map((activity) => (
              <div key={activity.id} className="card">
                <div className="flex items-start justify-between mb-md">
                  <div className="flex items-center gap-sm">
                    {getCategoryIcon(activity.category)}
                    <h4 className="text-subtitle">{activity.title}</h4>
                  </div>
                </div>
                
                <p className="text-body mb-md">{activity.description}</p>
                
                <div className="space-y-sm mb-md">
                  <div className="flex items-center gap-sm">
                    <ClockIcon />
                    <span className="text-caption">{activity.duration}</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="text-caption">Difficulty: {activity.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="text-caption">Cost: {activity.cost}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="activity-category">{activity.category}</span>
                  <button className="btn btn-primary">
                    <PlusIcon />
                    Add to Plans
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1 className="text-heading">Activity Planner</h1>
              <p className="text-caption">Plan and track your shared adventures</p>
            </div>
            <div className="header-right">
              <button className="btn btn-primary">
                <PlusIcon />
                New Plan
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
                <div className="stat-value">{upcomingPlans.length}</div>
                <div className="stat-label">Upcoming</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{completedPlans.length}</div>
                <div className="stat-label">Completed</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">4.5</div>
                <div className="stat-label">Avg Rating</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">12</div>
                <div className="stat-label">This Month</div>
              </div>
            </div>
          </section>

          {/* Tabs */}
          <section className="dashboard-section animate-fade-in">
            <div className="flex gap-sm mb-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`btn ${
                    selectedTab === tab.id ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>

            {renderContent()}
          </section>

          {/* Planning Challenge */}
          <section className="card card-glow animate-fade-in">
            <div className="text-center">
              <div className="mb-md">
                <CalendarIcon />
              </div>
              <h3 className="text-heading mb-sm">Planning Challenge</h3>
              <p className="text-body mb-lg">
                Plan something special for next weekend that you've never done together
              </p>
              <button className="btn btn-primary">
                <PlusIcon />
                Start Planning
              </button>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default ActivityPlannerPage;
