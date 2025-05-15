# TekRem ERP System - Getting Started

This document provides commands and instructions to help you continue your journey with the TekRem ERP system when opening Augment for this project.

> **IMPORTANT**: This file should be updated whenever new features are added to the project. The same applies to the prompt.txt and TODO.md files to ensure they reflect the current state of the project.

## Starting with Augment

When opening this project with Augment, use the following command to get started:

```bash
# Start Augment with this project
augment /path/to/tekrem/erp
```

Once Augment is open, you can ask it to:

1. "Show me the current project status and what needs to be done next"
2. "Help me continue working on the auth service"
3. "What are the requirements for the next microservice to implement?"

## Quick Start Commands

### 1. View Project Status and Requirements

To get a quick overview of the project status and requirements, run these commands:

```bash
# View the project requirements
cat prompt.txt

# View the current progress and next steps
cat TODO.md
```

### 2. Auth Service (Current Status: 100% Complete)

To continue working on the Auth Service:

```bash
# Navigate to the auth service directory
cd auth-service

# Start the development server
php artisan serve

# In a separate terminal, start the Vite development server
npm run dev
```

The Auth Service is now complete with all features implemented, including:
- User authentication and management
- Role and permission management
- Email notifications with Mailtrap
- ShadCN UI components
- Role-based conditional navigation
- Multilingual support for English and Zambian languages (Bemba, Nyanja, Tonga)

### 3. Start Project & Task Management Service (Next Microservice)

To start working on the Project & Task Management Service:

```bash
# Create a new Laravel project for the Project & Task Management Service
cd ..
composer create-project laravel/laravel project-service

# Navigate to the project service directory
cd project-service

# Install Jetstream with Inertia + React
composer require laravel/jetstream
php artisan jetstream:install inertia --teams --dark

# Install NPM dependencies
npm install

# Install additional dependencies for ShadCN UI
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-slot @radix-ui/react-dropdown-menu @radix-ui/react-label
npm install tailwindcss-animate
npm install sonner

# Install i18next for multilingual support
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend

# Install Recharts for data visualization
npm install recharts

# Set up ShadCN UI
npx shadcn-ui@latest init

# When prompted, choose:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - Tailwind CSS config: tailwind.config.js
# - CSS file: resources/css/app.css
# - React server components: No
# - Components directory: resources/js/components/ui
# - Utilities directory: resources/js/lib/utils.ts

# Install common ShadCN UI components
npx shadcn-ui@latest add button card avatar dropdown-menu sheet navigation-menu tabs alert dialog toast sonner form input checkbox select textarea

# Set up Mailtrap for email notifications
# Update .env file with Mailtrap credentials:
echo "MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tekrem@example.com
MAIL_FROM_NAME=\"TekRem ERP\"" >> .env

# Copy theme context and mode toggle from auth service
mkdir -p resources/js/lib
cp ../auth-service/resources/js/lib/theme-context.tsx resources/js/lib/
cp ../auth-service/resources/js/lib/utils.ts resources/js/lib/
mkdir -p resources/js/Components
cp ../auth-service/resources/js/Components/ModeToggle.tsx resources/js/Components/

# Copy i18n setup from auth service
mkdir -p resources/js/i18n/locales
cp -r ../auth-service/resources/js/i18n/* resources/js/i18n/

# Copy permissions hook from auth service
mkdir -p resources/js/Hooks
cp ../auth-service/resources/js/Hooks/usePermissions.ts resources/js/Hooks/

# Build assets
npm run build

# Run migrations (note: run auth-service migrations first)
php artisan migrate

# Start the development server
php artisan serve

# In a separate terminal, start the Vite development server
npm run dev
```

### 4. Start CRM / Client Management Service

To start working on the CRM / Client Management Service:

