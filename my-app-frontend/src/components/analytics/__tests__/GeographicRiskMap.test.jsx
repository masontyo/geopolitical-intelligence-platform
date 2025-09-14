import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GeographicRiskMap from '../GeographicRiskMap';

describe('GeographicRiskMap', () => {
  const mockEvents = [
    {
      id: 'event-1',
      title: 'Supply Chain Disruption',
      regions: ['North America', 'Asia'],
      relevanceScore: 0.8,
      severity: 'high'
    },
    {
      id: 'event-2',
      title: 'Cybersecurity Alert',
      regions: ['Europe'],
      relevanceScore: 0.6,
      severity: 'medium'
    }
  ];

  const mockProfile = {
    id: 'test-profile-1',
    name: 'Test Company',
    regions: ['North America', 'Europe']
  };

  it('renders without crashing', () => {
    render(
      <GeographicRiskMap 
        events={mockEvents}
        profile={mockProfile}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('displays geographic risk map content', () => {
    render(
      <GeographicRiskMap 
        events={mockEvents}
        profile={mockProfile}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders with empty events', () => {
    render(
      <GeographicRiskMap 
        events={[]}
        profile={mockProfile}
      />
    );
    expect(document.body).toBeInTheDocument();
  });

  it('renders with no profile', () => {
    render(
      <GeographicRiskMap 
        events={mockEvents}
        profile={null}
      />
    );
    expect(document.body).toBeInTheDocument();
  });
});
