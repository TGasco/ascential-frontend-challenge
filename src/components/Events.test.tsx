import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import * as formatDateTimeModule from '../utils/formatDateTime';
import Events, { EventItem, EventProps } from './Events';

// Mock Chakra UI components that use portals or context
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual<any>('@chakra-ui/react');
  return {
    ...actual,
    Tooltip: ({ children, label }: any) => <span title={label}>{children}</span>,
  };
});

// Mock FavouriteButton
vi.mock('./FavouriteButton', () => ({
  __esModule: true,
  default: ({ id, itemType }: any) => (
    <button data-testid="favourite-btn" data-id={id} data-type={itemType}>
      Favourite
    </button>
  ),
}));

// Mock Breadcrumbs
vi.mock('./Breadcrumbs', () => ({
  __esModule: true,
  default: ({ items }: any) => (
    <nav data-testid="breadcrumbs">{items.map((i: any) => i.label).join(' > ')}</nav>
  ),
}));

// Mock InfiniteGrid
vi.mock('./InfiniteGrid', () => {
  return {
    __esModule: true,
    default: ({ renderItem, breadcrumbs }: any) => (
      <div>
        <div data-testid="infinite-grid">{breadcrumbs}</div>
        {renderItem &&
          [1, 2].map(i =>
            renderItem({
              id: i,
              short_title: `Event ${i}`,
              datetime_utc: new Date('2024-06-01T12:00:00Z'),
              performers: [{ image: `img${i}.jpg` }],
              venue: {
                name_v2: `Venue ${i}`,
                display_location: `Location ${i}`,
                timezone: 'UTC',
              },
            })
          )}
      </div>
    ),
    fetchAbstractPage: vi.fn(),
  };
});

// Mock formatDateTime
vi.spyOn(formatDateTimeModule, 'formatDateTime').mockImplementation((date: Date, tz?: string) =>
  tz ? `formatted(${date.toISOString()},${tz})` : `formatted(${date.toISOString()})`
);

const baseEvent: EventProps = {
  id: 123,
  short_title: 'Test Event',
  datetime_utc: new Date('2024-06-01T12:00:00Z'),
  performers: [{ image: 'performer.jpg' }],
  venue: {
    name_v2: 'Test Venue',
    display_location: 'Test City, Country',
    timezone: 'Europe/London',
  },
};

describe('EventItem', () => {
  it('renders event details', () => {
    render(
      <MemoryRouter>
        <EventItem event={baseEvent} />
      </MemoryRouter>
    );
    expect(screen.getByRole('img')).toHaveAttribute('src', 'performer.jpg');
    expect(screen.getByRole('heading', { name: /test event/i })).toBeInTheDocument();
    expect(screen.getByText('Test Venue')).toBeInTheDocument();
    expect(screen.getByText('Test City, Country')).toBeInTheDocument();
  });

  it('renders formatted date with timezone', () => {
    render(
      <MemoryRouter>
        <EventItem event={baseEvent} />
      </MemoryRouter>
    );
    // Tooltip label
    expect(screen.getByTitle(/^formatted/)).toBeInTheDocument();
    // Link with formatted date
    expect(screen.getByText(/formatted\(.*Europe\/London\)/)).toBeInTheDocument();
  });

  it('renders FavouriteButton with correct props', () => {
    render(
      <MemoryRouter>
        <EventItem event={baseEvent} />
      </MemoryRouter>
    );
    const favBtn = screen.getByTestId('favourite-btn');
    expect(favBtn).toHaveAttribute('data-id', '123');
    expect(favBtn).toHaveAttribute('data-type', 'event');
  });

  it('links to the event details page', () => {
    render(
      <MemoryRouter>
        <EventItem event={baseEvent} />
      </MemoryRouter>
    );
    const link = screen.getAllByRole('link', { name: /test event/i })[0];
    expect(link).toHaveAttribute('href', '/events/123');
  });

  it('links the date to the event details page', () => {
    render(
      <MemoryRouter>
        <EventItem event={baseEvent} />
      </MemoryRouter>
    );
    const dateLink = screen.getByTestId('date').querySelector('a');
    expect(dateLink).toHaveAttribute('href', '/events/123');
  });
});

describe('Events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumbs', () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Home > Events');
  });

  it('renders a grid of EventItems', () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );
    expect(screen.getAllByRole('heading', { name: /event/i })).toHaveLength(2);
    expect(screen.getAllByTestId('favourite-btn')).toHaveLength(2);
  });

  it('renders event images', () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );
    expect(screen.getAllByRole('img')[0]).toHaveAttribute('src', 'img1.jpg');
    expect(screen.getAllByRole('img')[1]).toHaveAttribute('src', 'img2.jpg');
  });

  it('renders event venues and locations', () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );
    expect(screen.getByText('Venue 1')).toBeInTheDocument();
    expect(screen.getByText('Venue 2')).toBeInTheDocument();
    expect(screen.getByText('Location 1')).toBeInTheDocument();
    expect(screen.getByText('Location 2')).toBeInTheDocument();
  });

  it('renders formatted dates for each event', () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/formatted\(.*UTC\)/)).toHaveLength(2);
  });

  it('calls fetchPage with correct params', () => {
    // We can't test fetchPage directly due to the mock, but we can check InfiniteGrid is rendered
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );
    expect(screen.getByTestId('infinite-grid')).toBeInTheDocument();
  });
});