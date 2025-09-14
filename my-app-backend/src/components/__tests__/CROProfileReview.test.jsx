import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import CROProfileReview from '../CROProfileReview';

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

describe('CROProfileReview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<CROProfileReview />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the CRO profile review header', () => {
    renderWithRouter(<CROProfileReview />);
    expect(screen.getByText('CRO Profile Review')).toBeInTheDocument();
  });

  it('shows review sections', () => {
    renderWithRouter(<CROProfileReview />);
    expect(screen.getByText('Review Sections')).toBeInTheDocument();
  });

  it('displays profile analysis', () => {
    renderWithRouter(<CROProfileReview />);
    expect(screen.getByText('Profile Analysis')).toBeInTheDocument();
  });
});
