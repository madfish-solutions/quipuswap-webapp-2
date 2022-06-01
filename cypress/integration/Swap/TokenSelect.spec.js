/// <reference types="cypress" />

describe('Select new tokens in the fields', () => {
    it('Should_DisplayNewTokens_When_SelectIt', () => {
        // Go to the swap page 
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        // Choose new tokens and check if new token are selected in the field
        cy.get('[data-test-id="from"] [data-test-id="changeToken"]').click();
        cy.get('[data-test-id="KUSD"]').click();
        cy.get('[data-test-id="from"] [data-test-id="changeToken"]').should('contain', 'KUSD');

        cy.get('[data-test-id="to"] [data-test-id="changeToken"]').click();
        cy.get('[data-test-id="CRUNCH"]').click();
        cy.get('[data-test-id="to"] [data-test-id="changeToken"]').should('contain', 'CRUNCH');
    });
    it('Should_DisplayNewTitle_When_NewTokenAreSelected', () => {
        // Check if title of the page is ok
        cy.get('[data-test-id="swapPageTitle"]').should('contain', 'Swap KUSD / CRUNCH');
    });
    it('Should_DisplayNewInfoInExchangeDetailsSection_When_NewTokenAreSelected', () => {
        // Check if title of the page is ok
        cy.get('[data-test-id="sellPrice"] [data-test-id="rightVisibleCurrency"]').should('contain', 'KUSD');
        cy.get('[data-test-id="sellPrice"] [data-test-id="rightVisibleCurrency"]').should('contain', 'CRUNCH');
        cy.get('[data-test-id="buyPrice"] [data-test-id="rightVisibleCurrency"]').should('contain', 'KUSD');
        cy.get('[data-test-id="buyPrice"] [data-test-id="rightVisibleCurrency"]').should('contain', 'CRUNCH');
    });
    it('Should_ChangeToken_When_ClickOnSwapArrow', () => {
        // Check if right token are selected
        cy.get('[data-test-id="swapButton"]').click();
        cy.get('[data-test-id="from"] [data-test-id="changeToken"]').should('contain', 'CRUNCH');
        cy.get('[data-test-id="to"] [data-test-id="changeToken"]').should('contain', 'KUSD');
    });
});