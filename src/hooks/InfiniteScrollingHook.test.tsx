import { fireEvent } from "@testing-library/dom";
import { render, screen } from '@testing-library/react';
import { act } from "react";
import { vi } from "vitest";
import { useInfiniteScroll } from "./InfiniteScrollingHook";

describe('useInfiniteScroll', () => {
  let observeSpy: ReturnType<typeof vi.fn>
  let disconnectSpy: ReturnType<typeof vi.fn>
  let mockIOInstance: any
  let IntersectionObserverBackup: any

  beforeAll(() => {
    IntersectionObserverBackup = (global as any).IntersectionObserver
    observeSpy = vi.fn()
    disconnectSpy = vi.fn()
    ;(global as any).IntersectionObserver = class {
      constructor(public cb: IntersectionObserverCallback) {
        mockIOInstance = this
      }
      observe() {
        observeSpy()
      }
      disconnect() {
        disconnectSpy()
      }
    }
  })

  afterAll(() => {
    (global as any).IntersectionObserver = IntersectionObserverBackup
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.clearAllMocks()
  })

  const TestComponent = <T, Q extends unknown>(props: {
    fetchPage: (page: number, query: Q) => Promise<{ items: T[]; hasMore: boolean }>
    query: Q
    initialPage?: number
  }) => {
    const { items, loading, error, hasMore, observerRef, loadMore } = useInfiniteScroll<T, Q>(props)
    return (
      <>
        <div data-testid="observer" ref={observerRef} />
        <div data-testid="items">{items.join(',')}</div>
        <div data-testid="loading">{String(loading)}</div>
        <div data-testid="error">{error?.message ?? ''}</div>
        <div data-testid="hasMore">{String(hasMore)}</div>
        <button data-testid="load-btn" onClick={loadMore}>
          Load More
        </button>
      </>
    )
  }

  it('initializes with default values', () => {
    const mockFetch = vi.fn()
    render(<TestComponent fetchPage={mockFetch} query={null} />)
    expect(screen.getByTestId('items')).toHaveTextContent('');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
    expect(screen.getByTestId('error')).toHaveTextContent('');
    expect(screen.getByTestId('hasMore')).toHaveTextContent('true');
    expect(observeSpy).toHaveBeenCalledTimes(1);
  })

  it('loads items when loadMore is called manually', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ items: ['a', 'b'], hasMore: false })
    render(<TestComponent fetchPage={mockFetch} query="q" initialPage={5} />)
    await act(async () => {
      fireEvent.click(screen.getByTestId('load-btn'))
    })
    // fetchPage called with initialPage = 5
    expect(mockFetch).toHaveBeenCalledWith(5, 'q')
    // wait for promise resolution
    await act(async () => Promise.resolve())
    expect(screen.getByTestId('items')).toHaveTextContent('a,b')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
    expect(screen.getByTestId('hasMore')).toHaveTextContent('false')
  })

  it('handles fetch errors', async () => {
    const error = new Error('fail')
    const mockFetch = vi.fn().mockRejectedValue(error)
    render(<TestComponent fetchPage={mockFetch} query={0} />)
    await act(async () => {
      fireEvent.click(screen.getByTestId('load-btn'))
    })
    await act(async () => Promise.resolve())
    expect(screen.getByTestId('error')).toHaveTextContent('fail')
    expect(screen.getByTestId('loading')).toHaveTextContent('false')
  })

  it('automatically loads more when observed element intersects', async () => {
    const mockFetch = vi
      .fn()
      .mockResolvedValueOnce({ items: ['x'], hasMore: true })
      .mockResolvedValueOnce({ items: ['y'], hasMore: false })
    const { unmount } = render(<TestComponent fetchPage={mockFetch} query={42} />)
    // Observer should be set up
    expect(observeSpy).toHaveBeenCalledTimes(1);
    // simulate intersection
    await act(async () => {
      mockIOInstance.cb([{ isIntersecting: true } as any], mockIOInstance)
      vi.advanceTimersByTime(100)
    })
    await act(async () => Promise.resolve())
    expect(screen.getByTestId('items')).toHaveTextContent('x')
    // trigger second intersection
    await act(async () => {
      mockIOInstance.cb([{ isIntersecting: true } as any], mockIOInstance)
      vi.advanceTimersByTime(100)
    })
    await act(async () => Promise.resolve())
    expect(screen.getByTestId('items')).toHaveTextContent('x,y')
    expect(screen.getByTestId('hasMore')).toHaveTextContent('false')
    // observer should disconnect after unmount cleanup
    unmount()
    expect(disconnectSpy).toHaveBeenCalled()
  })
})