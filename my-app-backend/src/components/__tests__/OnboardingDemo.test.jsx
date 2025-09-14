import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import OnboardingDemo from '../OnboardingDemo';

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

describe('OnboardingDemo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<OnboardingDemo />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the onboarding demo header', () => {
    renderWithRouter(<OnboardingDemo />);
    expect(screen.getByText('Onboarding Demo')).toBeInTheDocument();
  });

  it('shows demo sections', () => {
    renderWithRouter(<OnboardingDemo />);
    expect(screen.getByText('Demo Sections')).toBeInTheDocument();
  });

  it('displays demo guidance', () => {
    renderWithRouter(<OnboardingDemo />);
    expect(screen.getByText('Demo Guidance')).toBeInTheDocument();
  });
});
