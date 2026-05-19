import { mockGeocode, mockForecast, weatherCodeToText } from './mockData.js';

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const DEFAULT_FETCH_TIMEOUT_MS = 5000;

function resolveFetchTimeoutMs() {
  const raw = process.env.WEATHER_FETCH_TIMEOUT_MS;
  if (raw === undefined || raw === '') {
    return DEFAULT_FETCH_TIMEOUT_MS;
  }
  const parsed = Number.parseInt(raw, 10);
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return DEFAULT_FETCH_TIMEOUT_MS;
}

function timeoutSignal(ms) {
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  setTimeout(() => {
    controller.abort(Object.assign(new Error('timeout'), { name: 'AbortError' }));
  }, ms);
  return controller.signal;
}

function buildResponse(source, geo, forecast) {
  const dailyTimes = forecast.daily.time;
  const daily = dailyTimes.map((date, i) => {
    const code = forecast.daily.weather_code[i];
    return {
      date,
      tempMax: forecast.daily.temperature_2m_max[i],
      tempMin: forecast.daily.temperature_2m_min[i],
      weatherCode: code,
      condition: weatherCodeToText(code),
      precipitation: forecast.daily.precipitation_sum[i]
    };
  });

  return {
    source,
    location: {
      name: geo.name,
      country: geo.country,
      latitude: geo.latitude,
      longitude: geo.longitude,
      timezone: geo.timezone
    },
    current: {
      temperature: forecast.current.temperature_2m,
      windSpeed: forecast.current.wind_speed_10m,
      weatherCode: forecast.current.weather_code,
      condition: weatherCodeToText(forecast.current.weather_code),
      time: forecast.current.time
    },
    daily
  };
}

function buildMockResponse(city, source) {
  const geo = mockGeocode(city);
  const forecast = mockForecast(geo.latitude, geo.longitude);
  return buildResponse(source, geo, forecast);
}

export async function getWeather(city, { mockMode = false, fetchImpl = globalThis.fetch } = {}) {
  if (mockMode) {
    return buildMockResponse(city, 'mock');
  }

  try {
    const fetchTimeoutMs = resolveFetchTimeoutMs();
    const geocodeUrl =
      `${GEOCODE_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoRes = await fetchImpl(geocodeUrl, { signal: timeoutSignal(fetchTimeoutMs) });
    if (!geoRes || !geoRes.ok) {
      throw new Error(`Geocoding request failed with status ${geoRes && geoRes.status}`);
    }
    const geoJson = await geoRes.json();
    if (!geoJson.results || geoJson.results.length === 0) {
      const err = new Error('City not found');
      err.code = 'NOT_FOUND';
      throw err;
    }

    const hit = geoJson.results[0];
    const geo = {
      name: hit.name,
      country: hit.country,
      latitude: hit.latitude,
      longitude: hit.longitude,
      timezone: hit.timezone
    };

    const forecastUrl =
      `${FORECAST_URL}?latitude=${geo.latitude}&longitude=${geo.longitude}` +
      `&current=temperature_2m,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum` +
      `&timezone=auto&forecast_days=7`;
    const forecastRes = await fetchImpl(forecastUrl, { signal: timeoutSignal(fetchTimeoutMs) });
    if (!forecastRes || !forecastRes.ok) {
      throw new Error(`Forecast request failed with status ${forecastRes && forecastRes.status}`);
    }
    const forecastJson = await forecastRes.json();

    return buildResponse('open-meteo', geo, forecastJson);
  } catch (err) {
    if (err && err.code === 'NOT_FOUND') {
      throw err;
    }
    // Log the underlying upstream failure before serving the fallback
    // so operators have a server-side signal when the live path breaks.
    // The public response shape is unchanged: callers still get a 200
    // tagged with source: "mock-fallback".
    console.error('[weather] upstream call failed, serving mock-fallback:', err);
    return buildMockResponse(city, 'mock-fallback');
  }
}
