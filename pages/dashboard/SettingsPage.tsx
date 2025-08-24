import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import BottomNav from '../../components/dashboard/BottomNav';

const SettingsPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg">
            <div className="app-bar">
                <div className="flex items-center gap-4">
                    <Link to="/dashboard" className="p-2 rounded-12 hover:bg-ringBg transition-all">
                        <ArrowLeftIcon className="w-6 h-6 text-muted" />
                    </Link>
                    <h1 className="text-display text-22 text-text">Settings</h1>
                </div>
            </div>
            
            <div className="p-4 pb-24">
                <div className="card">
                    <h3 className="text-display text-18 text-text mb-4">Account Settings</h3>
                    <p className="text-muted mb-6">Settings functionality coming soon...</p>
                    <Link to="/dashboard" className="btn btn-primary">
                        Back to Dashboard
                    </Link>
                </div>
            </div>
            
            <BottomNav />
        </div>
    );
};

export default SettingsPage;