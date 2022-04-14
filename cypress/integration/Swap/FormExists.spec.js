
/// <reference types="cypress" />

describe('Form exists', () => {

    it('Should_DisplayExchangeDetails_When_OpenedSwapPage',() => {
// Go to the swap page from home page
        cy.visit('/')
        cy.get('.Header_menuButton__1G_3l').click()
        cy.get('.Menu_root__10FHU > .Navigation_root__2r3up > [href="/swap"]').click()
       
// Check if Title 'Exchange Details' ok
        cy.get(':nth-child(2) > .Card-module_header__2yfdc')
            .should('contain', 'Exchange Details')
})

//може додати перевірку полей чи там тез квіпу в сел прайс бай прайс?
})


