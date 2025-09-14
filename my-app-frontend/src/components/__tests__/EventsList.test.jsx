import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventsList from '../EventsList';

// Mock the useToast hook
jest.mock('../ToastNotifications', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('EventsList', () => {
  it('renders without crashing', () => {
    render(<EventsList />);
    expect(screen.getByText('Events')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    render(<EventsList />);
    
    // Should show skeletons while loading
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays the page header', () => {
    render(<EventsList />);
    expect(screen.getByText('Events')).toBeInTheDocument();
  });

  it('renders the page structure', () => {
    render(<EventsList />);
    expect(screen.getByText('Events')).toBeInTheDocument();
  });
});
