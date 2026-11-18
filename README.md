# Portafolio Cloud — Andres Sebastian Soto Astete

Este proyecto convierte el [portafolio público original](https://sebastiansoto1407.github.io/portafoliodevida/) en una aplicación de tres capas:

```text
Navegador → React + Vite → API Express → Supabase PostgreSQL
```

El contenido inicial del perfil, las habilidades, las certificaciones y los proyectos se guarda en PostgreSQL. El frontend **no consulta Supabase directamente**; siempre llama a la API local. Las tablas permiten lectura pública de registros publicados y no permiten escritura pública.

**Estado actual:** el proyecto [portafoliocloud en Supabase](https://supabase.com/dashboard/project/jehyebejmdfmxbhzttla) ya está creado en São Paulo. Se ejecutaron el esquema y los datos iniciales: 1 perfil, 6 grupos de habilidades, 10 certificaciones y 10 proyectos. `backend/.env` ya contiene la URL y clave publicable de ese proyecto en esta computadora.

## Estructura y función de cada archivo

| Archivo | Función |
| --- | --- |
| `package.json` | Arranca frontend y backend juntos con `npm run dev`. |
| `frontend/index.html` | HTML base donde React monta la aplicación. |
| `frontend/vite.config.js` | Configura Vite y redirige `/api` al backend durante desarrollo. |
| `frontend/src/main.jsx` | Punto de entrada de React. |
| `frontend/src/App.jsx` | Componentes de portada, habilidades, certificaciones y proyectos. |
| `frontend/src/api.js` | Cuatro llamadas HTTP al backend. |
| `frontend/src/styles.css` | Diseño visual y reglas para móvil. |
| `backend/.env.example` | Plantilla de configuración; copiar a `.env`. |
| `backend/src/server.js` | Inicia Express en el puerto 3001. |
| `backend/src/app.js` | Define las rutas HTTP y la respuesta de errores. |
| `backend/src/db.js` | Crea el cliente de Supabase con la URL y clave publicable. |
| `supabase/schema.sql` | Crea tablas, políticas RLS y permisos de solo lectura. |
| `supabase/seed.sql` | Inserta el contenido inicial del portafolio. |
| `.gitignore` | Excluye dependencias, compilaciones y secretos locales. |
| `frontend/src/presentation.js` | Limpia habilidades, formatea fechas y filtra enlaces inseguros. |
| `frontend/test/presentation.test.js` | Tres pruebas unitarias. |
| `backend/test/api.test.js` | Tres pruebas de integración HTTP + cliente Supabase. |
| `e2e/portfolio.spec.js` | Tres pruebas de navegador con React, Express y Supabase real. |
| `playwright.config.js` | Arranca los servidores y configura Chromium para E2E. |
| `frontend/Dockerfile` | Construye React y lo sirve con Nginx. |
| `backend/Dockerfile` | Empaqueta la API Express. |
| `compose.yaml` | Orquesta frontend y backend para desarrollo local con Docker. |
| `compose.prod.yaml` | Descarga las imágenes publicadas en Docker Hub para la VM. |
| `infra/*.tf` | Crea VCN, dos subredes, gateway, NSG y VM Ubuntu 24.04. |
| `infra/bootstrap-state/main.tf` | Crea un bucket privado y una URL PAR limitada al estado Terraform. Se aplica una sola vez desde esta computadora. |
| `infra/scripts/bootstrap.sh` | Instala Docker, Git y reglas iptables en la VM. |
| `.github/workflows/portfolio.yml` | Ejecuta pruebas en `dev` y pruebas, publicación y despliegue en `main`. |

## 1. Crear la base en Supabase

La configuración de esta computadora ya está terminada. Si reproduces el proyecto en otra cuenta o máquina:

1. Crea un proyecto Supabase llamado `portafoliocloud`. Guarda la contraseña de la base de datos en un gestor de contraseñas; este proyecto **no la necesita** para leer los datos.
2. Abre **SQL Editor** en ese proyecto. Ejecuta primero `supabase/schema.sql` y después `supabase/seed.sql`.
3. En **Project Settings → API Keys**, copia la **Project URL** y la **publishable key** (`sb_publishable_…`). No utilices una `secret key` ni `service_role` para este ejemplo.
4. Copia `backend/.env.example` a `backend/.env` y sustituye los dos valores de Supabase. `.env` está ignorado por Git.

Ejemplo del archivo `backend/.env`:

```dotenv
PORT=3001
FRONTEND_ORIGIN=http://localhost:5173,http://127.0.0.1:5173
SUPABASE_URL=https://ID-DEL-PROYECTO.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_TU_CLAVE
```

La clave publicable no da acceso de administrador: las políticas RLS de `schema.sql` limitan la lectura a registros con `published = true`. La API no ofrece rutas para crear, modificar o borrar datos; para editarlos se usa el panel de Supabase o SQL autorizado.

## 2. Instalar y ejecutar

Requiere Node.js 20 o superior. Desde la carpeta raíz:

```powershell
npm ci
npm ci --prefix backend
npm ci --prefix frontend
npm run dev
```

Abre `http://127.0.0.1:5173`. El backend responde en `http://127.0.0.1:3001`.

Para comprobar la API en PowerShell:

```powershell
Invoke-RestMethod http://127.0.0.1:3001/api/health
Invoke-RestMethod http://127.0.0.1:3001/api/profile
Invoke-RestMethod http://127.0.0.1:3001/api/projects
```

`GET /api/health` confirma que Express responde. Las rutas de contenido (`/api/profile`, `/api/skills`, `/api/certifications`, `/api/projects`) leen PostgreSQL a través de Supabase.

## Cómo funciona una petición

1. `App.jsx` llama a `getPortfolio()` de `api.js` al cargar la página.
2. `api.js` solicita las cuatro rutas `/api/...`.
3. Vite dirige esas peticiones a Express con el `proxy` de `vite.config.js`.
4. `app.js` consulta las tablas mediante el cliente creado en `db.js`.
5. Supabase aplica las políticas RLS y devuelve los registros publicados.
6. React presenta los datos en tarjetas. Si falla la API, muestra un mensaje de error.

## 3. Ejecutar las nueve pruebas

```powershell
npm run test:unit
npm run test:integration
npm run test:e2e
```

Las tres pruebas unitarias comprueban fechas, enlaces HTTPS y habilidades. Las tres de integración recorren rutas HTTP de Express con el cliente real de Supabase y respuestas de red simuladas. Las tres E2E abren Chromium y leen el proyecto Supabase configurado en `backend/.env`. Instala Chromium una vez con `npx playwright install chromium`.

## 4. Docker y Compose

Para ejecutar localmente, copia `.env.example` a `.env` en la raíz y escribe la URL y clave publicable de Supabase. Después:

```powershell
docker compose --env-file .env up --build -d
docker compose --env-file .env ps
```

Abre `http://localhost/`. El contenedor Nginx atiende el puerto 80 y dirige `/api` al contenedor Express. La base PostgreSQL sigue en Supabase; no hay un tercer contenedor de BD.

En producción, `compose.prod.yaml` usa las imágenes `sotofreakin/portafoliocloud-frontend` y `sotofreakin/portafoliocloud-backend` que publica el workflow con la etiqueta del commit.
Los Dockerfiles usan las imágenes oficiales de Node y Nginx de Docker Hub; ambos contenedores finales se ejecutan sin privilegios de root.

## 5. GitHub Actions y ramas

El archivo `.github/workflows/portfolio.yml` se ejecuta con cada push a `dev` o `main`:

| Rama | Acciones |
| --- | --- |
| `dev` | Instala dependencias, compila y ejecuta 3 pruebas unitarias, 3 de integración y 3 E2E. |
| `main` | Ejecuta esas pruebas; si pasan, publica las dos imágenes en Docker Hub, aplica Terraform y despliega Compose por SSH. |

El repositorio indicado para esta práctica es `https://github.com/sebastiansoto1407/portafolioindividualcloud.git`. **No subas** `backend/.env`, la clave OCI `.pem`, la clave SSH privada ni el estado de Terraform. `.gitignore` los excluye.

Antes de un push a `dev`, crea estos **Repository secrets** en GitHub → Settings → Secrets and variables → Actions:

| Secreto | Contenido |
| --- | --- |
| `SUPABASE_URL` | URL del proyecto `portafoliocloud`. |
| `SUPABASE_PUBLISHABLE_KEY` | Clave `sb_publishable_…` del mismo proyecto. |

Antes de un push a `main`, añade además:

Crea en Docker Hub dos repositorios **públicos** llamados `portafoliocloud-frontend` y `portafoliocloud-backend` bajo `sotofreakin`, para que la VM pueda descargar las imágenes sin guardar un token de Docker Hub.

| Secreto | Contenido |
| --- | --- |
| `DOCKERHUB_TOKEN` | Token de acceso a Docker Hub con permiso para publicar en `sotofreakin`. |
| `OCI_TENANCY_OCID`, `OCI_USER_OCID`, `OCI_FINGERPRINT`, `OCI_REGION` | Identidad y región de la cuenta Oracle. |
| `OCI_PRIVATE_KEY` | **Contenido** del archivo PEM de la API OCI, no la ruta de Windows. |
| `OCI_COMPARTMENT_OCID`, `OCI_AVAILABILITY_DOMAIN`, `OCI_UBUNTU_2404_IMAGE_OCID` | Compartimento, dominio e imagen regional Ubuntu 24.04. |
| `OCI_SSH_PUBLIC_KEY` | Clave SSH pública para la VM. |
| `OCI_SSH_PRIVATE_KEY` | Clave SSH privada correspondiente, para publicar por SSH. |
| `OCI_STATE_PAR_URL` | URL de una solicitud preautenticada de lectura y escritura para **un objeto de estado exclusivo de este proyecto** en OCI Object Storage. |

Terraform necesita ese estado remoto para que los siguientes pushes actualicen la misma VM en lugar de intentar crear otra. No reutilices el objeto de estado de otra práctica. La URL PAR da acceso al estado y debe guardarse como secreto; recuerda renovarla antes de que expire.

El módulo `infra/bootstrap-state/main.tf` crea el bucket privado `portafoliocloud-tfstate-20261118` con versionado y una solicitud preautenticada de lectura y escritura limitada a `terraform.tfstate`. Su estado local contiene la URL PAR y **no se sube a Git**. La solicitud vence el 18 de noviembre de 2027. Para desplegar por SSH se genera un par de claves exclusivo del proyecto en `infra/.keys/`, también excluido de Git; la clave pública se guarda en `OCI_SSH_PUBLIC_KEY` y la privada en `OCI_SSH_PRIVATE_KEY`.

La VM usa `VM.Standard.E2.1.Micro` por defecto. Cambia `instance_shape` si la imagen Ubuntu elegida o la cuota de tu cuenta requieren otro shape. Oracle debe confirmar esa compatibilidad al ejecutar el plan.

La configuración crea una **VCN**, subred pública y privada, gateway de Internet, IP pública y reglas OCI para 22, 80 y 443. `bootstrap.sh` instala Docker, Compose, Git e iptables y conserva esas reglas después del reinicio. El sitio atiende HTTP en el puerto 80. El puerto 443 queda abierto, pero HTTPS necesita un dominio y certificado que todavía no se han proporcionado.

Vagrant no forma parte de este proyecto; puedes añadirlo como práctica separada.

