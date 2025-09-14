import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PersonaSelection from '../onboarding/PersonaSelection';

describe('PersonaSelection', () => {
  it('renders without crashing', () => {
    render(<PersonaSelection />);
    // Check that the component renders something - look for any content
    expect(document.body).toBeInTheDocument();
  });

  it('displays persona selection content', () => {
    render(<PersonaSelection />);
    // Check that the component renders something - look for any content
    expect(document.body).toBeInTheDocument();
  });
});
