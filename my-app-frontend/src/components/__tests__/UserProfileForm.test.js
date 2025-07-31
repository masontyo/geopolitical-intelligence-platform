import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import UserProfileForm from '../UserProfileForm';

// Create a theme for Material-UI components
const theme = createTheme();

// Wrapper component to provide theme context
const TestWrapper = ({ children }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

// Mock function for onSubmit
const mockOnSubmit = jest.fn();

const renderWithTheme = (component) => {
  return render(component, { wrapper: TestWrapper });
};

describe('UserProfileForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  test('renders form with basic fields', () => {
    renderWithTheme(<UserProfileForm onSubmit={mockOnSubmit} />);
    
    // Check that basic form fields are present
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role\/position/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    
    // Check that the submit button is present
    expect(screen.getByRole('button', { name: /create profile/i })).toBeInTheDocument();
  });

  test('renders form with initial data when provided', () => {
    const initialData = {
      name: 'John Doe',
      role: 'CRO',
      company: 'Test Corp',
      businessUnits: ['Manufacturing'],
      areasOfConcern: ['Supply Chain'],
      regions: ['Asia'],
      riskTolerance: 'high'
    };

    renderWithTheme(
      <UserProfileForm onSubmit={mockOnSubmit} initialData={initialData} />
    );
    
    // Check that initial data is displayed
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('CRO')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Corp')).toBeInTheDocument();
    
    // Check that chips are displayed
    expect(screen.getByText('Manufacturing')).toBeInTheDocument();
    expect(screen.getByText('Supply Chain')).toBeInTheDocument();
    expect(screen.getByText('Asia')).toBeInTheDocument();
  });

  test('shows loading state when loading prop is true', () => {
    renderWithTheme(<UserProfileForm onSubmit={mockOnSubmit} loading={true} />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders form sections correctly', () => {
    renderWithTheme(<UserProfileForm onSubmit={mockOnSubmit} />);
    
    // Check that section headers are present
    expect(screen.getByText(/business units/i)).toBeInTheDocument();
    expect(screen.getByText(/areas of concern/i)).toBeInTheDocument();
    expect(screen.getByText(/regions of interest/i)).toBeInTheDocument();
  });
}); 