/// <reference types="cypress" />

describe('Tooltips', () => {
  it('Should_DisplayTooltips_When_HowerMouseOverTheTooltipIcons', () => {
    cy.visit('/voting/vote/tez-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0');
    cy.get('[data-test-id="acceptCookieButton"]').click();

    cy.get('[data-test-id="votingStats"] [data-test-id="yourLP"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-1"]').should('be.visible');

    cy.get('[data-test-id="votingStats"] [data-test-id="yourVotes"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-2"]');

    cy.get('[data-test-id="votingStats"] [data-test-id="yourVetos"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-3"]').should('be.visible');

    cy.get('[data-test-id="votingDetails"] [data-test-id="delegatedTo"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-4"]').should('be.visible');

    cy.get('[data-test-id="votingDetails"] [data-test-id="secondCandidate"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-5"]').should('be.visible');

    cy.get('[data-test-id="votingDetails"] [data-test-id="totalVotes"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-6"]').should('be.visible');

    cy.get('[data-test-id="votingDetails"] [data-test-id="totalVetos"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-7"]').should('be.visible');

    cy.get('[data-test-id="votingDetails"] [data-test-id="yourCandidate"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-8"]').should('be.visible');

    cy.get('[data-test-id="votingDetails"] [data-test-id="votesToVetoLeft"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-9"]').should('be.visible');
  });
});
