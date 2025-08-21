import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePartner } from '../contexts/PartnerContext';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  hasConnectedPartner: boolean;
  hasSetPreferences: boolean;
  hasCreatedFirstActivity: boolean;
  lastOnboardingStep: number;
}

const ONBOARDING_STORAGE_KEY = 'together-apart-onboarding';

export const useOnboarding = () => {
  const { user } = useAuth();
  const { couple } = usePartner();
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    hasCompletedOnboarding: false,
    hasConnectedPartner: false,
    hasSetPreferences: false,
    hasCreatedFirstActivity: false,
    lastOnboardingStep: 0,
  });
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  // Load onboarding state from localStorage
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`${ONBOARDING_STORAGE_KEY}-${user.id}`);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setOnboardingState(parsed);
        } catch (error) {
          console.error('Error parsing onboarding state:', error);
        }
      } else {
        // New user - show onboarding
        setShouldShowOnboarding(true);
      }
    }
  }, [user]);

  // Check if user should see onboarding
  useEffect(() => {
    if (user && !onboardingState.hasCompletedOnboarding) {
      // Check if user is truly new (no partner connection, no preferences set)
      const isNewUser = !couple && !onboardingState.hasSetPreferences;
      setShouldShowOnboarding(isNewUser);
    }
  }, [user, couple, onboardingState]);

  // Update onboarding state
  const updateOnboardingState = (updates: Partial<OnboardingState>) => {
    if (!user) return;

    const newState = { ...onboardingState, ...updates };
    setOnboardingState(newState);
    
    // Save to localStorage
    localStorage.setItem(`${ONBOARDING_STORAGE_KEY}-${user.id}`, JSON.stringify(newState));
  };

  // Mark onboarding step as complete
  const completeOnboardingStep = (step: number) => {
    updateOnboardingState({ lastOnboardingStep: step });
  };

  // Mark partner connection as complete
  const markPartnerConnected = () => {
    updateOnboardingState({ hasConnectedPartner: true });
  };

  // Mark preferences as set
  const markPreferencesSet = () => {
    updateOnboardingState({ hasSetPreferences: true });
  };

  // Mark first activity as created
  const markFirstActivityCreated = () => {
    updateOnboardingState({ hasCreatedFirstActivity: true });
  };

  // Complete entire onboarding
  const completeOnboarding = () => {
    updateOnboardingState({
      hasCompletedOnboarding: true,
      hasConnectedPartner: true,
      hasSetPreferences: true,
      hasCreatedFirstActivity: true,
      lastOnboardingStep: 4,
    });
    setShouldShowOnboarding(false);
  };

  // Reset onboarding (for testing or user request)
  const resetOnboarding = () => {
    if (!user) return;
    
    localStorage.removeItem(`${ONBOARDING_STORAGE_KEY}-${user.id}`);
    setOnboardingState({
      hasCompletedOnboarding: false,
      hasConnectedPartner: false,
      hasSetPreferences: false,
      hasCreatedFirstActivity: false,
      lastOnboardingStep: 0,
    });
    setShouldShowOnboarding(true);
  };

  // Get onboarding progress percentage
  const getOnboardingProgress = () => {
    const steps = [
      onboardingState.hasConnectedPartner,
      onboardingState.hasSetPreferences,
      onboardingState.hasCreatedFirstActivity,
    ];
    const completedSteps = steps.filter(Boolean).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  return {
    onboardingState,
    shouldShowOnboarding,
    completeOnboardingStep,
    markPartnerConnected,
    markPreferencesSet,
    markFirstActivityCreated,
    completeOnboarding,
    resetOnboarding,
    getOnboardingProgress,
  };
};


