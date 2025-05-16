# TekRem ERP System

This is a microservices-based ERP system for TekRem (Technology Remedies Innovations), a software startup based in Zambia.

## Architecture

The system consists of the following microservices:

1. **auth-service**: Authentication & User Management ✅
2. **project-service**: Project & Task Management (with time logs)
3. **crm-service**: CRM / Client Management ✅
4. **billing-service**: Billing & Invoicing
5. **hr-service**: HR & Team Collaboration
6. **support-service**: Support Ticketing
7. **dev-resource-service**: Developer Resource Hub
8. **analytics-service**: Analytics & Reporting Dashboard

## Technology Stack

- **Backend**: Laravel
- **Frontend**: Laravel Jetstream with Inertia + React
- **UI Components**: ShadCN UI with Tailwind CSS (40+ components)
- **Database**: MySQL via XAMPP
- **Email**: Mailtrap for development
- **Localization**: i18next with support for English and Zambian languages (Bemba, Nyanja, Tonga)
- **Real-time Communication**: Laravel Echo and Pusher
- **Workflow Automation**: n8n

## Development Setup

Each microservice is a separate Laravel Jetstream + React project. To set up a microservice:

```bash
composer create-project laravel/laravel service-name
cd service-name
composer require laravel/jetstream
php artisan jetstream:install inertia
npx laravel-jetstream-react@latest install
npm install
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input dialog card
npm run dev
php artisan migrate
```

### Starting All Services

We've provided startup scripts to easily run all services:

#### Linux/Mac:
```bash
./start.sh
```

#### Windows:
```bash
start.bat
```

These scripts will start all services with the correct ports in separate terminal windows.

For detailed instructions, see [STARTUP.md](STARTUP.md)

## Common Features Across All Microservices

All microservices implement the following features:

### UI/UX Features
- ShadCN UI components and theming for ALL forms and components
- Switch components instead of traditional checkboxes where appropriate
- Breadcrumbs for improved navigation
- Dark/light mode toggle
- Responsive design for mobile and desktop
- Role-based conditional navigation
- Role-based dashboard with visualizations
- Multilingual support (English, Bemba, Nyanja, Tonga)
- Toast notifications using sonner
- Charts and data visualizations using Recharts
- Proper error handling for WebSocket connections
- Graceful fallback when services are unavailable

### Infrastructure Features
- Email notifications using Mailtrap
- Form validation with error handling
- API endpoints for inter-service communication
- Role and permission-based access control

## Microservices Communication

Services communicate via REST APIs. Each service exposes its API endpoints in `routes/api.php`.

## Authentication

Each service currently handles its own authentication:

1. The auth-service has a complete authentication system (login, registration, password reset)
2. The crm-service has a simplified authentication system for development purposes
3. Each service maintains its own user database

### Important Authentication Configuration

1. **Correct APP_URL in .env files**:
   - Each microservice must have the correct APP_URL with the proper port:
   ```
   # auth-service/.env
   APP_URL=http://localhost:8000

   # crm-service/.env
   APP_URL=http://localhost:8001

   # project-service/.env
   APP_URL=http://localhost:8002
   ```

2. **Development Authentication**:
   - For development purposes, authentication in the CRM service is currently bypassed
   - When you click login or register, you'll be redirected directly to the dashboard
   - No actual authentication checks are performed
   - This is a temporary solution until proper authentication is implemented

3. **Subdomain and SSO Functionality Removed**:
   - The system no longer uses subdomains for different services
   - All services are accessed via different ports on localhost
   - Session and cookie configurations have been updated accordingly
   - Single Sign-On (SSO) functionality has been removed
   - Each service now handles its own authentication independently

## Database Migrations

Since all microservices share the same database, migrations are handled carefully to avoid conflicts:

1. All migrations include checks to prevent duplicate table creation:
   ```php
   if (!Schema::hasTable('table_name')) {
       Schema::create('table_name', function (Blueprint $table) {
           // Table structure
       });
   }
   ```

2. Migration order:
   - Run auth-service migrations first to create shared tables (users, roles, permissions)
   - Run other service migrations afterward, which will skip creating tables that already exist

This approach allows each service to be developed and deployed independently while maintaining data consistency.

## Localization

The system supports multiple languages using i18next:

