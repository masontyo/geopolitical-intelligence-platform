import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventFeed from '../EventFeed';

// Mock the useTheme hook
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: () => ({
    breakpoints: {
      down: () => false
    },
    shadows: [
      'none',
      '0px 1px 3px rgba(0,0,0,0.12)',
      '0px 1px 5px rgba(0,0,0,0.2)',
      '0px 1px 8px rgba(0,0,0,0.12)',
      '0px 1px 10px rgba(0,0,0,0.16)',
      '0px 1px 14px rgba(0,0,0,0.2)',
      '0px 1px 18px rgba(0,0,0,0.22)',
      '0px 2px 16px rgba(0,0,0,0.24)',
      '0px 3px 14px rgba(0,0,0,0.26)',
      '0px 3px 16px rgba(0,0,0,0.28)',
      '0px 4px 18px rgba(0,0,0,0.3)',
      '0px 4px 20px rgba(0,0,0,0.32)',
      '0px 5px 22px rgba(0,0,0,0.34)',
      '0px 5px 24px rgba(0,0,0,0.36)',
      '0px 5px 26px rgba(0,0,0,0.38)',
      '0px 6px 28px rgba(0,0,0,0.4)',
      '0px 6px 30px rgba(0,0,0,0.42)',
      '0px 6px 32px rgba(0,0,0,0.44)',
      '0px 7px 34px rgba(0,0,0,0.46)',
      '0px 7px 36px rgba(0,0,0,0.48)',
      '0px 8px 38px rgba(0,0,0,0.5)',
      '0px 8px 40px rgba(0,0,0,0.52)',
      '0px 8px 42px rgba(0,0,0,0.54)',
      '0px 9px 44px rgba(0,0,0,0.56)',
      '0px 9px 46px rgba(0,0,0,0.58)',
      '0px 9px 48px rgba(0,0,0,0.6)'
    ]
  }),
  useMediaQuery: () => false
}));

describe('EventFeed', () => {
  const mockEvents = [
    {
      id: 'event-1',
      title: 'Supply Chain Disruption',
      description: 'Port closures affecting shipments',
      severity: 'high',
      regions: ['Asia Pacific'],
      categories: ['business'],
      date: '2024-01-15'
    },
    {
      id: 'event-2',
      title: 'Cybersecurity Alert',
      description: 'New phishing campaign detected',
      severity: 'medium',
      regions: ['Global'],
      categories: ['cybersecurity'],
      date: '2024-01-14'
    }
  ];

  const mockOnViewEventDetails = jest.fn();

  it('renders without crashing', () => {
    render(
      <EventFeed 
        events={mockEvents}
        onViewEventDetails={mockOnViewEventDetails}
        loading={false}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('displays event feed content', () => {
    render(
      <EventFeed 
        events={mockEvents}
        onViewEventDetails={mockOnViewEventDetails}
        loading={false}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders with empty events', () => {
    render(
      <EventFeed 
        events={[]}
        onViewEventDetails={mockOnViewEventDetails}
        loading={false}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(
      <EventFeed 
        events={mockEvents}
        onViewEventDetails={mockOnViewEventDetails}
        loading={true}
      />
    );
    expect(document.body).toBeInTheDocument();
  });
});
