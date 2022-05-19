/// <reference types="cypress" />

describe('Check error notification', () => {
    it('Should_DisplayError_When_FromTokenHaveTooManyDecimals', () => {
        // Go to the swap page 
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.get('[for="swap-send-from"]').click().type('1.2222221');

        //next string should change to correct selector, when it will be
        cy.get('[class="ComplexInput_errorLabel__OA4q3"]')
        .invoke('text').should('contains', 'The precision of TEZ token');
    });
});