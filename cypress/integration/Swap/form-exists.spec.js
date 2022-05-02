/// <reference types="cypress" />

describe('Form exists', () => {
  it('Should_DisplayExchangeDetails_When_OpenedSwapPage', () => {
    // Go to the swap page from home page
    cy.visit('/');
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="navigationButton-1"]').click();

    // Check if Title 'Exchange Details' ok
    cy.get('[data-test-id="exchangeDetails"] [data-test-id="headerContent"]').should('contain', 'Exchange Details');

    // Check if title of the page is ok
    cy.get('[data-test-id="swapPageTitle"]').should('contain', 'Swap TEZ / QUIPU');
  });
});
