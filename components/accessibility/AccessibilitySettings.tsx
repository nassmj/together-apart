import React, { useState } from 'react';
import { useAccessibility } from './AccessibilityProvider';
import { motion } from 'framer-motion';

// Accessibility Settings Component
const AccessibilitySettings: React.FC = () => {
  const {
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
  } = useAccessibility();

  const [activeTab, setActiveTab] = useState<'visual' | 'motion' | 'typography' | 'language'>('visual');

  // Handle theme change
  const handleThemeChange = (newTheme: 'light' | 'dark' | 'high-contrast') => {
    setTheme(newTheme);
    announce(`Theme changed to ${newTheme}`, 'polite');
  };

  // Handle motion preference change
  const handleMotionChange = (reduced: boolean) => {
    setReducedMotion(reduced);
    announce(`Motion ${reduced ? 'reduced' : 'enabled'}`, 'polite');
  };

  // Handle focus visibility change
  const handleFocusChange = (visible: boolean) => {
    setFocusVisible(visible);
    announce(`Focus indicators ${visible ? 'enabled' : 'disabled'}`, 'polite');
  };

  // Handle high contrast change
  const handleHighContrastChange = (enabled: boolean) => {
    setHighContrast(enabled);
    announce(`High contrast ${enabled ? 'enabled' : 'disabled'}`, 'polite');
  };

  // Handle font size change
  const handleFontSizeChange = (size: 'normal' | 'large' | 'x-large') => {
    setFontSize(size);
    announce(`Font size changed to ${size}`, 'polite');
  };

  // Handle line height change
  const handleLineHeightChange = (height: 'normal' | 'relaxed' | 'extra-relaxed') => {
    setLineHeight(height);
    announce(`Line height changed to ${height}`, 'polite');
  };

  // Handle spacing change
  const handleSpacingChange = (newSpacing: 'normal' | 'large' | 'x-large') => {
    setSpacing(newSpacing);
    announce(`Spacing changed to ${newSpacing}`, 'polite');
  };

  // Handle direction change
  const handleDirectionChange = (dir: 'ltr' | 'rtl') => {
    setDirection(dir);
    announce(`Text direction changed to ${dir}`, 'polite');
  };

  // Handle language change
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    announce(`Language changed to ${lang}`, 'polite');
  };

  // Tab configuration
  const tabs = [
    { id: 'visual', label: 'Visual', icon: '👁️' },
    { id: 'motion', label: 'Motion', icon: '🎬' },
    { id: 'typography', label: 'Typography', icon: '📝' },
    { id: 'language', label: 'Language', icon: '🌐' },
  ] as const;

  return (
    <div className="accessibility-settings p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="display-2xl text-black mb-2">Accessibility Settings</h1>
        <p className="text-gray-600">
          Customize your experience to meet your accessibility needs. All settings comply with WCAG 2.2 AA standards.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-list mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            className={`tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="text-lg">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="space-y-8">
        {/* Visual Settings Panel */}
        {activeTab === 'visual' && (
          <motion.div
            role="tabpanel"
            id="panel-visual"
            aria-labelledby="tab-visual"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="display-xl text-black mb-4">Theme & Contrast</h2>
              
              {/* Theme Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">Theme</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'light', label: 'Light', description: 'Standard light theme' },
                    { value: 'dark', label: 'Dark', description: 'Dark theme for low-light environments' },
                    { value: 'high-contrast', label: 'High Contrast', description: 'Maximum contrast for visibility' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleThemeChange(option.value as 'light' | 'dark' | 'high-contrast')}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        theme === option.value
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                      aria-pressed={theme === option.value}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm opacity-80">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast Toggle */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highContrast}
                    onChange={(e) => handleHighContrastChange(e.target.checked)}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="font-medium text-gray-700">Enable High Contrast Mode</span>
                </label>
                <p className="text-sm text-gray-600 mt-2 ml-8">
                  Increases contrast ratios to WCAG AAA standards for maximum readability
                </p>
              </div>

              {/* Focus Indicators */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={focusVisible}
                    onChange={(e) => handleFocusChange(e.target.checked)}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="font-medium text-gray-700">Show Focus Indicators</span>
                </label>
                <p className="text-sm text-gray-600 mt-2 ml-8">
                  Displays visible focus rings around interactive elements for keyboard navigation
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Motion Settings Panel */}
        {activeTab === 'motion' && (
          <motion.div
            role="tabpanel"
            id="panel-motion"
            aria-labelledby="tab-motion"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="display-xl text-black mb-4">Motion & Animation</h2>
              
              {/* Reduced Motion */}
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => handleMotionChange(e.target.checked)}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2"
                  />
                  <span className="font-medium text-gray-700">Reduce Motion</span>
                </label>
                <p className="text-sm text-gray-600 mt-2 ml-8">
                  Minimizes animations and transitions for users sensitive to motion
                </p>
              </div>

              {/* Motion Examples */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-3">Motion Examples</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-primary rounded-full motion-example"></div>
                    <span className="text-sm text-gray-600">Hover effects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-secondary rounded-full motion-example"></div>
                    <span className="text-sm text-gray-600">Page transitions</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-accent rounded-full motion-example"></div>
                    <span className="text-sm text-gray-600">Loading animations</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Typography Settings Panel */}
        {activeTab === 'typography' && (
          <motion.div
            role="tabpanel"
            id="panel-typography"
            aria-labelledby="tab-typography"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="display-xl text-black mb-4">Typography & Spacing</h2>
              
              {/* Font Size */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">Font Size</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'normal', label: 'Normal', size: '16px' },
                    { value: 'large', label: 'Large', size: '18px' },
                    { value: 'x-large', label: 'Extra Large', size: '20px' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleFontSizeChange(option.value as 'normal' | 'large' | 'x-large')}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        fontSize === option.value
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                      aria-pressed={fontSize === option.value}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm opacity-80">{option.size}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Height */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">Line Height</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'normal', label: 'Normal', description: '1.5x spacing' },
                    { value: 'relaxed', label: 'Relaxed', description: '1.75x spacing' },
                    { value: 'extra-relaxed', label: 'Extra Relaxed', description: '2x spacing' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleLineHeightChange(option.value as 'normal' | 'relaxed' | 'extra-relaxed')}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        lineHeight === option.value
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                      aria-pressed={lineHeight === option.value}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm opacity-80">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Spacing */}
              <div>
                <label className="block text-gray-700 font-medium mb-3">Element Spacing</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'normal', label: 'Normal', description: 'Standard spacing' },
                    { value: 'large', label: 'Large', description: 'Increased spacing' },
                    { value: 'x-large', label: 'Extra Large', description: 'Maximum spacing' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSpacingChange(option.value as 'normal' | 'large' | 'x-large')}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        spacing === option.value
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                      aria-pressed={spacing === option.value}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm opacity-80">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Language Settings Panel */}
        {activeTab === 'language' && (
          <motion.div
            role="tabpanel"
            id="panel-language"
            aria-labelledby="tab-language"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="card p-6">
              <h2 className="display-xl text-black mb-4">Language & Direction</h2>
              
              {/* Language Selection */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-3">Language</label>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="ar">العربية (Arabic)</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="fr">Français (French)</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="it">Italiano (Italian)</option>
                  <option value="pt">Português (Portuguese)</option>
                  <option value="ru">Русский (Russian)</option>
                  <option value="zh">中文 (Chinese)</option>
                  <option value="ja">日本語 (Japanese)</option>
                </select>
              </div>

              {/* Text Direction */}
              <div>
                <label className="block text-gray-700 font-medium mb-3">Text Direction</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { value: 'ltr', label: 'Left to Right', description: 'English, Spanish, French, etc.' },
                    { value: 'rtl', label: 'Right to Left', description: 'Arabic, Hebrew, etc.' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleDirectionChange(option.value as 'ltr' | 'rtl')}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        direction === option.value
                          ? 'border-primary bg-primary-light text-primary'
                          : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                      }`}
                      aria-pressed={direction === option.value}
                    >
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm opacity-80">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* WCAG Compliance Notice */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-xl">ℹ️</div>
          <div>
            <h3 className="font-medium text-blue-900 mb-1">WCAG 2.2 AA Compliance</h3>
            <p className="text-sm text-blue-700">
              All accessibility features in this application meet or exceed Web Content Accessibility Guidelines (WCAG) 2.2 AA standards. 
              This ensures compatibility with screen readers, keyboard navigation, and other assistive technologies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibilitySettings;
