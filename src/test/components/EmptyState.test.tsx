import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState, MemoriesEmptyState, ActivitiesEmptyState } from '../../components/EmptyState';

describe('EmptyState', () => {
  it('renders with default props', () => {
    render(<EmptyState type="memories" />);
    
    expect(screen.getByText('No memories yet')).toBeInTheDocument();
    expect(screen.getByText(/Start capturing your special moments/)).toBeInTheDocument();
    expect(screen.getByText('Add First Memory')).toBeInTheDocument();
  });

  it('renders with custom title and description', () => {
    const customTitle = 'Custom Title';
    const customDescription = 'Custom description text';
    
    render(
      <EmptyState
        type="memories"
        title={customTitle}
        description={customDescription}
      />
    );
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customDescription)).toBeInTheDocument();
  });

  it('calls onAction when action button is clicked', () => {
    const mockOnAction = vi.fn();
    
    render(<EmptyState type="memories" onAction={mockOnAction} />);
    
    const actionButton = screen.getByText('Add First Memory');
    fireEvent.click(actionButton);
    
    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when onAction is not provided', () => {
    render(<EmptyState type="memories" />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders without illustration when showIllustration is false', () => {
    render(<EmptyState type="memories" showIllustration={false} />);
    
    // The illustration should not be present
    const illustration = screen.queryByText('💕');
    expect(illustration).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    const customClass = 'custom-empty-state';
    
    render(<EmptyState type="memories" className={customClass} />);
    
    const container = screen.getByText('No memories yet').closest('div');
    expect(container).toHaveClass(customClass);
  });

  it('renders different types with correct content', () => {
    const { rerender } = render(<EmptyState type="activities" />);
    expect(screen.getByText('No activities planned')).toBeInTheDocument();
    
    rerender(<EmptyState type="quests" />);
    expect(screen.getByText('No quests yet')).toBeInTheDocument();
    
    rerender(<EmptyState type="discoveries" />);
    expect(screen.getByText('Your exchange is empty')).toBeInTheDocument();
    
    rerender(<EmptyState type="connections" />);
    expect(screen.getByText('No connections yet')).toBeInTheDocument();
    
    rerender(<EmptyState type="general" />);
    expect(screen.getByText('Nothing here yet')).toBeInTheDocument();
  });
});

describe('MemoriesEmptyState', () => {
  it('renders with memories-specific content', () => {
    const mockOnAddMemory = vi.fn();
    
    render(<MemoriesEmptyState onAddMemory={mockOnAddMemory} />);
    
    expect(screen.getByText('No memories yet')).toBeInTheDocument();
    expect(screen.getByText(/Start capturing your special moments/)).toBeInTheDocument();
    expect(screen.getByText('Add First Memory')).toBeInTheDocument();
  });

  it('calls onAddMemory when action button is clicked', () => {
    const mockOnAddMemory = vi.fn();
    
    render(<MemoriesEmptyState onAddMemory={mockOnAddMemory} />);
    
    const actionButton = screen.getByText('Add First Memory');
    fireEvent.click(actionButton);
    
    expect(mockOnAddMemory).toHaveBeenCalledTimes(1);
  });
});

describe('ActivitiesEmptyState', () => {
  it('renders with activities-specific content', () => {
    const mockOnAddActivity = vi.fn();
    
    render(<ActivitiesEmptyState onAddActivity={mockOnAddActivity} />);
    
    expect(screen.getByText('No activities planned')).toBeInTheDocument();
    expect(screen.getByText(/Plan your next adventure/)).toBeInTheDocument();
    expect(screen.getByText('Plan Activity')).toBeInTheDocument();
  });

  it('calls onAddActivity when action button is clicked', () => {
    const mockOnAddActivity = vi.fn();
    
    render(<ActivitiesEmptyState onAddActivity={mockOnAddActivity} />);
    
    const actionButton = screen.getByText('Plan Activity');
    fireEvent.click(actionButton);
    
    expect(mockOnAddActivity).toHaveBeenCalledTimes(1);
  });
});








