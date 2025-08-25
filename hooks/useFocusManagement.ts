import { useEffect, useRef, useCallback } from 'react';

interface UseFocusManagementOptions {
  trapFocus?: boolean;
  returnFocus?: boolean;
  autoFocus?: boolean;
}

export const useFocusManagement = (options: UseFocusManagementOptions = {}) => {
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const { trapFocus = false, returnFocus = true, autoFocus = false } = options;

  // Store the previously focused element
  useEffect(() => {
    if (returnFocus) {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }
  }, [returnFocus]);

  // Auto-focus the first focusable element
  useEffect(() => {
    if (autoFocus && containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [autoFocus]);

  // Focus trap for modal-like components
  useEffect(() => {
    if (!trapFocus || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [trapFocus]);

  // Return focus when component unmounts
  useEffect(() => {
    return () => {
      if (returnFocus && previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [returnFocus]);

  const focusFirst = useCallback(() => {
    if (containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, []);

  const focusLast = useCallback(() => {
    if (containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements.length > 0) {
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        lastElement.focus();
      }
    }
  }, []);

  return {
    containerRef,
    focusFirst,
    focusLast,
  };
};

// Hook for managing focus on mount/unmount
export const useAutoFocus = (enabled: boolean = true) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (enabled && elementRef.current) {
      elementRef.current.focus();
    }
  }, [enabled]);

  return elementRef;
};

// Hook for managing focus when a condition changes
export const useFocusOnChange = (condition: boolean, options: { delay?: number } = {}) => {
  const elementRef = useRef<HTMLElement>(null);
  const { delay = 0 } = options;

  useEffect(() => {
    if (condition && elementRef.current) {
      const timer = setTimeout(() => {
        elementRef.current?.focus();
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [condition, delay]);

  return elementRef;
};
