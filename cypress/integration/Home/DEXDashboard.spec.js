/// <reference types="cypress" />

describe('DEX Dashboard section', () => {
  it('Should_DisplayTooltips_When_HowerMouseOverTheTooltipIcons', () => {
    cy.visit('/');
    // tooltip is ok
    cy.get('[data-test-id="DEXDashboardDesktop"] [data-test-id="totalSupply"] [data-test-id="tooltip"]').trigger(
      'focus'
    );
    cy.get('[aria-describedby="tippy-3"]').should('be.visible');
    //next part when analytics will work
    // cy.get('[aria-describedby="tippy-7"]')
    // .should('be.visible')
  });
  it.skip('Should_DisplayStatisticInfo_When_PageIsLoaded', () => {
    // cy.get('[data-test-id="DEXDashboardDesktop"] [data-test-id="TVL"] [data-test-id="amount"]')
    //     .should('exist')
    // cy.get('[data-test-id="DEXDashboardDesktop"] [data-test-id="dailyVolume"] [data-test-id="amount"]')
    //     .should('exist')

    // cy.get('[data-test-id="DEXDashboardDesktop"] [data-test-id="dailyTransaction"] [data-test-id="amount"]')
    //     .should('exist')

    cy.get('[data-test-id="DEXDashboardDesktop"] [data-test-id="totalSupply"] [data-test-id="amount"]').should('exist');
  });
});
