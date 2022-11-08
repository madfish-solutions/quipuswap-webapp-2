/// <reference types="cypress" />

describe('List Form exists', () => {
  beforeEach(() => {
    cy.visit('/stableswap/dividends');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplaySSDPage_When_OpenedLoadIt', () => {
    cy.get('[data-test-id="stableDividendsPageTitle"]').should('contain', 'Stableswap Dividends');
  });
  it('Should_DisplayTVL_When_PageIsLoaded', () => {
    cy.get('[data-test-id="dashboard-card-header"]').should('contain', 'Total Value Locked')
  });
  it('Should_DisplayWalletInfoSection_When_PageIsLoaded', () => {
    cy.get('[data-test-id="earnExtraIncome"]').should('contain', 'Earn extra income with QuipuSwap')
  });
  it('Should_DisplayFirstPool_When_PageIsLoaded', () => {
    cy.get('[data-test-id="stable-dividends-item-2"]').should('exist')
  });
});
