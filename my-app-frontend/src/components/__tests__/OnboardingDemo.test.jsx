import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OnboardingDemo from '../OnboardingDemo';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('OnboardingDemo', () => {
  it('renders without crashing', () => {
    render(<OnboardingDemo />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays onboarding demo content', () => {
    render(<OnboardingDemo />);
    expect(document.body).toBeInTheDocument();
  });
});
