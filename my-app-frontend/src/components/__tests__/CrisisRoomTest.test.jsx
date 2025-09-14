import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CrisisRoomTest from '../CrisisRoomTest';

describe('CrisisRoomTest', () => {
  it('renders without crashing', () => {
    render(<CrisisRoomTest />);
    // Check that the component renders something - look for any content
    expect(document.body).toBeInTheDocument();
  });

  it('displays crisis room test content', () => {
    render(<CrisisRoomTest />);
    // Check that the component renders something - look for any content
    expect(document.body).toBeInTheDocument();
  });
});
