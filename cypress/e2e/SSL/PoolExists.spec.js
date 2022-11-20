/// <reference types="cypress" />

describe('Specific pool exist', () => {
  beforeEach(() => {
    cy.visit('/stableswap/liquidity/add/0');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplayLiquidityTitle_When_OpenSpecificPool', () => {
    cy.get('[data-test-id="SSLItemPageTitleAdd"]').should('contain', 'Liquidity KUSD / USDtz / uUSD');
  });
  it('Should_DisplayKusdUusdUsdtzInTheFields_When_OpenSpecificPool', () => {
    cy.get('[data-test-id="tokenInputContainer-0"] [data-test-id="tokenInputSelectButton"]')
      .should('contain', 'KUSD');
    cy.get('[data-test-id="tokenInputContainer-1"] [data-test-id="tokenInputSelectButton"]')
      .should('contain', 'USDtz');
    cy.get('[data-test-id="tokenInputContainer-2"] [data-test-id="tokenInputSelectButton"]')
      .should('contain', 'uUSD');
  });
  // check if 'back to list' arrow works
  it('Should_DisplaySSLList_When_ClickOnBackArrow', () => {
    cy.get('[data-test-id="stableswapFromTabsCard"] [data-test-id="backTTListButton"]').click();
    cy.get('[data-test-id="SSLPageTitle"]').should('contain', 'Stableswap Liquidity');
  });
});
