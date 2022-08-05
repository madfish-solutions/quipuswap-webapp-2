/// <reference types="cypress" />

import { DEFAULT_WAIT_TIMEOUT } from '../../const';

describe('Input fields are recalculating after entering in another field data', () => {
  beforeEach(() => {
    cy.visit('/stableswap/liquidity/add/3');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplayDataInSecondInput_When_FirstInputIs1', () => {
    cy.get('[id="stableswap-input-0"]').click().type('1');
    cy.wait(DEFAULT_WAIT_TIMEOUT)
    cy.get('[id="stableswap-input-1"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0)
    cy.reload();
  });
  it('Should_DisplayDataInThirdInput_When_FirstInputIs1', () => {
    cy.get('[id="stableswap-input-0"]').click().type('1');
    cy.wait(DEFAULT_WAIT_TIMEOUT)
    cy.get('[id="stableswap-input-2"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0)
    cy.reload();
  });
  it('Should_DisplayDataInFirstInput_When_ThirdInputIs1', () => {
    cy.get('[id="stableswap-input-2"]').click().type('1');
    cy.wait(DEFAULT_WAIT_TIMEOUT)
    cy.get('[id="stableswap-input-0"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.gte', 0)
    cy.reload();
  });
  it('Should_NotDisplayDataInSecondInput_When_FirstInputIs1SwithcerIsOff', () => {
    cy.contains('Add all coins in a balanced proportion').prev().click();
    cy.get('[id="stableswap-input-0"]').click().type('1');
    cy.wait(DEFAULT_WAIT_TIMEOUT)
    cy.get('[id="stableswap-input-1"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.NaN')
    cy.reload();
  });
  it('Should_NotDisplayDataInFirstInput_When_SecondInputIs1SwithcerIsOff', () => {
    cy.contains('Add all coins in a balanced proportion').prev().click();
    cy.get('[id="stableswap-input-1"]').click().type('1');
    cy.wait(DEFAULT_WAIT_TIMEOUT)
    cy.get('[id="stableswap-input-0"]')
      .invoke('val')
      .then(parseFloat)
      .should('be.NaN')
    cy.reload();
  });
});
