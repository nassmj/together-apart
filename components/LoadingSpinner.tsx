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

// LoadingButton component for buttons with loading states
interface LoadingButtonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  onClick?: () => void;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  disabled = false,
  type = 'button',
  className = '',
  onClick
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`btn btn-primary flex items-center justify-center gap-2 ${className} ${
        (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
    >
      {isLoading && (
        <LoadingSpinner size="sm" color="white" />
      )}
      {isLoading ? loadingText : children}
    </button>
  );
};

// SkeletonCard component for card loading states
interface SkeletonCardProps {
  className?: string;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white dark:bg-white/5 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-white/10 ${className}`}>
      <div className="space-y-4">
        <div className="skeleton h-6 w-3/4 rounded-lg" />
        <div className="skeleton h-4 w-full rounded-lg" />
        <div className="skeleton h-4 w-2/3 rounded-lg" />
        <div className="skeleton h-4 w-1/2 rounded-lg" />
      </div>
    </div>
  );
};

export { LoadingSpinner, Skeleton, LoadingButton, SkeletonCard };

