import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetcher } from './fetcher';

describe('fetcher', () => {
  const mockJson = vi.fn();
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('should return JSON data when response is ok', async () => {
    const data = { foo: 'bar' };
    mockJson.mockResolvedValue(data);
    mockFetch.mockResolvedValue({
      ok: true,
      json: mockJson,
    });

    const result = await fetcher('https://api.example.com/data');
    expect(result).toEqual(data);
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/data');
    expect(mockJson).toHaveBeenCalled();
  });

  it('should throw an error when response is not ok', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      statusText: 'Not Found',
      json: mockJson,
    });

    await expect(fetcher('https://api.example.com/404')).rejects.toThrow('Not Found');
    expect(mockFetch).toHaveBeenCalledWith('https://api.example.com/404');
  });
});
