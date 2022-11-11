/// <reference types="cypress" />

describe('Tooltips in the card', () => {
  it('Should_DisplayTooltips_When_HoweringMouseOver', () => {
    cy.visit('/coinflip');
    cy.get('[data-test-id="acceptCookieButton"]').click();

    cy.get('[data-test-id="coinflipPayoutCoefficient"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-1"]').should('be.visible');

    cy.get('[data-test-id="coinflipBank"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-2"]').should('be.visible');

    cy.get('[data-test-id="coinflipTotalWins"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-3"]').should('be.visible');

    cy.get('[data-test-id="coinflipGamesCount"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-4"]').should('be.visible');

    cy.get('[data-test-id="coinflipGameId"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-5"]').should('be.visible');

    cy.get('[data-test-id="coinflipBetSize"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-6"]').should('be.visible');

    cy.get('[data-test-id="coinflipRewardSize"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-7"]').should('be.visible');

    cy.get('[data-test-id="coinflipGameResult"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-8"]').should('be.visible');
  });
});
