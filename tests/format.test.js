import { describe, it, expect } from 'vitest';
import { formatTime, formatWeekday } from '../public/format.js';

// These tests pin the contract that the displayed wall-clock digits
// and weekday must match the location's timezone, regardless of the
// host's. Open-Meteo with timezone=auto returns current.time as a
// timezone-naive YYYY-MM-DDTHH:mm string already adjusted to the
// location's clock, so the helpers must NOT shift the digits a second
// time. The previous implementation parsed the naive ISO via
// `new Date(...)` (host-local) and then re-rendered with
// `toLocaleString({ timeZone: location })`, double-applying the
// offset. That's the regression these cases are designed to catch.
//
// Because the parts-based implementation builds the moment via
// Date.UTC(...) and renders with timeZone: 'UTC', the output is
// host-TZ-independent. The tests therefore make assertions about the
// digits in the output rather than relying on `process.env.TZ`
// manipulation, which Node's Intl does not always honor at runtime.

describe('formatTime', () => {
  it('preserves the input wall-clock digits when rendering for a remote timezone', () => {
    // The buggy implementation, on a host in Los Angeles, rendered
    // 2024-01-01T12:00 as "Mon, 9:00 PM ..." for Europe/Paris.
    // The fix must show 12:00 regardless of host timezone.
    const out = formatTime('2024-01-01T12:00', 'Europe/Paris');
    expect(out).toMatch(/12:00/);
    // None of the buggy renderings (LA→Paris was 9:00 PM,
    // Tokyo→Paris was 4:00 AM) should appear.
    expect(out).not.toMatch(/9:00\s*PM/);
    expect(out).not.toMatch(/4:00\s*AM/);
    // Jan 1 2024 is a Monday in every timezone.
    expect(out).toMatch(/Mon/);
  });

  it('preserves the input wall-clock digits across multiple cross-timezone pairs', () => {
    // Each of these inputs is "the location's local clock". The
    // displayed digits must match exactly.
    const cases = [
      { iso: '2024-07-15T06:30', tz: 'Asia/Tokyo', digits: /6:30/ },
      { iso: '2024-07-15T18:45', tz: 'America/New_York', digits: /6:45\s*PM/ },
      { iso: '2024-12-31T23:59', tz: 'Australia/Sydney', digits: /11:59\s*PM/ },
      { iso: '2024-03-01T00:00', tz: 'Europe/London', digits: /12:00\s*AM/ }
    ];
    for (const { iso, tz, digits } of cases) {
      const out = formatTime(iso, tz);
      expect(out, `formatTime(${iso}, ${tz}) = ${out}`).toMatch(digits);
    }
  });

  it('appends a short timezone label for the requested location', () => {
    const out = formatTime('2024-01-01T12:00', 'Europe/Paris');
    // Engines render Europe/Paris in January as "CET" or "GMT+1"
    // depending on ICU data. Either tells the user whose clock the
    // digits belong to.
    expect(out).toMatch(/(CET|GMT\+1|UTC\+1)/);
  });

  it('omits the tz label when no timezone is provided', () => {
    const out = formatTime('2024-01-01T12:00');
    expect(out).toMatch(/12:00/);
    expect(out).not.toMatch(/CET|GMT|UTC|PST|PDT/);
  });

  it('returns an empty string for empty/null/undefined input', () => {
    expect(formatTime('')).toBe('');
    expect(formatTime(null)).toBe('');
    expect(formatTime(undefined)).toBe('');
  });

  it('returns the original string when the input cannot be parsed', () => {
    expect(formatTime('not a date')).toBe('not a date');
  });

  it('accepts inputs with seconds appended (regex matches the prefix)', () => {
    const out = formatTime('2024-01-01T12:00:30', 'Europe/Paris');
    expect(out).toMatch(/12:00/);
    expect(out).toMatch(/Mon/);
  });
});

describe('formatWeekday', () => {
  it('returns the correct weekday name for the input date string', () => {
    // 2024-01-01 was a Monday and 2024-01-07 was a Sunday. A naive
    // `new Date('2024-01-01')` parses as UTC midnight, which renders
    // as Sunday in any timezone west of UTC, surfacing the original
    // forecast-tile bug. The parts-based implementation must always
    // render Monday for this input.
    expect(formatWeekday('2024-01-01')).toMatch(/Mon/);
    expect(formatWeekday('2024-01-07')).toMatch(/Sun/);
    expect(formatWeekday('2024-07-04')).toMatch(/Thu/);
  });

  it('returns an empty string for empty input', () => {
    expect(formatWeekday('')).toBe('');
  });

  it('returns the original string when the input cannot be parsed', () => {
    expect(formatWeekday('not a date')).toBe('not a date');
  });
});
