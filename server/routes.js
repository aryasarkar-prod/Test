import { getWeather } from './weather.js';

export function registerRoutes(app) {
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/weather', async (req, res) => {
    const city = typeof req.query.city === 'string' ? req.query.city.trim() : '';
    if (!city) {
      res.status(400).json({ error: 'Query parameter "city" is required' });
      return;
    }

    const mockMode = process.env.MOCK_MODE === 'true';

    try {
      const data = await getWeather(city, { mockMode });
      res.status(200).json(data);
    } catch (err) {
      if (err && err.code === 'NOT_FOUND') {
        res.status(404).json({ error: 'City not found' });
        return;
      }
      console.error(err);
      res.status(500).json({ error: 'Internal error' });
    }
  });
}
