import { test, expect } from '@playwright/test';

test('E2E 1: el perfil de Supabase aparece en la portada', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Andres Sebastian Soto Astete');
  await expect(page.getByText('Cuadro de Honor 2026 - Univalle Sucre')).toBeVisible();
});

test('E2E 2: las habilidades y certificaciones se cargan desde la API', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Habilidades' }).click();
  await expect(page.getByRole('heading', { name: 'Lenguajes principales' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'CCNA: Introducción a las Redes' })).toBeVisible();
});

test('E2E 3: un proyecto muestra su enlace externo correcto', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Proyectos', exact: true }).click();
  const project = page.locator('.project-card').filter({ has: page.getByRole('heading', { name: 'SucreExpress 3.0' }) });
  await expect(project).toBeVisible();
  await expect(project.getByRole('link', { name: /Ver código/ })).toHaveAttribute('href', 'https://github.com/retr0max309/Sucrexpress');
});

test('E2E contacto: el formulario envía los datos y confirma el guardado', async ({ page }) => {
  let submitted;
  await page.route('**/api/contact', async (route) => {
    submitted = route.request().postDataJSON();
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify({ status: 'saved' }) });
  });
  await page.goto('/');
  await page.getByRole('link', { name: 'Contacto' }).click();
  await page.getByLabel('Tu nombre').fill('Ana Pérez');
  await page.getByLabel('Tu correo').fill('ana@example.com');
  await page.getByLabel('Tu mensaje').fill('Quiero conversar sobre un proyecto.');
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('status')).toContainText('Tu mensaje fue guardado');
  expect(submitted).toEqual({ name: 'Ana Pérez', email: 'ana@example.com', message: 'Quiero conversar sobre un proyecto.' });
  await expect(page.getByLabel('Tu mensaje')).toHaveValue('');
});
