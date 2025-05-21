#!/bin/bash

# Run the migrations
echo "Running migrations..."
php artisan migrate

# Run the customer role migration specifically
echo "Running customer role migration..."
php artisan migrate --path=database/migrations/2025_05_15_000000_create_customer_role.php

# Run the roles and permissions seeder
echo "Running roles and permissions seeder..."
php artisan db:seed --class=RolesAndPermissionsSeeder

# Clear view cache to ensure email templates are updated
echo "Clearing view cache..."
php artisan view:clear

# Clear route cache to ensure new routes are registered
echo "Clearing route cache..."
php artisan route:clear

# Clear config cache
echo "Clearing config cache..."
php artisan config:clear

echo "Done! Customer role has been set up with enhanced features."
