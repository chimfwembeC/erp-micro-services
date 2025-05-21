#!/bin/bash

# TekRem ERP Startup Script
# This script starts all the microservices for the TekRem ERP system

# Function to start a service
start_service() {
    local service_name=$1
    local php_port=$2
    local vite_port=$3
    
    echo "Starting $service_name..."
    
    # Start PHP server
    gnome-terminal --tab --title="$service_name PHP Server" -- bash -c "cd $service_name && php artisan serve --port=$php_port; exec bash"
    
    # Start Vite server
    gnome-terminal --tab --title="$service_name Vite Server" -- bash -c "cd $service_name && VITE_PORT=$vite_port npm run dev; exec bash"
    
    echo "$service_name started on http://localhost:$php_port"
}

# Clear the terminal
clear

echo "====================================="
echo "  TekRem ERP System Startup Script  "
echo "====================================="
echo ""
echo "Starting all services..."
echo ""

# Start Auth Service
start_service "auth-service" 8000 5173

# Start CRM Service
start_service "crm-service" 8002 5174

# Check if Project Service exists and start it if it does
if [ -d "project-service" ]; then
    start_service "project-service" 8003 5175
fi

echo ""
echo "All services started successfully!"
echo ""
echo "Service URLs:"
echo "- Auth Service: http://localhost:8000"
echo "- CRM Service: http://localhost:8002"
if [ -d "project-service" ]; then
    echo "- Project Service: http://localhost:8003"
fi
echo ""
echo "To stop the services, close the terminal windows or press Ctrl+C in each terminal."
echo ""
