/// <reference types="cypress" />

import { MAINNET_QUIPU_TOKEN } from '../../const';

describe('Send', () => {
  beforeEach(() => {
    cy.visit('/swap/tez-' + MAINNET_QUIPU_TOKEN);
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="cardTab-1"]').click();
});
  it('Should_BeElectedSendTab_When_ClickingOnSendTab', () => {
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="cardTab-0"]').click();
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="cardTab-1"]').click();
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="recipientTitle"]').should('exist');
    cy.get('[title="Send"]').should('contain', 'Send');
  });
  // Check if From/to tez/quipu
  it('Should_DisplayTezInFromForm_When_PageIsLoaded', () => {
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="from"] [data-test-id="changeToken"]').should(
      'contain',
      'TEZ'
    );
  });
  it('Should_DisplayQuipuInToForm_When_PageIsLoaded', () => {
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="to"] [data-test-id="changeToken').should(
      'contain',
      'QUIPU'
    );
  });
  //field recepient address exists
  it('Should_HaveFieldRecepientAddress_When_SendTabIsLoaded', () => {
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="recipientTitle"]').should(
      'contain',
      'Recipient address'
    );
  });
});
