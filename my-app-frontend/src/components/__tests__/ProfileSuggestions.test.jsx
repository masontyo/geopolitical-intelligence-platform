import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProfileSuggestions from '../ProfileSuggestions';

describe('ProfileSuggestions', () => {
  it('renders without crashing', () => {
    render(<ProfileSuggestions />);
    // Check for the actual content being rendered
    expect(screen.getByText('Recommended Profile Enrichments')).toBeInTheDocument();
  });

  it('displays profile suggestions content', () => {
    render(<ProfileSuggestions />);
    // Check for specific content elements
    expect(screen.getByText('Recommended Profile Enrichments')).toBeInTheDocument();
    expect(screen.getByText('Continue')).toBeInTheDocument();
    expect(screen.getByText(/Based on your sector\/peer data/)).toBeInTheDocument();
  });
});
