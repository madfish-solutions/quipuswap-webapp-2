/// <reference types="cypress" />

describe('Title', () => {

    it('Should_DisplayCorrectTitle_When_OpenedSwapPage',() => {
// Go to the swap page from home page
        cy.visit('/')
        cy.get('[data-test-id="header"] [data-test-id="menuButton"]').click()
        cy.get('[data-test-id="menu"] [data-test-id="navigationButton-1"]').click()
       
// Check if title correct
        cy.get('[data-test-id="swapPageTitle"]')
            .should('contain', 'Swap TEZ / QUIPU')
})

    it('Should_DisplayTezInFromForm_When_PageIsLoaded', () => {
        cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="from"] [data-test-id="changeToken"]')
            .should('contain', 'TEZ')
    })
    it('Should_DisplayQuipuInToForm_When_PageIsLoaded', () => {
        cy.get('[data-test-id="swapPageTokenSelect"] [data-test-id="to"] [data-test-id="changeToken"]')
            .should('contain', 'QUIPU')
    })
})
