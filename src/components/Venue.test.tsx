import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Venue from './Venue';
import * as useSeatGeekModule from '../utils/useSeatGeek';
import { vi } from 'vitest';

// filepath: /Users/thomasgascoyne/Library/Mobile Documents/com~apple~CloudDocs/Jobs/Informa-Technical/ascential-frontend-challenge/src/components/Venue.test.tsx

vi.mock('../utils/useSeatGeek');
vi.mock('./Breadcrumbs', () => ({
  default: ({ items }: any) => (
    <nav data-testid="breadcrumbs">{items.map((i: any) => i.label).join(' > ')}</nav>
  ),
}));
vi.mock('./Error', () => ({
  default: () => <div data-testid="error">Error</div>,
}));

const mockVenue = {
  name: 'Test Venue',
  city: 'Test City',
  country: 'Test Country',
  capacity: 12345,
  location: { lat: 51.5, lon: -0.1 },
};

function renderWithRouter(venueId = '456') {
  return render(
    <MemoryRouter initialEntries={[`/venues/${venueId}`]}>
      <Routes>
        <Route path="/venues/:venueId" element={<Venue />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('Venue component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading spinner while fetching', () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: null, error: null });
    renderWithRouter();
    expect(screen.getByTestId('chakra-spinner')).toBeInTheDocument();
  });

  it('renders error component on error', () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({
      data: null,
      error: new Error('fail'),
    });
    renderWithRouter();
    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  it('renders venue details when data is loaded', async () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: mockVenue, error: null });
    renderWithRouter();

    expect(await screen.findByText('Test Venue')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Home > Venues > Test Venue');
    expect(screen.getByText('Location')).toBeInTheDocument();
    expect(screen.getByText('Test City')).toBeInTheDocument();
    expect(screen.getByText('Test Country')).toBeInTheDocument();
    expect(screen.getByText('Capacity')).toBeInTheDocument();
    expect(screen.getByText('12345')).toBeInTheDocument();
  });

  it('does not render capacity stat if capacity is 0', async () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({
      data: { ...mockVenue, capacity: 0 },
      error: null,
    });
    renderWithRouter();
    expect(await screen.findByText('Test Venue')).toBeInTheDocument();
    expect(screen.queryByText('Capacity')).not.toBeInTheDocument();
  });

  it('renders map iframe with correct src', async () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: mockVenue, error: null });
    renderWithRouter();
    // fallback: querySelector for iframe
    const map = document.querySelector('iframe');
    expect(map).toBeInTheDocument();
    expect(map).toHaveAttribute(
      'src',
      `https://maps.google.com/maps?q=${mockVenue.location.lat},${mockVenue.location.lon}&z=15&output=embed`,
    );
  });

  it('renders correct breadcrumbs', async () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: mockVenue, error: null });
    renderWithRouter();
    expect(await screen.findByTestId('breadcrumbs')).toHaveTextContent(
      'Home > Venues > Test Venue',
    );
  });

  it('renders heading with venue name', async () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: mockVenue, error: null });
    renderWithRouter();
    expect(await screen.findByRole('heading', { name: /test venue/i })).toBeInTheDocument();
  });

  it('renders the favourite button', async () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: mockVenue, error: null });
    renderWithRouter();
    expect(await screen.findByRole('button', { name: /add to favourites/i })).toBeInTheDocument();
  });
});
