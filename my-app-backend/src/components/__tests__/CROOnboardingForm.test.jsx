import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import CROOnboardingForm from '../CROOnboardingForm';

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

describe('CROOnboardingForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<CROOnboardingForm />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the CRO onboarding header', () => {
    renderWithRouter(<CROOnboardingForm />);
    expect(screen.getByText('CRO Onboarding')).toBeInTheDocument();
  });

  it('shows onboarding form sections', () => {
    renderWithRouter(<CROOnboardingForm />);
    expect(screen.getByText('Onboarding Form')).toBeInTheDocument();
  });

  it('displays company information section', () => {
    renderWithRouter(<CROOnboardingForm />);
    expect(screen.getByText('Company Information')).toBeInTheDocument();
  });
});

