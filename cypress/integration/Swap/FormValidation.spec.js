/// <reference types="cypress" />

import { MAINNET_QUIPU_TOKEN } from '../../const';
import { FIELD_WAIT_TIMEOUT } from '../../const';

describe('Check error notification', () => {
  beforeEach(() => {
    cy.visit('/swap/tez-' + MAINNET_QUIPU_TOKEN);
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.intercept('GET', 'https://metadata.templewallet.com/metadata/' + MAINNET_QUIPU_TOKEN).as('load')
  });
  it('Should_DisplayError_When_FromTokenHaveTooManyDecimals', () => {
    cy.get('[for="swap-send-from"]').click().type('1.33332222221');
    cy.wait(FIELD_WAIT_TIMEOUT);
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="from"] [data-test-id="error"]')
      .invoke('text')
      .then(text => {
        expect(text).to.contain('The precision of TEZ token');
      });
  });
  it('Should_DisplayError_When_AmountOfFromFieldTooBig', () => {
    cy.get('[for="swap-send-from"]').click().type('133332222221');
    cy.wait(FIELD_WAIT_TIMEOUT);
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="from"] [data-test-id="error"]')
      .invoke('text')
      .then(text => {
        expect(text).to.contain('Value has to be a number between 0.000001');
      });
  });
  it('Should_DisplayError_When_FieldIsEmpty', () => {
    cy.get('[for="swap-send-from"]').click().type('1').type('{backspace}');
    cy.wait(FIELD_WAIT_TIMEOUT);
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="from"] [data-test-id="error"]')
      .invoke('text')
      .then(text => {
        expect(text).to.contain('This field is required');
      });
  });
});
