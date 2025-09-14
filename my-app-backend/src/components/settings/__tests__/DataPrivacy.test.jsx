import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import DataPrivacy from '../DataPrivacy';

// Mock the useAuth hook
const mockUseAuth = jest.fn();
jest.mock('../../../contexts/AuthContext', () => ({
  useAuth: () => mockUseAuth(),
}));

// Mock the useToast hook
jest.mock('../../ToastNotifications', () => ({
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

describe('DataPrivacy', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<DataPrivacy />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the data privacy header', () => {
    renderWithRouter(<DataPrivacy />);
    expect(screen.getByText('Data & Privacy')).toBeInTheDocument();
  });

  it('shows privacy settings section', () => {
    renderWithRouter(<DataPrivacy />);
    expect(screen.getByText('Privacy Settings')).toBeInTheDocument();
  });

  it('displays data retention section', () => {
    renderWithRouter(<DataPrivacy />);
    expect(screen.getByText('Data Retention')).toBeInTheDocument();
  });
});

