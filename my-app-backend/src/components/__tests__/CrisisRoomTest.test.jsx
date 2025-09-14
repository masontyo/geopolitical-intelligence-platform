import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import CrisisRoomTest from '../CrisisRoomTest';

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

describe('CrisisRoomTest', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<CrisisRoomTest />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the crisis room test header', () => {
    renderWithRouter(<CrisisRoomTest />);
    expect(screen.getByText('Crisis Room Test')).toBeInTheDocument();
  });

  it('shows test sections', () => {
    renderWithRouter(<CrisisRoomTest />);
    expect(screen.getByText('Test Sections')).toBeInTheDocument();
  });

  it('displays crisis management test', () => {
    renderWithRouter(<CrisisRoomTest />);
    expect(screen.getByText('Crisis Management Test')).toBeInTheDocument();
  });
});
