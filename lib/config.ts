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

// Fallback configuration for development/demo mode
const getFallbackConfig = () => {
  if (import.meta.env.DEV) {
    return {
      url: 'https://bbjaadyoxeiodxyhsgzu.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiamFhZHlveGVpb2R4eWhzZ3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MTE2NjgsImV4cCI6MjA3MTM4NzY2OH0.t9mbqPZzoySneVbL1vrEtRHB2aedDSMmeRmsNw90HKg'
    };
  }
  return null;
};

export const config: AppConfig = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || getFallbackConfig()?.url || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || getFallbackConfig()?.anonKey || '',
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
