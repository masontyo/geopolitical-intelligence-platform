import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProgressBar } from '../LoadingSpinner';

describe('ProgressBar', () => {
  it('renders without crashing', () => {
    render(<ProgressBar value={50} message="Test Progress" />);
    expect(screen.getByText('Test Progress')).toBeInTheDocument();
  });

  it('displays progress percentage', () => {
    render(<ProgressBar value={75} message="Test Progress" />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('displays progress message', () => {
    render(<ProgressBar value={25} message="Loading files..." />);
    expect(screen.getByText('Loading files...')).toBeInTheDocument();
  });

  it('hides percentage when showPercentage is false', () => {
    render(<ProgressBar value={60} message="Test Progress" showPercentage={false} />);
    expect(screen.queryByText('60%')).not.toBeInTheDocument();
  });

  it('renders progress bar element', () => {
    render(<ProgressBar value={80} message="Test Progress" />);
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });
});
