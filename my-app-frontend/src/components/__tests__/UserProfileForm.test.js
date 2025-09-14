import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserProfileForm from '../UserProfileForm';

describe('UserProfileForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<UserProfileForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByRole('heading', { name: 'Create Profile' })).toBeInTheDocument();
  });

  it('displays form fields', () => {
    render(<UserProfileForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    expect(screen.getByText('Full Name')).toBeInTheDocument();
    expect(screen.getByText('Role/Position')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('shows submit button', () => {
    render(<UserProfileForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    expect(screen.getByRole('button', { name: 'Create Profile' })).toBeInTheDocument();
  });

  it('has form inputs available', () => {
    render(<UserProfileForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    // Check that we have the expected number of text inputs
    const inputs = screen.getAllByRole('textbox');
    expect(inputs.length).toBeGreaterThanOrEqual(3); // At least Full Name, Role, Company
  });

  it('renders the page structure', () => {
    render(<UserProfileForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    // Check for the main heading and form content
    expect(screen.getByRole('heading', { name: 'Create Profile' })).toBeInTheDocument();
    expect(screen.getByText('Full Name')).toBeInTheDocument();
  });
}); 