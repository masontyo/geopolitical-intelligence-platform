import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventDetails from '../EventDetails';

// Mock the useToast hook
jest.mock('../ToastNotifications', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ eventId: 'test-event-1' }),
  useLocation: () => ({ state: { from: '/dashboard' } }),
}));

// Mock the eventsAPI
jest.mock('../../services/api', () => ({
  eventsAPI: {
    getEventById: jest.fn(() => Promise.resolve({
      id: 'test-event-1',
      title: 'Supply Chain Disruption in Asia Pacific',
      description: 'Port closures',
      severity: 'high',
      categories: ['Supply Chain Risk'],
      regions: ['Asia Pacific'],
      timestamp: '2024-01-01T12:00:00Z',
      actionSteps: [
        { id: 1, text: 'Contact key suppliers', status: 'pending', priority: 'high' },
      ],
      relatedEvents: [],
    })),
  },
}));

describe('EventDetails', () => {
  it('renders without crashing', async () => {
    render(<EventDetails />);
    expect(await screen.findByText('Supply Chain Disruption in Asia Pacific')).toBeInTheDocument();
    // Use getAllByText since there are multiple "high" elements
    expect(screen.getAllByText('high').length).toBeGreaterThan(0);
    expect(screen.getByText('Supply Chain Risk')).toBeInTheDocument();
  });

  it('displays back navigation button', async () => {
    render(<EventDetails />);
    // Look for the back button by its icon
    expect(await screen.findByTestId('ArrowBackIcon')).toBeInTheDocument();
  });

  it('shows technical details section', async () => {
    render(<EventDetails />);
    expect(await screen.findByText('Technical Details')).toBeInTheDocument();
  });

  it('displays add custom action button', async () => {
    render(<EventDetails />);
    expect(await screen.findByText('Add Custom Action')).toBeInTheDocument();
  });
});
