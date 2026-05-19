import { describe, it, expect, vi } from 'vitest';
import { getWeather } from '../server/weather.js';
import { weatherCodeToText } from '../server/mockData.js';

function jsonResponse(body, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    json: async () => body
  };
}

describe('getWeather', () => {
  it('returns mock data when mockMode: true is passed', async () => {
    const fetchImpl = vi.fn();
    const result = await getWeather('anywhere', { mockMode: true, fetchImpl });

    expect(fetchImpl).not.toHaveBeenCalled();
    expect(result.source).toBe('mock');
    expect(result.daily).toHaveLength(7);
    expect(result.location.name).toBe('London');
    expect(typeof result.current.temperature).toBe('number');
  });

  it('calls geocoding then forecast URLs in order and returns source "open-meteo"', async () => {
    const geocodeBody = {
      results: [
        {
          name: 'Paris',
          country: 'France',
          latitude: 48.8566,
          longitude: 2.3522,
          timezone: 'Europe/Paris'
        }
      ]
    };
    const forecastBody = {
      current: {
        time: '2024-01-01T12:00',
        temperature_2m: 7.5,
        weather_code: 0,
        wind_speed_10m: 9.0
      },
      daily: {
        time: [
          '2024-01-01',
          '2024-01-02',
          '2024-01-03',
          '2024-01-04',
          '2024-01-05',
          '2024-01-06',
          '2024-01-07'
        ],
        temperature_2m_max: [8, 9, 10, 11, 12, 13, 14],
        temperature_2m_min: [1, 2, 3, 4, 5, 6, 7],
        weather_code: [0, 1, 2, 3, 45, 61, 95],
        precipitation_sum: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6]
      }
    };

    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(geocodeBody))
      .mockResolvedValueOnce(jsonResponse(forecastBody));

    const result = await getWeather('Paris', { fetchImpl });

    expect(fetchImpl).toHaveBeenCalledTimes(2);
    const firstUrl = fetchImpl.mock.calls[0][0];
    const secondUrl = fetchImpl.mock.calls[1][0];
    expect(firstUrl).toContain('geocoding-api.open-meteo.com/v1/search');
    expect(firstUrl).toContain('name=Paris');
    expect(secondUrl).toContain('api.open-meteo.com/v1/forecast');
    expect(secondUrl).toContain('latitude=48.8566');
    expect(secondUrl).toContain('longitude=2.3522');

    expect(result.source).toBe('open-meteo');
    expect(result.location.name).toBe('Paris');
    expect(result.current.condition).toBe('Clear');
    expect(result.daily).toHaveLength(7);
    expect(result.daily[0].condition).toBe('Clear');
    expect(result.daily[6].condition).toBe('Thunderstorm');
  });

  it('throws an error with code NOT_FOUND when geocoding returns no results', async () => {
    const fetchImpl = vi.fn().mockResolvedValueOnce(jsonResponse({ results: [] }));

    await expect(getWeather('Nowhereville', { fetchImpl })).rejects.toMatchObject({
      message: 'City not found',
      code: 'NOT_FOUND'
    });
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it('returns source "mock-fallback" when fetchImpl rejects on the geocoding call', async () => {
    const fetchImpl = vi.fn().mockRejectedValueOnce(new Error('network down'));

    const result = await getWeather('London', { fetchImpl });

    expect(result.source).toBe('mock-fallback');
    expect(result.daily).toHaveLength(7);
    expect(result.location.name).toBe('London');
  });

  it('returns source "mock-fallback" when fetchImpl hangs longer than the timeout', async () => {
    const previous = process.env.WEATHER_FETCH_TIMEOUT_MS;
    process.env.WEATHER_FETCH_TIMEOUT_MS = '20';
    try {
      const fetchImpl = vi.fn((_url, opts) => {
        const signal = opts && opts.signal;
        return new Promise((_resolve, reject) => {
          if (!signal) return;
          if (signal.aborted) {
            reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
            return;
          }
          signal.addEventListener('abort', () => {
            reject(Object.assign(new Error('aborted'), { name: 'AbortError' }));
          });
        });
      });

      const result = await getWeather('Paris', { fetchImpl });

      expect(fetchImpl).toHaveBeenCalledTimes(1);
      const opts = fetchImpl.mock.calls[0][1];
      expect(opts && opts.signal).toBeDefined();
      expect(result.source).toBe('mock-fallback');
      expect(result.daily).toHaveLength(7);
    } finally {
      if (previous === undefined) {
        delete process.env.WEATHER_FETCH_TIMEOUT_MS;
      } else {
        process.env.WEATHER_FETCH_TIMEOUT_MS = previous;
      }
    }
  });
});

describe('weatherCodeToText', () => {
  it('returns "Clear" for code 0', () => {
    expect(weatherCodeToText(0)).toBe('Clear');
  });

  it('returns "Unknown" for an unknown code like 999', () => {
    expect(weatherCodeToText(999)).toBe('Unknown');
  });
});
