import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BasicInfoForm from '../onboarding/BasicInfoForm';

describe('BasicInfoForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<BasicInfoForm onSubmit={mockOnSubmit} onError={mockOnError} data={{}} />);
    expect(screen.getByText("Let's Get Started")).toBeInTheDocument();
  });

  it('displays form fields', () => {
    render(<BasicInfoForm onSubmit={mockOnSubmit} onError={mockOnError} data={{}} />);
    
    expect(screen.getByText('First Name')).toBeInTheDocument();
    expect(screen.getByText('Last Name')).toBeInTheDocument();
  });

  it('shows submit button', () => {
    render(<BasicInfoForm onSubmit={mockOnSubmit} onError={mockOnError} data={{}} />);
    expect(screen.getByText('Complete Setup & Go to Dashboard')).toBeInTheDocument();
  });

  it('handles form submission', () => {
    render(<BasicInfoForm onSubmit={mockOnSubmit} onError={mockOnError} data={{}} />);
    
    const submitButton = screen.getByText('Complete Setup & Go to Dashboard');
    fireEvent.click(submitButton);
    
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('renders with existing data', () => {
    const existingData = {
      firstName: 'John',
      lastName: 'Doe'
    };
    
    render(<BasicInfoForm onSubmit={mockOnSubmit} onError={mockOnError} data={existingData} />);
    
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
  });
});
