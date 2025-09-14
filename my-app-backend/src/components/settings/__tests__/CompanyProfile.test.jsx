import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import CompanyProfile from '../CompanyProfile';

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

describe('CompanyProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe' },
    });
  });

  it('renders without crashing', () => {
    renderWithRouter(<CompanyProfile />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the company profile header', () => {
    renderWithRouter(<CompanyProfile />);
    expect(screen.getByText('Company Profile')).toBeInTheDocument();
  });

  it('shows company information form', () => {
    renderWithRouter(<CompanyProfile />);
    expect(screen.getByText('Company Information')).toBeInTheDocument();
  });

  it('displays company details section', () => {
    renderWithRouter(<CompanyProfile />);
    expect(screen.getByText('Company Details')).toBeInTheDocument();
  });
});

