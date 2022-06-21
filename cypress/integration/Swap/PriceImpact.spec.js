/// <reference types="cypress" />

describe('Check color of the smile in the Exchange Details section', () => {
    it('Should_DisplayRedTextInPriceImpact_When_TooBigAmount', () => {
        // Go to the swap page 
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.get('[for="swap-send-from"]').click().type('999999');
        cy.get('[data-test-id="priceImpact"] span span')
            .should('have.css', 'color', 'rgb(234, 36, 36)');
    });
    it('Should_DisplayNotification_When_TooBigAmount', () => {
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.get('[for="swap-send-from"]').click().type('999999');
        cy.get('[data-test-id="shouldShowPriceImpactWarning"]')
            .invoke('text')
            .then(text => {
                expect(text).to.contain('Double check the output amount and/or try to split the exchange to the smaller trades.')
            });
    });
    it('Should_DisplayYellowTextInPriceImpact_When_AmountNotOK', () => {
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.get('[for="swap-send-from"]').click().type('888');
        cy.get('[data-test-id="priceImpact"] span span')
            .should('have.css', 'color', 'rgb(249, 166, 5)');
    });
    it('Should_DisplayGreenTextInPriceImpact_When_AmountIs5', () => {
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.get('[for="swap-send-from"]').click().type('5');
        cy.get('[data-test-id="priceImpact"] span span')
            .should('have.css', 'color', 'rgb(46, 211, 62)');
    });
});