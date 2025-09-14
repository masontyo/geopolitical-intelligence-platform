import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GeographicHeatmap from '../GeographicHeatmap';

// Mock the useTheme hook
jest.mock('@mui/material/styles', () => ({
  useTheme: () => ({
    palette: {
      error: { main: '#f44336' },
      warning: { main: '#ff9800' },
      success: { main: '#4caf50' },
      primary: { main: '#1976d2' },
    },
  }),
}));

describe('GeographicHeatmap New Tests', () => {
  const mockEvents = [
    { id: 1, region: 'North America', severity: 'high', trend: 'increasing' },
    { id: 2, region: 'Europe', severity: 'medium', trend: 'stable' },
    { id: 3, region: 'Asia Pacific', severity: 'high', trend: 'increasing' },
    { id: 4, region: 'Middle East', severity: 'medium', trend: 'decreasing' },
    { id: 5, region: 'Africa', severity: 'low', trend: 'stable' },
    { id: 6, region: 'South America', severity: 'medium', trend: 'increasing' },
  ];

  beforeEach(() => {
    localStorage.clear();
  });

  it('should render without crashing', () => {
    render(<GeographicHeatmap events={mockEvents} />);
    expect(screen.getByText('Geographic Risk View')).toBeInTheDocument();
  });

  it('should display the correct number of regions', () => {
    render(<GeographicHeatmap events={mockEvents} />);
    expect(screen.getByText('6 regions')).toBeInTheDocument();
  });

  it('should show interactive world map section', () => {
    render(<GeographicHeatmap events={mockEvents} />);
    expect(screen.getByText('Interactive World Map')).toBeInTheDocument();
    expect(screen.getByText('Click regions to filter events')).toBeInTheDocument();
    expect(screen.getByText('Enable Map View')).toBeInTheDocument();
  });

  it('should display regional risk levels section', () => {
    render(<GeographicHeatmap events={mockEvents} />);
    expect(screen.getByText('Regional Risk Levels')).toBeInTheDocument();
  });

  it('should display event counts for each region', () => {
    render(<GeographicHeatmap events={mockEvents} />);
    
    // Should show event counts for each region (using getAllByText for duplicates)
    expect(screen.getByText(/15 events/)).toBeInTheDocument(); // North America
    expect(screen.getByText(/12 events/)).toBeInTheDocument(); // Europe
    expect(screen.getByText(/18 events/)).toBeInTheDocument(); // Asia Pacific
    
    // For regions with duplicate event counts, use getAllByText and check length
    const eightEventElements = screen.getAllByText(/8 events/);
    expect(eightEventElements.length).toBeGreaterThan(0);
    
    expect(screen.getByText(/5 events/)).toBeInTheDocument();  // Africa
    expect(screen.getByText(/7 events/)).toBeInTheDocument();  // South America
  });

  it('should display trend indicators correctly', () => {
    render(<GeographicHeatmap events={mockEvents} />);

    // Should show trend information in the format "15 events • increasing trend" 
    // Use getAllByText for trends that appear multiple times
    const increasingTrends = screen.getAllByText(/increasing trend/);
    expect(increasingTrends.length).toBeGreaterThan(0);
    
    expect(screen.getByText(/decreasing trend/)).toBeInTheDocument();
    expect(screen.getByText(/stable trend/)).toBeInTheDocument();
  });

  it('should show location icons', () => {
    render(<GeographicHeatmap events={mockEvents} />);
    
    // Should show location icons
    const locationIcons = screen.getAllByTestId('LocationOnIcon');
    expect(locationIcons.length).toBeGreaterThan(0);
  });

  it('should display risk level indicators', () => {
    render(<GeographicHeatmap events={mockEvents} />);
    
    // Should show risk level indicators (error icons for high risk)
    const errorIcons = screen.getAllByTestId('ErrorIcon');
    expect(errorIcons.length).toBeGreaterThan(0);
  });

  it('should show trend direction icons', () => {
    render(<GeographicHeatmap events={mockEvents} />);
    
    // Should show trend direction icons
    const trendingUpIcons = screen.getAllByTestId('TrendingUpIcon');
    expect(trendingUpIcons.length).toBeGreaterThan(0);
    
    const trendingDownIcons = screen.getAllByTestId('TrendingDownIcon');
    expect(trendingDownIcons.length).toBeGreaterThan(0);
  });
});

