import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SkeletonLoader } from '../LoadingSpinner';

describe('SkeletonLoader', () => {
  it('renders without crashing', () => {
    const { container } = render(<SkeletonLoader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders skeleton container', () => {
    const { container } = render(<SkeletonLoader />);
    const skeletonContainer = container.querySelector('div');
    expect(skeletonContainer).toBeInTheDocument();
  });

  it('renders multiple skeleton elements', () => {
    const { container } = render(<SkeletonLoader lines={4} />);
    const skeletonElements = container.querySelectorAll('div > div');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it('renders with default props', () => {
    const { container } = render(<SkeletonLoader />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with custom props', () => {
    const { container } = render(<SkeletonLoader lines={6} height={30} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
