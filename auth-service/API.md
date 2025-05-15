# Authentication & User Management Service API

This document outlines the API endpoints provided by the Authentication & User Management Service.

## Authentication Endpoints

### Login

```
POST /api/login
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

### Register

```
POST /api/register
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

### Logout

```
POST /api/logout
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
```

**Response:**
```json
{
  "message": "Logged out successfully"
}
```

## User Management Endpoints

### Get Current User

```
GET /api/user
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
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

### Get All Users

```
GET /api/users
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
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

### Get User by ID

```
GET /api/users/{id}
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
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

### Create User

```
POST /api/users
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
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
    }
  ]
}
```

### Update User

```
PUT /api/users/{id}
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
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

### Delete User

```
DELETE /api/users/{id}
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
```

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

## Role Management Endpoints

### Get All Roles

```
GET /api/roles
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
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

### Get Role by ID

```
GET /api/roles/{id}
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
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

### Create Role

```
POST /api/roles
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
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
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "permissions": [
    {
      "id": 1,
      "name": "view_users",
      "description": "Can view users"
    },
    {
      "id": 2,
      "name": "create_users",
      "description": "Can create users"
    },
    {
      "id": 3,
      "name": "edit_users",
      "description": "Can edit users"
    }
  ]
}
```

### Update Role

```
PUT /api/roles/{id}
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
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
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "permissions": [
    {
      "id": 1,
      "name": "view_users",
      "description": "Can view users"
    },
    {
      "id": 2,
      "name": "create_users",
      "description": "Can create users"
    },
    {
      "id": 3,
      "name": "edit_users",
      "description": "Can edit users"
    },
    {
      "id": 4,
      "name": "delete_users",
      "description": "Can delete users"
    }
  ]
}
```

### Delete Role

```
DELETE /api/roles/{id}
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
```

**Response:**
```json
{
  "message": "Role deleted successfully"
}
```

## Permission Management Endpoints

### Get All Permissions

```
GET /api/permissions
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
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

### Get Permission by ID

```
GET /api/permissions/{id}
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
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

### Create Permission

```
POST /api/permissions
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
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
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "roles": [
    {
      "id": 2,
      "name": "manager",
      "description": "Manager with limited access"
    },
    {
      "id": 3,
      "name": "admin",
      "description": "Administrator with full access"
    },
    {
      "id": 4,
      "name": "editor",
      "description": "Content editor and manager"
    }
  ]
}
```

### Update Permission

```
PUT /api/permissions/{id}
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
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
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "roles": [
    {
      "id": 3,
      "name": "admin",
      "description": "Administrator with full access"
    },
    {
      "id": 4,
      "name": "editor",
      "description": "Content editor and manager"
    }
  ]
}
```

### Delete Permission

```
DELETE /api/permissions/{id}
```

**Headers:**
```
Authorization: Bearer 1|abcdefghijklmnopqrstuvwxyz
```

**Response:**
```json
{
  "message": "Permission deleted successfully"
}
```
