import useSWR from 'swr';
import { fetcher } from './fetcher';

export function getSeatGeekUrl(path: string, options?: Record<string, string | string[]>) {
  const searchParams = new URLSearchParams();

  searchParams.append('client_id', import.meta.env.VITE_APP_SEAT_GEEK_API_CLIENT);
  searchParams.append('client_secret', import.meta.env.VITE_APP_SEAT_GEEK_API_KEY);

  // Allow for multiple values for the same key
  if (options) {
    for (const [key, value] of Object.entries(options)) {
      if (Array.isArray(value)) {
        value.forEach((v) => searchParams.append(key, v));
      } else {
        searchParams.append(key, value);
      }
    }
  }

  const SeatGeekApiBase = import.meta.env.VITE_SEATGEEK_API_URL;
  return `${SeatGeekApiBase}${path}?${searchParams.toString()}`;
}

export function useSeatGeek(path: string, options?: Record<string, string | string[]>) {
  const endpointUrl = getSeatGeekUrl(path, options);
  return useSWR(path ? endpointUrl : null, fetcher);
}