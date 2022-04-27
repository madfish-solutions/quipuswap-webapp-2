/// <reference types="cypress" />

describe('Tooltips', () => {
                
    it('Should_DisplayTooltips_When_HowerMouseOverTheTooltipIcons',() => {
    cy.visit('/liquidity/add/tez-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0')

    cy.get('[data-test-id="poolDetails"] [data-test-id="pairAddress"] [data-test-id="tooltip"]')
        .trigger('focus')
    cy.get('[aria-describedby="tippy-1"]')
        .should('be.visible')

    cy.get('[data-test-id="poolDetails"] [data-test-id="pairId"] [data-test-id="tooltip"]')
        .trigger('focus')
    cy.get('[aria-describedby="tippy-2"]')
    
    cy.get('[data-test-id="poolDetails"] [data-test-id="sellPrice"] [data-test-id="tooltip"]')
        .trigger('focus')
    cy.get('[aria-describedby="tippy-3"]')
        .should('be.visible')

    cy.get('[data-test-id="poolDetails"] [data-test-id="buyPrice"] [data-test-id="tooltip"]')
        .trigger('focus')
    cy.get('[aria-describedby="tippy-4"]')
        .should('be.visible')

    cy.get('[data-test-id="poolDetails"] [data-test-id="tokenALocked"] [data-test-id="tooltip"]')
        .trigger('focus')
    cy.get('[aria-describedby="tippy-5"]')
        .should('be.visible')

    cy.get('[data-test-id="poolDetails"] [data-test-id="tokenBLocked"] [data-test-id="tooltip"]')
        .trigger('focus')
    cy.get('[aria-describedby="tippy-6"]')
            .should('be.visible')

})
})