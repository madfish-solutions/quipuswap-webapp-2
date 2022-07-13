/// <reference types="cypress" />

describe('QuipuSwap Opportunities section', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_RedirectToSwapPage_When_ClickingOnStartTradingButton', () => {
    //'Start Trading' button should lead to the swap page, tez, quipu tokens are selected
    cy.get('[data-test-id="QSOpportunitiesSection"] [data-test-id="QSOpportunitiesButton-0"]').click();
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="from"] [data-test-id="changeToken"]')
      .should('contain', 'TEZ');
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="to"] [data-test-id="changeToken"]')
      .should('contain', 'QUIPU');
    cy.get('[data-test-id="swapPageTitle"]')
      .should('contain', 'Swap TEZ / QUIPU');
  });

  it('Should_RedirectToLiquidityPage_When_ClickingOnAddLiquidityButton', () => {
    //'Add Liquidity button on the home page leads to the Liquidity page, tez, quipu token are selected
    cy.get('[data-test-id="QSOpportunitiesSection"] [data-test-id="QSOpportunitiesButton-2"]').click();
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="addLiquidityTokenA"] [data-test-id="tokenSelectButton"]')
      .should('contain', 'TEZ');
    cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="addLiquidityTokenB"] [data-test-id="tokenSelectButton"]')
      .should('contain', 'QUIPU');
  });

  it('Should_RedirectToFarmingPage_When_ClickingOnStartFarmingButton', () => {
    cy.get('[data-test-id="QSOpportunitiesSection"] [data-test-id="QSOpportunitiesButton-1"]').click();
    cy.get('[data-test-id="farmingListPageTitle"]').should('contain', 'Farming');
  });
});
