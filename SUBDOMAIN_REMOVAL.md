# Subdomain Functionality Removal

This document summarizes the changes made to remove subdomain functionality from the TekRem microservices ecosystem.

## Overview

The TekRem ERP system previously used subdomains for different services (e.g., auth.tekrem.local, crm.tekrem.local). This approach has been removed in favor of using different ports on localhost for local development (e.g., localhost:8000, localhost:8001).

## Changes Made

### Auth Service

1. Updated `.env.example`:
   - Changed `SESSION_DOMAIN=.tekrem.local` to `SESSION_DOMAIN=null`
   - Changed `SESSION_SAME_SITE=none` to `SESSION_SAME_SITE=lax`
   - Removed subdomain references from `SANCTUM_STATEFUL_DOMAINS`

2. Updated `config/cors.php`:
   - Removed subdomain-specific URLs from `allowed_origins`
   - Removed subdomain patterns from `allowed_origins_patterns`

3. Updated `config/sanctum.php`:
   - Removed subdomain references from stateful domains list

4. Updated `config/session.php`:
   - Changed default same-site value from 'none' to 'lax'

### CRM Service

1. Updated `.env.example`:
   - Changed `SESSION_DOMAIN=.tekrem.local` to `SESSION_DOMAIN=null`

2. Updated `config/sanctum.php`:
   - Uncommented and updated stateful domains list to remove subdomain references

3. Updated `docs/SSO_IMPLEMENTATION.md`:
   - Removed cookie domain references
   - Updated cookie creation code to use null for domain

### Documentation Updates

1. Updated `README.md`:
   - Added section about subdomain functionality removal
   - Updated authentication configuration information

2. Updated `TODO.md`:
   - Added entry about subdomain functionality removal
   - Updated completed tasks list

3. Updated `prompt.txt`:
   - Updated authentication configuration requirements
   - Removed references to subdomains

## Benefits of This Change

1. **Simplified Development**: No need to configure hosts file or DNS for local development
2. **Easier Setup**: New developers can get started more quickly without subdomain configuration
3. **Reduced Complexity**: Fewer configuration points that could cause issues
4. **Better Compatibility**: Works better with standard development environments

## Local Development Access

Services can now be accessed at:
- Auth Service: http://localhost:8000
- CRM Service: http://localhost:8001
- Project Service: http://localhost:8002 (when implemented)
- Other services: http://localhost:800X (where X is the service number)

## Notes for Future Development

1. All new services should use the updated configuration approach without subdomains
2. Session and cookie configuration should use:
   - `SESSION_DOMAIN=null`
   - `SESSION_SAME_SITE=lax`
   - Proper CORS configuration for cross-service communication
3. Authentication between services should use token-based authentication without relying on shared cookies
