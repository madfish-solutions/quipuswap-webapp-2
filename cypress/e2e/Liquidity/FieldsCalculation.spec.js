/// <reference types="cypress" />

describe.skip('Input fields are recalculating after entering in another field data', () => {
  beforeEach(() => {
    cy.visit('/liquidity');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplayDataInSecondInput_When_FirstInputIs1', () => {
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]').click().type('1');
    cy.waitUntil(() => (cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]')
    .invoke('val').then(parseFloat).then((val) => !Number.isNaN(val))))
    cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0)
    cy.reload();
  });
  it('Should_DisplayDataInFirstInput_When_SecondInputIs1', () => {
    cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]').click().type('1');
    cy.waitUntil(() => (cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]')
    .invoke('val').then(parseFloat).then((val) => !Number.isNaN(val))))
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0);
  });
});
