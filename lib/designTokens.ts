// Together Apart Design Tokens v1.0
// Based on the comprehensive UX/UI specification

export const designTokens = {
  // Color System
  colors: {
    // Primary - Rose
    rose: {
      10: '#FFF4F3',
      20: '#FFE6E3',
      40: '#FFCAC3',
      60: '#FBA79E',
      80: '#F28B82', // Primary
      100: '#D86E68',
    },
    // Secondary - Lavender
    lavender: {
      10: '#F5F7FF',
      20: '#E9ECFF',
      40: '#D4DBFF',
      60: '#B9C6FF',
      80: '#A5B4FC', // Secondary
      100: '#7C8CF5',
    },
    // Accent - Sunset Peach
    peach: {
      10: '#FFF6F1',
      20: '#FFE9DE',
      40: '#FFD3BE',
      60: '#FFBEA0',
      80: '#FFB085', // Accent
      100: '#FF8E54',
    },
    // Neutrals - Light Mode
    neutral: {
      bg: '#FAFAFA',
      surface: '#FFFFFF',
      card: '#FFFFFF',
      ink: '#333333',
      muted: '#9CA3AF',
      divider: '#E5E7EB',
      overlay: 'rgba(0,0,0,0.5)',
    },
    // Dark Mode
    dark: {
      bg: '#0F1115',
      surface: '#16181D',
      card: '#1C1F26',
      ink: '#F5F7FA',
      muted: '#C6CBD3',
      divider: '#2D3748',
      overlay: 'rgba(0,0,0,0.7)',
    },
    // Semantic Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Typography
  typography: {
    fontFamily: {
      display: 'Clash Display, UI-Sans-Serif, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '28px',
      '4xl': '32px',
      '5xl': '36px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: '1.3',
      normal: '1.5',
    },
  },

  // Spacing Scale
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  // Border Radius
  radius: {
    none: '0px',
    sm: '6px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '28px',
    '3xl': '36px',
    full: '9999px',
  },

  // Shadows
  shadow: {
    1: '0 6px 10px rgba(0,0,0,0.06)',
    2: '0 10px 18px rgba(0,0,0,0.10)',
    3: '0 18px 28px rgba(0,0,0,0.14)',
  },

  // Motion
  motion: {
    duration: {
      fast: '120ms',
      base: '180ms',
      slow: '240ms',
    },
    easing: {
      standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      overshoot: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  // Gradients
  gradients: {
    romanticSky: 'linear-gradient(135deg, #F28B82 0%, #A5B4FC 100%)',
    sunsetWhisper: 'linear-gradient(135deg, #FFB085 0%, #F28B82 100%)',
  },

  // Breakpoints
  breakpoints: {
    xs: '360px',
    sm: '600px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1440px',
    '3xl': '1920px',
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
};

// Utility functions
export const getColor = (color: string, shade?: string) => {
  const [category, level] = color.split('.');
  return designTokens.colors[category as keyof typeof designTokens.colors]?.[level as any] || color;
};

export const getSpacing = (size: keyof typeof designTokens.spacing) => {
  return designTokens.spacing[size];
};

export const getRadius = (size: keyof typeof designTokens.radius) => {
  return designTokens.radius[size];
};
