# CRM Service API Documentation

This document outlines the API endpoints provided by the CRM Service for inter-service communication.

## Authentication

All API endpoints are protected with Laravel Sanctum. You need to include a valid API token in the request headers:

```
Authorization: Bearer YOUR_API_TOKEN
```

## Client Endpoints

### Get All Clients

```
GET /api/clients
```

**Query Parameters:**
- `status` - Filter by client status (active, inactive, potential, former)
- `search` - Search by name, email, or company
- `sort_field` - Field to sort by (default: name)
- `sort_direction` - Sort direction (asc or desc)
- `per_page` - Number of results per page (default: 15)

**Response:**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "Client Name",
      "email": "client@example.com",
      "phone": "123-456-7890",
      "address": "123 Main St",
      "company": "Company Name",
      "website": "https://example.com",
      "status": "active",
      "notes": "Client notes",
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z",
      "created_by": {
        "id": 1,
        "name": "Admin User"
      },
      "updated_by": {
        "id": 1,
        "name": "Admin User"
      }
    }
  ],
  "first_page_url": "http://localhost:8000/api/clients?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "http://localhost:8000/api/clients?page=1",
  "links": [...],
  "next_page_url": null,
  "path": "http://localhost:8000/api/clients",
  "per_page": 15,
  "prev_page_url": null,
  "to": 1,
  "total": 1
}
```

### Get Client

```
GET /api/clients/{id}
```

**Response:**
```json
{
  "id": 1,
  "name": "Client Name",
  "email": "client@example.com",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "company": "Company Name",
  "website": "https://example.com",
  "status": "active",
  "notes": "Client notes",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "created_by": {
    "id": 1,
    "name": "Admin User"
  },
  "updated_by": {
    "id": 1,
    "name": "Admin User"
  }
}
```

### Create Client

```
POST /api/clients
```

**Request Body:**
```json
{
  "name": "New Client",
  "email": "newclient@example.com",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "company": "Company Name",
  "website": "https://example.com",
  "status": "active",
  "notes": "Client notes"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "New Client",
  "email": "newclient@example.com",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "company": "Company Name",
  "website": "https://example.com",
  "status": "active",
  "notes": "Client notes",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "created_by_id": 1,
  "updated_by_id": 1
}
```

### Update Client

```
PUT /api/clients/{id}
```

**Request Body:**
```json
{
  "name": "Updated Client",
  "email": "updatedclient@example.com",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "company": "Company Name",
  "website": "https://example.com",
  "status": "active",
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Client",
  "email": "updatedclient@example.com",
  "phone": "123-456-7890",
  "address": "123 Main St",
  "company": "Company Name",
  "website": "https://example.com",
  "status": "active",
  "notes": "Updated notes",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "created_by_id": 1,
  "updated_by_id": 1
}
```

### Delete Client

```
DELETE /api/clients/{id}
```

**Response:**
```
204 No Content
```

### Get Client Statistics

```
GET /api/client-statistics
```

**Response:**
```json
{
  "total": 10,
  "active": 5,
  "inactive": 2,
  "potential": 2,
  "former": 1
}
```

## Lead Endpoints

### Get All Leads

```
GET /api/leads
```

**Query Parameters:**
- `status` - Filter by lead status (new, contacted, qualified, unqualified, negotiation, won, lost)
- `search` - Search by name, email, or company
- `sort_field` - Field to sort by (default: created_at)
- `sort_direction` - Sort direction (asc or desc)
- `per_page` - Number of results per page (default: 15)

**Response:**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "Lead Name",
      "email": "lead@example.com",
      "phone": "123-456-7890",
      "company": "Company Name",
      "source": "Website",
      "status": "new",
      "notes": "Lead notes",
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z",
      "created_by": {
        "id": 1,
        "name": "Admin User"
      },
      "updated_by": {
        "id": 1,
        "name": "Admin User"
      }
    }
  ],
  "first_page_url": "http://localhost:8000/api/leads?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "http://localhost:8000/api/leads?page=1",
  "links": [...],
  "next_page_url": null,
  "path": "http://localhost:8000/api/leads",
  "per_page": 15,
  "prev_page_url": null,
  "to": 1,
  "total": 1
}
```

### Get Lead

```
GET /api/leads/{id}
```

**Response:**
```json
{
  "id": 1,
  "name": "Lead Name",
  "email": "lead@example.com",
  "phone": "123-456-7890",
  "company": "Company Name",
  "source": "Website",
  "status": "new",
  "notes": "Lead notes",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "created_by": {
    "id": 1,
    "name": "Admin User"
  },
  "updated_by": {
    "id": 1,
    "name": "Admin User"
  }
}
```

### Create Lead

```
POST /api/leads
```

**Request Body:**
```json
{
  "name": "New Lead",
  "email": "newlead@example.com",
  "phone": "123-456-7890",
  "company": "Company Name",
  "source": "Website",
  "status": "new",
  "notes": "Lead notes"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "New Lead",
  "email": "newlead@example.com",
  "phone": "123-456-7890",
  "company": "Company Name",
  "source": "Website",
  "status": "new",
  "notes": "Lead notes",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "created_by_id": 1,
  "updated_by_id": 1
}
```

### Update Lead

```
PUT /api/leads/{id}
```

**Request Body:**
```json
{
  "name": "Updated Lead",
  "email": "updatedlead@example.com",
  "phone": "123-456-7890",
  "company": "Company Name",
  "source": "Website",
  "status": "contacted",
  "notes": "Updated notes"
}
```

