import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionSteps from '../onboarding/ActionSteps';

// Mock the Material-UI components and icons
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  Dialog: ({ children, open, onClose }) => open ? <div data-testid="dialog">{children}</div> : null,
  DialogTitle: ({ children }) => <div data-testid="dialog-title">{children}</div>,
  DialogContent: ({ children }) => <div data-testid="dialog-content">{children}</div>,
  DialogActions: ({ children }) => <div data-testid="dialog-actions">{children}</div>,
}));

jest.mock('@mui/icons-material', () => ({
  Add: () => <span data-testid="add-icon">Add</span>,
  Edit: () => <span data-testid="edit-icon">Edit</span>,
  Delete: () => <span data-testid="delete-icon">Delete</span>,
  Assignment: () => <span data-testid="assignment-icon">Assignment</span>,
}));

describe('ActionSteps Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('renders without crashing', () => {
    render(<ActionSteps onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    expect(screen.getByText('Action Steps & Risk Mitigation')).toBeInTheDocument();
    expect(screen.getByText('Action Steps Summary')).toBeInTheDocument();
    expect(screen.getByText('Your Action Steps')).toBeInTheDocument();
  });

  it('shows empty state when no action steps exist', () => {
    render(<ActionSteps onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    expect(screen.getByText('No action steps defined yet')).toBeInTheDocument();
    expect(screen.getByText('Add Your First Action')).toBeInTheDocument();
  });

  it('displays action steps summary correctly', () => {
    const mockActionSteps = [
      { id: 1, text: 'Test Action 1', status: 'pending', priority: 'high' },
      { id: 2, text: 'Test Action 2', status: 'completed', priority: 'medium' }
    ];

    render(<ActionSteps data={mockActionSteps} onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    // Check for specific labels to avoid ambiguity
    expect(screen.getByText('Total Actions')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    
    // Check that action steps are displayed
    expect(screen.getByText('Test Action 1')).toBeInTheDocument();
    expect(screen.getByText('Test Action 2')).toBeInTheDocument();
  });

  it('opens add action dialog when Add Action button is clicked', () => {
    render(<ActionSteps onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    const addButton = screen.getByText('Add Action');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('Add New Action Step')).toBeInTheDocument();
  });

  it('opens templates dialog when Use Templates button is clicked', () => {
    render(<ActionSteps onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    const templatesButton = screen.getByText('Use Templates');
    fireEvent.click(templatesButton);
    
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByText('Use Action Templates')).toBeInTheDocument();
  });

  it('displays action templates correctly', () => {
    render(<ActionSteps onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    const templatesButton = screen.getByText('Use Templates');
    fireEvent.click(templatesButton);
    
    expect(screen.getByText('Supply Chain Risk')).toBeInTheDocument();
    expect(screen.getByText('Cybersecurity Risk')).toBeInTheDocument();
    expect(screen.getByText('Compliance & Regulatory')).toBeInTheDocument();
    expect(screen.getByText('Geopolitical Risk')).toBeInTheDocument();
  });

  it('calls onSubmit when Continue button is clicked', () => {
    render(<ActionSteps onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    const continueButton = screen.getByText('Complete Setup');
    fireEvent.click(continueButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith([]);
  });

  it('calls onSubmit with empty array when Skip for Now is clicked', () => {
    render(<ActionSteps onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    const skipButton = screen.getByText('Skip for Now');
    fireEvent.click(skipButton);
    
    expect(mockOnSubmit).toHaveBeenCalledWith([]);
  });

  it('saves action steps to localStorage', async () => {
    const mockActionSteps = [
      { id: 1, text: 'Test Action', status: 'pending', priority: 'high' }
    ];

    render(<ActionSteps data={mockActionSteps} onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    await waitFor(() => {
      const savedData = localStorage.getItem('onboarding_action_steps');
      expect(savedData).toBeTruthy();
      
      const parsed = JSON.parse(savedData);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].text).toBe('Test Action');
    });
  });

  it('loads action steps from localStorage on mount', () => {
    const mockActionSteps = [
      { id: 1, text: 'Saved Action', status: 'pending', priority: 'high' }
    ];
    
    localStorage.setItem('onboarding_action_steps', JSON.stringify(mockActionSteps));
    
    render(<ActionSteps onSubmit={mockOnSubmit} onError={mockOnError} />);
    
    expect(screen.getByText('Saved Action')).toBeInTheDocument();
  });
});
