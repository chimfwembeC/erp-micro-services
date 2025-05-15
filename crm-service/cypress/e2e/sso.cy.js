// SSO Integration Tests
describe('Single Sign-On (SSO) Integration', () => {
  // Test variables
  const authServiceUrl = 'http://localhost:8000';
  const crmServiceUrl = 'http://localhost:8001';
  const testUser = {
    email: 'admin@tekrem.com',
    password: 'password'
  };

  beforeEach(() => {
    // Clear cookies before each test
    cy.clearCookies();
  });

  it('should redirect to auth service when accessing protected route without token', () => {
    // Visit the dashboard (protected route)
    cy.visit(`${crmServiceUrl}/dashboard`);

    // Should be redirected to auth service login page
    cy.url().should('include', `${authServiceUrl}/auth/login`);
  });

  it('should successfully authenticate and redirect back to CRM service', () => {
    // Visit the dashboard (protected route)
    cy.visit(`${crmServiceUrl}/dashboard`);

    // Should be redirected to auth service login page
    cy.url().should('include', `${authServiceUrl}/auth/login`);

    // Wait for React to render the form
    cy.wait(2000);

    // Login with test user - using more generic selectors since the form is rendered by React
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();

    // Should be redirected back to CRM service dashboard
    cy.url().should('include', `${crmServiceUrl}/dashboard`);

    // Should have the auth cookie
    cy.getCookie('tekrem_token').should('exist');
  });

  it('should maintain authentication across page navigation', () => {
    // First login
    cy.visit(`${crmServiceUrl}/dashboard`);
    cy.url().should('include', `${authServiceUrl}/auth/login`);

    // Wait for React to render the form
    cy.wait(2000);

    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', `${crmServiceUrl}/dashboard`);

    // Navigate to another protected page
    cy.visit(`${crmServiceUrl}/clients`);

    // Should not be redirected to login
    cy.url().should('include', `${crmServiceUrl}/clients`);
  });

  it('should logout and clear authentication', () => {
    // First login
    cy.visit(`${crmServiceUrl}/dashboard`);
    cy.url().should('include', `${authServiceUrl}/auth/login`);

    // Wait for React to render the form
    cy.wait(2000);

    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', `${crmServiceUrl}/dashboard`);

    // Wait for dashboard to load
    cy.wait(2000);

    // Look for logout button in various ways
    cy.get('button[type="button"]').contains('Logout', { matchCase: false }).click({ force: true });

    // Should be redirected to auth service logout
    cy.url().should('include', `${authServiceUrl}/logout`);

    // Cookie should be cleared
    cy.getCookie('tekrem_token').should('not.exist');

    // Try to access protected route again
    cy.visit(`${crmServiceUrl}/dashboard`);

    // Should be redirected to login
    cy.url().should('include', `${authServiceUrl}/auth/login`);
  });

  it('should handle invalid credentials', () => {
    // Visit the dashboard (protected route)
    cy.visit(`${crmServiceUrl}/dashboard`);

    // Should be redirected to auth service login page
    cy.url().should('include', `${authServiceUrl}/auth/login`);

    // Wait for React to render the form
    cy.wait(2000);

    // Login with invalid credentials
    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').type('wrong-password');
    cy.get('button[type="submit"]').click();

    // Should stay on login page with error
    cy.url().should('include', `${authServiceUrl}/auth/login`);

    // Wait for error message to appear
    cy.wait(2000);

    // Check for error message (might be different text)
    cy.contains(/invalid|incorrect|failed/i).should('be.visible');
  });

  it('should handle expired tokens', () => {
    // This test requires backend support to simulate an expired token
    // For now, we'll just verify that token validation is happening

    // First login
    cy.visit(`${crmServiceUrl}/dashboard`);
    cy.url().should('include', `${authServiceUrl}/auth/login`);

    // Wait for React to render the form
    cy.wait(2000);

    cy.get('input[type="email"]').type(testUser.email);
    cy.get('input[type="password"]').type(testUser.password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', `${crmServiceUrl}/dashboard`);

    // Manually set an invalid token
    cy.setCookie('tekrem_token', 'invalid-token');

    // Try to access protected route
    cy.visit(`${crmServiceUrl}/dashboard`);

    // Should be redirected to login
    cy.url().should('include', `${authServiceUrl}/auth/login`);
  });
});
