/// <reference types="cypress" />

import { FIELD_WAIT_TIMEOUT } from '../../const';
import { MAINNET_QUIPU_TOKEN } from '../../const';

describe('Title', () => {
  beforeEach(() => {
    cy.visit('/swap/tez-' + MAINNET_QUIPU_TOKEN);
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.wait(FIELD_WAIT_TIMEOUT)
  });
  it('Should_DisplayCorrectTitle_When_OpenedSwapPage', () => {
    cy.get('[data-test-id="swapPageTitle"]').should('contain', 'Swap TEZ / QUIPU');
  });
  it('Should_DisplayTezInFromForm_When_PageIsLoaded', () => {
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="from"] [data-test-id="changeToken"]')
      .should('contain', 'TEZ');
  });
  it('Should_DisplayQuipuInToForm_When_PageIsLoaded', () => {
    cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="to"] [data-test-id="changeToken"]')
      .should('contain', 'QUIPU');
  });
});
