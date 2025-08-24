import React from 'react';
import { Link } from 'react-router-dom';
import { 
    HeartIcon,
    PlusIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/solid';
import BottomNav from '../../components/dashboard/BottomNav';

const MemoryTimelinePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg">
            <div className="app-bar">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-12 hover:bg-ringBg transition-all">
                        <ArrowLeftIcon className="w-6 h-6 text-muted" />
                    </Link>
                    <h1 className="text-display text-22 text-text">Memories</h1>
                </div>
                <button className="p-3 rounded-12 bg-love text-white hover:bg-love/90 transition-all">
                    <PlusIcon className="w-6 h-6" />
                </button>
            </div>
            
            <div className="p-4 pb-24">
                <div className="empty-state">
                    <div className="empty-state-icon">💕</div>
                    <h3 className="empty-state-title">No Memories Yet</h3>
                    <p className="empty-state-description">Start building your shared memories together</p>
                    <button className="btn btn-love">
                        Add Your First Memory
                    </button>
                </div>
            </div>
            
            <BottomNav />
        </div>
    );
};

export default MemoryTimelinePage;
