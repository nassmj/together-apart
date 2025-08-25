import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent' | 'white';
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    primary: 'border-primary',
    secondary: 'border-secondary',
    accent: 'border-accent',
    white: 'border-white'
  };

  return (
    <motion.div
      className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </motion.div>
  );
};

// Skeleton component for loading states
interface SkeletonProps {
  className?: string;
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({ className = '', lines = 1 }) => {
  if (lines === 1) {
    return (
      <div className={`skeleton rounded-lg ${className}`} aria-hidden="true" />
    );
  }

  return (
    <div className="space-y-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`skeleton rounded-lg ${className}`}
          style={{ 
            width: `${100 - (index * 10)}%`,
            height: '1rem'
          }}
        />
      ))}
    </div>
  );
};

export { LoadingSpinner, Skeleton };

