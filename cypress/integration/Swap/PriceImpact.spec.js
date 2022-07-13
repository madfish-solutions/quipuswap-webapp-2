/// <reference types="cypress" />

describe('Check color of the smile in the Exchange Details section', () => {
    beforeEach(() => {
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
    });
    it('Should_DisplayRedTextInPriceImpact_When_TooBigAmount', () => {
        cy.get('[for="swap-send-from"]').click().type('9999');
        cy.get('[data-test-id="priceImpact"] span span')
            .should('have.css', 'color', 'rgb(234, 36, 36)');
    });
    it('Should_DisplayNotification_When_TooBigAmount', () => {
        cy.get('[for="swap-send-from"]').click().type('567777');
        cy.get('[data-test-id="error"]')
            .invoke('text')
            .then(text => {
                expect(text).to.contain('Value has to be a number between')
            });
    });
    it('Should_DisplayYellowTextInPriceImpact_When_AmountNotOK', () => {
        cy.get('[for="swap-send-from"]').click().type('888');
        cy.get('[data-test-id="priceImpact"] span span')
            .should('have.css', 'color', 'rgb(249, 166, 5)');
    });
    it('Should_DisplayGreenTextInPriceImpact_When_AmountIs5', () => {
        cy.get('[data-test-id="from"] [data-test-id="input"]').click().type('5');
        cy.get('[data-test-id="priceImpact"] span span')
            .should('have.css', 'color', 'rgb(46, 211, 62)');
    });
});