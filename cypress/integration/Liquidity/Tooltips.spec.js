/// <reference types="cypress" />

describe('Tooltips', () => {
                
    it('Should_DisplayTooltips_When_HowerMouseOverTheTooltipIcons',() => {
    cy.visit('/liquidity/add/tez-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0')

    cy.get(':nth-child(1) > .CardCell-module_header__3h12j > .tooltip_wrapper__2x_KN')
        .trigger('focus')
    cy.get('[aria-describedby="tippy-1"]')
        .should('be.visible')

    cy.get(':nth-child(2) > .CardCell-module_header__3h12j > .tooltip_wrapper__2x_KN')
        .trigger('focus')
    cy.get('[aria-describedby="tippy-2"]')
    
    cy.get(':nth-child(3) > .CardCell-module_header__3h12j > .tooltip_wrapper__2x_KN')
        .trigger('focus')
    cy.get('[aria-describedby="tippy-3"]')
        .should('be.visible')

    cy.get(':nth-child(4) > .CardCell-module_header__3h12j > .tooltip_wrapper__2x_KN')
        .trigger('focus')
    cy.get('[aria-describedby="tippy-4"]')
        .should('be.visible')

    cy.get(':nth-child(5) > .CardCell-module_header__3h12j > .tooltip_wrapper__2x_KN')
        .trigger('focus')
    cy.get('[aria-describedby="tippy-5"]')
        .should('be.visible')

    cy.get(':nth-child(6) > .CardCell-module_header__3h12j > .tooltip_wrapper__2x_KN')
        .trigger('focus')
    cy.get('[aria-describedby="tippy-6"]')
            .should('be.visible')

})
})