/// <reference types="cypress" />

import { DEFAULT_WAIT_TIMEOUT } from '../../const';

describe('Input fields are recalculating after entering in another field data', () => {
  beforeEach(() => {
    cy.visit('/stableswap/liquidity/remove/2');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplayDataInOutput_When_InputIs1', () => {
    cy.get('[id="lp-input"]').click().type('1');
    cy.wait(DEFAULT_WAIT_TIMEOUT)
    cy.get('[id="stableswap-input-0"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0)
    cy.get('[id="stableswap-input-1"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0)
    cy.reload();
  });
  it('Should_DisplayDataInInput_When_OutputIs1', () => {
    cy.get('[id="stableswap-input-1"]').click().type('1');
    cy.wait(DEFAULT_WAIT_TIMEOUT)
    cy.get('[id="lp-input"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0)
    cy.get('[id="stableswap-input-0"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0)
    cy.reload();
  });
  it('Should_NotDisplayDataInOutput_When_OutputIs1SwithcerIsOff', () => {
    cy.contains('Remove all coins in a balanced proportion').prev().click();
    cy.get('[id="stableswap-input-0"]').click().type('1');
    cy.wait(DEFAULT_WAIT_TIMEOUT)
    cy.get('[id="stableswap-input-1"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.NaN')
    cy.reload();
  });
});
