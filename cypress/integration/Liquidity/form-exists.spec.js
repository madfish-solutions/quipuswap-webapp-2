/// <reference types="cypress" />

describe('Form exists', () => {
  before(() => {
    //before each 'it' go to liquidity tab'
    cy.visit('/');
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="navigationButton-2"]').click();
  });
  it('Should_DisplayExchangeDetails_When_OpenedLiquidityPage', () => {
    // Check if Title 'Pool Details' ok
    cy.get('[data-test-id="poolDetails"] [data-test-id="headerContent"]').should('contain', 'Pool Details');
  });
  it('Should_DisplayPageTitle_When_OpenedLiquidityPage', () => {
    cy.get('[data-test-id="liquidityPageTitle"]').should('contain', 'Liquidity');
  });
  it('Should_HaveTezInFirstField_When_PageIsLoaded', () => {
    cy.get(
      '[data-test-id="liquidityPageTokenSelect"] [data-test-id="addLiquidityTokenA"] [data-test-id="tokenSelectButton"]'
    ).should('contain', 'TEZ');
  });

  it('Should_HaveQuipuInSecondField_When_PageIsLoaded', () => {
    cy.get(
      '[data-test-id="liquidityPageTokenSelect"] [data-test-id="addLiquidityTokenB"] [data-test-id="tokenSelectButton"]'
    ).should('contain', 'QUIPU');
  });
});
