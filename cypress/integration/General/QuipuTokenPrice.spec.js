/// <reference types="cypress" />

describe('QUIPU price', () => {
  it('Should_DisplayQuipuPrice_When_PageIsLoaded', () => {
    // Go to the home page
    cy.visit('/');
    // Find Quipu Price
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="quipuTokenPrice"]').should('not.contain', '?');
  });
});
