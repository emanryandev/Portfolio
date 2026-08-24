# Portfolio Project

A premium software development team portfolio platform featuring a public-facing website and an integrated Admin Studio.

## Architecture

- **Frontend:** React, TypeScript, Vite, TailwindCSS, Zustand, TanStack Query, shadcn/ui.
- **Backend:** Laravel 11, PHP 8.2+, Sanctum (Cookie-based auth), SQLite (development).

## Prerequisites

- Node.js 18+
- PHP 8.2+
- Composer

## Setup Instructions

### 1. Backend Setup

```bash
cd portfolio-backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### 2. Frontend Setup

```bash
cd portfolio-frontend
npm install
cp .env.example .env
npm run dev
```

### 3. Access the Application

- **Public Site:** `http://localhost:5173`
- **Admin Studio:** `http://localhost:5173/admin`
- **Default Admin Login:**
  - Email: `admin@example.com`
  - Password: `password`

## Deployment & Operations

### Frontend (Static Build)
```bash
npm run build
```
Upload the contents of the `dist/` directory to your web server (e.g. Vercel, Netlify, Nginx).

### Backend
1. Ensure `.env` is configured for production (`APP_ENV=production`, `APP_DEBUG=false`, `SESSION_SECURE_COOKIE=true`).
2. Run `php artisan optimize:clear` and `php artisan optimize`.
3. Set up a reverse proxy (Nginx/Apache) to point to the `public/` directory.

### Nginx Proxy for Sitemap
If you host the frontend on the root domain, proxy `/sitemap.xml` to the backend:
```nginx
location = /sitemap.xml {
    proxy_pass http://localhost:8000/sitemap.xml;
}
```

### Queue Worker (Supervisor)
Contact form emails are processed via queues. Do not rely on `php artisan queue:work` running manually. Use Supervisor to manage the process:
```ini
[program:portfolio-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/portfolio-backend/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=forge
numprocs=1
redirect_stderr=true
stdout_logfile=/path/to/portfolio-backend/worker.log
```
*Note: Always run `php artisan queue:restart` after a deployment.*

### Backups & Monitoring
- **Backups:** Use a tool like `spatie/laravel-backup` via a daily cron job to ensure database integrity.
- **Monitoring:** Implement application monitoring using Sentry or Flare to track exceptions in production.
- **Health Check:** Laravel provides a built-in health check at `https://api.your-domain.com/up`.

## Testing

```bash
# Frontend
npm run test

# Backend
php artisan test
```
