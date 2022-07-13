/// <reference types="cypress" />
import { FIELD_WAIT_TIMEOUT } from '../../const';

describe('Check input fields', () => {
    beforeEach(() => {
        cy.visit('/swap');
        cy.get('[data-test-id="acceptCookieButton"]').click();
    });
    it('Should_CalculateToField_When_FromFieldIsFilled', () => {
        cy.get('[for="swap-send-from"]').click().type('1');
        cy.wait(FIELD_WAIT_TIMEOUT);
        cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="to"] [data-test-id="input"]')
            .invoke('val').then(parseFloat).should('be.gte', 0);
    });
    it.skip('Should_CalculateFromField_When_ToFieldIsFilled', () => {
        cy.get('[data-test-id="to"]').click().type('1');
        cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="from"] [data-test-id="input"]')
            .invoke('val').then(parseFloat).should('be.gte', 0);
    });
});