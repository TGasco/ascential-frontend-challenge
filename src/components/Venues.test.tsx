import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Venues from './Venues';

// filepath: /Users/thomasgascoyne/Library/Mobile Documents/com~apple~CloudDocs/Jobs/Informa-Technical/ascential-frontend-challenge/src/components/Venues.test.tsx

// Mock Chakra UI components that use portals or context
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual<any>('@chakra-ui/react');
  return {
    ...actual,
    Badge: ({ children, ...props }: any) => (
      <span data-testid="badge" {...props}>
        {children}
      </span>
    ),
    LinkBox: ({ children }: any) => <div data-testid="linkbox">{children}</div>,
    LinkOverlay: ({ children, ...props }: any) => <a {...props}>{children}</a>,
    Box: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Flex: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Heading: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  };
});

// Mock FavouriteButton
const favBtnMock = vi.fn();
vi.mock('./FavouriteButton', () => ({
  __esModule: true,
  default: ({ id }: any) => (
    <button data-testid="favourite-btn" data-id={id} onClick={() => favBtnMock(id)}>
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
const renderItemMock = vi.fn();
vi.mock('./InfiniteGrid', () => {
  return {
    __esModule: true,
    default: ({ renderItem, breadcrumbs }: any) => (
      <div>
        <div data-testid="infinite-grid">{breadcrumbs}</div>
        {renderItem &&
          [
            {
              id: 1,
              has_upcoming_events: true,
              num_upcoming_events: 5,
              name_v2: 'Venue Alpha',
              display_location: 'Alpha City, Country',
            },
            {
              id: 2,
              has_upcoming_events: false,
              num_upcoming_events: 0,
              name_v2: 'Venue Beta',
              display_location: 'Beta City, Country',
            },
          ].map((venue: any) => {
            renderItemMock(venue);
            return renderItem(venue);
          })}
      </div>
    ),
    fetchAbstractPage: vi.fn(),
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  favBtnMock.mockClear();
  renderItemMock.mockClear();
});

describe('Venues component', () => {
  it('renders breadcrumbs', () => {
    render(
      <MemoryRouter>
        <Venues />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Home > Venues');
  });

  it('renders InfiniteGrid and VenueItems', () => {
    render(
      <MemoryRouter>
        <Venues />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('infinite-grid')).toBeInTheDocument();
    // Should render two VenueItems
    expect(screen.getAllByTestId('linkbox')).toHaveLength(2);
  });

  it('calls renderItem for each venue', () => {
    render(
      <MemoryRouter>
        <Venues />
      </MemoryRouter>,
    );
    expect(renderItemMock).toHaveBeenCalledTimes(2);
    expect(renderItemMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 1, name_v2: 'Venue Alpha' }),
    );
    expect(renderItemMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 2, name_v2: 'Venue Beta' }),
    );
  });
});

describe('VenueItem UI', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Venues />
      </MemoryRouter>,
    );
  });

  it('renders venue location', () => {
    expect(screen.getByText('Alpha City, Country')).toBeInTheDocument();
    expect(screen.getByText('Beta City, Country')).toBeInTheDocument();
  });

  it('renders badge with correct text for venues with upcoming events', () => {
    const badges = screen.getAllByTestId('badge');
    expect(badges[0]).toHaveTextContent('5 Upcoming Events');
    expect(badges[1]).toHaveTextContent('No Upcoming Events');
  });

  it('renders FavouriteButton with correct id', () => {
    const favBtns = screen.getAllByTestId('favourite-btn');
    expect(favBtns[0]).toHaveAttribute('data-id', '1');
    expect(favBtns[1]).toHaveAttribute('data-id', '2');
  });

  it('calls FavouriteButton on click', () => {
    const favBtns = screen.getAllByTestId('favourite-btn');
    fireEvent.click(favBtns[0]);
    expect(favBtnMock).toHaveBeenCalledWith(1);
    fireEvent.click(favBtns[1]);
    expect(favBtnMock).toHaveBeenCalledWith(2);
  });

  it('applies hover style to venue box', () => {
    // Chakra UI _hover is not applied in this mock, but we can check the prop exists
    const boxes = screen.getAllByTestId('linkbox');
    expect(boxes[0].querySelector('div')).toHaveAttribute('_hover', '[object Object]');
  });
});