```bash
# Create a new Laravel project for the CRM Service
cd ..
composer create-project laravel/laravel crm-service

# Navigate to the CRM service directory
cd crm-service

# Install Jetstream with Inertia + React
composer require laravel/jetstream
php artisan jetstream:install inertia --teams --dark

# Install NPM dependencies
npm install

# Install additional dependencies for ShadCN UI
npm install class-variance-authority clsx tailwind-merge lucide-react
npm install @radix-ui/react-slot @radix-ui/react-dropdown-menu @radix-ui/react-label
npm install tailwindcss-animate
npm install sonner

# Install i18next for multilingual support
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend

# Install Recharts for data visualization
npm install recharts

# Set up ShadCN UI
npx shadcn-ui@latest init

# When prompted, choose:
# - Style: Default
# - Base color: Slate
# - CSS variables: Yes
# - Tailwind CSS config: tailwind.config.js
# - CSS file: resources/css/app.css
# - React server components: No
# - Components directory: resources/js/components/ui
# - Utilities directory: resources/js/lib/utils.ts

# Install common ShadCN UI components
npx shadcn-ui@latest add button card avatar dropdown-menu sheet navigation-menu tabs alert dialog toast sonner form input checkbox select textarea

# Set up Mailtrap for email notifications
# Update .env file with Mailtrap credentials:
echo "MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tekrem@example.com
MAIL_FROM_NAME=\"TekRem ERP\"" >> .env

# Copy theme context and mode toggle from auth service
mkdir -p resources/js/lib
cp ../auth-service/resources/js/lib/theme-context.tsx resources/js/lib/
cp ../auth-service/resources/js/lib/utils.ts resources/js/lib/
mkdir -p resources/js/Components
cp ../auth-service/resources/js/Components/ModeToggle.tsx resources/js/Components/

# Copy i18n setup from auth service
mkdir -p resources/js/i18n/locales
cp -r ../auth-service/resources/js/i18n/* resources/js/i18n/

# Copy permissions hook from auth service
mkdir -p resources/js/Hooks
cp ../auth-service/resources/js/Hooks/usePermissions.ts resources/js/Hooks/

# Build assets
npm run build

# Run migrations (after running auth-service migrations)
php artisan migrate

# Start the development server
php artisan serve

# In a separate terminal, start the Vite development server
npm run dev
```

## Project Structure

The TekRem ERP system consists of 8 microservices:

1. **Authentication & User Management** (100% complete)
2. **Project & Task Management** (Not started)
3. **CRM / Client Management** (Not started)
4. **Billing & Invoicing** (Not started)
5. **HR & Team Collaboration** (Not started)
6. **Support Ticketing** (Not started)
7. **Developer Resource Hub** (Not started)
8. **Analytics & Reporting Dashboard** (Not started)

Each microservice is a separate Laravel application with Jetstream, Inertia, and React.

## Development Workflow

1. Complete one microservice at a time
2. Follow the requirements in the prompt.txt file
3. Update the TODO.md file as you make progress
4. Implement the guest layout and pages for each microservice
5. Ensure each microservice has API endpoints for inter-service communication
6. **IMPORTANT**: All microservices MUST implement the following features from the auth service:

   **UI/UX Features:**
   - ShadCN UI components and theming (40+ components)
   - Dark/light mode toggle
   - Responsive design for mobile and desktop
   - Role-based conditional navigation using the usePermissions hook
   - Role-based dashboard with visualizations specific to each user role
   - Charts and data visualizations using Recharts
   - Multilingual support with i18next for English and Zambian languages
   - Consistent app layout and navigation structure
   - Toast notifications using sonner

   **Infrastructure Features:**
   - Email notifications using Mailtrap
   - Form validation with error handling
   - API endpoints for inter-service communication
   - Role and permission-based access control
   - Proper error handling and user feedback

   **Development Patterns:**
   - TypeScript for type safety
   - React hooks for state management
   - Inertia.js for server-client communication
   - Consistent folder structure
   - Component reuse across services

## Maintaining Documentation

### When Adding New Features

Whenever a new feature is added to any microservice:

1. **Update TODO.md**:
   ```bash
   # Open TODO.md and update the status of completed tasks
   nano TODO.md
   # or
   code TODO.md
   ```
   - Move the task from "In Progress" to "Completed"
   - Add any new tasks that were identified during development

2. **Update prompt.txt** (if necessary):
   ```bash
   # Open prompt.txt and add any new requirements or specifications
   nano prompt.txt
   # or
   code prompt.txt
   ```
   - Add details about new features
   - Update any changed requirements
   - Document any architectural decisions

3. **Update GETTING_STARTED.md** (this file):
   ```bash
   # Open GETTING_STARTED.md and add any new commands or instructions
   nano GETTING_STARTED.md
   # or
   code GETTING_STARTED.md
   ```
   - Add new commands for working with the feature
   - Update the project structure if needed
   - Add any new resources or references

### Documentation Checklist

Before considering a feature complete, ensure:

- [ ] Feature is implemented and tested
- [ ] TODO.md is updated to reflect completion
- [ ] prompt.txt includes any new requirements
- [ ] GETTING_STARTED.md includes instructions for the feature
- [ ] README.md in the microservice directory is updated (if applicable)

### Using Augment for Documentation Updates

