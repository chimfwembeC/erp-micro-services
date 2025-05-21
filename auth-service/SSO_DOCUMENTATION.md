# Single Sign-On (SSO) Documentation

This document provides comprehensive information about the SSO implementation in the TekRem ERP system using Laravel Sanctum.

## Overview

The SSO system allows users to authenticate once and access multiple services within the TekRem ERP ecosystem. It uses Laravel Sanctum for token-based authentication and supports both user authentication and service-to-service authentication.

## Architecture

The SSO system consists of the following components:

1. **Auth Service**: Central authentication provider that issues and validates tokens
2. **Client Services**: Services that rely on the Auth Service for authentication (CRM, ERP, Inventory, etc.)
3. **Token Storage**: Tokens are stored in the database and can be transmitted via cookies or headers

## Authentication Flow

### User Authentication

1. User submits credentials to the Auth Service
2. Auth Service validates credentials and issues a token
3. Token is stored in the client (cookie or local storage)
4. Client includes the token in subsequent requests
5. Services validate the token with the Auth Service

### Service-to-Service Authentication

1. Service requests a token from the Auth Service using service credentials
2. Auth Service validates service credentials and issues a token with specific abilities
3. Service includes the token in requests to other services
4. Services validate the token with the Auth Service

## API Endpoints

### User Authentication

#### Login
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password",
    "device_name": "browser"
  }
  ```
- **Response**:
  ```json
  {
    "token": "1|abcdefghijklmnopqrstuvwxyz123456",
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "roles": ["admin"],
      "primary_role": "admin",
      "permissions": ["view_users", "create_users"]
    },
    "message": "Login successful"
  }
  ```

#### Validate Token
- **URL**: `/api/auth/validate-token`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "valid": true,
    "user": {
      "id": 1,
      "name": "User Name",
      "email": "user@example.com",
      "roles": ["admin"],
      "primary_role": "admin",
      "permissions": ["view_users", "create_users"]
    }
  }
  ```

#### Logout
- **URL**: `/api/auth/logout`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "message": "Successfully logged out"
  }
  ```

### Service Authentication

#### Get Service Token
- **URL**: `/api/auth/service-token`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "service_id": "crm-service",
    "service_secret": "your-service-secret"
  }
  ```
- **Response**:
  ```json
  {
    "token": "2|abcdefghijklmnopqrstuvwxyz123456",
    "expires_at": "2023-05-17T12:00:00.000000Z",
    "service": {
      "id": 1,
      "name": "crm",
      "abilities": ["service:crm", "read:users"]
    },
    "message": "Service token created successfully"
  }
  ```

#### Validate Service Token
- **URL**: `/api/auth/validate-service-token`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "valid": true,
    "service": {
      "id": 1,
      "name": "crm",
      "abilities": ["service:crm", "read:users"]
    }
  }
  ```

## Web-Based SSO

For web applications, the SSO system also provides web routes:

- **Login**: `POST /sso/login`
- **Logout**: `POST /sso/logout`

These routes handle CSRF protection and cookie-based authentication.

## Integration Guide

### Client Service Integration

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

### Frontend Integration

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

## Testing

You can test the SSO system using the following curl commands:

```bash
# Login
curl -X POST \
  http://localhost:8000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@tekrem.com",
    "password": "password",
    "device_name": "curl-test"
}'

# Validate token
curl -X GET \
  http://localhost:8000/api/auth/validate-token \
  -H 'Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz123456'

# Get service token
curl -X POST \
  http://localhost:8000/api/auth/service-token \
  -H 'Content-Type: application/json' \
  -d '{
    "service_id": "crm-service",
    "service_secret": "your-service-secret"
}'

# Logout
curl -X POST \
  http://localhost:8000/api/auth/logout \
  -H 'Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz123456'
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
