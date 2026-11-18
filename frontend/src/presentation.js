export function formatCertificationDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return 'Fecha no disponible';
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return 'Fecha no disponible';
  return new Intl.DateTimeFormat('es-BO', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
}

export function getProjectLink(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}

export function uniqueNonBlankItems(items) {
  if (!Array.isArray(items)) return [];
  return [...new Set(items.filter((item) => typeof item === 'string').map((item) => item.trim()).filter(Boolean))];
}

