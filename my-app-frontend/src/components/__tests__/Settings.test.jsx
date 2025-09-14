import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Settings from '../Settings';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the useTheme hook
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: () => ({
    shadows: ['none', '0px 1px 3px rgba(0,0,0,0.12)', '0px 1px 5px rgba(0,0,0,0.2)', '0px 1px 8px rgba(0,0,0,0.12)', '0px 1px 10px rgba(0,0,0,0.16)', '0px 1px 14px rgba(0,0,0,0.2)', '0px 1px 18px rgba(0,0,0,0.22)', '0px 2px 16px rgba(0,0,0,0.24)', '0px 3px 14px rgba(0,0,0,0.26)', '0px 3px 16px rgba(0,0,0,0.28)', '0px 4px 18px rgba(0,0,0,0.3)', '0px 4px 20px rgba(0,0,0,0.32)', '0px 5px 22px rgba(0,0,0,0.34)', '0px 5px 24px rgba(0,0,0,0.36)', '0px 5px 26px rgba(0,0,0,0.38)', '0px 6px 28px rgba(0,0,0,0.4)', '0px 6px 30px rgba(0,0,0,0.42)', '0px 6px 32px rgba(0,0,0,0.44)', '0px 7px 34px rgba(0,0,0,0.46)', '0px 7px 36px rgba(0,0,0,0.48)', '0px 8px 38px rgba(0,0,0,0.5)', '0px 8px 40px rgba(0,0,0,0.52)', '0px 8px 42px rgba(0,0,0,0.54)', '0px 9px 44px rgba(0,0,0,0.56)', '0px 9px 46px rgba(0,0,0,0.58)', '0px 9px 48px rgba(0,0,0,0.6)']
  }),
}));

describe('Settings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<Settings />);
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('displays the main settings sections', () => {
    render(<Settings />);
    
    expect(screen.getByText('Company Profile')).toBeInTheDocument();
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
    expect(screen.getByText('Data & Privacy')).toBeInTheDocument();
    expect(screen.getByText('Help & Support')).toBeInTheDocument();
  });

  it('shows notification preferences section', () => {
    render(<Settings />);
    
    expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
    expect(screen.getByText('Expand')).toBeInTheDocument();
  });

  it('expands notification settings when expand button is clicked', () => {
    render(<Settings />);
    
    const expandButton = screen.getByText('Expand');
    fireEvent.click(expandButton);
    
    expect(screen.getByText('Collapse')).toBeInTheDocument();
    expect(screen.getAllByText('Alert Frequency')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Notification Methods')[0]).toBeInTheDocument();
    expect(screen.getByText('Alert Priority Levels')).toBeInTheDocument();
  });

  it('displays quick actions section', () => {
    render(<Settings />);
    
    expect(screen.getByText('Quick Actions')).toBeInTheDocument();
    expect(screen.getByText('Update Onboarding Info')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
    expect(screen.getByText('View Documentation')).toBeInTheDocument();
  });

  it('shows company profile description', () => {
    render(<Settings />);
    
    expect(screen.getByText('Manage company information, business units, and risk preferences')).toBeInTheDocument();
  });

  it('shows account settings description', () => {
    render(<Settings />);
    
    expect(screen.getByText('Personal information, password, and security preferences')).toBeInTheDocument();
  });

  it('shows data privacy description', () => {
    render(<Settings />);
    
    expect(screen.getByText('Data export, privacy settings, and compliance preferences')).toBeInTheDocument();
  });

  it('shows help support description', () => {
    render(<Settings />);
    
    expect(screen.getByText('Documentation, contact support, and troubleshooting')).toBeInTheDocument();
  });
});
