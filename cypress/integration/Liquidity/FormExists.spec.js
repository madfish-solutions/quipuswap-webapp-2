/// <reference types="cypress" />

describe('Form exists', () => {

    it('Should_DisplayExchangeDetails_When_OpenedSwapPage',() => {
// Go to the swap page from home page
        cy.visit('/')
        cy.get('.Header_menuButton__1G_3l').click()
        cy.get('.Menu_root__10FHU > .Navigation_root__2r3up > [href="/liquidity/add"]').click()
       
// Check if Title 'Pool Details' ok
        cy.get('.Liquidity_poolDetailsHeader_Title__1pcE0')
            .should('contain', 'Pool Details')
})

})
