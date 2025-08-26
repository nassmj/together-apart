export interface RealtimeMessage {
  id: string;
  type: 'memory' | 'connection' | 'activity' | 'notification' | 'typing' | 'presence';
  action: 'create' | 'update' | 'delete' | 'typing_start' | 'typing_stop' | 'online' | 'offline';
  userId: string;
  partnerId?: string;
  data: any;
  timestamp: number;
}

export interface TypingIndicator {
  userId: string;
  isTyping: boolean;
  timestamp: number;
}

export interface PresenceStatus {
  userId: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: number;
  currentPage?: string;
}

export interface RealtimeConfig {
  enableTypingIndicators: boolean;
  enablePresence: boolean;
  enableNotifications: boolean;
  syncInterval: number; // milliseconds
}

class RealtimeSystem {
  private listeners: Map<string, Set<(message: RealtimeMessage) => void>> = new Map();
  private typingIndicators: Map<string, TypingIndicator> = new Map();
  private presenceStatus: Map<string, PresenceStatus> = new Map();
  private syncTimer?: NodeJS.Timeout;
  private isEnabled: boolean = true;
  private config: RealtimeConfig = {
    enableTypingIndicators: true,
    enablePresence: true,
    enableNotifications: true,
    syncInterval: 5000, // 5 seconds
  };

  constructor() {
    this.initializeSystem();
  }

  private initializeSystem(): void {
    // Start sync timer
    this.startSyncTimer();

    // Set up presence tracking
    if (this.config.enablePresence) {
      this.setupPresenceTracking();
    }

    // Set up notification handling
    if (this.config.enableNotifications) {
      this.setupNotificationHandling();
    }
  }

  private startSyncTimer(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }

