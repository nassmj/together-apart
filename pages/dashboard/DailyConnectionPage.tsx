import React, { useState } from 'react';
import BottomNav from '../../components/dashboard/BottomNav';

// Icons
const MessageIcon = () => <span>💬</span>;
const HeartIcon = () => <span>💕</span>;
const VideoIcon = () => <span>📹</span>;
const VoiceIcon = () => <span>🎤</span>;
const PhotoIcon = () => <span>📸</span>;
const SendIcon = () => <span>➡️</span>;
const StarIcon = () => <span>⭐</span>;
const FireIcon = () => <span>🔥</span>;

const DailyConnectionPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('messages');
  const [messageText, setMessageText] = useState('');

  const messages = [
    {
      id: 1,
      text: "Good morning, love! 💕 How did you sleep?",
      sender: "partner",
      time: "8:30 AM",
      type: "text",
      read: true,
    },
    {
      id: 2,
      text: "Morning! I slept great, dreaming about our weekend plans 😊",
      sender: "you",
      time: "8:32 AM",
      type: "text",
      read: true,
    },
    {
      id: 3,
      text: "Can't wait to see you! Missing your smile already",
      sender: "partner",
      time: "8:35 AM",
      type: "text",
      read: false,
    },
    {
      id: 4,
      text: "Just finished my morning coffee ☕️",
      sender: "you",
      time: "9:00 AM",
      type: "photo",
      read: true,
    },
  ];

  const quickReplies = [
    "I miss you too! 💕",
    "Can't wait to see you! 😊",
    "You're the best! ❤️",
    "Thinking of you! 🌟",
    "Love you! 💖",
  ];

  const conversationStarters = [
    {
      id: 1,
      question: "What's the best thing that happened to you today?",
      category: "Daily Reflection",
    },
    {
      id: 2,
      question: "If you could have dinner with anyone, who would it be?",
      category: "Dreams & Aspirations",
    },
    {
      id: 3,
      question: "What's your favorite memory of us together?",
      category: "Romance",
    },
    {
      id: 4,
      question: "What's something you're looking forward to this week?",
      category: "Future Plans",
    },
  ];

  const connectionStats = {
    messagesToday: 12,
    callDuration: "45 min",
    streak: 7,
    responseTime: "2 min",
  };

  const tabs = [
    { id: 'messages', label: 'Messages', count: messages.length },
    { id: 'calls', label: 'Calls', count: 3 },
    { id: 'starters', label: 'Starters', count: conversationStarters.length },
  ];

  const handleSendMessage = () => {
    if (messageText.trim()) {
      // Add message logic here
      setMessageText('');
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'messages':
        return (
          <div className="space-y-md">
            {/* Messages */}
            <div className="space-y-md">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'you' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs p-md rounded-lg ${
                      message.sender === 'you'
                        ? 'bg-accent-primary text-white'
                        : 'bg-bg-accent text-text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-sm mb-sm">
                      {message.type === 'photo' && <PhotoIcon />}
                      <span className="text-sm">{message.text}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs opacity-70">{message.time}</span>
                      {message.sender === 'you' && (
                        <span className="text-xs">
                          {message.read ? '✓✓' : '✓'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Replies */}
            <div className="card">
              <h4 className="text-subtitle mb-md">Quick Replies</h4>
              <div className="flex gap-sm flex-wrap">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    className="btn btn-secondary"
                    onClick={() => setMessageText(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="card">
              <div className="flex gap-sm">
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-sm rounded-md bg-bg-accent border border-transparent focus:border-accent-primary outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="btn btn-primary"
                  disabled={!messageText.trim()}
                >
                  <SendIcon />
                </button>
              </div>
            </div>
          </div>
        );

      case 'calls':
        return (
          <div className="space-y-md">
            <div className="card">
              <h4 className="text-subtitle mb-md">Recent Calls</h4>
              <div className="space-y-sm">
                <div className="flex items-center justify-between p-sm bg-bg-accent rounded-md">
                  <div className="flex items-center gap-sm">
                    <VideoIcon />
                    <span>Video Call</span>
                  </div>
                  <span className="text-caption">45 min ago</span>
                </div>
                <div className="flex items-center justify-between p-sm bg-bg-accent rounded-md">
                  <div className="flex items-center gap-sm">
                    <VoiceIcon />
                    <span>Voice Call</span>
                  </div>
                  <span className="text-caption">2 hours ago</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h4 className="text-subtitle mb-md">Start a Call</h4>
              <div className="flex gap-sm">
                <button className="btn btn-primary flex-1">
                  <VideoIcon />
                  Video Call
                </button>
                <button className="btn btn-secondary flex-1">
                  <VoiceIcon />
                  Voice Call
                </button>
              </div>
            </div>
          </div>
        );

      case 'starters':
        return (
          <div className="space-y-md">
            <div className="card">
              <h4 className="text-subtitle mb-md">Conversation Starters</h4>
              <div className="space-y-md">
                {conversationStarters.map((starter) => (
                  <div key={starter.id} className="card bg-bg-accent">
                    <div className="mb-sm">
                      <span className="activity-category">{starter.category}</span>
                    </div>
                    <p className="text-body mb-md">{starter.question}</p>
                    <button className="btn btn-primary">
                      <MessageIcon />
                      Send Question
                    </button>
                  </div>
                ))}
              </div>
            </div>
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
              <h1 className="text-heading">Daily Connection</h1>
              <p className="text-caption">Stay connected, stay in love</p>
            </div>
            <div className="header-right">
              <div className="flex items-center gap-sm">
                <span className="text-caption">{connectionStats.streak} day streak</span>
                <FireIcon />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Connection Stats */}
          <section className="card card-accent animate-fade-in">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{connectionStats.messagesToday}</div>
                <div className="stat-label">Messages Today</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{connectionStats.callDuration}</div>
                <div className="stat-label">Call Time</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{connectionStats.streak}</div>
                <div className="stat-label">Day Streak</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{connectionStats.responseTime}</div>
                <div className="stat-label">Avg Response</div>
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

          {/* Connection Challenge */}
          <section className="card card-glow animate-fade-in">
            <div className="text-center">
              <div className="mb-md">
                <HeartIcon />
              </div>
              <h3 className="text-heading mb-sm">Daily Connection Challenge</h3>
              <p className="text-body mb-lg">
                Send a voice message telling your partner what you love most about them
              </p>
              <button className="btn btn-primary">
                <VoiceIcon />
                Record Message
              </button>
            </div>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default DailyConnectionPage;
