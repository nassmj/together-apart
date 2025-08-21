import React, { useState } from 'react';
import { Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import JoinPage from './pages/JoinPage';
import TestPage from './pages/TestPage';
import SimpleTest from './pages/SimpleTest';

import DashboardLayout from './components/dashboard/DashboardLayout';
import DashboardPage from './pages/dashboard/DashboardPage';
import DailyConnectionPage from './pages/dashboard/DailyConnectionPage';
import MemoryTimelinePage from './pages/dashboard/MemoryTimelinePage';
import ActivityPlannerPage from './pages/dashboard/ActivityPlannerPage';
import GrowthHubPage from './pages/dashboard/GrowthHubPage';
import DiscoveryExchangePage from './pages/dashboard/DiscoveryExchangePage';
import SettingsPage from './pages/dashboard/SettingsPage';
import ConnectPartnerPage from './pages/dashboard/ConnectPartnerPage';

import { ToastProvider } from './components/ToastProvider';
import { useAuth } from './contexts/AuthContext';
import { usePartner } from './contexts/PartnerContext';
import { PerformanceMonitor } from './components/PerformanceMonitor';
import { DevTools } from './components/ReactQueryDevTools';
import { UserFeedback, FeedbackTrigger } from './components/UserFeedback';

const ProtectedRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

const App: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  const handlePerformanceMetrics = (metrics: any) => {
    // In production, you would send these metrics to your analytics service
    if (import.meta.env.DEV) {
      console.log('App Performance Metrics:', metrics);
    }
  };

  const handleFeedbackSubmit = (feedback: any) => {
    // In production, you would send this to your backend
    console.log('User feedback received:', feedback);
  };

  return (
    <ToastProvider>
      <PerformanceMonitor onMetrics={handlePerformanceMetrics} />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/simple" element={<SimpleTest />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/join/:inviteCode" element={<JoinPage />} />
        </Route>
        
        <Route path="/dashboard" element={<ProtectedRoute />}>
          <Route index element={<DashboardPage />} />
          <Route path="daily-connection" element={<DailyConnectionPage />} />
          <Route path="timeline" element={<MemoryTimelinePage />} />
          <Route path="planner" element={<ActivityPlannerPage />} />
          <Route path="growth-hub" element={<GrowthHubPage />} />
          <Route path="discovery" element={<DiscoveryExchangePage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="connect" element={<ConnectPartnerPage />} />
        </Route>
      </Routes>
      
      {/* Feedback System */}
      <FeedbackTrigger onOpen={() => setShowFeedback(true)} />
      <UserFeedback
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        onFeedbackSubmit={handleFeedbackSubmit}
      />
      
      <DevTools />
    </ToastProvider>
  );
};

export default App;