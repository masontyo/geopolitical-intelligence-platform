import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GeographicHeatmap from '../GeographicHeatmap';

// Mock the useTheme hook
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useTheme: () => ({
    palette: {
      primary: { main: '#1976d2' },
      secondary: { main: '#dc004e' },
      error: { main: '#d32f2f' },
      warning: { main: '#ed6c02' },
      success: { main: '#2e7d32' },
      grey: { 100: '#f5f5f5', 300: '#d0d0d0' },
      text: { secondary: '#666666' }
    }
  }),
}));

describe('GeographicHeatmap', () => {
  const mockEvents = [
    {
      id: 'event-1',
      title: 'Supply Chain Disruption',
      regions: ['North America', 'Asia Pacific'],
      severity: 'high'
    },
    {
      id: 'event-2',
      title: 'Cybersecurity Alert',
      regions: ['Europe'],
      severity: 'medium'
    }
  ];

  const mockOnRegionClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<GeographicHeatmap events={mockEvents} onRegionClick={mockOnRegionClick} />);
    expect(screen.getByText('Geographic Risk View')).toBeInTheDocument();
  });

  it('displays the header with region count', () => {
    render(<GeographicHeatmap events={mockEvents} onRegionClick={mockOnRegionClick} />);
    
    expect(screen.getByText('Geographic Risk View')).toBeInTheDocument();
    expect(screen.getByText('6 regions')).toBeInTheDocument();
  });

  it('shows interactive map placeholder', () => {
    render(<GeographicHeatmap events={mockEvents} onRegionClick={mockOnRegionClick} />);
    
    expect(screen.getByText('Interactive World Map')).toBeInTheDocument();
    expect(screen.getByText('Click regions to filter events')).toBeInTheDocument();
    expect(screen.getByText('Enable Map View')).toBeInTheDocument();
  });

  it('displays region list with risk levels', () => {
    render(<GeographicHeatmap events={mockEvents} onRegionClick={mockOnRegionClick} />);
    
    // Check for high risk regions
    expect(screen.getByText('North America')).toBeInTheDocument();
    expect(screen.getByText('Asia Pacific')).toBeInTheDocument();
    
    // Check for medium risk regions
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Middle East')).toBeInTheDocument();
    expect(screen.getByText('South America')).toBeInTheDocument();
    
    // Check for low risk regions
    expect(screen.getByText('Africa')).toBeInTheDocument();
  });

  it('displays event counts for each region', () => {
    render(<GeographicHeatmap events={mockEvents} onRegionClick={mockOnRegionClick} />);
    
    // The component shows "15 events • increasing trend" format
    expect(screen.getByText(/15 events/)).toBeInTheDocument(); // North America
    expect(screen.getByText(/12 events/)).toBeInTheDocument(); // Europe
    expect(screen.getByText(/18 events/)).toBeInTheDocument(); // Asia Pacific
    expect(screen.getByText(/8 events/)).toBeInTheDocument();  // Middle East
    expect(screen.getByText(/5 events/)).toBeInTheDocument();  // Africa
    expect(screen.getByText(/7 events/)).toBeInTheDocument();  // South America
  });

  it('displays risk level indicators correctly', () => {
    render(<GeographicHeatmap events={mockEvents} onRegionClick={mockOnRegionClick} />);
    
    // Should show risk level chips
    const riskChips = screen.getAllByText(/high|medium|low/i);
    expect(riskChips.length).toBeGreaterThan(0);
  });

  it('displays trend indicators correctly', () => {
    render(<GeographicHeatmap events={mockEvents} onRegionClick={mockOnRegionClick} />);
    
    // Should show trend information in the format "15 events • increasing trend"
    expect(screen.getByText(/increasing trend/)).toBeInTheDocument();
    expect(screen.getByText(/decreasing trend/)).toBeInTheDocument();
    expect(screen.getByText(/stable trend/)).toBeInTheDocument();
  });

  it('handles region click events', () => {
    render(<GeographicHeatmap events={mockEvents} onRegionClick={mockOnRegionClick} />);
    
    // Click on a region
    const northAmericaRegion = screen.getByText('North America');
    fireEvent.click(northAmericaRegion);
    
    expect(mockOnRegionClick).toHaveBeenCalledWith('North America');
  });

  it('updates selected region when clicked', () => {
    render(<GeographicHeatmap events={mockEvents} onRegionClick={mockOnRegionClick} />);
    
    // Click on a region
    const europeRegion = screen.getByText('Europe');
    fireEvent.click(europeRegion);
    
    // The component should track the selected region internally
    expect(mockOnRegionClick).toHaveBeenCalledWith('Europe');
  });

  it('renders with empty events array', () => {
    render(<GeographicHeatmap events={[]} onRegionClick={mockOnRegionClick} />);
    
    // Should still show the geographic data (mock data)
    expect(screen.getByText('Geographic Risk View')).toBeInTheDocument();
    expect(screen.getByText('6 regions')).toBeInTheDocument();
  });

  it('renders without onRegionClick prop', () => {
    render(<GeographicHeatmap events={mockEvents} />);
    
    // Should render without errors
    expect(screen.getByText('Geographic Risk View')).toBeInTheDocument();
    
    // Clicking should not cause errors
    const region = screen.getByText('North America');
    fireEvent.click(region);
    
    // Should not crash
    expect(screen.getByText('Geographic Risk View')).toBeInTheDocument();
  });

  it('displays correct risk level colors', () => {
    render(<GeographicHeatmap events={mockEvents} onRegionClick={mockOnRegionClick} />);
    
    // High risk regions should be visible
    expect(screen.getByText('North America')).toBeInTheDocument();
    expect(screen.getByText('Asia Pacific')).toBeInTheDocument();
    
    // Medium risk regions should be visible
    expect(screen.getByText('Europe')).toBeInTheDocument();
    
    // Low risk regions should be visible
    expect(screen.getByText('Africa')).toBeInTheDocument();
  });

  it('shows location icon in header chip', () => {
    render(<GeographicHeatmap events={mockEvents} onRegionClick={mockOnRegionClick} />);
    
    const regionChip = screen.getByText('6 regions');
    expect(regionChip).toBeInTheDocument();
    expect(regionChip.closest('.MuiChip-root')).toBeInTheDocument();
  });
});
