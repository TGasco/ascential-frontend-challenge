import React from 'react';
import { SimpleGrid, Flex, Spinner, Text } from '@chakra-ui/react';
import { useInfiniteScroll } from '../hooks/InfiniteScrollingHook';
import Error from './Error';
import { getSeatGeekUrl } from '../utils/useSeatGeek';

interface InfiniteGridProps<T, Q> {
  fetchPage: (page: number, query: Q) => Promise<{ items: T[]; hasMore: boolean }>;
  query: Q;
  renderItem: (item: T) => React.ReactNode;
  breadcrumbs: React.ReactNode;
  minChildWidth?: string;
}

export async function fetchAbstractPage<T>(
  endpoint: string,
  itemKey: string,
  page: number,
  query: Record<string, string>,
  perPage: string = '24',
): Promise<{ items: T[]; hasMore: boolean }> {
  const params = { ...query, page: page.toString(), per_page: perPage };
  const url = getSeatGeekUrl(endpoint, params);
  const res = await fetch(url);
  const data = await res.json();
  return {
    items: data[itemKey],
    hasMore: data[itemKey].length === Number(perPage),
  };
}

function InfiniteGrid<T, Q>({
  fetchPage,
  query,
  renderItem,
  breadcrumbs,
  minChildWidth = '350px',
}: InfiniteGridProps<T, Q>) {
  const { items, loading, error, hasMore, observerRef } = useInfiniteScroll<T, Q>({
    fetchPage,
    query,
  });

  return (
    <>
      {breadcrumbs}
      <SimpleGrid spacing="6" m="6" minChildWidth={minChildWidth}>
        {items.map(renderItem)}
      </SimpleGrid>
      <div ref={observerRef} />
      {loading && (
        <Flex justifyContent="center" alignItems="center" minHeight="50vh">
          <Spinner size="lg" data-testid="chakra-spinner" />
        </Flex>
      )}
      {error && <Error />}
      {!hasMore && <Text>No more items.</Text>}
    </>
  );
}

export default InfiniteGrid;
