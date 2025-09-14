import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressBar from '../ProgressBar';

describe('ProgressBar', () => {
  it('renders without crashing', () => {
    render(<ProgressBar />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the progress bar component', () => {
    render(<ProgressBar />);
    expect(screen.getByText('Progress Bar')).toBeInTheDocument();
  });

  it('shows progress sections', () => {
    render(<ProgressBar />);
    expect(screen.getByText('Progress Sections')).toBeInTheDocument();
  });

  it('displays progress tracking', () => {
    render(<ProgressBar />);
    expect(screen.getByText('Progress Tracking')).toBeInTheDocument();
  });
});
