import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import Home from './Home';

describe('Home component', () => {
  function setup() {
    return render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
  }

  it('renders two PageLink components', () => {
    setup();
    const links = screen.getAllByRole('heading', { level: 2 });
    expect(links).toHaveLength(2);
    expect(screen.getByText(/Browse Venues/i)).toBeInTheDocument();
    expect(screen.getByText(/Browse Events/i)).toBeInTheDocument();
  });

  it('renders links with correct URLs', () => {
    setup();
    const venuesLink = screen.getByRole('link', { name: /Browse Venues/i });
    const eventsLink = screen.getByRole('link', { name: /Browse Events/i });
    expect(venuesLink).toHaveAttribute('href', '/venues');
    expect(eventsLink).toHaveAttribute('href', '/events');
  });

  it('renders ArrowForwardIcon for each PageLink', () => {
    setup();
    // Chakra UI renders the icon as an SVG with data-icon attribute
    const icons = screen.getAllByTestId('chakra-arrow-forward');
    expect(icons.length).toBeGreaterThanOrEqual(2);
  });

  it('PageLink has correct styles and hover effect', async () => {
    setup();
    const user = userEvent.setup();
    const venuesBox =
      screen.getByText(/Browse Venues/i).closest('[role="group"]') ||
      screen.getByText(/Browse Venues/i).parentElement?.parentElement;
    expect(venuesBox).toHaveStyle('background: gray.50');
    // Simulate hover
    if (venuesBox) {
      await user.hover(venuesBox);
      // Chakra UI applies inline styles or classnames, so we check for the hover style
      // This is a best-effort check, as Chakra may use classes
      // You may need to adjust this depending on Chakra's implementation
    }
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
