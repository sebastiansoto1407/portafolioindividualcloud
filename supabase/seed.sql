-- Datos tomados del portafolio público proporcionado por el propietario.
-- Se puede volver a ejecutar: upsert evita duplicados.

insert into public.profiles (slug, full_name, headline, highlight, bio, photo_url)
values (
  'andres-sebastian',
  'Andres Sebastian Soto Astete',
  'Estudiante de Ingeniería de Sistemas | 6to Semestre',
  'Cuadro de Honor 2026 - Univalle Sucre',
  'Desarrollador de software especializado en la creación de aplicaciones web modernas y la gestión eficiente de bases de datos. Mi especialidad y lenguajes favoritos son JavaScript y TypeScript. Me destaco por mi rápida capacidad de aprendizaje y adaptación a nuevas tecnologías, siempre enfocado en aportar soluciones sólidas y eficientes.',
  'https://sebastiansoto1407.github.io/portafoliodevida/fotoyo1.jpeg'
) on conflict (slug) do update set
  full_name = excluded.full_name, headline = excluded.headline,
  highlight = excluded.highlight, bio = excluded.bio, photo_url = excluded.photo_url;

insert into public.skills (category, icon, items, sort_order) values
  ('Lenguajes principales', '⌘', array['C#','C++','Python','JavaScript','TypeScript','PHP','Kotlin'], 1),
  ('Desarrollo frontend', '◫', array['React','Next.js','Vite','Tailwind CSS','shadcn/ui','Páginas web responsivas'], 2),
  ('Desarrollo móvil', '▣', array['React Native','Flutter','Android Studio'], 3),
  ('Bases de datos & data', '▤', array['SQL Server','PostgreSQL','Supabase','Firebase','SQLite','Oracle Database','Data Warehouse'], 4),
  ('Herramientas & virtualización', '⚙', array['VS Code','Git','GitHub','Postman','VirtualBox','Cisco Packet Tracer','Jupyter'], 5),
  ('Especialización', '✧', array['Ciberseguridad','Unity 2D','Modelado 3D','Inteligencia Artificial'], 6)
on conflict (category) do update set icon = excluded.icon, items = excluded.items, sort_order = excluded.sort_order;

insert into public.certifications (title, issuer, issued_on) values
  ('CCNA: Introducción a las Redes', 'Cisco Networking Academy', '2026-06-16'),
  ('Conciencia Digital', 'Cisco Networking Academy', '2025-10-31'),
  ('Uso de Computadoras y Dispositivos Móviles', 'Cisco Networking Academy', '2025-10-31'),
  ('Introducción a la Ciberseguridad', 'Cisco Networking Academy', '2025-10-21'),
  ('Introduction to Modern AI', 'Cisco Networking Academy', '2025-10-03'),
  ('Database Design - Español', 'Oracle Academy', '2025-05-29'),
  ('Fundamentos de IA', 'IBM SkillsBuild', '2024-12-09'),
  ('Introducción a la Ciberseguridad', 'Cisco Networking Academy', '2024-10-04'),
  ('Fundamentos de Python 1', 'Cisco Networking Academy', '2024-10-04'),
  ('Get Connected', 'Cisco Networking Academy', '2024-05-11')
on conflict (title, issuer, issued_on) do nothing;

insert into public.projects (slug, title, category, description, tags, link_url, link_label, sort_order) values
  ('sucreexpress', 'SucreExpress 3.0', 'Full-Stack', 'Sistema avanzado de gestión de paquetería. Frontend en Next.js 16 y backend en NestJS con PostgreSQL en Supabase. Integración con Google Maps y Routes API para optimización logística.', array['Next.js','NestJS','PostgreSQL'], 'https://github.com/retr0max309/Sucrexpress', 'Ver código', 1),
  ('calculadora-estadistica', 'Calculadora Estadística', 'Data Science', 'Motor matemático privado en Python y FastAPI para resolver probabilidad y estadística paso a paso en LaTeX. Incluye regresión, técnicas de conteo y lectura local de Excel con SheetJS.', array['Python','FastAPI','SheetJS'], 'https://github.com/retr0max309/calculadora_estadistica', 'Ver código', 2),
  ('acabado', 'Proyecto Acabado', 'Finalizado', 'Mi primer proyecto oficial de alto impacto. Desarrollado y vendido con éxito durante la feria empresarial de la CAINCO.', array['Proyecto finalizado'], 'https://github.com/sebastiansoto1407/acabado', 'Ver código', 3),
  ('restaurante', 'Sistema de Restaurante', 'Finalizado', 'Sistema de gestión integral para pedidos, mesas y administración en restaurantes.', array['Gestión','Restaurantes'], 'https://github.com/sebastiansoto1407/sistema-restaurante', 'Ver código', 4),
  ('seguridad-vertical', 'Seguridad Vertical', 'Finalizado', 'Implementación de estrategias y protocolos de seguridad enfocada en la integridad y protección de sistemas.', array['Seguridad'], 'https://github.com/sebastiansoto1407/seguridadvertical', 'Ver código', 5),
  ('tiktok-downloader', 'TikTok Downloader', 'Aplicación web', 'Aplicación para extraer y descargar videos de TikTok en alta calidad sin marca de agua mediante enlaces.', array['Web','Utilidad'], 'https://github.com/sebastiansoto1407/tiktok', 'Ver código', 6),
  ('fragmentos-del-olvido', 'Fragmentos del Olvido', 'Game Dev', 'Videojuego creado desde cero en Unity 2D, aplicando lógica de programación, físicas y diseño de niveles.', array['Unity 2D','Videojuego'], 'https://gaforsix777.itch.io/fragmentos-del-olvido', 'Ver en Itch.io', 7),
  ('app-gastos', 'App de Gastos', 'Aplicación', 'Aplicación para el control de finanzas personales, presupuestos y registro de gastos diarios.', array['Finanzas','Presupuestos'], 'https://github.com/sebastiansoto1407/Appgastos', 'Ver código', 8),
  ('smartcloset', 'SmartCloset', 'Aplicación', 'Plataforma inteligente para la organización, categorización y gestión virtual de guardarropas.', array['Organización'], 'https://github.com/sebastiansoto1407/smartcloset', 'Ver código', 9),
  ('texto-a-voz', 'Conversor Texto a Voz', 'Aplicación', 'Herramienta para sintetizar texto escrito y convertirlo en audio procesado por voz.', array['Audio','Utilidad'], 'https://github.com/sebastiansoto1407/textoavoz', 'Ver código', 10)
on conflict (slug) do update set
  title = excluded.title, category = excluded.category, description = excluded.description,
  tags = excluded.tags, link_url = excluded.link_url, link_label = excluded.link_label,
  sort_order = excluded.sort_order;

