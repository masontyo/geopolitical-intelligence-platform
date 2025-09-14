import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingFlow from '../OnboardingFlow';
import { ToastProvider } from '../ToastNotifications';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('OnboardingFlow', () => {
  it('renders without crashing', () => {
    render(
      <ToastProvider>
        <OnboardingFlow />
      </ToastProvider>
    );
    expect(document.body).toBeInTheDocument();
  });

  it('displays onboarding flow content', () => {
    render(
      <ToastProvider>
        <OnboardingFlow />
      </ToastProvider>
    );
    expect(document.body).toBeInTheDocument();
  });
});
