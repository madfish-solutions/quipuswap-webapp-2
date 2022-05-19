/// <reference types="cypress" />

describe('Check input fields', () => {
    it('Should_CalculateToField_When_FromFieldIsFilled', () => {
        // Go to the swap page 
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.get('[for="swap-send-from"]').click().type('1');

        //next string should change to correct selector, when it will be
        cy.get('[data-test-id="to"] [class="ComplexInput_item3__ue+3C ComplexInput_input__QCsvP"]')
            .invoke('val').then(parseFloat).should('be.gte', 0);
    });
    it('Should_CalculateFromField_When_ToFieldIsFilled', () => {
        // Go to the swap page 
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.get('[data-test-id="to"]').click().type('1');

        //next string should change to correct selector, when it will be
        cy.get('[data-test-id="from"] [class="ComplexInput_item3__ue+3C ComplexInput_input__QCsvP"]')
            .invoke('val').then(parseFloat).should('be.gte', 0);
    });
});