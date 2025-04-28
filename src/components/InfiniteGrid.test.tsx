import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, Mock } from 'vitest';
import InfiniteGrid, { fetchAbstractPage } from './InfiniteGrid';
import { useInfiniteScroll } from '../hooks/InfiniteScrollingHook';

vi.mock('../hooks/InfiniteScrollingHook');
vi.mock('./Error', () => ({
  __esModule: true,
  default: () => <div data-testid="error-component" />,
}));

const mockUseInfiniteScroll = useInfiniteScroll as unknown as Mock;

describe('InfiniteGrid component', () => {
  const breadcrumbs = <nav data-testid="breadcrumbs">crumbs</nav>;
  const renderItem = (item: string) => (
    <div key={item} data-testid="item-{item}">
      {item}
    </div>
  );
  const dummyFetchPage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumbs and items when loaded', () => {
    mockUseInfiniteScroll.mockReturnValue({
      items: ['one', 'two'],
      loading: false,
      error: false,
      hasMore: true,
      observerRef: React.createRef<HTMLDivElement>(),
    });

    render(
      <InfiniteGrid
        fetchPage={dummyFetchPage}
        query={{}}
        renderItem={renderItem}
        breadcrumbs={breadcrumbs}
      />,
    );

    expect(screen.getByTestId('breadcrumbs')).toBeInTheDocument();
    expect(screen.getByText('one')).toBeInTheDocument();
    expect(screen.getByText('two')).toBeInTheDocument();
    expect(screen.queryByTestId('chakra-spinner')).toBeNull();
    expect(screen.queryByTestId('error-component')).toBeNull();
    expect(screen.queryByText('No more items.')).toBeNull();
  });

  it('shows spinner when loading', () => {
    mockUseInfiniteScroll.mockReturnValue({
      items: [],
      loading: true,
      error: false,
      hasMore: true,
      observerRef: React.createRef<HTMLDivElement>(),
    });

    render(
      <InfiniteGrid
        fetchPage={dummyFetchPage}
        query={{}}
        renderItem={renderItem}
        breadcrumbs={breadcrumbs}
      />,
    );

    expect(screen.getByTestId('chakra-spinner')).toBeInTheDocument();
  });

  it('shows error component when error occurs', () => {
    mockUseInfiniteScroll.mockReturnValue({
      items: [],
      loading: false,
      error: true,
      hasMore: true,
      observerRef: React.createRef<HTMLDivElement>(),
    });

    render(
      <InfiniteGrid
        fetchPage={dummyFetchPage}
        query={{}}
        renderItem={renderItem}
        breadcrumbs={breadcrumbs}
      />,
    );

    expect(screen.getByTestId('error-component')).toBeInTheDocument();
  });

  it('shows "No more items." when hasMore is false', () => {
    mockUseInfiniteScroll.mockReturnValue({
      items: ['last'],
      loading: false,
      error: false,
      hasMore: false,
      observerRef: React.createRef<HTMLDivElement>(),
    });

    render(
      <InfiniteGrid
        fetchPage={dummyFetchPage}
        query={{}}
        renderItem={renderItem}
        breadcrumbs={breadcrumbs}
      />,
    );

    expect(screen.getByText('last')).toBeInTheDocument();
    expect(screen.getByText('No more items.')).toBeInTheDocument();
  });

  it('does not call fetchAbstractPage when rendering component', () => {
    // ensures fetchAbstractPage is independent
    const spy = vi.spyOn(global, 'fetch');
    mockUseInfiniteScroll.mockReturnValue({
      items: [],
      loading: false,
      error: false,
      hasMore: false,
      observerRef: React.createRef<HTMLDivElement>(),
    });

    render(
      <InfiniteGrid
        fetchPage={dummyFetchPage}
        query={{ term: 'test' }}
        renderItem={renderItem}
        breadcrumbs={breadcrumbs}
      />,
    );

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('fetchAbstractPage util', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('fetches data and returns items and hasMore true when full page', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ dataKey: ['x', 'y', 'z'] }),
    } as any);

    const result = await fetchAbstractPage('endpoint', 'dataKey', 1, { q: '1' }, '3');
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('endpoint'));
    expect(result.items).toEqual(['x', 'y', 'z']);
    expect(result.hasMore).toBe(true);
  });

  it('returns hasMore false when fewer items than perPage', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ dataKey: ['only'] }),
    } as any);

    const result = await fetchAbstractPage('ep', 'dataKey', 2, { a: 'b' }, '10');
    expect(result.items).toEqual(['only']);
    expect(result.hasMore).toBe(false);
  });
});
