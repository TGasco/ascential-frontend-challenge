import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Event from './Event';
import * as useSeatGeekModule from '../utils/useSeatGeek';
import { vi } from 'vitest';
import { formatDateTime } from '../utils/formatDateTime';

vi.mock('../utils/useSeatGeek');
vi.mock('./Breadcrumbs', () => ({
  default: ({ items }: any) => <nav data-testid="breadcrumbs">{items.map((i: any) => i.label).join(' > ')}</nav>
}));
vi.mock('./Error', () => ({
  default: () => <div data-testid="error">Error</div>
}));
// vi.mock('../utils/formatDateTime', async () => ({
//   formatDateTime: (date: Date | string, tz?: string) =>
//     tz ? `formatted(${String(date)},${tz})` : `formatted(${String(date)})`
// }));

const mockEvent = {
  short_title: 'Test Event',
  datetime_utc: new Date('2024-06-01T18:00:00Z'),
  venue: {
    name_v2: 'Test Venue',
    display_location: 'Test City, Country',
    timezone: 'America/New_York'
  },
  url: 'https://tickets.com/test'
};

function renderWithRouter(eventId = '123') {
  return render(
    <MemoryRouter initialEntries={[`/events/${eventId}`]}>
      <Routes>
        <Route path="/events/:eventId" element={<Event />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('Event component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading spinner while fetching', () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: null, error: null });
    renderWithRouter();
    expect(screen.getByTestId('chakra-spinner')).toBeInTheDocument();
  });

  it('renders error component on error', () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: null, error: new Error('fail') });
    renderWithRouter();
    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  it('renders event details when data is loaded', async () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: mockEvent, error: null });
    renderWithRouter();

    expect(await screen.findByText('Test Event')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Home > Events > Test Event');
    expect(screen.getByText('Venue')).toBeInTheDocument();
    expect(screen.getByText('Test Venue')).toBeInTheDocument();
    expect(screen.getByText('Test City, Country')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByTestId('date')).toHaveTextContent('June 1, 2024 at 2:00:00 PM EDT');
    expect(screen.getByRole('link', { name: /buy tickets/i })).toHaveAttribute('href', 'https://tickets.com/test');
  });

  it('shows tooltip with UTC date on hover over date', async () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: mockEvent, error: null });
    renderWithRouter();

    const date = screen.getByTestId('date');
    expect(date).toBeInTheDocument();

    // Compute expected UTC label
    const expectedUtcLabel = formatDateTime(mockEvent.datetime_utc);

    userEvent.hover(date);

    await waitFor(() => {
      const tooltip = screen.getByRole('tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent(expectedUtcLabel);
    });
  });

  it('renders correct breadcrumbs', async () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: mockEvent, error: null });
    renderWithRouter();
    expect(await screen.findByTestId('breadcrumbs')).toHaveTextContent('Home > Events > Test Event');
  });

  it('renders buy tickets button with correct link', async () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: mockEvent, error: null });
    renderWithRouter();
    const btn = await screen.findByRole('link', { name: /buy tickets/i });
    expect(btn).toHaveAttribute('href', mockEvent.url);
  });
});