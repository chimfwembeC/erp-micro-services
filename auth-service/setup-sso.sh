#!/bin/bash

# Run the migrations
echo "Running migrations..."
php artisan migrate

# Run the services migration specifically
echo "Running services migration..."
php artisan migrate --path=database/migrations/2025_05_16_000000_create_services_table.php

# Run the seeders
echo "Running seeders..."
php artisan db:seed --class=ServicesSeeder

# Clear caches
echo "Clearing caches..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

echo "SSO setup complete!"
echo "You can now use the following endpoints for SSO:"
echo "- POST /api/auth/login - Login via API"
echo "- POST /api/auth/service-token - Get a service token"
echo "- GET /api/auth/validate-token - Validate a token (requires authentication)"
echo "- POST /api/auth/logout - Logout (requires authentication)"
echo "- POST /sso/login - Login via web"
echo "- POST /sso/logout - Logout via web (requires authentication)"