Augment can help you maintain documentation efficiently. Use these prompts:

1. For updating TODO.md after completing features:
   ```
   I've just completed [feature name]. Please update the TODO.md file to mark this task as completed and suggest any follow-up tasks.
   ```

2. For updating prompt.txt with new requirements:
   ```
   I've added [feature name] with the following specifications: [details]. Please update the prompt.txt file to include these new requirements.
   ```

3. For updating GETTING_STARTED.md with new commands:
   ```
   I've added [feature name]. Please update the GETTING_STARTED.md file with instructions for using this feature.
   ```

4. For checking if documentation is complete:
   ```
   I've completed [feature name]. Please check if all documentation (TODO.md, prompt.txt, and GETTING_STARTED.md) is up to date.
   ```

## Database Migrations

Since all microservices share the same database, migrations are handled carefully to avoid conflicts:

### Migration Strategy

1. All migrations include checks to prevent duplicate table creation:
   ```php
   if (!Schema::hasTable('table_name')) {
       Schema::create('table_name', function (Blueprint $table) {
           // Table structure
       });
   }
   ```

2. Migration order:
   ```bash
   # First, run auth-service migrations to create shared tables
   cd auth-service
   php artisan migrate

   # Then, run other service migrations
   cd ../crm-service
   php artisan migrate
   ```

3. Shared tables:
   - `users`: User accounts and profile information
   - `password_reset_tokens`: Password reset tokens
   - `sessions`: User sessions
   - `personal_access_tokens`: API tokens
   - `roles`: User roles
   - `permissions`: User permissions
   - `role_user`: Role-user pivot table
   - `permission_role`: Permission-role pivot table

This approach allows each service to be developed and deployed independently while maintaining data consistency.

## Next Steps

1. Start the Project & Task Management Service
2. Implement project and task CRUD operations
3. Add time logging functionality
4. Create Kanban board interface
5. Implement multilingual support for Project & Task Management Service

