/// <reference types="cypress" />

describe('Check error notification', () => {
    it('Should_DisplayError_When_FromTokenHaveTooManyDecimals', () => {
        // Go to the swap page 
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.get('[for="swap-send-from"]').click().type('1.33332222221');
        cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="from"] [data-test-id="error"]')
            .invoke('text')
            .then(text => {
                expect(text).to.contain('The precision of TEZ token')
            })
    });
    it('Should_DisplayError_When_AmountOfFromFieldTooBig', () => {
        // Go to the swap page 
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.get('[for="swap-send-from"]').click().type('133332222221');
        cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="from"] [data-test-id="error"]')
            .invoke('text')
            .then(text => {
                expect(text).to.contain('Value has to be a number between 0.000001')
            })
    });
    it('Should_DisplayError_When_FieldIsEmpty', () => {
        // Input data in the From field and delete it. It should be notification that field is required
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.get('[for="swap-send-from"]').click().type('1').type('{backspace}');
        cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="from"] [data-test-id="error"]')
            .invoke('text')
            .then(text => {
                expect(text).to.contain('This field is required')
            })
    }); 
});