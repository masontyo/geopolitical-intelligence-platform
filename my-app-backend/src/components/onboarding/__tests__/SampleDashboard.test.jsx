import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import SampleDashboard from '../SampleDashboard';

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

describe('SampleDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<SampleDashboard />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the sample dashboard header', () => {
    renderWithRouter(<SampleDashboard />);
    expect(screen.getByText('Sample Dashboard')).toBeInTheDocument();
  });

  it('shows dashboard sections', () => {
    renderWithRouter(<SampleDashboard />);
    expect(screen.getByText('Dashboard Sections')).toBeInTheDocument();
  });

  it('displays sample data section', () => {
    renderWithRouter(<SampleDashboard />);
    expect(screen.getByText('Sample Data')).toBeInTheDocument();
  });
});

