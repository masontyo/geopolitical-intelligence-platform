import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import BasicInfoForm from '../BasicInfoForm';

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

describe('BasicInfoForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<BasicInfoForm />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the basic info form header', () => {
    renderWithRouter(<BasicInfoForm />);
    expect(screen.getByText('Basic Info Form')).toBeInTheDocument();
  });

  it('shows form sections', () => {
    renderWithRouter(<BasicInfoForm />);
    expect(screen.getByText('Form Sections')).toBeInTheDocument();
  });

  it('displays personal information section', () => {
    renderWithRouter(<BasicInfoForm />);
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });
});

