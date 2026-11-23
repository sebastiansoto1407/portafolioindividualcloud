import test from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { createDatabase } from '../src/db.js';

const env = {
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_test',
};

function appWithSupabaseResponse(table, body, status = 200, verifyQuery = () => {}) {
  const fetchImpl = async (input) => {
    const url = new URL(input);
    assert.equal(url.pathname, `/rest/v1/${table}`);
    verifyQuery(url.searchParams);
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  };
  return createApp(createDatabase(env, fetchImpl));
}

test('integración 1: Express obtiene el perfil mediante el cliente real de Supabase', async () => {
  const app = appWithSupabaseResponse('profiles', {
    slug: 'andres-sebastian', full_name: 'Andres Sebastian Soto Astete',
    headline: 'Estudiante', highlight: 'Cuadro de Honor', bio: 'Desarrollador', photo_url: null,
  }, 200, (query) => {
    assert.equal(query.get('slug'), 'eq.andres-sebastian');
    assert.equal(query.get('published'), 'eq.true');
  });
  const response = await request(app).get('/api/profile').expect(200);
  assert.equal(response.body.full_name, 'Andres Sebastian Soto Astete');
});

test('integración 2: la ruta de proyectos consulta solo publicados y en orden', async () => {
  const app = appWithSupabaseResponse('projects', [
    { id: 1, slug: 'uno', title: 'Proyecto Uno', category: 'Web', description: 'Demo', tags: ['React'], link_url: null, link_label: null },
  ], 200, (query) => {
    assert.equal(query.get('published'), 'eq.true');
    assert.equal(query.get('order'), 'sort_order.asc');
  });
  const response = await request(app).get('/api/projects').expect(200);
  assert.equal(response.body.length, 1);
  assert.equal(response.body[0].slug, 'uno');
});

test('integración 3: una falla de Supabase produce HTTP 502 sin filtrar detalles', async () => {
  const app = appWithSupabaseResponse('skills', { message: 'private database detail', code: 'XX000' }, 503);
  const originalError = console.error;
  console.error = () => {};
  try {
    const response = await request(app).get('/api/skills').expect(502);
    assert.equal(response.body.error, 'No se pudieron cargar los datos del portafolio.');
    assert.equal(JSON.stringify(response.body).includes('private database detail'), false);
  } finally {
    console.error = originalError;
  }
});

test('contacto: guarda el nombre, correo y mensaje en Supabase', async () => {
  const fetchImpl = async (input, options) => {
    assert.equal(new URL(input).pathname, '/rest/v1/contact_messages');
    assert.equal(options.method, 'POST');
    assert.deepEqual(JSON.parse(options.body), {
      sender_name: 'Ana Pérez',
      sender_email: 'ana@example.com',
      body: 'Quiero conversar sobre un proyecto.',
    });
    return new Response(null, { status: 201 });
  };
  const app = createApp(createDatabase(env, fetchImpl));
  const response = await request(app).post('/api/contact').send({
    name: '  Ana Pérez  ', email: ' ana@example.com ', message: '  Quiero conversar sobre un proyecto.  ',
  }).expect(201);
  assert.deepEqual(response.body, { status: 'saved' });
});

test('contacto: rechaza datos inválidos sin llamar a Supabase', async () => {
  const fetchImpl = () => { throw new Error('No debe llamar a Supabase'); };
  const app = createApp(createDatabase(env, fetchImpl));
  await request(app).post('/api/contact').send({ name: 'A', email: 'correo-inválido', message: 'corto' }).expect(400);
  await request(app).post('/api/contact').send({ name: 'Ana', email: 'ana@example.com', message: '' }).expect(400);
});

test('contacto: oculta el error de base de datos al visitante', async () => {
  const fetchImpl = async () => new Response(JSON.stringify({ message: 'detalle interno privado', code: 'XX000' }), {
    status: 503, headers: { 'Content-Type': 'application/json' },
  });
  const app = createApp(createDatabase(env, fetchImpl));
  const originalError = console.error;
  console.error = () => {};
  try {
    const response = await request(app).post('/api/contact').send({
      name: 'Ana Pérez', email: 'ana@example.com', message: 'Un mensaje suficientemente largo.',
    }).expect(502);
    assert.equal(response.body.error, 'No se pudo enviar el mensaje. Inténtalo de nuevo.');
    assert.equal(JSON.stringify(response.body).includes('detalle interno privado'), false);
  } finally {
    console.error = originalError;
  }
});
