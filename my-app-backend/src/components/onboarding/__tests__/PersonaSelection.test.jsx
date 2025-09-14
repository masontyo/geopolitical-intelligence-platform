import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import PersonaSelection from '../PersonaSelection';

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

describe('PersonaSelection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<PersonaSelection />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the persona selection header', () => {
    renderWithRouter(<PersonaSelection />);
    expect(screen.getByText('Persona Selection')).toBeInTheDocument();
  });

  it('shows persona options', () => {
    renderWithRouter(<PersonaSelection />);
    expect(screen.getByText('Persona Options')).toBeInTheDocument();
  });

  it('displays selection guidance', () => {
    renderWithRouter(<PersonaSelection />);
    expect(screen.getByText('Selection Guidance')).toBeInTheDocument();
  });
});

