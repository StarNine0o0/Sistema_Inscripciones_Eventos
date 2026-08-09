# ── Imagen base: PHP 8.5 con CLI 
FROM php:8.5-cli

# ── Dependencias del sistema operativo que PHP 
#    extensiones (mysql, imágenes, zip, etc.)
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

# ── Instalar Composer 
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# ── Instalar Node.js 20 
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# ── Carpeta de trabajo dentro del contenedor 
WORKDIR /var/www/html

# ── Copiar todo tu proyecto al contenedor 
COPY . .

# ── Instalar dependencias de PHP 
RUN composer install --no-dev --optimize-autoloader

# ── Instalar dependencias de Node y compilar React/Inertia con Vite
RUN npm install && npm run build

# ── Dar permisos de escritura a las carpetas que Laravel necesita
RUN chmod -R 775 storage bootstrap/cache

# ── Cachear la configuración de Laravel para producción 
RUN php artisan config:cache

EXPOSE 10000

# ── Comando de arranque: corre migraciones y levanta el servidor
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=$PORT
