#!/bin/bash

# TekRem ERP Services Startup Script
# This script starts all the required services for the TekRem ERP system

# Text colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print section headers
print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

# Function to print info messages
print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Function to print error messages
print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Main script
print_header "TekRem ERP Services Startup"

# Start Auth Service
print_header "Starting Auth Service"
print_info "Starting Auth Service PHP server on port 8000..."
cd auth-service
gnome-terminal --title="Auth PHP Server" -- bash -c "php artisan serve --port=8000; exec bash"
print_success "Auth Service PHP server started on port 8000"

print_info "Starting Auth Service Vite server on port 5173..."
gnome-terminal --title="Auth Vite Server" -- bash -c "npm run dev; exec bash"
print_success "Auth Service Vite server started on port 5173"

# Start CRM Service
print_header "Starting CRM Service"
print_info "Starting CRM Service PHP server on port 8002..."
cd ../crm-service
gnome-terminal --title="CRM PHP Server" -- bash -c "php artisan serve --port=8002; exec bash"
print_success "CRM Service PHP server started on port 8002"

print_info "Starting CRM Service Vite server on port 5174..."
gnome-terminal --title="CRM Vite Server" -- bash -c "VITE_PORT=5174 npm run dev; exec bash"
print_success "CRM Service Vite server started on port 5174"

# Return to the root directory
cd ..

print_header "All Services Started"
echo "Auth Service: http://localhost:8000"
echo "CRM Service: http://localhost:8002"
echo ""
print_info "Each service is running in its own terminal window"
print_info "Close the terminal windows to stop the services"
