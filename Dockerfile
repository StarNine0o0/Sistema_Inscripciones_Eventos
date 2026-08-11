# ── Imagen base: PHP 8.5 con CLI (línea de comandos) ──────────────────
FROM php:8.5-cli

# ── Dependencias del sistema operativo que PHP necesita para compilar
#    extensiones (mysql, imágenes, zip, etc.) ──────────────────────────
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring exif pcntl bcmath gd zip

# ── Instalar Composer (el gestor de dependencias de PHP/Laravel) ──────
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ── Instalar Node.js 20 (necesario para compilar los assets de Vite/React) ─
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# ── Carpeta de trabajo dentro del contenedor ───────────────────────────
WORKDIR /var/www/html

# ── Copiar todo tu proyecto al contenedor ──────────────────────────────
COPY . .

# ── Instalar dependencias de PHP (sin las de desarrollo) ───────────────
RUN composer install --no-dev --optimize-autoloader

# ── Instalar dependencias de Node desde cero (evita el bug de binarios
#    nativos de Rollup/esbuild cuando el lockfile viene de otro sistema
#    operativo, como macOS) y compilar React/Inertia con Vite ──────────
RUN rm -f package-lock.json && npm install && npm run build

# ── Dar permisos de escritura a las carpetas que Laravel necesita ──────
RUN chmod -R 775 storage bootstrap/cache

# ── Puerto interno (Render inyecta su propio $PORT en tiempo de ejecución) ─
EXPOSE 10000

# ── Comando de arranque: limpia caché vieja, cachea con las variables
#    reales (que solo existen en este momento, no durante el build),
#    corre migraciones y levanta el servidor ─────────────────────────────
CMD php artisan config:clear && php artisan config:cache && php artisan route:cache && php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=$PORT