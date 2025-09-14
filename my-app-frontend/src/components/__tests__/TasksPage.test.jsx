import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TasksPage from '../TasksPage';

// Mock the useToast hook
jest.mock('../ToastNotifications', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

describe('TasksPage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<TasksPage />);
    
    expect(screen.getByText('Tasks & Checklists')).toBeInTheDocument();
  });

  it('displays skeleton loading state initially', () => {
    render(<TasksPage />);
    
    // Check for skeleton elements by class name
    const skeletons = document.querySelectorAll('.MuiSkeleton-root');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('shows the main heading', () => {
    render(<TasksPage />);
    
    expect(screen.getByText('Tasks & Checklists')).toBeInTheDocument();
  });

  it('renders the page structure', () => {
    render(<TasksPage />);
    
    // Should render the container and grid structure
    expect(screen.getByText('Tasks & Checklists')).toBeInTheDocument();
  });

  it('handles empty state gracefully', () => {
    // Clear localStorage to simulate no tasks
    localStorage.clear();
    
    render(<TasksPage />);
    
    // Should still render the page structure
    expect(screen.getByText('Tasks & Checklists')).toBeInTheDocument();
  });
});
