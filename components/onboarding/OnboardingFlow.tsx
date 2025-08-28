import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, ArrowRightIcon, ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { usePartner } from '../../contexts/PartnerContext';
import { useNavigate } from 'react-router-dom';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  component: React.ComponentType<OnboardingStepProps>;
  isComplete: boolean;
}

interface OnboardingStepProps {
  onNext: () => void;
  onBack: () => void;
  onComplete: () => void;
  currentStep: number;
  totalSteps: number;
}

const WelcomeStep: React.FC<OnboardingStepProps> = ({ onNext, currentStep, totalSteps }) => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="text-center space-y-6"
  >
    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-pink to-green rounded-full flex items-center justify-center">
      <span className="text-3xl">💕</span>
    </div>
    
    <div>
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Welcome to Together Apart
      </h2>
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
        Your journey to deeper connection starts here. Let's set up your experience in just a few steps.
      </p>
    </div>

    <div className="flex justify-center space-x-2">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${
            index === currentStep - 1 ? 'bg-green' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        />
      ))}
    </div>

    <button
      onClick={onNext}
      className="inline-flex items-center px-6 py-3 bg-green text-black font-bold rounded-lg hover:bg-opacity-90 transition-colors"
    >
      Get Started
      <ArrowRightIcon className="ml-2 h-5 w-5" />
    </button>
  </motion.div>
);

const PartnerConnectionStep: React.FC<OnboardingStepProps> = ({ onNext, onBack, currentStep, totalSteps }) => {
  const { user } = useAuth();
  const { couple } = usePartner();
  const [inviteLink, setInviteLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const generateInviteLink = async () => {
    if (!user) return;
    setIsGenerating(true);
    try {
      const uniqueCode = Math.random().toString(36).substring(2, 12);
      setInviteLink(`${window.location.origin}/#/join/${uniqueCode}`);
    } catch (error) {
      console.error('Error generating invite:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Connect with Your Partner
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Share this unique link with your partner to start your journey together.
        </p>
      </div>

      {couple ? (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green rounded-full flex items-center justify-center">
            <CheckIcon className="h-8 w-8 text-black" />
          </div>
          <p className="text-green font-semibold">Partner Connected!</p>
          <button
            onClick={onNext}
            className="inline-flex items-center px-6 py-3 bg-green text-black font-bold rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Continue
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {!inviteLink ? (
            <button
              onClick={generateInviteLink}
              disabled={isGenerating}
              className="w-full py-3 bg-pink text-black font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
            >
              {isGenerating ? 'Generating...' : 'Generate Invite Link'}
            </button>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  readOnly
                  value={inviteLink}
                  className="w-full p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center font-mono text-sm"
                />
              </div>
              <button
                onClick={copyLink}
                className="w-full py-3 bg-green text-black font-bold rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Copy Link
              </button>
              <p className="text-sm text-gray-500 text-center">
                Send this link to your partner. Once they join, you'll be connected!
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </button>
        
        <div className="flex space-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentStep - 1 ? 'bg-green' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const PreferencesStep: React.FC<OnboardingStepProps> = ({ onNext, onBack, currentStep, totalSteps }) => {
  const [preferences, setPreferences] = useState({
    notifications: true,
    dailyReminders: true,
    weeklyInsights: true,
    theme: 'dark' as 'light' | 'dark' | 'system',
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Customize Your Experience
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Set your preferences to make the app work best for you.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Push Notifications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Get notified about new activities and messages</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Daily Reminders</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Remind me to check in with my partner</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.dailyReminders}
              onChange={(e) => setPreferences(prev => ({ ...prev, dailyReminders: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green"></div>
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme Preference
          </label>
          <select
            value={preferences.theme}
            onChange={(e) => setPreferences(prev => ({ ...prev, theme: e.target.value as any }))}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="system">System Default</option>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </button>
        
        <button
          onClick={onNext}
          className="inline-flex items-center px-6 py-3 bg-green text-black font-bold rounded-lg hover:bg-opacity-90 transition-colors"
        >
          Continue
          <ArrowRightIcon className="ml-2 h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};

const FirstActivityStep: React.FC<OnboardingStepProps> = ({ onComplete, onBack, currentStep, totalSteps }) => {
  const [selectedActivity, setSelectedActivity] = useState<string>('');

  const quickActivities = [
    { id: 'memory', title: 'Share a Memory', description: 'Add your first shared memory', icon: '📸' },
    { id: 'question', title: 'Daily Question', description: 'Answer today\'s connection question', icon: '💭' },
    { id: 'activity', title: 'Plan an Activity', description: 'Schedule your first activity together', icon: '🎯' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Start Your Journey
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose how you'd like to begin connecting with your partner.
        </p>
      </div>

      <div className="grid gap-4">
        {quickActivities.map((activity) => (
          <button
            key={activity.id}
            onClick={() => setSelectedActivity(activity.id)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedActivity === activity.id
                ? 'border-green bg-green/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-green/50'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{activity.icon}</span>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white">{activity.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Back
        </button>
        
        <button
          onClick={onComplete}
          disabled={!selectedActivity}
          className="inline-flex items-center px-6 py-3 bg-green text-black font-bold rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Complete Setup
          <CheckIcon className="ml-2 h-5 w-5" />
        </button>
      </div>
    </motion.div>
  );
};

interface OnboardingFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();

  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: 'Welcome',
      description: 'Get started with Together Apart',
      component: WelcomeStep,
      isComplete: currentStep > 1,
    },
    {
      id: 2,
      title: 'Partner Connection',
      description: 'Connect with your partner',
      component: PartnerConnectionStep,
      isComplete: currentStep > 2,
    },
    {
      id: 3,
      title: 'Preferences',
      description: 'Customize your experience',
      component: PreferencesStep,
      isComplete: currentStep > 3,
    },
    {
      id: 4,
      title: 'First Activity',
      description: 'Start your journey',
      component: FirstActivityStep,
      isComplete: currentStep > 4,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onClose();
    navigate('/dashboard');
  };

  const currentStepData = steps[currentStep - 1];
  const CurrentStepComponent = currentStepData.component;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
      >
        <div className="relative p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentStepData.title}
              </h1>
              <span className="text-sm text-gray-500">
                {currentStep} of {steps.length}
              </span>
            </div>
            
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <motion.div
                className="bg-green h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="min-h-[400px] flex items-center justify-center">
            <CurrentStepComponent
              onNext={handleNext}
              onBack={handleBack}
              onComplete={handleComplete}
              currentStep={currentStep}
              totalSteps={steps.length}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};






