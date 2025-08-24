import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOnboarding } from '../../hooks/useOnboarding';

// Mock the contexts
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
  }),
}));

vi.mock('../../contexts/PartnerContext', () => ({
  usePartner: () => ({
    couple: null,
  }),
}));

describe('useOnboarding', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('initializes with default state for new user', () => {
    const { result } = renderHook(() => useOnboarding());

    expect(result.current.onboardingState).toEqual({
      hasCompletedOnboarding: false,
      hasConnectedPartner: false,
      hasSetPreferences: false,
      hasCreatedFirstActivity: false,
      lastOnboardingStep: 0,
    });
  });

  it('loads existing onboarding state from localStorage', () => {
    const existingState = {
      hasCompletedOnboarding: true,
      hasConnectedPartner: true,
      hasSetPreferences: true,
      hasCreatedFirstActivity: true,
      lastOnboardingStep: 4,
    };

    localStorage.setItem('together-apart-onboarding-test-user-id', JSON.stringify(existingState));

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.onboardingState).toEqual(existingState);
  });

  it('shows onboarding for new user without localStorage data', () => {
    const { result } = renderHook(() => useOnboarding());

    expect(result.current.shouldShowOnboarding).toBe(true);
  });

  it('does not show onboarding for user who has completed it', () => {
    const completedState = {
      hasCompletedOnboarding: true,
      hasConnectedPartner: true,
      hasSetPreferences: true,
      hasCreatedFirstActivity: true,
      lastOnboardingStep: 4,
    };

    localStorage.setItem('together-apart-onboarding-test-user-id', JSON.stringify(completedState));

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.shouldShowOnboarding).toBe(false);
  });

  it('updates onboarding state and saves to localStorage', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.completeOnboardingStep(2);
    });

    expect(result.current.onboardingState.lastOnboardingStep).toBe(2);
    
    const savedState = JSON.parse(localStorage.getItem('together-apart-onboarding-test-user-id') || '{}');
    expect(savedState.lastOnboardingStep).toBe(2);
  });

  it('marks partner connection as complete', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.markPartnerConnected();
    });

    expect(result.current.onboardingState.hasConnectedPartner).toBe(true);
    
    const savedState = JSON.parse(localStorage.getItem('together-apart-onboarding-test-user-id') || '{}');
    expect(savedState.hasConnectedPartner).toBe(true);
  });

  it('marks preferences as set', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.markPreferencesSet();
    });

    expect(result.current.onboardingState.hasSetPreferences).toBe(true);
    
    const savedState = JSON.parse(localStorage.getItem('together-apart-onboarding-test-user-id') || '{}');
    expect(savedState.hasSetPreferences).toBe(true);
  });

  it('marks first activity as created', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.markFirstActivityCreated();
    });

    expect(result.current.onboardingState.hasCreatedFirstActivity).toBe(true);
    
    const savedState = JSON.parse(localStorage.getItem('together-apart-onboarding-test-user-id') || '{}');
    expect(savedState.hasCreatedFirstActivity).toBe(true);
  });

  it('completes entire onboarding process', () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.completeOnboarding();
    });

    expect(result.current.onboardingState).toEqual({
      hasCompletedOnboarding: true,
      hasConnectedPartner: true,
      hasSetPreferences: true,
      hasCreatedFirstActivity: true,
      lastOnboardingStep: 4,
    });

    expect(result.current.shouldShowOnboarding).toBe(false);
    
    const savedState = JSON.parse(localStorage.getItem('together-apart-onboarding-test-user-id') || '{}');
    expect(savedState.hasCompletedOnboarding).toBe(true);
  });

  it('resets onboarding state', () => {
    // Set up initial completed state
    const completedState = {
      hasCompletedOnboarding: true,
      hasConnectedPartner: true,
      hasSetPreferences: true,
      hasCreatedFirstActivity: true,
      lastOnboardingStep: 4,
    };

    localStorage.setItem('together-apart-onboarding-test-user-id', JSON.stringify(completedState));

    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.resetOnboarding();
    });

    expect(result.current.onboardingState).toEqual({
      hasCompletedOnboarding: false,
      hasConnectedPartner: false,
      hasSetPreferences: false,
      hasCreatedFirstActivity: false,
      lastOnboardingStep: 0,
    });

    expect(result.current.shouldShowOnboarding).toBe(true);
    
    // localStorage should be cleared
    expect(localStorage.getItem('together-apart-onboarding-test-user-id')).toBeNull();
  });

  it('calculates onboarding progress correctly', () => {
    const { result } = renderHook(() => useOnboarding());

    // No steps completed
    expect(result.current.getOnboardingProgress()).toBe(0);

    // Mark partner connected
    act(() => {
      result.current.markPartnerConnected();
    });
    expect(result.current.getOnboardingProgress()).toBe(33);

    // Mark preferences set
    act(() => {
      result.current.markPreferencesSet();
    });
    expect(result.current.getOnboardingProgress()).toBe(67);

    // Mark first activity created
    act(() => {
      result.current.markFirstActivityCreated();
    });
    expect(result.current.getOnboardingProgress()).toBe(100);
  });

  it('handles localStorage errors gracefully', () => {
    // Mock localStorage to throw an error
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = vi.fn().mockImplementation(() => {
      throw new Error('localStorage error');
    });

    const { result } = renderHook(() => useOnboarding());

    // Should not crash when localStorage fails
    act(() => {
      result.current.completeOnboardingStep(1);
    });

    expect(result.current.onboardingState.lastOnboardingStep).toBe(1);

    // Restore original localStorage
    localStorage.setItem = originalSetItem;
  });

  it('handles invalid JSON in localStorage', () => {
    // Set invalid JSON in localStorage
    localStorage.setItem('together-apart-onboarding-test-user-id', 'invalid-json');

    const { result } = renderHook(() => useOnboarding());

    // Should fall back to default state
    expect(result.current.onboardingState).toEqual({
      hasCompletedOnboarding: false,
      hasConnectedPartner: false,
      hasSetPreferences: false,
      hasCreatedFirstActivity: false,
      lastOnboardingStep: 0,
    });
  });
});



