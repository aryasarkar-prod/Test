import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { registerRoutes } from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

export const app = express();
app.use(express.json());
app.use(express.static(publicDir));
registerRoutes(app);

const isEntry = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isEntry) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Weather app listening on http://localhost:${port}`);
  });
}