### Important Localization Configuration Requirements

1. **Proper i18n directory structure**:
   ```
   resources/js/i18n/
   ├── index.ts                  # Main configuration file
   └── locales/
       ├── en/                   # English translations
       │   └── translation.json
       ├── bem/                  # Bemba translations
       │   └── translation.json
       ├── nya/                  # Nyanja translations
       │   └── translation.json
       └── toi/                  # Tonga translations
           └── translation.json
   ```

2. **Correct language codes**:
   - English: 'en'
   - Bemba: 'bem' (not 'bemba')
   - Nyanja: 'nya' (not 'nyanja')
   - Tonga: 'toi' (not 'tonga')

3. **Consistent LanguageSwitcher component**:
   - Import from '@/Components/LanguageSwitcher' (capital C)
   - Use in AppLayout.tsx and other components
   - Avoid duplicate components with different paths

## Real-time Communication

The system uses Laravel Echo and Pusher for real-time communication:
- Live chat functionality in the CRM service
- Real-time notifications
- WebSocket connections for instant updates

## n8n Workflow Automation

The system uses n8n for workflow automation, including:
- Task notifications
- Weekly reports
- CRM-to-Billing sync
- Lead to onboarding automation
- Support ticket escalation
- Timesheet reporting
- Automated invoicing
- Daily backups

## Default User Accounts

The following default user accounts are available for testing:

- **Admin User**:
  - Email: admin@tekrem.com
  - Password: password
  - Role: admin
  - Permissions: All permissions

- **Manager User**:
  - Email: test@example.com
  - Password: password
  - Role: manager
  - Permissions: Limited management permissions
## Microservice Details

### Authentication & User Management Service
- **Directory**: `auth-service/`
- **Description**: Handles user authentication, registration, and profile management.
- **Features**:
  - User registration and login
  - Profile management
  - Role and permission management
  - Two-factor authentication
  - API token management
  - Password reset functionality
  - Email verification
  - API endpoints for other microservices
  - Email notifications configuration with Mailtrap
  - Custom theme implementation with dark/light mode toggle
  - Guest layout implementation
  - Custom landing page with sections (partners, team, blogs, insights)
  - Contact, About, and Team pages
  - Privacy Policy and Terms of Service pages
  - Blog page
  - Complete shadcn UI component library integration (40+ components)
  - Update all forms and components to use shadcn UI components
  - Replace traditional checkboxes with Switch components where appropriate
  - Add breadcrumbs for improved navigation and user experience
  - Role-based conditional navigation
  - Multilingual support with i18next (English, Bemba, Nyanja, Tonga)
  - Role-based dashboard with charts and visualizations for different user roles
- **Tech Stack**: Laravel, Jetstream, Inertia.js, React, TypeScript, MySQL, ShadCN UI, i18next
- **Status**: 100% Complete

### CRM / Client Management Service
- **Directory**: `crm-service/`
- **Description**: Manages clients, leads, and communications.
- **Features**:
  - Client CRUD operations (Create, Read, Update, Delete)
  - Client database migrations and model
  - Client listing with pagination
  - Client details view with tabs for communications and tasks
  - Lead management functionality (Create, Read, Update, Delete)
  - Lead database migrations and model
  - Lead listing with pagination
  - Lead details view with communications tab
  - Lead to client conversion functionality
  - Communication tracking for clients and leads
  - Communication database migrations and model
  - Communication creation and editing
  - Communication listing in client and lead details
  - Live chat functionality with WebSockets
  - Chat database migrations and model
  - Real-time messaging with Pusher
  - Chat UI for clients and leads
  - Proper error handling for WebSocket connections
  - Graceful fallback when WebSocket services are unavailable
  - Modern landing page with ShadCN UI components
  - Toast notifications using sonner
  - Independent authentication in each service
  - Centralized user management
  - ShadCN UI integration with 40+ components
  - Dark/light mode toggle implementation
  - Multilingual support with i18next (English, Bemba, Nyanja, Tonga)
  - Breadcrumbs for improved navigation
  - Role-based conditional navigation
  - Mailtrap email configuration
- **Tech Stack**: Laravel, Jetstream, Inertia.js, React, TypeScript, MySQL, ShadCN UI, i18next, Pusher
- **Status**: 100% Complete
