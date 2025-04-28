import { Fetcher } from 'swr';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetcher: Fetcher<any, string> = async (...args) => {
  const response = await fetch(...args);
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response.json();
};
