import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ActionSteps from '../ActionSteps';

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

describe('ActionSteps', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<ActionSteps />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the action steps header', () => {
    renderWithRouter(<ActionSteps />);
    expect(screen.getByText('Action Steps')).toBeInTheDocument();
  });

  it('shows step sections', () => {
    renderWithRouter(<ActionSteps />);
    expect(screen.getByText('Step Sections')).toBeInTheDocument();
  });

  it('displays action guidance', () => {
    renderWithRouter(<ActionSteps />);
    expect(screen.getByText('Action Guidance')).toBeInTheDocument();
  });
});

