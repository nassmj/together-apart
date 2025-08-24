import React, { useState } from 'react';
import BottomNav from '../../components/dashboard/BottomNav';

// Icons
const HeartIcon = () => <span>💕</span>;
const CameraIcon = () => <span>📸</span>;
const StarIcon = () => <span>⭐</span>;
const PlusIcon = () => <span>➕</span>;
const FilterIcon = () => <span>🔍</span>;

const MemoryTimelinePage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const memories = [
    {
      id: 1,
      title: "Our First Coffee Date",
      description: "Remember when we first met at that cute café? The way you smiled when I spilled my coffee...",
      date: "2024-01-15",
      category: "Firsts",
      mood: "romantic",
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop",
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      title: "Sunset Walk by the Beach",
      description: "That perfect evening when we walked hand in hand, watching the sun disappear into the ocean...",
      date: "2024-01-10",
      category: "Adventures",
      mood: "peaceful",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
      likes: 18,
      comments: 5,
    },
    {
      id: 3,
      title: "Cooking Together",
      description: "Our first attempt at making pasta from scratch. Flour everywhere, but so much laughter!",
      date: "2024-01-08",
      category: "Home",
      mood: "happy",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      likes: 15,
      comments: 4,
    },
    {
      id: 4,
      title: "Movie Night Under the Stars",
      description: "Watching your favorite movie while cuddling under a blanket. Perfect moment.",
      date: "2024-01-05",
      category: "Relaxation",
      mood: "calm",
      image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&h=300&fit=crop",
      likes: 22,
      comments: 7,
    },
  ];

  const filters = [
    { id: 'all', label: 'All Memories' },
    { id: 'firsts', label: 'Firsts' },
    { id: 'adventures', label: 'Adventures' },
    { id: 'home', label: 'Home' },
    { id: 'relaxation', label: 'Relaxation' },
  ];

  const getMoodEmoji = (mood: string) => {
    const moodEmojis: { [key: string]: string } = {
      happy: '😊',
      romantic: '💕',
      peaceful: '🌸',
      calm: '😌',
      excited: '🤩',
      passionate: '🔥',
    };
    return moodEmojis[mood] || '😊';
  };

  const filteredMemories = selectedFilter === 'all' 
    ? memories 
    : memories.filter(memory => memory.category.toLowerCase() === selectedFilter);

  return (
    <div className="app-layout">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="header-left">
              <h1 className="text-heading">Memory Timeline</h1>
              <p className="text-caption">Relive your beautiful moments together</p>
            </div>
            <div className="header-right">
              <button className="btn btn-primary">
                <PlusIcon />
                Add Memory
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
                <div className="stat-value">{memories.length}</div>
                <div className="stat-label">Total Memories</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">7</div>
                <div className="stat-label">This Month</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">156</div>
                <div className="stat-label">Total Likes</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">19</div>
                <div className="stat-label">Comments</div>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="dashboard-section animate-fade-in">
            <div className="section-header">
              <h3 className="section-title">Filter Memories</h3>
            </div>
            <div className="flex gap-sm flex-wrap">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`btn ${
                    selectedFilter === filter.id ? 'btn-primary' : 'btn-ghost'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </section>

          {/* Memories Timeline */}
          <section className="dashboard-section animate-fade-in">
            <div className="section-header">
              <h3 className="section-title">Your Memories</h3>
            </div>

            <div className="dashboard-grid">
              {filteredMemories.map((memory) => (
                <div key={memory.id} className="card">
                  <div className="relative mb-md">
                    <img
                      src={memory.image}
                      alt={memory.title}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="activity-category">{memory.category}</span>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <span className="text-2xl">{getMoodEmoji(memory.mood)}</span>
                    </div>
                  </div>

                  <div className="mb-md">
                    <h4 className="text-subtitle mb-sm">{memory.title}</h4>
                    <p className="text-body mb-sm">{memory.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-caption">{memory.date}</span>
                      <div className="flex items-center gap-sm">
                        <span className="text-caption">❤️ {memory.likes}</span>
                        <span className="text-caption">💬 {memory.comments}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-sm">
                    <button className="btn btn-secondary flex-1">
                      <HeartIcon />
                      Like
                    </button>
                    <button className="btn btn-ghost flex-1">
                      <StarIcon />
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredMemories.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📸</div>
                <h3 className="empty-title">No memories yet</h3>
                <p className="empty-description">
                  Start creating beautiful memories together. Every moment counts!
                </p>
                <button className="btn btn-primary mt-lg">
                  <PlusIcon />
                  Add Your First Memory
                </button>
              </div>
            )}
          </section>

          {/* Memory Challenge */}
          <section className="card card-glow animate-fade-in">
            <div className="text-center">
              <div className="mb-md">
                <CameraIcon />
              </div>
              <h3 className="text-heading mb-sm">Memory Challenge</h3>
              <p className="text-body mb-lg">
                Take a photo of something that reminds you of your partner today
              </p>
              <button className="btn btn-primary">
                <CameraIcon />
                Capture Moment
              </button>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default MemoryTimelinePage;
