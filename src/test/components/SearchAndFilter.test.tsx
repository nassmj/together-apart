import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchAndFilter } from '../../components/SearchAndFilter';

describe('SearchAndFilter', () => {
  const mockOnSearch = vi.fn();
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search input with placeholder', () => {
    render(
      <SearchAndFilter
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );

    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('renders with custom placeholder', () => {
    render(
      <SearchAndFilter
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        placeholder="Custom placeholder"
      />
    );

    expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument();
  });

  it('debounces search input', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchAndFilter
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'test');

    // Should not call immediately
    expect(mockOnSearch).not.toHaveBeenCalledWith('test');

    // Should call after debounce delay
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('test');
    }, { timeout: 400 });
  });

  it('shows search suggestions when provided', async () => {
    const user = userEvent.setup();
    const suggestions = ['test suggestion 1', 'test suggestion 2'];
    
    render(
      <SearchAndFilter
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        searchSuggestions={suggestions}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.click(searchInput);

    expect(screen.getByText('test suggestion 1')).toBeInTheDocument();
    expect(screen.getByText('test suggestion 2')).toBeInTheDocument();
  });

  it('filters suggestions based on input', async () => {
    const user = userEvent.setup();
    const suggestions = ['apple', 'banana', 'cherry'];
    
    render(
      <SearchAndFilter
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        searchSuggestions={suggestions}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.click(searchInput);
    await user.type(searchInput, 'a');

    // Should show filtered suggestions
    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText('banana')).toBeInTheDocument();
    expect(screen.queryByText('cherry')).not.toBeInTheDocument();
  });

  it('fills search input when suggestion is clicked', async () => {
    const user = userEvent.setup();
    const suggestions = ['test suggestion'];
    
    render(
      <SearchAndFilter
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        searchSuggestions={suggestions}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.click(searchInput);
    
    const suggestion = screen.getByText('test suggestion');
    await user.click(suggestion);

    expect(searchInput).toHaveValue('test suggestion');
  });

  it('shows clear button when search has content', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchAndFilter
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'test');

    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
  });

  it('clears search when clear button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchAndFilter
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    await user.type(searchInput, 'test');

    const clearButton = screen.getByRole('button', { name: /clear/i });
    await user.click(clearButton);

    expect(searchInput).toHaveValue('');
  });

  it('toggles filter panel when filter button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchAndFilter
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );

    const filterButton = screen.getByText('Filters');
    await user.click(filterButton);

    expect(screen.getByText('Filter Options')).toBeInTheDocument();
  });

  it('applies filters when filter options are changed', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchAndFilter
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
      />
    );

    const filterButton = screen.getByText('Filters');
    await user.click(filterButton);

    const categorySelect = screen.getByLabelText('Category');
    await user.selectOptions(categorySelect, 'date');

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({
        category: 'date',
      })
    );
  });

  it('shows active filter indicators', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchAndFilter
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        filters={{ category: 'date' }}
      />
    );

    const filterButton = screen.getByText('Filters');
    await user.click(filterButton);

    expect(screen.getByText('Date Night')).toBeInTheDocument();
  });

  it('clears all filters when clear all is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <SearchAndFilter
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        filters={{ category: 'date' }}
      />
    );

    const clearAllButton = screen.getByText('Clear all');
    await user.click(clearAllButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith({});
  });

  it('applies custom className', () => {
    const customClass = 'custom-search-filter';
    
    render(
      <SearchAndFilter
        onSearch={mockOnSearch}
        onFilterChange={mockOnFilterChange}
        className={customClass}
      />
    );

    const container = screen.getByPlaceholderText('Search...').closest('div')?.parentElement;
    expect(container).toHaveClass(customClass);
  });
});








