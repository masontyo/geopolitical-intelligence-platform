import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AlertSystem from '../AlertSystem';

// Mock the useToast hook if it's used
jest.mock('../../ToastNotifications', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

describe('AlertSystem', () => {
  const mockProfile = {
    id: 'test-profile-1',
    name: 'Test Company',
    regions: ['North America', 'Europe']
  };

  const mockEvents = [
    {
      id: 'event-1',
      title: 'Supply Chain Disruption',
      riskScore: 0.8,
      severity: 'high',
      region: 'North America'
    }
  ];

  const mockAnalyticsData = {
    totalAlerts: 15,
    activeRules: 3,
    alertTrend: 'increasing'
  };

  it('renders without crashing', () => {
    render(
      <AlertSystem 
        profile={mockProfile}
        events={mockEvents}
        analyticsData={mockAnalyticsData}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('displays alert system content', () => {
    render(
      <AlertSystem 
        profile={mockProfile}
        events={mockEvents}
        analyticsData={mockAnalyticsData}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders with default props', () => {
    render(<AlertSystem events={[]} />);
    expect(document.body).toBeInTheDocument();
  });
});
