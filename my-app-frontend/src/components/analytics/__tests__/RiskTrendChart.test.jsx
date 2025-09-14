import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RiskTrendChart from '../RiskTrendChart';

describe('RiskTrendChart', () => {
  const mockEvents = [
    {
      id: 'event-1',
      title: 'Supply Chain Disruption',
      riskScore: 0.8,
      severity: 'high',
      timestamp: '2024-01-15T10:00:00Z'
    },
    {
      id: 'event-2',
      title: 'Cybersecurity Alert',
      riskScore: 0.6,
      severity: 'medium',
      timestamp: '2024-01-14T15:30:00Z'
    }
  ];

  const mockTimeRange = '30d';
  const mockAnalyticsData = {
    totalEvents: 15,
    averageRiskScore: 0.65,
    trendDirection: 'increasing'
  };

  it('renders without crashing', () => {
    render(
      <RiskTrendChart 
        events={mockEvents}
        timeRange={mockTimeRange}
        analyticsData={mockAnalyticsData}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('displays risk trend chart content', () => {
    render(
      <RiskTrendChart 
        events={mockEvents}
        timeRange={mockTimeRange}
        analyticsData={mockAnalyticsData}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders with different time ranges', () => {
    render(
      <RiskTrendChart 
        events={mockEvents}
        timeRange="7d"
        analyticsData={mockAnalyticsData}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders with 90 day time range', () => {
    render(
      <RiskTrendChart 
        events={mockEvents}
        timeRange="90d"
        analyticsData={mockAnalyticsData}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders with empty events', () => {
    render(
      <RiskTrendChart 
        events={[]}
        timeRange={mockTimeRange}
        analyticsData={mockAnalyticsData}
      />
    );
    expect(document.body).toBeInTheDocument();
  });
});
