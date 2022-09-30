/// <reference types="cypress" />

describe('Form exists', () => {
  beforeEach(() => {
    cy.visit('/stableswap/dividends/stake/0');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplaySSDPage_When_OpenedLoadIt', () => {
    cy.get('[data-test-id="stableDividendsStakePageTitle"]').should('contain', 'KUSD / USDtz / uUSD');
  });
  it('Should_DisplayWalletSection_When_PageIsLoaded', () => {
    cy.get('[data-test-id="earnExtraIncome"]').should('contain', 'Earn extra income with QuipuSwap')
  });
  it('Should_DisplayYourShare_When_PageIsLoaded', () => {
    cy.get('[data-test-id="stableDividendsStatsItemName"]').should('contain', 'Your Share')
  });
  it('Should_DisplayStakeDetailsSection_When_PageIsLoaded', () => {
    cy.get('[data-test-id="stableswapDetails"] [data-test-id="headerContent"]').should('contain', 'Stake Details')
  });
});
