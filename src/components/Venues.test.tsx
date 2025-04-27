import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Venues, { VenueProps } from './Venues';
import * as useSeatGeekModule from '../utils/useSeatGeek';
import { vi } from 'vitest';

vi.mock('../utils/useSeatGeek');
vi.mock('./Breadcrumbs', () => ({
    default: ({ items }: any) => (
        <nav data-testid="breadcrumbs">
            {items.map((i: any) => i.label).join(' > ')}
        </nav>
    )
}));
vi.mock('./Error', () => ({
    default: () => <div data-testid="error">Error</div>
}));

const mockVenues: VenueProps[] = [
    {
        id: 1,
        has_upcoming_events: true,
        num_upcoming_events: 5,
        name_v2: 'Venue One',
        display_location: 'City A, Country A'
    },
    {
        id: 2,
        has_upcoming_events: false,
        num_upcoming_events: 0,
        name_v2: 'Venue Two',
        display_location: 'City B, Country B'
    }
];

describe('Venues component', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    it('shows a spinner while loading', () => {
        (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: null, error: null });
        render(<Venues />, { wrapper: MemoryRouter });
        expect(screen.getByTestId('chakra-spinner')).toBeInTheDocument();
        expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    });

    it('renders error component on error', () => {
        (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: null, error: new Error('oops') });
        render(<Venues />, { wrapper: MemoryRouter });
        expect(screen.getByTestId('error')).toBeInTheDocument();
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('renders breadcrumbs and no venue items when data.venues is empty', async () => {
        (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: { venues: [] }, error: null });
        render(<Venues />, { wrapper: MemoryRouter });
        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Home > Venues');
        // Wait a tick for possible items
        await waitFor(() => {
            expect(screen.queryAllByRole('link')).toHaveLength(0);
        });
    });

    it('renders a grid of venue items with correct details and links', async () => {
        (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: { venues: mockVenues }, error: null });
        render(<Venues />, { wrapper: MemoryRouter });

        // Breadcrumbs
        expect(screen.getByTestId('breadcrumbs')).toHaveTextContent('Home > Venues');

        // Venue One
        const linkOne = await screen.findByRole('link', { name: 'Venue One' });
        expect(linkOne).toBeInTheDocument();
        expect(linkOne).toHaveAttribute('href', '/venues/1');
        expect(screen.getByText('City A, Country A')).toBeInTheDocument();
        expect(screen.getByText('5 Upcoming Events')).toBeInTheDocument();

        // Venue Two
        const linkTwo = screen.getByRole('link', { name: 'Venue Two' });
        expect(linkTwo).toHaveAttribute('href', '/venues/2');
        expect(screen.getByText('City B, Country B')).toBeInTheDocument();
        expect(screen.getByText('No Upcoming Events')).toBeInTheDocument();

        // Total links should match number of venues
        expect(screen.getAllByRole('link')).toHaveLength(2);
    });

    it('renders the FavouriteButton component for each venue', async () => {
        (useSeatGeekModule.useSeatGeek as any).mockReturnValue({ data: { venues: mockVenues }, error: null });
        render(<Venues />, { wrapper: MemoryRouter });

        const favouriteButtons = await screen.findAllByRole('button', { name: /favourite/i });
        expect(favouriteButtons).toHaveLength(mockVenues.length);
    });
});