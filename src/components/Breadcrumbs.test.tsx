import { render, screen } from '@testing-library/react';
import Breadcrumbs from './Breadcrumbs';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

describe('Breadcrumbs', () => {
  const items = [
    { label: 'Home', to: '/' },
    { label: 'Category', to: '/category' },
    { label: 'Product' },
  ];

  it('renders all breadcrumb items', () => {
    render(
      <MemoryRouter>
        <Breadcrumbs items={items} />
      </MemoryRouter>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Product')).toBeInTheDocument();
  });

  it('renders links for all but the last breadcrumb', () => {
    render(
      <MemoryRouter>
        <Breadcrumbs items={items} />
      </MemoryRouter>
    );
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/');
    expect(links[1]).toHaveAttribute('href', '/category');
    expect(screen.getByText('Product').closest('a')).toBeNull();
  });

  it('marks only the last breadcrumb as current page', () => {
    render(
      <MemoryRouter>
        <Breadcrumbs items={items} />
      </MemoryRouter>
    );
    const current = screen.getByText('Product').closest('[aria-current]');
    expect(current).toBeTruthy();
    expect(current).toHaveAttribute('aria-current', 'page');
    expect(screen.getByText('Home').closest('[aria-current]')).toBeNull();
    expect(screen.getByText('Category').closest('[aria-current]')).toBeNull();
  });

  it('renders separator icons between items', () => {
    render(
      <MemoryRouter>
        <Breadcrumbs items={items} />
      </MemoryRouter>
    );
    // There should be separators between items.length - 1
    const separators = screen.getAllByTestId('chakra-breadcrumb-separator');
    expect(separators).toHaveLength(items.length - 1);
  });

  it('renders correctly with a single breadcrumb', () => {
    render(
      <MemoryRouter>
        <Breadcrumbs items={[{ label: 'Only' }]} />
      </MemoryRouter>
    );
    expect(screen.getByText('Only')).toBeInTheDocument();
    expect(screen.queryByRole('link')).toBeNull();
    const current = screen.getByText('Only').closest('[aria-current]');
    expect(current).toBeTruthy();
    expect(current).toHaveAttribute('aria-current', 'page');
  });

  it('renders no BreadcrumbItem components if items is empty', () => {
    render(
      <MemoryRouter>
        <Breadcrumbs items={[]} />
      </MemoryRouter>
    );
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('renders correctly when all items have "to" property', () => {
    const allLinks = [
      { label: 'A', to: '/a' },
      { label: 'B', to: '/b' },
      { label: 'C', to: '/c' },
    ];
    render(
      <MemoryRouter>
        <Breadcrumbs items={allLinks} />
      </MemoryRouter>
    );
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(screen.getByText('C').closest('a')).toBeNull();
  });
});