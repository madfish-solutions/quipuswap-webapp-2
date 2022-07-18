/// <reference types="cypress" />

describe('Title', () => {
  beforeEach(() => {
    cy.visit('/swap');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplayCorrectTitle_When_OpenedSwapPage', () => {
    cy.get('[data-test-id="swapPageTitle"]').should('contain', 'Swap TEZ / QUIPU');
  });
  it('Should_DisplayTezInFromForm_When_PageIsLoaded', () => {
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="from"] [data-test-id="changeToken"]')
      .should('contain', 'TEZ');
  });
  it('Should_DisplayQuipuInToForm_When_PageIsLoaded', () => {
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="to"] [data-test-id="changeToken"]')
      .should('contain', 'QUIPU');
  });
});