## Useful Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Inertia.js Documentation](https://inertiajs.com/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [ShadCN UI Components](https://ui.shadcn.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React i18next Documentation](https://react.i18next.com/)
- [i18next Documentation](https://www.i18next.com/)

## ShadCN UI Components

The TekRem ERP system uses ShadCN UI components for a consistent and modern user interface. A comprehensive set of 40+ components has been integrated into the auth-service, including:

- Form components: Button, Input, Textarea, Checkbox, Select, Radio Group, Switch, Slider, Form
- Navigation components: Navigation Menu, Breadcrumb, Tabs, Pagination
- Feedback components: Alert, Toast, Progress, Skeleton
- Display components: Card, Avatar, Badge, Tooltip, Popover
- Layout components: Drawer, Sheet, Sidebar, Resizable
- And many more!

For detailed information on how to use these components, refer to the `SHADCN_COMPONENTS.md` file in the auth-service directory.

```bash
# View the ShadCN UI components documentation
cat auth-service/SHADCN_COMPONENTS.md
```

## Authentication Across Microservices

The TekRem ERP system implements Single Sign-On (SSO) authentication across all microservices:

### Authentication Flow

1. **Single Sign-On (SSO)**: Users log in once through the auth-service
2. **JWT Token**: Upon successful login, the auth-service issues a JWT token
3. **Token Storage**: The token is stored in a secure HTTP-only cookie
4. **Token Validation**: Other microservices validate this token for protected routes
5. **Shared User Database**: All microservices connect to the same user database table

### Implementation Details

The auth-service provides these endpoints for SSO:
- `/api/auth/validate-token`: Validates the token and returns user information
- `/api/auth/user`: Returns the authenticated user's information

The CRM service implements:
- `SsoController`: Handles callbacks and user information
- `ValidateAuthToken` middleware: Validates tokens with the auth service
- `SsoServiceProvider`: Sets up a custom authentication guard

For detailed information, see [AUTHENTICATION.md](crm-service/AUTHENTICATION.md)

## Role-Based Navigation and Dashboard

The TekRem ERP system implements role-based navigation and dashboards that conditionally render content based on user permissions:

### Role-Based Navigation

- Admin users can see all navigation items
- Users with specific permissions can only see relevant navigation items
- The navigation is implemented using the `usePermissions` hook that checks user roles and permissions
- The `AppLayout` component uses these permissions to conditionally render navigation items

### Role-Based Dashboard

The dashboard displays different content based on the user's role:

**Admin Dashboard:**
- System overview with user statistics
- User activity charts and role distribution
- Recent users list
- Role permissions overview

**Manager Dashboard:**
- Team overview with member statistics
- Project status charts and task completion metrics
- Team members list
- Active projects with progress tracking

**User Dashboard:**
- Personal task statistics
- Assigned tasks with status and priority
- Account information
- Personal metrics

To modify the role-based navigation:

```bash
# Edit the permissions hook
code auth-service/resources/js/Hooks/usePermissions.ts

# Edit the app layout
code auth-service/resources/js/Layouts/AppLayout.tsx
```

## Multilingual Support

The TekRem ERP system supports multiple languages using i18next:

- English (default)
- Bemba (Zambian language)
- Nyanja (Zambian language)
- Tonga (Zambian language)

The language switcher is available in the top navigation bar. To add or modify translations:

```bash
# Edit English translations
code auth-service/resources/js/i18n/locales/en/translation.json

# Edit Bemba translations
code auth-service/resources/js/i18n/locales/bem/translation.json

# Edit Nyanja translations
code auth-service/resources/js/i18n/locales/nya/translation.json

# Edit Tonga translations
code auth-service/resources/js/i18n/locales/toi/translation.json
```

To add a new language:

1. Create a new translation file in the `auth-service/resources/js/i18n/locales` directory
2. Add the language to the `languages` object in `auth-service/resources/js/i18n/index.ts`
3. Update the `resources` object in the same file to include the new language

## Implementing Required Features in New Microservices

When creating a new microservice, follow these steps to ensure all required features are implemented:

### 1. Copy Common Components and Utilities

Copy these essential components and utilities from the auth service:

```bash
# Create necessary directories
mkdir -p resources/js/lib
mkdir -p resources/js/Components
mkdir -p resources/js/Hooks
mkdir -p resources/js/i18n/locales
mkdir -p resources/js/components/ui

# Copy theme context and utilities
cp ../auth-service/resources/js/lib/theme-context.tsx resources/js/lib/
cp ../auth-service/resources/js/lib/utils.ts resources/js/lib/

# Copy common components
cp ../auth-service/resources/js/Components/ModeToggle.tsx resources/js/Components/
cp ../auth-service/resources/js/Components/LanguageSwitcher.tsx resources/js/Components/

# Copy hooks
cp ../auth-service/resources/js/Hooks/usePermissions.ts resources/js/Hooks/
cp ../auth-service/resources/js/Hooks/useTypedPage.ts resources/js/Hooks/
cp ../auth-service/resources/js/Hooks/useRoute.ts resources/js/Hooks/

# Copy i18n setup and translations
cp -r ../auth-service/resources/js/i18n/* resources/js/i18n/
```

### 2. Set Up Layout Components

Create or copy these layout components:

```bash
# Copy layout components
mkdir -p resources/js/Layouts
cp ../auth-service/resources/js/Layouts/AppLayout.tsx resources/js/Layouts/
cp ../auth-service/resources/js/Layouts/GuestLayout.tsx resources/js/Layouts/
```

### 3. Initialize Bootstrap with i18next

Update your bootstrap.ts file to include i18next:

```typescript
// resources/js/bootstrap.ts
import axios from 'axios';
import _ from 'lodash';
import '@/i18n';

window._ = _;

// Rest of your bootstrap code...
```

### 4. Update App.tsx to Include Theme Provider

Ensure your App.tsx includes the ThemeProvider:

```typescript
// resources/js/app.tsx
import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from '@/lib/theme-context';

const appName = import.meta.env.VITE_APP_NAME || 'TekRem';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);

    root.render(
      <ThemeProvider defaultTheme="system" storageKey="tekrem-theme">
        <App {...props} />
      </ThemeProvider>
    );
  },
  progress: {
    color: '#4B5563',
  },
});
```

### 5. Set Up Mailtrap for Email Notifications

Update your .env file with Mailtrap credentials:

```
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=tekrem@example.com
MAIL_FROM_NAME="TekRem ERP"
```

### 6. Create Email Templates

Create email templates in the `resources/views/emails` directory, following the pattern from the auth service.

### 7. Implement Role-Based Navigation

Ensure your layout components use the usePermissions hook to conditionally render navigation items based on user roles and permissions.

### 8. Test All Features

Before considering the microservice ready for production, test all these features:

- Dark/light mode toggle
- Language switching
- Role-based navigation
- Role-based dashboard with charts and visualizations
- Email notifications
- Form validation
- Toast notifications
- Mobile responsiveness

Remember to check the prompt.txt and TODO.md files regularly to stay on track with the project requirements and progress.
