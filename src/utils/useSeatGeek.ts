import useSWR from 'swr';
import { fetcher } from './fetcher';

export function getSeatGeekUrl(path: string, options?: Record<string, string>) {
  const searchParams = new URLSearchParams({
    ...options,
    client_id: import.meta.env.VITE_APP_SEAT_GEEK_API_CLIENT,
    client_secret: import.meta.env.VITE_APP_SEAT_GEEK_API_KEY,
  });
  const SeatGeekApiBase = import.meta.env.VITE_SEATGEEK_API_URL;
  return `${SeatGeekApiBase}${path}?${searchParams.toString()}`;
}

export function useSeatGeek(path: string, options?: Record<string, string>) {
  const endpointUrl = getSeatGeekUrl(path, options);
  return useSWR(path ? endpointUrl : null, fetcher);
}