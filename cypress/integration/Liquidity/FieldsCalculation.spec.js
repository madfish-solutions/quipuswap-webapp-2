/// <reference types="cypress" />

describe('Input fields are recalculating after entering in another field data', () => {
    before(() => {
        //before each 'it' go to liquidity tab'
        //cy.visit('/liquidity/add/tez-KT19363aZDTjeRyoDkSLZhCk62pS4xfvxo6c_0');
        cy.visit('/');
        cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click();
        cy.get('[data-test-id="menu"] [data-test-id="navigationButton-Liquidity"]').click();
    });
    it('Should_DisplayDataInSecondInput_When_FirstInputIs1', () => {
        cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]')
            .click().type('1');
        cy.wait(3000);
        cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]')
            .invoke('val').then(parseFloat).should('be.gte', 0);
        cy.reload()
    });
    it('Should_DisplayDataInFirstInput_When_SecondInputIs1', () => {
        cy.get('[data-test-id="addLiquidityTokenB"] [data-test-id="addLiquidityTokenB"]')
            .click().type('1');
        cy.wait(3000);
        cy.get('[data-test-id="addLiquidityTokenA"] [data-test-id="addLiquidityTokenA"]')
            .invoke('val').then(parseFloat).should('be.gte', 0);
    });
});
