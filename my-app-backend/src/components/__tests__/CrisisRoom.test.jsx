import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import CrisisRoom from '../CrisisRoom';

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

describe('CrisisRoom', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<CrisisRoom />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the crisis room header', () => {
    renderWithRouter(<CrisisRoom />);
    expect(screen.getByText('Crisis Room')).toBeInTheDocument();
  });

  it('shows crisis management tools', () => {
    renderWithRouter(<CrisisRoom />);
    expect(screen.getByText('Crisis Management Tools')).toBeInTheDocument();
  });

  it('displays incident tracking section', () => {
    renderWithRouter(<CrisisRoom />);
    expect(screen.getByText('Incident Tracking')).toBeInTheDocument();
  });
});

