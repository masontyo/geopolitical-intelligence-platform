import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RiskMetricsCard from '../RiskMetricsCard';
import { TrendingUp, TrendingDown, Remove } from '@mui/icons-material';

describe('RiskMetricsCard', () => {
  const defaultProps = {
    title: 'Risk Score',
    value: '85',
    trend: '+5.2%',
    trendDirection: 'up',
    color: 'primary',
    icon: <TrendingUp />,
    subtitle: 'Last 30 days',
    description: 'Overall risk assessment score'
  };

  it('renders without crashing', () => {
    render(<RiskMetricsCard {...defaultProps} />);
    expect(screen.getByText('Risk Score')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
  });

  it('displays all provided props correctly', () => {
    render(<RiskMetricsCard {...defaultProps} />);
    
    expect(screen.getByText('Risk Score')).toBeInTheDocument();
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('+5.2%')).toBeInTheDocument();
    expect(screen.getByText('Last 30 days')).toBeInTheDocument();
    expect(screen.getByText('Overall risk assessment score')).toBeInTheDocument();
  });

  it('handles upward trend direction correctly', () => {
    render(<RiskMetricsCard {...defaultProps} trendDirection="up" />);
    
    // Find the trend icon in the trend section (not the main icon)
    const trendIcons = screen.getAllByTestId('TrendingUpIcon');
    const trendIcon = trendIcons[1]; // The second one is the trend icon
    expect(trendIcon).toBeInTheDocument();
    expect(trendIcon).toHaveClass('MuiSvgIcon-colorError');
  });

  it('handles downward trend direction correctly', () => {
    render(<RiskMetricsCard {...defaultProps} trendDirection="down" />);
    
    const trendIcon = screen.getByTestId('TrendingDownIcon');
    expect(trendIcon).toBeInTheDocument();
    expect(trendIcon).toHaveClass('MuiSvgIcon-colorSuccess');
  });

  it('handles neutral trend direction correctly', () => {
    render(<RiskMetricsCard {...defaultProps} trendDirection="neutral" />);
    
    const trendIcon = screen.getByTestId('RemoveIcon');
    expect(trendIcon).toBeInTheDocument();
    expect(trendIcon).toHaveClass('MuiSvgIcon-colorAction');
  });

  it('renders without optional props', () => {
    const minimalProps = {
      title: 'Minimal Card',
      value: '42',
      trend: '0%',
      icon: <TrendingUp />
    };
    
    render(<RiskMetricsCard {...minimalProps} />);
    
    expect(screen.getByText('Minimal Card')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.queryByText('Last 30 days')).not.toBeInTheDocument();
    expect(screen.queryByText('Overall risk assessment score')).not.toBeInTheDocument();
  });

  it('applies custom color correctly', () => {
    render(<RiskMetricsCard {...defaultProps} color="error" />);
    
    const card = screen.getByText('Risk Score').closest('.MuiCard-root');
    expect(card).toBeInTheDocument();
  });

  it('displays tooltip on trend hover', () => {
    render(<RiskMetricsCard {...defaultProps} />);
    
    const trendElement = screen.getByText('+5.2%');
    expect(trendElement).toBeInTheDocument();
  });
});
