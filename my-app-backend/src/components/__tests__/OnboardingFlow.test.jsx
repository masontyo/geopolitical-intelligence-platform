import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import OnboardingFlow from '../OnboardingFlow';

// Mock the useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the useToast hook
jest.mock('../ToastNotifications', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('OnboardingFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<OnboardingFlow />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the onboarding flow header', () => {
    renderWithRouter(<OnboardingFlow />);
    expect(screen.getByText('Onboarding Flow')).toBeInTheDocument();
  });

  it('shows flow sections', () => {
    renderWithRouter(<OnboardingFlow />);
    expect(screen.getByText('Flow Sections')).toBeInTheDocument();
  });

  it('displays onboarding guidance', () => {
    renderWithRouter(<OnboardingFlow />);
    expect(screen.getByText('Onboarding Guidance')).toBeInTheDocument();
  });
});
