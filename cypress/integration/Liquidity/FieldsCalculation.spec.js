/// <reference types="cypress" />

import { DEFAULT_WAIT_TIMEOUT } from '../../const';

describe('Input fields are recalculating after entering in another field data', () => {
  before(() => {
    cy.visit('/');
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="navigationButton-Liquidity"]').click();
  });
  it('Should_DisplayDataInSecondInput_When_FirstInputIs1', () => {
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]').click().type('1');
    cy.wait(DEFAULT_WAIT_TIMEOUT);
    cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0);
    cy.reload();
  });
  it('Should_DisplayDataInFirstInput_When_SecondInputIs1', () => {
    cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]').click().type('1');
    cy.wait(DEFAULT_WAIT_TIMEOUT);
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0);
  });
});
