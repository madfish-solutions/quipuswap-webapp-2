/// <reference types="cypress" />

describe('Form exists', () => {
    before(() => {
        // Go to the remove page from home page
        cy.visit('/');
        cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
        cy.get('[data-test-id="menu"] [data-test-id="navigationButton-Liquidity"]').click();
        cy.get('[data-test-id="liquidityPageTokenSelect"] [data-test-id="cardTab-1"]').click();
    });
    it('Should_DisplayOutputFields_When_InputIs1', () => {
        cy.get('[data-test-id="positionSelectInput"]').click().type('1');
        cy.wait();
        cy.get('[data-test-id="outputA"] [data-test-id="outputA"]').invoke('val').then(parseFloat).should('be.gte', 0);
    });
    it('Should_HaveTezQuipuPair_When_PageIsLoaded', () => {

    });
});