**Response:**
```json
{
  "id": 1,
  "name": "Updated Lead",
  "email": "updatedlead@example.com",
  "phone": "123-456-7890",
  "company": "Company Name",
  "source": "Website",
  "status": "contacted",
  "notes": "Updated notes",
  "created_at": "2023-01-01T00:00:00.000000Z",
  "updated_at": "2023-01-01T00:00:00.000000Z",
  "created_by_id": 1,
  "updated_by_id": 1
}
```

### Delete Lead

```
DELETE /api/leads/{id}
```

**Response:**
```
204 No Content
```

### Convert Lead to Client

```
POST /api/leads/{id}/convert
```

**Response:**
```json
{
  "message": "Lead converted to client successfully",
  "client": {
    "id": 1,
    "name": "Lead Name",
    "email": "lead@example.com",
    "phone": "123-456-7890",
    "company": "Company Name",
    "status": "active",
    "notes": "Lead notes\n\nConverted from lead on 2023-01-01 00:00:00",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "created_by_id": 1,
    "updated_by_id": 1
  },
  "lead": {
    "id": 1,
    "name": "Lead Name",
    "email": "lead@example.com",
    "phone": "123-456-7890",
    "company": "Company Name",
    "source": "Website",
    "status": "won",
    "notes": "Lead notes",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "created_by_id": 1,
    "updated_by_id": 1
  }
}
```

### Get Lead Statistics

```
GET /api/lead-statistics
```

**Response:**
```json
{
  "total": 10,
  "new": 3,
  "contacted": 2,
  "qualified": 1,
  "unqualified": 1,
  "negotiation": 1,
  "won": 1,
  "lost": 1
}
```

## Communication Endpoints

### Get All Communications

```
GET /api/communications
```

**Query Parameters:**
- `type` - Filter by communication type (email, call, meeting, note, other)
- `client_id` - Filter by client ID
- `lead_id` - Filter by lead ID
- `search` - Search by subject or content
- `sort_field` - Field to sort by (default: date)
- `sort_direction` - Sort direction (asc or desc)
- `per_page` - Number of results per page (default: 15)

**Response:**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "client_id": 1,
      "lead_id": null,
      "type": "email",
      "subject": "Meeting Follow-up",
      "content": "Thank you for the meeting...",
      "date": "2023-01-01T00:00:00.000000Z",
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z",
      "created_by_id": 1,
      "client": {
        "id": 1,
        "name": "Client Name"
      },
      "lead": null,
      "created_by": {
        "id": 1,
        "name": "Admin User"
      }
    }
  ],
  "first_page_url": "http://localhost:8000/api/communications?page=1",
  "from": 1,
  "last_page": 1,
  "last_page_url": "http://localhost:8000/api/communications?page=1",
  "links": [...],
  "next_page_url": null,
  "path": "http://localhost:8000/api/communications",
  "per_page": 15,
  "prev_page_url": null,
  "to": 1,
  "total": 1
}
```

### Get Client Communications

```
GET /api/clients/{clientId}/communications
```

**Response:**
```json
[
  {
    "id": 1,
    "client_id": 1,
    "lead_id": null,
    "type": "email",
    "subject": "Meeting Follow-up",
    "content": "Thank you for the meeting...",
    "date": "2023-01-01T00:00:00.000000Z",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "created_by_id": 1,
    "created_by": {
      "id": 1,
      "name": "Admin User"
    }
  }
]
```

### Get Lead Communications

```
GET /api/leads/{leadId}/communications
```

**Response:**
```json
[
  {
    "id": 2,
    "client_id": null,
    "lead_id": 1,
    "type": "call",
    "subject": "Initial Contact",
    "content": "Called to introduce our services...",
    "date": "2023-01-01T00:00:00.000000Z",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "created_by_id": 1,
    "created_by": {
      "id": 1,
      "name": "Admin User"
    }
  }
]
```

## Chat Endpoints

### Get Client Messages

```
GET /api/clients/{clientId}/messages
```

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "client_id": 1,
    "lead_id": null,
    "message": "Hello, how can I help you?",
    "is_from_user": true,
    "is_read": true,
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "user": {
      "id": 1,
      "name": "Admin User",
      "profile_photo_url": "https://ui-avatars.com/api/?name=Admin+User&color=7F9CF5&background=EBF4FF"
    }
  }
]
```

### Get Lead Messages

```
GET /api/leads/{leadId}/messages
```

**Response:**
```json
[
  {
    "id": 2,
    "user_id": 1,
    "client_id": null,
    "lead_id": 1,
    "message": "Hello, I'm interested in your services.",
    "is_from_user": false,
    "is_read": true,
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z",
    "user": {
      "id": 1,
      "name": "Admin User",
      "profile_photo_url": "https://ui-avatars.com/api/?name=Admin+User&color=7F9CF5&background=EBF4FF"
    }
  }
]
```

### Get Unread Messages

```
GET /api/messages/unread
```

**Response:**
```json
{
  "clientMessages": [
    {
      "id": 1,
      "user_id": 1,
      "client_id": 1,
      "lead_id": null,
      "message": "Hello, how can I help you?",
      "is_from_user": false,
      "is_read": false,
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z",
      "client": {
        "id": 1,
        "name": "Client Name"
      },
      "user": {
        "id": 1,
        "name": "Admin User",
        "profile_photo_url": "https://ui-avatars.com/api/?name=Admin+User&color=7F9CF5&background=EBF4FF"
      }
    }
  ],
  "leadMessages": []
}
```
