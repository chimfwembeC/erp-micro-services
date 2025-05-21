# TekRem ERP Startup Guide

This guide explains how to start all the services required for the TekRem ERP system.

## Services Overview

The TekRem ERP system consists of multiple microservices:

1. **Auth Service**
   - PHP Server: Port 8000
   - Vite Server: Port 5173
   - URL: http://localhost:8000

2. **CRM Service**
   - PHP Server: Port 8002
   - Vite Server: Port 5174
   - URL: http://localhost:8002

3. **Project Management Service** (Coming Soon)
   - PHP Server: Port 8003
   - Vite Server: Port 5175
   - URL: http://localhost:8003

## Starting the Services

### Option 1: Using the Startup Script (Recommended)

We've provided a startup script that will launch all services in separate terminal windows:

```bash
./start.sh
```

This script will:
- Start the Auth Service PHP server on port 8000
- Start the Auth Service Vite server on port 5173
- Start the CRM Service PHP server on port 8002
- Start the CRM Service Vite server on port 5174

Each service will run in its own terminal window, making it easy to monitor logs and stop individual services.

### Option 2: Manual Startup

If you prefer to start the services manually, follow these steps:

#### Auth Service

1. Open a terminal and navigate to the auth-service directory:
   ```bash
   cd auth-service
   ```

2. Start the PHP server:
   ```bash
   php artisan serve --port=8000
   ```

3. Open another terminal, navigate to the auth-service directory, and start the Vite server:
   ```bash
   cd auth-service
   npm run dev
   ```

#### CRM Service

1. Open a terminal and navigate to the crm-service directory:
   ```bash
   cd crm-service
   ```

2. Start the PHP server:
   ```bash
   php artisan serve --port=8002
   ```

3. Open another terminal, navigate to the crm-service directory, and start the Vite server:
   ```bash
   cd crm-service
   VITE_PORT=5174 npm run dev
   ```

## Accessing the Services

Once all services are running, you can access them at:

- Auth Service: http://localhost:8000
- CRM Service: http://localhost:8002

## Stopping the Services

### If Using the Startup Script

Simply close the terminal windows that were opened by the script.

### If Started Manually

Press `Ctrl+C` in each terminal window to stop the respective service.

## Troubleshooting

### Port Already in Use

If you see an error like "Address already in use", it means another process is already using that port. You can either:

1. Kill the process using the port:
   ```bash
   # For Linux/Mac
   sudo kill -9 $(lsof -t -i:8000)  # Replace 8000 with the port number

   # For Windows
   netstat -ano | findstr :8000  # Find the PID using port 8000
   taskkill /PID <PID> /F  # Kill the process with the found PID
   ```

2. Use a different port:
   ```bash
   # For PHP server
   php artisan serve --port=8002  # Use a different port

   # For Vite server
   VITE_PORT=5175 npm run dev  # Use a different port
   ```

### Database Connection Issues

If you encounter database connection issues, make sure:

1. Your database server (MySQL) is running
2. The database credentials in the `.env` files are correct
3. The databases specified in the `.env` files exist

### Other Issues

For other issues, check the logs in the terminal windows for error messages.
