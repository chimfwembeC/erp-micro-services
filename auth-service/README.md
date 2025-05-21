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
- Multilingual support (English, Bemba, Nyanja, Tonga)

## Technology Stack

- **Backend**: Laravel
- **Frontend**: Laravel Jetstream with Inertia + React
- **UI Components**: ShadCN UI with Tailwind CSS
- **Database**: MySQL via XAMPP
- **Internationalization**: i18next, react-i18next
- **Notifications**: Sonner Toast

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
- `GET /api/services`: Get all services (admin only)
- `GET /api/services/{id}`: Get a specific service (admin only)
- `POST /api/services`: Create a new service (admin only)
- `PUT /api/services/{id}`: Update a specific service (admin only)
- `DELETE /api/services/{id}`: Delete a specific service (admin only)
- `POST /api/services/{id}/regenerate-secret`: Regenerate a service secret (admin only)
- `POST /api/auth/service-token`: Get a service token using service credentials
- `GET /api/auth/validate-service-token`: Validate a service token
- `POST /api/language/change`: Change the user's language preference
- `GET /api/language/current`: Get the current language
- `GET /api/language/available`: Get all available languages

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

## Documentation

The following documentation files are available:

- [SSO Documentation](SSO_DOCUMENTATION.md): Information about the Single Sign-On implementation
- [Services Documentation](SERVICES_DOCUMENTATION.md): Guide to the service management functionality
- [API Documentation](README-API.md): Detailed API endpoint documentation
- [Internationalization Documentation](INTERNATIONALIZATION.md): Guide to the multilingual support system
- [Notifications Documentation](NOTIFICATIONS.md): Information about the toast notification system
- [ShadCN Components Guide](SHADCN_COMPONENTS.md): Overview of the UI components used in the system
- [Login Instructions](LOGIN_INSTRUCTIONS.md): Test user credentials and login information
