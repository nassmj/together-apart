import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import BottomNav from '../../components/dashboard/BottomNav';

const ProfilePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg">
            <div className="app-bar">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-12 hover:bg-ringBg transition-all">
                        <ArrowLeftIcon className="w-6 h-6 text-muted" />
                    </Link>
                    <h1 className="text-display text-22 text-text">Profile</h1>
                </div>
            </div>
            
            <div className="p-4 pb-24">
                <div className="card">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="avatar w-16 h-16">N</div>
                        <div>
                            <h3 className="text-display text-18 text-text">Nasser</h3>
                            <p className="text-muted">nasser@example.com</p>
                        </div>
                    </div>
                    <p className="text-muted mb-6">Profile functionality coming soon...</p>
                    <Link to="/dashboard" className="btn btn-primary">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
            
            <BottomNav />
        </div>
    );
};

export default ProfilePage;
