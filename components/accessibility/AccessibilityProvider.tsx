import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Accessibility Context Types
interface AccessibilityContextType {
  // Theme Management
  theme: 'light' | 'dark' | 'high-contrast';
  setTheme: (theme: 'light' | 'dark' | 'high-contrast') => void;
  
  // Motion Preferences
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
  
  // Focus Management
  focusVisible: boolean;
  setFocusVisible: (visible: boolean) => void;
  
  // High Contrast Mode
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  
  // Font Size Scaling
  fontSize: 'normal' | 'large' | 'x-large';
  setFontSize: (size: 'normal' | 'large' | 'x-large') => void;
  
  // Line Height
  lineHeight: 'normal' | 'relaxed' | 'extra-relaxed';
  setLineHeight: (height: 'normal' | 'relaxed' | 'extra-relaxed') => void;
  
  // Spacing
  spacing: 'normal' | 'large' | 'x-large';
  setSpacing: (spacing: 'normal' | 'large' | 'x-large') => void;
  
  // RTL Support
  direction: 'ltr' | 'rtl';
  setDirection: (dir: 'ltr' | 'rtl') => void;
  
  // Language
  language: string;
  setLanguage: (lang: string) => void;
  
  // Screen Reader Announcements
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  
  // Skip Links
  skipToMain: () => void;
  skipToNav: () => void;
}

// Default Context
const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

// Accessibility Provider Props
interface AccessibilityProviderProps {
  children: ReactNode;
}

// Accessibility Provider Component
export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark' | 'high-contrast'>(() => {
    const saved = localStorage.getItem('accessibility-theme');
    return (saved as 'light' | 'dark' | 'high-contrast') || 'light';
  });

  // Motion Preferences
  const [reducedMotion, setReducedMotion] = useState(() => {
    const saved = localStorage.getItem('accessibility-reduced-motion');
    return saved ? JSON.parse(saved) : false;
  });

  // Focus Management
  const [focusVisible, setFocusVisible] = useState(() => {
    const saved = localStorage.getItem('accessibility-focus-visible');
    return saved ? JSON.parse(saved) : true;
  });

  // High Contrast Mode
  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('accessibility-high-contrast');
    return saved ? JSON.parse(saved) : false;
  });

  // Font Size Scaling
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'x-large'>(() => {
    const saved = localStorage.getItem('accessibility-font-size');
    return (saved as 'normal' | 'large' | 'x-large') || 'normal';
  });

  // Line Height
  const [lineHeight, setLineHeight] = useState<'normal' | 'relaxed' | 'extra-relaxed'>(() => {
    const saved = localStorage.getItem('accessibility-line-height');
    return (saved as 'normal' | 'relaxed' | 'extra-relaxed') || 'normal';
  });

  // Spacing
  const [spacing, setSpacing] = useState<'normal' | 'large' | 'x-large'>(() => {
    const saved = localStorage.getItem('accessibility-spacing');
    return (saved as 'normal' | 'large' | 'x-large') || 'normal';
  });

  // RTL Support
  const [direction, setDirection] = useState<'ltr' | 'rtl'>(() => {
    const saved = localStorage.getItem('accessibility-direction');
    return (saved as 'ltr' | 'rtl') || 'ltr';
  });

  // Language
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('accessibility-language');
    return saved || 'en';
  });

  // Apply Theme to Document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark', 'high-contrast');
    
    // Apply current theme
    if (theme === 'high-contrast') {
      root.classList.add('high-contrast');
    } else {
      root.classList.add(theme);
    }
    
    // Store in localStorage
    localStorage.setItem('accessibility-theme', theme);
  }, [theme]);

  // Apply Motion Preferences
  useEffect(() => {
    const root = document.documentElement;
    
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    
    localStorage.setItem('accessibility-reduced-motion', JSON.stringify(reducedMotion));
  }, [reducedMotion]);

  // Apply Focus Management
  useEffect(() => {
    const root = document.documentElement;
    
    if (!focusVisible) {
      root.classList.add('no-focus-visible');
    } else {
      root.classList.remove('no-focus-visible');
    }
    
    localStorage.setItem('accessibility-focus-visible', JSON.stringify(focusVisible));
  }, [focusVisible]);

  // Apply Font Size Scaling
  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('font-size-normal', 'font-size-large', 'font-size-x-large');
    root.classList.add(`font-size-${fontSize}`);
    
    localStorage.setItem('accessibility-font-size', fontSize);
  }, [fontSize]);

  // Apply Line Height
  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('line-height-normal', 'line-height-relaxed', 'line-height-extra-relaxed');
    root.classList.add(`line-height-${lineHeight}`);
    
    localStorage.setItem('accessibility-line-height', lineHeight);
  }, [lineHeight]);

  // Apply Spacing
  useEffect(() => {
    const root = document.documentElement;
    
    root.classList.remove('spacing-normal', 'spacing-large', 'spacing-x-large');
    root.classList.add(`spacing-${spacing}`);
    
    localStorage.setItem('accessibility-spacing', spacing);
  }, [spacing]);

  // Apply Direction
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('dir', direction);
    localStorage.setItem('accessibility-direction', direction);
  }, [direction]);

  // Apply Language
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('lang', language);
    localStorage.setItem('accessibility-language', language);
  }, [language]);

  // Screen Reader Announcements
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Skip Links
  const skipToMain = () => {
    const main = document.querySelector('main');
    if (main) {
      main.focus();
      announce('Navigated to main content', 'assertive');
    }
  };

  const skipToNav = () => {
    const nav = document.querySelector('nav');
    if (nav) {
      nav.focus();
      announce('Navigated to navigation', 'assertive');
    }
  };

  // Context Value
  const value: AccessibilityContextType = {
    theme,
    setTheme,
    reducedMotion,
    setReducedMotion,
    focusVisible,
    setFocusVisible,
    highContrast,
    setHighContrast,
    fontSize,
    setFontSize,
    lineHeight,
    setLineHeight,
    spacing,
    setSpacing,
    direction,
    setDirection,
    language,
    setLanguage,
    announce,
    skipToMain,
    skipToNav,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Custom Hook
export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityProvider;
