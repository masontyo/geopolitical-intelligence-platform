import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AlertsPage from '../AlertsPage';

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

describe('AlertsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<AlertsPage />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the alerts header', () => {
    renderWithRouter(<AlertsPage />);
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });

  it('shows alert management tools', () => {
    renderWithRouter(<AlertsPage />);
    expect(screen.getByText('Alert Management')).toBeInTheDocument();
  });

  it('displays alert configuration section', () => {
    renderWithRouter(<AlertsPage />);
    expect(screen.getByText('Alert Configuration')).toBeInTheDocument();
  });
});

