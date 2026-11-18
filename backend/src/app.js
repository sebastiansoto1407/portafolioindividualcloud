import express from 'express';
import cors from 'cors';

function sendDatabaseError(res, error) {
  console.error('Error de Supabase:', error);
  return res.status(502).json({ error: 'No se pudieron cargar los datos del portafolio.' });
}

function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res)).catch(next);
}

export function createApp(database, allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']) {
  const app = express();
  app.disable('x-powered-by');
  app.use(cors({ origin: allowedOrigins }));

  app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

  app.get('/api/profile', asyncRoute(async (_req, res) => {
    const { data, error } = await database.from('profiles')
      .select('slug,full_name,headline,highlight,bio,photo_url')
      .eq('slug', 'andres-sebastian')
      .eq('published', true)
      .maybeSingle();
    if (error) return sendDatabaseError(res, error);
    if (!data) return res.status(404).json({ error: 'Perfil no encontrado.' });
    return res.json(data);
  }));

  app.get('/api/skills', asyncRoute(async (_req, res) => {
    const { data, error } = await database.from('skills')
      .select('id,category,icon,items')
      .eq('published', true)
      .order('sort_order', { ascending: true });
    if (error) return sendDatabaseError(res, error);
    return res.json(data);
  }));

  app.get('/api/certifications', asyncRoute(async (_req, res) => {
    const { data, error } = await database.from('certifications')
      .select('id,title,issuer,issued_on')
      .eq('published', true)
      .order('issued_on', { ascending: false });
    if (error) return sendDatabaseError(res, error);
    return res.json(data);
  }));

  app.get('/api/projects', asyncRoute(async (_req, res) => {
    const { data, error } = await database.from('projects')
      .select('id,slug,title,category,description,tags,link_url,link_label')
      .eq('published', true)
      .order('sort_order', { ascending: true });
    if (error) return sendDatabaseError(res, error);
    return res.json(data);
  }));

  app.use((error, _req, res, _next) => sendDatabaseError(res, error));

  return app;
}

