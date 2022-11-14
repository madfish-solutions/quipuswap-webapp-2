/// <reference types="cypress" />

import { MAINNET_QUIPU_TOKEN } from '../../const';

describe('Check color of the smile in the Exchange Details section', () => {
  beforeEach(() => {
    cy.visit('/swap/tez-' + MAINNET_QUIPU_TOKEN);
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_DisplayRedTextInPriceImpact_When_TooBigAmount', () => {
    cy.get('[for="swap-send-from"]').click().type('9999');
    cy.get('[data-test-id="priceImpact"] span span')
      .should('have.css', 'color', 'rgb(234, 36, 36)');
  });
  it('Should_DisplayYellowTextInPriceImpact_When_AmountNotOK', () => {
    cy.get('[data-test-id="from"] [data-test-id="input"]').click().type('555');
    cy.get('[data-test-id="priceImpact"] span span')
      .should('have.css', 'color', 'rgb(249, 166, 5)');
  });
  it('Should_DisplayGreenTextInPriceImpact_When_AmountIs5', () => {
    cy.get('[data-test-id="from"] [data-test-id="input"]').click().type('5');
    cy.get('[data-test-id="priceImpact"] span span')
      .should('have.css', 'color', 'rgb(46, 211, 62)');
  });
});
