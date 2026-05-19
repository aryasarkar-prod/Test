import { afterAll, beforeAll, beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import express from 'express';

// Stub the weather service so these tests exercise the real routes
// handler without touching the network. Each test installs its own
// behavior via getWeatherMock.mockImplementation / mockRejectedValueOnce.
const getWeatherMock = vi.fn();
vi.mock('../server/weather.js', () => ({
  getWeather: (...args) => getWeatherMock(...args)
}));

// Import after vi.mock is registered so registerRoutes picks up the stub.
const { registerRoutes } = await import('../server/routes.js');

let server;
let baseUrl;

beforeAll(async () => {
  const app = express();
  app.use(express.json());
  registerRoutes(app);

  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

afterAll(async () => {
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
});

beforeEach(() => {
  getWeatherMock.mockReset();
});

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: 'ok' });
  });
});

describe('GET /api/weather', () => {
  // The route reads MOCK_MODE on every request. Default the suite to
  // a clean state and restore whatever the surrounding env had.
  const previousMockMode = process.env.MOCK_MODE;
  beforeEach(() => {
    delete process.env.MOCK_MODE;
  });
  afterEach(() => {
    if (previousMockMode === undefined) {
      delete process.env.MOCK_MODE;
    } else {
      process.env.MOCK_MODE = previousMockMode;
    }
  });

  it('returns 400 when city is missing', async () => {
    const res = await fetch(`${baseUrl}/api/weather`);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body).toEqual({ error: 'Query parameter "city" is required' });
    expect(getWeatherMock).not.toHaveBeenCalled();
  });

  it('returns 400 when city is an empty string', async () => {
    const res = await fetch(`${baseUrl}/api/weather?city=`);
    expect(res.status).toBe(400);
    expect(getWeatherMock).not.toHaveBeenCalled();
  });

  it('returns 400 when city is whitespace only (server trims)', async () => {
    const res = await fetch(`${baseUrl}/api/weather?city=%20%20%20`);
    expect(res.status).toBe(400);
    expect(getWeatherMock).not.toHaveBeenCalled();
  });

  it('returns 400 when city is provided multiple times (defensively rejects array input)', async () => {
    // Express parses repeated query params into an array; the route
    // requires city to be a string, so this should produce a 400 rather
    // than a 500.
    const res = await fetch(`${baseUrl}/api/weather?city=Paris&city=London`);
    expect(res.status).toBe(400);
    expect(getWeatherMock).not.toHaveBeenCalled();
  });

  it('returns 200 with the payload getWeather produced and trims the city before delegating', async () => {
    const payload = { source: 'mock', location: { name: 'X' }, current: {}, daily: [] };
    getWeatherMock.mockResolvedValueOnce(payload);

    const res = await fetch(`${baseUrl}/api/weather?city=%20%20London%20%20`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual(payload);

    expect(getWeatherMock).toHaveBeenCalledTimes(1);
    const [city, opts] = getWeatherMock.mock.calls[0];
    expect(city).toBe('London');
    expect(opts).toEqual({ mockMode: false });
  });

  it('passes mockMode: true to getWeather when MOCK_MODE=true', async () => {
    process.env.MOCK_MODE = 'true';
    const payload = { source: 'mock', location: {}, current: {}, daily: [] };
    getWeatherMock.mockResolvedValueOnce(payload);

    const res = await fetch(`${baseUrl}/api/weather?city=Paris`);
    expect(res.status).toBe(200);

    expect(getWeatherMock).toHaveBeenCalledTimes(1);
    expect(getWeatherMock.mock.calls[0][1]).toEqual({ mockMode: true });
  });

  it('returns 200 unchanged when getWeather signals mock-fallback (resilience contract)', async () => {
    const payload = { source: 'mock-fallback', location: {}, current: {}, daily: [] };
    getWeatherMock.mockResolvedValueOnce(payload);

    const res = await fetch(`${baseUrl}/api/weather?city=Paris`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.source).toBe('mock-fallback');
  });

  it('returns 404 when getWeather throws an error with code NOT_FOUND', async () => {
    const err = Object.assign(new Error('City not found'), { code: 'NOT_FOUND' });
    getWeatherMock.mockRejectedValueOnce(err);

    const res = await fetch(`${baseUrl}/api/weather?city=Nowhereville`);
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body).toEqual({ error: 'City not found' });
  });

  it('returns 500 with a generic error message when getWeather throws an unexpected error', async () => {
    // The route logs the unexpected error; silence the noise.
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      getWeatherMock.mockRejectedValueOnce(new Error('boom'));

      const res = await fetch(`${baseUrl}/api/weather?city=Paris`);
      expect(res.status).toBe(500);
      const body = await res.json();
      expect(body).toEqual({ error: 'Internal error' });
      expect(errorSpy).toHaveBeenCalled();
    } finally {
      errorSpy.mockRestore();
    }
  });
});
