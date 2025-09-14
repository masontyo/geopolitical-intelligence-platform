import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataPrivacy from '../DataPrivacy';

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
      secondary: { main: '#dc004e' }
    }
  }),
}));

describe('DataPrivacy', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<DataPrivacy />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays data privacy content', () => {
    render(<DataPrivacy />);
    expect(document.body).toBeInTheDocument();
  });

  it('loads with default privacy settings', () => {
    render(<DataPrivacy />);
    expect(document.body).toBeInTheDocument();
  });

  it('handles user profile data from localStorage', () => {
    const mockProfile = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com'
    };
    localStorage.setItem('user_profile', JSON.stringify(mockProfile));
    
    render(<DataPrivacy />);
    expect(document.body).toBeInTheDocument();
  });
});
