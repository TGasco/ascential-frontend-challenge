import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Events from './Events';
import * as useSeatGeekModule from '../utils/useSeatGeek';
import { vi } from 'vitest';

vi.mock('../utils/useSeatGeek');
vi.mock('./Breadcrumbs', () => ({
  default: ({ items }: any) => <nav data-testid="breadcrumbs">{items.map((i: any) => i.label).join(' > ')}</nav>
}));
vi.mock('./Error', () => ({
  default: () => <div data-testid="error">Error</div>
}));
vi.mock('../utils/formatDateTime', () => ({
  formatDateTime: (date: Date | string, tz?: string) =>
    tz ? `formatted(${date},${tz})` : `formatted(${date})`
}));

const mockEvents = [
  {
    id: '1',
    short_title: 'Concert One',
    datetime_utc: '2024-06-01T20:00:00Z',
    performers: [{ image: 'img1.jpg' }],
    venue: {
      name_v2: 'Venue One',
      display_location: 'City One',
      timezone: 'America/New_York'
    }
  },
  {
    id: '2',
    short_title: 'Concert Two',
    datetime_utc: '2024-07-01T21:00:00Z',
    performers: [{ image: 'img2.jpg' }],
    venue: {
      name_v2: 'Venue Two',
      display_location: 'City Two',
      timezone: 'Europe/London'
    }
  }
];

describe('Events component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading spinner when data is not loaded', () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: null, error: null });
    render(<Events />, { wrapper: MemoryRouter });
    expect(screen.getByTestId('chakra-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('error')).not.toBeInTheDocument();
  });

  it('renders error component when error occurs', () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: null, error: new Error('fail') });
    render(<Events />, { wrapper: MemoryRouter });
    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders events grid and event items', async () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: { events: mockEvents }, error: null });
    render(<Events />, { wrapper: MemoryRouter });

    // Breadcrumbs
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Home > Events');

    // Event cards
    await waitFor(() => {
      expect(screen.getByText('Concert One')).toBeInTheDocument();
      expect(screen.getByText('Concert Two')).toBeInTheDocument();
    });

    // Venue and location
    expect(screen.getByText('Venue One')).toBeInTheDocument();
    expect(screen.getByText('City One')).toBeInTheDocument();
    expect(screen.getByText('Venue Two')).toBeInTheDocument();
    expect(screen.getByText('City Two')).toBeInTheDocument();

    // Images
    expect(screen.getAllByRole('img')[1]).toHaveAttribute('src', 'img2.jpg');

    // Date/time (formatted)
    expect(screen.getByText('formatted(2024-06-01T20:00:00Z,America/New_York)')).toBeInTheDocument();
    expect(screen.getByText('formatted(2024-07-01T21:00:00Z,Europe/London)')).toBeInTheDocument();
  });

  it('renders links to event details', () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: { events: mockEvents }, error: null });
    render(<Events />, { wrapper: MemoryRouter });

    const links = screen.getAllByRole('link');
    // There are two links per event: one in the heading, one in the date
    expect(links.some(link => link.getAttribute('href') === '/events/1')).toBe(true);
    expect(links.some(link => link.getAttribute('href') === '/events/2')).toBe(true);
  });

  it('renders Tooltip with correct label', async () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: { events: [mockEvents[0]] }, error: null });
    render(<Events />, { wrapper: MemoryRouter });

    // Tooltip label is rendered in the DOM as an attribute
    const tooltip = screen.getByText('formatted(2024-06-01T20:00:00Z,America/New_York)').closest('[role="tooltip"]');
    expect(screen.getByText('formatted(2024-06-01T20:00:00Z,America/New_York)')).toBeInTheDocument();
  });

  it('renders nothing if events array is empty', () => {
    (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: { events: [] }, error: null });
    render(<Events />, { wrapper: MemoryRouter });
    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});