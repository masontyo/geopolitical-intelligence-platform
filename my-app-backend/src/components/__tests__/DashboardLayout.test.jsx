import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import DashboardLayout from '../DashboardLayout';

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

describe('DashboardLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
      logout: jest.fn(),
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<DashboardLayout />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the main navigation', () => {
    renderWithRouter(<DashboardLayout />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Analytics')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('shows user profile information', () => {
    renderWithRouter(<DashboardLayout />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('displays the main content area', () => {
    renderWithRouter(<DashboardLayout />);
    expect(screen.getByText('Welcome to your Enterprise Risk Dashboard')).toBeInTheDocument();
  });
});

