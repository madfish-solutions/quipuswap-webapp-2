/// <reference types="cypress" />

//export PERCY_TOKEN=d6cef1e901a9a1eb8d6d32030f198e4e4ccc6de92544ce262d2dd5c39eba2aeb 

describe('Visual testing of the Swap form', () => {
  it('Should_DisplayCorrectSwapInputForm_When_OpenedSwapPage', () => {
    cy.visit('/swap/tez-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0');
    cy.get('[data-test-id="acceptCookieButton"]').click();
    cy.percySnapshot('SwapPagelayout', {
      percyCSS: `
     [data-test-id='quipuTokenPrice'] { display: none; };
     `
    })
  });
});

