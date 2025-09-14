import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ProfileReview from '../ProfileReview';

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

describe('ProfileReview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<ProfileReview />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the profile review header', () => {
    renderWithRouter(<ProfileReview />);
    expect(screen.getByText('Profile Review')).toBeInTheDocument();
  });

  it('shows profile information sections', () => {
    renderWithRouter(<ProfileReview />);
    expect(screen.getByText('Profile Information')).toBeInTheDocument();
  });

  it('displays review summary section', () => {
    renderWithRouter(<ProfileReview />);
    expect(screen.getByText('Review Summary')).toBeInTheDocument();
  });
});

