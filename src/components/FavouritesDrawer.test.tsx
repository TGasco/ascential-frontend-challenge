import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import FavouritesDrawer from './FavouritesDrawer';

describe('FavouritesDrawer', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    mockOnClose.mockClear();
  });

  it('renders the drawer with no favourites', () => {
    render(<FavouritesDrawer isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Favourites')).toBeInTheDocument();
    expect(screen.getByText('No favourites found')).toBeInTheDocument();
  });

  it('renders the drawer with event favourites', () => {
    localStorage.setItem('favourites', JSON.stringify({ events: { 1: true }, venues: {} }));
    window.dispatchEvent(new Event('favouritesUpdated'));

    render(<FavouritesDrawer isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Favourites')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
  });

  it('renders the drawer with venue favourites', () => {
    localStorage.setItem('favourites', JSON.stringify({ events: {}, venues: { 1: true } }));
    window.dispatchEvent(new Event('favouritesUpdated'));

    render(<FavouritesDrawer isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Favourites')).toBeInTheDocument();
    expect(screen.getByText('Venues')).toBeInTheDocument();
  });

  it('renders the drawer with both event and venue favourites', () => {
    localStorage.setItem(
      'favourites',
      JSON.stringify({ events: { 1: true }, venues: { 2: true } }),
    );
    window.dispatchEvent(new Event('favouritesUpdated'));

    render(<FavouritesDrawer isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Favourites')).toBeInTheDocument();
    expect(screen.getByText('Events')).toBeInTheDocument();
    expect(screen.getByText('Venues')).toBeInTheDocument();
  });

  it('calls onClose when the close button is clicked', () => {
    render(<FavouritesDrawer isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('syncs favourites when the "favouritesUpdated" event is triggered', () => {
    localStorage.setItem('favourites', JSON.stringify({ events: { 1: true }, venues: {} }));

    render(<FavouritesDrawer isOpen={true} onClose={mockOnClose} />);

    expect(screen.findByText('Events'));

    localStorage.setItem('favourites', JSON.stringify({ events: {}, venues: { 2: true } }));
    window.dispatchEvent(new Event('favouritesUpdated'));

    expect(screen.findByText('Venues'));
    expect(screen.findByText('Events')).toStrictEqual(Promise.resolve(null));
  });

  it('displays a spinner while loading favourites data', () => {
    render(<FavouritesDrawer isOpen={true} onClose={mockOnClose} />);

    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
