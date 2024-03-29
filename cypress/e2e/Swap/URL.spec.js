/// <reference types="cypress" />

import { MAINNET_QUIPU_TOKEN } from '../../const';

describe('URL', () => {
  it('Should_DisplayCorrectURL_When_OpenedSwapPage', () => {
    // Go to the swap page from home page
    cy.visit('/');
    cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
    cy.get('[data-test-id="menu"] [data-test-id="navigationButton-Swap"]').click();
    // Check if url correct
    cy.url().should('include', 'swap/tez-' + MAINNET_QUIPU_TOKEN);
  });
});
