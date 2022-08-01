/// <reference types="cypress" />

describe('Form exists', () => {
    it.skip('Should_DisplaySSLPage_When_OpenedLoadIt', () => {
      cy.visit('/stableswap/liquidity');
      cy.get('[data-test-id="exchangeDetails"] [data-test-id="headerContent"]').should('contain', 'Exchange Details');
  
      // Check if title of the page is ok
      cy.get('[data-test-id="swapPageTitle"]').should('contain', 'Swap TEZ / QUIPU');
    });
  });
