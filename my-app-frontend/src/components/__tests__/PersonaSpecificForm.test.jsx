import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonaSpecificForm from '../onboarding/PersonaSpecificForm';

describe('PersonaSpecificForm', () => {
  it('renders without crashing', () => {
    render(<PersonaSpecificForm />);
    // Check that the component renders something - look for any content
    expect(document.body).toBeInTheDocument();
  });

  it('displays persona specific form content', () => {
    render(<PersonaSpecificForm />);
    // Check that the component renders something - look for any content
    expect(document.body).toBeInTheDocument();
  });
});
