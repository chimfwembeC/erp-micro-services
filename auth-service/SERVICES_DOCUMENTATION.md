# Services Management Documentation

This document provides comprehensive information about the Services management functionality in the TekRem ERP system.

## Overview

The Services management functionality allows administrators to create, view, update, and delete service entries used for service-to-service authentication in the microservices architecture. Services are used to authenticate between different microservices in the TekRem ERP system.

## Key Concepts

### Service

A service represents a microservice in the TekRem ERP system that needs to authenticate with the auth-service. Each service has:

- **Name**: A unique identifier for the service (e.g., "crm", "inventory")
- **Description**: A description of the service's purpose
- **Service ID**: A unique identifier used for authentication (e.g., "crm-service")
- **Service Secret**: A secret key used for authentication
- **Permissions**: A list of permissions granted to the service
- **Status**: Active or inactive

## User Interface

The Services management functionality provides a user-friendly interface for managing services:

### Services List

The Services list page displays all services in the system with the following information:

- Service ID
- Name
- Description
- Permissions
- Status (Active/Inactive)
- Created date
- Actions (View, Edit, Delete)

### Create Service

The Create Service page allows administrators to create a new service with the following fields:

- Name (required)
- Description
- Service ID (required)
- Permissions
- Status (Active/Inactive)

### Edit Service

The Edit Service page allows administrators to update an existing service with the same fields as the Create Service page.

### View Service

The View Service page displays detailed information about a service, including:

- Service information (ID, name, description, service ID)
- Service secret (hidden by default, can be revealed)
- Permissions
- Status
- Created date
- API usage examples

The View Service page also provides the ability to regenerate the service secret.

## Permissions

The following permissions are used for Services management:

- **view_services**: Allows viewing the list of services and service details
- **create_services**: Allows creating new services
- **edit_services**: Allows editing existing services and regenerating service secrets
- **delete_services**: Allows deleting services

By default, these permissions are assigned to the admin role. The manager role has the view_services permission only.

## API Endpoints

The Services management functionality exposes the following API endpoints:

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

### Service Management

#### Get All Services
- **URL**: `/api/services`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  [
    {
      "id": 1,
      "name": "crm",
      "description": "Customer Relationship Management Service",
      "service_id": "crm-service",
      "permissions": ["read:users", "read:roles"],
      "is_active": true,
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z"
    }
  ]
  ```

#### Get Service
- **URL**: `/api/services/{id}`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "id": 1,
    "name": "crm",
    "description": "Customer Relationship Management Service",
    "service_id": "crm-service",
    "service_secret": "your-service-secret",
    "permissions": ["read:users", "read:roles"],
    "is_active": true,
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  }
  ```

#### Create Service
- **URL**: `/api/services`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
  ```json
  {
    "name": "inventory",
    "description": "Inventory Management Service",
    "service_id": "inventory-service",
    "permissions": ["read:users"],
    "is_active": true
  }
  ```
- **Response**:
  ```json
  {
    "id": 2,
    "name": "inventory",
    "description": "Inventory Management Service",
    "service_id": "inventory-service",
    "service_secret": "generated-service-secret",
    "permissions": ["read:users"],
    "is_active": true,
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  }
  ```

#### Update Service
- **URL**: `/api/services/{id}`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer {token}`
- **Body**:
  ```json
  {
    "name": "inventory",
    "description": "Updated Inventory Management Service",
    "service_id": "inventory-service",
    "permissions": ["read:users", "read:roles"],
    "is_active": true
  }
  ```
- **Response**:
  ```json
  {
    "id": 2,
    "name": "inventory",
    "description": "Updated Inventory Management Service",
    "service_id": "inventory-service",
    "permissions": ["read:users", "read:roles"],
    "is_active": true,
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  }
  ```

#### Delete Service
- **URL**: `/api/services/{id}`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "message": "Service deleted successfully"
  }
  ```

#### Regenerate Service Secret
- **URL**: `/api/services/{id}/regenerate-secret`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer {token}`
- **Response**:
  ```json
  {
    "id": 2,
    "service_secret": "new-generated-service-secret",
    "message": "Service secret regenerated successfully"
  }
  ```

## Integration Guide

To integrate a service with the auth-service, follow these steps:

1. Create a new service in the Services management interface
2. Note the service ID and service secret
3. Configure your service to use these credentials when requesting a token
4. Use the token in requests to other services

Example code for requesting a service token:

```php
$response = Http::post('http://auth-service.example.com/api/auth/service-token', [
    'service_id' => 'your-service-id',
    'service_secret' => 'your-service-secret',
]);

$token = $response->json()['token'];
```

## Best Practices

1. **Secure Service Secrets**: Treat service secrets like passwords. Store them securely in environment variables or a secure vault.
2. **Limit Permissions**: Only grant the permissions that a service actually needs.
3. **Regenerate Secrets Regularly**: Periodically regenerate service secrets to enhance security.
4. **Monitor Usage**: Keep track of which services are accessing your APIs and review logs regularly.
5. **Deactivate Unused Services**: Set services to inactive when they are not in use.

## Troubleshooting

### Common Issues

1. **Authentication Fails**: Verify that the service ID and service secret are correct.
2. **Permission Denied**: Check that the service has the necessary permissions.
3. **Service Inactive**: Ensure the service is marked as active.

### Debugging

1. Check the Laravel logs in `storage/logs/laravel.log`
2. Enable debug mode in `.env` by setting `APP_DEBUG=true`
3. Use the token validation endpoint to check if a token is valid
