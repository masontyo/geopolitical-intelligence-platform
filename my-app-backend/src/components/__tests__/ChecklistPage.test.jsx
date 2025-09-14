import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ChecklistPage from '../ChecklistPage';

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

describe('ChecklistPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<ChecklistPage />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the checklist header', () => {
    renderWithRouter(<ChecklistPage />);
    expect(screen.getByText('Checklists')).toBeInTheDocument();
  });

  it('shows checklist management tools', () => {
    renderWithRouter(<ChecklistPage />);
    expect(screen.getByText('Create New Checklist')).toBeInTheDocument();
  });

  it('displays checklist items section', () => {
    renderWithRouter(<ChecklistPage />);
    expect(screen.getByText('My Checklists')).toBeInTheDocument();
  });
});

