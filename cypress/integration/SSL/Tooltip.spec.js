/// <reference types="cypress" />

describe('Tooltips', () => {
  beforeEach(() => {
    cy.visit('/stableswap/liquidity');
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.get('[data-test-id="farming-item-0"]').click();
  });
  it('Should_DisplayTooltips_When_HowerMouseOverTheTooltipIcons', () => {
    cy.get('[data-test-id="tvlInUsd"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-24"]').should('be.visible');
    cy.get('[data-test-id="totalLpSupply"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-25"]').should('be.visible');
    cy.get('[data-test-id="feesRate"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-26"]').should('be.visible');
  });
});
