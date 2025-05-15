@echo off
echo === TekRem ERP Services Startup ===
echo.

echo === Starting Auth Service ===
echo Starting Auth Service PHP server on port 8000...
cd auth-service
start "Auth PHP Server" cmd /k php artisan serve --port=8000
echo Auth Service PHP server started on port 8000

echo Starting Auth Service Vite server on port 5173...
start "Auth Vite Server" cmd /k npm run dev
echo Auth Service Vite server started on port 5173

echo === Starting CRM Service ===
echo Starting CRM Service PHP server on port 8002...
cd ../crm-service
start "CRM PHP Server" cmd /k php artisan serve --port=8002
echo CRM Service PHP server started on port 8002

echo Starting CRM Service Vite server on port 5174...
start "CRM Vite Server" cmd /k set VITE_PORT=5174 && npm run dev
echo CRM Service Vite server started on port 5174

cd ..

echo.
echo === All Services Started ===
echo Auth Service: http://localhost:8000
echo CRM Service: http://localhost:8002
echo.
echo Each service is running in its own command window
echo Close the command windows to stop the services
echo.
pause
