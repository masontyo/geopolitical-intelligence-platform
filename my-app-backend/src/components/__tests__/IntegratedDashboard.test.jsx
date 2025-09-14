import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import IntegratedDashboard from '../IntegratedDashboard';

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

describe('IntegratedDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<IntegratedDashboard />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the dashboard header', () => {
    renderWithRouter(<IntegratedDashboard />);
    expect(screen.getByText('Integrated Risk Dashboard')).toBeInTheDocument();
  });

  it('shows risk overview section', () => {
    renderWithRouter(<IntegratedDashboard />);
    expect(screen.getByText('Risk Overview')).toBeInTheDocument();
  });

  it('displays recent events section', () => {
    renderWithRouter(<IntegratedDashboard />);
    expect(screen.getByText('Recent Events')).toBeInTheDocument();
  });
});

