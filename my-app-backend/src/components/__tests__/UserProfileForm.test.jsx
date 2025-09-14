import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import UserProfileForm from '../UserProfileForm';

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

describe('UserProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<UserProfileForm />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the user profile form header', () => {
    renderWithRouter(<UserProfileForm />);
    expect(screen.getByText('User Profile Form')).toBeInTheDocument();
  });

  it('shows profile form sections', () => {
    renderWithRouter(<UserProfileForm />);
    expect(screen.getByText('Profile Form Sections')).toBeInTheDocument();
  });

  it('displays user information section', () => {
    renderWithRouter(<UserProfileForm />);
    expect(screen.getByText('User Information')).toBeInTheDocument();
  });
});
