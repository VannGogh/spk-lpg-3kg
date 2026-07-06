FROM php:8.4-cli

# Install system dependencies & PHP extensions
RUN apt-get update -y && apt-get install -y \
    libpq-dev \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install pdo pdo_pgsql zip

# Install Node.js (for Vite/React)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# Setup permissions & dependencies
ENV COMPOSER_ALLOW_SUPERUSER=1
RUN composer install --no-dev --optimize-autoloader
RUN npm install
RUN npm run build

# Run database migrations and start Laravel server
CMD php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
