import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EnterpriseDashboard from '../EnterpriseDashboard';

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
  useLocation: () => ({ pathname: '/dashboard' }),
}));

// Mock the userProfileAPI
jest.mock('../../services/api', () => ({
  userProfileAPI: {
    getProfile: jest.fn(() => Promise.resolve({
      id: 'test-profile-1',
      firstName: 'John',
      lastName: 'Doe',
      company: 'Test Company',
      role: 'Risk Manager'
    }))
  }
}));

describe('EnterpriseDashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    render(<EnterpriseDashboard />);
    
    // Wait for the component to render
    await screen.findByText('Risk Intelligence Dashboard');
    expect(screen.getByText('Risk Intelligence Dashboard')).toBeInTheDocument();
  });

  it('displays user profile information', async () => {
    render(<EnterpriseDashboard />);
    
    await screen.findByText('Risk Intelligence Dashboard');
    expect(screen.getByText('Welcome back, User')).toBeInTheDocument();
  });

  it('shows recent events section', async () => {
    render(<EnterpriseDashboard />);
    
    await screen.findByText('Risk Intelligence Dashboard');
    expect(screen.getByText('Recent Events')).toBeInTheDocument();
  });

  it('handles empty action steps gracefully', async () => {
    render(<EnterpriseDashboard />);
    
    await screen.findByText('Risk Intelligence Dashboard');
    // Should not crash when there are no action steps
    expect(screen.getByText('Risk Intelligence Dashboard')).toBeInTheDocument();
  });

  it('displays dashboard structure correctly', async () => {
    render(<EnterpriseDashboard />);
    
    await screen.findByText('Risk Intelligence Dashboard');
    
    // Check for basic dashboard elements
    expect(screen.getByText('Welcome back, User')).toBeInTheDocument();
    expect(screen.getByText('Recent Events')).toBeInTheDocument();
  });

  it('shows refresh button', async () => {
    render(<EnterpriseDashboard />);
    
    await screen.findByText('Risk Intelligence Dashboard');
    const refreshButton = screen.getByText('Refresh');
    expect(refreshButton).toBeInTheDocument();
  });

  it('shows view all events button', async () => {
    render(<EnterpriseDashboard />);
    
    await screen.findByText('Risk Intelligence Dashboard');
    const viewAllButton = screen.getByText('View All');
    expect(viewAllButton).toBeInTheDocument();
  });

  it('displays recent events', async () => {
    render(<EnterpriseDashboard />);
    
    await screen.findByText('Risk Intelligence Dashboard');
    
    // Check for sample events that are hardcoded in the component
    expect(screen.getByText('Supply Chain Disruption in Asia Pacific')).toBeInTheDocument();
    expect(screen.getByText('New Regulatory Requirements in Europe')).toBeInTheDocument();
  });
});
