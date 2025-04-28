import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest'
import type { Mock } from 'vitest'
import FavouriteButton from './FavouriteButton'
import handleAddToFavourites from '../utils/addToFavourites'
vi.mock('../utils/addToFavourites')

describe('FavouriteButton', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

    it('renders as non-favourite by default (gray outline)', () => {
    render(<FavouriteButton id={1} />, { wrapper: MemoryRouter });
    const btn = screen.getByRole('button', { name: /add to favourites/i });

    // Check if the button is in the document
    expect(btn).toBeInTheDocument();
    expect(btn).not.toHaveAttribute("data-favourite");
    });

  it('renders as favourite when localStorage item is present', () => {
    const favs = { venues: { 1: true }, events: {} }
    localStorage.setItem('favourites', JSON.stringify(favs))
    render(<FavouriteButton id={1} />, { wrapper: MemoryRouter })
    const btn = screen.getByRole('button', { name: /add to favourites/i })
    // solid variant has a non-transparent background
    expect(btn).toHaveAttribute("data-favourite", "true");
  })

  it('reads initial favourite state for events when itemType="event"', () => {
    const favs = { venues: {}, events: { 2: true } }
    localStorage.setItem('favourites', JSON.stringify(favs));
    render(<FavouriteButton id={2} itemType="event" />, { wrapper: MemoryRouter });
    const btn = screen.getByRole('button', { name: /add to favourites/i });
    expect(btn).toHaveAttribute("data-favourite", "true");
  })
  it('toggles to favourite on click and calls handleAddToFavourites', async () => {
    (handleAddToFavourites as Mock).mockReturnValue(true);
    render(<FavouriteButton id={3} />, { wrapper: MemoryRouter })
    const btn = screen.getByRole('button', { name: /add to favourites/i })
    await userEvent.click(btn)
    expect(handleAddToFavourites).toHaveBeenCalledWith(3, 'venue')
    expect(btn).toHaveAttribute("data-favourite", "true");
  })
  it('toggles back to non-favourite on click and updates style', async () => {
    (handleAddToFavourites as Mock).mockReturnValue(false);
    // start as favourite
    const favs = { venues: { 4: true }, events: {} }
    localStorage.setItem('favourites', JSON.stringify(favs))
    render(<FavouriteButton id={4} />, { wrapper: MemoryRouter })
    const btn = screen.getByRole('button', { name: /add to favourites/i })
    expect(window.getComputedStyle(btn).backgroundColor).not.toBe('transparent');
    await userEvent.click(btn);
    expect(handleAddToFavourites).toHaveBeenCalledWith(4, 'venue');
    expect(btn).not.toHaveAttribute("data-favourite", "true");
  })

  it('responds to external favouritesUpdated event and syncs state', async () => {
    render(<FavouriteButton id={5} />, { wrapper: MemoryRouter })
    const btn = screen.getByRole('button', { name: /add to favourites/i })
    // initially non-favourite
    expect(btn).not.toHaveAttribute("data-favourite", "true");
    // simulate external update
    const newFavs = { venues: { 5: true }, events: {} }
    localStorage.setItem('favourites', JSON.stringify(newFavs))
    await act(async () => {
      window.dispatchEvent(new Event('favouritesUpdated'));
    });
    // after event, button should update to solid
    await screen.findByRole('button', { name: /add to favourites/i });
    expect(btn).toHaveAttribute("data-favourite", "true");
  });
})