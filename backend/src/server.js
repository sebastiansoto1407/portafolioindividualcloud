import 'dotenv/config';
import { createDatabase } from './db.js';
import { createApp } from './app.js';

const port = Number(process.env.PORT || 3001);
const host = process.env.HOST || '127.0.0.1';
const origins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173,http://127.0.0.1:5173')
  .split(',').map((origin) => origin.trim()).filter(Boolean);

try {
  const database = createDatabase();
  createApp(database, origins).listen(port, host, () => {
    console.log(`API lista en http://${host}:${port}`);
  });
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}

