import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Login from '../Login';

// Mock the useAuth hook
const mockLogin = jest.fn();
const mockUseAuth = jest.fn(() => ({
  isAuthenticated: false,
  user: null,
  login: mockLogin,
  logout: jest.fn(),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the useToast hook
jest.mock('../ToastNotifications', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<Login />);
    
    expect(screen.getByText('Risk Intelligence Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Risk Management & Intelligence Platform')).toBeInTheDocument();
  });

  it('displays quick start section', () => {
    render(<Login />);
    
    expect(screen.getByText('Quick Start')).toBeInTheDocument();
    expect(screen.getByText('Choose a pre-configured profile to explore the platform immediately')).toBeInTheDocument();
  });

  it('shows quick start profile cards', () => {
    render(<Login />);
    
    // Check for profile cards that are actually rendered
    expect(screen.getByText('Sarah Chen')).toBeInTheDocument();
    expect(screen.getByText('Mike Rodriguez')).toBeInTheDocument();
    expect(screen.getByText('Business Analyst')).toBeInTheDocument();
    expect(screen.getByText('Executive')).toBeInTheDocument();
  });

  it('displays role information in profile cards', () => {
    render(<Login />);
    
    // Check for role titles that are actually rendered
    expect(screen.getAllByText('Risk Manager')[0]).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
    expect(screen.getByText('Business Analyst')).toBeInTheDocument();
    expect(screen.getByText('Executive')).toBeInTheDocument();
  });

  it('shows custom login form section', () => {
    render(<Login />);
    
    expect(screen.getByText('Custom Login')).toBeInTheDocument();
  });

  it('displays form inputs', () => {
    render(<Login />);
    
    expect(screen.getByLabelText('First Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Company')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
  });

  it('shows submit button', () => {
    render(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /access dashboard/i });
    expect(submitButton).toBeInTheDocument();
  });

  it('displays platform features section', () => {
    render(<Login />);
    
    expect(screen.getByText('Platform Features')).toBeInTheDocument();
    expect(screen.getByText('Risk Assessment')).toBeInTheDocument();
    expect(screen.getByText('Intelligence')).toBeInTheDocument();
    expect(screen.getByText('Action Tracking')).toBeInTheDocument();
    expect(screen.getByText('Real-time Dashboard')).toBeInTheDocument();
  });

  it('shows icons in profile cards', () => {
    render(<Login />);
    
    // Check for icons using getAllByTestId to handle duplicates
    const securityIcons = screen.getAllByTestId('SecurityIcon');
    const businessIcons = screen.getAllByTestId('BusinessIcon');
    const analyticsIcons = screen.getAllByTestId('AnalyticsIcon');
    
    expect(securityIcons.length).toBeGreaterThan(0);
    expect(businessIcons.length).toBeGreaterThan(0);
    expect(analyticsIcons.length).toBeGreaterThan(0);
  });

  it('handles empty state gracefully', () => {
    render(<Login />);
    
    // Should render all sections even with no data
    expect(screen.getByText('Quick Start')).toBeInTheDocument();
    expect(screen.getByText('Custom Login')).toBeInTheDocument();
    expect(screen.getByText('Platform Features')).toBeInTheDocument();
  });
});
