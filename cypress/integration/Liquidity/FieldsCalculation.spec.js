/// <reference types="cypress" />

import { notDeepEqual } from 'assert';
import { DEFAULT_WAIT_TIMEOUT } from '../../const';

describe('Input fields are recalculating after entering in another field data', () => {
  before(() => {
    cy.visit('/');
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="navigationButton-Liquidity"]').click();
  });
  it.only('Should_DisplayDataInSecondInput_When_FirstInputIs1', () => {
    // cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]').click().type('1');
    // cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]')
    //   .invoke('val')
    //   .then(parseFloat)
    //   .should('be.gte', 0)
    // cy.reload();

    // cy.waitUntil(() => cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]')
    // .then(value => value != NaN));
    cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]').click().type('1')
  
      cy.waitUntil(() => cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0))

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
