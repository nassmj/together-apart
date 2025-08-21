// This script runs once on app startup to clean up old data from localStorage.
// The app previously used localStorage to store all data, which led to quota errors.
// This migrates users to the new database-backed system by removing the old data before Supabase initializes.
try {
    const validKeys = ['together-apart-theme']; // Add any other known valid keys here
    const validPrefixes = ['sb-']; // Supabase keys start with this prefix

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            const isKeyValid = validKeys.includes(key) || validPrefixes.some(prefix => key.startsWith(prefix));
            if (!isKeyValid) {
                keysToRemove.push(key);
            }
        }
    }

    if (keysToRemove.length > 0) {
        console.log("Performing one-time cleanup of old localStorage data:", keysToRemove);
        keysToRemove.forEach(key => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error(`Failed to remove old key ${key}:`, e);
            }
        });
        console.log("Cleanup complete. The app should now function correctly.");
    }
} catch (e) {
    console.error("Failed to execute pre-emptive localStorage cleanup:", e);
}


import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from './contexts/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import { PartnerProvider } from './contexts/PartnerContext';
import { validateConfig } from './lib/config';
import { ErrorBoundary } from './components/ErrorBoundary';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Validate configuration before app starts
try {
  validateConfig();
} catch (error) {
  console.error('Configuration validation failed:', error);
  document.body.innerHTML = `
    <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
      <div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #dc3545; margin-bottom: 1rem;">Configuration Error</h2>
        <p style="color: #6c757d; margin-bottom: 1rem;">${error instanceof Error ? error.message : 'Unknown configuration error'}</p>
        <p style="color: #6c757d; font-size: 0.9rem;">Please check your environment variables and restart the application.</p>
      </div>
    </div>
  `;
  throw error;
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HashRouter>
          <ThemeProvider defaultTheme="dark" storageKey="together-apart-theme">
            <AuthProvider>
              <PartnerProvider>
                <App />
              </PartnerProvider>
            </AuthProvider>
          </ThemeProvider>
        </HashRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
);