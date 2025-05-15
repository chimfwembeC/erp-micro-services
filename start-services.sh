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

# Function to check if a port is in use
is_port_in_use() {
    lsof -i:$1 > /dev/null 2>&1
    return $?
}

# Function to kill a process running on a specific port
kill_process_on_port() {
    print_info "Attempting to kill process on port $1..."
    pid=$(lsof -t -i:$1)
    if [ -n "$pid" ]; then
        kill -9 $pid
        print_success "Killed process $pid on port $1"
    else
        print_info "No process found on port $1"
    fi
}

# Function to start a service
start_service() {
    service_name=$1
    service_dir=$2
    php_port=$3
    vite_port=$4
    
    print_header "Starting $service_name Service"
    
    # Check if PHP port is in use
    if is_port_in_use $php_port; then
        print_info "Port $php_port is already in use."
        read -p "Do you want to kill the process using port $php_port? (y/n): " kill_php
        if [[ $kill_php == "y" || $kill_php == "Y" ]]; then
            kill_process_on_port $php_port
        else
            print_error "Cannot start $service_name PHP server on port $php_port. Port is in use."
            return 1
        fi
    fi
    
    # Check if Vite port is in use
    if is_port_in_use $vite_port; then
        print_info "Port $vite_port is already in use."
        read -p "Do you want to kill the process using port $vite_port? (y/n): " kill_vite
        if [[ $kill_vite == "y" || $kill_vite == "Y" ]]; then
            kill_process_on_port $vite_port
        else
            print_error "Cannot start $service_name Vite server on port $vite_port. Port is in use."
            return 1
        fi
    fi
    
    # Start PHP server
    print_info "Starting $service_name PHP server on port $php_port..."
    cd $service_dir
    php artisan serve --port=$php_port > /dev/null 2>&1 &
    php_pid=$!
    
    # Wait for PHP server to start
    sleep 2
    if ps -p $php_pid > /dev/null; then
        print_success "$service_name PHP server started on port $php_port (PID: $php_pid)"
    else
        print_error "Failed to start $service_name PHP server"
        return 1
    fi
    
    # Start Vite server
    print_info "Starting $service_name Vite server on port $vite_port..."
    cd $service_dir
    VITE_PORT=$vite_port npm run dev > /dev/null 2>&1 &
    vite_pid=$!
    
    # Wait for Vite server to start
    sleep 5
    if ps -p $vite_pid > /dev/null; then
        print_success "$service_name Vite server started on port $vite_port (PID: $vite_pid)"
    else
        print_error "Failed to start $service_name Vite server"
        return 1
    fi
    
    return 0
}

# Main script

print_header "TekRem ERP Services Startup"

# Define service configurations
# Format: [service_name, directory, php_port, vite_port]
services=(
    "Auth auth-service 8000 5173"
    "CRM crm-service 8001 5174"
)

# Start each service
for service in "${services[@]}"; do
    read -r name dir php_port vite_port <<< "$service"
    start_service "$name" "$dir" "$php_port" "$vite_port"
    echo ""
done

print_header "All Services Started"
echo "Auth Service: http://localhost:8000"
echo "CRM Service: http://localhost:8001"
echo ""
print_info "Press Ctrl+C to stop all services"

# Keep the script running to make it easier to stop all services
trap 'echo -e "\n${YELLOW}Stopping all services...${NC}"; pkill -P $$; exit 0' INT
wait
