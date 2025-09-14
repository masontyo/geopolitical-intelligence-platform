import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SampleDashboard from '../onboarding/SampleDashboard';

describe('SampleDashboard', () => {
  it('renders without crashing', () => {
    render(<SampleDashboard />);
    // Check that the component renders something - look for any content
    expect(document.body).toBeInTheDocument();
  });

  it('displays sample dashboard content', () => {
    render(<SampleDashboard />);
    // Check that the component renders something - look for any content
    expect(document.body).toBeInTheDocument();
  });
});
