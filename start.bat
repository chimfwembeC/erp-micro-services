@echo off
REM TekRem ERP Startup Script for Windows
REM This script starts all the microservices for the TekRem ERP system

cls
echo =====================================
echo   TekRem ERP System Startup Script  
echo =====================================
echo.
echo Starting all services...
echo.

REM Start Auth Service PHP Server
start "Auth Service PHP Server" cmd /k "cd auth-service && php artisan serve --port=8000"

REM Start Auth Service Vite Server
start "Auth Service Vite Server" cmd /k "cd auth-service && npm run dev"

REM Start CRM Service PHP Server
start "CRM Service PHP Server" cmd /k "cd crm-service && php artisan serve --port=8002"

REM Start CRM Service Vite Server
start "CRM Service Vite Server" cmd /k "cd crm-service && set VITE_PORT=5174 && npm run dev"

REM Check if Project Service exists and start it if it does
if exist project-service (
    REM Start Project Service PHP Server
    start "Project Service PHP Server" cmd /k "cd project-service && php artisan serve --port=8003"
    
    REM Start Project Service Vite Server
    start "Project Service Vite Server" cmd /k "cd project-service && set VITE_PORT=5175 && npm run dev"
)

echo.
echo All services started successfully!
echo.
echo Service URLs:
echo - Auth Service: http://localhost:8000
echo - CRM Service: http://localhost:8002
if exist project-service (
    echo - Project Service: http://localhost:8003
)
echo.
echo To stop the services, close the terminal windows or press Ctrl+C in each terminal.
echo.
