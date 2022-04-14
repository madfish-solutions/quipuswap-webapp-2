/// <reference types="cypress" />

describe('QUIPU price', () => {

    it('Should_DisplayQuipuPrice_When_PageIsLoaded',() => {
// Go to the home page
        cy.visit('/')
        
// Find Quipu Price  
        cy.get('.Header_menuButton__1G_3l > .button_text__1Sa5- > svg').click()
        cy.get(':nth-child(1) > .QPToken_root__1ayAV > .QPToken_price__1mAv8')
        .should('not.contain', '?')
    })
})