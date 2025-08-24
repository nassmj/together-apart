import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    PaperAirplaneIcon, 
    SparklesIcon,
    HeartIcon,
    CalendarDaysIcon,
    TrophyIcon,
    BellIcon,
    Cog6ToothIcon,
    UserCircleIcon,
    PlusIcon
} from '@heroicons/react/24/solid';
import BottomNav from '../../components/dashboard/BottomNav';

// Mood Check-in Component
const MoodCheckIn: React.FC = () => {
    const moods = ['🌤️', '🙂', '😐', '😕', '🌧️'];
    const [selectedMood, setSelectedMood] = useState<number | null>(null);

    return (
        <div className="flex items-center gap-4">
            <span className="text-muted text-14">How's your weather today?</span>
            <div className="flex gap-2">
                {moods.map((mood, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedMood(index)}
                        className={`p-2 rounded-12 transition-all ${
                            selectedMood === index 
                                ? 'bg-primary text-white scale-110' 
                                : 'hover:bg-ringBg'
                        }`}
                    >
                        <span className="text-18">{mood}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

// Relationship Ring Component
const RelationshipRing: React.FC = () => {
    return (
        <div className="card text-center">
            <div className="ring-container mx-auto mb-4">
                <div className="ring ring-outer" style={{ 
                    background: `conic-gradient(from 0deg, var(--primary) 0deg, var(--primary) 252deg, var(--ringBg) 252deg, var(--ringBg) 360deg)` 
                }}></div>
                <div className="ring ring-middle" style={{ 
                    background: `conic-gradient(from 0deg, var(--love) 0deg, var(--love) 270deg, var(--ringBg) 270deg, var(--ringBg) 360deg)` 
                }}></div>
                <div className="ring ring-inner" style={{ 
                    background: `conic-gradient(from 0deg, var(--growth) 0deg, var(--growth) 324deg, var(--ringBg) 324deg, var(--ringBg) 360deg)` 
                }}></div>
                <div className="ring-center">
                    <div className="text-display text-22 text-text">79</div>
                    <div className="text-14 text-muted">Together Score</div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                    <div className="text-16 font-600 text-text">Intentional Time</div>
                    <div className="text-14 text-muted">45/60 min</div>
                </div>
                <div>
                    <div className="text-16 font-600 text-text">Touchpoints</div>
                    <div className="text-14 text-muted">12/15</div>
                </div>
                <div>
                    <div className="text-16 font-600 text-text">Growth Tasks</div>
                    <div className="text-14 text-muted">3/4</div>
                </div>
            </div>
        </div>
    );
};

// Today Module Component
const TodayModule: React.FC = () => {
    const upcomingPlan = {
        title: "Coffee Date",
        time: "2:00 PM",
        place: "Downtown Cafe",
        attendees: 2
    };

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-display text-18 text-text">Today</h3>
                <button className="btn btn-primary">
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Plan a moment
                </button>
            </div>
            
            {upcomingPlan && (
                <div className="bg-ringBg rounded-16 p-4 flex items-center justify-between">
                    <div>
                        <div className="text-16 font-600 text-text">{upcomingPlan.title}</div>
                        <div className="text-14 text-muted">{upcomingPlan.time} • {upcomingPlan.place}</div>
                    </div>
                    <div className="avatar-pair">
                        <div className="avatar">Y</div>
                        <div className="avatar">P</div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Messages Peek Component
const MessagesPeek: React.FC = () => {
    const lastMessages = [
        { text: "Missing your morning texts already 💕", author: "Partner", time: "2h ago" },
        { text: "Can't wait to see you tonight!", author: "You", time: "1h ago" }
    ];

    const quickReplies = ["❤️ Thanks", "🎙️ Voice", "📷 Add photo"];

    return (
        <div className="card">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-display text-18 text-text">Messages</h3>
                <Link to="/dashboard/daily-connection" className="text-primary text-14 font-500">View all</Link>
            </div>
            
            <div className="space-y-3">
                {lastMessages.map((message, index) => (
                    <div key={index} className="flex items-start gap-3">
                        <div className="avatar">{message.author === "You" ? "Y" : "P"}</div>
                        <div className="flex-1">
                            <div className="text-14 text-text">{message.text}</div>
                            <div className="text-12 text-muted">{message.time}</div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="flex gap-2 mt-4">
                {quickReplies.map((reply, index) => (
                    <button key={index} className="chip chip-filter">
                        {reply}
                    </button>
                ))}
            </div>
        </div>
    );
};

// Quick Actions Component
const QuickActions: React.FC = () => {
    const actions = [
        { title: 'Add Memory', icon: HeartIcon, color: 'bg-love', path: '/dashboard/timeline' },
        { title: 'Plan Date', icon: CalendarDaysIcon, color: 'bg-primary', path: '/dashboard/planner' },
        { title: 'Start Call', icon: UserCircleIcon, color: 'bg-growth', path: '/dashboard/daily-connection' },
        { title: 'Discovery', icon: SparklesIcon, color: 'bg-caution', path: '/dashboard/growth-hub' },
    ];

    return (
        <div className="card">
            <h3 className="text-display text-18 text-text mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.title}
                            to={action.path}
                            className="flex items-center gap-3 p-4 rounded-16 border border-transparent hover:border-primary/20 transition-all"
                        >
                            <div className={`w-10 h-10 rounded-12 ${action.color} flex items-center justify-center`}>
                                <Icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-14 font-500 text-text">{action.title}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

// Weekly Nudges Component
const WeeklyNudges: React.FC = () => {
    const suggestions = [
        "Movie night at home",
        "Try a new restaurant",
        "Take a sunset walk"
    ];

    return (
        <div className="card bg-caution/10 border-caution/20">
            <h3 className="text-display text-16 text-text mb-2">Weekly Ideas</h3>
            <p className="text-14 text-muted mb-4">Haven't planned anything this week? Here are 3 ideas for Friday:</p>
            <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-caution rounded-full"></div>
                        <span className="text-14 text-text">{suggestion}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Header Component
const Header: React.FC = () => {
    const userName = "Nasser";
    const partnerName = "Raghad";

    return (
        <div className="app-bar">
            <div className="flex items-center gap-4">
                <div className="avatar-pair">
                    <div className="avatar">{userName[0]}</div>
                    <div className="avatar">{partnerName[0]}</div>
                </div>
                <div>
                    <h1 className="text-display text-22 text-text">Good morning, {userName} & {partnerName}</h1>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <button className="p-2 rounded-12 hover:bg-ringBg transition-all">
                    <BellIcon className="w-6 h-6 text-muted" />
                </button>
                <Link to="/dashboard/settings" className="p-2 rounded-12 hover:bg-ringBg transition-all">
                    <Cog6ToothIcon className="w-6 h-6 text-muted" />
                </Link>
            </div>
        </div>
    );
};

const DashboardPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg">
            <Header />
            
            <div className="p-4 pb-24 space-y-4">
                <MoodCheckIn />
                <RelationshipRing />
                <TodayModule />
                <MessagesPeek />
                <QuickActions />
                <WeeklyNudges />
            </div>
            
            <BottomNav />
        </div>
    );
};

export default DashboardPage;
