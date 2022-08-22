/// <reference types="cypress" />

describe('Tooltips', () => {
  beforeEach(() => {
    cy.visit('/stableswap/liquidity');
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.get('[data-test-id="farming-item-0"]').click();
  });
  it('Should_DisplayTooltips_When_HowerMouseOverTheTooltipIcons', () => {
    cy.get('[data-test-id="pairAddress"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-20"]').should('be.visible');
    cy.get('[data-test-id="pairId"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-21"]').should('be.visible');
    cy.get('[data-test-id="tvl"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-22"]').should('be.visible');

    cy.contains('[data-test-id="cellName"]', 'Token KUSD locked')
      .parents('h6').find('[data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-29"]').should('be.visible');

    cy.contains('[data-test-id="cellName"]', 'Token USDtz locked')
      .parents('h6').find('[data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-30"]').should('be.visible');

    cy.contains('[data-test-id="cellName"]', 'Token uUSD locked')
      .parents('h6').find('[data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-31"]').should('be.visible');

    cy.contains('[data-test-id="cellName"]', 'Total LP Supply')
      .parents('h6').find('[data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-23"]').should('be.visible');

    cy.get('[data-test-id="liquidityProvidersFee"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-24"]').should('be.visible');
    cy.get('[data-test-id="interfaceFee"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-25"]').should('be.visible');
    cy.get('[data-test-id="quipuStakersFee"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-26"]').should('be.visible');
    cy.get('[data-test-id="devFee"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-27"]').should('be.visible');
  });
});
