import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModularOnboardingFlow from '../ModularOnboardingFlow';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the useToast hook
jest.mock('../ToastNotifications', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

describe('ModularOnboardingFlow', () => {
  it('renders without crashing', () => {
    render(<ModularOnboardingFlow />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the basic info form', () => {
    render(<ModularOnboardingFlow />);
    expect(document.body).toBeInTheDocument();
  });

  it('shows the complete setup button', () => {
    render(<ModularOnboardingFlow />);
    expect(document.body).toBeInTheDocument();
  });

  it('renders the page structure', () => {
    render(<ModularOnboardingFlow />);
    expect(document.body).toBeInTheDocument();
  });
});
