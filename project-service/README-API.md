# Authentication & User Management Service API

This document outlines the API endpoints provided by the Authentication & User Management Service.

## Base URL

All API endpoints are relative to the base URL of the auth-service:

```
http://localhost:8000/api
```

## Authentication

All API endpoints (except for login and register) require authentication using Laravel Sanctum. Include the following header in your requests:

```
Authorization: Bearer YOUR_API_TOKEN
```

## Endpoints

### Authentication

#### Login

```
POST /login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password",
  "device_name": "browser"
}
```

**Response:**
```json
{
  "token": "1|abcdefghijklmnopqrstuvwxyz"
}
```

#### Register

```
POST /register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password",
  "password_confirmation": "password",
  "device_name": "browser"
}
```

**Response:**
```json
{
  "token": "1|abcdefghijklmnopqrstuvwxyz"
}
```

#### Logout

```
POST /logout
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

### User Management

#### Get Current User

```
GET /user
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "email_verified_at": "2023-01-01T00:00:00.000000Z",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "roles": [
    {
      "id": 1,
      "name": "user",
      "description": "Regular user"
    }
  ]
}
```

#### Get All Users

```
GET /users
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified_at": "2023-01-01T00:00:00.000000Z",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "roles": [
      {
        "id": 1,
        "name": "user",
        "description": "Regular user"
      }
    ]
  }
]
```

#### Get User by ID

```
GET /users/{id}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "email_verified_at": "2023-01-01T00:00:00.000000Z",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "roles": [
    {
      "id": 1,
      "name": "user",
      "description": "Regular user"
    }
  ]
}
```

#### Create User

```
POST /users
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password",
  "password_confirmation": "password",
  "roles": [1, 2]
}
```

**Response:**
```json
{
  "id": 2,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}
```

#### Update User

```
PUT /users/{id}
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "newpassword",
  "password_confirmation": "newpassword",
  "roles": [1, 2, 3]
}
```

**Response:**
```json
{
  "id": 2,
  "name": "Jane Smith",
  "email": "jane@example.com",
  "email_verified_at": "2023-01-01T00:00:00.000000Z",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}
```

#### Delete User

```
DELETE /users/{id}
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

### Role Management

#### Get All Roles

```
GET /roles
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "user",
    "description": "Regular user",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "permissions": [
      {
        "id": 1,
        "name": "view_users",
        "description": "Can view users"
      }
    ]
  }
]
```

#### Get Role by ID

```
GET /roles/{id}
```

**Response:**
```json
{
  "id": 1,
  "name": "user",
  "description": "Regular user",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "permissions": [
    {
      "id": 1,
      "name": "view_users",
      "description": "Can view users"
    }
  ]
}
```

#### Create Role

```
POST /roles
```

**Request Body:**
```json
{
  "name": "editor",
  "description": "Content editor",
  "permissions": [1, 2, 3]
}
```

**Response:**
```json
{
  "id": 4,
  "name": "editor",
  "description": "Content editor",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}
```

#### Update Role

```
PUT /roles/{id}
```

**Request Body:**
```json
{
  "name": "editor",
  "description": "Content editor and manager",
  "permissions": [1, 2, 3, 4]
}
```

**Response:**
```json
{
  "id": 4,
  "name": "editor",
  "description": "Content editor and manager",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}
```

#### Delete Role

```
DELETE /roles/{id}
```

**Response:**
```json
{
  "message": "Role deleted successfully"
}
```

### Permission Management

#### Get All Permissions

```
GET /permissions
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "view_users",
    "description": "Can view users",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "roles": [
      {
        "id": 1,
        "name": "user",
        "description": "Regular user"
      },
      {
        "id": 2,
        "name": "manager",
        "description": "Manager with limited access"
      },
      {
        "id": 3,
        "name": "admin",
        "description": "Administrator with full access"
      }
    ]
  }
]
```

#### Get Permission by ID

```
GET /permissions/{id}
```

**Response:**
```json
{
  "id": 1,
  "name": "view_users",
  "description": "Can view users",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "roles": [
    {
      "id": 1,
      "name": "user",
      "description": "Regular user"
    },
    {
      "id": 2,
      "name": "manager",
      "description": "Manager with limited access"
    },
    {
      "id": 3,
      "name": "admin",
      "description": "Administrator with full access"
    }
  ]
}
```

#### Create Permission

```
POST /permissions
```

**Request Body:**
```json
{
  "name": "manage_content",
  "description": "Can manage content",
  "roles": [2, 3, 4]
}
```

**Response:**
```json
{
  "id": 11,
  "name": "manage_content",
  "description": "Can manage content",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}
```

#### Update Permission

```
PUT /permissions/{id}
```

**Request Body:**
```json
{
  "name": "manage_content",
  "description": "Can manage all content",
  "roles": [3, 4]
}
```

**Response:**
```json
{
  "id": 11,
  "name": "manage_content",
  "description": "Can manage all content",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z"
}
```

#### Delete Permission

```
DELETE /permissions/{id}
```

**Response:**
```json
{
  "message": "Permission deleted successfully"
}
```
