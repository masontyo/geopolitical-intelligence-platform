import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ToastProvider } from '../ToastNotifications';

describe('ToastNotifications', () => {
  it('renders toast provider without crashing', () => {
    render(
      <ToastProvider>
        <div>Test content</div>
      </ToastProvider>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('provides toast context', () => {
    render(
      <ToastProvider>
        <div>Toast Provider Test</div>
      </ToastProvider>
    );

    expect(screen.getByText('Toast Provider Test')).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(
      <ToastProvider>
        <button>Test Button</button>
      </ToastProvider>
    );

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });
});
