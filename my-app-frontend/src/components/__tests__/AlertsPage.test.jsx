import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertsPage from '../AlertsPage';

// Mock the useToast hook
jest.mock('../ToastNotifications', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

describe('AlertsPage', () => {
  it('renders without crashing', () => {
    render(<AlertsPage />);
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });

  it('displays page content', () => {
    render(<AlertsPage />);
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });

  it('renders the page structure', () => {
    render(<AlertsPage />);
    // Check for the main content
    expect(screen.getByText('Alerts')).toBeInTheDocument();
  });
});
