# TekRem ERP System - Getting Started Guide

This guide will help you set up and start working on the TekRem ERP microservices ecosystem.

## Prerequisites

Before you begin, make sure you have the following installed:

- PHP 8.1 or higher
- Composer
- Node.js (v16 or higher)
- npm or yarn
- MySQL (via XAMPP or standalone)
- Git

## Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/tekrem-erp.git
   cd tekrem-erp
   ```

2. **Set up the database**:
   - Start your MySQL server (via XAMPP or standalone)
   - Create a database for each service (or a single shared database)
   - Default database names:
     - `tekrem_auth` for auth-service
     - `tekrem_crm` for crm-service
     - `tekrem_project` for project-service (when implemented)

## Setting Up a New Microservice

To set up a new microservice, follow these steps:

1. **Clone the auth-service as a template**:
   ```bash
   cp -r auth-service new-service-name
   cd new-service-name
   ```

2. **Update the .env file**:
   ```
   APP_NAME="TekRem New Service Name"
   APP_URL=http://localhost:800X  # Choose an unused port
   DB_DATABASE=tekrem_new_service_name
   ```

3. **Install dependencies**:
   ```bash
   composer install
   npm install
   ```

4. **Generate application key**:
   ```bash
   php artisan key:generate
   ```

5. **Run migrations**:
   ```bash
   php artisan migrate
   ```

6. **Start the service**:
   ```bash
   php artisan serve --port=800X
   ```

7. **In a separate terminal, start the Vite server**:
   ```bash
   VITE_PORT=517X npm run dev  # Choose an unused port
   ```

## Working with Existing Services

### Auth Service (Port 8000)

The Auth Service is the base template for all other services. It includes:

- User authentication and management
- Role and permission management
- ShadCN UI components
- Multilingual support
- Dark/light mode toggle

To start the Auth Service:

```bash
cd auth-service
php artisan serve --port=8000
```

In a separate terminal:
```bash
cd auth-service
npm run dev
```

### CRM Service (Port 8002)

The CRM Service manages clients, leads, and communications. It includes:

- Client and lead management
- Communication tracking
- Live chat functionality with WebSockets
- All base features from the Auth Service

To start the CRM Service:

```bash
cd crm-service
php artisan serve --port=8002
```

In a separate terminal:
```bash
cd crm-service
VITE_PORT=5174 npm run dev
```

## Development Workflow

1. **Start all services** using the provided script:
   ```bash
   ./start.sh
   ```

2. **Access the services** in your browser:
   - Auth Service: http://localhost:8000
   - CRM Service: http://localhost:8002
   - Project Service: http://localhost:8003 (when implemented)

3. **Login with default credentials**:
   - Admin: admin@tekrem.com / password
   - Manager: test@example.com / password

## Common Development Tasks

### Adding a New ShadCN Component

```bash
cd service-name
npx shadcn-ui@latest add component-name
```

### Adding a New Translation

Add your translations to:
```
resources/js/i18n/locales/[language-code]/translation.json
```

Supported language codes:
- English: 'en'
- Bemba: 'bem'
- Nyanja: 'nya'
- Tonga: 'toi'

### Creating a New Page

1. Create a React component in `resources/js/Pages/`
2. Add a route in `routes/web.php`
3. Use Inertia's `<Link>` component for navigation

## Troubleshooting

### Port Already in Use

If a port is already in use, you can either:

1. Kill the process using the port:
   ```bash
   # For Linux/Mac
   sudo kill -9 $(lsof -t -i:8000)  # Replace 8000 with the port number
   ```

2. Use a different port:
   ```bash
   php artisan serve --port=8001  # Use a different port
   VITE_PORT=5175 npm run dev  # For Vite server
   ```

### Database Connection Issues

If you encounter database connection issues:

1. Check that your MySQL server is running
2. Verify the database credentials in the `.env` file
3. Make sure the database exists

## Next Steps

After setting up the services, refer to:

- [README.md](README.md) for an overview of the project
- [TODO.md](TODO.md) for the current task list
- [STARTUP.md](STARTUP.md) for detailed instructions on starting all services
- [PROMPT.md](PROMPT.md) for the project requirements and specifications
