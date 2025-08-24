import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/solid';
import BottomNav from '../../components/dashboard/BottomNav';

const DailyConnectionPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg">
            <div className="app-bar">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-12 hover:bg-ringBg transition-all">
                        <ArrowLeftIcon className="w-6 h-6 text-muted" />
                    </Link>
                    <h1 className="text-display text-22 text-text">Chat</h1>
                </div>
                <button className="p-3 rounded-12 bg-caution text-white hover:bg-caution/90 transition-all">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="p-4 pb-24">
                <div className="empty-state">
                    <div className="empty-state-icon">💬</div>
                    <h3 className="empty-state-title">No Messages Yet</h3>
                    <p className="empty-state-description">Start your daily conversation</p>
                    <button className="btn btn-caution">
                        Send Your First Message
                    </button>
                </div>
            </div>
            
            <BottomNav />
        </div>
    );
};

export default DailyConnectionPage;
