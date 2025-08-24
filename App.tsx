import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import DashboardPage from './pages/dashboard/DashboardPage';
import MemoryTimelinePage from './pages/dashboard/MemoryTimelinePage';
import ActivityPlannerPage from './pages/dashboard/ActivityPlannerPage';
import GrowthHubPage from './pages/dashboard/GrowthHubPage';
import DailyConnectionPage from './pages/dashboard/DailyConnectionPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import ProfilePage from './pages/dashboard/ProfilePage';

// Simple loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center">
    <div className="text-center">
      <div className="loading-ring mx-auto mb-4"></div>
      <p className="text-muted">Loading...</p>
    </div>
  </div>
);

// Simple home page
const HomePage = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-display text-32 text-text mb-4">Together Apart</h1>
      <p className="text-18 text-muted mb-8">Your relationship app is ready!</p>
      <a href="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </a>
    </div>
  </div>
);

// Simple login page
const LoginPage = () => (
  <div className="min-h-screen bg-bg flex items-center justify-center">
    <div className="card w-full max-w-md">
      <h1 className="text-display text-28 text-text mb-6 text-center">Welcome Back</h1>
      <p className="text-muted text-center mb-8">This is a demo - you can access the dashboard directly</p>
      <a href="/dashboard" className="btn btn-primary w-full">
        Continue to Dashboard
      </a>
    </div>
  </div>
);

const ProtectedRoute: React.FC = () => {
  // For demo purposes, always allow access
  return <Outlet />;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path="timeline" element={<MemoryTimelinePage />} />
          <Route path="planner" element={<ActivityPlannerPage />} />
          <Route path="growth-hub" element={<GrowthHubPage />} />
          <Route path="daily-connection" element={<DailyConnectionPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        
        {/* Redirect all other routes to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;