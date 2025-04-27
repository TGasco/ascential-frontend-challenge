import { describe, it, expect } from 'vitest';
import { formatDateTime } from './formatDateTime';

describe('formatDateTime', () => {
  it('should format date in default timezone (UTC) when no timezone is provided', () => {
    const date = new Date('2024-06-01T12:34:56Z');
    const formatted = formatDateTime(date);
    // The output will depend on the environment's default timezone.
    // We check for a substring to avoid locale/timezone issues.
    expect(formatted).toContain('2024');
    expect(formatted).toContain('June');
    expect(formatted).toMatch(/\d{1,2}:\d{2}:\d{2}/);
  });

  it('should format date in a specific timezone', () => {
    const date = new Date('2024-06-01T12:34:56Z');
    const formatted = formatDateTime(date, 'America/New_York');
    expect(formatted).toContain('2024');
    expect(formatted).toContain('June');
    expect(formatted).toMatch(/\d{1,2}:\d{2}:\d{2}/);
    expect(formatted).toMatch(/GMT|UTC|EDT|EST/); // Should include a timezone abbreviation
  });

  it('should handle different timezones correctly', () => {
    const date = new Date('2024-06-01T12:34:56Z');
    const formattedNY = formatDateTime(date, 'America/New_York');
    const formattedLondon = formatDateTime(date, 'Europe/London');
    expect(formattedNY).not.toEqual(formattedLondon);
  });

  it('should throw if an invalid date is provided', () => {
    // @ts-expect-error
    expect(() => formatDateTime('invalid-date')).toThrow();
  });

  it('should throw if an invalid timezone is provided', () => {
    const date = new Date('2024-06-01T12:34:56Z');
    expect(() => formatDateTime(date, 'Invalid/Timezone')).toThrow();
  });
});