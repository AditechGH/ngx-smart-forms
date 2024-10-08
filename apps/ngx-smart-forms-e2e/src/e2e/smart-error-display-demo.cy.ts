/* eslint-disable cypress/unsafe-to-chain-command */
describe('SmartErrorDisplayDemoComponent E2E', () => {
  beforeEach(() => {
    cy.visit('/smart-error-display-demo');
  });

  describe('Basic Form Validation', () => {
    it('should remove error when username becomes valid', () => {
      cy.get('input[formControlName="username"]').type('validUsername').blur();
      cy.get('#usernameError').should('be.empty');
    });
  });

  describe('Custom Error Messages', () => {
    it('should display custom error message when username is too short', () => {
      cy.get('input[formControlName="customUsername"]').type('ab').blur();
      cy.get('#customUsernameError')
        .should('be.visible')
        .and('contain', 'Username must be at least 3 characters long.');
    });
  });

  describe('Custom Error Formatter', () => {
    it('should display custom error formatter message', () => {
      cy.get('input[formControlName="customFormatterUsername"]')
        .type('ab')
        .blur();
      cy.get('#customFormatterUsernameError')
        .should('be.visible')
        .and('contain', 'Minimum length is 5 characters.');
    });
  });

  describe('Custom Error Display Control', () => {
    it('should display error when email is invalid', () => {
      cy.get('input[formControlName="edcEmail"]').type('invalidEmail').blur();
      cy.get('#edcEmailError')
        .should('be.visible')
        .and('contain', 'Please enter a valid email address.');
    });
  });
});
