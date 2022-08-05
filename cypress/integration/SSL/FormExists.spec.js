/// <reference types="cypress" />

describe('Form exists', () => {
  beforeEach(() => {
    cy.visit('/stableswap/liquidity');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplaySSLPage_When_OpenedLoadIt', () => {
    cy.get('[data-test-id="SSLPageTitle"]').should('contain', 'Stableswap Liquidity');
  });
  it('Should_DisplayKusdUsdtzuUsd_When_PageIsLoaded', () => {
    cy.get('[data-test-id="farming-item-0"] [data-test-id="tokensSymbols"]').should('contain', 'KUSD / USDtz / uUSD')
  })
});
