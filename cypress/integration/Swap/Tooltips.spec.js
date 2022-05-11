/// <reference types="cypress" />

describe('Tooltips', () => {
  it('Should_DisplayTooltips_When_HowerMouseOverTheTooltipIcons', () => {
    cy.visit('/swap/tez-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0');

    cy.get('[data-test-id="sellPrice"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-1"]').should('be.visible');

    cy.get('[data-test-id="buyPrice"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-2"]').should('be.visible');

    cy.get('[data-test-id="priceImpact"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-3"]').should('be.visible');

    cy.get('[data-test-id="fee"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-4"]').should('be.visible');

    cy.get('[data-test-id="route"] [data-test-id="tooltip"]').trigger('focus');
    cy.get('[aria-describedby="tippy-5"]').should('be.visible');
  });
});
