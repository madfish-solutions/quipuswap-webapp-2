/// <reference types="cypress" />

describe('Form exists', () => {
  it('Should_DisplayExchangeDetails_When_OpenedRLiquidityPage', () => {
    // Go to the remove page from home page
    cy.visit('/');
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="navigationButton-Liquidity"]').click();
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="cardTab-1"]').click();

    // Check if Title 'Pool Details' ok
    cy.get('[data-test-id="poolDetails"] [data-test-id="headerContent"]').should('contain', 'Pool Details');
  });
  it('Should_DisplayPageTitle_When_OpenedRLiquidityPage', () => {
    cy.get('[data-test-id="liquidityPageTitle"]').should('contain', 'Liquidity');
  });
  it('Should_HaveTezQuipuPair_When_PageIsLoaded', () => {
    cy.get(
      '[data-test-id="liquidityPageTokenSelect"] [data-test-id="positionSelectInput"] [data-test-id="selectLPButton"]'
    ).should('contain', 'TEZ / QUIPU');
  });
});
