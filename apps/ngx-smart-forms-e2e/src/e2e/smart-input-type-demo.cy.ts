/* eslint-disable cypress/no-unnecessary-waiting */
/* eslint-disable cypress/unsafe-to-chain-command */
describe('Smart Input Type Demo - E2E Tests', () => {
  beforeEach(() => {
    // Visit the SmartInputDemo page
    cy.visit('/smart-input-type-demo'); // Replace with the actual URL or path
  });

  it('should create the SmartInputDemoComponent', () => {
    // Check if the demo component is visible
    cy.get('h2').contains('Smart Input Type Demo').should('be.visible');
  });

  describe('Enhanced Input Validation and Formatting', () => {
    it('should transform alphanumeric input (no spaces)', () => {
      cy.get('#alphanumeric-no-spaces')
        .type('Test 123!@#')
        .should('have.value', 'Test123');
    });

    it('should allow alphanumeric input with spaces', () => {
      cy.get('#alphanumeric-with-spaces')
        .type('Test 123!@#')
        .should('have.value', 'Test 123');
    });

    it('should validate numeric input without spaces', () => {
      cy.get('#numeric-no-spaces').type('123abc').should('have.value', '123');
    });

    it('should allow numeric input with spaces', () => {
      cy.get('#numeric-with-spaces')
        .type('123 abc')
        .should('have.value', '123 ');
    });

    it('should transform alpha input (no spaces)', () => {
      cy.get('#alpha-no-spaces').type('Test123').should('have.value', 'Test');
    });

    it('should allow alpha input with spaces', () => {
      cy.get('#alpha-with-spaces')
        .type('Test 123')
        .should('have.value', 'Test ');
    });

    it('should validate input based on custom pattern', () => {
      cy.get('#custom-pattern').type('123abc').should('have.value', '123');
    });

    it('should handle language-specific input (Spanish)', () => {
      cy.get('#language-specific-input')
        .type('testéñ123')
        .should('have.value', 'testéñ123');
    });

    it('should handle language-specific input (Arabic numerals)', () => {
      cy.get('#arabic-numerals').type('123٤٥٦abc').should('have.value', '٤٥٦');
    });

    it('should transform input to uppercase', () => {
      cy.get('#case-sensitive-input')
        .type('test123')
        .should('have.value', 'TEST123');
    });

    it('should work with password input type', () => {
      cy.get('#password').should('have.attr', 'type', 'password');
    });

    it('should debounce input validation', () => {
      cy.get('#debounce-input')
        .type('Test123')
        .wait(500) // Debounce time
        .should('have.value', 'Test123');
    });

    it('should handle language set with case transformation', () => {
      cy.get('#language-set-case-sensitivity')
        .type('tëst123')
        .should('have.value', 'tëst123');
    });

    it('should add .has-error class for invalid email input', () => {
      cy.get('#visual-feedback-input')
        .type('invalidEmail')
        .blur() // Simulate blur to trigger validation
        .should('have.class', 'has-error');
    });

    it('should not have .has-error class for valid email input', () => {
      cy.get('#visual-feedback-input')
        .clear()
        .type('test@example.com')
        .blur()
        .should('not.have.class', 'has-error');
    });
  });

  describe('Enhanced Form Validation', () => {
    it('should show error for invalid email', () => {
      cy.get('#email').type('invalidEmail').blur();

      cy.get('#email + div')
        .should('be.visible')
        .and('contain.text', 'Invalid Email');
    });

    it('should show error for invalid URL', () => {
      cy.get('#url').type('invalid-url').blur();

      cy.get('#url + div')
        .should('be.visible')
        .and('contain.text', 'Invalid URL format');
    });

    it('should show error for invalid phone number', () => {
      cy.get('#tel').type('abc123').blur();

      cy.get('#tel + div')
        .should('be.visible')
        .and('contain.text', 'Invalid phone number');
    });

    it('should not show errors for valid form inputs', () => {
      cy.get('#email').clear().type('test@example.com').blur();
      cy.get('#email + div').should('not.exist');

      cy.get('#url').clear().type('https://example.com').blur();
      cy.get('#url + div').should('not.exist');

      cy.get('#tel').clear().type('1234567890').blur();
      cy.get('#tel + div').should('not.exist');
    });
  });
});
