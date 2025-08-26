import React, { useEffect, useRef, ReactNode } from 'react';

interface FocusManagerProps {
  children: ReactNode;
  isActive?: boolean;
  onEscape?: () => void;
  trapFocus?: boolean;
  returnFocus?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

export const FocusManager: React.FC<FocusManagerProps> = ({
  children,
  isActive = true,
  onEscape,
  trapFocus = false,
  returnFocus = false,
  initialFocusRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Focus the initial element or the first focusable element
    if (initialFocusRef?.current) {
      initialFocusRef.current.focus();
    } else if (containerRef.current) {
      const firstFocusable = getFirstFocusableElement(containerRef.current);
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    // Handle escape key
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && onEscape) {
        onEscape();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Handle focus trapping
    if (trapFocus) {
      const handleFocusTrap = (event: KeyboardEvent) => {
        if (event.key === 'Tab' && containerRef.current) {
          const focusableElements = getFocusableElements(containerRef.current);
          
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) {
            // Shift + Tab
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleFocusTrap);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Return focus to the previous element
      if (returnFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [isActive, onEscape, trapFocus, returnFocus, initialFocusRef]);

  return (
    <div ref={containerRef} tabIndex={-1}>
      {children}
    </div>
  );
};

// Utility functions for focus management
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];

  const elements = Array.from(container.querySelectorAll(focusableSelectors.join(', ')));
  return elements.filter((element) => {
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && style.visibility !== 'hidden';
  }) as HTMLElement[];
};

export const getFirstFocusableElement = (container: HTMLElement): HTMLElement | null => {
  const focusableElements = getFocusableElements(container);
  return focusableElements.length > 0 ? focusableElements[0] : null;
};

export const getLastFocusableElement = (container: HTMLElement): HTMLElement | null => {
  const focusableElements = getFocusableElements(container);
  return focusableElements.length > 0 ? focusableElements[focusableElements.length - 1] : null;
};

// Hook for managing focus
export const useFocusManagement = () => {
  const focusHistory = useRef<HTMLElement[]>([]);

  const saveFocus = () => {
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus) {
      focusHistory.current.push(currentFocus);
    }
  };

  const restoreFocus = () => {
    const previousFocus = focusHistory.current.pop();
    if (previousFocus) {
      previousFocus.focus();
    }
  };

  const clearFocusHistory = () => {
    focusHistory.current = [];
  };

  return {
    saveFocus,
    restoreFocus,
    clearFocusHistory,
  };
};
