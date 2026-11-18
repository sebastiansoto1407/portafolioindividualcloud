import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCertificationDate, getProjectLink, uniqueNonBlankItems } from '../src/presentation.js';

test('unitario 1: fecha de certificación conserva el día en UTC y rechaza valores inválidos', () => {
  assert.equal(formatCertificationDate('2026-06-16'), '16 de junio de 2026');
  assert.equal(formatCertificationDate('2026-02-30'), 'Fecha no disponible');
});

test('unitario 2: enlaces de proyectos solo aceptan HTTPS', () => {
  assert.equal(getProjectLink('https://github.com/usuario/proyecto'), 'https://github.com/usuario/proyecto');
  assert.equal(getProjectLink('javascript:alert(1)'), null);
  assert.equal(getProjectLink('http://example.com'), null);
});

test('unitario 3: etiquetas vacías y repetidas no aparecen en habilidades', () => {
  assert.deepEqual(uniqueNonBlankItems([' React ', '', 'React', 'Vite', null]), ['React', 'Vite']);
  assert.deepEqual(uniqueNonBlankItems(null), []);
});
