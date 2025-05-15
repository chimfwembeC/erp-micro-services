// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

// Custom command for SSO login
Cypress.Commands.add('ssoLogin', (email, password) => {
  // Visit the dashboard (protected route)
  cy.visit('/dashboard');

  // Should be redirected to auth service login page
  cy.url().should('include', Cypress.env('auth_service_url') + '/auth/login');

  // Wait for React to render the form
  cy.wait(2000);

  // Login with test user - using more generic selectors since the form is rendered by React
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();

  // Should be redirected back to CRM service dashboard
  cy.url().should('include', '/dashboard');
});
