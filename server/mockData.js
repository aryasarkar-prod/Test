// Bundled mock data used when MOCK_MODE=true or when an upstream
// Open-Meteo request fails. The shape mirrors the upstream payloads
// closely enough that the weather service can map them with the same
// code path used for real responses.

const WEATHER_CODE_TEXT = {
  0: 'Clear',
  1: 'Partly cloudy',
  2: 'Partly cloudy',
  3: 'Partly cloudy',
  45: 'Fog',
  48: 'Fog',
  51: 'Drizzle',
  53: 'Drizzle',
  55: 'Drizzle',
  61: 'Rain',
  63: 'Rain',
  65: 'Rain',
  71: 'Snow',
  73: 'Snow',
  75: 'Snow',
  80: 'Rain showers',
  81: 'Rain showers',
  82: 'Rain showers',
  95: 'Thunderstorm'
};

export function weatherCodeToText(code) {
  return WEATHER_CODE_TEXT[code] ?? 'Unknown';
}

// Returns a fixed sample location regardless of the requested city so
// the demo experience is deterministic without a network connection.
export function mockGeocode(_city) {
  return {
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London'
  };
}

// Returns a 7-day forecast plus current conditions in the same shape
// produced by Open-Meteo's /v1/forecast endpoint (the fields we use).
export function mockForecast(_lat, _lon) {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setUTCDate(today.getUTCDate() + i);
    days.push(d.toISOString().slice(0, 10));
  }

  return {
    current: {
      time: new Date().toISOString().slice(0, 16),
      temperature_2m: 14.2,
      weather_code: 3,
      wind_speed_10m: 11.5
    },
    daily: {
      time: days,
      temperature_2m_max: [16.1, 17.4, 15.0, 13.8, 18.2, 19.5, 17.0],
      temperature_2m_min: [9.2, 10.0, 8.5, 7.9, 11.1, 12.3, 10.6],
      weather_code: [3, 61, 2, 80, 1, 0, 63],
      precipitation_sum: [0.0, 4.2, 0.1, 2.8, 0.0, 0.0, 6.5]
    }
  };
}
