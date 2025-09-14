import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import AccountSettings from '../AccountSettings';

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

describe('AccountSettings', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<AccountSettings />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the account settings header', () => {
    renderWithRouter(<AccountSettings />);
    expect(screen.getByText('Account Settings')).toBeInTheDocument();
  });

  it('shows account information form', () => {
    renderWithRouter(<AccountSettings />);
    expect(screen.getByText('Account Information')).toBeInTheDocument();
  });

  it('displays security settings section', () => {
    renderWithRouter(<AccountSettings />);
    expect(screen.getByText('Security Settings')).toBeInTheDocument();
  });
});

