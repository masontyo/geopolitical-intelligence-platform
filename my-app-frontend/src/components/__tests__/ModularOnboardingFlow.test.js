import React from 'react';
import { render, screen } from '../../test-utils';
import '@testing-library/jest-dom';
import ModularOnboardingFlow from '../ModularOnboardingFlow';

describe('ModularOnboardingFlow Component', () => {
  test('renders basic info form initially', () => {
    render(<ModularOnboardingFlow />);
    
    // Check for the main form elements that actually exist
    expect(screen.getByText(/Let's Get Started/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
    // Only test fields that actually exist
  });

  test('renders complete setup button', () => {
    render(<ModularOnboardingFlow />);
    
    const completeButton = screen.getByRole('button', { name: /Complete Setup & Go to Dashboard/i });
    expect(completeButton).toBeInTheDocument();
  });

  test('renders business units section', () => {
    render(<ModularOnboardingFlow />);
    
    expect(screen.getByText(/Business Units & Divisions/i)).toBeInTheDocument();
  });

  test('renders risk categories section', () => {
    render(<ModularOnboardingFlow />);
    
    // Use getByText with a more specific selector to avoid multiple matches
    expect(screen.getByText(/Risk Categories/i, { selector: 'h6' })).toBeInTheDocument();
  });

  test('renders regions section', () => {
    render(<ModularOnboardingFlow />);
    
    expect(screen.getByText(/Regions of Interest/i)).toBeInTheDocument();
  });

  test('renders notification preferences section', () => {
    render(<ModularOnboardingFlow />);
    
    expect(screen.getByText(/Notification Preferences/i)).toBeInTheDocument();
  });
}); 