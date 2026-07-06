#!/usr/bin/env bash
set -e

echo "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

echo "Installing NPM dependencies..."
npm install

echo "Building Vite assets..."
npm run build

echo "Clearing Laravel caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo "Running Database Migrations..."
php artisan migrate --force

echo "Build Completed!"
