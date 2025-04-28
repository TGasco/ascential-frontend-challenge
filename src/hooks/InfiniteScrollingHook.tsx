import { useState, useRef, useCallback, useEffect } from 'react';

interface InfiniteScrollOptions<T, Q> {
  fetchPage: (page: number, query: Q) => Promise<{ items: T[]; hasMore: boolean }>;
  query: Q;
  initialPage?: number;
}

export function useInfiniteScroll<T, Q = undefined>({
  fetchPage,
  query,
  initialPage = 1,
}: InfiniteScrollOptions<T, Q>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch next page
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    fetchPage(page, query)
      .then(({ items: newItems, hasMore: more }) => {
        setItems((prev) => [...prev, ...newItems]);
        setHasMore(more);
        setPage((prev) => prev + 1);
      })
      .catch((err) => setError(err))
      .finally(() => setLoading(false));
  }, [fetchPage, page, query, loading, hasMore]);

  // Intersection Observer with debounce
  useEffect(() => {
    if (!hasMore || loading) return;
    const node = observerRef.current;
    if (!node) return;

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          loadMore();
        }, 100);
      }
    };

    const observer = new IntersectionObserver(handleIntersect, { rootMargin: '200px' });
    observer.observe(node);
    return () => {
      observer.disconnect();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [loadMore, hasMore, loading]);

  return {
    items,
    loading,
    error,
    hasMore,
    observerRef,
    loadMore,
  };
}