    this.syncTimer = setInterval(() => {
      this.syncData();
    }, this.config.syncInterval);
  }

  private setupPresenceTracking(): void {
    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.updatePresence('away');
      } else {
        this.updatePresence('online');
      }
    });

    // Track beforeunload
    window.addEventListener('beforeunload', () => {
      this.updatePresence('offline');
    });

    // Track user activity
    let activityTimeout: NodeJS.Timeout;
    const resetActivity = () => {
      clearTimeout(activityTimeout);
      this.updatePresence('online');
      activityTimeout = setTimeout(() => {
        this.updatePresence('away');
      }, 5 * 60 * 1000); // 5 minutes
    };

    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, resetActivity, true);
    });
  }

  private setupNotificationHandling(): void {
    // Request notification permission
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }

  // Message handling
  subscribe(type: string, callback: (message: RealtimeMessage) => void): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type)!.add(callback);

    // Return unsubscribe function
    return () => {
      const typeListeners = this.listeners.get(type);
      if (typeListeners) {
        typeListeners.delete(callback);
        if (typeListeners.size === 0) {
          this.listeners.delete(type);
        }
      }
    };
  }

  private notifyListeners(message: RealtimeMessage): void {
    const typeListeners = this.listeners.get(message.type);
    if (typeListeners) {
      typeListeners.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error in realtime listener:', error);
        }
      });
    }

    // Also notify general listeners
    const generalListeners = this.listeners.get('*');
    if (generalListeners) {
      generalListeners.forEach(callback => {
        try {
          callback(message);
        } catch (error) {
          console.error('Error in general realtime listener:', error);
        }
      });
    }
  }

  // Memory realtime updates
  notifyMemoryCreated(memory: any, userId: string, partnerId?: string): void {
    const message: RealtimeMessage = {
      id: `memory_${Date.now()}_${Math.random()}`,
      type: 'memory',
      action: 'create',
      userId,
      partnerId,
      data: memory,
      timestamp: Date.now(),
    };

    this.notifyListeners(message);
    this.showNotification('New memory created', `${memory.title} was added to your timeline`);
  }

  notifyMemoryUpdated(memory: any, userId: string, partnerId?: string): void {
    const message: RealtimeMessage = {
      id: `memory_${Date.now()}_${Math.random()}`,
      type: 'memory',
      action: 'update',
      userId,
      partnerId,
      data: memory,
      timestamp: Date.now(),
    };

    this.notifyListeners(message);
  }

  // Connection realtime updates
  notifyConnectionAnswered(connection: any, userId: string, partnerId?: string): void {
    const message: RealtimeMessage = {
      id: `connection_${Date.now()}_${Math.random()}`,
      type: 'connection',
      action: 'update',
      userId,
      partnerId,
      data: connection,
      timestamp: Date.now(),
    };

    this.notifyListeners(message);
    this.showNotification('Daily connection answered', 'Your partner answered today\'s question');
  }

  // Activity realtime updates
  notifyActivityPlanned(activity: any, userId: string, partnerId?: string): void {
    const message: RealtimeMessage = {
      id: `activity_${Date.now()}_${Math.random()}`,
      type: 'activity',
      action: 'create',
      userId,
      partnerId,
      data: activity,
      timestamp: Date.now(),
    };

    this.notifyListeners(message);
    this.showNotification('New activity planned', `${activity.title} was added to your planner`);
  }

  // Typing indicators
  startTyping(userId: string, context: string): void {
    if (!this.config.enableTypingIndicators) return;

    const indicator: TypingIndicator = {
      userId,
      isTyping: true,
      timestamp: Date.now(),
    };

    this.typingIndicators.set(`${userId}_${context}`, indicator);

    const message: RealtimeMessage = {
      id: `typing_${Date.now()}_${Math.random()}`,
      type: 'typing',
      action: 'typing_start',
      userId,
      data: { context },
      timestamp: Date.now(),
    };

    this.notifyListeners(message);
  }

  stopTyping(userId: string, context: string): void {
    if (!this.config.enableTypingIndicators) return;

    this.typingIndicators.delete(`${userId}_${context}`);

    const message: RealtimeMessage = {
      id: `typing_${Date.now()}_${Math.random()}`,
      type: 'typing',
      action: 'typing_stop',
      userId,
      data: { context },
      timestamp: Date.now(),
    };

    this.notifyListeners(message);
  }

  getTypingIndicators(context: string): TypingIndicator[] {
    return Array.from(this.typingIndicators.values())
      .filter(indicator => indicator.isTyping)
      .filter(indicator => {
        const key = `${indicator.userId}_${context}`;
        return this.typingIndicators.has(key);
      });
  }

  // Presence management
  updatePresence(status: 'online' | 'offline' | 'away', userId?: string, currentPage?: string): void {
    if (!this.config.enablePresence) return;

    const presence: PresenceStatus = {
      userId: userId || 'current-user',
      status,
      lastSeen: Date.now(),
      currentPage,
    };

    this.presenceStatus.set(presence.userId, presence);

    const message: RealtimeMessage = {
      id: `presence_${Date.now()}_${Math.random()}`,
      type: 'presence',
      action: status === 'online' ? 'online' : 'offline',
      userId: presence.userId,
      data: presence,
      timestamp: Date.now(),
    };

    this.notifyListeners(message);
  }

  getPresenceStatus(userId: string): PresenceStatus | undefined {
    return this.presenceStatus.get(userId);
  }

  getAllPresenceStatus(): PresenceStatus[] {
    return Array.from(this.presenceStatus.values());
  }

  // Notifications
  private showNotification(title: string, body: string): void {
    if (!this.config.enableNotifications) return;

    // Browser notifications
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    }

    // In-app notification
    const message: RealtimeMessage = {
      id: `notification_${Date.now()}_${Math.random()}`,
      type: 'notification',
      action: 'create',
      userId: 'system',
      data: { title, body },
      timestamp: Date.now(),
    };

    this.notifyListeners(message);
  }

  // Data synchronization
  private syncData(): void {
    // In a real implementation, this would sync with the server
    // For now, we'll just clean up old data
    this.cleanupOldData();
  }

  private cleanupOldData(): void {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;

    // Clean up old typing indicators
    for (const [key, indicator] of this.typingIndicators.entries()) {
      if (indicator.timestamp < fiveMinutesAgo) {
        this.typingIndicators.delete(key);
      }
    }

    // Clean up old presence data
    for (const [userId, presence] of this.presenceStatus.entries()) {
      if (presence.lastSeen < fiveMinutesAgo && presence.status !== 'offline') {
        this.updatePresence('offline', userId);
      }
    }
  }

  // Configuration
  updateConfig(newConfig: Partial<RealtimeConfig>): void {
    this.config = { ...this.config, ...newConfig };

    if (newConfig.syncInterval) {
      this.startSyncTimer();
    }
  }

  getConfig(): RealtimeConfig {
    return { ...this.config };
  }

  // System control
  enable(): void {
    this.isEnabled = true;
    this.initializeSystem();
  }

  disable(): void {
    this.isEnabled = false;
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
    }
  }

  isSystemEnabled(): boolean {
    return this.isEnabled;
  }

  // Utility methods
  getSystemStatus(): {
    enabled: boolean;
    listeners: number;
    typingIndicators: number;
    presenceStatus: number;
  } {
    return {
      enabled: this.isEnabled,
      listeners: Array.from(this.listeners.values()).reduce((sum, set) => sum + set.size, 0),
      typingIndicators: this.typingIndicators.size,
      presenceStatus: this.presenceStatus.size,
    };
  }

  // Export data for debugging
  exportData(): {
    config: RealtimeConfig;
    typingIndicators: TypingIndicator[];
    presenceStatus: PresenceStatus[];
    systemStatus: any;
  } {
    return {
      config: this.getConfig(),
      typingIndicators: Array.from(this.typingIndicators.values()),
      presenceStatus: Array.from(this.presenceStatus.values()),
      systemStatus: this.getSystemStatus(),
    };
  }
}

// Create singleton instance
export const realtime = new RealtimeSystem();

// Export convenience functions
export const subscribeToRealtime = (type: string, callback: (message: RealtimeMessage) => void) =>
  realtime.subscribe(type, callback);

export const notifyMemoryCreated = (memory: any, userId: string, partnerId?: string) =>
  realtime.notifyMemoryCreated(memory, userId, partnerId);

export const notifyConnectionAnswered = (connection: any, userId: string, partnerId?: string) =>
  realtime.notifyConnectionAnswered(connection, userId, partnerId);

export const notifyActivityPlanned = (activity: any, userId: string, partnerId?: string) =>
  realtime.notifyActivityPlanned(activity, userId, partnerId);

export const startTyping = (userId: string, context: string) =>
  realtime.startTyping(userId, context);

export const stopTyping = (userId: string, context: string) =>
  realtime.stopTyping(userId, context);

export const updatePresence = (status: 'online' | 'offline' | 'away', userId?: string, currentPage?: string) =>
  realtime.updatePresence(status, userId, currentPage);
