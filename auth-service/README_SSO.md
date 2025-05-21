# TekRem ERP SSO Implementation

This document provides an overview of the Single Sign-On (SSO) implementation for the TekRem ERP system.

## Overview

The TekRem ERP system uses Laravel Sanctum for token-based authentication across multiple microservices. The auth-service acts as the central authentication provider, issuing and validating tokens for users and services.

## Architecture

The SSO system consists of the following components:

1. **Auth Service**: Central authentication provider that issues and validates tokens
2. **Client Services**: Services that rely on the Auth Service for authentication (CRM, ERP, Inventory, etc.)
3. **Token Storage**: Tokens are stored in the database and can be transmitted via cookies or headers

## Key Components

### Controllers

- **SsoController**: Handles web-based SSO authentication
- **SsoApiController**: Handles API-based SSO authentication
- **ServiceAuthController**: Handles service-to-service authentication

### Models

- **User**: Represents a user in the system with roles and permissions
- **Service**: Represents a service in the system with service credentials

### Middleware

- **CheckSsoToken**: Verifies SSO tokens and redirects unauthenticated users

## Setup

To set up the SSO system, run the following command:

```bash
./setup-sso.sh
```

This script will:

1. Run the migrations to create the necessary database tables
2. Run the seeders to create the initial services
3. Clear the caches to ensure the changes take effect

## Usage

### User Authentication

Users can authenticate through:

- API: `POST /api/auth/login` with email and password
- Web: `POST /sso/login` with email and password

Example API request:

```bash
curl -X POST \
  http://localhost:8000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@tekrem.com",
    "password": "password",
    "device_name": "curl-test"
}'
```

### Service Authentication

Services can authenticate through:

- API: `POST /api/auth/service-token` with service_id and service_secret

Example API request:

```bash
curl -X POST \
  http://localhost:8000/api/auth/service-token \
  -H 'Content-Type: application/json' \
  -d '{
    "service_id": "crm-service",
    "service_secret": "your-service-secret"
}'
```

### Token Validation

Tokens can be validated through:

- API: `GET /api/auth/validate-token` with the token in the Authorization header
- Service tokens: `GET /api/auth/validate-service-token` with the token in the Authorization header

Example API request:

```bash
curl -X GET \
  http://localhost:8000/api/auth/validate-token \
  -H 'Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz123456'
```

### Logout

Users can logout through:

- API: `POST /api/auth/logout` with the token in the Authorization header
- Web: `POST /sso/logout` with the token in the Authorization header

Example API request:

```bash
curl -X POST \
  http://localhost:8000/api/auth/logout \
  -H 'Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz123456'
```

## Client Service Integration

To integrate a client service with the SSO system, follow these steps:

1. Add the following middleware to your client service:

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class VerifySsoToken
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->bearerToken();
        
        if (!$token) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        
        // Validate the token with the auth service
        $response = Http::withToken($token)
            ->get(config('services.auth.url') . '/api/auth/validate-token');
            
        if (!$response->successful() || !($response->json()['valid'] ?? false)) {
            return response()->json(['message' => 'Invalid token'], 401);
        }
        
        // Add user data to the request
        $request->merge(['auth_user' => $response->json()['user']]);
        
        return $next($request);
    }
}
```

2. Register the middleware in your client service:

```php
// In app/Http/Kernel.php
protected $routeMiddleware = [
    // ...
    'sso.auth' => \App\Http\Middleware\VerifySsoToken::class,
];
```

3. Add configuration for the auth service:

```php
// In config/services.php
'auth' => [
    'url' => env('AUTH_SERVICE_URL', 'http://localhost:8000'),
],
```

4. Use the middleware to protect routes:

```php
Route::middleware('sso.auth')->group(function () {
    Route::get('/dashboard', 'DashboardController@index');
});
```

## Frontend Integration

For frontend applications, you can use the following code to handle authentication:

```javascript
// authService.js
import axios from 'axios';

const AUTH_URL = process.env.VUE_APP_AUTH_URL;

export default {
    async login(email, password) {
        const response = await axios.post(`${AUTH_URL}/api/auth/login`, {
            email,
            password,
            device_name: 'browser'
        });
        
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        return response.data;
    },
    
    logout() {
        const token = localStorage.getItem('token');
        
        if (token) {
            axios.post(`${AUTH_URL}/api/auth/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        }
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    
    getToken() {
        return localStorage.getItem('token');
    },
    
    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    isAuthenticated() {
        return !!this.getToken();
    }
};
```

## Troubleshooting

### Common Issues

1. **Token Not Accepted**: Ensure the token is being sent in the Authorization header with the Bearer prefix.
2. **CORS Issues**: Make sure the client domain is included in the `stateful` array in `config/sanctum.php`.
3. **Token Expiration**: Tokens expire after the time specified in `config/sanctum.php`. Request a new token if needed.
4. **Service Authentication Fails**: Verify the service credentials in the database.

### Debugging

1. Check the Laravel logs in `storage/logs/laravel.log`
2. Enable debug mode in `.env` by setting `APP_DEBUG=true`
3. Use the token validation endpoint to check if a token is valid

## Further Documentation

For more detailed information, see the [SSO_DOCUMENTATION.md](SSO_DOCUMENTATION.md) file.
