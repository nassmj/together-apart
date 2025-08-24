import React from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-neutral-ink"
        >
          {label}
        </label>
      )}
      
      <motion.div 
        className="relative"
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-muted">
            {leftIcon}
          </div>
        )}
        
        <input
          id={inputId}
          className={`
            input
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${hasError ? 'input-error' : ''}
            transition-all duration-200
          `}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-muted">
            {rightIcon}
          </div>
        )}
      </motion.div>
      
      {(error || helperText) && (
        <motion.p
          className={`text-sm ${hasError ? 'text-error' : 'text-neutral-muted'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error || helperText}
        </motion.p>
      )}
    </div>
  );
};

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = !!error;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-neutral-ink"
        >
          {label}
        </label>
      )}
      
      <motion.div 
        whileFocus={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <textarea
          id={textareaId}
          className={`
            input
            resize-none
            ${hasError ? 'input-error' : ''}
            transition-all duration-200
          `}
          {...props}
        />
      </motion.div>
      
      {(error || helperText) && (
        <motion.p
          className={`text-sm ${hasError ? 'text-error' : 'text-neutral-muted'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {error || helperText}
        </motion.p>
      )}
    </div>
  );
};

export default Input;
