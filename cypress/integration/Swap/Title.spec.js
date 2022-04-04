/// <reference types="cypress" />

describe('Title', () => {

    it('Should_DisplayCorrectTitle_When_OpenedSwapPage',() => {
// Go to the swap page from home page
        cy.visit('/')
        cy.get('.Header_menuButton__1G_3l').click()
        cy.get('.Menu_root__10FHU > .Navigation_root__2r3up > [href="/swap"]').click()
       
// Check if title correct
        cy.get('.page-title_pageTitle__2SlXy')
            .should('contain', 'Swap TEZ / QUIPU')
})

    it('Should_DisplayTezInFromForm_When_PageIsLoaded', () => {
        cy.get(':nth-child(1) > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
            .should('contain', 'TEZ')
    })
    it('Should_DisplayQuipuInToForm_When_PageIsLoaded', () => {
        cy.get('.CommonContainer_mb24__2k7_w > .ComplexInput_background__3fPBh > .ComplexInput_shape__3J290 > .ComplexInput_dangerContainer__143vX > .ComplexInput_item4__3oWBt > .button_text__1Sa5- > .ComplexInput_token__ZYlsp')
            .should('contain', 'QUIPU')
    })
})
