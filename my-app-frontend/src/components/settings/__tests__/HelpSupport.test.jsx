import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import HelpSupport from '../HelpSupport';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the useTheme hook
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: () => ({
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      background: { paper: '#ffffff' }
    },
    shadows: [
      'none',
      '0px 1px 3px rgba(0,0,0,0.12)',
      '0px 1px 5px rgba(0,0,0,0.2)',
      '0px 1px 8px rgba(0,0,0,0.12)',
      '0px 1px 10px rgba(0,0,0,0.16)',
      '0px 1px 14px rgba(0,0,0,0.2)',
      '0px 1px 18px rgba(0,0,0,0.22)',
      '0px 2px 16px rgba(0,0,0,0.24)',
      '0px 3px 14px rgba(0,0,0,0.26)',
      '0px 3px 16px rgba(0,0,0,0.28)',
      '0px 4px 18px rgba(0,0,0,0.3)',
      '0px 4px 20px rgba(0,0,0,0.32)',
      '0px 5px 22px rgba(0,0,0,0.34)',
      '0px 5px 24px rgba(0,0,0,0.36)',
      '0px 5px 26px rgba(0,0,0,0.38)',
      '0px 6px 28px rgba(0,0,0,0.4)',
      '0px 6px 30px rgba(0,0,0,0.42)',
      '0px 6px 32px rgba(0,0,0,0.44)',
      '0px 7px 34px rgba(0,0,0,0.46)',
      '0px 7px 36px rgba(0,0,0,0.48)',
      '0px 8px 38px rgba(0,0,0,0.5)',
      '0px 8px 40px rgba(0,0,0,0.52)',
      '0px 8px 42px rgba(0,0,0,0.54)',
      '0px 9px 44px rgba(0,0,0,0.56)',
      '0px 9px 46px rgba(0,0,0,0.58)',
      '0px 9px 48px rgba(0,0,0,0.6)'
    ]
  }),
}));

describe('HelpSupport', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<HelpSupport />);
    expect(screen.getByText('Help & Support')).toBeInTheDocument();
  });

  it('displays the main help sections', () => {
    render(<HelpSupport />);
    
    expect(screen.getByText('Help & Support')).toBeInTheDocument();
    expect(screen.getByText('Quick Help')).toBeInTheDocument();
  });

  it('displays quick help buttons', () => {
    render(<HelpSupport />);
    
    expect(screen.getByText('Update Onboarding Info')).toBeInTheDocument();
    expect(screen.getByText('Export My Data')).toBeInTheDocument();
  });

  it('shows back button functionality', () => {
    render(<HelpSupport />);
    
    // Should show back arrow button
    const backButton = screen.getByTestId('ArrowBackIcon');
    expect(backButton).toBeInTheDocument();
  });

  it('renders help icons correctly', () => {
    render(<HelpSupport />);
    
    // Should show various help-related icons
    expect(screen.getByTestId('HelpIcon')).toBeInTheDocument();
    expect(screen.getByTestId('BookIcon')).toBeInTheDocument();
    expect(screen.getByTestId('DownloadIcon')).toBeInTheDocument();
  });

  it('displays help description', () => {
    render(<HelpSupport />);
    
    expect(screen.getByText('Find answers, documentation, and get help when you need it')).toBeInTheDocument();
  });
});
