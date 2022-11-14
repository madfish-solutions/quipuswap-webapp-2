/// <reference types="cypress" />

describe('Select new tokens in the fields', () => {
  beforeEach(() => {
    cy.visit('/swap/KT1K9gCRgaLRFKTErYt1wVxA3Frb9FjasjTV-KT1BHCumksALJQJ8q8to2EPigPW6qpyTr7Ng_0');
    cy.waitUntil(() => (cy.get('[data-test-id="from"] [data-test-id="changeToken"]')
      .invoke('text').then((text) => text === 'KUSD')))
  });
  it('Should_DisplayNewTokens_When_SelectIt', () => {
    cy.get('[data-test-id="to"] [data-test-id="changeToken"]')
      .should('contain', 'CRUNCH');
  });
  it('Should_DisplayNewTitle_When_NewTokenAreSelected', () => {
    cy.get('[data-test-id="swapPageTitle"]').should('contain', 'Swap KUSD / CRUNCH');
  });
  it('Should_DisplayNewInfoInExchangeDetailsSection_When_NewTokenAreSelected', () => {
    cy.get('[data-test-id="sellPrice"] [data-test-id="rightVisibleCurrency"]')
      .should('contain', 'KUSD');
    cy.get('[data-test-id="sellPrice"] [data-test-id="rightVisibleCurrency"]')
      .should('contain', 'CRUNCH');
    cy.get('[data-test-id="buyPrice"] [data-test-id="rightVisibleCurrency"]')
      .should('contain', 'KUSD');
    cy.get('[data-test-id="buyPrice"] [data-test-id="rightVisibleCurrency"]')
      .should('contain', 'CRUNCH');
  });
  it('Should_ChangeToken_When_ClickOnSwapArrow', () => {
    cy.get('[data-test-id="swapButton"]').click();
    cy.get('[data-test-id="from"] [data-test-id="changeToken"]')
      .should('contain', 'CRUNCH');
    cy.get('[data-test-id="to"] [data-test-id="changeToken"]')
      .should('contain', 'KUSD');
  });
});
