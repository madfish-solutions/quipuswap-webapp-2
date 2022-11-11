/// <reference types="cypress" />

describe('Tooltips', () => {
  beforeEach(() => {
    cy.visit('/stableswap/liquidity/add/0');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it.skip('Should_DisplayTooltips_When_HowerMouseOverTheTooltipIcons', () => {
    cy.get('[data-test-id="tvlInUsd"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-1"]').should('be.visible');
    cy.get('[data-test-id="totalLpSupply"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-2"]').should('be.visible');
    cy.get('[data-test-id="feesRate"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-3"]').should('be.visible');
    cy.get('[need selector] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-4"]').should('be.visible');
  });
});
