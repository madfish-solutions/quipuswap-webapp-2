/// <reference types="cypress" />
import { FIELD_WAIT_TIMEOUT } from '../../const';

describe('Check input fields', () => {
    it('Should_CalculateToField_When_FromFieldIsFilled', () => {
        // Go to the swap page 
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.get('[for="swap-send-from"]').click().type('1');
        cy.wait(FIELD_WAIT_TIMEOUT);
        cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="to"] [data-test-id="input"]')
            .invoke('val').then(parseFloat).should('be.gte', 0);
    });
    it.skip('Should_CalculateFromField_When_ToFieldIsFilled', () => {
        // Go to the swap page 
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
        cy.get('[data-test-id="to"]').click().type('1');
        cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="from"] [data-test-id="input"]')
            .invoke('val').then(parseFloat).should('be.gte', 0);
    });
});