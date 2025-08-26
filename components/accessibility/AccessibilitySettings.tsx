import React from 'react';
import { motion } from 'framer-motion';
import {
  EyeIcon,
  EyeSlashIcon,
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  PauseIcon,
  SunIcon,
  MoonIcon,
} from '@heroicons/react/24/outline';
import { useAccessibility } from './AccessibilityProvider';

export const AccessibilitySettings: React.FC = () => {
  const {
    isHighContrast,
    isReducedMotion,
    isDarkMode,
    fontSize,
    setFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    announceToScreenReader,
  } = useAccessibility();

  const handleFontSizeChange = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
    announceToScreenReader(`Font size changed to ${size}`);
  };

  const handleHighContrastToggle = () => {
    toggleHighContrast();
    announceToScreenReader(`High contrast ${isHighContrast ? 'disabled' : 'enabled'}`);
  };

  const handleReducedMotionToggle = () => {
    toggleReducedMotion();
    announceToScreenReader(`Reduced motion ${isReducedMotion ? 'disabled' : 'enabled'}`);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-primary-light flex items-center justify-center">
          <AdjustmentsHorizontalIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-primary">Accessibility Settings</h2>
          <p className="text-secondary">
            Customize the app to work better for you
          </p>
        </div>
      </div>

      {/* Font Size Settings */}
      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <MagnifyingGlassIcon className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-primary">Text Size</h3>
        </div>
        <p className="text-secondary mb-4">
          Adjust the text size to make it easier to read
        </p>
        <div className="flex gap-3">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => handleFontSizeChange(size)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                fontSize === size
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface-alt text-secondary border-border hover:border-primary'
              }`}
              aria-pressed={fontSize === size}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* High Contrast Toggle */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isHighContrast ? (
              <EyeIcon className="w-5 h-5 text-primary" />
            ) : (
              <EyeSlashIcon className="w-5 h-5 text-secondary" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-primary">High Contrast</h3>
              <p className="text-secondary text-sm">
                Increase contrast for better visibility
              </p>
            </div>
          </div>
          <button
            onClick={handleHighContrastToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isHighContrast ? 'bg-primary' : 'bg-surface-alt'
            }`}
            role="switch"
            aria-checked={isHighContrast}
            aria-label="Toggle high contrast mode"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isHighContrast ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Reduced Motion Toggle */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isReducedMotion ? (
              <PauseIcon className="w-5 h-5 text-primary" />
            ) : (
              <PlayIcon className="w-5 h-5 text-secondary" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-primary">Reduced Motion</h3>
              <p className="text-secondary text-sm">
                Reduce animations and transitions
              </p>
            </div>
          </div>
          <button
            onClick={handleReducedMotionToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isReducedMotion ? 'bg-primary' : 'bg-surface-alt'
            }`}
            role="switch"
            aria-checked={isReducedMotion}
            aria-label="Toggle reduced motion"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isReducedMotion ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Dark Mode Toggle */}
      <div className="card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDarkMode ? (
              <MoonIcon className="w-5 h-5 text-primary" />
            ) : (
              <SunIcon className="w-5 h-5 text-secondary" />
            )}
            <div>
              <h3 className="text-lg font-semibold text-primary">Dark Mode</h3>
              <p className="text-secondary text-sm">
                Switch between light and dark themes
              </p>
            </div>
          </div>
          <button
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isDarkMode ? 'bg-primary' : 'bg-surface-alt'
            }`}
            role="switch"
            aria-checked={isDarkMode}
            aria-label="Toggle dark mode"
            disabled
            title="Dark mode follows system preference"
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-muted mt-2">
          Dark mode automatically follows your system preference
        </p>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary mb-4">Keyboard Shortcuts</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-secondary">Navigate with Tab</span>
            <kbd className="px-2 py-1 bg-surface-alt rounded text-xs">Tab</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Close modals</span>
            <kbd className="px-2 py-1 bg-surface-alt rounded text-xs">Esc</kbd>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary">Activate buttons</span>
            <kbd className="px-2 py-1 bg-surface-alt rounded text-xs">Enter</kbd>
          </div>
        </div>
      </div>

      {/* Accessibility Information */}
      <div className="card bg-gradient-to-r from-primary-light to-secondary-light">
        <h3 className="text-lg font-semibold text-primary mb-2">Accessibility Features</h3>
        <ul className="space-y-1 text-sm text-secondary">
          <li>• Full keyboard navigation support</li>
          <li>• Screen reader compatibility</li>
          <li>• High contrast mode</li>
          <li>• Reduced motion support</li>
          <li>• Adjustable text sizes</li>
          <li>• Focus indicators</li>
          <li>• Semantic HTML structure</li>
        </ul>
      </div>
    </motion.div>
  );
};
