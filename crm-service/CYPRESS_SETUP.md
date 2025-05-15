# Setting Up Cypress for SSO Testing

This guide explains how to set up and run Cypress tests for the Single Sign-On (SSO) functionality between the auth-service and crm-service.

## Installation

1. Install Cypress in the crm-service directory:

```bash
cd crm-service
npm install cypress --save-dev
```

2. Initialize Cypress:

```bash
npx cypress open
```

This will create the necessary Cypress directories and configuration files.

## Configuration

1. Update the `cypress.config.js` file:

```javascript
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8001',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
```

2. Create a `cypress.env.json` file to store environment variables:

```json
{
  "auth_service_url": "http://localhost:8000",
  "crm_service_url": "http://localhost:8001",
  "test_user_email": "admin@tekrem.com",
  "test_user_password": "password"
}
```

## Running the Tests

1. Make sure both the auth-service and crm-service are running:

```bash
# Terminal 1
cd auth-service
php artisan serve

# Terminal 2
cd crm-service
php artisan serve --port=8001
```

2. Run the Cypress tests:

```bash
# Open Cypress Test Runner
cd crm-service
npx cypress open

# Or run tests headlessly
npx cypress run
```

## Test Cases

The SSO integration tests cover the following scenarios:

1. Redirecting to auth service when accessing protected routes without a token
2. Successfully authenticating and redirecting back to the CRM service
3. Maintaining authentication across page navigation
4. Logging out and clearing authentication
5. Handling invalid credentials
6. Handling expired tokens

## Troubleshooting

If you encounter issues with the tests:

1. Check that both services are running on the correct ports
2. Verify that the SSO configuration in both `.env` files is correct
3. Check the browser console and server logs for errors
4. Make sure the test user exists in the database

## Adding More Tests

To add more test cases, create new files in the `cypress/e2e` directory or extend the existing `sso.cy.js` file.

For example, to test role-based access:

```javascript
it('should restrict access based on user role', () => {
  // Login as a user with limited permissions
  // Try to access admin-only routes
  // Verify access is denied
});
```
