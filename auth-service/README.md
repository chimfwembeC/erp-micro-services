# Authentication & User Management Service

This microservice is part of the TekRem ERP system and is responsible for authentication and user management.

## Features

- User registration and authentication
- User profile management
- Two-factor authentication
- API token management
- Role and permission management
- Password reset functionality
- Email verification

## Technology Stack

- **Backend**: Laravel
- **Frontend**: Laravel Jetstream with Inertia + React
- **UI Components**: ShadCN UI with Tailwind CSS
- **Database**: MySQL via XAMPP

## API Endpoints

The service exposes the following API endpoints for other microservices to consume:

- `POST /api/login`: Authenticate a user
- `POST /api/register`: Register a new user
- `GET /api/user`: Get the authenticated user
- `PUT /api/user`: Update the authenticated user
- `GET /api/users`: Get all users (admin only)
- `GET /api/users/{id}`: Get a specific user (admin only)
- `PUT /api/users/{id}`: Update a specific user (admin only)
- `DELETE /api/users/{id}`: Delete a specific user (admin only)
- `GET /api/roles`: Get all roles (admin only)
- `POST /api/roles`: Create a new role (admin only)
- `GET /api/permissions`: Get all permissions (admin only)

## Development Setup

```bash
# Install dependencies
composer install
npm install

# Run migrations
php artisan migrate

# Start the development server
php artisan serve

# In another terminal, start the frontend
npm run dev
```

## Database Schema

The service uses the following database tables:

- `users`: Stores user information
- `password_reset_tokens`: Stores password reset tokens
- `personal_access_tokens`: Stores API tokens
- `sessions`: Stores session information
- `roles`: Stores role information
- `permissions`: Stores permission information
- `role_user`: Pivot table for roles and users
- `permission_role`: Pivot table for permissions and roles
