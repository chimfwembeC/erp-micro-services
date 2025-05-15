# TekRem CRM Service

This is the CRM (Customer Relationship Management) service for TekRem, a microservices-based ERP system for a Zambian software startup.

## Features

- Client management
- Lead tracking
- Communication history
- Task management
- Live chat (coming soon)
- Reporting and analytics

## Technology Stack

- **Backend**: Laravel
- **Frontend**: Laravel Jetstream with Inertia + React
- **UI Components**: ShadCN UI with Tailwind CSS
- **Database**: MySQL via XAMPP
- **Email**: Mailtrap for development

## Current Progress

- ✅ Basic Laravel Jetstream setup with Inertia + React
- ✅ ShadCN UI integration with 40+ components
- ✅ Dark/light mode toggle implementation
- ✅ Multilingual support with i18next (English, Bemba, Nyanja, Tonga)
- ✅ Breadcrumbs for improved navigation
- ✅ Role-based conditional navigation
- ✅ Mailtrap email configuration
- ✅ Client CRUD operations
- ✅ Lead management functionality
- ✅ Client communication tracking
- ✅ Live chat functionality with WebSockets
- ✅ API endpoints for inter-service communication
- ✅ Role-based dashboard with visualizations
- ✅ Single Sign-On (SSO) integration with auth service
- ✅ Token-based authentication across microservices
- ✅ Centralized user management

## Setup Instructions

1. Clone the repository
2. Navigate to the crm-service directory
3. Install PHP dependencies:
   ```bash
   composer install
   ```
4. Install NPM dependencies:
   ```bash
   npm install
   ```
5. Copy .env.example to .env and configure your environment:
   ```bash
   cp .env.example .env
   ```
6. Generate application key:
   ```bash
   php artisan key:generate
   ```
7. Run migrations:
   ```bash
   php artisan migrate
   ```
8. Build assets:
   ```bash
   npm run build
   ```
9. Start the development server:
   ```bash
   php artisan serve
   ```
10. In a separate terminal, start the Vite development server:
    ```bash
    npm run dev
    ```

## Local Development Setup

The CRM service is configured to run on localhost. To set up:

1. Clone the repository and navigate to the crm-service directory
2. Install dependencies:
   ```bash
   composer install
   npm install
   ```
3. Copy .env.example to .env:
   ```bash
   cp .env.example .env
   ```
4. Generate application key:
   ```bash
   php artisan key:generate
   ```
5. Run migrations:
   ```bash
   php artisan migrate
   ```
6. Start the development server:
   ```bash
   php artisan serve
   ```
7. In a separate terminal, start the Vite development server:
   ```bash
   npm run dev
   ```
8. Access the CRM service at http://localhost:8001

## Direct Authentication

The CRM service now uses direct authentication instead of SSO. Users can log in directly through the CRM service without needing to authenticate through a separate auth service.

### Authentication Flow

1. User visits the login page at `/login`
2. After entering credentials, the user is redirected to the dashboard
3. All protected routes are accessible after login

### Testing Authentication

For development and testing purposes, authentication is currently bypassed. When you click the login or register button, you'll be redirected directly to the dashboard without any actual authentication checks.

## Development Guidelines

### UI Components

Use ShadCN UI components for all UI elements. The following components are available:

- Form components: Button, Input, Textarea, Checkbox, Select, Radio Group, Switch, Slider, Form
- Navigation components: Navigation Menu, Breadcrumb, Tabs, Pagination
- Feedback components: Alert, Toast, Progress, Skeleton
- Display components: Card, Avatar, Badge, Tooltip, Popover
- Layout components: Drawer, Sheet, Sidebar, Resizable

### Multilingual Support

The CRM service supports multiple languages:

- English (default)
- Bemba (Zambian language)
- Nyanja (Zambian language)
- Tonga (Zambian language)

To add or modify translations, edit the JSON files in the `resources/js/i18n/locales` directory.

### Role-Based Access

The CRM service implements role-based access control:

- Admin users can access all features
- Manager users can access client and lead management features
- User roles can only access assigned clients and leads

Use the `usePermissions` hook to check user permissions in your components.

## Next Steps

All planned features have been implemented! The CRM service is now complete and ready for integration with other microservices.

## License

This project is proprietary software owned by TekRem.
