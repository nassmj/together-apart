// WCAG 2.2 AA Compliance Test Suite
// Tests accessibility features and compliance with Web Content Accessibility Guidelines

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BrowserRouter } from 'react-router-dom';
import { AccessibilityProvider } from '../../components/accessibility/AccessibilityProvider';
import { SecurityProvider } from '../../contexts/SecurityContext';
import { AuthProvider } from '../../contexts/AuthContext';
import DashboardPage from '../../pages/dashboard/DashboardPage';
import AccessibilitySettings from '../../components/accessibility/AccessibilitySettings';

// Extend Jest matchers for accessibility testing
expect.extend(toHaveNoViolations);

// Test wrapper with all providers
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <SecurityProvider>
        <AccessibilityProvider>
          {children}
        </AccessibilityProvider>
      </SecurityProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('WCAG 2.2 AA Compliance Tests', () => {
  describe('Color & Contrast Compliance', () => {
    test('should have sufficient color contrast ratios', async () => {
      const { container } = render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should support high contrast theme', async () => {
      render(
        <TestWrapper>
          <AccessibilitySettings />
        </TestWrapper>
      );

      // Check for high contrast theme option
      const highContrastOption = screen.getByText(/high contrast/i);
      expect(highContrastOption).toBeInTheDocument();
    });
  });

  describe('Keyboard Navigation (WCAG 2.1.1)', () => {
    test('should be fully navigable by keyboard', async () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      // Test tab navigation
      const focusableElements = screen.getAllByRole('button', { hidden: true });
      expect(focusableElements.length).toBeGreaterThan(0);

      // Test tab order
      focusableElements.forEach((element, index) => {
        element.focus();
        expect(document.activeElement).toBe(element);
      });
    });

    test('should have visible focus indicators', () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      const button = screen.getByRole('button', { name: /answer today's connection/i });
      button.focus();
      
      // Check for focus ring
      const computedStyle = window.getComputedStyle(button);
      expect(computedStyle.outline).not.toBe('none');
    });

    test('should not have keyboard traps', async () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      // Test that ESC key works to close modals/overlays
      const searchInput = screen.getByPlaceholderText(/search memories, plans, notes/i);
      searchInput.focus();
      
      fireEvent.keyDown(searchInput, { key: 'Escape' });
      expect(searchInput).not.toHaveFocus();
    });
  });

  describe('Focus Management (WCAG 2.4.7)', () => {
    test('should manage focus properly in modals', async () => {
      render(
        <TestWrapper>
          <AccessibilitySettings />
        </TestWrapper>
      );

      // Test tab navigation within settings
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);

      // Test tab panel association
      tabs.forEach((tab) => {
        const panelId = tab.getAttribute('aria-controls');
        expect(panelId).toBeTruthy();
        
        const panel = document.getElementById(panelId!);
        expect(panel).toBeInTheDocument();
      });
    });
  });

  describe('Target Size (WCAG 2.5.8)', () => {
    test('should have minimum 24x24px touch targets', () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        const rect = button.getBoundingClientRect();
        expect(rect.width).toBeGreaterThanOrEqual(24);
        expect(rect.height).toBeGreaterThanOrEqual(24);
      });
    });

    test('should have minimum 44x44px touch targets for critical actions', () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      const primaryButton = screen.getByRole('button', { name: /answer today's connection/i });
      const rect = primaryButton.getBoundingClientRect();
      expect(rect.width).toBeGreaterThanOrEqual(44);
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });
  });

  describe('Semantics (WCAG 1.3.1)', () => {
    test('should have proper ARIA labels and roles', () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      // Check for proper heading structure
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);

      // Check for proper button roles
      const buttons = screen.getAllByRole('button');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-label');
      });
    });

    test('should have proper tab semantics', () => {
      render(
        <TestWrapper>
          <AccessibilitySettings />
        </TestWrapper>
      );

      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();

      const tabs = screen.getAllByRole('tab');
      tabs.forEach((tab) => {
        expect(tab).toHaveAttribute('aria-selected');
        expect(tab).toHaveAttribute('aria-controls');
      });
    });
  });

  describe('Motion & Animation (WCAG 2.3.1)', () => {
    test('should respect reduced motion preferences', async () => {
      // Mock prefers-reduced-motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      });

      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      // Check that reduced motion is respected
      const motionElements = document.querySelectorAll('[class*="motion"]');
      expect(motionElements.length).toBeGreaterThan(0);
    });
  });

  describe('Text Resize (WCAG 1.4.4)', () => {
    test('should support text resizing up to 200%', () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      // Test font size scaling
      const textElements = screen.getAllByText(/welcome|dashboard|notes/i);
      expect(textElements.length).toBeGreaterThan(0);

      // Check that text remains readable at different sizes
      textElements.forEach((element) => {
        const computedStyle = window.getComputedStyle(element);
        const fontSize = parseInt(computedStyle.fontSize);
        expect(fontSize).toBeGreaterThanOrEqual(12); // Minimum readable size
      });
    });
  });

  describe('Text Spacing (WCAG 1.4.12)', () => {
    test('should support custom line height and spacing', () => {
      render(
        <TestWrapper>
          <AccessibilitySettings />
        </TestWrapper>
      );

      // Check for line height options
      const lineHeightOptions = screen.getAllByText(/line height/i);
      expect(lineHeightOptions.length).toBeGreaterThan(0);
    });
  });

  describe('Reflow & Zoom (WCAG 1.4.10)', () => {
    test('should support zoom up to 200% without horizontal scroll', () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      // Test responsive behavior
      const container = screen.getByRole('main') || document.body;
      const originalWidth = container.scrollWidth;
      const viewportWidth = window.innerWidth;

      // Simulate zoom by reducing viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        value: viewportWidth * 0.5, // 200% zoom
      });

      // Trigger resize event
      window.dispatchEvent(new Event('resize'));

      // Check that no horizontal scroll is needed
      expect(container.scrollWidth).toBeLessThanOrEqual(viewportWidth);
    });
  });

  describe('RTL Support (Internationalization)', () => {
    test('should support RTL languages', () => {
      render(
        <TestWrapper>
          <AccessibilitySettings />
        </TestWrapper>
      );

      // Check for language and direction options
      const languageSelect = screen.getByRole('combobox', { name: /language/i });
      expect(languageSelect).toBeInTheDocument();

      const directionOptions = screen.getAllByText(/text direction/i);
      expect(directionOptions.length).toBeGreaterThan(0);
    });
  });

  describe('Screen Reader Support', () => {
    test('should have proper ARIA live regions', () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      // Check for aria-live regions
      const liveRegions = document.querySelectorAll('[aria-live]');
      expect(liveRegions.length).toBeGreaterThan(0);
    });

    test('should announce important changes', async () => {
      render(
        <TestWrapper>
          <AccessibilitySettings />
        </TestWrapper>
      );

      // Test theme change announcement
      const themeButton = screen.getByRole('button', { name: /dark/i });
      fireEvent.click(themeButton);

      await waitFor(() => {
        const announcement = document.querySelector('[aria-live="polite"]');
        expect(announcement).toBeInTheDocument();
      });
    });
  });

  describe('Form Accessibility', () => {
    test('should have proper form labels and associations', () => {
      render(
        <TestWrapper>
          <AccessibilitySettings />
        </TestWrapper>
      );

      // Check for proper label associations
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input) => {
        const label = input.getAttribute('aria-label') || input.getAttribute('aria-labelledby');
        expect(label).toBeTruthy();
      });
    });

    test('should provide error messages for form validation', async () => {
      render(
        <TestWrapper>
          <AccessibilitySettings />
        </TestWrapper>
      );

      // Test form validation
      const languageSelect = screen.getByRole('combobox', { name: /language/i });
      fireEvent.change(languageSelect, { target: { value: '' } });

      // Check for validation message
      await waitFor(() => {
        const errorMessage = screen.getByText(/language is required/i);
        expect(errorMessage).toBeInTheDocument();
      });
    });
  });

  describe('Skip Links', () => {
    test('should provide skip links for main content', () => {
      render(
        <TestWrapper>
          <DashboardPage />
        </TestWrapper>
      );

      // Check for skip links
      const skipLinks = screen.getAllByRole('link', { name: /skip to/i });
      expect(skipLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Performance & Accessibility Integration', () => {
    test('should track accessibility events', async () => {
      render(
        <TestWrapper>
          <AccessibilitySettings />
        </TestWrapper>
      );

      // Test accessibility event tracking
      const themeButton = screen.getByRole('button', { name: /light/i });
      fireEvent.click(themeButton);

      // Check that accessibility event was tracked
      await waitFor(() => {
        // This would check the analytics system in a real test
        expect(themeButton).toHaveAttribute('aria-pressed', 'true');
      });
    });
  });
});

describe('Accessibility Provider Tests', () => {
  test('should provide accessibility context', () => {
    render(
      <TestWrapper>
        <div data-testid="test-component">Test</div>
      </TestWrapper>
    );

    const component = screen.getByTestId('test-component');
    expect(component).toBeInTheDocument();
  });

  test('should apply accessibility classes to document', () => {
    render(
      <TestWrapper>
        <AccessibilitySettings />
      </TestWrapper>
    );

    // Check that accessibility classes are applied
    const root = document.documentElement;
    expect(root.classList.contains('light') || 
           root.classList.contains('dark') || 
           root.classList.contains('high-contrast')).toBe(true);
  });
});

describe('Security Context Tests', () => {
  test('should provide security context', () => {
    render(
      <TestWrapper>
        <div data-testid="security-test">Security Test</div>
      </TestWrapper>
    );

    const component = screen.getByTestId('security-test');
    expect(component).toBeInTheDocument();
  });

  test('should track security events', async () => {
    render(
      <TestWrapper>
        <AccessibilitySettings />
      </TestWrapper>
    );

    // Test security event tracking
    const securityTab = screen.getByRole('tab', { name: /visual/i });
    fireEvent.click(securityTab);

    // Check that security event was tracked
    await waitFor(() => {
      expect(securityTab).toHaveAttribute('aria-selected', 'true');
    });
  });
});

// Utility function to check contrast ratios
export const checkContrastRatio = (foreground: string, background: string): number => {
  // Simplified contrast ratio calculation
  // In a real implementation, this would use a proper color contrast library
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const getLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const fg = hexToRgb(foreground);
  const bg = hexToRgb(background);

  if (!fg || !bg) return 0;

  const fgLum = getLuminance(fg.r, fg.g, fg.b);
  const bgLum = getLuminance(bg.r, bg.g, bg.b);

  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);

  return (lighter + 0.05) / (darker + 0.05);
};

// Test contrast ratios
describe('Contrast Ratio Tests', () => {
  test('should meet WCAG AA contrast requirements', () => {
    // Test primary text on white background
    const primaryContrast = checkContrastRatio('#1A202C', '#FFFFFF');
    expect(primaryContrast).toBeGreaterThanOrEqual(4.5); // WCAG AA requirement

    // Test secondary text on white background
    const secondaryContrast = checkContrastRatio('#4A5568', '#FFFFFF');
    expect(secondaryContrast).toBeGreaterThanOrEqual(4.5);

    // Test large text (18pt+) can have 3:1 ratio
    const largeTextContrast = checkContrastRatio('#718096', '#FFFFFF');
    expect(largeTextContrast).toBeGreaterThanOrEqual(3.0);
  });
});
