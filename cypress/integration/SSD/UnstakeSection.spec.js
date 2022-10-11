/// <reference types="cypress" />

describe('Unstake section', () => {
  beforeEach(() => {
    cy.visit('/stableswap/dividends/stake/0');
    cy.get('[data-test-id="acceptCookieButton"]').click();
  });
  it('Should_OpenUnstakeSection_When_ClickingOnIt', () => {
    cy.get('[data-test-id="cardTab-1"]').click()
    cy.get('[data-test-id="cardTab-1"]').should('have.css', 'color', 'rgb(139, 144, 160)');
  });
  it('Should_DisplayDataInTheInputFIeld_When_Typing1InIt', () => {
    cy.get('[id="stake-form"]').click().type(1);
    cy.get('[id="stake-form"]').should('have.value', '1')
  });
});
