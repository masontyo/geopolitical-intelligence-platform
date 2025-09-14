import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkeletonLoader from '../SkeletonLoader';

describe('SkeletonLoader', () => {
  it('renders without crashing', () => {
    render(<SkeletonLoader />);
    expect(document.body).toBeInTheDocument();
  });

  it('displays the skeleton loader component', () => {
    render(<SkeletonLoader />);
    expect(screen.getByText('Skeleton Loader')).toBeInTheDocument();
  });

  it('shows loader sections', () => {
    render(<SkeletonLoader />);
    expect(screen.getByText('Loader Sections')).toBeInTheDocument();
  });

  it('displays loading animation', () => {
    render(<SkeletonLoader />);
    expect(screen.getByText('Loading Animation')).toBeInTheDocument();
  });
});
