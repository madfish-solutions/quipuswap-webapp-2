/// <reference types="cypress" />

describe('Veto', () => {
  beforeEach(() => {
    cy.visit('/voting/vote/tez-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0');
    cy.get('[data-test-id="votingTokenSelect"] [data-test-id="cardTab-1"]').click();
  });
  it('Should_HaveElectedVetoTab_When_ClickingOnVetoTab', () => {
    // check if Veto tab is selected
    cy.get('[data-test-id="votingTokenSelect"] [data-test-id="cardTab-1"]').should('contain', 'Veto');
  });

  it('Should_HaveTezQuipuInTheField_When_PageIsLoaded', () => {
    cy.get(
      '[data-test-id="votingTokenSelect"] [data-test-id="positionSelectInput"] [data-test-id="selectLPButton"]'
    ).should('contain', 'TEZ / QUIPU');
  });

  it('Should_HaveSelectedVeto_When_PageIsLoaded', () => {
    cy.get('[data-test-id="votingTokenSelect"] [data-test-id="cardTab-1"]')
      .click()
      .should('have.css', 'color', 'rgb(139, 144, 160)');
  });
});
