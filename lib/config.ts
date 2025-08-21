interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
  };
  gemini: {
    apiKey: string | undefined;
  };
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
  };
}

const getRequiredEnvVar = (name: string): string => {
  const value = import.meta.env[name];
  if (!value) {
    // In development, allow missing env vars for demo mode
    if (import.meta.env.DEV) {
      console.warn(`Missing environment variable: ${name}. Running in demo mode.`);
      return '';
    }
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

export const config: AppConfig = {
  supabase: {
    url: getRequiredEnvVar('VITE_SUPABASE_URL'),
    anonKey: getRequiredEnvVar('VITE_SUPABASE_ANON_KEY'),
  },
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  },
  app: {
    name: 'Together Apart',
    version: '1.0.0',
    environment: (import.meta.env.MODE as AppConfig['app']['environment']) || 'development',
  },
};

// Validate configuration on startup
export const validateConfig = (): void => {
  // In development, allow missing env vars for demo mode
  if (import.meta.env.DEV && (!config.supabase.url || !config.supabase.anonKey)) {
    console.warn('Running in demo mode without Supabase configuration.');
    return;
  }
  
  if (!config.supabase.url || !config.supabase.anonKey) {
    throw new Error('Supabase configuration is incomplete. Please check your environment variables.');
  }
  
  if (config.app.environment === 'production' && !config.gemini.apiKey) {
    console.warn('Gemini API key not found. AI features will be disabled.');
  }
};
