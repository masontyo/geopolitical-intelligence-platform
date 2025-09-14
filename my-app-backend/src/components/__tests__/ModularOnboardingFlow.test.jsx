import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ModularOnboardingFlow from '../ModularOnboardingFlow';

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

describe('ModularOnboardingFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<ModularOnboardingFlow />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the modular onboarding flow header', () => {
    renderWithRouter(<ModularOnboardingFlow />);
    expect(screen.getByText('Modular Onboarding Flow')).toBeInTheDocument();
  });

  it('shows modular flow sections', () => {
    renderWithRouter(<ModularOnboardingFlow />);
    expect(screen.getByText('Modular Flow Sections')).toBeInTheDocument();
  });

  it('displays modular guidance', () => {
    renderWithRouter(<ModularOnboardingFlow />);
    expect(screen.getByText('Modular Guidance')).toBeInTheDocument();
  });
});
