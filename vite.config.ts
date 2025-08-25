import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      plugins: [react()],
      define: {
        'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL || 'https://bbjaadyoxeiodxyhsgzu.supabase.co'),
        'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJiamFhZHlveGVpb2R4eWhzZ3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4MTE2NjgsImV4cCI6MjA3MTM4NzY2OH0.t9mbqPZzoySneVbL1vrEtRHB2aedDSMmeRmsNw90HKg'),
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY || ''),
        'import.meta.env.MODE': JSON.stringify(mode),
        'import.meta.env.DEV': JSON.stringify(mode === 'development'),
        'import.meta.env.PROD': JSON.stringify(mode === 'production'),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: undefined,
          },
        },
        chunkSizeWarningLimit: 1000,
        sourcemap: false,
        minify: 'esbuild',
      },
      optimizeDeps: {
        include: [
          'react',
          'react-dom',
          'react-router-dom',
          '@heroicons/react',
          'framer-motion',
          '@tanstack/react-query',
          '@supabase/supabase-js',
          'zod',
        ],
      },
    };
});
