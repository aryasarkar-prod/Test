# Weather App

## Overview

A small local web weather app: a Node.js + Express backend proxies
[Open-Meteo](https://open-meteo.com)'s geocoding and forecast APIs for a
vanilla HTML/CSS/JS frontend. The backend bundles sample data so the app
remains fully demonstrable when the host has no outbound internet
access.

## Quick start

```sh
npm install
npm start
```

Then open [http://localhost:3000](http://localhost:3000) in a browser.

The server listens on `PORT` (default `3000`).

## Mock mode

To run without internet, force the backend to use the bundled mock data:

```sh
MOCK_MODE=true npm start
```

Even when `MOCK_MODE` is unset, the backend automatically falls back to
the mock data if an upstream Open-Meteo call fails or hangs longer than
the configured timeout. The response is tagged with
`source: "mock-fallback"` in that case so the frontend can show a small
notice. The per-request timeout defaults to 5000ms and can be overridden
by setting `WEATHER_FETCH_TIMEOUT_MS` to a positive integer (in
milliseconds).

## API

- `GET /api/health` returns `{ "status": "ok" }`.
- `GET /api/weather?city=<name>` returns
  `{ source, location, current, daily }`. `source` is one of
  `open-meteo`, `mock`, or `mock-fallback`. `daily` is an array of seven
  entries, one per day. Returns `400` if `city` is missing, `404` if the
  city cannot be geocoded, and `500` on unexpected errors.

## Tests

```sh
npm test
```

Tests use [vitest](https://vitest.dev) and inject a fake `fetchImpl` into
the weather service, so they never touch the real network.

## Notes

- Node.js 20+ (the sandbox runs Node 24).
- [Express](https://expressjs.com/) for the HTTP layer.
- [Open-Meteo](https://open-meteo.com) for geocoding and forecast data.
- [vitest](https://vitest.dev) for unit tests.
