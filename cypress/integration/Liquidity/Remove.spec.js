
/// <reference types="cypress" />

describe('Form exists', () => {

    it('Should_DisplayExchangeDetails_When_OpenedLiquidityPage',() => {
// Go to the remove page from home page
        cy.visit('/')
        cy.get('.Header_menuButton__1G_3l').click()
        cy.get('.Menu_root__10FHU > .Navigation_root__2r3up > [href="/liquidity/add"]').click()
        cy.get('[title="Remove"] > .Tabs-module_inner__WuTBz').click()
       
// Check if Title 'Pool Details' ok
        cy.get('.Liquidity_poolDetailsHeader_Title__1pcE0')
            .should('contain', 'Pool Details')
        cy.get(':nth-child(1) > .CardCell-module_header__3h12j')
            .should('contain','Pair Address')
})
    it('Should_DisplayPageTitle_When_OpenedLiquidityPage',() => {
        cy.get('.page-title_pageTitle__2SlXy')
            .should('contain','Liquidity')
    })
    it('Should_HaveTezQuipuPair_When_PageIsLoaded',() => {
        cy.get(':nth-child(1) > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
            .should('contain','TEZ / QUIPU')
    })
    it('Should_HaveSelectedRemoveTab_When_OpenedRemoveTab', () => {
        cy.get('[class="Tabs-module_item__2u87t Tabs-module_active__GDgMC"]').should('contain','Remove')
    })
})