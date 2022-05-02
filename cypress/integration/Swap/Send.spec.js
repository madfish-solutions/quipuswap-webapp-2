/// <reference types="cypress" />

describe('Send', () => {
  before(() => {
    //before each 'it' go to send tab'
    cy.visit('/send/tez-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0');
  });
  it('Should_BeElectedSendTab_When_ClickingOnSendTab', () => {
    // check if Send tab is elected, not swap
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
