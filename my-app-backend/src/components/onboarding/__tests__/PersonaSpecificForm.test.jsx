import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import PersonaSpecificForm from '../PersonaSpecificForm';

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

describe('PersonaSpecificForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<PersonaSpecificForm />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the persona specific form header', () => {
    renderWithRouter(<PersonaSpecificForm />);
    expect(screen.getByText('Persona Specific Form')).toBeInTheDocument();
  });

  it('shows form sections', () => {
    renderWithRouter(<PersonaSpecificForm />);
    expect(screen.getByText('Form Sections')).toBeInTheDocument();
  });

  it('displays persona information section', () => {
    renderWithRouter(<PersonaSpecificForm />);
    expect(screen.getByText('Persona Information')).toBeInTheDocument();
  });
});

