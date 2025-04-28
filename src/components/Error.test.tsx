import { render, screen } from '@testing-library/react';
import Error from './Error';

describe('Error component', () => {
  it('renders without crashing', () => {
    render(<Error />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows the correct alert title', () => {
    render(<Error />);
    expect(screen.getByText('Problems loading the data')).toBeInTheDocument();
  });

  it('shows the correct alert description', () => {
    render(<Error />);
    expect(
      screen.getByText(
        /If the problem persists, try to refresh the page or wait a few minutes and try again./i,
      ),
    ).toBeInTheDocument();
  });

  it('has correct layout props on Flex', () => {
    render(<Error />);
    const flex = screen.getByRole('alert').parentElement;
    expect(flex).toHaveStyle({ width: '100%' });
  });

  it('Alert has correct status and styling props', () => {
    render(<Error />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('data-status', 'error');
    expect(alert).toHaveStyle({ textAlign: 'center' });
  });
});
