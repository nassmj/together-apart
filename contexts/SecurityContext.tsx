import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useAuth } from './AuthContext';
// import analytics from '../lib/analytics';

// Mock analytics for build compatibility
const analytics = {
  trackSecurity: () => {},
  trackAccessibility: () => {},
};

// Security Context Types
interface SecurityContextType {
  // Authentication & Session Management
  isAuthenticated: boolean;
  sessionExpiry: Date | null;
  lastActivity: Date;
  sessionTimeout: number; // minutes
  
  // Security Features
  twoFactorEnabled: boolean;
  activeSessions: SessionInfo[];
  securityLevel: 'basic' | 'enhanced' | 'maximum';
  
  // Privacy Controls
  dataSharing: DataSharingSettings;
  exportData: () => Promise<void>;
  deleteData: () => Promise<void>;
  
  // Security Monitoring
  securityEvents: SecurityEvent[];
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  
  // Actions
  enableTwoFactor: () => Promise<void>;
  disableTwoFactor: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeAllSessions: () => Promise<void>;
  updateSecurityLevel: (level: SecurityContextType['securityLevel']) => Promise<void>;
  updateDataSharing: (settings: Partial<DataSharingSettings>) => Promise<void>;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

// Session Information
interface SessionInfo {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: Date;
  isCurrent: boolean;
}

// Data Sharing Settings
interface DataSharingSettings {
  analytics: boolean;
  personalization: boolean;
  thirdParty: boolean;
  marketing: boolean;
  research: boolean;
}

// Security Event
interface SecurityEvent {
  id: string;
  timestamp: Date;
  type: 'login' | 'logout' | 'failed_login' | 'suspicious_activity' | 'data_access' | 'settings_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ipAddress?: string;
  userAgent?: string;
  location?: string;
  resolved: boolean;
}

// Security Context
const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

// Security Provider Props
interface SecurityProviderProps {
  children: ReactNode;
}

// Security Provider Component
export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  const { user, signOut } = useAuth();
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);
  const [lastActivity, setLastActivity] = useState(new Date());
  const [sessionTimeout] = useState(30); // 30 minutes
  
  // Security Features
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeSessions, setActiveSessions] = useState<SessionInfo[]>([]);
  const [securityLevel, setSecurityLevel] = useState<SecurityContextType['securityLevel']>('basic');
  
  // Privacy Controls
  const [dataSharing, setDataSharing] = useState<DataSharingSettings>({
    analytics: true,
    personalization: true,
    thirdParty: false,
    marketing: false,
    research: false,
  });
  
  // Security Monitoring
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  
  // Update last activity on user interaction
  const updateActivity = useCallback(() => {
    setLastActivity(new Date());
  }, []);
  
  // Set up activity monitoring
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => updateActivity();
    
    events.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [updateActivity]);
  
  // Session management
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + sessionTimeout);
      setSessionExpiry(expiry);
      
      // Track successful login
      analytics.trackSecurity('user_login', 'low', 'authentication_success');
      
      // Load user security settings
      loadSecuritySettings();
      loadActiveSessions();
    } else {
      setIsAuthenticated(false);
      setSessionExpiry(null);
      setLastActivity(new Date());
    }
  }, [user, sessionTimeout]);
  
  // Session timeout monitoring
  useEffect(() => {
    if (!isAuthenticated || !sessionExpiry) return;
    
    const checkSession = () => {
      const now = new Date();
      if (now >= sessionExpiry) {
        handleSessionTimeout();
      }
    };
    
    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isAuthenticated, sessionExpiry]);
  
  // Handle session timeout
  const handleSessionTimeout = useCallback(async () => {
    analytics.trackSecurity('session_timeout', 'medium', 'authentication_failure');
    
    // Add security event
    addSecurityEvent({
      type: 'logout',
      severity: 'medium',
      description: 'Session expired due to inactivity',
    });
    
    await logout();
  }, []);
  
  // Load security settings from localStorage
  const loadSecuritySettings = () => {
    try {
      const saved = localStorage.getItem('security-settings');
      if (saved) {
        const settings = JSON.parse(saved);
        setTwoFactorEnabled(settings.twoFactorEnabled || false);
        setSecurityLevel(settings.securityLevel || 'basic');
        setDataSharing(settings.dataSharing || dataSharing);
      }
    } catch (error) {
      console.error('Failed to load security settings:', error);
    }
  };
  
  // Save security settings to localStorage
  const saveSecuritySettings = (settings: Partial<{
    twoFactorEnabled: boolean;
    securityLevel: SecurityContextType['securityLevel'];
    dataSharing: DataSharingSettings;
  }>) => {
    try {
      const current = {
        twoFactorEnabled,
        securityLevel,
        dataSharing,
        ...settings,
      };
      localStorage.setItem('security-settings', JSON.stringify(current));
    } catch (error) {
      console.error('Failed to save security settings:', error);
    }
  };
  
  // Load active sessions
  const loadActiveSessions = () => {
    try {
      const saved = localStorage.getItem('active-sessions');
      if (saved) {
        const sessions = JSON.parse(saved);
        setActiveSessions(sessions);
      } else {
        // Create current session
        const currentSession: SessionInfo = {
          id: generateSessionId(),
          device: getDeviceInfo(),
          browser: getBrowserInfo(),
          location: 'Unknown',
          ipAddress: 'Unknown',
          lastActive: new Date(),
          isCurrent: true,
        };
        setActiveSessions([currentSession]);
        localStorage.setItem('active-sessions', JSON.stringify([currentSession]));
      }
    } catch (error) {
      console.error('Failed to load active sessions:', error);
    }
  }
  
  // Generate session ID
  const generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };
  
  // Get device information
  const getDeviceInfo = (): string => {
    const userAgent = navigator.userAgent;
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      return /iPad/.test(userAgent) ? 'Tablet' : 'Mobile';
    }
    return 'Desktop';
  };
  
  // Get browser information
  const getBrowserInfo = (): string => {
    const userAgent = navigator.userAgent;
    if (/Chrome/.test(userAgent)) return 'Chrome';
    if (/Firefox/.test(userAgent)) return 'Firefox';
    if (/Safari/.test(userAgent)) return 'Safari';
    if (/Edge/.test(userAgent)) return 'Edge';
    return 'Unknown';
  };
  
  // Add security event
  const addSecurityEvent = (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
    const newEvent: SecurityEvent = {
      ...event,
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      resolved: false,
    };
    
    setSecurityEvents(prev => [newEvent, ...prev.slice(0, 99)]); // Keep last 100 events
    
    // Update threat level based on events
    updateThreatLevel();
  };
  
  // Update threat level based on recent events
  const updateThreatLevel = () => {
    const recentEvents = securityEvents.filter(
      event => new Date().getTime() - event.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );
    
    const criticalCount = recentEvents.filter(e => e.severity === 'critical').length;
    const highCount = recentEvents.filter(e => e.severity === 'high').length;
    const mediumCount = recentEvents.filter(e => e.severity === 'medium').length;
    
    if (criticalCount > 0) {
      setThreatLevel('critical');
    } else if (highCount > 2) {
      setThreatLevel('high');
    } else if (mediumCount > 5 || highCount > 0) {
      setThreatLevel('medium');
    } else {
      setThreatLevel('low');
    }
  };
  
  // Enable two-factor authentication
  const enableTwoFactor = async (): Promise<void> => {
    try {
      // In a real app, this would integrate with a 2FA service
      setTwoFactorEnabled(true);
      saveSecuritySettings({ twoFactorEnabled: true });
      
      analytics.trackSecurity('2fa_enabled', 'low', 'settings_change');
      addSecurityEvent({
        type: 'settings_change',
        severity: 'low',
        description: 'Two-factor authentication enabled',
      });
      
      // Track accessibility event
      analytics.trackAccessibility('two_factor_auth', 'enabled', 'high');
    } catch (error) {
      console.error('Failed to enable 2FA:', error);
      throw error;
    }
  };
  
  // Disable two-factor authentication
  const disableTwoFactor = async (): Promise<void> => {
    try {
      setTwoFactorEnabled(false);
      saveSecuritySettings({ twoFactorEnabled: false });
      
      analytics.trackSecurity('2fa_disabled', 'medium', 'settings_change');
      addSecurityEvent({
        type: 'settings_change',
        severity: 'medium',
        description: 'Two-factor authentication disabled',
      });
      
      // Track accessibility event
      analytics.trackAccessibility('two_factor_auth', 'disabled', 'high');
    } catch (error) {
      console.error('Failed to disable 2FA:', error);
      throw error;
    }
  };
  
  // Revoke specific session
  const revokeSession = async (sessionId: string): Promise<void> => {
    try {
      setActiveSessions(prev => prev.filter(session => session.id !== sessionId));
      
      // Update localStorage
      const updatedSessions = activeSessions.filter(session => session.id !== sessionId);
      localStorage.setItem('active-sessions', JSON.stringify(updatedSessions));
      
      analytics.trackSecurity('session_revoked', 'medium', 'authentication_failure');
      addSecurityEvent({
        type: 'suspicious_activity',
        severity: 'medium',
        description: `Session revoked: ${sessionId}`,
      });
    } catch (error) {
      console.error('Failed to revoke session:', error);
      throw error;
    }
  };
  
  // Revoke all sessions except current
  const revokeAllSessions = async (): Promise<void> => {
    try {
      const currentSession = activeSessions.find(session => session.isCurrent);
      if (currentSession) {
        setActiveSessions([currentSession]);
        localStorage.setItem('active-sessions', JSON.stringify([currentSession]));
      }
      
      analytics.trackSecurity('all_sessions_revoked', 'high', 'authentication_failure');
      addSecurityEvent({
        type: 'suspicious_activity',
        severity: 'high',
        description: 'All sessions revoked except current',
      });
    } catch (error) {
      console.error('Failed to revoke all sessions:', error);
      throw error;
    }
  };
  
  // Update security level
  const updateSecurityLevel = async (level: SecurityContextType['securityLevel']): Promise<void> => {
    try {
      setSecurityLevel(level);
      saveSecuritySettings({ securityLevel: level });
      
      analytics.trackSecurity('security_level_changed', 'medium', 'settings_change');
      addSecurityEvent({
        type: 'settings_change',
        severity: 'medium',
        description: `Security level changed to ${level}`,
      });
      
      // Track accessibility event
      analytics.trackAccessibility('security_level', 'changed', 'high', securityLevel, level);
    } catch (error) {
      console.error('Failed to update security level:', error);
      throw error;
    }
  };
  
  // Update data sharing settings
  const updateDataSharing = async (settings: Partial<DataSharingSettings>): Promise<void> => {
    try {
      const newSettings = { ...dataSharing, ...settings };
      setDataSharing(newSettings);
      saveSecuritySettings({ dataSharing: newSettings });
      
      analytics.trackSecurity('data_sharing_updated', 'low', 'settings_change');
      addSecurityEvent({
        type: 'settings_change',
        severity: 'low',
        description: 'Data sharing settings updated',
      });
      
      // Track accessibility event
      analytics.trackAccessibility('data_sharing', 'changed', 'medium', dataSharing, newSettings);
    } catch (error) {
      console.error('Failed to update data sharing:', error);
      throw error;
    }
  };
  
  // Refresh session
  const refreshSession = async (): Promise<void> => {
    try {
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + sessionTimeout);
      setSessionExpiry(expiry);
      setLastActivity(new Date());
      
      // Update current session
      setActiveSessions(prev => 
        prev.map(session => 
          session.isCurrent 
            ? { ...session, lastActive: new Date() }
            : session
        )
      );
      
      analytics.trackSecurity('session_refreshed', 'low', 'authentication_success');
    } catch (error) {
      console.error('Failed to refresh session:', error);
      throw error;
    }
  };
  
  // Export user data
  const exportData = async (): Promise<void> => {
    try {
      const userData = {
        profile: user,
        security: {
          twoFactorEnabled,
          securityLevel,
          dataSharing,
        },
        sessions: activeSessions,
        events: securityEvents,
        exportDate: new Date().toISOString(),
      };
      
      const dataStr = JSON.stringify(userData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `user-data-${Date.now()}.json`;
      link.click();
      URL.revokeObjectURL(url);
      
      analytics.trackSecurity('data_exported', 'low', 'data_access');
      addSecurityEvent({
        type: 'data_access',
        severity: 'low',
        description: 'User data exported',
      });
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  };
  
  // Delete user data
  const deleteData = async (): Promise<void> => {
    try {
      // In a real app, this would make an API call to delete data
      // For now, we'll just clear local storage
      localStorage.removeItem('security-settings');
      localStorage.removeItem('active-sessions');
      
      analytics.trackSecurity('data_deleted', 'high', 'data_access');
      addSecurityEvent({
        type: 'data_access',
        severity: 'high',
        description: 'User data deleted',
      });
      
      // Logout after data deletion
      await logout();
    } catch (error) {
      console.error('Failed to delete data:', error);
      throw error;
    }
  };
  
  // Logout
  const logout = async (): Promise<void> => {
    try {
      analytics.trackSecurity('user_logout', 'low', 'authentication_success');
      addSecurityEvent({
        type: 'logout',
        severity: 'low',
        description: 'User logged out',
      });
      
      await signOut();
    } catch (error) {
      console.error('Failed to logout:', error);
      throw error;
    }
  };
  
  // Context value
  const value: SecurityContextType = {
    isAuthenticated,
    sessionExpiry,
    lastActivity,
    sessionTimeout,
    twoFactorEnabled,
    activeSessions,
    securityLevel,
    dataSharing,
    securityEvents,
    threatLevel,
    enableTwoFactor,
    disableTwoFactor,
    revokeSession,
    revokeAllSessions,
    updateSecurityLevel,
    updateDataSharing,
    refreshSession,
    exportData,
    deleteData,
    logout,
  };
  
  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// Custom hook
export const useSecurity = (): SecurityContextType => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export default SecurityProvider;
