import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getSeatGeekUrl, useSeatGeek } from './useSeatGeek';
import useSWR from 'swr';

vi.mock('swr', () => ({
  default: vi.fn(),
}));
vi.mock('./fetcher', () => ({
  fetcher: vi.fn(),
}));

beforeEach(() => {
  import.meta.env.VITE_APP_SEAT_GEEK_API_CLIENT = 'test_client_id';
  import.meta.env.VITE_APP_SEAT_GEEK_API_KEY = 'test_client_secret';
  import.meta.env.VITE_SEATGEEK_API_URL = 'https://api.seatgeek.com/2';
});

describe('getSeatGeekUrl', () => {
  it('constructs the correct URL with options', () => {
    const url = getSeatGeekUrl('/events', { q: 'music', per_page: '5' });
    expect(url).toContain('https://api.seatgeek.com/2/events?');
    expect(url).toContain('q=music');
    expect(url).toContain('per_page=5');
    expect(url).toContain('client_id=test_client_id');
    expect(url).toContain('client_secret=test_client_secret');
  });

  it('constructs the correct URL without options', () => {
    const url = getSeatGeekUrl('/venues');
    expect(url).toContain('https://api.seatgeek.com/2/venues?');
    expect(url).toContain('client_id=test_client_id');
    expect(url).toContain('client_secret=test_client_secret');
  });

  it('constructs the correct URL with multiple values for the same key', () => {
    const url = getSeatGeekUrl('/events', { q: ['music', 'sports'] });
    expect(url).toContain('https://api.seatgeek.com/2/events?');
    expect(url).toContain('q=music');
    expect(url).toContain('q=sports');
    expect(url).toContain('client_id=test_client_id');
    expect(url).toContain('client_secret=test_client_secret');
  });

  it('constructs the correct URL with no options', () => {
    const url = getSeatGeekUrl('/events');
    expect(url).toContain('https://api.seatgeek.com/2/events?');
    expect(url).toContain('client_id=test_client_id');
    expect(url).toContain('client_secret=test_client_secret');
  });
});

describe('useSeatGeek', () => {
  it('calls useSWR with the correct endpointUrl', () => {
    const mockedUseSWR = useSWR as unknown as ReturnType<typeof vi.fn>;
    mockedUseSWR.mockClear();
    getSeatGeekUrl('/events', { q: 'test' }); // ensure env is set
    useSeatGeek('/events', { q: 'test' });
    expect(mockedUseSWR).toHaveBeenCalledTimes(1);
    const calledWith = mockedUseSWR.mock.calls[0][0];
    expect(calledWith).toContain('/events?');
    expect(calledWith).toContain('q=test');
    expect(calledWith).toContain('client_id=test_client_id');
    expect(calledWith).toContain('client_secret=test_client_secret');
  });

  it('calls useSWR with null if path is empty', () => {
    const mockedUseSWR = useSWR as unknown as ReturnType<typeof vi.fn>;
    mockedUseSWR.mockClear();
    useSeatGeek('');
    expect(mockedUseSWR).toHaveBeenCalledWith(null, expect.anything());
  });
});