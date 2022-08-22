/// <reference types="cypress" />

import { MAINNET_QUIPU_TOKEN } from '../../const';

describe('Visual testing of the Swap form', () => {
  it.skip('Should_DisplayCorrectSwapInputForm_When_OpenedSwapPage', () => {
    cy.visit('/swap/tez-' + MAINNET_QUIPU_TOKEN);
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.percySnapshot('SwapPagelayout', {
      percyCSS: `
     [data-test-id='quipuTokenPrice'] { display: none; };
     `
    })
  });
});

