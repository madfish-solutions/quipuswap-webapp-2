
/// <reference types="cypress" />

describe('URL', () => {

    it('Should_DisplayCorrectURL_When_OpenedSwapPage',() => {
// Go to the swap page from home page
        cy.visit('/')
        cy.get('.Header_menuButton__1G_3l').click()
        cy.get('.Menu_root__10FHU > .Navigation_root__2r3up > [href="/swap"]').click()
       
// Check if url correct
cy.url().should('include', 'swap/tez-KT193D4vozYnhGJQVtw7CoxxqphqUEEwK6Vb_0')
})
})
