import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const DevTools: React.FC = () => {
  // Only render in development
  if (import.meta.env.DEV) {
    return <ReactQueryDevtools initialIsOpen={false} />;
  }
  
  return null;
};








