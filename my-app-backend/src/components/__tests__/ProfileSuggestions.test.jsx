import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ProfileSuggestions from '../ProfileSuggestions';

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

describe('ProfileSuggestions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<ProfileSuggestions />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the profile suggestions header', () => {
    renderWithRouter(<ProfileSuggestions />);
    expect(screen.getByText('Profile Suggestions')).toBeInTheDocument();
  });

  it('shows suggestions sections', () => {
    renderWithRouter(<ProfileSuggestions />);
    expect(screen.getByText('Suggestions Sections')).toBeInTheDocument();
  });

  it('displays profile guidance', () => {
    renderWithRouter(<ProfileSuggestions />);
    expect(screen.getByText('Profile Guidance')).toBeInTheDocument();
  });
});
